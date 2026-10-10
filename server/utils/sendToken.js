// @ts-ignore
export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken()

    const cookieExpireDays = Number(process.env.COOKIE_EXPIRE) || 7;

    const expiresDate = new Date(
        Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000
    );

    res.status(statusCode).cookie("token", token, {
        expires: expiresDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
    }).json({
        success: true,
        user, 
        message, 
        token,
    })
}