const mongoose = require('../config/database');
const paginate = require('mongoose-paginate');

const produtoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: [true, 'O nome é obrigatório'],
        minlength: [3, 'O nome deve possuir no mínimo 3 caracteres'],
        trim: true
    },
    descricao: {
        type: String,
        required: [true, 'A descrição é obrigatória'],
        minlength: [5, 'A descrição deve possuir no mínimo 5 caracteres'],
        trim: true
    },
    preco: {
        type: Number,
        required: [true, 'O preço é obrigatório'],
        min: [1, 'O preço deve ser de no mínimo R$1'],
        trim: true
    },
    slug: {
        type: String,
        required: [true, 'O slug é obrigatório'],
        minlength: [3, 'O slug deve possuir no mínimo 3 caracteres'],
        index: true,
        unique: true,
        trim: true
    },
    tags: [{
        type: String,
        required: [true, 'A tag é obrigatória'],
        minlength: [3, 'A tag deve possuir no mínimo 3 caracteres'],
        trim: true
    }],
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    imagem: {
        type: String,
        required: false
    }
});

produtoSchema.plugin(paginate);

module.exports = mongoose.model('Produto', produtoSchema);