const STATUS = require('http-status')


module.exports = app => {
    app.use((err, req, res, next) => {
        if(err.sender === 'BadRequest') {
            res.json({code: err.code, message: err.message})
        } else {
            res.json({code: STATUS.INTERNAL_SERVER_ERROR, message: "INTERNAL_SERVER_ERROR"})
        }
        next(err)
    })
}