<template>
	<div class="xjh">
		<template v-if="id">
			<van-loading class="loadMask" v-if="initFlag" size="24px"
				>加载中...</van-loading
			>
			<template v-else>
				<div class="xjh-head">
					<div class="xjh-head-name">{{ data.name }}</div>
					<div class="xjh-head-city">宣讲城市：{{ data.city }}</div>
					<div class="xjh-head-c">宣讲时间：{{ data.time }}</div>
					<div class="xjh-head-c">宣讲地点：{{ data.address }}</div>
				</div>
				<div class="xjh-main">
					<div class="xjh-main-title">详细信息</div>
					<div class="xjh-main-item">
						<div class="xjh-main-top">
							<i class="xjh-main-icon iconfont icon-zhiwei"></i>
							<div class="xjh-main-name">招聘职位</div>
						</div>

						<div class="xjh-main-box">
							<pre>{{ data.position }}</pre>
						</div>
					</div>
					<div class="xjh-main-item">
						<div class="xjh-main-top">
							<i class="xjh-main-icon iconfont icon-duixiang"></i>
							<div class="xjh-main-name">面向对象</div>
						</div>
						<div class="xjh-main-box">
							<pre>{{ data.target }}</pre>
						</div>
					</div>
					<div class="xjh-main-item">
						<div class="xjh-main-top">
							<i class="xjh-main-icon iconfont icon-fuli1"></i>
							<div class="xjh-main-name">成长环境</div>
						</div>
						<div class="xjh-main-box">
							<pre>{{ data.environment }}</pre>
						</div>
					</div>
					<div class="xjh-main-item">
						<div class="xjh-main-top">
							<i class="xjh-main-icon iconfont icon-fuli1"></i>
							<div class="xjh-main-name">申请通道</div>
						</div>
						<div class="xjh-main-box">
							<p>1、登陆新航道招聘公众号；</p>
							<p>
								2、发送简历至邮箱：zhaopin@xhd.cn（邮件标题备注：
								申请岗位-学校-姓名）
							</p>
							<p>3、校招咨询电话：（010）12345678</p>
						</div>
					</div>
					<router-link :to="'/joinus/sign?name=' + data.name" class="xjh-sign"
						>立即报名</router-link
					>
				</div>
			</template>
		</template>
		<template v-else>
			<div class="xjh-head">
				<div class="xjh-head-name2">管培生招聘信息</div>
			</div>
			<div class="xjh-main">
				<div class="xjh-main-title">详细信息</div>
				<div class="xjh-main-item">
					<div class="xjh-main-top">
						<i class="xjh-main-icon iconfont icon-zhiwei"></i>
						<div class="xjh-main-name">招聘职位</div>
					</div>

					<div class="xjh-main-box">
						<p>集团管理培训生</p>
						<p>面授主讲教师（小初高全科）</p>
						<p>在线主讲教师（教学/教研/学科运营方向）</p>
						<p>研发工程师（前端/后端/移动端/测试开发）</p>
					</div>
				</div>
				<div class="xjh-main-item">
					<div class="xjh-main-top">
						<i class="xjh-main-icon iconfont icon-duixiang"></i>
						<div class="xjh-main-name">面向对象</div>
					</div>
					<div class="xjh-main-box">
						<p>2021届海内外应届毕业生以及非应届实习生</p>
					</div>
				</div>
				<div class="xjh-main-item">
					<div class="xjh-main-top">
						<i class="xjh-main-icon iconfont icon-fuli1"></i>
						<div class="xjh-main-name">成长环境</div>
					</div>
					<div class="xjh-main-box">
						<p>高于业内平均水平的薪资&每年2-4次晋升调薪</p>
						<p>带薪培训，带薪年假</p>
						<p>弹性工作制</p>
						<p>不定期团建，郊游国内游国外游</p>
						<p>多次晋升调薪机会</p>
						<p>五险一金商业保险（试用期即可享受）</p>
						<p>免费体检 节假日礼品 健身房 餐补 交通补 租房优惠</p>
					</div>
				</div>
				<div class="xjh-main-item">
					<div class="xjh-main-top">
						<i class="xjh-main-icon iconfont icon-fuli1"></i>
						<div class="xjh-main-name">申请通道</div>
					</div>
					<div class="xjh-main-box">
						<p>1、登陆新航道招聘公众号；</p>
						<p>
							2、发送简历至邮箱：zhaopin@xhd.cn（邮件标题备注：
							申请岗位-学校-姓名）
						</p>
						<p>3、校招咨询电话：（010）12345678</p>
					</div>
				</div>
				<router-link to="/joinus/sign?name=管培生" class="xjh-sign"
					>立即报名</router-link
				>
			</div>
		</template>
	</div>
</template>
<script lang="ts">
	import { defineComponent } from 'vue'
	import { lectureDetail } from '@/api/aboutus.api'
	import { reactive, toRefs } from 'vue'
	import { commonData } from '@/tool/type'
	// import { useRoute } from 'vue-router'
	export default defineComponent({
		props: {
			id: {
				type: String,
				default: '',
			},
		},
		setup(props) {
			type stateModel = {
				data: commonData
				initFlag: boolean
			}
			let state = reactive<stateModel>({
				data: {},
				initFlag: true,
			})
			if (props.id) {
				lectureDetail(props.id).then(res => {
					state.data = res.body
					state.initFlag = false
				})
			}

			return {
				...toRefs(state),
			}
		},
	})
</script>
<style lang="scss" scoped>
	.xjh {
		padding-bottom: 40px;
		min-height: 100vh;
		box-sizing: border-box;
		&-head {
			width: 750px;
			height: 350px;
			background: url(~@a/images/xjh-banner.jpg);
			background-size: 100%;
			color: #fff;
			&-name {
				font-size: 43px;
				line-height: 63px;
				padding: 20px;
			}
			&-name2 {
				font-size: 80px;
				line-height: 1;
				padding-top: 98px;
			}
			&-city {
				height: 38px;
				padding: 0 24px;
				color: #3f75f2;
				font-size: 24px;
				background: #fff;
				line-height: 38px;
				border-radius: 38px;
				display: inline-block;
				margin-bottom: 10px;
			}
			&-c {
				line-height: 40px;
				font-size: 24px;
			}
		}
		&-main {
			width: 670px;
			background-color: #ffffff;
			box-shadow: 0px 2px 26px 0px rgba(63, 117, 242, 0.3);
			border-radius: 10px;
			margin: -46px auto 0px;
			padding-bottom: 22px;
			&-title {
				display: flex;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				font-size: 32px;
				line-height: 1;
				padding: 40px 0;
				&:before,
				&:after {
					content: '';
					width: 122px;
					height: 44px;
					display: inline-block;
					background: url(~@a/images/t_left.png);
					background-size: 100%;
				}
				&:after {
					transform: rotate(180deg);
				}
			}
			&-icon {
				width: 38px;
				height: 38px;
				display: inline-block;
				background-color: #3483f7;
				color: #fff;
				line-height: 38px;
				font-size: 28px;
				border-radius: 50%;
			}
			&-top {
				display: flex;
				align-items: center;
			}
			&-name {
				font-size: 32px;
				display: flex;
				align-items: center;
				margin-left: 13px;
				white-space: nowrap;
				&:after {
					content: '';
					width: 422px;
					height: 2px;
					background: rgba(52, 131, 247, 0.5);
					display: inline-block;
					margin-left: 18px;
				}
			}
			&-item {
				padding: 0 20px;
			}
			&-box {
				color: #666;
				text-align: left;
				margin: 20px 0 20px 50px;

				pre {
					color: #666666;
					font-size: 24px;
					line-height: 38px;
					white-space: pre-line;
					font-family: '-apple-system,BlinkMacSystemFont', 'Helvetica Neue',
						Helvetica, Segoe UI, Arial, Roboto, 'PingFang SC', miui,
						'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
				}
				p {
					color: #666666;
					font-size: 24px;
					line-height: 38px;
				}
			}
		}
		&-sign {
			width: 440px;
			height: 67px;
			display: block;
			background-image: linear-gradient(0deg, #3483f7 0%, #6aa6fe 100%),
				linear-gradient(#3483f7, #3483f7);
			background-blend-mode: normal, normal;
			border-radius: 33px;
			font-family: MicrosoftYaHei;
			font-size: 30px;
			color: #ffffff;
			margin: 20px auto;
			line-height: 67px;
			&:active {
				background-image: linear-gradient(#3483f7, #3483f7),
					linear-gradient(0deg, #3483f7 0%, #6aa6fe 100%);
			}
		}
	}
</style>
