const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/projetoapi', { useNewUrlParser: true })
    .catch(err => err);
mongoose.Promise = global.Promise;

module.exports = mongoose;