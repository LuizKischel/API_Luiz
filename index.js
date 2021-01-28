const configs = require('./configs/app.json')

// APPLICATION IMPORT
const express = require('express')
require('express-async-errors')
const app = express()

// MIDDLEWARES IMPORT
const errorMiddleware = require('./middlewares/errorCatcher')
const bodyParserMiddleware = require('./middlewares/bodyParser')

// ROUTES IMPORT
const studentRoute = require('./routes/student')
const examRoute = require('./routes/exam')

// BEFORE MIDDLEWARES
bodyParserMiddleware(app)

// ROUTES
studentRoute(app)
examRoute(app)

// AFTER MIDDLEWARES
errorMiddleware(app)

// START API
app.listen(configs.PORT)
console.log(`Listening http://localhost:${configs.PORT}`);