const express = require('express');
const router = express.Router();
const clientesContoller = require('../controllers/clientesController');
const authService = require('../services/authService');

// Rotas administrativas

router.get('/', authService.isAdmin, clientesContoller.clientes);

router.get('/:id', authService.isAdmin, clientesContoller.clienteIndividual);


// Rotas para clientes não autentificados

router.post('/registro', clientesContoller.registro);

router.post('/login', clientesContoller.login);

router.post('/forgot_password', clientesContoller.forgot_password);

router.post('/reset_password', clientesContoller.reset_password);


// Rotas para clientes autentificados

router.post('/refresh_token', authService.authorize, clientesContoller.refresh_token);

module.exports = router;