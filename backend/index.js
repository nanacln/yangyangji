// var app = require('express')();
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// app.get('/', function(req, res){
//   res.sendFile(__dirname + '/index.html');
// });

// io.on('connection', function(socket){
//   console.log('a user connected');
// });

// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });

var fs = require('fs')
var path = require('path')
var formidable = require('formidable')
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
//引入mongodb
// const { MongoClient } = require('mongodb') //定义数据库连接的地址
const mongoose = require('mongoose')
// mongoose.connect('mongodb://106.14.172.134:27017/yangyangji', {
mongoose.connect('mongodb://nana:123456@127.0.0.1:30000/yangyangji', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
const GrowUpRecordSchema = mongoose.Schema({
	userId: Number,
	content: String,
	nickName: String,
	role: String,
	imgs: String,
	comments:String,
	createTime:Number,
	id:Number
})
const GrowUpRecord = mongoose.model(
	'GrowUpRecord',
	GrowUpRecordSchema,
	'GrowUpRecord'
)

const userSchema = mongoose.Schema({
	username: String,
	password: String,
	role: String,
	nickName: String,
	userId: Number,
	avatar: String,
	
})
const UserList = mongoose.model('UserList', userSchema, 'UserList')

const bodyParser = require('body-parser')
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(bodyParser.json({limit: '10mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({limit: '10mb', extended: true })); // for parsing application/x-www-form-urlencoded
// const url = 'mongodb://127.0.0.1:27017'
//定义要操作的数据库
// const dbName = 'yangyangji'
app.use('', express.static('static'))
//实例化Mongoclient传入数据库连接地址
// const client = new MongoClient(url, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// })
io.on('connection', function (socket) {
	console.log('a user connected')
	socket.on('chat message', function (msg) {
		console.log('message: ' + msg)
	})
})
//配置路由
app.get('/api/recordList', function (req, res) {
	let { pageSize, pageNo } = req.query
	pageSize = Number(pageSize)
	pageNo = Number(pageNo)
	GrowUpRecord.countDocuments({}, (err, count) => {
		GrowUpRecord.find({})
		.sort({ id: -1 })
			.limit(pageSize)
			.skip(pageSize * (pageNo - 1))
			.exec((err, data) => {
				if (err) {
					console.log('查询成长记录出错', err)
					return
				}
				res.send({
					data: {
						list: data,
						count,
						pageNo,
						pageSize,
						totalPage: Math.ceil(count / pageSize),
					},
					code: 200,
					msg: '请求成功',
				})
			})
	})
	// MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
	// 	client.connect(err => {
	// 		if (err) {
	// 			console.log(err)
	// 			return
	// 		}
	// 		console.log('数据库连接成功')
	// 		let db = client.db(dbName)
	// 		let { pageSize, pageNo } = req.query
	// 		console.log(pageSize, pageNo, 999999)
	// 		// debugger
	// 		pageSize = Number(pageSize) || 6
	// 		pageNo = Number(pageNo) || 1
	// 		db.collection('GrowUpRecord')
	// 			.find({})
	// 			.count(function (err, count) {
	// 				db.collection('GrowUpRecord')
	// 					.find({})
	// 					.limit(pageSize)
	// 					.skip(pageSize * (pageNo - 1))
	// 					.toArray((err, data) => {
	// 						console.log(data, 1111)
	// 						//操作数据库完毕以后一定要关闭数据库连接
	// 						client.close()
	// 						res.send({
	// 							data: {
	// 								list: data,
	// 								count,
	// 								pageNo,
	// 								pageSize,
	// 								totalPage: Math.ceil(count / pageSize),
	// 							},
	// 							code: 200,
	// 							msg: '请求成功',
	// 						})
	// 					})
	// 			})

	// 		//1、查找数据
	// 		// db.collection('TBLUser')
	// 		// 	.find({})
	// 		// 	.toArray((err, data) => {
	// 		// 		console.log(data, 1111)
	// 		// 		//操作数据库完毕以后一定要关闭数据库连接
	// 		// 		client.close()
	// 		// 		res.send(data)
	// 		// 	})
	// 	})
	// })
})
app.post('/api/record/add', (req, res) => {
	var body = req.body
	
	GrowUpRecord.find({})
	.sort({ id: -1 })
	.exec((err, data) => {
		body.id = data[0] ? data[0].id + 1 : 1
		body.createTime=new Date().getTime()
		const recordItem = new GrowUpRecord(body)
		recordItem.save(err => {
			if (err) {
				console.log(err, '添加宝宝记失败')
				return
			}
			res.send({ code: 200, msg: '请求成功', data: '添加成功' })
		})
	})
	
	
})
app.post('/api/record/comments', (req, res) => {
	var body = req.body
	console.log(body,body.id)
	GrowUpRecord.find({id:Number(body.id)})
	.exec((err, data) => {
		if(data&&data[0]){
			let arr=[]
			let obj={...body}
			delete obj.id
			if(data[0].comments){
				arr=JSON.parse(data[0].comments)
				arr.push(obj)
			}else{
				arr=[obj]
			}

			GrowUpRecord.updateOne(
				{ id: Number(body.id) },
				{ $set: { comments: JSON.stringify(arr) } },
				(err, data) => {
					if (err) {
						console.log(err)
						return
					}
					res.send({
						code: 200,
						msg: '评论成功',
						data: '',
					})
				}
			)
		}
	})
	
	
})
app.post('/api/upload', (req, res) => {
	var form = new formidable.IncomingForm()
	form.parse(req, function (error, fields, files) {
		console.log(files, files.file)
		let name =
			'/imgs/' + Math.floor(Math.random() * 100) + files.file.name
		fs.writeFileSync('static'+name, fs.readFileSync(files.file.path))
		// let name = 'static/imgs/'
		// let prefix = 'http://localhost:8666/'
		res.send({
			code: 200,
			msg: '请求成功',
			data:  name,
		})
	})
	// var writeStream = fs.createWriteStream('/static/imgs/11.jpg')
	// writeStream.write()
})
app.post('/api/register', (req, res) => {
	var body = req.body
	UserList.countDocuments({ username: body.username }, (err, count) => {
		if (count > 0) {
			res.send({
				code: 201,
				msg: '用户名已存在',
				body: '',
			})
		} else {
			UserList.find({})
				.sort({ userId: -1 })
				.exec((err, data) => {
					body.userId = data[0] ? data[0].userId + 1 : 1
					const user = new UserList(body)
					user.save(err => {
						if (err) {
							console.log(err, 111)
							return
						}
						res.send({ code: 200, msg: '请求成功', data: '添加成功' })
					})
				})
		}
	})
	
})
app.post('/api/login', (req, res) => {
	const { username, password } = req.body
	UserList.find({ username, password }).exec((err, data) => {
		if (err) {
			console.log(err)
			return
		}
		if (data.length > 0) {
			const { role, userId, nickName,avatar } = data[0]
			res.send({
				data: {
					role,
					userId,
					nickName,
					avatar
				},
				code: 200,
				msg: '请求成功',
			})
		} else {
			res.send({
				data: '',
				code: 204,
				msg: '账号不存在或者密码错误',
			})
		}
	})
	
})
app.get('/api/userlist', (req, res) => {
	UserList.find({}).exec((err, data) => {
		if (err) {
			console.log(err)
			return
		}
		res.send({
			code: 200,
			msg: '请求成功',
			data,
		})
	})
	
})
app.post('/api/updateUser', (req, res) => {
	const { userId, nickName, role } = req.body
	UserList.updateOne(
		{ userId: Number(userId) },
		{ $set: { nickName: nickName, role: role } },
		(err, data) => {
			if (err) {
				console.log(err)
				return
			}
			res.send({
				code: 200,
				msg: '修改成功',
				data: '',
			})
		}
	)

})
app.post('/api/uploadUserAvatar', (req, res) => {
	const path = '/imgs/' + Date.now() + '.png'
	const base64 = req.body.file.replace(/^data:image\/\w+;base64,/, '') //去掉图片base64码前面部分data:image/png;base64
	const dataBuffer = new Buffer(base64, 'base64') //把base64码转成buffer对象，
	// let prefix = 'http://localhost:8666/'
	fs.writeFile('static'+path, dataBuffer, function (err) {
		//用fs写入文件
		if (err) {
			console.log(err)
		} else {
			UserList.updateOne(
				{ userId: Number(req.body.userId) },
				{ $set: { avatar:  path } },
				err => {
					if (err) {
						return
					}

					res.send({
						code: 200,
						msg: '请求成功',
						data:  path,
					})
				}
			)
		}
	})
})
http.listen('8666')
// app.listen('8666')

//6、连接数据库
