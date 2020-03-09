const jwt = require('jsonwebtoken'); // to check the valid user

module.exports = function (req ,res, next){
   
    let token = req.header('token'); // form user req header
    if(!token) return res.send("no token provided to user  ")

    const decoded = jwt.verify(token,'mobS');  // verification signature

    let valid = false;
    if(!decoded.isUser){
        valid = true;
    }
    if(!decoded.isAdmin){
        valid = true;
    }
    if(!decoded.isSuperAdmin){
        valid = true;
    }

    if(!valid) return res.send(" only register user can access ! ..");
    
    next(); // pass the control to the next
}
