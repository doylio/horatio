/*
ERRORS IN PARSING
	1)  First half of name counted as part of previous speaker's line
	2)  Second half of name counted as part of line
	3)  [To HELENA] type stage directions -- DONE
	4)  "" characters, name counted as text
	5)  Prologues counted as characters
	6)  Character called '& C'
	7)  Stage directions at start of scene counted as lines
	8)  Reassign "ANTIPHOLUS" lines to "A of S" and "A of E" respectively -- DONE
*/

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

//Lists
const falseLines = ["ANTIPHOLUS", "OF SYRACUSE", "OF EPHESUS", "BISHOP"]

//Main Function

// affectAllLines()
// renameCharacter('1henryvi', "OF WINCHESTER", "BISHOP OF WINCHESTER")
// renameCharacter("comedy_errors", "OF EPHESUS", "ANTIPHOLUS OF EPHESUS")
// renameCharacter("comedy_errors", "OF SYRACUSE", "ANTIPHOLUS OF SYRACUSE")
// antipholusFix()

async function renameCharacter(playName, currentName, newName) {
	try {
		let play_id = await getPlayId(playName)

		let returned = await pg('characters').where({play_id, name: currentName}).update({name: newName}, "name")
		console.log(`Renamed ${currentName} to ${await returned} in ${playName}`)
	} catch(reason){
		console.error(reason)
	}
}

async function affectAllLines() {
	let text
	try {
		text = await pg('text').select()
	} catch(reason) {
		console.error(reason)
	}

	text.forEach(removeSquareBrackets)
	text.forEach(removeFalseLines)
}

async function removeSquareBrackets(entry) {
	const squareBracketsRegEx = new RegExp("\\[.*?\\]", "g")
	if(squareBracketsRegEx.test(entry.line)) {
		const { play_id, act, scene, line_no, line } = entry
		const newLine = line.replace(squareBracketsRegEx, "")
		try {
			let returned = await pg('text')
								.where({play_id, act, scene, line_no})
								.update({line: newLine}, "line")
			console.log(`Updating...\n\tLine: ${line}\n\tTo: ${await returned}`)
		} catch(reason) {
			console.error(reason)
		}
	}
}


async function removeFalseLines(entry){
	if(falseLines.includes(entry.line)) {
		try {
			const { play_id, act, scene, line_no } = entry
			let returned = await pg('text')
								.where({play_id, act, scene, line_no})
								.del()
			console.log(`Deleted ${await returned} row with false line`)
		} catch(reason) {
			console.error(reason)
		}
	}
}


async function getPlayId(playName){
	return (await pg('plays').select('id').where({name: playName}))[0].id
}

async function getCharacterId(characterName, playName) {
	return (await pg('characters')
				.select('characters.id')
				.innerJoin('plays', 'plays.id', 'characters.play_id')
				.where({'plays.name': playName, 'characters.name': characterName}))[0].id
}


async function addCharacter(char) {
	const { playName, name } = char
	try {
		let play_id = await getPlayId(playName)
		let returned = await pg('characters')
				.insert({
					play_id,
					name
				}, "id")
		console.log(`Added ${name} (id: ${await returned}) to ${playName}`)
		return returned[0]
	} catch (reason) {
		console.error(reason)
	}
}

function char(name, playName) {
	return {
		name,
		playName
	}
}

async function removeUnusedCharacters(){}

async function antipholusFix() {
	try {
		let play_id = await getPlayId('comedy_errors')

		let antipholus_char_id = await getCharacterId('ANTIPHOLUS', 'comedy_errors')
		let aOfSyr_id = await pg('characters').select()
								.where({name: "ANTIPHOLUS OF SYRACUSE"})
								.orWhere({name: "OF SYRACUSE"})
		let aOfEph_id = await pg('characters').select()
								.where({name: "ANTIPHOLUS OF EPHESUS"})
								.orWhere({name: "OF EPHESUS"})

		//Fixes lines attributed to character named "ANTIPHOLUS"
		let antipholus_lines = await pg('text').where({character_id: antipholus_char_id})
		
		for(let i = 0; i < (await antipholus_lines).length; i++) {
			let character_id = aOfEph_id
			let { act, scene, line_no } = antipholus_lines[i]
			if(act === 3 && scene === 2) {
				character_id = aOfSyr_id
			}
			let success = await pg('text')
								.where({
									play_id,
									act,
									scene,
									line_no
								})
								.update({
									character_id
								}, "character_id")
			console.log(`Changed line to character_id ${await success}`)
		}
	} catch(reason) {
		console.error(reason)
	}
}






// async function firstHalfNameLost(firstHalf, secondHalf) {
// 	const fullName = firstHalf + " " + secondHalf
// 	try {
// 		console.log("Retrieving lines")
// 		let allLines = await pg
// 			.from('characters')
// 			.innerJoin('text', 'text.character_id', 'characters.id')
// 			.where('characters.name', secondHalf)
// 			.select('text.play_id', 'text.act', 'text.scene', 'text.line_no', 'text.character_id')

// 		startingLines = await allLines.filter((line, i) => {
// 			return !isNextLine(allLines[i - 1], line)
// 		})

// 		startingLines.forEach(async function(line, i) {
// 			let { play_id, character_id, act, scene, line_no } = line
// 			try {
// 				let prev = await pg('text').select('line').where({
// 					play_id,
// 					act,
// 					scene,
// 					line_no: line_no - 1
// 				})
// 				if(firstHalf === await prev[0].line) {
// 					let properCharId = await pg('characters').select('id').where({
// 						play_id,
// 						name: fullName
// 					})
// 					if(properCharId.length === 0) {
// 						properCharId = (await pg('characters').insert({
// 							play_id,
// 							name: fullName
// 						}, 'id'))
// 					} else {
// 						// properCharId = properCharId[0].id
// 					}

// 					console.log(await properCharId)

// 					//Selects next line that isn't the speaker
// 					//Used to identify the block of text
// 					let subquery = pg('text').select('line_no').where({
// 						play_id,
// 						act,
// 						scene
// 					}).where("line_no", ">=", line_no).where("character_id", "!=", character_id).orderBy('line_no').limit(1)

// 					//Update character_id
// 					pg('text').where({
// 						play_id,
// 						act,
// 						scene,
// 					}).where("line_no", ">=", line_no).where('line_no', "<", subquery)
// 					.update({character_id: properCharId})

// 					//Remove false line
// 					pg('text').where({
// 						play_id,
// 						act,
// 						scene,
// 						line_no: line_no - 1
// 					}).del()
// 				}
// 			} catch (e) {
// 				console.log(e)
// 			}
// 		})
// 	} catch(err) {
// 		console.log(err)
// 	}
// }

function isNextLine(line1, line2) {
	return !(
		line1 === undefined 
		|| line1.play_id !== line2.play_id 
		|| line1.act !== line2.act 
		|| line1.scene !== line2.scene 
		|| line1.line_no + 1 !== line2.line_no
	) 
}