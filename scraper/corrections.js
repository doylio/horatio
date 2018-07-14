/*
ERRORS IN PARSING
	1)  First half of name counted as part of previous speaker's line
	2)  Second half of name counted as part of line
	3)  [To HELENA] type stage directions
	4)  "" characters, name counted as 
	5)  Prologues counted as characters
	6)  Character called '& C'
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


firstHalfNameLost("ANTIPHOLUS", "OF EPHESUS")

async function firstHalfNameLost(firstHalf, secondHalf) {
	const fullName = firstHalf + " " + secondHalf
	try {
		console.log("Retrieving lines")
		let allLines = await pg
			.from('characters')
			.innerJoin('text', 'text.character_id', 'characters.id')
			.where('characters.name', secondHalf)
			.select('text.play_id', 'text.act', 'text.scene', 'text.line_no', 'text.character_id')

		startingLines = await allLines.filter((line, i) => {
			return !isNextLine(allLines[i - 1], line)
		})

		startingLines.forEach(async function(line, i) {
			let { play_id, act, scene, line_no } = line
			let prev = await pg('text').select('line').where({
				play_id,
				act,
				scene,
				line_no: line_no - 1
			})
			if(firstHalf === await prev[0].line) {
				let properCharId = await (pg('characters').select('id').where({
					play_id,
					name: fullName
				}))[0].id
				let textBlock = await pg('text')
					.update({
						character_id: await properCharId
					})
					.where()
					.where({
						play_id, 
						act, 
						scene,
						character_id
					})


				// let success = await pg('text').where({
				// 	play_id,
				// 	act,
				// 	scene,
				// 	line_no: line_no - 1
				// }).del()
				// if(await success !== 1) {
				// 	throw new Error(`Unable to delete from play(${play_id}), ${act}.${scene}.${line_no - 1}`)
				// }

			}
		})
	} catch(err) {
		console.log(err)
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