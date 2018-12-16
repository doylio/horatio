//Libraries
const fs = require('fs')
const _ = require('lodash')
const Fuse = require('fuse.js')

//Local Imports
const o = require('./objects')


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


//Functions
const logError = function(err, req, res) {
	console.log(err)
	const now = new Date().toString()
	let log
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
	if(res) {
		res.status(400).send(err)
	}
}
module.exports.logError = logError


module.exports.searchText = function(list, searchTerm) {
	const options = {
		shouldSort: true,
		findAllMatches: true,
		threshold: 0.4,
		location: 0,
		distance: 100,
		maxPatternLength: 50,
		minMatchCharLength: 1,
		keys: [ "line" ]
	};

	const fuse = new Fuse(list, options)
	return fuse.search(searchTerm)
}


module.exports.getPlays = async function(play) {
	try {
		let whereParams = {}
		if(play) {
			if(isNaN(play)) {
				whereParams.key = play
			} else {
				whereParams.id = play
			}
		}
		let play_list = await pg('plays')
			.select('full_name', 'id', 'key', 'year_published', 'description')
			.where(whereParams)
		return play_list
	} catch(e) {
		logError(e)
	}
}


//Retrieves characters from db based on SQL parameters
module.exports.getCharacterList = async function({ char, play }) {
	try {
		let whereParams = {}
		if(char) {
			if(isNaN(char)) {
				whereParams.name = char.toUpperCase()
			} else {
				whereParams['characters.id'] = char
			}
		}
		if(play) {
			if(isNaN(play)) {
				whereParams.key = play
			} else {
				whereParams.play_id = play
			}
		}
		let charList = await await pg('characters')
			.select('characters.id', 'characters.name', 'characters.age', 'characters.gender', 'characters.play_id', 'plays.key', 'plays.full_name')
			.innerJoin('plays', 'plays.id', 'characters.play_id')
			.where(whereParams)
			.orderBy('characters.id')
		return charList
	} catch(e) {
		logError(e)
	}
}

//properly formats the data from getCharacters()
module.exports.packCharacters = function (characters) {
	let data = []
	characters.forEach((char) => {
		data.push(new o.Character(char))
	})
	return data
}

//Gets text from db, filtered by SQL parameters
const getText = async function ({ play, act, scene, first_line, last_line, char }){
	try {
		let whereParams = {}
		if(play) {
			if(isNaN(play)) {
				whereParams.key = play
			} else {
				whereParams['text.play_id'] = play
			}
		}
		if(act) {
			whereParams.act = act
		}
		if(scene) {
			whereParams.scene = scene
		}
		if(first_line && !last_line) {
			whereParams.line_no = first_line
		}
		if(char) {
			if(isNaN(char)) {
				whereParams['characters.name'] = char.toUpperCase()
			} else {
				whereParams.character_id = char
			}
		}
		let text
		if(last_line) {
			text = await pg('text')
				.innerJoin('plays', 'plays.id', 'text.play_id')
				.innerJoin('characters', 'characters.id', 'text.character_id')
				.where(whereParams)
				.whereBetween('line_no', [first_line, last_line])
				.orderByRaw('text.play_id, text.act, text.scene, text.line_no')		
		} else {
			text = await pg('text')
				.innerJoin('plays', 'plays.id', 'text.play_id')
				.innerJoin('characters', 'characters.id', 'text.character_id')
				.where(whereParams)
				.orderByRaw('text.play_id, text.act, text.scene, text.line_no')
		}
		return text
	} catch(e) {
		logError(e)
	}
}
module.exports.getText = getText

//Takes properly ordered rows from the DB, and returns a sorted JS object
module.exports.packLines = function(all_lines) {
	if(_.isEmpty(all_lines)) {
		return []
	}
	let formattedLines = []
	let currentPlay = new o.Play(all_lines[0])
	currentPlay.play_text = []
	let currentScene = new o.Scene(all_lines[0])
	let currentBlock = new o.SpeechBlock(all_lines[0])
	currentBlock.lines.push({
		line_no: all_lines[0].line_no,
		line: all_lines[0].line
	})
	for(let i = 1; i < all_lines.length; i++) {
		if(all_lines[i].character_id !== currentBlock.character_id
			|| all_lines[i].play_id !== currentPlay.play_id
			|| all_lines[i].act !== currentScene.act
			|| all_lines[i].scene !== currentScene.scene
			|| all_lines[i].line_no - 1 !== all_lines[i - 1].line_no
			
		) {
			currentScene.text.push(currentBlock)
			currentBlock = new o.SpeechBlock(all_lines[i])
		}
		if(all_lines[i].act !== currentScene.act || all_lines[i].scene !== currentScene.scene) {
			currentPlay.play_text.push(currentScene)
			currentScene = new o.Scene(all_lines[i])
		}
		if(all_lines[i].play_id !== currentPlay.play_id) {
			formattedLines.push(currentPlay)
			currentPlay = new o.Play(all_lines[i])
			currentPlay.play_text = []
		}
		currentBlock.lines.push({
			line_no: all_lines[i].line_no,
			line: all_lines[i].line
		})
	}
	currentScene.text.push(currentBlock)
	currentPlay.play_text.push(currentScene)
	formattedLines.push(currentPlay)
	return formattedLines
}


module.exports.getMonologues = async function({play, char}) {
	try {
		let whereParams = {}
		if(play) {
			if(isNaN(play)) {
				whereParams.key = play
			} else {
				whereParams.play_id = play
			}
		}
		if(char) {
			if(isNaN(char)) {
				whereParams['characters.name'] = char.toUpperCase()
			} else {
				whereParams.character_id = char
			}
		}
		// if(gender){
		// 	whereParams.gender = gender
		// }
		let monologues = await pg('monologues') 
			.select('monologues.play_id as play', 'act', 'scene', 'first_line', 'last_line')
			.innerJoin('plays', 'plays.id', 'monologues.play_id')
			.innerJoin('characters', 'characters.id', 'monologues.character_id')
			.where(whereParams)
		return monologues

	} catch(e) {
		logError(e)
	}
}

module.exports.getMonologueText = async function (monologues){
	try {
		let text = []
		for(let i = 0; i < monologues.length; i++) {
			let someText = await getText(monologues[i])
			text.push(someText)
		}
		return _.flatten(text)
	} catch(e) {
		logError(e)
	}
}

