//Dependancies
const fs = require('fs')
const f = require('./functions')
const errorCode = require('./errorCodes')

//Objects
module.exports.SpeechBlock = function (data) {
	this.character = data.name,
	this.character_id = data.character_id
	this.lines = []
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
	this.play_id = play_data.play_id
	this.play_key = play_data.key
	this.play_text = []
}

module.exports.Scene = function (data) {
	this.act = data.act
	this.scene = data.scene
	this.text = []
}