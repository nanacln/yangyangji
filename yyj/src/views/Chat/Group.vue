<template>
	<div class="chat-box">
		<van-nav-bar
			title="广播室"
			left-text="返回"
			left-arrow
			@click-left="onClickLeft"
		/>
		<ul class="chat-wrapper">
			<li
				class="chat-item"
				:class="{ mine: item.userId == userId }"
				v-for="(item, index) in chatArr"
				:key="index"
			>
				<img class="chat-img" src="~@/assets/images/person.png" />
				<div class="chat-content">{{ item.content }}</div>
			</li>
			<li class="chat-end"></li>
		</ul>
		<div class="chat-input">
			<van-field v-model="msg" center clearable placeholder="请输入">
				<template #button>
					<van-button size="small" @click="sendMsg" type="primary"
						>发送</van-button
					>
				</template>
			</van-field>
		</div>
	</div>
</template>
<script lang="ts">
	import { defineComponent, onBeforeUnmount,  toRefs } from 'vue'
	import { msgtype } from '@/types/type'
	import {
		getLocalStorage,
		setLocalStorage,
		deleteUnreadItem,
		saveUnreadChatData,
	} from '@/tool/tool'
	import getSocket from '@/tool/socket'
	import chathook from '@/tool/hookchat'
	export default defineComponent({
		setup() {
			const {onClickLeft,state}=chathook()


			if (getLocalStorage('chatgroups')) {
				state.chatArr = JSON.parse(getLocalStorage('chatgroups'))
			}


			// const soketObj = getSocket()
			// const websocket = soketObj()
			const websocket = getSocket()
			setTimeout(() => {
				var msg: msgtype = {
					type: '5',
					content: '群聊上线啦',
					userId: getLocalStorage('userId'),
				}

				websocket.send(JSON.stringify(msg))
			}, 100)
			// websocket.addEventListener('open', () => {
			// 	console.log('建立连接')
			// 	// type  1上线  2私聊  3 群聊  0服务器存储消息失败 4刚进入私聊（去获取未在线时，别人发的消息）
			// 	// 5 刚进入群聊（去获取未在线时，别人发的消息）
			// 	var msg: msgtype = {
			// 		type: '5',
			// 		content: '群聊上线啦',
			// 		userId: getLocalStorage('userId'),
			// 	}

			// 	websocket.send(JSON.stringify(msg))
			// })
			websocket.addEventListener('message', data => {
				const info: msgtype = JSON.parse(data.data)
				if (info.type === '2') {
					saveUnreadChatData(info.userId as string, info)
				} else if (info.type === '5') {
					if (info.data instanceof Array) {
						state.chatArr = state.chatArr.concat(info.data)
					}
					setLocalStorage('chatgroups', JSON.stringify(state.chatArr))
				} else if (info.type === '3') {
					state.chatArr.push(info)
					setLocalStorage('chatgroups', JSON.stringify(state.chatArr))
				}
			})
			onBeforeUnmount(()=>{
				deleteUnreadItem('groups')
			})
			
			const sendMsg = () => {
				let obj = {
					type: '3',
					content: state.msg,
					userId: getLocalStorage('userId') as string,
				}
				websocket.send(JSON.stringify(obj))
				state.msg = ''
				state.chatArr.push(obj)
				setLocalStorage('chatgroups', JSON.stringify(state.chatArr))
			}
			return {
				onClickLeft,
				...toRefs(state),
				sendMsg,
			}
		},
	})
</script>
<style lang="scss" scoped>
	.chat {
		&-box {
			display: flex;
			flex-direction: column;
			height: 100vh;
			overflow: hidden;
		}
		&-wrapper {
			flex: 1;
			overflow-y: auto;
			background-color: #f5f5f5;
		}
		&-input {
			width: 100%;
			height: 100px;
		}
		&-item {
			display: flex;
			margin: 20px 0;
			&.mine {
				flex-direction: row-reverse;
			}
		}
		&-img {
			width: 80px;
			height: 80px;
			border-radius: 10px;
			margin: 0 20px;
		}
		&-content {
			background: #b4f66e;
			color: #000;
			font-size: 28px;
			line-height: 42px;
			border-radius: 6px;
			padding: 20px;
			max-width: 500px;
		}
	}
</style>
