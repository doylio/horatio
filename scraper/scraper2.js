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

//Lists
const playNames = require('./playNames')

//Main function
// Promise.all(playNames.map(addPlayToDatabase)).then(finish)


scrapeData('allswell').then(finish)

function finish() {
	console.log("\n\tData scrape complete!\n")
	process.exit(0)
}

async function addPlayToDatabase(title) {
	try{
		//Check for play in public.plays
		let play_id = await pg('plays').select('id').where({name: title})
		if(await play_id.length === 0) {
			console.log(`${title}: Adding to public.plays`)
			play_id = (await pg('plays').insert({name: title}, 'id'))[0]
		} else {
			play_id = (await play_id)[0].id
		}
		let play_text = await scrapeData(title)

		console.log(`${title}: Adding lines to public.text...`)
		for(let i = 0; i < await play_text.length; i++){
			await addLineToTextTable(title, play_id, (await play_text)[i])
		}
	} catch (reason) {
		logError(reason)
	}
}

//Adds a line to public.text
async function addLineToTextTable(title, play_id, nextLine){
	try {
		//Checks for character in public.characters
		let character_id = await pg('characters').select('id').where({name: nextLine.character, play_id})
		if(await character_id.length === 0) {
			console.log(`${title}: Adding character ${nextLine.character} to public.characters`)
			character_id = (await pg('characters').insert({name: nextLine.character, play_id: play_id}, 'id'))[0]
		} else {
			character_id = (await character_id)[0].id
		}

		//Adds the line
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
		logError(reason)
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
		uri: `https://www.opensourceshakespeare.org/views/plays/play_view.php?WorkID=allswell&Scope=entire&pleasewait=1&msg=pl`,
		transform: function (body) {
			return cheerio.load(body)
		}
	}
	
	try {
		//Parses each line into Line object, then adds to text array
		const text = []
		const $ = await rp(options)
		$('#container').children('div[align="center"]').first().children('div').children('a')  .last()/*Take this out later*/  
			.each((i, elem) => {
				let [act, scene] = $(elem).attr('id').split(',')
				act = Number(act.slice(1))
				scene = Number(scene.slice(1))
				console.log(act, scene)
				$(elem).next().next().next().next().children().children().children().children().children().each((index, el) => {
					if($(el).is('p')) {
						console.log('p')
					} else if($(el).is('ul')) {
						console.log('lines')
					}
				})
				
			})
		

	} catch (reason) {
		logError(reason)
	}
}

function logError(reason, errorType, variables) {
	console.error(reason)
	if(errorType) {
		const now = new Date().toString()
		let log = `${now}:  ${errorType}\n\nVariables:\n`
		if(variables) {
			Object.keys(variables).forEach((key) => {
				log += `${key}:  ${variables[key]}\n`
			})
		}
		log += "\n" + reason + "\n\n\n"
		fs.appendFile('error.log', log, (err)=> {
			if(err) {
				console.error(err)
			}
		})
	}
}