//Libraries
const express = require('express')
const fs = require('fs')

//Local imports
const f = require('./functions')
const o = require('./objects')

//Database
const pg = require('knex')({
	client: 'pg',
	version: '10',
	connection: {
		host: 'localhost',
		user: 'horatio',
		password: 'GoodNightSweetPrince',
		database: 'shakespeario'
	}
});

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
app.use('/', express.static('public'))
 
//All other routes
app.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})

module.exports = app


/*
Still to do:
- Add character documentation
- Add character and play details (age, gender, etc)
- Add monologue table and info
- Clean up documentation
- Add query strings to examples

*/