const Produto = require('../schemas/produtosSchema');

// Clientes autentificados e não autentificados

module.exports.findAllToClientes = async (options) => {
    var produtos = await Produto.paginate({active: true}, options)
        .catch(err => err);

    return produtos;
};

module.exports.findBySlug = async (slug) => {
    var produto = await Produto
        .findOne({
            slug,
            active: true
        }, '-_id nome descricao preco tags')
        .catch(err => err)

    return produto;
};

module.exports.findByTag = async (tag, options) => {
    var produto = await Produto
        .paginate({
            tags: tag,
            active: true
        }, options)
        .catch(err => err);
    console.log('chegou')

    return produto;
};


// Administrativo

module.exports.findAllToAdm = async (options) => {
    var produtos = await Produto.paginate({}, options) //'nome preco active'
        .catch(err => err);

    return produtos;
};

module.exports.findById = async (id) => {
    var produto = await Produto.findById(id, '-__v')
        .catch(err => err);

    return produto;
};

module.exports.create = async (dados) => {
    var produto = await Produto.create(dados);
    return produto;
};

module.exports.update = async (id, dados) => {
    var produto = Produto.findByIdAndUpdate(id, {
        $set: {
            nome: dados.nome,
            descricao: dados.descricao,
            preco: dados.preco,
            slug: dados.slug,
            tags: dados.tags
        }
    }, {new: true}).catch(err => err);

    return produto;
};

module.exports.delete = async (id) => {
    await Produto.findByIdAndRemove(id)
};