//Dependancies
const express = require('express');
const fs = require('fs');

//Database
const database = require('./db.js');

//Server declarations
const app = express();
const port = process.env.PORT || 3000;

/*Middleware*/
//Server log
app.use((req, res, next) => {
	const now = new Date().toString();
	const log = `${now}: ${req.method} ${req.url}`;
	fs.appendFile('server.log', log + '\n', (err) => {
		if(err) {
			console.log('Unable to append to server.log');
		}
	});
	console.log(log);
	next();
})


//Server response actions
app.get('/hamlet', (req, res) => {
	res.send(database.plays[1]);
});



//Listening on port
app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
