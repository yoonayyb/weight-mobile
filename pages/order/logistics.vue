<template>
	<view class="container">
		<view class="header" v-if="logisticsData.goods">
			<view class="u-flex" v-for="(item,index) of logisticsData.goods || []" :key="index">
				<view style="display: flex;flex-direction: column;align-items: center;position: relative;">
					<image :src="item.goods_img" mode="">
						<text
							style="position: absolute;bottom:10rpx;background-color: rgba(84,84,84,0.6);width:100%;text-align: center;color:white;padding: 4rpx;">共{{item.goods_number}}件商品</text>
					</image>
				</view>
				<view class="u-m-l-20">
					<view class="u-line-3" style="font-weight: bold;font-size: 28rpx;max-width: 440rpx;">
						{{item.goods_name}}</view>
					<view style="margin-top: 8rpx;"> {{logisticsData.info.express_name}}
						{{logisticsData.info.express_no}} <text v-if="logisticsData.info.express_no"
							style="color:#00B8A2;margin-left: 8rpx;" @click="copyText">复制</text> </view>
				</view>

			</view>
		</view>
		<view class="content">
			<!-- <view class="title" v-if="type !== 'afterSales'"> 物流动态 </view> -->
			<view v-if="logisticsData.info" style="padding:32rpx 32rpx 0  32rpx;color:#4B4B4B;line-height: 1.8;">收货地址:
				{{logisticsData.info.province +logisticsData.info.city + logisticsData.info.area + logisticsData.info.address}}
			</view>
			<view class="logistics_info">

				<view class="logistics_item" v-for="(item, index) in logisticsData.logistics.data" :key="index">
					<view class="dot"><text></text></view>
					<view class="logistics_item_info">
						<view style="font-size: 24rpx;" :class="{active:!index}"> <text
								style="font-weight: bold;font-size: 28rpx;margin-right: 6rpx">{{ item.status }}</text>
							{{ item.time }}
						</view>
						<rich-text :nodes="item.context"></rich-text>
						
					</view>
				</view>
				<!-- <u-empty v-if="!logisticsData.logistics.data.length && afterLoading" margin-top="200" text="暂无物流信息"
					mode="list"></u-empty> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				id: '', //id值    订单id或者售后id
				logisticsData: {}, //物流信息
				afterLoading: false, //是否加载完
				type: '' //如果为afterSales是售后 不然则是物流
			}
		},
		onLoad(option) {

			this.getLogisticsData(option)
		},
		methods: {
			copyText() {
				uni.setClipboardData({
					data: this.logisticsData?.info?.express_no,
					success: function(res) {
						console.log('复制的信息：', this.logisticsData.info.express_no);
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			},
			// 获取物流跟踪数据
			getLogisticsData(option) {


				this.afterLoading = false
				this.$request({
					url: '/ApiV3/Mobile/Order/logistics',
					data: {
						express_code: option.express_code,
						express_no: option.express_no,
						order_id: option.order_id
					}
				}).then(({
					data
				}) => {
					this.afterLoading = true
					this.logisticsData = data
					let reg = /（(.+?)）/g
					let arr = this.logisticsData?.logistics?.data || []
					arr.forEach(v => {
						let person = v.context.match(reg) && v.context.match(reg)[0]
						if(person){
							v.context = v.context.replace(person,'<span class="active">' + person +'</span>')
							
						}
						
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
		padding: 32rpx;
		height: 100%;

		.header {
			font-size: 24rpx;
			margin-bottom: 24rpx;
			max-width: 686rpx;
			min-height: 224rpx;
			padding: 32rpx;
			

			background: #ffffff;
			border-radius: 24rpx;

			image {
				width: 160rpx;
				height: 160rpx;
			}

			.logistics_name {
				padding-top: 28upx;
				display: flex;

				image {
					width: 48upx;
					height: 48upx;
					margin-right: 20upx;
				}

				text {
					font-size: 30upx;
				}
			}

			.logistics_number {
				margin-top: 13upx;
				// padding-left: 68upx;
				font-size: 24upx;
			}
		}

		.content {
			width: 690upx;
			background: #ffffff;
			min-height: 90vh;
			border-radius: 24rpx;

			.title {
				color: #333333;
				padding: 25upx 40upx;
				border-bottom: 1px solid #ebebeb;
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
