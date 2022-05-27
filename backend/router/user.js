
const express=require("express")
const GrowUpRecord = require('../models/GrowUpRecord')
const UserList =require('../models/UserList.js') 
const router = express.Router()

router.get('/list', (req, res) => {
	const param={}
	if(req.query.userId){
		param.userId=Number(req.query.userId) 
	}
	UserList.find(param).exec((err, data) => {
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
router.post('/update', (req, res) => {
	const { userId, nickName, role } = req.body
	const userChange={}
	if(nickName){
		userChange.nickName=nickName
	}
	if(role){
		userChange.role=role
	}
	UserList.updateOne(
		{ userId: Number(userId) },
		{ $set: userChange },
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
	UserList.find({userId:userId},(err,data)=>{
		if(err){
			return
		}
		if(nickName){
			GrowUpRecord.find({},(err,data)=>{
				if (err) {
					console.log(err)
					return
				}
				data.forEach(v=>{
					const changeInfo={}
					if(v.userId==userId){
						changeInfo.nickName=nickName
					}
					if(v.likes.length){
						for(let i=0;i<v.likes.length;i++){
							if(v.likes[i].userId==userId){
								v.likes[i].userName=nickName
								changeInfo.likes=v.likes
								break
							}
						}
					}
					let commentsFlag=false
					if(v.comments&&v.comments.length){
						const arr=JSON.parse(v.comments)
						for(let i=0;i<arr.length;i++){
							if(arr[i].userId==userId){
								arr[i].nickName=nickName
								commentsFlag=true
							}
						}
						if(commentsFlag){
							changeInfo.comments=JSON.stringify(arr)
						}
					}
					if(Object.keys(changeInfo).length){
						GrowUpRecord.updateOne({id:v.id},{ $set: changeInfo },(err,data)=>{
							if(err){
								console.log(err);
								return
							}
						})
					}
				})
			})
		}
	})

})

module.exports = router