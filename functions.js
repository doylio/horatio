//Dependancies
const fs = require('fs')
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
const logError = function(err, req) {
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
}
module.exports.logError = logError


const getCharName = async function(id) {
	if(isNaN(id)) {
		return id.toUpperCase()
	} else {
		try {
			let charName = await pg('characters').select('name').where({id})
			return charName[0].name
		} catch(e) {
			logError(e)
		}
	}
}
module.exports.getCharName = getCharName

const getScenes = async function(play_id, act) {
	try {
		let whereParams = {play_id}
		if(act) {
			whereParams.act = act
		}

		let scenes = await pg('text')
			.select('play_id', 'act', 'scene')
			.where(whereParams)
			.groupBy('play_id', 'act', 'scene')
			.orderByRaw('act, scene')
		return scenes
	} catch (e) {
		logError(e)
	}
}
module.exports.getScenes = getScenes


const packSceneText = async function({play_id, act, scene, firstLine, lastLine}) {
	const whereParams = { play_id, act, scene }
	if(firstLine && !lastLine) {
		whereParams.line_no = firstLine
	}
	try {
		let dbLines
		if(lastLine) {
			dbLines	= await pg('text')
				.where(whereParams)
				.whereBetween('line_no', [firstLine, lastLine])
				.orderBy('line_no')
		} else {
			dbLines = await pg('text')
				.where(whereParams)
				.orderBy('line_no')
		}

		let text = []
		let currentCharId = dbLines[0].character_id
		let currentBlock = o.speechBlock(await getCharName(currentCharId))
		for(let i = 0; i < dbLines.length; i++) {
			if(dbLines[i].character_id !== currentCharId) {
				text.push(currentBlock)
				currentCharId = dbLines[i].character_id
				currentBlock = o.speechBlock(await getCharName(currentCharId))
			}
			currentBlock.lines.push({
				line_no: dbLines[i].line_no,
				line: dbLines[i].line
			})
		}
		text.push(currentBlock)

		return {
			act,
			scene,
			text,
		}
	} catch(e) {
		logError(e)
	}
}
module.exports.packSceneText = packSceneText

module.exports.packPlayText = async function(play_id, act) {
	try {
		const requestedScenes = await getScenes(play_id, act)
		let play_text = []
		for(let i = 0; i < requestedScenes.length; i++) {
			play_text[i] = await packSceneText(requestedScenes[i])
		}

		return play_text
	} catch(e) {
		logError(e)
	}
}

module.exports.getPlayData = async function(keyOrId) {
	try {
		let whereParams
		if(isNaN(keyOrId)) {
			whereParams = {key: keyOrId}
		} else {
			whereParams = {id: keyOrId}
		}
		let play_data = await pg('plays').select().where(whereParams)

		return await play_data[0]
	} catch(e) {
		logError(e)
	}
}


module.exports.getLines = async function(play_id, act, scene, firstLine, lastLine) {
	try {
		let requestedLines
		if(lastLine) {
			requestedLines = await pg('text').where({play_id, act, scene}).where('line_no', '>=', firstLine).where('line_no', '<=', lastLine)
		} else {
			requestedLines = await pg('text').where({play_id, act, scene, line_no: firstLine})
		}
	} catch(e) {
		logError(e)
	}
}

module.exports.charFilter = async function(play_text, character_id) {
	if(character_id) {
		try {
			const character = await getCharName(character_id)
			play_text = play_text.map(scene => {
				scene.text = scene.text.filter(block => block.character === character)
				return scene
			})
			return play_text
		} catch(e) {
			logError(e)
		}
	} else {
		return play_text
	}
}