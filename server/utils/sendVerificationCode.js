
import { generateVerificationOtpEmailTemplate } from "./emailTemplates.js"
import { sendEmail } from "./sendEmail.js"

// @ts-ignore
export async function sendVerificationCode(verificationCode, email, res) {
    try {
        const message = generateVerificationOtpEmailTemplate(verificationCode)
        await sendEmail({
            email,
            subject: "Verification Code (Bookworm Library Management System)",
            message
        })
        res.status(200).json({
            success: true,
            message: "Verification code sent successfully."
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Verification code failed to send."
        })
    }
}