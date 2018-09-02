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
		
	} catch(e) {
		f.logError(e, req)
	}
})

module.exports = characters
