<template>
	<van-nav-bar
		title="添加宝宝记"
		left-text="返回"
		right-text="提交"
		left-arrow
		@click-left="onClickLeft"
		@click-right="saveRecord"
	/>
	<div class="record-box">
		<van-field
			v-model="form.content"
			rows="2"
			autosize
			label="宝宝记"
			type="textarea"
			maxlength="100"
			placeholder="请输入宝宝的伟大的小进步"
			show-word-limit
		/>
		<van-field name="uploader" label="文件上传">
			<template #input>
				<van-uploader v-model="showImgs" :after-read="afterRead" />
			</template>
		</van-field>
		<van-field name="uploaderVideo" label="视频上传">
			<template #input>
				
				<video class="video-box" ref="video" @click="playPause" v-if="form.videoUrl" :src="imagePrefix+form.videoUrl" />
				<van-uploader  accept="video/*" :after-read="afterReadVideo" />
				<div class="circle-box" v-if="showUploadProgress">
					<van-circle
						v-model:current-rate="currentRate"
						:rate="rate"
						:speed="100"
						:size="80"
						:text="uploadProgress"
					/>
<button @click="rate++">增加</button>
				</div>
			</template>
		</van-field>
		
		<!-- <div style="margin: 26px;">
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </div> -->
	</div>
</template>
<script>
	import { reactive, toRefs, defineComponent, ref ,computed} from 'vue'
	import { useRouter } from 'vue-router'
	import { Toast } from 'vant'
	import { growuprecordSave, imgUpload,videoUpload } from '@/api/common.api'
	import { getLocalStorage } from '@/tool/tool'
	import uploadBigHook from '@/tool/uploadBigFile.js'
	export default defineComponent({
		setup() {
			let state = reactive({
				form: {
					content: '',
					imgs: '',
					role: getLocalStorage('role'),
					userId: getLocalStorage('userId'),
					nickName: getLocalStorage('nickName'),
					videoUrl:''
				},
				imgs: [],
				showImgs: [],
				// videoUrl:'',
				currentRate:0,
				rate:30,
				showUploadProgress:false
			})
			let {uploadBig}=uploadBigHook(state)
			const uploadProgress = computed(() => state.currentRate.toFixed(0) + '%');
			let video=ref(null)
			const playPause=()=>{
				if(video.value.paused){
					video.value.play()
				}else{
					video.value.pause()
				}
			}
			let router = useRouter()
			const afterReadVideo= file=>{
				state.currentRate=0
				state.showUploadProgress=true
				uploadBig(file.file)
				// let formData = new FormData()
				// formData.append('file', file.file)

				// videoUpload(formData).then(res => {
				// 	if (res.code === 200) {
				// 		state.showVideos=res.data
				// 		Toast.success('视频上传成功')  
				// 	}
				// })
			}
			const afterRead = file => {
				// 此时可以自行将文件上传至服务器
				console.log(file)
				file.status = 'uploading';
      file.message = '上传中...';
				minifyImage(file)
				// let formData = new FormData()
				// formData.append('file', file.file)

				// imgUpload(formData).then(res => {
				// 	if (res.code === 200) {
				// 		state.imgs.push(res.data)
				// 		Toast.success('图片上传成功')
				// 	}
				// })
			}
			const onClickLeft = () => {
				router.push('/home')
			}
			const saveRecord = () => {
				if (!state.form.content) {
					Toast.fail('宝宝记不能为空')
					return
				}
				let params = { ...state.form }
				params.imgs = JSON.stringify(state.imgs)
				growuprecordSave(params).then(res => {
					console.log(res)
					if (res.code === 200) {
						Toast.success('添加成功')
						setTimeout(() => {
							
							router.push('/home')
						}, 2000)
						
					}
				})
			}
			const minifyImage=(fileobj)=>{
				const formData = new FormData()
				const file=fileobj.file

				function photoCompress (file, w, objDiv) {
					const ready = new FileReader()
					/* 开始读取指定的Blob对象或File对象中的内容. 当读取操作完成时,readyState属性的值会成为DONE,如果设置了onloadend事件处理程序,则调用之.同时,result属性中将包含一个data: URL格式的字符串以表示所读取文件的内容. */
					ready.readAsDataURL(file)
					ready.onload = function () {
						let re = ready.result
						canvasDataURL(re, w, objDiv)
					}
				}
				function canvasDataURL (path, obj, callback) {
					var img = new Image()
					img.src = path
					img.onload = function () {
						var that = img
						// 默认按比例压缩
						var w = that.width
						var h = that.height
						var scale = w / h
						w = obj.width || w
						h = obj.height || (w / scale)
						var quality = 0.7 // 默认图片质量为0.7
						// 生成canvas
						var canvas = document.createElement('canvas')
						var ctx = canvas.getContext('2d')
						// 创建属性节点
						var anw = document.createAttribute('width')
						anw.nodeValue = w
						var anh = document.createAttribute('height')
						anh.nodeValue = h
						canvas.setAttributeNode(anw)
						canvas.setAttributeNode(anh)
						ctx.drawImage(that, 0, 0, w, h)
						// 图像质量
						if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
							quality = obj.quality
						}
						// quality值越小，所绘制出的图像越模糊
						var base64 = canvas.toDataURL('image/jpeg', quality)
						// 回调函数返回base64的值
						callback(base64)
					}
				}
				function convertBase64UrlToBlob (urlData) {
					var arr = urlData.split(',')
					let mime = arr[0].match(/:(.*?);/)[1]

					let bstr = atob(arr[1])
					let n = bstr.length
					let u8arr = new Uint8Array(n)
					while (n--) {
						u8arr[n] = bstr.charCodeAt(n)
					}
					return new Blob([u8arr], {type: mime})
				}
				if (file.size > 1024 * 1024) {
					photoCompress(file, {quality: 0.2}, (base64Codes) => {
						var bl = convertBase64UrlToBlob(base64Codes)
						formData.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
						imgUpload(formData).then(res => {
							if (res.code === 200) {
								state.imgs.push(res.data)
								Toast.success('图片上传成功')
								fileobj.status = '';    					
								fileobj.message = '';
							}
						})
					})
				} else {
					// append 文件
					formData.append('file', file)
					// 上传图片
					imgUpload(formData).then(res => {
						if (res.code === 200) {
							state.imgs.push(res.data)
							Toast.success('图片上传成功')
							fileobj.status = '';    					
							fileobj.message = '';
						}
					})
				}
			}
			return {
				...toRefs(state),
				afterRead,
				onClickLeft,
				saveRecord,
				afterReadVideo,
				playPause,
				video,
				uploadProgress,
			}
		},
	})
</script>
<style lang="scss" scoped>
.circle-box{
	position:absolute;
	z-index: 1;
	background:#fff;
	margin-right: 20px;
}
	.record {
		&-box {
			margin-top: 40px;
		}
	}
	.video-box{
		width:30vw;
		height: 30vw;
	}
</style>
