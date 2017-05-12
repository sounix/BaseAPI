'use strict'

const router = require('express').Router()

router.get('/', (req, res) => {
  res.status(200).json({ message: 'APIs Wincaja To List All Modules' })
})

router.use(require('./articulos'))
router.use(require('./subfamilias'))
router.use(require('./bitacoras'))

module.exports = router
