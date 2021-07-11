<template>
	<div class="video-head" :class="!bgFlag ? 'noBG' : ''">
		<div class="video-box">
			<video
				v-if="id"
				id="player-container-id"
				preload="auto"
				playsinline
				webkit-playsinline
			></video>
			<van-loading v-if="!id" size="24px" color="#fff" vertical
				>加载中</van-loading
			>
		</div>
	</div>
</template>
<script lang="ts">
	import { defineComponent } from 'vue'
	import { videoList } from '@/api/aboutus.api'
	import { nextTick, onMounted, onUnmounted, ref } from 'vue'
	export default defineComponent({
		props: {
			type: String,
			bgFlag: {
				type: Boolean,
				default: true,
			},
		},
		setup(props) {
			const player: any = ref(null)
			let id = ref('')

			onMounted(() => {
				// console.log("sssssss");

				videoList().then(res => {
					if (props.type === 'business') {
						//业务体系页面
						id.value = res.body[0].businessSystemPromo as string
					} else if (props.type === 'introduce') {
						//新航道简介
						id.value = res.body[0].name as string
					} else {
						//大事记
						id.value = res.body[0].memorabiliaPromo as string
					}
					nextTick(() => {
						player.value = window.TCPlayer('player-container-id', {
							// player-container-id 为播放器容器 ID，必须与 html 中一致
							fileID: id.value,
							appID: '1259605108', // 请传入点播账号的 appID（必须）
						})
					})
				})
			})
			onUnmounted(() => {
				player.value.dispose()
				// console.log("eeeeeeeeee");
			})

			return { id }
		},
	})
</script>
<style lang="scss" scoped>
	.video {
		&-head {
			width: 750px;
			height: 505px;
			padding-top: 30px;
			box-sizing: border-box;
			background: url(~@a/images/h1.jpg);
			background-size: 100%;
			&.noBG {
				background-image: none;
				height: 440px;
			}

			#player-container-id {
				width: 100%;
				height: 100%;
			}
		}
		&-box {
			width: 670px;
			height: 376px;
			background: #000;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>
