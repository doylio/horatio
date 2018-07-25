/*
ERRORS IN PARSING
	1)  First half of name counted as part of previous speaker's line
	2)  Second half of name counted as part of line
	3)  [To HELENA] type stage directions -- DONE
	4)  "" characters -- DONE
	5)  Prologues counted as characters -- DONE
	6)  Character called '& C' -- DONE
	7)  Stage directions at start of scene counted as lines
	8)  Reassign "ANTIPHOLUS" lines to "A of S" and "A of E" respectively -- DONE
*/

//Dependancies
const falseLines = require('./falseLines.js')

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

//Fixes Performed

affectAllLines()
// renameCharacter("comedy_errors", "OF EPHESUS", "ANTIPHOLUS OF EPHESUS")
// renameCharacter("comedy_errors", "OF SYRACUSE", "ANTIPHOLUS OF SYRACUSE")
// antipholusFix()
// renameCharacter('1henryvi', "OF WINCHESTER", "BISHOP OF WINCHESTER")
// renameCharacter("1henryvi", "OF AUVERGNE", "COUNTESS OF AUVERGNE")
// renameCharacter("1henryvi", "PLANTAGENET", "RICHARD PLANTAGENET")
// reassignLines("asyoulikeit", 2, 5, 35, 41, "ALL")
// renameCharacter("henryviii", "", "PROLOGUE")
// renameCharacter("lll", "ADRIANO DE ARMADO", "DON ADRIANO DE ARMADO")
// renameCharacter("measure", "", "Boy")
// renameCharacter("pericles", "", "GOWER")
// renameCharacter("romeo_juliet", "", "PROLOGUE")
// renameCharacter("timon", "", "TIMON")
// renameCharacter("troilus_cressida", "", "PROLOGUE")
// renameCharacter("1henryvi", "", "Master-Gunner")
// editLine("1henryvi", 1, 4, 1, "Sirrah, thou know'st how Orleans is besieged,")
// reassignLines("midsummer", 5, 1, 113, 122, "QUINCE")
// reassignLines("midsummer", 5, 1, 131, 155, "QUINCE")
// renameCharacter("merry_wives", "& C", "SHALLOW, PAGE, ETC")
// renameCharacter("coriolanus", "AEdile", "Aedile")
// reassignLines("measure", 2, 4, 39, 39, "ANGELO")
// editLine("measure", 2, 4, 39, "As long as you or I yet he must die.")


async function affectAllLines() {
	let text
	try {
		text = await pg('text').select()
	} catch(reason) {
		console.error(reason)
	}

	//ALL LINES FUNCTIONS
	text.forEach(removeSquareBrackets)
	text.forEach(removeFalseLines)
}


//OTHER FUNCTIONS
async function renameCharacter(playName, currentName, newName) {
	try {
		let play_id = await getPlayId(playName)

		let returned = await pg('characters').where({play_id, name: currentName}).update({name: newName}, "name")
		console.log(`Renamed ${currentName} to ${await returned} in ${playName}`)
	} catch(reason){
		console.error(reason)
	}
}

async function editLine(playName, act, scene, line_no, editedLine) {
	try {
		let play_id = await getPlayId(playName)
		let success = await pg('text')
						.where({ play_id, act, scene, line_no })
						.update({ line: editedLine })
		console.log(`Edited ${await success} line in ${playName}`)
	} catch(reason) {
		console.error(reason)
	}
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
	let data = await pg('characters')
				.select('characters.id')
				.innerJoin('plays', 'plays.id', 'characters.play_id')
				.where({'plays.name': playName, 'characters.name': characterName})
	if(await data.length) {
		return data[0].id
	} else {
		return undefined
	}
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


async function reassignLines(playName, act, scene, first_line_no, last_line_no, characterName) {
	try {
		let play_id = await getPlayId(playName)
		let character_id = await getCharacterId(characterName, playName)
		if(await character_id === undefined) {
			character_id = await addCharacter(char(characterName, playName))
		}
		let success = await pg('text')
						.where({ play_id, act, scene })
						.where("line_no", ">=", first_line_no)
						.where("line_no", "<=", last_line_no)
						.update({ character_id })
		console.log(`Reassigned ${await success} lines to ${await characterName}`)
	} catch(reason){
		console.error(reason)
	}
}


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
			let character_id = aOfEph_id[0].id
			let { act, scene, line_no } = antipholus_lines[i]
			if(act === 3 && scene === 2) {
				character_id = aOfSyr_id[0].id
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

function isNextLine(line1, line2) {
	return !(
		line1 === undefined 
		|| line1.play_id !== line2.play_id 
		|| line1.act !== line2.act 
		|| line1.scene !== line2.scene 
		|| line1.line_no + 1 !== line2.line_no
	) 
}