//Libraries
const express = require('express')
const fs = require('fs')

//Local imports
const f = require('./functions')

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

//Server declarations
const app = express();
const port = process.env.PORT || 3000;


//Routers
const text = require('./routers/text')
const plays = require('./routers/plays')
const characters = require('./routers/characters')

/*Middleware*/
	//Server log
	app.use((req, res, next) => {
		const now = new Date().toString()
		const log = `${now}: ${req.method} ${req.url}`
		fs.appendFile('server.log', log + '\n', (err) => {
			if(err) {
				console.log('Unable to append to server.log')
			}
		});
		console.log(log)
		next()
	})

	//Routes
	app.use('/text', text)
	app.use('/plays', plays)
	app.use('/characters', characters)


//Server response actions

app.get('/test', async function(req, res) {
	try {
		let data = await pg('characters')
			.select('characters.id', 'characters.name', 'characters.age', 'characters.gender', 'characters.play_id', 'plays.key', 'plays.full_name')
			.innerJoin('plays', 'plays.id', 'characters.play_id')
		res.send(data)
	} catch(e) {
		f.logError(e, req)
	}
})



//All other routes
app.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})


//Listening on port
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})
