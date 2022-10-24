const express=require("express")
const fs = require('fs')
// const dirPath = 'static/'; //与下面的等价
const path = require("path");
const dirPath = path.join(__dirname, "../static/");;
const formidable = require('formidable')
const router = express.Router()
const mergeFile = require('../tool/util');
const UserList =require('../models/UserList.js')


router.post('/file', (req, res) => {
	var form = new formidable.IncomingForm()
	form.parse(req, function (error, fields, files) {
		let name =
			'/imgs/' + Math.floor(Math.random() * 100) + files.file.originalFilename
		fs.writeFileSync('static'+name, fs.readFileSync(files.file.filepath))
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
router.post('/video', (req, res) => {
	var form = formidable({})
	form.parse(req, function (error, fields, files) {
		let name =
			'/videos/' + Math.floor(Math.random() * 100) + files.file.originalFilename
		fs.writeFileSync('static'+name, fs.readFileSync(files.file.filepath))
		res.send({
			code: 200,
			msg: '请求成功',
			data:  name,
		})
	})
})
router.post('/bigFile', (req, res) => {
	var body = req.body
  let type = body.type;
  let md5Val = body.md5Val||req.query.md5Val;
  let bigDir = dirPath + "big/";

	if (!md5Val) {
    return res.json({
      code: 101,
      msg: "文件md5值不能为空！",
      data:''
    });
  }

  
  function check() {
    let filePath = `${bigDir}${md5Val}`;
    fs.readdir(filePath, (err, data) => {
      if (err) {
        fs.mkdir(filePath, (err) => {
          if (err) {
            return res.json({
              code: 101,
              msg: "获取失败！",
              data:{}
            });
          } else {
            return res.json({
              code: 200,
              msg: "获取成功！",
              data:{
								chunk: [],
							}
							
            });
          }
        });
      } else {
        return res.json({
          code: 200,
          msg: "获取成功！",
          data: {
						chunk: data,
					},
					
        });
      }
    });
  }
  function upload() {
		
    let form = formidable({
      multiples: true,
      uploadDir: `${dirPath}big/${md5Val}/`,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.json(err);
      }
			const {current,type}=fields
			if(type!=='upload'){
				let msg=upload?'上次类型值错误':"上传类型不能为空！"
				return res.json({
					code: 101,
					msg,
					data:'',
				});
			}
			if (!current) {
				return res.json({
					code: 101,
					msg: "文件当前分片值不能为空！",
					data: "",
				});
			}
      let newPath = `${dirPath}big/${md5Val}/${current}`;
      fs.rename(files.file.filepath, newPath, function (err) {
        if (err) {
          return res.json(err);
        }
        return res.json({
          code: 200,
          msg: "get_succ",
          data: "",
        });
      });
    });
  }
  async function merge(){
    let ext = req.body.ext;
    if (!ext) {
      return res.json({
          code: 101,
          msg: '文件后缀不能为空！',
					data: ''
      })
    }
    
    let oldPath = `${dirPath}big/${md5Val}`;
    let newPath = `${dirPath}doc/${md5Val}.${ext}`;
    let data = await mergeFile(oldPath, newPath);
    
    if (data.code == 200) {
      return res.json({
        code: 200,
        msg: '文件合并成功！',
        data: {
					url: `/doc/${md5Val}.${ext}`
				}
      })
    } else {
      return res.json({
        code: 101,
        msg: '文件合并失败！',
        data: data.data.error
      })
    }
  }
  
  if (type === "check") {
    check();
  } else if (type === "merge"){
    merge()
  }else{
		upload()
	}
})
router.post('/userAvatar', (req, res) => {
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

module.exports = router