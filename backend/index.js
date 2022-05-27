
const express = require('express')
const app = express()
const http = require('http').createServer(app)
// const dirPath = path.join(__dirname, "../static/");


const apiRouter=require('./router/index')
// const { MongoClient } = require('mongodb') //定义数据库连接的地址
const mongoose = require('mongoose')
// mongoose.connect('mongodb://106.14.172.134:30000/yangyangji', {
mongoose.connect('mongodb://nana:123456@127.0.0.1:30000/yangyangji', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

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

//配置路由
app.use("/api",apiRouter)


http.listen('8666')
// app.listen('8666')


