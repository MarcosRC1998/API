const mongoose = require('../config/database');
const bcrypt = require('bcrypt');

const clienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatorio'],
        minlength: [3, 'O nome deve possuir no mínimo 3 caracteres'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'O email é obrigatorio'],
        unique: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'A senha é obrigatoria'],
        minlength: [6, 'A senha deve possuir no mínimo 6 caracteres'],
        match: /((?=.+[\d])(?=.+[a-z])(?=.*[A-Z])(?=.+[%#$&!?@])).{6,}/g,
        trim: true,
        select: false
    },
    roles: {
        type: String,
        required: true,
        enum: ['user', 'admin'],
        default: 'user'
    },
    passwordResetToken: {
        type: String,
        select: false
    },
    passwordResetExpires: {
        type: String,
        select: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

clienteSchema.pre('save', async function(next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;

    next()
});

module.exports = mongoose.model('Cliente', clienteSchema)

/*
 *      OBS:
 *  -Adcionar futuramente o 'mongoose-paginate', um plugin para paginação.
 *  -Para tal, colocar após a estrutura 'pre' o 'clienteSchema.plugin(mongoosePaginate)' fazendo a importação
 *  do tal antes.
 *  -Com o uso do 'paginate' é preciso trocar todas as estruras de pesquisa de 'find' (testar pois não tenho
 *  certeza por total do funcionamento)
 *  -Utilizar a estrutura 'Model/Schema/DAO.paginate({query}, { page, limit: valor })'
 *      -> 'page' é o valor da pagina atual
 *      -> 'limit' é o valor máximo de elementos por página
 *      -> 'page' deve ser tirado da 'query string' da URL (?page=numero_da_pagina_a_buscar)
 *      -> coletar a informação antes de passar (obvio né kkk), podendo definir um valor padrão, usando:
 *         const { page = 1 } = req.query
 * 
 */