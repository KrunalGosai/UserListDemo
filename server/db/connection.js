var mongoose = require('mongoose');

var url = "mongodb://localhost/userdata"; //"mongodb+srv://mongoadmin:admin123@clusteralpha.t7t1g.mongodb.net/userdata?retryWrites=true&w=majority"

let con = mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true})

con.then(res => {
    console.log('success connection!')
}).catch(err => console.error(err))

var db = mongoose.connection;

module.exports = { db , mongoose };

// atlas details
//Id: imx84072@zwoho.com
//Ps: inC47BSnV8MWJbP
// mongoadmin
// admin123