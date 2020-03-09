const jwt = require('jsonwebtoken'); // to check the valid user


module.exports = function (req ,res, next){

    let token = req.header('token'); // form user req header
    let secret_key = "secretkey";
    console.log("token" ,token);
    
   if(!token) return res.send("no token provided to user  ")

    const decoded = jwt.verify(token, secret_key);  // verification signature

    if(!decoded.user.isAdmin){
        res.send("hey you are not admin !!!")
    }

    next(); // pass the control to the next
}
