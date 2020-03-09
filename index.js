// error rec
const winston = require('winston');
const mobile =   require('./routes/mobile')
const sketchart =   require('./routes/sketchart')
require('./startup/db')();

const express = require('express');
const app = express();
app.use(express.json()); //  middleware function

app.use('/api/products' , mobile);
app.use('/api/sketchart' , sketchart);


winston.add( new winston.transports.File({filename : 'logfile.log'}));

// set the Environment variable PORT 
const port = process.env.PORT || 5000 ;
const server = app.listen(port , ()=> console.log(`listening of port ${port}... `));

module.exports = server;

