const clienteDAO = require('../models/clientesDAO');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const authService = require('../services/authService');
const mailService = require('../services/mailService');
const mailConfig = require('../config/mail');
const ValidationService = require('../services/validationService');

// Administrativo

module.exports.clientes = async (req, res, next) => {
    try {
        const clientes = await clienteDAO.findAll();
        res.status(200).send({
            clientes: clientes
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.clienteIndividual = async (req, res, next) => {
    const id = req.params.id;

    try {
        const cliente = await clienteDAO.findById(id);
        res.status(200).send({
            cliente: cliente
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
}


//  Clientes não autentificados

module.exports.registro = async (req, res, next) => {
    const dados = req.body;
    const { email } = dados;

    var validator = new ValidationService();
    validator.hasMinLen(dados.nome, 3, 'O nome deve possuir no mínimo 3 caracteres');
    validator.isEmail(dados.email, 'E-mail inválido');
    validator.hasMinLen(dados.password, 6, 'A senha deve possuir no mínimo 6 caracteres');
    validator.isValidPassword(dados.password, 'A senha deve incluir no minimo um caracter minusculo, um caracter maiusculo, um numero e um caracter especial (%#$&!?!@)');
    validator.isEqual(dados.password, dados.confirmPassword, 'A senha de confirmação deve ser igual');

    if (!validator.isValid()) {
        return res.status(400).send(validator.errors());
    };

    try {
        if (await clienteDAO.findUser(email)) {
            return res.status(400).send({ error: 'Usuario já existe' });
        }

        var cliente = await clienteDAO.create(dados)
            .catch(err => {
                return err.message
            })
        if (cliente) {
            return res.status(400).send({ error: cliente });
        }

        const token = await authService.generateToken({
            id: cliente._id,
            email: cliente.email,
            nome: cliente.nome,
            roles: cliente.roles
        });

        cliente.password = undefined;

        mailService.send(
            email,
            'Bem Vindo!',
            mailConfig.template.bem_vindo.replace('{0}', cliente.nome)
        );

        res.status(201).send({ cliente, token });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }
};

module.exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        cliente = await clienteDAO.findUser(email, true);

        if (!cliente) {
            return res.status(404).send({ error: 'Usuario Inválido' });
        }

        if (!await bcrypt.compare(password, cliente.password)) {
            return res.status(404).send({ error: 'Senha Inválida' });
        }

        cliente.password = undefined;

        const token = await authService.generateToken({
            id: cliente._id,
            email: cliente.email,
            nome: cliente.nome,
            roles: cliente.roles
        });

        res.status(200).send({ cliente, token });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }

};

module.exports.forgot_password = async (req, res, next) => {
    const { email } = req.body;

    try {
        const cliente = await clienteDAO.findUser(email);
        if (!cliente) {
            return res.status(404).send({ error: 'Usuario não existe' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await clienteDAO.updateDataReset(cliente.id, token, now).catch(err => err);

        mailService.send(
            email,
            'Alteração de senha',
            mailConfig.template.reset_pass
                .replace('{0}', cliente.nome)
                .replace('{1}', token)
        );

        res.status(200).send({ message: 'Verifique seu email para continuar a alteração da senha' });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }

};

module.exports.reset_password = async (req, res, next) => {
    const { email, token, newPassword } = req.body;

    try {
        var cliente = await clienteDAO.findUserToReset(email);

        if (!cliente) {
            return res.status(404).send({ error: 'Usuario não encontrado' });
        }

        if (token !== cliente.passwordResetToken) {
            return res.status(404).send({ error: 'Token inválido' });
        }

        const now = new Date();

        if (now.getHours() > new Date(cliente.passwordResetExpires).getHours()) {
            return res.status(400).send({ error: 'Token expirado, por favor gere um novo' });
        }

        var validator = new ValidationService();
        validator.hasMinLen(dados.password, 6, 'A senha deve possuir no mínimo 6 caracteres');
        validator.isValidPassword(dados.password, 'A senha deve incluir no minimo um caracter minusculo, um caracter maiusculo, um numero e um caracter especial (%#$&!?!@)');
        validator.isEqual(dados.password, dados.confirmPassword, 'A senha de confirmação deve ser igual');
    
        if (!validator.isValid()) {
            return res.status(400).send(validator.errors());
        };

        cliente.password = newPassword;
        cliente.passwordResetToken = undefined;
        cliente.passwordResetExpires = undefined;

        await cliente.save().catch(err => err);

        res.status(200).send({ message: 'Sua senha foi alterada com sucesso!' });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }

};


// Clientes autentificados

module.exports.refresh_token = async (req, res, next) => {

    try {
        //     const token = req.body.token || req.query.token || req.headers['x-access-token'];
        //     const cliente = await authService.decodeToken(token);

        if (!clienteDAO.findUser(cliente.email)) {
            return res.status(404).send({ error: 'Cliente não encontado' });
        }

        const newToken = await authService.generateToken({
            id: cliente._id,
            email: cliente.email,
            nome: cliente.nome,
            roles: cliente.roles
        })

        res.status(201).send({
            message: 'Token atualizado com sucesso',
            token: newToken,
            cliente: {
                nome: cliente.nome,
                email: cliente.email
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).send({
            message: 'Ops! Ocorreu um erro ao processar sua requisição, por favor tente novamente'
        });
    }

};