//Dependancies
const express = require('express')
const fs = require('fs')
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




//Server response actions

app.get('/plays', async function(req, res) {
	try {
		let data = await pg('plays').select('full_name', 'id', 'key')
		res.send(data)
	} catch(e) {
		f.logError(e, req)
	}
})

app.get('/test', async function(req, res) {
	try {
		let data = await f.packPlayData(270)
		res.send(data)
	} catch(e) {
		f.logError(e, req)
	}
})


//All other routes
app.get('*', (req, res) => {
	res.send("Sorry, this is an invalid URL")
})


//Listening on port
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`)
})

