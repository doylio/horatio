//Libraries
const express = require('express')

//Local imports
const f = require('../functions')
const o = require('../objects')


const plays = express.Router()

plays.get('/', async function(req, res) {
	try {
		const response = new o.Response(req)
		const play_list = await f.getPlays()
		response.addData(play_list)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})

plays.get('/:play', async function(req, res) {
	try {
		const response = new o.Response(req)
		const { play } = req. params
		const play_list = await f.getPlays(play)
		response.addData(play_list)
		res.send(response)
	} catch(e) {
		f.logError(e, req, res)
	}
})


plays.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})

module.exports = plays
