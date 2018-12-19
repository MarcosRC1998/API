const Cliente = require('../schemas/clientesSchema');

// Administrativo

module.exports.findAll = async () => {
    var clientes = await Cliente.find({}, 'nome email')
        .catch(err => err);

    return clientes;
};

module.exports.findById = async (id) => {
    var cliente = await Cliente.findById(id, '-__v')
        .catch(err => err);

    return cliente;
};


// Clientes não autentificados

module.exports.create = async (dados) => {
    var cliente = await Cliente.create(dados)
    return cliente;
};

/*  
    Usada para procurar um usuario pelo email, pra então fazer a verificação se o usuario ja existe na
    hora de criar um novo (é passado somente o email), ou para autenticar, passando true no segundo parametro
    para que seja retornado a senha junto (é passado email, e true respectivamente) 
*/
module.exports.findUser = async (email, select) => {
    if (select) {
        select = '+password';
    }
    var cliente = await Cliente.findOne({ email }).select(select)
        .catch(err => err);

    return cliente;
};

module.exports.updateDataReset = async (id, token, date) => {
    await Cliente.findByIdAndUpdate(id, {
        passwordResetToken: token,
        passwordResetExpires: date
    });
};

module.exports.findUserToReset = async (email) => {
    var cliente = await Cliente.findOne({ email })
        .select('+passwordResetToken passwordResetExpires')
        .catch(err => err);
        
    return cliente;
};