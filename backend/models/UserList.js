
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
	username: String,
	password: String,
	role: String,
	nickName: String,
	userId: Number,
	avatar: String,
	
})
const UserList = mongoose.model('UserList', userSchema, 'UserList')
module.exports =  UserList