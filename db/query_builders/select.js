

module.exports = params => {
    const {table} = params
    const select = params.select ? selectQuery(params.select) : `${table}.*`
    const where = params.where ? `WHERE ${params.where.join(' AND ')}` : ""
    const join = params.join ? joinQuery(params.join) : ""
    const group = params.group ? `GROUP BY ${params.group}` : ""

    const query = `SELECT ${select} FROM ${table} ${join} ${where} ${group}`
    const values = []
    
    return {query, values}
}

const selectQuery = columns => {
    const keys = Object.keys(columns)
    return Object.values(columns).map((query, i) => `${query} AS ${keys[i]}`).join(',')
}

const joinQuery = joins => {
    return joins.map(join => `${join.type || 'INNER'} JOIN ${join.table} ON (${join.on})`).join(' ')
}
