<template>
	<div class="video-list">
		<div class="video-wrapper">
			<video
				class="player-item"
				:id="'player-container-id' + index"
				preload="auto"
				poster=""
				playsinline
				webkit-playsinline
			></video>
			<van-loading v-if="!id" size="24px" color="#fff" vertical
				>加载中</van-loading
			>
		</div>

		<div class="video-name">
			<span>{{ videoName }}</span>
		</div>
	</div>
</template>
<script lang="ts">
	import { defineComponent } from 'vue'
	import { onMounted, onUnmounted } from 'vue'
	export default defineComponent({
		props: {
			index: Number,
			fileID: String,
			videoName: String,
		},
		setup(props) {
			let idName = `player-container-id${props.index}`
			let player: any = null
			onMounted(() => {
				/* eslint-disable */
				player = window.TCPlayer(idName, {
					// player-container-id 为播放器容器 ID，必须与 html 中一致
					fileID: props.fileID,
					appID: '1259605108', // 请传入点播账号的 appID（必须）
				})
				/* eslint-disable */
			})
			onUnmounted(() => {
				player.dispose()
			})
		},
	})
</script>
<style lang="scss" scoped>
	.player-item {
		width: 750px;
		height: 420px;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}
	.video {
		&-wrapper {
			width: 750px;
			height: 420px;
			background-color: #000;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		&-list {
		}
		&-name {
			display: flex;
			align-items: flex-start;
			font-size: 30px;
			line-height: 37px;
			padding: 26px 40px;
			&::before {
				content: '';
				width: 4px;
				height: 37px;
				display: inline-block;
				background-color: #3483f7;
				margin-right: 10px;
			}
			span {
				flex: 1;
				width: 60%;
				text-align: left;
			}
		}
	}
</style>
