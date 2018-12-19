const jwt = require('jsonwebtoken')
const auth = require('../config/auth')

module.exports.generateToken = async (dados) => {
    return jwt.sign(dados, auth.secret, { expiresIn: '1d' });
}

module.exports.decodeToken = async (token) => {
    const parts = token.split(' ');
    const [schema, authToken] = parts;

    var dados = await jwt.verify(authToken, auth.secret);
    return dados;
}

module.exports.authorize = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        return res.status(401).send({ error: 'Sem Token de autorização' });
    };

    const parts = token.split(' ');

    if (!(parts.length === 2)) {
        return res.status(401).send({ error: 'Token error' });
    };

    const [schema, authToken] = parts;

    if (!/^Bearer$/i.test(schema)) {
        return res.status(401).send({ error: 'Erro de formatação do token' });
    };

    jwt.verify(authToken, auth.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: 'Token Inválido' });
        }

        cliente = decoded;
        next()

    })
}

module.exports.isAdmin = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;

    if (!token) {
        return res.status(401).send({ error: 'Sem Token de autorização' });
    };

    const parts = token.split(' ');

    if (!(parts.length === 2)) {
        return res.status(401).send({ error: 'Token error' });
    };

    const [schema, authToken] = parts;

    if (!/^Bearer$/i.test(schema)) {
        return res.status(401).send({ error: 'Erro de formatação do token' });
    };

    jwt.verify(authToken, auth.secret, (err, decoded) => {
        if (err) {
            return res.status(403).send({ error: 'Token Inválido' });
        }

        if (decoded.roles == 'admin') {
            cliente = decoded;
            next()
        } else {
            res.status(403).send({
                message: 'Esta funcionalidade é restrita para administradores'
            });
        }
    })
}