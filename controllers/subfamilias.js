'use strict'

function getSubfamilias (req, res) {
  const config = {
    user: '',
    password: '',
    server: '',
    database: '',
    port: 1433
  }

  const urlBase = 'http://localhost:3000'

  let sqlConsulta = `SELECT Subfamilia,Descripcion,FechaAlta FROM Subfamilias`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    let rows = result.recordset
    let items = rows.map((row) => {
      return {
        href: urlBase + '/api/subfamilias/' + row.Subfamilia,
        data: [ row ]
      }
    })
    let collection = {
      collection: {
        href: urlBase + '/api/subfamilias',
        items: items,
        total: rows.length
      }
    }
    res.status(200).json(collection)
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
  })
}

module.exports = {
  getSubfamilias
}
