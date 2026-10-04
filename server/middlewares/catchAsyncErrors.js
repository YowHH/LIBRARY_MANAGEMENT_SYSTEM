// @ts-ignore
export const catchAsyncErrors = (theFunction) => {
    // @ts-ignore
    return (req, res, next) => {
        Promise.resolve(theFunction(req, res, next)).catch(next)
    }
}