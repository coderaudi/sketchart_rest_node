const jwt = require('jsonwebtoken'); // to check the valid user

module.exports = function (req ,res, next){
   
    let token = req.header('token'); // form user req header
    
    if(!token) return res.send("no token provided to SuperAdmin  ")

    const decoded = jwt.verify(token,'mobS');  // verification signature

    if(!decoded.isSuperAdmin) return res.send(" only SuperAdmin user can access ! ..");
    
    next(); // pass the control to the next
}
