//Libraries
const express = require('express')
const fs = require('fs')

//Local imports
const f = require('./functions')
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

//Server declarations
const app = express();
const port = process.env.PORT || 3000;

//Routers
const text = require('./routers/text')
const play = require('./routers/play')
const character = require('./routers/character')
const monologue = require('./routers/monologue')

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
app.use('/play', play)
app.use('/character', character)
app.use('/monologue', monologue)
app.use('/', express.static('public'))
 
//All other routes
app.get('*', (req, res) => {
	const response = new o.Response(req)
	response.Error('Invalid URL')
	res.status(404).send(response)
})

//Start server
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})