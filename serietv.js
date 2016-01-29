var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var serietv = new Schema({
  titulo: String,
  temporadas: Number,
  pais: String,
  genero: {
    type: String,
    enum: ['Comedia', 'Fantasia', 'Drama', 'Terror', 'Ciencia Ficcion']
  }
});

module.exports = mongoose.model('SerieTV', serietv);