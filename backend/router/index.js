const express=require("express")
const record =require('./record')
const login =require('./login')
const user = require('./user')
const upload = require('./upload')
const router = express.Router()
router.use('/record',record)
router.use('/lr',login)
router.use('/user',user)
router.use('/upload',upload)

module.exports = router