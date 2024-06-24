<template>
	<view v-if="copyItem.body && copyItem.body.type === 'QUESTION1'" class="message_share_assess2 triangle" @tap="clickMessage">
		<view class="u-flex">
			<view class="view1 u-flex">
				<text class="share_assess_title2">知情同意书</text>
				<text class="u-font-20" style="color:#888888">请于48小时内签名确认</text>
				<view class="view2 u-flex u-m-t-24">
					
					<text v-if="copyItem.flag === 1" class="u-font-18 u-line-2"
						style="color:#D3D3D3">剩余时间：{{ countDown(copyItem) }}</text>
					<template v-else-if="copyItem.flag === 2">
						<text class="u-font-18 u-line-2" style="color:#D3D3D3">已完成 </text>
						<u-icon color="#00B8A2" style="margin-left:12rpx" size="20" name="checkmark-circle"></u-icon>
					</template>
					<template v-else-if="copyItem.flag === 3">
						<text class="u-font-18 u-line-2" style="color:#D3D3D3">已过期 </text>
						<u-icon color="#C62626" style="margin-left:12rpx" size="20" name="info-circle"></u-icon>
					</template>
					<template v-else>
						<u-loading size="20" mode="circle"></u-loading>
					</template>

				</view>
			</view>
			<image class="u-m-l-40" :src="`${imgUrl}v3_msg-file.png`" mode="aspectFit"></image>
		</view>

	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				copyItem:{}
			}
		},
		props: {
			item: {
				default:()=> {},
				type: Object
			}
		},
		computed: {
			...mapGetters(['userInfo'])
			
		},
		watch: {
			item: {
				async handler(newValue, oldValue) {
					this.copyItem = JSON.parse(JSON.stringify(newValue))
					if(this.copyItem.body.type !== 'QUESTION1') return
					try {
						if(this.copyItem.body.id){
							this.copyItem.is_consent_user_sign = await this.getis_consent_user_sign(this.copyItem.body.id)
						}
						// this.$set(item,'is_consent_user_sign',await this.getis_consent_user_sign(item.body.id))
						
					} catch (e) {
						//TODO handle the exception
					}
					if (this.copyItem.body.end) {
						let now = new Date().getTime()
						let countDownTime = new Date(this.copyItem.body.end).getTime()
						
						if (this.copyItem.is_consent_user_sign === 1) { //已完成
							
							this.$set(this.copyItem,'flag',2)
						} else if (countDownTime >= now) { //未填写 48小时内未签名
							
							this.$set(this.copyItem,'flag',1)
						} else { //已作废 超过48小时未签名
							
							this.$set(this.copyItem,'flag',3)
						}
					}
					
					// this.$forceUpdate()
					console.log('this.copyItem',this.copyItem,)
					
					
					
				},
				deep: true,
				immediate:true
			}
		},
		methods: {
			showType(item) { //未签名 1 已完成 2 已作废 3
			
			
				// let flag = ''
				// try {
					
				// 	this.$set(item,'is_consent_user_sign',await this.getis_consent_user_sign(item.body.id))
					
				// } catch (e) {
				// 	//TODO handle the exception
				// }
				// if (item.body.end) {
				// 	let now = new Date().getTime()
				// 	let countDownTime = new Date(item.body.end).getTime()
					
				// 	if (item.is_consent_user_sign === 1) { //已完成
				// 		flag = 2
				// 	} else if (countDownTime >= now) { //未填写 48小时内未签名
				// 		flag = 1
				// 	} else { //已作废 超过48小时未签名
				// 		flag = 3
				// 	}
				// }
				// console.log('flag',flag)
				// return flag
			
		
				
			},
			getis_consent_user_sign(id) {

				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Questionnaire/show',
						method: 'get',
						data: {
							id
						}
					}).then((res) => {

						resolve(res.data.is_consent_user_sign)

					})
				})

			},
			countDown(item) {
				if (!item.body.end) return ''

				let now = new Date().getTime()
				let countDownTime = new Date(item.body.end).getTime()
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
			clickMessage() {
				let id = this.item.body.id
				//打开预览页面
				uni.navigateTo({
					url: '/pages/question/question2?id=' + id + '&is_me_send=' + Number(this.item.is_me_send)
				})
			}
		}
	}
</script>

<style lang="scss">
	.message_share_assess2 {
		background: #ffffff;
		padding: 18upx 26upx;
		border-radius: 16upx;
		width: 400rpx;

		&::after {
			border-color: transparent transparent transparent #ffffff !important;
		}

		image {
			width: 97upx;
			height: 72upx;
		}

		.view2 {
			.share_assess_desc2 {
				width: 360upx;
				margin-top: 10upx;
				font-size: 24upx;
				color: #888888;
			}
		}

		.view1 {
			width: 260upx;
			// margin-right: 30upx;
			flex-direction: column;
			align-items: flex-start;

			.share_assess_title2 {
				font-size: 28upx;
				font-weight: bold;
			}
		}
	}
</style>