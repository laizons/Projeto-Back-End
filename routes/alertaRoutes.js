const express = require('express');
const router = express.Router();
const controller = require('../controllers/alertaController');

router.get('/', controller.getAlertas);
router.post('/', controller.createAlerta);

module.exports = router;
