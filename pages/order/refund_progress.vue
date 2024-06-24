<template>
	<view class="container">
		<view class="content">

			<view style="padding:32rpx 32rpx 0  120rpx;color:#4B4B4B;font-weight: bold;font-size: 32rpx;">退款进度</view>
			<view class="logistics_info">

				<timelineItem v-for="(item,index) of nodes" :lastChilren="index===nodes.length - 1" :key="index" :leftTime='item.create_time'
					:color="index === 0?'#00B8A2':''">	
					<view class="tripItem">
						<view class="title_mini">{{item.title}}</view>
						<text>{{item.remark}}</text>
					</view>
				</timelineItem>
				
				<u-empty v-if="!nodes.length && afterLoading" margin-top="200" text="暂无物流信息" mode="list"></u-empty>
			</view>
		</view>
	</view>
</template>

<script>
	import timelineItem from './components/chenbin-timeline/timelineItem.vue'
	export default {
		data() {
			return {
				id: '',
				logisticsData: {}, //物流信息
				nodes: [], //物流进度列表或者售后进度列表
				afterLoading: false, //是否加载完
				type: '' //如果为afterSales是售后 不然则是物流
			}
		},
		components: {

			timelineItem
		},
		onLoad(option) {

			this.id = option.id
			this.getLogisticsData()
		},
		methods: {
			copyText() {
				uni.setClipboardData({
					data: 'JDV123456789101',
					success: function(res) {
						console.log('复制的信息：', 'JDV123456789101');
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			},
			// 获取物流跟踪数据
			getLogisticsData() {
				this.afterLoading = false
				this.$request({
					url: '/ApiV3/Mobile/OrderAfterSale/log',
					method: 'get',
					data: {
						id: this.id
					}
				}).then(({
					data
				}) => {
					this.afterLoading = true
					this.nodes = data
					this.nodes.forEach(v=>{
						// v.create_time = v.create_time.split('-').slice(1).join('-')
						v.create_time = v.create_time.slice(5,-3)
					})
				})



			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f1f1f1;
	}

	.container {
		margin-top: 24rpx;
		height: 100%;



		.content {
			padding: 0 40rpx;
			background: #ffffff;
			min-height: calc(100vh - 24rpx);

			// border-radius: 24rpx;
			.tripItem {
				color: #2A2A2A;

				.title {
					font-size: 32rpx;
					font-weight: bold;
					padding-top: 30rpx;
					// padding: 25upx 40upx;
					// border-bottom: 1px solid #ebebeb;
				}

				.title_mini {
					font-size: 28rpx;
					font-weight: bold;
					padding-bottom: 22rpx;
				}
			}


			.logistics_info {
				padding-top: 38upx;
				
				.logistics_item {
					margin: 0 auto;
					width: 600upx;
					padding-bottom: 40upx;
					border-left: 1px solid #ebebeb;
					color: #C2C2C2;
					display: flex;

					&:first-child {
						color: #2A2A2A;

						.dot {
							margin-right: 20upx;
							width: 28upx;
							height: 28upx;
							background: #ffffff;
							border: 1px solid #00B8A2;
							border-radius: 50%;
							display: flex;
							justify-content: center;
							align-items: center;
							position: relative;
							top: 0rpx;
							left: -15rpx;
							// left: -16upx;

							text {
								width: 100%;
								height: 100%;
								border-radius: 50%;
								background: #00B8A2;
							}
						}
					}

					.active {
						color: #00B8A2;
					}

					&:last-child {
						border-left: none;
					}

					.dot {
						margin-right: 20upx;
						width: 28upx;
						height: 28upx;
						background: #e0e0e0;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						position: relative;
						top: 0;
						left: -15upx;
					}

					.logistics_item_info {
						flex: 1;

						>view {
							margin-bottom: 8rpx;
						}
					}
				}
			}
		}
	}
</style>
