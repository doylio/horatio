/*
ERRORS IN PARSING
	1)  Unused characters
	2)  Half of name counted as part of line -- DONE
	3)  [To HELENA] type stage directions -- DONE
	4)  "" characters -- DONE
	5)  Prologues counted as characters -- DONE
	6)  Unconnected incorrect characters -- DONE
	7)  Stage directions at start of scene counted as lines -- DONE
	8)  Reassign "ANTIPHOLUS" lines to "A of S" and "A of E" respectively -- DONE
	9)  Empty lines
	10) Lines where the entire name is the beginning of the line -- DONE
	11) Identical Characters or Characters who are identical with extra spaces or tabs
	12) Capitalize all characters
	13) Fix scenes 3.6 and 5.6 in Pericles
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

// fillInGaps()

// Promise.all([
// 	affectAllLines()
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
	// reassignLines("pericles", 1, 0, 1, 42, "GOWER")
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
	// reassignLines("hamlet", 4, 2, 2, 2, "GUILDENSTERN")
	// reassignLines("lll", 5, 2, 418, 437, "BIRON")
	// editLine("lll", 5, 2, 418, "Here stand I lady, dart thy skill at me;")
	// reassignLines("taming_shrew", 3, 2, 221, 223, "KATHARINA")
	// reassignLines("merchant", 3, 5, 84, 85, "LORENZO")
	// editLine("asyoulikeit", 4, 3, 140, "'Twas I; but 'tis not I. I do not shame")
	// reassignLines("asyoulikeit", 4, 3, 140, 142, "OLIVER")
	// editLine("lear", 1, 2, 55, "brother,	EDGAR.'")
	// reassignLines("lear", 1, 2, 55, 60, "GLOUCESTER")
	// editLine("1henryiv", 5, 4, 45, "Cheerly, my lord how fares your grace?")
	// reassignLines("1henryiv", 5, 4, 45, 47, "PRINCE HENRY")
	// editLine("measure", 4, 3, 49, "Friar, not I. I have been drinking hard all night,")
	// reassignLines("measure", 4, 3, 49, 52, "BARNARDINE")
	// editLine("measure", 4, 4, 870, "is too soft for him, say I draw our throne into a")
	// reassignLines("measure", 4, 4, 870, 871, "AUTOLYCUS")
	// renameCharacter("timon", "Jeweller:", "Jeweller")
	// mergeCharIntoChar("2henryiv", "KING HENRY V", "PRINCE HENRY")
	// editLine("tempest", 3, 2, 38, "Marry, will I kneel and repeat it; I will stand,")
	// reassignLines("tempest", 3, 2, 38, 39, "STEPHANO")
	// editLine("lll", 5, 2, 941, "Mocks married men; for thus sings he, Cuckoo;")
	// editLine("lll", 5, 2, 949, "Mocks married men; for thus sings he, Cuckoo;")
	// reassignLines("lll", 5, 2, 941, 968, "DON ADRIANO DE ARMADO")
	// editLine("lear", 2, 1, 9, "Not I pray you, what are they?")
	// reassignLines("lear", 2, 1, 9, 9, "EDMUND")
	// editLine("othello", 1, 1, 99, "Not I, what are you?")
	// reassignLines("othello", 1, 1, 99, 99, "BRABANTIO")
	// editLine("othello", 1, 2, 33, "Not I, I must be found:")
	// reassignLines("othello", 1, 2, 33, 35, "OTHELLO")
	// editLine("2henryiv", 2, 4, 144, "Not I, I tell thee what, Corporal Bardolph, I could")
	// reassignLines("2henryiv", 2, 4, 144, 145, "PISTOL")
	// renameCharacter("richardiii", "of BUCKINGHAM", "Ghost of BUCKINGHAM")
	// renameCharacter("richardiii", "of young Princes", "Ghosts of young Princes")
	// renameCharacter("richardiii", "of King Henry VI", "Ghost of King Henry VI")
	// renameCharacter("richardiii", "of Prince Edward", "Ghost of Prince Edward")
	// renameCharacter("henryviii", "Old Lady:", "Old Lady")
	// renameCharacter("cymbeline", "Posthumus Leonatus", "POSTHUMUS LEONATUS")
	// mergeCharIntoChar("3henryvi", "PRINCE", "PRINCE EDWARD")
	// editLine("asyoulikeit", 3, 3, 63, "Proceed, proceed, I'll give her.")
	// reassignLines("asyoulikeit", 3, 3, 63, 63, "JAQUES")
	// mergeCharIntoChar("winters_tale", "Shepard", "Shepherd")
	// editLine("henryv", 2, 3, 17, "sir John!' quoth I 'what, man! be o' good")
	// reassignLines("henryv", 2, 3, 17, 26, "Hostess")
	// editLine("much_ado", 3, 2, 16, "So say I methinks you are sadder.")
	// reassignLines("much_ado", 3, 2, 16, 16, "LEONATO")
	// editLine("cymbeline", 4, 4, 57, "So Say I amen.")
	// reassignLines("cymbeline", 4, 4, 57, 57, "ARVIRAGUS")
	// editLine("merry_wives", 2, 1, 84, "So will I if he come under my hatches, I'll never")
	// reassignLines("merry_wives", 2, 1, 84, 88, "MISTRESS PAGE")
	// editLine("julius_caesar", 1, 1, 63, "This way will I disrobe the images,")
	// reassignLines("julius_caesar", 1, 1, 63, 64, "FLAVIUS")
	// editLine("asyoulikeit", 5, 4, 191, "To see no pastime I what you would have")
	// reassignLines("asyoulikeit", 5, 4, 191, 192, "JAQUES")
	// editLine("allswell", 3, 2, 24, "to you.  Your unfortunate son,")
	// editLine("allswell", 3, 2, 25, "Bertram.")
	// reassignLines("allswell", 3, 2, 24, 30, "COUNTESS")
	// editLine("titus", 5, 1, 157, "Welcome, AEmilius what's the news from Rome?")
	// reassignLines("titus", 5, 1, 157, 157, "LUCIUS")
	// editLine("richardii", 3, 2, 63, "Welcome, my lord, how far off lies your power?")
	// reassignLines("richardii", 3, 2, 63, 63, "KING RICHARD II")
	// editLine("richardii", 5, 6, 5, "Welcome, my lord, what is the news?")
	// reassignLines("richardii", 5, 6, 5, 5, "HENRY BOLINGBROKE")
	// editLine("measure", 4, 3, 172, "Yes, marry, did I but I was fain to forswear it;")
	// reassignLines("measure", 4, 3, 172, 173, "LUCIO")
// ]).then(finish)
periclesFix()


function finish() {
	console.log("\n\tCorrections to data complete!\n")
	process.exit(0)
}


async function fillInGaps() {
	try{
		let text = await pg('text')
						.select('play_id', 'act', 'scene')
						.groupBy('play_id', 'act', 'scene')
		text.forEach()
	} catch(reason) {
		console.error(reason)
	}
}

async function fillGapsRecursive(entry){
	let { play_id, act, scene } = entry
	let prevLine = await pg('text').where({play_id, act, scene, line_no: line_no - 1})
}

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


async function renameCharacter(playName, currentName, newName) {
	try {
		let play_id = await getPlayId(playName)

		let returned = await pg('characters').where({play_id, name: currentName}).update({name: newName}, "name")
		console.log(`Renamed ${currentName} to ${await returned} in ${playName}`)
	} catch(reason){
		console.error(reason)
	}
}

async function updateScene(play_id, act, scene, newScene) {
	try{
		let returned = await pg('text')
							.where({ play_id, act, scene })
							.update({scene: newScene})
		console.log(`Moved ${await returned} lines Act ${act} Scene ${scene} to Act ${act} Scene ${newScene}`)
		return returned
	} catch(reason) {
		console.error(reason)
	}
}

async function periclesFix() {
	try{
		let play_id = await getPlayId('pericles')
		updateScene(await play_id, 3, 0, 5)
		updateScene(await play_id, 5, 6, 0)
		// let returned = await pg('text')
		// 						.where({ play_id, act: 3, scene: 0 })
		// 						.where('line_no', '>', 160)
		// 						.update({scene: 1})
		// console.log(`Moved ${await returned} other troublesome lines in pericles`)
	} catch(reason) {
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

async function mergeCharIntoChar(playName, fromChar, toChar) {
	try {
		const from_id = await getCharacterId(fromChar, playName)
		const to_id = await getCharacterId(toChar, playName)

		const success = await pg('text')
							.where({character_id: from_id})
							.update({character_id: to_id})
		console.log(`Reassigned ${await success} lines to ${toChar}`)
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