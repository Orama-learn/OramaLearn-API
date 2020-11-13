const jwt = require('jsonwebtoken');
const knex = require('../database/connection')
const  bcrypt = require('bcryptjs')
require('dotenv').config()

module.exports = {
    async store(req,res){
        const{user, password} = req.body

        const verify = await knex('users').where('username','=', user)

        if(verify.length < 0){
            return res.status(401).json({error: "Usuário não existe"})
        }

        if(! (await bcrypt.compare(password, verify[0].password))){
            return res.status(401).json({error: "Senha não confere"})
        }

        const {id, username, investorProfile, cash } = verify[0];

        return res.json({
            user:{
                id,
                username,
                investorProfile,
                cash
            },
            token: jwt.sign({id, username}, process.env.SECRET, {expiresIn: process.env.EXPIRESIN})
        })
    }
}