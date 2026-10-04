import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js"
import ErrorHandler from  "../middlewares/errorMiddlewares.js"
import { User } from "../models/userModel.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { sendVerificationCode } from "../utils/sendVerificationCode.js"
import { sendToken } from "../utils/sendToken.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js"

// @ts-ignore
export const register = catchAsyncErrors (async (req, res, next) => {
    try {
        const {name, email, password}=req.body
        if (!name || !email || !password){
            return next(new ErrorHandler("Please enter all fields.", 400))
        }
        const isRegistered = await User.findOne({email, accountVerified: true})
        if (isRegistered){
            return next(new ErrorHandler("User already exists.", 400))
        }
        const registerationAttemptsByUser = await User.find ({
            email,
            accountVerified: false
        })
        if(registerationAttemptsByUser.length >= 30){
            return next(new ErrorHandler("You have exceeded the number of regristration attempts. Please contact support.", 400))
        }
        if(password.length < 8 || password.length > 16 ){
            return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400))
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        })
        // @ts-ignore
        const verificationCode = await user.generateVerificationCode()
        await user.save()
        await sendVerificationCode(verificationCode, email, res)
    } catch (error) {
        next(error)
    }
})

// @ts-ignore
export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
    const {email, otp} = req.body
    if(!email || !otp){
        return next(new ErrorHandler("Email or otp is missing", 400))
    }
    try {
        const userAllEntries = await User.find({
            email,
            accountVerified: false,
        }).sort({ createdAt: -1})
        // @ts-ignore
        if(userAllEntries === 0){
            return next (new ErrorHandler("User not found.", 400))
        }
        let user

        // @ts-ignore
        if(userAllEntries.length > 1){
            user = userAllEntries[0]
            await User.deleteMany({
                // @ts-ignore
                _id: {$ne: user._id},
                email,
                accountVerified: false
            })
        } else {
            user = userAllEntries[0]
        }

        // @ts-ignore
        if(user.verificationCode !== Number(otp)){
            return next (new ErrorHandler("Invalid OTP.", 400))
        }
        const currentTime = Date.now()

        // @ts-ignore
        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime()

        if (currentTime > verificationCodeExpire){
            return next (new ErrorHandler("OTP expired.", 400))
        }

        // @ts-ignore
        user.accountVerfied = true
        // @ts-ignore
        user.verificationCode = null
        // @ts-ignore
        user.verificationCodeExpire = null
        // @ts-ignore
        await user.save({validateModifiedOnly: true})
        sendToken(user, 200, "Account Verified.", res)


    } catch (error) {
        return next(new ErrorHandler("Internal server error.", 500))
    }
})

// @ts-ignore
export const login = catchAsyncErrors(async (req, res, next) => {
    const {email, password} = req.body
    if(!email || !password){
        return next(new ErrorHandler("Please enter all fields.", 400))
    }
    const user = await User.findOne({ email, accountVerified: true}).select("+password")
    if(!user){
        return next(new ErrorHandler("Invalid email or password.", 400))
    }
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password.", 400))
    }
    sendToken(user, 200, "User login successfully.")
})

// @ts-ignore
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(Date.now()),
        httpOnly: true
    }).json({
        success: true,
        message: "Logout successfully."
    })
})

// @ts-ignore
export const getUser = catchAsyncErrors(async (req, res, next) => {
    const user = req.user
    res.status(200).json({
        success: true,
        user,
    })
})

// @ts-ignore
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    if (!req.body.email){
        return next(new ErrorHandler("Email is required.", 400))
    }
    const user =await User.findOne({
        email: req.body.email,
        accountVerified: true
    })
    if(!user){
        return next(new ErrorHandler("Invalid email.", 400))
    }
    // @ts-ignore
    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false})
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl)
    try {
        await sendEmail({
            email: user.email, 
            subject: "Bookworm Library Management Systrm Password Recovery",
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})
        // @ts-ignore
        return next(new ErrorHandler(error.messsage, 500))
    }
})

// @ts-ignore
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const {token} = req.params
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now()}
    })
    if(!user){
        return next(new ErrorHandler("Reset password token is invalid or has been expired.", 400))
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password & confirm password do not match.", 400))
    }
    if(req.body.password.length < 8 || req.body.password.length > 16 
        || req.body.confirmPassword.length < 8 || req.body.confirmPassword .length > 16){
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400))
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, "Password reset successfully", res)
})

// @ts-ignore
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password")
    const {currentPassword, newPassword, confirmNewPassword} = req.body
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return next(new ErrorHandler("Please enter all fields.", 400))
    }
    // @ts-ignore
    const isPasswordMatched = await bcrypt.compare(currentPassword, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Current password is incorrect.", 400))
    }
    if(newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16){
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400))
    }
    if(newPassword !== confirmNewPassword){
        return next(new ErrorHandler("New password and confirm new password do not match.", 400))
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    // @ts-ignore
    user.password = hashedPassword
    await user?.save()
    res.status(200).json({
        success: true,
        message: "Password updated."
    })
})