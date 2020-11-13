const Yup = require('yup')
const knex = require('../database/connection')

module.exports = {
	async index(req, res) {
		const results = await knex('users')

		return res.json(results)
	},

	async create(req, res, next) {
		const schemaUserStore = Yup.object().shape({
			username: Yup.string().required(),
			password: Yup.string().min(4).required(),
			investorProfile: Yup.number().required(),
			cash: Yup.number().required()
		});
		let isValid = null;
		try {
			isValid = await schemaUserStore.validate(req.body,{abortEarly: false});
		} catch (err) {
			console.log(err)
			return res.json({
				erro: err.errors
			})
		}
		
		const {
			username,
			password,
			cash,
			investorProfile
		} = isValid;

		const userExists = await knex('users').where('username', '=', username);

		if(userExists.length > 0){			
			return res.status(400).json({error: "Usuário já existe"})
		}
		try{
			const user = await knex('users').insert({
				username,
				password,
				investorProfile,
				cash
			})
			const userNew = await knex('users').where('id', '=', user);
			
			return res.status(201).json(userNew);
		}catch(error){
			next(error)
		}
	},

	async update(req,res,next){
		try{
			const {username, investorProfile, cash} = req.body
			const {id} = req.params

			if(username){
				await knex('users').update({username}).where({id})
			}
			if(investorProfile){
				await knex('users').update({investorProfile}).where({id})				
			}

			if(cash){
				await knex('users').update({cash}).where({id})
			}
			const userNew = await knex('users').where('id', '=', user);

			return res.status(200).json(userNew)
		}catch(error){
			next(error);
		}
	},

	async delete(req,res,next){
		const{id} = req.params
		try{
			await knex('users').where('id','=', id).del()
			return res.status(200).json({message: "Usuário deletado"})
		}catch (error){
			next(error)
		}
	}
}