const jwt = require('jsonwebtoken');

module.exports = function (req ,res, next){

    let token = req.header('token');
    
    if(!token) return res.send("no token provided to Admin")

    const decoded = jwt.verify(token,'mobS');

    let valid = false;
   
    if(!decoded.isAdmin){
        valid = true;
    }
    if(!decoded.isSuperAdmin){
        valid = true;
    }

    if(!valid) return res.send(" only Admin access ! ..");

    next(); // pass the control to the next
}
