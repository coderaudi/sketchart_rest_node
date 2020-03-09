const mongoose = require('mongoose');
const config = require('config');
module.exports = function() {
    
mongoose.connect(config.get('dbconn'), {useNewUrlParser: true})
.then( console.log('connected to the db .. !'))
.catch( error => { console.log('error :', error)}) 

}