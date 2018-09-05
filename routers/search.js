//Dependancies
const express = require('express')
const Fuse = require('fuse.js')
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

const search = express.Router()

search.get('/', async function(req, res) {
	try {
		res.send('search')
	} catch(e) {
		f.logError(e, req, res)
	}
})


search.get('*', (req, res) => {
	res.status(404).send("Invalid url")
})

module.exports = search
