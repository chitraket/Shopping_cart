var mongoose = require('mongoose');

var employeeSchema = new mongoose.Schema({
  imagepath: String,
  title: String,
  description: String,
  price: Number
  });

var employeeModel = mongoose.model('product', employeeSchema);

module.exports=employeeModel;