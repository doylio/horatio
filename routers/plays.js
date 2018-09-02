//Dependancies
const express = require('express')
const f = require('../functions')
const o = require('../objects')

//Database
const pg = require('knex')({
	client: 'pg',
	version: '10',
	connection: {
		host: '127.0.0.1',
		user: 'horatio',
		password: 'GoodnightSweetPrince',
		database: 'ShakespearIO'
	}
});

const plays = express.Router()

plays.get('/', async function(req, res) {
	try {
		const play_list = await pg('plays').select('full_name', 'id', 'key', 'year_published', 'description')
		const response = new o.Response(req)
		response.addData(play_list)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

plays.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		console.log(play_data)
		const play = await pg('plays')
			.select('full_name', 'id', 'key', 'year_published', 'description')
			.where({id: play_data.id})
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


plays.get('*', (req, res) => {
	res.status(404).send("Invalid url")
})

module.exports = plays
