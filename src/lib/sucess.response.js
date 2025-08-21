export function successResponse(res, data = {}, statusCode = 200, meta = null, message = null) {
    const response = {
        success: true,
        status: statusCode,
        data
    };
    if(message){
        response.message = message;
    }
    if (meta) {
        response.meta = meta;
    }
    return res.status(statusCode).json(response);
}
