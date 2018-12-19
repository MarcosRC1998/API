const express = require('express');
const router = express.Router();
const produtosController = require('../controllers/produtosController');
const authService = require('../services/authService');

// Rotas para clientes

router.get('/', produtosController.produtos);

router.get('/:slug', produtosController.produtoBySlug);

router.get('/tags/:tag', produtosController.produtoByTag);


// Rotas administrativas

router.get('/admin/produtos', authService.isAdmin, produtosController.produtosToAdm);

router.get('/admin/produtos/:id', authService.isAdmin, produtosController.produtoById);

router.post('/', authService.isAdmin, produtosController.add);

router.put('/:id', authService.isAdmin, produtosController.att);

router.put('/status/:id', authService.isAdmin, produtosController.setStatus);

router.delete('/:id', authService.isAdmin, produtosController.del);

module.exports = router;