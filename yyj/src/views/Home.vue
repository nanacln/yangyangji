<template>
	<div class="home">
		<van-nav-bar :fixed="true" title="扬扬的日常" />
		<div class="space"></div>
		<router-link to="/record/add" class="add-box"
			><van-icon class="add-btn" name="add-o"
		/></router-link>

		<van-list
			offset="10"
			v-model:loading="state.loading"
			:finished="state.finished"
			finished-text="没有更多了"
			@load="onLoad"
		>
			<div class="yy-list" v-for="item in state.list" :key="item.id">
				<div class="yy-head">
					<div class="yy-rel-name">
						<span>{{ item.nickName }}</span
						><van-tag class="yy-tag" round type="warning">{{
							item.role
						}}</van-tag
						>说:
					</div>
					<div class="yy-time">{{$filters.dealTime(item.createTime)}}</div>
				</div>

				<div class="yy-active">{{ item.content }}</div>
				<van-row justify="space-between">
					<van-image
						v-for="item2 in item.imgs"
						:key="item2"
						width="30%"
						height="80px"
						fit="cover"
						:src="item2"
						@click="PreviewImage(item.imgs)"
					/>
				</van-row>
				<div class="comments-bar">
					<van-icon class="comments-icon" name="chat-o" @click="toComment(item.id)" />
				</div>
				<div class="comments-box" v-if="item.comments">
					<div class="comments-item" v-for="v in JSON.parse(item.comments)" :key="v.comments+v.userId">
						<span class="comments-name">{{v.nickName}}</span>
						<div class="comments-words">: {{v.comments}}</div>
					</div>
				</div>
			</div>
		</van-list>
		<van-tabbar v-model="active" :route="true">
			<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
			<!-- <van-tabbar-item icon="search">标签</van-tabbar-item> -->
			<van-tabbar-item to="/relativer" icon="friends-o">亲友团</van-tabbar-item>
			<van-tabbar-item to="/mine" icon="setting-o">我的</van-tabbar-item>
		</van-tabbar>
		<div class="footer-comment" :class="{hide:!state.commentFlag}">
			<div class="footer-bg" @click="showComment(false)"></div>
			<div class="footer-input">
			<van-field v-model="state.comments" center clearable placeholder="请输入">
				<template #button>
					<van-button size="small" @click="sendMsg" type="primary"
						>发送</van-button
					>
				</template>
			</van-field>
		</div>
			<div class="footer-end"></div>
		</div>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, ref,nextTick } from 'vue'
	import { growuprecordList ,updateComments} from '@/api/common.api'
	import { growupRecordArr} from '@/types/common'
	import {
		getLocalStorage,
	} from '@/tool/tool'
	import { ImagePreview } from 'vant'
	// import io from 'socket.io-client'
	// @ is an alias to /src
	// import HelloWorld from '@/components/HelloWorld.vue'

	export default defineComponent({
		name: 'Home',
		setup() {
			type stateModel = {
				list: growupRecordArr
				loading: boolean
				finished: boolean
				params: {
					pageSize: number
					pageNo: number
				},
				comments:string,
				commentId:number,
				commentFlag:boolean
			}
			const state = reactive<stateModel>({
				list: [],
				loading: false,
				finished: false,
				params: {
					pageSize: 6,
					pageNo: 1,
				},
				comments:'',
				commentId:0,
				commentFlag:false
			})
			// const websocket =new WebSocket('ws://localhost:3000/')
			// websocket.addEventListener('open',()=>{
			// 	console.log('建立连接');
			// 	// type  1上线  2私聊  3 群聊

			// 	var msg:msgtype={type:1,content:'上线啦',userId:2}

			// 	websocket.send(JSON.stringify(msg))
			// })
			// websocket.addEventListener('message',(data)=>{
			// 	console.log(data,6666);

			// })

			const onLoad = () => {
				// 异步更新数据
				growuprecordList(state.params).then(res => {
					console.log(res, 6666666)
					res.data.list.forEach(val => {
						if (val.imgs) {
							// debugger
							val.imgs = JSON.parse(val.imgs)
						}
					})
					if (state.params.pageNo === 1) {
						state.list = res.data.list
					} else {
						state.list = state.list.concat(res.data.list)
					}

					state.loading = false
					state.params.pageNo++
					if (state.params.pageNo > res.data.totalPage) {
						state.finished = true
					}
				})
				// setTimeout 仅做示例，真实场景中一般为 ajax 请求
				setTimeout(() => {
					// 加载状态结束
					state.loading = false

					// 数据全部加载完成
					// if (state.list.length >= 40) {
					//   state.finished = true;
					// }
				}, 1000)
			}
			const active = ref(0)
			const PreviewImage = (arr: string[]) => {
				ImagePreview(arr)
			}
			const showComment=(b:boolean)=>{
				if(b){
					state.commentFlag=true
					// (document.querySelector(".footer-comment")as HTMLElement).classList.remove('hide')
				}else{
					state.commentFlag=false
					// (document.querySelector(".footer-comment")as HTMLElement).classList.add('hide')
				}
			}
			
			const toComment=async (id:number)=>{
				state.commentId=id
				showComment(true)
				await nextTick()
				;(document.querySelector(".van-field__control") as HTMLInputElement).focus()
			}
			function scroll(){
				(document.querySelector('.footer-end') as HTMLElement).scrollIntoView()
			}
			window.onresize = scroll
			const sendMsg=()=>{
				console.log(111);
				let param={
					userId:getLocalStorage('userId') as string,
					id:state.commentId,
					comments:state.comments,
					nickName:getLocalStorage('nickName') as string,
				}
				updateComments(param)
				.then(res=>{
					if(res.code===200){
						state.comments=''
						state.commentFlag=false
					}
					
				})
			}
			return {
				state,
				onLoad,
				active,
				PreviewImage,
				showComment,
				toComment,
				sendMsg
			}
		},
		// components: {
		// 	HelloWorld,
		// },
	})
</script>
<style lang="scss" scoped>
.footer{
	&-comment{
		display: flex;
		flex-direction: column;
		position:fixed;
		top:0;
		left:0;
		right: 0;
		bottom:0;
		z-index: 2;
		&.hide{
			display: none;
		}
	}
	&-bg{
		flex:1;
	}
	&-input{
		width:100%;
		height: 100px;
		border-top:1px solid #ddd;
	}
	&-end{
		height: 1px;
	}
}
.comments{
	&-bar{
	height: 40px;
	text-align: right;
	margin-top: 10px;
	}
	&-icon{
		margin-right:10px;
		font-size: 40px;
	}
	&-item{
		display:flex;
		font-size: 26px;
	}
	&-box{
		background:#f5f5f5;
		padding:20px;
		margin-top:10px;
	}
	&-name{
		
		color: #00a4ff;
		margin-right: 8px;
	}
	&-words{
		flex:1;
		word-break: break-all;
	}
}
	.space {
		height: var(--van-nav-bar-height);
	}
	.yy {
		&-list {
			border-bottom: 1px solid #ddd;
			padding: 20px;
			
		}
		&-head{
			display: flex;
			
		}
		&-rel-name{
		flex:1;
		}
		&-time{
			color:#666;
			font-size: 26px;
		}
	}
	.add-btn {
		font-size: 80px;
		color: var(--van-button-warning-background-color);
	}
	.add-box {
		position: fixed;
		top: 80vh;
		right: 30px;
		z-index: 1;
	}
	.yy {
		&-rel-name {
			color: #999;
			font-size: 24px;
			span {
				color: #00a4ff;
				font-size: 28px;
				margin-right: 68px;
			}
		}
		&-head {
			padding-top: 20px;
			position: relative;
		}
		&-tag {
			position: absolute;
			color: #fff !important;
			font-size: 20px !important;
			margin-top: -15px;
			margin-left: -60px;
		}
		&-active {
			margin: 20px 0;
			line-height: 40px;
			font-size: 28px;
		}
	}
</style>
