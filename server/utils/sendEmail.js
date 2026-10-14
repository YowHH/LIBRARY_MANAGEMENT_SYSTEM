import nodemailer from "nodemailer";

// @ts-ignore
export const sendEmail = async ({
    email,
    subject,
    message
}) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD, // 授权码
        },

        logger: true,
        debug: true,
    });

    const mailOption = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject: subject,
        html: message,
    };

    await transporter.sendMail(mailOption);
};