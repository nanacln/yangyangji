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
const { MongoClient } = require('mongodb') //定义数据库连接的地址
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const url = 'mongodb://127.0.0.1:27017'
//定义要操作的数据库
const dbName = 'yangyangji'
app.use('/static', express.static('static'))
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
	console.log('888888')
	// res.writeHead(200,{ 'Content-Type': 'text/html;charset="utf-8"'});res.end('首页');
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			console.log('数据库连接成功')
			let db = client.db(dbName)
			// db.collection('GrowUpRecord').insertOne({'role':'妈妈12','cotent':'宝宝今天会唱歌啦1','imgs':''},function(err,resulet){
			//   if(err){
			//     console.log(err,111);
			//   }
			//   console.log('增加111');
			//   client.close()
			// })
			// res.send('添加成功')
			let { pageSize, pageNo } = req.query
			console.log(pageSize, pageNo, 999999)
			// debugger
			pageSize = Number(pageSize) || 6
			pageNo = Number(pageNo) || 1
			db.collection('GrowUpRecord')
				.find({})
				.count(function (err, count) {
					db.collection('GrowUpRecord')
						.find({})
						.limit(pageSize)
						.skip(pageSize * (pageNo - 1))
						.toArray((err, data) => {
							console.log(data, 1111)
							//操作数据库完毕以后一定要关闭数据库连接
							client.close()
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

			//1、查找数据
			// db.collection('TBLUser')
			// 	.find({})
			// 	.toArray((err, data) => {
			// 		console.log(data, 1111)
			// 		//操作数据库完毕以后一定要关闭数据库连接
			// 		client.close()
			// 		res.send(data)
			// 	})
		})
	})
})
app.post('/api/record/add', (req, res) => {
	var body = req.body
	console.log(body)
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			let db = client.db(dbName)
			db.collection('GrowUpRecord').insertOne(body, function (err, resulet) {
				if (err) {
					console.log(err, 111)
				}
				console.log('增加111')
				client.close()
				res.send({ code: 200, msg: '请求成功', data: '添加成功' })
			})
		})
	})
})
app.post('/api/upload', (req, res) => {
	var form = new formidable.IncomingForm()
	form.parse(req, function (error, fields, files) {
		console.log(files, files.file)
		let name =
			'static/imgs/' + Math.floor(Math.random() * 100) + files.file.name
		fs.writeFileSync(name, fs.readFileSync(files.file.path))
		// let name = 'static/imgs/'
		let prefix = 'http://localhost:8666/'
		res.send({
			code: 200,
			msg: '请求成功',
			data: prefix + name,
		})
	})
	// var writeStream = fs.createWriteStream('/static/imgs/11.jpg')
	// writeStream.write()
})
app.post('/api/register', (req, res) => {
	var body = req.body
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			let db = client.db(dbName)
			db.collection('UserList')
				.find({ username: body.username })
				.count((err, count) => {
					if (count > 0) {
						res.send({
							code: 201,
							msg: '用户名已存在',
							body: '',
						})
					} else {
						db.collection('UserList')
							.find({})
							.sort({ userId: -1 })
							.toArray((err, data) => {
								body.userId = data[0] ? data[0].userId + 1 : 1
								db.collection('UserList').insertOne(
									body,
									function (err, resulet) {
										if (err) {
											console.log(err, 111)
										}
										client.close()
										res.send({ code: 200, msg: '请求成功', data: '添加成功' })
									}
								)
							})
					}
				})
		})
	})
})
app.get('/api/login', (req, res) => {
	const { username, password } = req.query
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			let db = client.db(dbName)
			db.collection('UserList')
				.find({ username, password })
				.toArray((err, data) => {
					console.log(data, 1111)
					//操作数据库完毕以后一定要关闭数据库连接
					client.close()
					if (data.length > 0) {
						const { role, userId, nickName } = data[0]
						res.send({
							data: {
								role,
								userId,
								nickName,
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
	})
})
app.get('/api/userlist', (req, res) => {
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			let db = client.db(dbName)
			db.collection('UserList')
				.find()
				.toArray((err, data) => {
					console.log(data, 1111)
					//操作数据库完毕以后一定要关闭数据库连接
					client.close()
					res.send({
						code: 200,
						msg: '请求成功',
						data,
					})
				})
		})
	})
})
app.post('/api/updateUser',(req,res)=>{
	const {userId,nickName,role}=req.body
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			let db = client.db(dbName)
			db.collection('UserList')
				.updateOne({"userId":Number(userId)},{$set:{"nickName":nickName,"role":role}},(err,data)=>{
					if(err){
						console.log('修改失败');
					}
					res.send({
						code: 200,
						msg: '修改成功',
						data:'',
					})
				})
				
		})
	})
})
http.listen('8666')
// app.listen('8666')

//6、连接数据库
