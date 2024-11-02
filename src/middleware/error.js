export const CustomErrorHandle = (err, res, req, next) => {
    const defaultCustomError = {
        msg: err?.message ?? 'Internal server error',
        statusCode: err?.statusCode ?? 500,
    }

    res.status(defaultCustomError.statusCode).json({
        msg: defaultCustomError.msg,
    })
}
