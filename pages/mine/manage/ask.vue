<template>
	<view class="page">
		<!-- <u-navbar back-text=" "  title="问卷" title-size="32" title-bold :custom-back="back"></u-navbar> -->
		<block v-if="arr.length">
			<view class="content" v-for="(v,index) of arr" :key="index"
				@click='contentClickFn({user_id:v.user_id,id:v.id})'>
				<view class="content_title">
					<text>知情同意书
						<text v-if="showType(v) === 1" class="u-font-20 u-m-l-34"
							style="color: #00B8A2;">剩余时间：{{ countDown(v) }}</text>
						<text v-if="showType(v) === 3" class="u-font-20 u-m-l-34" style="color:#D3D3D3;">已过期</text>
					</text>


					<text class="content_title_r" v-if="showType(v) === 1"
						style="background: rgba(255,193,145,0.2);color:#FF9F54;">未填写</text>
					<text class="content_title_r" v-else-if="showType(v) === 2"
						style="background: rgba(0,184,162,0.2);color:#00B8A2;">已完成</text>
					<text class="content_title_r" v-else
						style="background: rgba(0,0,0,0.1);color:#666666;">已作废</text>
				</view>
				<view class="content_info">
					<view class="content_info_item u-font-20" style="color:#9B9B9B">
						<view class="u-flex" style="flex:1">
							<view>发起</view>
							<view class="u-font-24" style="color:#2A2A2A;margin-left: 72rpx;flex:1">
								{{v.creator && v.creator.nickname || '营养师昵称'}}
							</view>
						</view>
						<view>{{v.created_at}}</view>

					</view>
					<view class="content_info_item u-font-20" style="color:#9B9B9B">
						<view class="u-flex" style="flex:1">
							<view>填写</view>
							<view class="u-font-24" style="color:#2A2A2A;margin-left: 72rpx;flex:1">
								{{v.recipient && v.recipient.nickname || '会员昵称'}}
							</view>
						</view>
						<view>{{ v.is_consent_user_sign === 1 ? v.updated_at:'--'}}</view>

					</view>
				</view>
			</view>
		</block>
		<view class="v3_empty" v-if="!arr.length && afterLoading">
			<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_ganyu_empty.png`"></image>
			<view class="u-m-t-16">
				暂无问卷记录
			</view>
		</view>
		<image v-if="roles && user_id" @click="addJump" :src="`${imgUrl}record_icon_add@2x.png`" class="fixed_box"
			mode=""></image>
		<puestionnaire-popup @questionnaireCreate="questionnaireCreateHandler" :friendUid="user_id"
			@open="questionnairePopupShow = true" @close="questionnairePopupShow = false"
			:show="questionnairePopupShow">
		</puestionnaire-popup>
	</view>
</template>

<script>
	import puestionnairePopup from '../components/puestionnairePopup.vue'
	export default {


		data() {
			return {
				page: 1,
				afterLoading: false,
				length: null,
				roles: '',
				questionnairePopupShow: false,
				statusObj: {
					0: '未填写',
					1: '已完成',
					2: '已作废',
				},
				arr: [],
				user_id: ''
			}
		},
		onLoad(option) {
			console.log(this.$store.state.user.userInfo)
			//只有营养师才能添加
			this.roles = this.$store.state.user.userInfo.roles?.isServer

			if (option.user_id) {
				this.user_id = option.user_id
				console.log(this.user_id)

			}
			this.getWeightCycle()
		},
		// onShow() {
		// 	this.page = 1
		// 	this.getWeightCycle()
		// },
		components: {
			puestionnairePopup
		},
		onReachBottom() {
			if (this.length) {
				this.page++
				this.getWeightCycle()
			}
		},
		methods: {
			back() {
				let url = '/pages/tabbar/mine'

				if (this.user_id) {
					url = '/pages/mine/manage/detail?user_id=' + this.user_id

					uni.redirectTo({
						url
					})
				} else {
					uni.switchTab({
						url
					})
				}


			},
			setQuestion(id){
				console.log('执行到这里了',id)
				this.arr.forEach((v,i)=>{
				   if(v.id == id){
					   v.is_consent_user_sign = 1
					   this.$forceUpdate()
					   console.log('vvvv',v)
				   }
			   })
			},
			showType(item) { //未签名 1 已完成 2 已作废 3

				let flag = ''

				if (item.end_at) {
					let now = new Date().getTime()
					let countDownTime = new Date(item.end_at).getTime()
					if (item.is_consent_user_sign === 1) { //已完成
						flag = 2
					} else if (countDownTime >= now) { //未填写 48小时内未签名
						flag = 1
					} else { //已作废 超过48小时未签名
						flag = 3
					}
				}
				return flag
			},
			countDown(item) {
				if (!item.end_at) return ''

				let now = new Date().getTime()
				let countDownTime = new Date(item.end_at).getTime()
				if (countDownTime >= now) {
					return this.formatTime((countDownTime - now) / 1000)
				} else {
					return '00:00:00'
				}
			},
			formatTime(time) {
				// 将时间格式化为 hh:mm:ss 的形式
				let hour = Math.floor(time / 3600);
				let minute = Math.floor((time - hour * 3600) / 60);
				let second = Math.floor(time - hour * 3600 - minute * 60);
				// console.log(this.second)
				return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
			},
			getWeightCycle() {
				this.afterLoading = false
				this.$request({
						url: '/ApiV3/Mobile/Questionnaire/history',
						method: 'GET',
						loading: true,
						data: {
							page: this.page,
							user_id:this.user_id
						}
					})
				.then((res) => {
					console.log('[ res ]-157', res)

					if (this.page === 1) {
						this.arr = res.data.data
					} else {
						this.arr = [...this.arr, ...res.data.data]
					}
					this.afterLoading = true
					this.length = res.data.next_page_url
				})
				.catch(async (err) => {})
			},
			contentClickFn(params) {
				// uni.navigateTo({
				// 	url: `/pages/changePlanInfo/index?item=${JSON.stringify(params)}`
				// })
				//判断是不是自己给自己发起的

				//打开预览页面
				uni.navigateTo({
					url: '/pages/question/question1?id=' + params.id
				})
			},

			addJump() {
				this.questionnairePopupShow = true
				// this.contentClickFn({
				// 	user_id: this.user_id,
				// 	type: 'add'
				// })
			},
			questionnaireCreateHandler(id, end, type = 'TOSIGN') {
				this.page = 1
				this.getWeightCycle()
				uni.pageScrollTo({
					scrollTop: 0
				})
				this.questionnairePopupShow = false
				return
			},
			jump({
				url = '',
				data = {}
			} = {}) {
				console.log(111);
				this.$common.jump({
					url,
					data,
					that: this
				})
			},

		}
	}
</script>

<style lang='scss' scoped>
	.page {
		min-height: 100vh;
		background-color: #fafafa;
		padding: 24rpx 32rpx;

		.content {
			background-color: #fff;
			padding: 24rpx 28rpx 28rpx 42rpx;
			border-radius: 24rpx;
			margin-top: 24rpx;

			.content_title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				font-weight: bold;
				color: #2a2a2a;

				&_r {
					font-weight: bold;
					font-size: 20rpx;
					text-align: center;
					padding: 4rpx 30rpx;
					background: rgba(0, 184, 162, 0.2);
					border-radius: 16rpx;
					color: #00b8a2;
				}

				.type1 {
					color: #FF9F54;
					background: rgba(255, 193, 145, 0.2);
				}

				.type2 {
					color: #00B8A2;
					background: rgba(0, 184, 162, 0.2);
				}

				.type3 {
					color: #666666;

					background: rgba(0, 0, 0, 0.1);
				}
			}

			.content_info {
				/* display: flex;
      align-items: center;
      justify-content: space-around; */
				/* margin-top: 36rpx; */

				&_item {
					flex: 1;
					margin-top: 28rpx;
					display: flex;
					align-items: center;
					justify-content: space-between;
				}
			}
		}
	}

	.color_00B8A2 {
		color: #00b8a2;
	}

	.color_ff7569 {
		color: #ff7569;
	}

	.disable {
		view {
			color: #c2c2c2 !important;
		}

		text {
			color: #c2c2c2 !important;
		}
	}

	.fixed_box {
		height: 124rpx;
		width: 124rpx;
		position: fixed;
		right: 44rpx;
		bottom: 150rpx;
	}

	.phase_change_below {
		display: flex;

		view {
			margin-left: 10rpx;
			margin-top: 0 !important;
		}
	}
</style>