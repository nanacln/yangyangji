const express=require("express")
const UserList =require('../models/UserList.js') 
const router = express.Router()


router.post('/register', (req, res) => {
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
router.post('/login', (req, res) => {
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

module.exports = router