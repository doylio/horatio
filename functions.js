//Dependancies
const fs = require('fs')


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

const logError = function(err, req) {

	const now = new Date().toString()
	const log
	if(req) {
		log = `${now}: ${req.method} ${req.url}`
	} else {
		log = `${now}`
	}
	fs.appendFile('error.log', log + '\n\t' + err + '\n', (err) => {
		if(err) {
			console.error('Unable to append to error.log')
		}
	});
}

module.exports.logError = logError

const getCharName = async function(character_id) {
	try {

	} catch(e) {
		logError(e)
	}
}


module.exports.packSceneData = async function(play_id, act, scene) {
	try {
		let dbLines = await pg('text').where({ play_id, act, scene }).orderBy('line_no')
		let textArray = []

		let currentCharId = dbLines[0].character_id
		for(let i = 0; i < dbLines.length; i++) {

		}

	} catch(e) {
		logError(e)
	}
}


module.exports.getPlayId = async function(key) {
	try {
		let play_id = await pg('plays').select('id').where({key})
		return play_id[0].id
	} catch(e) {
		logError(e)
	}
}