<template>
	<view class="container border_t">
		<view @click="jump({ url: 'mine/address/address' })" v-if="data.address" class="address_content">
			<template v-if="data.address.checked != 1">
				<view class="u-flex u-flex-1 u-flex-items-start"
					style="padding:30rpx 0 30rpx 30rpx;background: #fff;border-radius: 24rpx;">
					<image :src="`${imgUrl}v3-address.png`" style="width:48rpx;height:48rpx;margin-right:24rpx" mode="">
					</image>
					<view class="u-relative	u-flex-1">
						<view class="address_top_info">
							<text class="address_name">{{ data.address.realname }}</text>
							<text class="address_phone">{{ data.address.mobile }}</text>
						</view>
						<view class="address_details">
							<text
								v-if="data.address.adcode">{{ data.address.province + data.address.city + data.address.area + data.address.address }}</text>
							<text v-else style="font-size:24rpx;font-weight: normal;color:red"> 请重新编辑 </text>
						</view>
						<image class="image" :src="`${imgUrl}toRight2.png`" mode="aspectFit"></image>
					</view>
				</view>
			</template>
			<view v-else style="width: 686rpx;height: 112rpx;background: #fff;border-radius: 24rpx;padding-left: 18rpx;"
				class="u-flex ">
				<image :src="`${imgUrl}ziti.png`" style="width:48rpx;height:48rpx"></image>
				<text style="color:#2A2A2A" class="u-font-28 text-bold">自提</text>
				<image class="image" :src="`${imgUrl}toRight2.png`" mode="aspectFit"></image>
			</view>

		</view>
		<!-- <info-template  class="v3_info_style" v-else @click="jump({ url: 'mine/address/address' })"
			title="添加收货地址" :icon="true">
			<image slot="icon" class="v3_info_style_image" :src="`${imgUrl}v3-address.png`" mode="aspectFit"></image>
		</info-template> -->

		<view v-else class="v3_info_order u-flex">
			<info-template style="flex:1" class="v3_info_style" @click="jump({ url: 'mine/address/address' })"
				title="添加收货地址" :icon="true">
				<image slot="icon" class="v3_info_style_image" :src="`${imgUrl}v3-address.png`" mode="aspectFit">
				</image>
			</info-template>

		</view>

		<view class="goods_info">
			<view class="goods_item">
				<goodsItemOrder v-for="(item, index) in data.goods" :key="index" width="100%" :item="item">
				</goodsItemOrder>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1">商品总额</text>
				<text class="order_desc_right u-line-1">¥{{data.price_sum}}</text>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1 ">运费</text>
				<text class="order_desc_right u-line-1">¥{{data.freight}}</text>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1">优惠金额</text>
				<text class="order_desc_right u-line-1 order_desc_discount">-¥{{data.benefits}}</text>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1">订单备注</text>
				<!-- <text class="order_desc_right u-line-1"> -->
				<input style="width: 500rpx; text-align: right" type="text" v-model="remark" placeholder="选填"
					placeholder-class="light_color" />
				<!-- </text> -->
			</view>
		</view>
		<!-- <view class="remark">
      <info-template title="订单备注:">
        <input style="width: 500rpx; text-align: right" type="text" v-model="remark" placeholder="选填"
          placeholder-class="light_color" />
      </info-template>
    </view> -->
		<view class="footer shadow u-flex">
			<view class="total">
				<text>总计：<text class="order_desc_discount"> ￥{{data.price_sum}}</text></text>

			</view>
			<view class="button">
				<my-button @click="handleSubmitOrder" margin=" 0 0 0 32rpx" width="184" height="72" bg="#00B8A2">提交订单
				</my-button>
			</view>
		</view>
	</view>
</template>

<script>
	import goodsItemOrder from './components/goodsItemOrder.vue'
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {

				name: 'submitOrder', //当前页面名字
				remark: '', //订单备注
				data: {}, //下单商品数据
				type: null // cart购物车下单 否则是商品详情直接下单
			}
		},
		onLoad(option) {
			this.type = option.type
			this.data = JSON.parse(uni.getStorageSync('submitOrderData'))

			// uni.removeStorageSync('submitOrderData')
		},

		components: {
			goodsItemOrder,
			infoTemplate,
			myButton
		},
		methods: {
			// 提交订单
			handleSubmitOrder() {
				try {
					if (!this.data?.address.checked) return this.$common.toast('请选择自提或者收货地址')
					if ( this.data?.address.checked === 2 && !this.data?.address.adcode) return this.$common.toast('请重新编辑收货地址')
					// const ids = this.data.order_info.map((item) => item.cid)
					let goods = []
					this.data.goods.map(res => goods.push({
						goods_id: res.id,
						goods_num: res.goods_num
					}))
					let data = {
						goods,
						address_id: this.data?.address.checked === 1 ? 0 : this.data.address.id,
						pay_remark: this.remark
					}
					if (this.$store.state.user.userInfo.role_id == 2) data.hospital_id = uni.getStorageSync(
						'hospitalId') || 0
					if (this.type === 'card') data.shop_cart = []
					this.$request({
						url: '/ApiV3/Mobile/Order/create',
						loading: true,
						data
					}).then(res => {
						// 跳去支付
						uni.redirectTo({
							url: `/pages/home/shoppingMall/pay?order_id=${res.data.order.id}&order_sn=${res.data.order.order_sn}&pay_amount=${res.data.order.pay_fee}`
						})
					})
					// let url = ''
					// let data = {}
					// if (this.type === 'card') {
					//   // 购物车下单
					//   url = '/api/create_cart_order'
					//   data = {
					//     cids: ids.join(','),
					//     address_id: this.data.address.id,
					//     order_remark: this.remark
					//   }
					// } else if (this.type === 'buy') {
					//   // 直接购买下单
					//   const { goods_id, goods_number, check_specs } = this.data.order_info[0]
					//   url = '/api/create_order'
					//   data = {
					//     goods_id,
					//     goods_number,
					//     address_id: this.data.address.id,
					//     check_specs: check_specs || '',
					//     order_remark: this.remark
					//   }
					// }
					// this.$axios({
					//   url,
					//   errMsg: true,
					//   loading: true,
					//   data
					// }).then((res) => {
					//   if (this.data.is_points === 1) {
					//     // 纯积分购买直接跳去订单页
					//     uni.redirectTo({
					//       url: `/pages/order/order`
					//     })
					//   } else {
					//     // 跳去支付
					//     uni.redirectTo({
					//       url: `/pages/home/shoppingMall/pay?order_id=${res.data.order_id}&order_sn=${res.data.order_sn}&pay_amount=${res.data.pay_amount}`
					//     })
					//   }
					// })
				} catch (e) {
					console.log('[ err ]-133', e)
				}
			},
			getBuyData(item) { //checked 1 自提 2 选地址
				let checked = item ? 2 : 1
				item = item ? item : {},

					this.$set(this.data, 'address', { ...item, checked })
				const data = JSON.stringify(this.data)
				uni.setStorageSync('submitOrderData', data)
				//    if (this.type === 'buy') {

				//  this.data.address = item
				//  this.$set
				//  const data = JSON.stringify(this.data)
				//  uni.setStorageSync('submitOrderData', data)

				//    } else if (this.type === 'card') {
				//  this.data.address = item
				//  console.log(this.data)
				//  const data = JSON.stringify(this.data)
				//  uni.setStorageSync('submitOrderData', data)

				//    }
			},
			jump({
				url = '',
				data = ''
			}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.container {
		padding: 30rpx;
		padding-bottom: 170upx;

		.address_content {
			position: relative;
			// padding: 30upx;
			// background: #ffffff;
			border-radius: 40rpx;
			display: flex;

			.image {
				position: absolute;
				top: 50%;
				right: 32rpx;
				transform: translateY(-50%);
				width: 14upx;
				height: 25upx;
			}

			.address_top_info {
				font-size: 32upx;
				font-weight: bold;

				.address_name {
					margin-right: 20upx;
				}
			}

			.address_details {
				margin-top: 12upx;
				color: #888888;
				width: 90%;
			}
		}

		.goods_info {
			padding: 28rpx 0;
			margin-top: 30upx;
			background: #ffffff;
			border-radius: 30rpx;

			.goods_item {

				// margin-bottom: 40upx;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.remark {
			.info_template {
				border-radius: 0 0 30rpx 30rpx;
			}
		}

		.footer {
			justify-content: flex-end !important;
			position: fixed;
			left: 0;
			bottom: 0;
			width: 690upx;
			height: 140upx;
			padding: 0 30upx;
			box-sizing: content-box;
			background: #ffffff;
			justify-content: space-between;

			.total {
				text {
					&:nth-child(2) {
						font-size: 24upx;
						color: #fd5624;
					}

					&:nth-child(3) {
						font-size: 32upx;
						color: #fd5624;
					}
				}
			}
		}

		.v3_info_order {
			// background: #ffffff;
			// padding: 0 0 0 30rpx;
			min-height: 105rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 28rpx;
			position: relative;
			border-radius: 24rpx;

		}

		.v3_info_style {
			.info_template {
				border-radius: 24rpx;
				// padding:0;
				background: #ffffff;
				border-bottom: none !important;

				.info_left {
					text {
						color: #2a2a2a;
						font-weight: bold;
						font-size: 28rpx;
					}
				}
			}

			&_image {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}
		}
	}
</style>