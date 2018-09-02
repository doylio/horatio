//Dependancies
const fs = require('fs')
const f = require('./functions')
const errorCode = require('./errorCodes')

//Objects
module.exports.speechBlock = (characterName) => {
		return {
			character: characterName,
			lines: []
		}
	}

module.exports.Response = function(req) {
	this.URL = req.originalUrl
	this.time = new Date().toString()
	this.addData = (data) => {
		this.data = data
	}
	this.Error = (n) => {
		this.error = errorCode[n]
	}
}

module.exports.Play = function (play_data) {
	this.play_name = play_data.full_name
	this.play_id = play_data.id
	this.play_key = play_data.key
	this.addText = (text) => {
		this.play_text = text
	}
}