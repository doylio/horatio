
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
	this.Error = (msg) => {
		this.error = msg
	}
}

const Play = function (play_data) {
	this.play_name = play_data.full_name
	this.play_id = play_data.play_id
	this.play_key = play_data.key
}
module.exports.Play = Play


module.exports.Scene = function (data) {
	this.act = data.act
	this.scene = data.scene
	this.text = []
}

module.exports.Character = function (data) {
	this.name = data.name
	this.id = data.id
	this.age = data.age
	this.gender = data.gender
	this.play = new Play(data)
}