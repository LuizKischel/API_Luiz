const connection = require('./connection')
const selectBuilder = require('./query_builders/select')

module.exports = {
    fetchAll(table) {
        return new Promise((resolve, reject) => {
            try {
                const query = `SELECT * FROM ${table}`
                connection.query(query, (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    fetchFilter(table, filter = {}) {
        return new Promise((resolve, reject) => {
            try {
                if (filter) {
                    queryWhere = `WHERE ${Object.keys(filter).map(column => `${column} = ?`).join(' AND ')}`
                    whereVariables = Object.values(filter)
                }
                const query = `SELECT * FROM ${table} ${queryWhere}`
                connection.query(query, whereVariables, (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    select(table, selectStructure={}) {
        return new Promise((resolve, reject) => {
            try {
                const params = {...selectStructure, table}
                const {query, values} = selectBuilder(params)
                connection.query(query, values, (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    resolve(result)
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    insert(table, data) {
        return new Promise((resolve, reject) => {
            try {
                const columns = `(${Object.keys(data).join(',')})`
                const values = `(${Object.keys(data).map(() => '?').join(',')})`
                const query = `INSERT INTO ${table} ${columns} VALUES ${values}`
                connection.query(query, Object.values(data), (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    if (result) {
                        resolve(result.insertId)
                    }
                    resolve(null)
                })
            } catch (err) {
                resolve(err)
            }
        })
    },
    get(table, id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `SELECT * FROM ${table} WHERE id = ?`
                connection.query(query, [id], (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    resolve(result[0] || {})
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    delete(table, id) {
        return new Promise((resolve, reject) => {
            try {
                const query = `DELETE FROM ${table} WHERE id = ?`
                connection.query(query, [id], (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    const success = result.affectedRows !== 0 ? true : false
                    const message = success ? `Record with id ${id} deleted successfuly from table ${table}.` : `Record with id ${id} not found on table ${table}.`
                    const deletedStatus = {id, success, message}
                    resolve(deletedStatus)
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    count(table) {
        return new Promise((resolve, reject) => {
            try {
                const query = `SELECT COUNT(*) AS total FROM ${table}`
                connection.query(query, (err, result) => {
                    if(err) {
                        console.log(query)
                        reject(err)
                    }
                    if(result.length !== 0) {
                        resolve(result[0].total)
                    }
                })
            } catch (err) {
                reject(err)
            }
        })
    },
    getFirstColumnMatch(table, value, columns) {
        return new Promise(async (resolve, reject) => {
            try {
                columns.forEach(async column => {
                    const filter = {}
                    filter[column] = value
                    const result = await this.fetchFilter(table, filter)
                    if (result.length !== 0) {
                        resolve(result[0])
                    }
                })
            } catch (err) {
                reject(err)
            }
        })
    }
}
