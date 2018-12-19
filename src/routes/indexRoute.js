const express = require('express')
const router = express.Router()

router.get('/', (req, res, next) => {
    res.status(200).send({ 
        title : 'Projeto API',
        description: 'Meu projeto para estudar o desenvolvimento de API REST utilizando NodeJS e MongoDB',
        version: '0.1.0'
    });
})

module.exports = router;