const mongoose = require('../config/database');

const pedidosSchema = new mongoose.Schema({
    cliente:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cliente',
        required: true
    },
    numero: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    status: {
        type: String,
        required: true,
        enum: ['espera', 'aceito', 'recusado', 'entregue'],
        default: 'espera'
    },
    itens: [{
        produto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Produto',
            require: true
        },
        quantidade: {
            type: Number,
            required: true,
            default: 1
        }
    }]
})

module.exports = mongoose.model('Pedido', pedidosSchema);