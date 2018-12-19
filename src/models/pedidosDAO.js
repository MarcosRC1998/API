const Pedido = require('../schemas/pedidosSchema');

// Administrativo

module.exports.findAll = async () => {
    var pedidos = await Pedido.find({}, '-itens._id -__v')
        .populate('cliente', 'nome')
        .catch(err => err);

    return pedidos;
};

module.exports.findByNumeroAdm = async (numero) => {
    var pedido = await Pedido.findOne({numero}, '-__v -itens._id')
        .populate('cliente', 'nome email')
        .populate('itens.produto', 'nome preco')
        .catch(err => err);

    return pedido;
};


// Clientes autentificados

module.exports.findByClienteId = async (clienteId) => {
    var pedidos = await Pedido.find({ cliente: clienteId }, '-itens._id -__v')
        .populate('cliente', '-_id nome')
        .populate('itens.produto', 'nome preco')
        .catch(err => err);

    return pedidos;
};

module.exports.findByNumeroPedido = async (clienteId, numero) => {
    var pedidos = await Pedido.findOne({
        cliente: clienteId,
        numero: numero
    }, '-itens._id -__v')
        .populate('cliente', '-_id nome email')
        .populate('itens.produto', 'nome preco descricao')
        .catch(err => err);

    return pedidos;
};

module.exports.create = async (clienteId, numero, dados) => {
    var pedido = await Pedido.create({
        cliente: clienteId,
        numero: numero,
        itens: dados.itens
    });
    return pedido;
};