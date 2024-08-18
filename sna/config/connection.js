const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socialNetworkDB');

module.exports = mongoose.connection;
