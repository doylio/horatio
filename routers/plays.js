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
		f.logError(e, req)
	}
})

plays.get('/:play', async function(req, res) {
	try {
		const play_data = await f.getPlayData(req.params.play)
		const play = await pg('plays')
			.select('full_name', 'id', 'key', 'year_published', 'description')
			.where({id: play_data.id})
		const response = new o.Response(req)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})


module.exports = plays
