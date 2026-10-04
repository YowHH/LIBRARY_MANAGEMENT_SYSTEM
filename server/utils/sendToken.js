// @ts-ignore
export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken()
    // @ts-ignore
    res.sattus(statusCode).cookie("token", token, {
        // @ts-ignore
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 *60 * 1000),
        httpOnly: true
    }).json({
        success: true,
        user, message, token,
    })
}