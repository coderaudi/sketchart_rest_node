const jwt = require('jsonwebtoken'); // to check the valid user



module.exports = function (req, res, next) {

    const BearerHeader = req.headers['authorization'];
    if (typeof BearerHeader !== 'undefined') {
        const bearer = BearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                if(authData.user.isAdmin){
                    next(); // pass the control to the next
                }else{
                    res.sendStatus(401);
                }
               
            }
        });
       
    } else {
        res.sendStatus(403);
    }

  
}
