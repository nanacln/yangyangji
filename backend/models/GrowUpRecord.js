const mongoose = require('mongoose')
const GrowUpRecordSchema = mongoose.Schema({
	userId: Number,
	content: String,
	nickName: String,
	role: String,
	imgs: String,
	comments:String,
	createTime:Number,
	id:Number,
	videoUrl: String,
	likes: Array
})
const GrowUpRecord = mongoose.model(
	'GrowUpRecord',
	GrowUpRecordSchema,
	'GrowUpRecord'
)
module.exports = GrowUpRecord