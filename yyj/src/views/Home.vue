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
			<div class="yy-list" v-for="item in state.list" :key="item._id">
				<div class="yy-head">
					<div class="yy-rel-name">
						<span>{{ item.nickName }}</span
						><van-tag class="yy-tag" round type="warning">{{
							item.role
						}}</van-tag
						>说:
					</div>
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
			</div>
		</van-list>
		<van-tabbar v-model="active" :route="true">
			<van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
			<!-- <van-tabbar-item icon="search">标签</van-tabbar-item> -->
			<van-tabbar-item to="/relativer" icon="friends-o">亲友团</van-tabbar-item>
			<van-tabbar-item to="/mine" icon="setting-o">我的</van-tabbar-item>
		</van-tabbar>
	</div>
</template>

<script lang="ts">
	import { defineComponent, reactive, ref } from 'vue'
	import { growuprecordList } from '@/api/common.api'
	import { growupRecordArr } from '@/types/common'
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
				}
			}
			const state = reactive<stateModel>({
				list: [],
				loading: false,
				finished: false,
				params: {
					pageSize: 6,
					pageNo: 1,
				},
			})
			// ImagePreview(['https://img.yzcdn.cn/vant/apple-1.jpg'])
			// const websocket =new WebSocket('ws://echo.websocket.org/')
			const websocket =new WebSocket('ws://localhost:3000/')
			websocket.addEventListener('open',()=>{
				console.log('建立连接');
				websocket.send('nihao')
			})
			websocket.addEventListener('message',(data)=>{
				console.log(data,6666);
				
			})
			// const socket = io('ws://echo.websocket.org/')
			// socket.emit('chat message', 'hello nana')
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
			return {
				state,
				onLoad,
				active,
				PreviewImage,
			}
		},
		// components: {
		// 	HelloWorld,
		// },
	})
</script>
<style lang="scss" scoped>
	.space {
		height: var(--van-nav-bar-height);
	}
	.yy {
		&-list {
			border-bottom: 1px solid #ddd;
			padding: 20px;
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
