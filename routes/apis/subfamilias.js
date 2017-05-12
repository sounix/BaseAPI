'use strict'

const router = require('express').Router()

const subfamiliasController = require('../../controllers/subfamilias')

router.route('/subfamilias')
  .get(subfamiliasController.getSubfamilias)

// router.route('/articulos/:articuloId')
//   .get(articulosController.getArticuloId)

module.exports = router
