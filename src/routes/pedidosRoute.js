const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const authService = require('../services/authService');

// Rotas administrativas

router.get('/admin', authService.isAdmin, pedidosController.pedidos);

router.get('/admin/:numero', authService.isAdmin, pedidosController.pedidosByNumeroAdm);

router.put('/admin/status/:numero', authService.isAdmin, pedidosController.setStatus);


// Rotas para clientes autentificados

router.get('/', authService.authorize, pedidosController.pedidosCliente);

router.get('/:numero', authService.authorize, pedidosController.pedidoNumero);

router.post('/', authService.authorize, pedidosController.gerarPedido);

module.exports = router;