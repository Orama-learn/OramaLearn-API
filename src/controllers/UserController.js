const Yup = require('yup')
const knex = require('../database/connection')
const  bcrypt = require('bcryptjs')

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
			passwordHash = await bcrypt.hash(password,8);
			const user = await knex('users').insert({
				username,
				password: passwordHash,
				investorProfile,
				cash
			})
			const userNew = await knex.select('username', 'investorProfile', 'cash').from('users').where('id', '=', user);
			
			return res.status(201).json(userNew);
		}catch(error){
			next(error)
		}
	},

	async update(req,res,next){
		try{
			const {username, investorProfile, cash, password, oldpassword} = req.body
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

			if(oldpassword){
				if(!password){
					return res.status(400).json({error: "Nessário informar a nova senha para a troca"})
				}
				const user = await knex('users').where('id', '=', id);
				if(await bcrypt.compare(oldpassword, user[0].password)){
					await knex('users').update({password}).where({id})
				}
			}
			const userNew = await knex.select('username', 'investorProfile', 'cash').from('users').where('id', '=', id);

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
	},
	
	async indexOne(req,res,next){
		const {id} = req.params
		try{
			const user = await knex.select('username', 'investorProfile', 'cash').from('users').where('id', '=', id);
			return res.status(200).json({user})
		}catch(error){
			next(error)
		}
	}
}