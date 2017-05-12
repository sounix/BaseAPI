'use strict'

const config = {
  user: '',
  password: '',
  server: '',
  database: '',
  port: 1433
}

const urlBase = 'http://localhost:3000'

function getCompras (req, res) {
  if (!req.query.sucursal) return res.status(400).send({ message: `Error al hacer tu solicitud falta variable {sucursal} - Example: ${urlBase}/api/bitacoras/compras?sucursal=sucursal` })

  let sucursal = req.query.sucursal

  let sqlConsulta = `SELECT sucursal,fecha,folio,proveedor,subtotal,ieps,iva,total,documento,estatus FROM BitacoraDigital.Compras WHERE Sucursal = '${sucursal}'`
  if (req.query.tipo) {
    switch (req.query.tipo) {
      case 'año':
        sqlConsulta += ` AND YEAR(Fecha) = YEAR(GETDATE())`
        break
      case 'mes':
        sqlConsulta += ` AND YEAR(Fecha) = YEAR(GETDATE()) AND MONTH(Fecha) = MONTH(GETDATE())`
        break
      case 'dia':
        sqlConsulta += ` AND CONVERT(NVARCHAR(8),Fecha,112) = CONVERT(NVARCHAR(8),GETDATE(),112)`
        break
      default:
        return res.status(400).send({ message: `Error al hacer tu solicitud - Tipo desconocido` })
    }
  }

  sqlConsulta += ` ORDER BY folio DESC`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    let rows = result.recordset
    let items = rows.map((row) => {
      return {
        hrefDetalle: urlBase + '/api/bitacoras/compras/' + row.folio,
        data: [ row ]
      }
    })
    let collection = {
      collection: {
        href: urlBase + req.originalUrl,
        total: rows.length,
        items: items
      }
    }
    res.status(200).json(collection)
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function getComprasFolio (req, res) {
  if (!req.params.folio) return res.status(400).send({ message: `Error al hacer tu solicitud falta variable {folio} - Example: ${urlBase}/api/bitacoras/compras/folio` })

  let folio = req.params.folio

  let sqlConsulta = `SELECT sucursal,fecha,folio,proveedor,subtotal,ieps,iva,total,documento,estatus FROM BitacoraDigital.Compras WHERE folio = '${folio}'`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    let rows = result.recordset
    let items = rows.map((row) => {
      return {
        data: [ row ]
      }
    })
    let collection = {
      collection: {
        href: urlBase + req.originalUrl,
        total: rows.length,
        items: items
      }
    }
    res.status(200).json(collection)
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function getProveedores (req, res) {
  let sqlConsulta = `SELECT cuenta,proveedor,rfc,direccion,telefono,email FROM BitacoraDigital.Proveedores ORDER BY proveedor`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    let rows = result.recordset
    let items = rows.map((row) => {
      return {
        data: [ row ]
      }
    })
    let collection = {
      collection: {
        href: urlBase + req.originalUrl,
        total: rows.length,
        items: items
      }
    }
    res.status(200).json(collection)
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function getGeneraId (req, res) {
  if (!req.query.sucursal) return res.status(400).send({ message: `Error al hacer tu solicitud falta variable {sucursal} - Example: ${urlBase}/api/bitacoras/generaid?sucursal=sucursal` })

  let sucursal = req.query.sucursal

  let sqlConsulta = `SELECT sucursal = UPPER('${sucursal}'), fecha = CAST(CONVERT(NVARCHAR(10),GETDATE(),112) AS DATETIME), folio = CASE WHEN COUNT(*) > 0 THEN UPPER('${sucursal}') + CONVERT(NVARCHAR(8),GETDATE(),112) + RIGHT('00' + CAST(CAST(RIGHT(MAX(Folio), 2) AS INT) + 1 AS NVARCHAR),2) ELSE UPPER('${sucursal}') + CONVERT(NVARCHAR(8),GETDATE(),112) + '01' END, subtotal = 0.00, ieps = 0.00, iva = 0.00, total = 0.00, documento = '', estatus = 'A TIEMPO' FROM BitacoraDigital.Compras WHERE Sucursal = '${sucursal}' AND CONVERT(NVARCHAR(8),Fecha,112) = CONVERT(NVARCHAR(8),GETDATE(),112)`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    let rows = result.recordset
    let items = rows.map((row) => {
      return {
        data: [ row ]
      }
    })
    let collection = {
      collection: {
        href: urlBase + req.originalUrl,
        total: rows.length,
        items: items
      }
    }
    res.status(200).json(collection)
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function createCompras (req, res) {
  let compras = req.body

  let sqlConsulta = `INSERT INTO BitacoraDigital.Compras (sucursal,fecha,folio,proveedor,subtotal,ieps,iva,total,documento,estatus) VALUES ('${compras.sucursal}', '${compras.fecha}', '${compras.folio}', '${compras.proveedor}', '${compras.subtotal}', '${compras.ieps}', '${compras.iva}', '${compras.total}', '${compras.documento}', '${compras.estatus}')`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    res.status(200).send({ message: `Operacion Exitosa`, rowsAffected: result.rowsAffected, data: compras })
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function updateComprasFolio (req, res) {
  if (!req.params.folio) return res.status(400).send({ message: `Error al hacer tu solicitud falta variable {folio} - Example: ${urlBase}/api/bitacoras/compras/folio` })

  let folio = req.params.folio

  let compras = req.body

  let sqlConsulta = `UPDATE BitacoraDigital.Compras SET Proveedor = '${compras.proveedor}', Subtotal = '${compras.subtotal}', Ieps = '${compras.ieps}', Iva = '${compras.iva}', Total = '${compras.total}', Documento = '${compras.documento}' WHERE Folio = '${folio}'`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    res.status(200).send({ message: `Operacion Exitosa`, rowsAffected: result.rowsAffected, data: compras })
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

function deleteComprasFolio (req, res) {
  if (!req.params.folio) return res.status(400).send({ message: `Error al hacer tu solicitud falta variable {folio} - Example: ${urlBase}/api/bitacoras/compras/folio` })

  let folio = req.params.folio

  let sqlConsulta = `UPDATE BitacoraDigital.Compras SET Estatus = 'CANCELADO' WHERE Folio = '${folio}'`

  const sql = require('mssql')

  sql.connect(config).then(pool => {
    return pool.request().query(sqlConsulta)
  }).then(result => {
    res.status(200).send({ message: `Operacion Exitosa`, rowsAffected: result.rowsAffected, folio: folio })
    sql.close()
  }).catch(err => {
    res.status(500).send({ message: `Error al realizar la peticion con el servidor - Error : ${err}` })
    sql.close()
  })
}

module.exports = {
  getCompras,
  getComprasFolio,
  getProveedores,
  getGeneraId,
  createCompras,
  updateComprasFolio,
  deleteComprasFolio
}
