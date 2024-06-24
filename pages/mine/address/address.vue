<template>
	<view class="container container_padding_bottom">
		<view class="address_content">
			<view style="text-align: ;" @click="ziti()">
				<view style="width: 686rpx;height: 112rpx;background: #fff;border-radius: 24rpx;padding-left: 18rpx;"
					class="u-flex ">
					<image :src="`${imgUrl}ziti.png`" style="width:48rpx;height:48rpx"></image>
					<text style="color:#2A2A2A" class="u-font-28 text-bold">自提</text>
				</view>
			</view>
			<u-gap height="24"></u-gap>
			<view class="address_item" @click="selectAddress(item)" v-for="(item, index) in addressList" :key="index">
				<view class="address_info">
					<view class="consignee">
						<view>
							<view class="consignee_name">
								<text>{{ item.realname }}</text>
								<text>{{ item.mobile }}</text>
								<button v-if="item.is_default === 1" class="checked_btn">默认</button>
							</view>
						</view>
						<text class="area"
							v-if="item.adcode">{{ item.province }}{{ item.city }}{{ item.area }}{{ item.address }}</text>
						<text class="area" :class="{border:!item.adcode}" v-else
							@click.stop="regionShow=true;currentId = item.id">
							<text style="font-size:24rpx;font-weight: normal;"
								:style="{color:!item.adcode}">请选择地区</text>
						</text>
					</view>
					<view @click.stop="jump({ url: 'mine/address/createdAddress', edit: true, item: item })"
						class="u-flex-y-center u-p-r-30">
						<image class="consignee_image" :src="`${imgUrl}v3_icon_edit.png`" mode="aspectFit"> </image>
					</view>
				</view>

			</view>
			<view class="blankpage" v-if="afterLoading && !addressList.length">
				<image class="blankpage_image" :src="`${imgUrl}v3_address_blankpage.png`" mode="aspectFit"> </image>
				<view>您还没有添加收货地址</view>
				<view>先新增一个吧~</view>
			</view>
		</view>
		<u-picker mode="region" confirm-color="#00B8A2" v-model="regionShow" @confirm="handleConfirmAddress"></u-picker>
		<view class="container_footer">
			<!-- #ifdef APP-PLUS -->
			<my-button @click="jump({ url: 'mine/address/createdAddress' })" width="690" height="100" bg="#00B8A2">新建地址
			</my-button>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<my-button @click="whatAddress" width="224" height="72" bg='#00b8a2' fontWeight='400' margin="0 80rpx 0 0">
				微信地址
			</my-button>
			<my-button @click="jump({ url: 'mine/address/createdAddress' })" fontWeight='400' width="224" height="80"
				bg="#00B8A2">新建地址
			</my-button>
			<!-- #endif -->
		</view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				addressList: [], //地址列表
				afterLoading: false, //是否加载完
				regionShow: false,
				currentId: null, //选中的当前地址id
			}
		},
		components: {
			myButton
		},
		onShow() {
			this.getAddressList()
		},
		methods: {
			// 微信添加地址
			whatAddress() {
				uni.getSetting({
					success: (res) => {

						let auth = res.authSetting['scope.address']
						if (auth === false) {
							// 没有权限就打开小程序权限设置
							this.openSetting()
						} else {
							// 有权限则选择地址添加
							uni.chooseAddress({
								success: (res) => {
									console.log('res: ', res)
									const data = {
										province: res.provinceName,
										city: res.cityName,
										area: res.countyName,
										address: res.detailInfo,
										realname: res.userName,
										mobile: res.telNumber,
										is_default: 0
									}
									this.$request({
										url: '/ApiV3/Mobile/OrderAddress/save',
										errMsg: true,
										loading: true,
										data
									}).then((res) => {
										this.$common.toast('添加成功')
										this.getAddressList()
									})
								},
								fail: (err) => {
									console.log('fail', err)
									if (err.errMsg === 'chooseAddress:fail auth deny') {
										this.openSetting()
									}
								}
							})
						}
					}
				})
			},
			// 打开小程序权限设置
			openSetting() {
				this.$common
					.showModal({
						content: '检测到您没打开获取地址功能权限，是否去设置打开？'
					})
					.then((res) => {
						uni.openSetting()
					})
			},
			ziti(){
							if (this.$common.prePage()?.name === 'submitOrder') {
								// 如果是从订单确认页进来
								// 则修改订单确认页的数据 并调用getBuyData方法
								// item.id = item.id
								this.$common.prePage().getBuyData()
								uni.navigateBack({
									delta: 1
								})
							}
						},
			// 选择地址
			selectAddress(item) {
				console.log(item, 67)
				if (!item) {
					uni.vibrateShort({

					})

				} else {
					if (this.$common.prePage()?.name === 'submitOrder') {
						// 如果是从订单确认页进来
						// 则修改订单确认页的数据 并调用getBuyData方法
						// item.id = item.id
						this.$common.prePage().getBuyData(item)
						uni.navigateBack({
							delta: 1
						})
					}
				}


			},
			// 选址省市区
			handleConfirmAddress(e) {
				let data = {}
				this.addressList.find(v => {
					if (v.id === this.currentId) {
						v.province = e.province.label
						v.city = e.city.label
						v.area = e.area.label
						v.adcode = e.area.value
						data = {
							province: e.province.label,
							city: e.city.label,
							area: e.area.label,
							id: v.id,
							adcode: v.adcode
						}
						return
					}
				})
				this.$request({
					url: '/ApiV3/Mobile/OrderAddress/save',
					errMsg: true,
					loading: true,
					data
				}).then((res) => {
					this.$common.toast('添加成功')
					// this.getAddressList()
				})
				console.log('this.addressList: ', this.addressList)
			},
			// 获取地址列表
			getAddressList() {
				this.afterLoading = false
				this.$request({
					url: '/ApiV3/Mobile/OrderAddress/index',
					method: 'get',
					errMsg: true,
					loading: true
				}).then((res) => {
					this.addressList = res.data.data
					this.afterLoading = true
				})
			},


			// 通用跳转
			jump({
				url = '',
				data = {},
				edit = false,
				item = {}
			}) {
				if (edit) {
					data.edit = true
					data.addressData = JSON.stringify(item)
				}
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
		background: #f1f1f1;
	}

	.container {
		.border {
			border: none;
			padding-bottom: 4rpx;
			border-bottom: 1px solid red;

			color: red !important
		}

		.address_content {
			padding: 30upx;

			.consignee_image {
				// flex: 1;
				height: 48rpx;
				width: 48rpx;
			}

			.address_item {
				margin-bottom: 20upx;
				width: 690upx;
				border-radius: 20upx;
				background: #ffffff;

				&:last-child {
					margin-bottom: 0;
				}

				.address_info {
					// padding: 30upx;
					display: flex;
					align-items: stretch;

					.consignee {
						display: flex;
						flex: 1;
						flex-direction: column;
						margin: 30rpx;
						justify-content: center;
						// margin-bottom: 10rpx;
						color: #2a2a2a;
						font-weight: bold;
						font-size: 28rpx;

						.consignee_name {
							flex: 2;
							display: flex;
							margin-bottom: 10rpx;
						}

						text {
							&:nth-child(1) {
								margin-right: 16rpx;
							}

							&:nth-child(2) {}
						}



						.checked_btn {
							font-size: 20rpx;
							color: #00b8a2;
							width: 88rpx;
							height: 40rpx;
							line-height: 40rpx;
							margin: 0 32rpx;
							padding: 0;
							border-radius: 24rpx;
							font-weight: 400;
							background: #f1fbfa;

							&::after {
								border: 0;
							}
						}
					}

					.area {
						font-size: 28rpx;
						color: #4b4b4b;
					}
				}

				.address_operation {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 30upx;

					.operation_left {
						display: flex;
						align-items: center;

						.noChecked {
							width: 30upx;
							height: 30upx;
							border-radius: 50%;
							border: 1px solid #888888;
						}

						image {
							width: 30upx;
							height: 30upx;
						}

						text {
							font-size: 24upx;
							margin-left: 10upx;
						}
					}

					.operation_right {
						display: flex;

						.operation_item {
							display: flex;
							align-items: center;

							image {
								width: 26upx;
								height: 26upx;
							}

							text {
								margin-left: 10upx;
								font-size: 24upx;
							}

							&:first-child {
								margin-right: 30upx;
							}
						}
					}
				}
			}
		}

		.container_footer {
			position: fixed;
			left: 0;
			bottom: 116rpx;
			z-index: 10;
			width: 750upx !important;
			padding-top: 30upx;
			padding-bottom: 30upx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>