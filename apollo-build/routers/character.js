//Libraries
const express = require('express')

//Local imports
const f = require('../functions')
const o = require('../objects')


const characters = express.Router() 

characters.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { char } = req.query
		const SQLParams = { char }
		let characterList = await f.getCharacterList(SQLParams)
		let formatted_characters = f.packCharacters(characterList)
		response.addData(formatted_characters)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

characters.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play } = req.params
		const { char } = req.query
		const SQLParams = { play, char }
		let characterList = await f.getCharacterList(SQLParams)
		let formatted_characters = f.packCharacters(characterList)
		response.addData(formatted_characters)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


characters.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})

module.exports = characters
