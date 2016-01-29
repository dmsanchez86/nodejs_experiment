var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var users = new Schema({
  username: String,
  email: String,
  password: String
});

module.exports = mongoose.model('Users', users);