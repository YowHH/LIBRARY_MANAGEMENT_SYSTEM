import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";

// @ts-ignore
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true });
    res.status(200).json({
        success: true,
        users,
    });
});

// @ts-ignore
export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin avatar is required.", 400));
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please fill all fields.", 400));
    }

    const isRegistered = await User.findOne({ email });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }

    if (password.length < 8 || password.length > 16) {
        return next(
            new ErrorHandler("Password must be between 8 to 16 characters.", 400)
        );
    }

    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("File format not supported.", 400));
    }

    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${Date.now()}-${avatar.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadDir, fileName);
    await avatar.mv(filePath); // express-fileupload 提供的 mv 方法

    const avatarUrl = `http://localhost:4000/uploads/${fileName}`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: fileName,
            url: avatarUrl,
        },
    });

    res.status(200).json({
        success: true,
        message: "Admin registered successfully.",
        admin,
    });
});