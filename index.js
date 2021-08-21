var http = require('http')
var fs = require('fs')
var path = require('path')
// var url = require('url');
const express = require('express')
const app = express()
//引入mongodb
const { MongoClient } = require('mongodb') //定义数据库连接的地址
const url = 'mongodb://106.14.172.134:27017'
//定义要操作的数据库
const dbName = 'nana'
app.use('/static',express.static('static'))
//实例化Mongoclient传入数据库连接地址
// const client = new MongoClient(url, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true,
// })
//配置路由
app.get('/static/list', function (req, res) {
	// res.writeHead(200,{ 'Content-Type': 'text/html;charset="utf-8"'});res.end('首页');
	MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
		client.connect(err => {
			if (err) {
				console.log(err)
				return
			}
			console.log('数据库连接成功')
			let db = client.db(dbName)
			//1、查找数据
			db.collection('TBLUser')
				.find({})
				.toArray((err, data) => {
					console.log(data, 1111)
					//操作数据库完毕以后一定要关闭数据库连接
					client.close()
					res.send(data)
				})
		})
	})
})
app.listen('8080')

//6、连接数据库
