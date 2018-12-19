const produtosDAO = require('../models/produtosDAO');
const ValidationService = require('../services/validationService');


// Clientes autentificados e não autentificados

module.exports.produtos = async (req, res, next) => {
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

    if (!page || page < 1) {
        page = 1;
    };

    if (!limit || limit < 1) {
        limit = 10;
    };

    const options = {
        page,
        limit,
        select: '-_id nome preco slug'
    };


    try {
        const produtos = await produtosDAO.findAllToClientes(options);
        res.status(200).send({ produtos: produtos });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.produtoBySlug = async (req, res, next) => {
    const slug = req.params.slug;

    try {
        const produto = await produtosDAO.findBySlug(slug);
        res.status(200).send({ produto: produto });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.produtoByTag = async (req, res, next) => {
    const tag = req.params.tag;
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

    if (!page || page < 1) {
        page = 1;
    };

    if (!limit || limit < 1) {
        limit = 10;
    };

    const options = {
        page,
        limit,
        select: '-_id nome preco slug'
    };

    try {
        const produto = await produtosDAO.findByTag(tag, options);
        res.status(200).send({ produto: produto });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}


// Administrativo

module.exports.produtosToAdm = async (req, res, next) => {
    var page = parseInt(req.query.page);
    var limit = parseInt(req.query.limit);

    if (!page || page < 1) {
        page = 1;
    };

    if (!limit || limit < 1) {
        limit = 10;
    };

    const options = {
        page,
        limit,
        select: 'nome preco active'
    };

    try {
        const produtos = await produtosDAO.findAllToAdm(options);
        res.status(200).send({ produtos: produtos });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.produtoById = async (req, res, next) => {
    const id = req.params.id;

    try {
        const produto = await produtosDAO.findById(id);
        res.status(200).send({ produto: produto });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }

}

module.exports.add = async (req, res, next) => {
    const dados = req.body;
    const { slug } = dados;

    var validator = new ValidationService();
    validator.hasMinLen(dados.nome, 3, 'O nome deve possuir no mínimo 3 caracteres');
    validator.hasMinLen(dados.descricao, 5, 'A descrição deve possuir no mínimo 5 caracteres');
    validator.hasMinValue(dados.preco, 1, 'O preço deve ser de no mínimo R$1');
    validator.hasMinLen(dados.slug, 5, 'O slug deve possuir no mínimo 3 caracteres');
    dados.tags.forEach(tag => {
        validator.hasMinLen(tag, 3, 'A tag deve possuir no mínimo 3 caracteres');
    });

    if (!validator.isValid()) {
        return res.status(400).send(validator.errors());
    };

    try {
        if (await produtosDAO.findBySlug(slug)) {
            return res.status(400).send({ error: 'O slug já existe e deve ser unico' });
        }

        const produto = await produtosDAO.create(dados)
            .catch(err => {
                return err.message
            });
        if (produto) {
            return res.status(400).send({ produto: produto });
        }

        res.status(201).send({ produto: produto });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.att = async (req, res, next) => {
    const id = req.params.id;
    const dados = req.body;

    var validator = new ValidationService();
    validator.hasMinLen(dados.nome, 3, 'O nome deve possuir no mínimo 3 caracteres');
    validator.hasMinLen(dados.descricao, 5, 'A descrição deve possuir no mínimo 5 caracteres');
    validator.hasMinValue(dados.preco, 1, 'O preço deve ser de no mínimo R$1');
    validator.hasMinLen(dados.slug, 5, 'O slug deve possuir no mínimo 3 caracteres');
    dados.tags.forEach(tag => {
        validator.hasMinLen(tag, 3, 'A tag deve possuir no mínimo 3 caracteres');
    });

    if (!validator.isValid()) {
        return res.status(400).send(validator.errors());
    };

    try {
        const produto = await produtosDAO.update(id, dados).catch(err => err);

        res.status(200).send({ message: 'Produto atualizado com sucesso', produto: produto });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.setStatus = async (req, res, next) => {
    const id = req.params.id;

    try {

        const produto = await produtosDAO.findById(id)
        produto.active = !produto.active;
        produto.save().catch(err => err)

        res.status(200).send({
            message: 'Status atualizado',
            produto: produto.nome,
            preco: produto.preco,
            active: produto.active,
        });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}

module.exports.del = async (req, res, next) => {
    const id = req.params.id;

    try {
        await produtosDAO.delete(id);
        res.status(200).send({ message: 'Produto excluido com sucesso' });

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}