const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// Rotas
const indexRoute = require('../routes/indexRoute');
const clientesRoute = require('../routes/clientesRoute');
const produtosRoute = require('../routes/produtosRoute');
const pedidosRoute = require('../routes/pedidosRoute');

app.use(bodyParser.urlencoded({ extended : true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token', 'Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', indexRoute);
app.use('/clientes', clientesRoute);
app.use('/produtos', produtosRoute);
app.use('/pedidos', pedidosRoute);

module.exports = app;


//______________________________________________________________________________________________________________

/*  --------->  APÓS LINHA 9  <---------

    app.use(express.static(__dirname + '/public'));  --> Se for usar arquivo estatico aqui, como js, css, etc

    app.set('view engine', 'NOME DA ENGINE');
    app.set('views', '../app/views');
           |--> Se for ter as views aqui

    --------->  OBS  <---------
    Consign não esta funcionando
*/

//______________________________________________________________________________________________________________

/*  --------->  LINHAS 14 - 19  <---------

    - Libera acesso a API de qualquer origem
    - Define quais 'headers' são permitidos
    - Define quais metodos são permitidos

*/

