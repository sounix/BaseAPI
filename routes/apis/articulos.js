'use strict'

const router = require('express').Router()

const articulosController = require('../../controllers/articulos')

router.route('/articulos')
  .get(articulosController.getArticulos)

// router.route('/articulos/:articuloId')
//   .get(articulosController.getArticuloId)

module.exports = router
