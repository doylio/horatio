//Libraries
const express = require('express')

//Local imports
const f = require('../functions')
const o = require('../objects')


const monologue = express.Router()

monologue.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { char } = req.query
		const SQLParams = { char }
		let monologues = await f.getMonologues(SQLParams)
		let rawText = await f.getMonologueText(monologues)
		let formatted_text = await f.packLines(rawText)
		response.addData(formatted_text)
		res.send(response)
	} catch (e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})

monologue.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { char } = req.query
		const { play } = req.params
		const SQLParams = { char, play }
		let monologues = await f.getMonologues(SQLParams)
		let rawText = await f.getMonologueText(monologues)
		let formatted_text = await f.packLines(rawText)
		response.addData(formatted_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})



module.exports = monologue

