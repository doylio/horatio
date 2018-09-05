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

const text = express.Router()


text.get('/test/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play } = req.params
		const { char, search } = req.query
		let textParams = { play, char}
		let rawData = await f.getText(textParams)
		//Search the stuff
		let packaged_text = await f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/test/:play/:act', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play, act } = req.params
		const { char, search } = req.query
		let textParams = { play, act, char }
		let rawData = await f.getText(textParams)
		response.addData(rawData)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/test/:play/:act/:scene', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play, act, scene } = req.params
		const { char, search } = req.query
		let textParams = { play, act, scene, char }
		let rawData = await f.getText(textParams)
		response.addData(rawData)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/test/:play/:act/:scene/:lines', async function(req, res) {
	try {
		const response = new o.Response(req)
		const [ firstLine, lastLine ] = req.params.lines.split('-')
		const { play, act, scene } = req.params
		const { char, search } = req.query
		let textParams = { play, act, scene, firstLine, lastLine, char }
		let rawData = await f.getText(textParams)
		response.addData(rawData)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { char, search } = req.query
		const SQLParams = { char }
		let rawData = await f.getText(SQLParams)
		//Search function
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch (e) {
		f.logError(e, req)
	}
})

text.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play } = req.params
		const { char, search } = req.query
		const SQLParams = { play, char}
		let rawData = await f.getText(SQLParams)
		//Search the stuff
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch (e) {
		f.logError(e, req, res)
	}
})

text.get('/:play/:act([0-9]+)', async function(req, res){
	try {
		const response = new o.Response(req)
		const { play, act } = req.params
		const { char, search } = req.query
		const SQLParams = { play, act, char }
		let rawData = await f.getText(SQLParams)
		//Search function
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


text.get('/:play/:act([0-9]+)/:scene([0-9]+)', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play, act, scene } = req.params
		const { char, search } = req.query
		const SQLParams = { play, act, scene, char }
		let rawData = await f.getText(SQLParams)
		//Search function
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

text.get('/:play/:act([0-9]+)/:scene([0-9]+)/:lines([0-9]+|[0-9]+-[0-9]+)', async function (req, res) {
	try {
		const response = new o.Response(req)		
		const { play, act, scene } = req.params
		const [ firstLine, lastLine ] = req.params.lines.split('-')
		const { char, search } = req.query
		const SQLParams = { play, act, scene, firstLine, lastLine, char }
		let rawData = await f.getText(SQLParams)
		//Search function
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


text.get('*', (req, res) => {
	res.status(404).send("Invalid url")
})


module.exports = text