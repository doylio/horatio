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

const characters = express.Router()

characters.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		let characterList = await f.getCharacterList(req.query.char)
		response.addData(characterList)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

characters.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const play_data = await f.getPlayData(req.params.play)
		if(!play_data) {
			response.Error(1)
			res.status(400).send(response)
		}
		let characterList = await f.getCharacterList(req.query.char, play_data.id)
		response.addData(characterList)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})






characters.get('*', (req, res) => {
	res.status(404).send("Invalid url")
})

module.exports = characters
