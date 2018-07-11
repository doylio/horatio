//Scraper Dependancies
const rp = require('request-promise')
const cheerio = require('cheerio')

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
const onePlay = ['hamlet']
const threePlays = ['macbeth', 'allswell', 'troilus_cressida']
const playNames = ['allswell', 'asyoulikeit', 'comedy_errors', 'cymbeline', 'lll', 'measure', 'merry_wives', 'merchant', 'midsummer', 'much_ado', 'pericles', 'taming_shrew', 'tempest', 'troilus_cressida', 'twelfth_night', 'two_gentlemen', 'winters_tale', '1henryiv', '2henryiv', 'henryv', '1henryvi', '2henryvi', '3henryvi', 'henryviii', 'john', 'richardii', 'richardiii', 'cleopatra', 'coriolanus', 'hamlet', 'julius_caesar', 'lear', 'macbeth', 'othello', 'romeo_juliet', 'timon', 'titus']


//TODO:  Send this data to PostgreSQL database text table
function sendToTextTable(line, title, id) {
	console.log(`${title}:  Sending to database`)
	pg.select('id').from('characters').where({name: line.character, play_id: id})
		.then(id => {
			if(id.length)
		})
}

function Line(character, quote, act, scene, line){
 	const obj = {
 		character,
 		quote,
 		act,
 		scene,
 		line
 	}
 	return obj
}

//Scrapes from full play data
async function getPlayData(play, id) {
	console.log(`${play}: scraping data`)
	const options = {
		uri: `http://shakespeare.mit.edu/${play}/full.html`,
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
					const quote = $(this).text()
					const lookupData = $(this).attr('name').split('.')
					const act = lookupData[0]
					const scene = lookupData[1]
					const line = lookupData[2]
					text.push(new Line(character, quote, act, scene, line))
				})
			}
		})
		await sendToTextTable(text[0], play, id)
	} catch (e) {
		console.log(e)
	}
}

//Inserts play into public.plays table
async function addNewPlay(title) {
	const exists = await pg('plays').count('name').where({name: title})
	if(exists[0].count === '0') {
		try {
			const id = await pg('plays').insert({name: title}, 'id')[0]
			console.log(`${title}: Inserted into public.plays`)
			getPlayData(title, id)
		} catch(error) {
			console.log(`${title}: ${error}`)
		}
	} else {
		console.log(`${title}:  Play already exists in public.plays`)
	}
}




//Main function

onePlay.forEach((title) => {
	addNewPlay(title)
})

