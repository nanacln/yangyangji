const express=require("express")
const GrowUpRecord = require('../models/GrowUpRecord')
const router = express.Router()
router.get('/list',function (req, res) {
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
					res.send({
						data: {},
						code: 101,
						msg: '查询成长记录失败',
					})
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
router.post('/add',(req, res) => {
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
router.post('/delete',(req, res) => {
	var body = req.body
	GrowUpRecord.deleteOne({id:body.id},(err,data)=>{
		if (err) {
			res.send({ code: 100, msg: '', data: '删除失败' })
			return
		}
		res.send({ code: 200, msg: '请求成功', data: '删除成功' })
	})
})
router.post('/like',(req, res) => {
	var body = req.body
	GrowUpRecord.find({id:body.id},(err,data)=>{
		if (err) {
			res.send({ code: 100, msg: '', data: '点赞失败' })
			return
		}
		if(data.length===1){
			const arr=data[0].likes
			let arr2=[]
			let flag=arr.some(e=>e.userId===body.userId)
			if(flag){
				arr2=arr.filter(i=>i.userId!==body.userId)
			}else{
				arr.push({
					userId:body.userId,
					userName:body.userName
				})
				arr2=arr
			}
			GrowUpRecord.updateOne({id:body.id},{$set:{likes:arr2}},(err,data)=>{
				if(err){
					res.send({ code: 100, msg: '操作成功', data:''})
				}
				res.send({ code: 200, msg: '请求成功', data:arr2})
				return
			})
		}
	})
})
router.post('/comments', (req, res) => {
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
module.exports = router