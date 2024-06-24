<template>
	<view class="container" :style="{ overflowY: ifShow ? 'hidden' : 'show', height: ifShow ? '100vh' : 'auto' }">
		<view class="banner">
			<swiper class="swiper" autoplay circular>
				<swiper-item v-for="(item, index) in data.images" :key="index">
					<image :src="item.url" mode="aspectFill"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="goods_top_info">
			<view class="goods_price" v-if="data.makeprice"> ￥<text>{{ data.makeprice }}</text>
				<text v-if="data.makeprice != data.goodsprice"
					class="goods_price_goodsprice">￥{{ data.goodsprice || '' }}</text>
			</view>
			<!-- <view class="goods_price" v-if="data.points_msg && type === 'integral'">
        
        ￥<text>{{ data.makeprice }}</text>

        <text class="u-m-l-30" style="font-size: 28upx; color: #c6c3c3; text-decoration: line-through"
          >￥{{ data.makeprice || '' }}</text
        >
      </view> -->
			<view class="goods_share u-flex" @click="appShare">
				<image :src="`${imgUrl}v3_commodity_icon_share.png`" mode="aspectFit"></image>
				<text>分享</text>
				<!-- <button type="default" open-type="share"></button> -->
			</view>
		</view>
		<view class="goods_title">
			<text>{{ data.title || '' }}</text>
		</view>
		<view class="basic_info">
			<view class="basic_info_item">
				<view class="basic_info_left">
					<text>选择</text>
				</view>
				<view class="basic_info_center u-line-1">
					<text>{{ data.short_title || '套餐' }}</text>
				</view>
				<!-- <view class="basic_info_right">
					<image :src="`${imgUrl}toRight2.png`" mode="aspectFit"></image>
				</view> -->
			</view>
		</view>
		<view class="basic_info">
			<view class="basic_info_item">
				<view class="basic_info_left">
					<text>运费</text>
				</view>
				<view class="basic_info_center u-line-1" v-if="data.postage">
					<text>¥{{ data.postage || '' }}</text>
				</view>
			</view>
		</view>
		<view class="goods_details_content" v-if="data.content">
			<u-parse :html="data.content"></u-parse>
		</view>
		<!--精选商品-->
		<view class="wrap" v-if="flowList.length">
			<view class="wrap_title">精选商品</view>
			<u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{ leftList }">
					<view @click="gotoCarefullyGoodDetail(item.id)" class="demo-warter" style="padding: 20rpx"
						v-for="(item, index) in leftList" :key="index">
						<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
						<u-lazy-load threshold="-450" border-radius="10" :image="item.thumb" :index="index">
						</u-lazy-load>
						<view style="margin-top: 10rpx">{{ item.title }}</view>
						<view class="wrap_goods_price" v-if="item.makeprice"> ￥<text>{{ item.makeprice }}</text>
							<text v-if="item.makeprice != item.goodsprice" class="u-m-l-20"
								style="font-size: 28upx; color: #c6c3c3; text-decoration: line-through">￥{{ item.goodsprice || '' }}</text>
						</view>
					</view>
				</template>
				<template v-slot:right="{ rightList }">
					<view @click="gotoCarefullyGoodDetail(item.id)" class="demo-warter" style="padding: 20rpx"
						v-for="(item, index) in rightList" :key="index">
						<u-lazy-load threshold="-450" :image="item.thumb" :index="index"> </u-lazy-load>
						<view style="margin-top: 10rpx">{{ item.title }}</view>
						<view class="wrap_goods_price" v-if="item.makeprice"> ￥<text>{{ item.makeprice }}</text>
							<text v-if="item.makeprice != item.goodsprice" class="u-m-l-20"
								style="font-size: 28upx; color: #c6c3c3; text-decoration: line-through">￥{{ item.goodsprice || '' }}</text>
						</view>
					</view>
				</template>
			</u-waterfall>
		</view>
		<view class="footer shadow u-flex">
			<view class="operation_btn u-flex" @click="jumpCustomerMessage">
				<image :src="`${imgUrl}shop-message.png`" mode="aspectFill"></image>
				<text>客服</text>
			</view>
			<view class="operation_btn u-flex u-relative" style="margin-left: 30rpx"
				@click="jump({ url: 'home/shoppingMall/cart' })">
				<image :src="`${imgUrl}v3_tab_commodity_icon_shoppingcart.png`" mode="aspectFill"></image>
				<u-badge size="mini" type="warning" :offset="[-10,0]" :count="badge"></u-badge>
				<text>购物车</text>
			</view>
			<my-button @click="openSkuPopup('card')" color="#00B8A2" border="#00B8A2" margin="0 30rpx 0 30rpx"
				width="192" height="72">加入购物车 </my-button>
			<my-button @click="openSkuPopup('buy')" width="192" height="72">立即购买</my-button>
			<!-- <view class="footer shadow u-flex" v-if="data.types!=='goods'">
			<my-button @click="jumpCustomerMessage" bg="#fc8a7b" margin="0 30rpx 0 0" width="330" height="80">咨询</my-button>
			<my-button @click="openSkuPopup('buy')" bg="#fd5624" width="330" height="80">立即购买</my-button>
		</view> -->
		</view>
		<u-popup v-model="actionSheetShow" :duration="50" mode="bottom" border-radius="30" closeable>
			<view class="pop-box">
				<view class="pop-box-weixin" style="text-align: center">
					<image style="width: 119rpx; height: 119rpx" :src="`${imgUrl}share-friends.png`" alt="" />
					<view style="margin-top: 10rpx">微信好友</view>
					<button type="default" open-type="share"></button>
				</view>
				<view @click="canvasShow" style="text-align: center">
					<image style="width: 119rpx; height: 119rpx" :src="`${imgUrl}share-haibao.png`" alt="" />
					<view style="margin-top: 10rpx">分享海报</view>
				</view>
			</view>
		</u-popup>
		<share-canvas ref="mycanvas" :ifShow.sync="ifShow" :hospitalTitle="hospitalTitle" :imageHead="imageHead"
			:textHead="textHead" :textHead2="textHead2" :goods_id="id">
		</share-canvas>
		<select-product-specs ref="selectProductSpecs" @specsConfirm="specsConfirm" @close="close" />
	</view>
</template>
<script>
	import selectProductSpecs from './components/selectProductSpecs.vue'
	import myButton from '@/components/myButton.vue'
	import shareCanvas from './share-canvas.vue'
	export default {
		data() {
			return {
				badge: 0, //购物车角标
				hospitalTitle: '',
				hospitalId: null, //商城-商品列表传过来的
				ifShow: false,
				actionSheetShow: false,
				flowList: [], //精选商品
				imageBg: '', //canvas背景图
				imageHead: [],
				imageBody: [],
				textHead: [],
				textHead2: [],
				canvasHight: uni.upx2px(1000),
				canvasWidth: uni.upx2px(638),
				inviterId: '', //邀请人id
				id: '', //商品id
				type: '', //商品类型  如果为integral则是积分商品 否则是普通商品
				data: {
					specsinfo: {}
				}, //详情数据
				skuPopupType: null, //是点击什么按钮弹起的规格弹框
				currentSkuData: {}, //当前选择的规格数据
				number: 1, //商品数量
				scene_id: '',
				role_id: '', //身份
				packs: [], //商品的规格
				goods_num: 0, //商品数量
				scene: '',
			}
		},
		async onShow() {
			setTimeout(() => {
				this.getCartData()
			}, 500)
		},
		async onLoad(option) {
			uni.setStorageSync('shop', 1)
			this.inviterId = uni.getStorageSync('inviterId')
			this.role_id = uni.getStorageSync('role_id')
			if (option.id) this.id = option.id
			if (option.hospitalId) {
				this.hospitalId = option.hospitalId
				uni.setStorageSync('hospitalId', option.hospitalId)
				this.$store.commit('sethospital_id', option.hospitalId)
			}
			console.log('goodsDetails option', option)
			if (option.scene) {
				//保存 防止未登录情况
				this.scene = option.scene
				uni.setStorageSync('inviterId', this.scene)
				await this.decodeUrl(option.scene)
			}
			if (option.scene_id) {
				//受邀进来
				this.inviterId = option.scene_id
				uni.setStorageSync('inviterId', option.scene_id)
				this.$store.commit('setInviterId', this.inviterId)
				if (uni.getStorageSync('token')) {
					// this.submitInviterId()
				}
			}
			console.log('option.hospitalId', option.hospitalId)
			await this.getGoodsData()
			this.getCarefullyGoods()
			console.log('this.inviterId', this.inviterId)
			console.log('this.id', this.id)
			console.log('this.role_id', this.role_id)
		},
		async onShareAppMessage() {
			if (uni.getStorageSync('token')) await this.getScene_id()
			// if (!uni.getStorageSync('token')) {
			//   return this.$common.toast('请先登陆')
			// }
			return {
				title: this.data.title,
				imageUrl: this.data.thumb,
				path: `/pages/home/shoppingMall/goodsDetails?id=${this.id}&scene_id=${this.scene_id}&role_id=${this.role_id}&hospitalId=${this.hospitalId}`
			}
		},
		methods: {
			// 获取微信code
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						onlyAuthorize: true,
						success: (res) => {
							resolve(res.code)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			// 获取购物车数量--角标
			getCartData() {
				let data = {
					page: 1
				}
				if (this.role_id == 2) data.hospital_id = this.hospitalId ?? uni.getStorageSync('hospitalId') ?? 0
				this.$request({
					url: '/ApiV3/Mobile/ShopCart/index',
					method: 'get',
					data
				}).then((res) => {
					this.badge = res.data.total
				})
			},
			decodeUrl(scene_id) {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/Tourists/decodeScene',
						loading: true,
						errMsg: true,
						data: {
							scene_id
						}
					}).then((res) => {
						console.log('res: ', res)
						this.id = res.data.gid
						this.inviterId = res.data.user_id || ''
						this.hospitalId = res.data.hospital_id
						uni.setStorageSync('hospitalId', this.hospitalId)
						this.$store.commit('sethospital_id', this.hospitalId)
						resolve()
					})
				})
			},
			close(item) {
				this.goods_num = item.goods_num
				if (this.id != item.id) {
					this.id = item.id
					this.getGoodsData()
					this.getCarefullyGoods()
				}
			},
			specsConfirm(item) {
				this.goods_num = item.goods_num
				if (this.id != item.id) {
					this.id = item.id
					this.getGoodsData()
					this.getCarefullyGoods()
				}
				// this.getGoodsData()
				// this.getCarefullyGoods()
				if (item.type === 'card') {
					this.addCard(item)
				} else if (item.type === 'buy') {
					this.immediatelyBuy(item)
				}
				console.log('[ item ]-301', item)
			},
			//多次解码
			getUrl(url) {
				if (url.indexOf('%') < 0) {
					return url
				} else {
					const newUrl = decodeURIComponent(url)
					return this.getUrl(newUrl)
				}
			},
			async canvasShow() {
				this.actionSheetShow = false
				//打印下面日志手机端控制台会报错，但不影响运行，原因未明。
				//获取画布的尺寸大小
				this.canvasHight = Math.floor(this.$refs.mycanvas.canvasHeight)
				this.canvasWidth = Math.floor(this.$refs.mycanvas.canvasWidth)
				this.textHead = [`￥${this.data.makeprice}`, this.canvasWidth * 0.08, this.canvasHight * 0.58,
					'#eb6449', 16
				]
				this.textHead2 = [this.data.title, this.canvasWidth * 0.08, this.canvasHight * 0.58 + 24, '#4A4A4A',
					16
				]
				this.imageHead = [this.data.images[0].url]
				// 如下，以canvasHight、canvasWidth为单位进行计算，达到动态布局以适应不同尺寸的手机
				this.ifShow = true // 显示画布
				//解决方法：可以将绘制方法写在异步方法中;
				//同时要注意组件的生命周期，确保实例挂载成功之后再执行,一般延时50ms（经验值，与硬件处理速度有关）执行即可。
				let tempTimeOut = setTimeout(() => {
					this.$refs.mycanvas.init(this.canvasHight, this.canvasWidth) //绘制画布
					clearTimeout(tempTimeOut)
				}, 50)
			},
			getScene_id() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/User/sharePage',
						// loading: true,
						// errMsg: true,
						method: 'get',
						data: {
							hospital_id: this.hospitalId
						}
					}).then(({ data }) => {
						this.scene_id = data.scene_id
						resolve()
					})
				})
			},
			// app分享
			appShare() {
				// #ifdef APP-PLUS
				this.$common.appShare({
					title: this.data.title,
					image: this.data.thumb,
					page: `/pages/home/shoppingMall/goodsDetails?id=${this.id}&type=${this.type}`
				})
				// #endif
				// this.canvasShow()
				this.actionSheetShow = true
			},
			// 跳转到im聊天
			jumpCustomerMessage() {
				// if (!uni.getStorageSync('token')) return this.$common.jumpLogin()
				// console.log(111, this.$store.state.user.userInfo)
				// const { avatar, id, nickname } = this.$store.state.user.userInfo.customer_info
				// uni.navigateTo({
				//   url: `/pages/message/messageChat?avatar=${encodeURIComponent(avatar)}&nick=${nickname}&userID=${id + ''}`
				// })
				if (!uni.getStorageSync('token')) return this.$common.jumpLogin()
				const { avatar, id, nickname } = this.$store.state.user.userInfo.customer_info
				uni.navigateTo({
					url: `/pages/message/messageChat?avatar=${encodeURIComponent(avatar)}&nick=${nickname}&friend_user_id=${id + ''}`
				})
			},
			// 打开选择规格弹框
			openSkuPopup(type) {
				let obj = {
					...this.data,
					packs: this.packs,
					goods_num: this.goods_num || 1,
					type
				}
				this.$refs.selectProductSpecs.open(obj)
			},
			// 立即购买
			immediatelyBuy(item) {
				let data = {
					goods: [{
						goods_id: this.id,
						goods_num: this.goods_num
					}]
				}
				if (this.role_id == 2) data.hospital_id = this.hospitalId ?? uni.getStorageSync('hospitalId') ?? 0
				this.$request({
					url: '/ApiV3/Mobile/Order/createBefore',
					loading: true,
					data
				}).then(res => {
					let address = uni.getStorageSync('submitOrderData') && JSON.parse(uni.getStorageSync(
						'submitOrderData')).address || ''
					const data = JSON.stringify({ ...res.data, address })
					uni.setStorageSync('submitOrderData', data)
					uni.navigateTo({
						url: `/pages/home/shoppingMall/submitOrder?type=buy`
					})
				})
				// this.$axios({
				//   url: '/api/order_before',
				//   errMsg: true,
				//   loading: true,
				//   data: {
				//     goods_id: item.id,
				//     goods_number: item.goods_number,
				//     check_specs: '' //this.currentSkuData.id
				//   }
				// }).then((res) => {
				//   const data = JSON.stringify(res.data)
				//   uni.setStorageSync('submitOrderData', data)
				//   this.skuPopupShow = false
				//   uni.navigateTo({
				//     url: `/pages/home/shoppingMall/submitOrder?type=buy`
				//   })
				// })
			},
			// 加入购物车
			addCard(item) {
				let data = {
					goods_id: this.id,
					amount: this.goods_num
				}
				if (this.role_id == 2) data.hospital_id = this.hospitalId ?? uni.getStorageSync('hospitalId') ?? 0
				this.$request({
					url: '/ApiV3/Mobile/ShopCart/save',
					loading: true,
					data
				}).then(res => {
					this.$common.toast('加入购物车成功')
					this.getCartData()
				})
				// this.$axios({
				//   url: '/api/add_cart',
				//   data: {
				//     goods_id: item.id,
				//     goods_number: item.goods_number,
				//     check_specs: '' //this.currentSkuData.id
				//   },
				//   errMsg: true,
				//   loading: true
				// }).then((res) => {
				//   this.skuPopupShow = false
				//   this.$common.toast('加入购物车成功')
				// })
			},
			//获取精选商品
			getCarefullyGoods() {
				let data = {
					goods_id: this.id
				}
				if (this.role_id == 2) data.hospital_id = this.hospitalId ?? uni.getStorageSync('hospitalId') ?? 0
				this.$request({
					url: '/ApiV3/Mobile/Goods/similar',
					method: 'get',
					data
				}).then((res) => {
					// res.data.images.forEach(v=>{
					//   this.flowList.push({image:v.url})
					// })
					this.flowList = res.data.goods
				})
			},
			//跳转精选商品详情
			gotoCarefullyGoodDetail(id) {
				uni.navigateTo({
					url: `/pages/home/shoppingMall/goodsDetails?id=${id}&type=${this.type}&scene_id=${this.scene_id}&role_id=${this.role_id}`
				})
			},
			// 获取商品详情信息
			getGoodsData() {
				return new Promise((resolve, reject) => {
					let url = '/ApiV3/Mobile/Goods/detail'
					let data = {
						goods_id: this.id
					}
					if (this.role_id == 2) data.hospital_id = this.hospitalId ?? uni.getStorageSync(
						'hospitalId') ?? 0
					//顺便获取一下改商品对应的医院信息
					if (data.hospital_id) {
						this.$request({
							url: '/ApiV3/Mobile/Hospital/info',
							method: 'get',
							data: {
								id: data.hospital_id
							}
						}).then(res => {
							this.hospitalTitle = res.data.title
							console.log('商品的医院信息', this.hospitalTitle)
						})
					}
					this.$request({
						url,
						method: 'get',
						data,
						errMsg: true,
						loading: true
					}).then((res) => {
						if (res.data?.goods?.packs?.length === 1) {
							this.data = res.data.goods.packs[0]
						} else if (res.data?.goods?.packs?.length > 1) {
							this.data = res.data.goods.packs.filter(v => v.id === res.data.goods.id)[0]
						}
						this.packs = res.data?.goods?.packs || []
						resolve()
					})
				})
			},
			// 公共跳转
			jump({ url = '', data = '' }) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			}
		},
		components: {
			myButton,
			selectProductSpecs,
			shareCanvas
		}
	}
</script>
<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.container {
		.wrap_title {
			text-align: center;
			width: 100%;
			font-weight: bold;
			font-size: 32rpx;
			padding: 20rpx 0;
		}

		.wrap_goods_price {
			padding: 14upx 0;
			color: #fd5624;
			font-size: 24upx;

			text {
				font-weight: bold;
				font-size: 24upx;
			}
		}

		padding-bottom: 170upx;

		.pop-box {
			display: flex;
			justify-content: space-around;
			padding: 100rpx 0;

			.pop-box-weixin {
				position: relative;

				button {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}

		.banner {
			width: 750upx;
			height: 750upx;

			.swiper {
				width: 100%;
				height: 100%;

				image,
				swiper-item {
					width: 100%;
					height: 100%;
				}
			}
		}

		.goods_top_info {
			background: #ffffff;
			// position: relative;
			display: flex;
			justify-content: space-between;
			margin-top: 24rpx;
			padding-top: 24rpx;

			.goods_price {
				// margin-top: 24rpx;
				padding: 0upx 30upx;
				color: #ff7569;
				font-size: 32upx;

				text {
					font-weight: bold;
					font-size: 32upx;
				}

				.goods_price_goodsprice {
					margin-left: 8rpx;
					font-size: 28upx;
					color: #c6c3c3;
					text-decoration: line-through;
				}
			}

			.goods_share {
				// width: 160rpx;
				// padding: 20upx;
				// position: absolute;
				// top: 0;
				// right: 0;
				padding-right: 36rpx;

				image {
					vertical-align: text-bottom;
					width: 48upx;
					height: 48upx;
					margin-right: 8rpx;
				}

				text {
					color: #888888;
					font-size: 24upx;
				}

				button {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}

		.goods_title {
			padding: 0 60upx 30upx 30upx;
			background: #ffffff;
			font-size: 32upx;
			color: #2a2a2a;
			font-weight: bold;
		}

		.basic_info {
			// margin-top: 30upx;
			padding: 15upx 0;
			background: #ffffff;
			font-size: 28rpx;

			.basic_info_item {
				padding: 0 30upx;
				display: flex;

				.basic_info_left {
					margin-right: 20upx;
					color: #c2c2c2;
					color: #888888;
				}

				.basic_info_center {
					// width: 580upx;
					flex: 1;
				}

				.basic_info_right {
					image {
						width: 14upx;
						height: 25upx;
					}
				}
			}
		}

		.goods_details_content {
			margin-top: 30upx;
			padding: 20upx 0;
			background: #ffffff;
		}

		.footer {
			position: fixed;
			left: 0;
			bottom: 0;
			padding: 0 30upx;
			width: 690upx;
			height: 140upx;
			box-sizing: content-box;
			background: #ffffff;
			// justify-content: center;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			color: #c2c2c2;
			font-size: 20rpx;

			.operation_btn {
				width: 90upx;
				flex-direction: column;
				justify-content: center;
				margin-right: 30rpx;

				image {
					margin: 4upx 0;
					width: 48upx;
					height: 48upx;
				}
			}
		}

		.choose_sku_container {
			padding: 30upx 0;

			.choose_sku_header {
				padding: 0 30upx;

				>image {
					margin-right: 30upx;
					width: 180upx;
					height: 180upx;
				}

				.choose_sku_info {
					padding: 20upx 0;
					height: 180upx;

					.sku_goods_title {
						width: 400upx;
					}

					.sku_goods_price {
						margin-top: 30upx;
						color: #fd5624;
						font-size: 24upx;

						text {
							font-size: 32upx;
							font-weight: bold;
						}
					}
				}
			}

			.choose_sku_content {
				max-height: 500upx;
				margin-top: 10upx;

				.sku_item {
					.sku_title {
						padding: 20upx 0;
					}

					.sku_value_content {
						display: flex;
						flex-wrap: wrap;

						.sku_value_item {
							margin: 0 20upx 20upx 0;
							padding: 0 30upx;
							height: 50upx;
							border-radius: 10upx;
						}

						.sku_active {
							border-color: #fd5624;
							color: #fd5624;
						}
					}
				}
			}

			.sku_number_box {
				text {
					height: 50upx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;

					&:nth-child(1),
					&:nth-child(3) {
						background: #f1f1f1;
						width: 70upx;
						color: #888888;
						font-size: 32upx;
					}

					&:nth-child(2) {
						font-size: 24upx;
						min-width: 90upx;
						padding: 0 10upx;
						border-left: none;
						border-right: none;
					}
				}
			}

			.sku_bottom {
				padding: 30upx 30upx 0 30upx;
			}
		}

		.service_popup_container {
			width: 600upx;
			padding-bottom: 30upx;

			.title {
				padding: 30upx;
				text-align: center;
				font-size: 32upx;
				font-weight: bold;
			}

			scroll-view {
				box-shadow: box-sizing;
				padding: 0 20upx;
				min-height: 200upx;
				max-height: 500upx;
			}
		}
	}
</style>