
function errorHandler(err, req, res, next){
    const statusCode = res.statusCode || 500;
    res.status(statusCode)
    res.json({
        error: err.name,
        message: err.message,
        stack: err.stack
    })
}

module.exports = {
    errorHandler
}