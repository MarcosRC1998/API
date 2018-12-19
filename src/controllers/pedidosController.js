const pedidosDAO = require('../models/pedidosDAO');

// Administrativo

module.exports.pedidos = async (req, res, next) => {

    try {
        const pedidos = await pedidosDAO.findAll()
        res.status(200).send({ pedidos: pedidos })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.pedidosByNumeroAdm = async (req, res, next) => {
    const numero = req.params.numero;

    try {
        const pedido = await pedidosDAO.findByNumeroAdm(numero)
        res.status(200).send({ pedido: pedido })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.setStatus = async (req, res, next) => {
    const numero = req.params.numero
    const novoStatus = req.body.status; // aceito ou recusado
    
    try {
        const pedido = await pedidosDAO.findByNumeroAdm(numero);

        if (pedido.status == 'espera') {
            pedido.status = novoStatus;
        } else{
            if (pedido.status == 'aceito') {
                pedido.status = 'entregue'
            }
        }

        pedido.save().catch(err => err);

        res.status(200).send({ 
            pedido: {
                numero: pedido.numero,
                status: pedido.status
            }
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};


// Clientes autentificados

module.exports.pedidosCliente = async (req, res, next) => {

    try {
        const pedidos = await pedidosDAO.findByClienteId(cliente.id)
        res.status(200).send({ pedidos: pedidos });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.pedidoNumero = async (req, res, next) => {
    const numero = req.params.numero;

    try {
        const pedido = await pedidosDAO.findByNumeroPedido(cliente.id, numero)
        res.status(200).send({ pedido: pedido })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.gerarPedido = async (req, res, next) => {
    const dados = req.body;
    const numero = Math.round(Math.random() * (9000000 + 1000000) + 1000000);

    try {

        const pedido = await pedidosDAO.create(cliente.id, numero, dados)
            .catch(err => {
                return err.message
            });

        res.status(201).send({ message: 'Pedido efetuado com sucesso!', numero: pedido.numero });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};