//Dependancies
const express = require('express')
const funciions = require('../functions')

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

const router = express.Router()

router.get('/:play', (req, res) => {

})


module.exports = router