//Libraries
const express = require('express')

//Local imports
const f = require('../functions')
const o = require('../objects')


const text = express.Router()

text.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { char, search } = req.query
		const SQLParams = { char }
		let rawData = await f.getText(SQLParams)
		if(search) {
			rawData = f.searchText(rawData, search)
		}		
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch (e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})


text.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play } = req.params
		const { char, search } = req.query
		const SQLParams = { play, char}
		let rawData = await f.getText(SQLParams)
		if(search) {
			rawData = f.searchText(rawData, search)
		}
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch (e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})

text.get('/:play/:act([0-9]+)', async function(req, res){
	try {
		const response = new o.Response(req)
		const { play, act } = req.params
		const { char, search } = req.query
		const SQLParams = { play, act, char }
		let rawData = await f.getText(SQLParams)
		if(search) {
			rawData = f.searchText(rawData, search)
		}
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})


text.get('/:play/:act([0-9]+)/:scene([0-9]+)', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play, act, scene } = req.params
		const { char, search } = req.query
		const SQLParams = { play, act, scene, char }
		let rawData = await f.getText(SQLParams)
		if(search) {
			rawData = f.searchText(rawData, search)
		}
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
		res.status(400).send()
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
		if(search) {
			rawData = f.searchText(rawData, search)
		}
		let packaged_text = f.packLines(rawData)
		response.addData(packaged_text)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
		res.status(400).send(e)
	}
})


text.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})


module.exports = text

