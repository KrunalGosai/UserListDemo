var mongoose = require('./connection').mongoose;
var mongoosePaginate = require('mongoose-paginate');

var sUser = new mongoose.Schema({
    first_name:String, 
    last_name:String,
    email:String,
    password:String
})
sUser.plugin(mongoosePaginate);
var mUser = mongoose.model('user',sUser);



module.exports = {mUser};