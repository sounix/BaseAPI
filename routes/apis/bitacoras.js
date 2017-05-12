'use strict'

const router = require('express').Router()

const bitacorasController = require('../../controllers/bitacoras')

router.route('/bitacoras/compras')
  .get(bitacorasController.getCompras)
  .post(bitacorasController.createCompras)

router.route('/bitacoras/compras/:folio')
  .get(bitacorasController.getComprasFolio)
  .put(bitacorasController.updateComprasFolio)
  .delete(bitacorasController.deleteComprasFolio)

router.route('/bitacoras/proveedores')
  .get(bitacorasController.getProveedores)

router.route('/bitacoras/generaid')
  .get(bitacorasController.getGeneraId)

module.exports = router
