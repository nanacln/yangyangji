// var ws = require("nodejs-websocket")

// Scream server example: "hi" -> "HI!!!"
// var server = ws.createServer(function (conn) {
//     console.log("New connection")
//     conn.on("text", function (str) {
//         console.log("Received "+str)
//         conn.sendText(str.toUpperCase()+"!!!")
//     })
//     conn.on("close", function (code, reason) {
//         console.log("Connection closed")
//     })
// }).listen(3000)

const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yangyangji', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
const WebSocket = require('ws')
const talkSchema = mongoose.Schema({
	userId: Number,
	toUserId: Number,
	content: String,
	sendSuccess: Boolean,
	id: Number,
})
const groupTalkSchema = mongoose.Schema({
	userId: Number,
	content: String,
	id: Number,
	groupIds: String,
})
const userSchema = mongoose.Schema({
	username: String,
	password: String,
	role: String,
	nickName: String,
	userId: Number,
	avatar: String,
})
const UserList = mongoose.model('UserList', userSchema, 'UserList')
var TalkList = mongoose.model('TalkList', talkSchema, 'TalkList')
const groupList = mongoose.model('GroupList', groupTalkSchema, 'GroupList')
const server = new WebSocket.Server({ port: 3000 })

server.on('open', function open() {
	console.log('connected')
})

server.on('close', function close() {
	console.log('disconnected')
})

server.on('connection', function connection(ws, req) {
	const ip = req.socket.remoteAddress
	const port = req.socket.remotePort
	const clientName = ip + port
	console.log('%s is connected', clientName)
	// ws.name=clientName
	// 发送欢迎信息给客户端
	// ws.send('Welcome ' + clientName)

	ws.on('message', function incoming(message) {
		const msg = JSON.parse(message)
		if (msg.type === '1') {
			ws.name = msg.userId
			TalkList.find({ toUserId: Number(msg.userId), sendSuccess: false }).exec(
				(err, data) => {
					if (err) {
						console.log(err)
						return
					}
					if (data.length < 1) return
					let unreadMsg = {}
					for (let i = 0; i < data.length; i++) {
						if (unreadMsg[data[i].userId]) {
							unreadMsg[data[i].userId]++
						} else {
							unreadMsg[data[i].userId] = 1
						}
					}
					const info = {
						unreadMsg,
						type: '9', //返回未读消息情况
					}
					ws.send(JSON.stringify(info))

					// })
				}
			)
		} else if (msg.type === '2') {
			const id = new Date().getTime() + ''
			msg.id = id
			msg.sendSuccess = false

			var tl = new TalkList(msg)
			tl.save(err => {
				if (err) {
					console.log('存储失败')
					ws.send({ type: '0', content: msg.content })
					return
				}
				server.clients.forEach(function each(client) {
					if (
						client.readyState === WebSocket.OPEN &&
						client.name == msg.toUserId
					) {
						console.log('4444', client.name)

						client.send(message)
						TalkList.updateOne(
							{ id },
							{ $set: { sendSuccess: true } },
							(err, data) => {
								if (err) {
									console.log(err)
									return
								}
								console.log('修改成功7777')
							}
						)
					}
				})
			})
		} else if (msg.type === '4') {
			ws.name = msg.userId
			TalkList.find({
				toUserId: Number(msg.userId),
				userId: Number(msg.toUserId),
				sendSuccess: false,
			}).exec((err, data) => {
				if (err) {
					console.log(err)
					return
				}
				if (data.length < 1) return
				ws.send(JSON.stringify(data))
				TalkList.updateMany(
					{ toUserId: Number(msg.userId), sendSuccess: false },
					{ $set: { sendSuccess: true } },
					(err, data) => {
						if (err) {
							console.log(err)
							return
						}
					}
				)
			})
		} else if (msg.type === '3') {
			const id = new Date().getTime() + ''
			msg.id = id
			msg.groupIds = ''
			const sendArr = [msg.userId - 0]
			var groupsTl = new groupList(msg)
			groupsTl.save(err => {
				if (err) {
					ws.send({ type: '0', content: msg.content })
					return
				}
				server.clients.forEach(function each(client) {
					if (
						client.readyState === WebSocket.OPEN &&
						client.name != msg.userId
					) {
						sendArr.push(client.name - 0)
						console.log('00000', client.name)

						client.send(message)
					}
				})
				UserList.find({}).exec((err, data) => {
					if (err) {
						return
					}

					let arr = data.filter(item => sendArr.indexOf(item.userId) === -1)

					var str = ''
					for (let i = 0; i < arr.length; i++) {
						i === arr.length - 1
							? (str += arr[i].userId)
							: (str += arr[i].userId + ',')
					}
					groupList.updateOne(
						{ id },
						{ $set: { groupIds: str } },
						(err, data) => {
							if (err) {
								console.log(err)
								return
							}
							console.log('修改成功8888')
						}
					)
				})
			})
		} else if (msg.type === '5') {
			ws.name = msg.userId
			let regStr=`(^(${msg.userId},)|(,${msg.userId})$)|(,${msg.userId},)|^(${msg.userId})$`
			const reg=new RegExp(regStr)
			groupList.where('groupIds',reg).exec((err,data)=>{
				if(err){
					return
				}
				if (data.length < 1) return
				ws.send(JSON.stringify(data))
				for(let i=0;i<data.length;i++){
					let arr=data[i].groupIds.split(',')
					let num=arr.indexOf(msg.userId)
					arr.splice(num,1)
					data[i].groupIds=arr.join(',')
					groupList.updateOne({id:data[i].id},{$set:{groupIds:data[i].groupIds}},(err,data)=>{
						if(err){
							return
						}
					})
				}
			})
		}
		console.log('received: %s from %s', message, clientName)

		// // 广播消息给所有客户端
		// server.clients.forEach(function each(client) {
		// 	if (client.readyState === WebSocket.OPEN && client.name !== clientName) {
		// 		client.send(clientName + ' -> ' + message)
		// 	}
		// })
	})
})

// const app = require('express')();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// io.on('connection', (socket) => {
//   console.log('client connect server, ok!');
//     socket.on('chat message',(data)=>{
//     console.log(data,'1111111');
//   })
//  });
// server.listen(3000);

// let express = require('express');
// let app=express()
// let httpServer= require('http').createServer(app);
// let io = require('socket.io')(httpServer);

// io.on('connection',  (socket)=>{
//   console.log('client connect server, ok!');
//   socket.on('chat',(data)=>{
//     console.log(data,'1111111');
//   })
//   socket.on('message',(data)=>{
//     console.log(data,'22222');
//   })
// });
// // app.use('/static',express.static('static'))
// app.listen(3000,()=>{
//   console.log('启动成功');

//   // 服务端监听连接状态：io的connection事件表示客户端与服务端成功建立连接，它接收一个回调函数，回调函数会接收一个socket参数。

// });

// // 服务端监听连接状态：io的connection事件表示客户端与服务端成功建立连接，它接收一个回调函数，回调函数会接收一个socket参数。
// io.on('connection',  (socket)=>{
//   console.log('client connect server, ok!');
//   socket.on('chat',(data)=>{
//     console.log(data,'1111111');
//   })
//   // // io.emit()方法用于向服务端发送消息，参数1表示自定义的数据名，参数2表示需要配合事件传入的参数
//   // io.emit('server message', {msg:'client connect server success'});

//   // // socket.broadcast.emit()表示向除了自己以外的客户端发送消息
//   // socket.broadcast.emit('server message', {msg:'broadcast'});

//   // // 监听断开连接状态：socket的disconnect事件表示客户端与服务端断开连接
//   // socket.on('disconnect', ()=>{
//   //   console.log('connect disconnect');
//   // });

//   // // 与客户端对应的接收指定的消息
//   // socket.on('client message', (data)=>{
//   //   cosnole.log(data);// hi server
//   // });

//   // socket.disconnect();
// });
