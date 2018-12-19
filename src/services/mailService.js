const nodemailer = require('nodemailer');
const { host, port, user, pass } = require('../config/mail');

var transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass }
});

module.exports.send = (to, subject, html) => {
    transport.sendMail({
        to: to,
        from: 'admin@email.com',
        subject: subject,
        html: html
    }, (err) => {
        if (err)
            return res.status(400).send({ error: 'Não foi possivel enviar o email de alteração de senha'})
    });
};