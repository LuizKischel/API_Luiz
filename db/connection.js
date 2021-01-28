const mysql = require('mysql')
const configs = require('../configs/app.json')

const connection = mysql.createConnection(configs.DB)
connection.connect();

module.exports = connection
