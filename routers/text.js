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

text.get('/:play', async function(req, res) {
	try {
		const play_data = await f.getPlayData(req.params.play)
		const play_text = await f.packPlayText(play_data.id)
		const play = new o.Play(play_data)
		play.addText(play_text)
		const response = new o.Response(req)
		response.addData(play)
		res.send(response)
	} catch (e) {
		f.logError(e, req)
	}
})

text.get('/:play/:act', async function(req, res){
	try {
		const play_data = await f.getPlayData(req.params.play)
		const play_text = await f.packPlayText(play_data.id, req.params.act)
		const play = new o.Play(play_data)
		play.addText(play_text)
		const response = new o.Response(req)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/:play/:act/:scene', async function(req, res) {
	try {
		const play_data = await f.getPlayData(req.params.play)
		const scene_index = {
			play_id: play_data.id,
			act: req.params.act,
			scene: req.params.scene
		}
		const scene_text = await f.packSceneText(scene_index)
		const play = new o.Play(play_data)
		play.addText(scene_text)
		const response = new o.Response(req)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})

text.get('/:play/:act/:scene/:lines', async function (req, res) {
	try {
		const play_data = await f.getPlayData(req.params.play)
		const [ firstLine, lastLine ] = req.params.lines.split('-')
		const scene_index = {
			play_id: play_data.id,
			act: req.params.act,
			scene: req.params.scene,
			firstLine,
			lastLine
		}
		const scene_text = await f.packSceneText(scene_index)
		const play = new o.Play(play_data)
		play.addText(scene_text)
		const response = new o.Response(req)
		response.addData(play)
		res.send(response)
	} catch(e) {
		f.logError(e, req)
	}
})




module.exports = text