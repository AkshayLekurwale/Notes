var jwt = require('jsonwebtoken');
 
const jwt_token = "shhhh";

const Fetchuser = (req,res,next) =>{
    const token = req.header('auth-token');
    if(!token){
        res.status(400).send({error : "Please authenticate using valid token"});
    } 
    try {
        const data =  jwt.verify(token,jwt_token);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error : "Please authenticate using valid token"});
    }
    
}

module.exports = Fetchuser;