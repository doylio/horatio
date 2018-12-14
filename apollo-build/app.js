//Libraries
const express = require('express')
const fs = require('fs')

//Local imports
const f = require('./functions')
const o = require('./objects')

//Server declarations
const app = express.Router();

//Routers
const text = require('./routers/text')
const play = require('./routers/play')
const character = require('./routers/character')
const monologue = require('./routers/monologue')

//Routes
app.use('/text', text)
app.use('/play', play)
app.use('/character', character)
app.use('/monologue', monologue)
app.use('/', express.static('shakespear-io/public'))
 
//All other routes
app.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})

module.exports = app