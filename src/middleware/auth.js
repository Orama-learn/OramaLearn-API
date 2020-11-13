const jwt = require('jsonwebtoken')
const {promisify} = require('util')
require('dotenv').config()


module.exports = async (req,res,next)=>{
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(400).json({error : "Token não fornecido"})
    }

    const [,token] = authHeader.split(' ');

    try{
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        req.userId = decoded.id_user;
        req.type = decoded.type;
        return next();
    }catch(err){
        console.log(err)
        return res.status(400).json({error: "Token Invalido"})
    }
}