//Scraper Dependancies
const rp = require('request-promise')
const cheerio = require('cheerio')
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

//Test cases
const onePlay = ['allswell']
const threePlays = ['macbeth', 'allswell', 'troilus_cressida']
const playNames = ['allswell', 'asyoulikeit', 'comedy_errors', 'cymbeline', 'lll', 'measure', 'merry_wives', 'merchant', 'midsummer', 'much_ado', 'pericles', 'taming_shrew', 'tempest', 'troilus_cressida', 'twelfth_night', 'two_gentlemen', 'winters_tale', '1henryiv', '2henryiv', 'henryv', '1henryvi', '2henryvi', '3henryvi', 'henryviii', 'john', 'richardii', 'richardiii', 'cleopatra', 'coriolanus', 'hamlet', 'julius_caesar', 'lear', 'macbeth', 'othello', 'romeo_juliet', 'timon', 'titus']



//Main function

threePlays.forEach((title) => {
	addPlayToDatabase(title);	
})



async function addPlayToDatabase(title) {
	//Check for play in public.plays
	let play_id = await pg('plays').select('id').where({name: title})
	if(await play_id.length === 0) {
		console.log(`${title}: Adding to public.plays`)
		try {
			play_id = (await pg('plays').insert({name: title}, 'id'))[0]
		} catch (reason) {
			console.error(reason)
			fs.appendFile('error.log', "---Insert Play Error---\n" 
				+ `title: ${title}\n` 
				+ reason + "\n\n", (err) => {
				if(err) {
					console.error("ERROR:  Unable to append to error.log")
				}
			})
		}
	} else {
		play_id = (await play_id)[0].id
	}

	let play_text = await scrapeData(title) 
	// let play_text = [
	// 	Line(4,6,8,"Brack", "Missus Tesman ;)"),
	// 	Line(4,6,9,"Brack", "People don't do that!"),
	// ]
	console.log(`${title}: Adding lines to public.text...`)
	for(let i = 0; i < await play_text.length; i++){
		await addLineToTextTable(title, play_id, (await play_text)[i])
	}
}

//Adds a line to public.text
async function addLineToTextTable(title, play_id, nextLine){
	//Checks for character in public.characters
	let character_id = await pg('characters').select('id').where({name: nextLine.character, play_id})
	if(await character_id.length === 0) {
		console.log(`${title}: Adding character ${nextLine.character} to public.characters`)
		try {
			character_id = (await pg('characters').insert({name: nextLine.character, play_id: play_id}, 'id'))[0]
		} catch (reason) {
			console.error(reason)
			fs.appendFile('error.log', "---Insert Character Error---\n" 
				+ `character: ${nextLine.character}`
				+ `play_id: ${play_id}` 
				+ reason + "\n\n", (err) => {
				if(err) {
					console.error("ERROR:  Unable to append to error.log")
				}
			})
		}
	} else {
		character_id = (await character_id)[0].id
	}

	//Adds the line
	try {
		const { act, scene, line_no, line } = nextLine
		await pg('text').insert({
			play_id,
			act,
			scene,
			line_no,
			character_id,
			line
		})
	} catch (reason) {
		console.error(reason)
		fs.appendFile('error.log', "---Insert Line Error---\n"
			+ `play_id: ${play_id}\n`
			+ `act: ${act}\n`
			+ `scene: ${scene}\n`
			+ `line_no: ${line_no}\n`
			+ `character_id: ${character_id}\n`
			+ `line: ${line}`
			+ reason + "\n\n", (err) => {
				if(err) {
					console.error("ERROR:  Unable to append to error.log")
				}
			})
	}
}

//Creates Line object
function Line(act, scene, line_no, character, line){
 	const obj = {
 		act,
 		scene,
 		line_no,
 		character,
 		line
 	}
 	return obj
}

//Scrapes from full play data
async function scrapeData(title) {
	console.log(`${title}: scraping data`)
	const options = {
		uri: `http://shakespeare.mit.edu/${title}/full.html`,
		transform: function (body) {
			return cheerio.load(body)
		}
	}
	
	try {
		//Parses each line into Line object, then adds to text array
		const text = []
		const $ = await rp(options)
		$('body').children().each(function(element, i) {
			if($(this).is('blockquote') && !$(this).children().is('i')) {
				const character = $(this).prev().children('b').text()
				$(this).children('a').each(function(elem) {
					const line = $(this).text()
					const lookupData = $(this).attr('name').split('.')
					const [ act, scene, line_no ] = lookupData
					text.push(new Line(Number(act), Number(scene), Number(line_no), character, line))
				})
			}
		})
		return await text
	} catch (e) {
		console.error(e)
	}
}