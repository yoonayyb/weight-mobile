<template>
	<view class="container" @click="login">
		<!-- <image :src="`${imgUrl}v3_bg_home.png`"  style="width: 100%;"></image> -->
		<u-navbar id="navbar" :border-bottom="false" title-color="#2A2A2A" :title-size="32" :background="{background:'transparent'}" :is-back="false"
			back-text="">

			<view class="u-flex u-flex-xy-center">

				<image @click="jump({ url: 'mine/setting/setting' })" :src="`${imgUrl}v3_mine_setting.png`" mode=""
					style="margin-right: 16rpx;width:48rpx;height:48rpx;left: 24rpx;position: absolute;"></image>

				<text class="u-font-32" style="color:#2A2A2A;font-weight: bold;">我的</text>

			</view>
		</u-navbar>
		<block>
			<view class="no_login">
				<view class="u-flex-y-center">
					<view class="u-flex" v-if="token" @click="jump({ url: 'mine/personalInfo/personalInfo' })">
						<!-- <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
							<u-avatar :src="userInfo.avatar" size="128"></u-avatar>
						</button> -->
						<u-avatar :src="userInfo.avatar" size="128"></u-avatar>
						<view class="u-m-l-24" style="height: 128rpx;width: 314rpx;"
							>
							<view style="font-size: 32rpx;font-weight: bold;" class="u-line-1">
								{{ userInfo.nickname }}
							</view>
							<view class="up_tag" style="display: inline-block;">成长值 {{ userInfo.growth ||0 }}</view>
						</view>
					</view>

					<block v-else>
						<u-avatar size="128"></u-avatar>
						<view class="u-m-l-25" @click="jump">请点击登录</view>
					</block>
				</view>
				<view class="u-flex-xy-center">
				<view class="u-flex-xy-center u-relative" >
					<image @click="jump({url:'mine/message/index'})" :src="`${imgUrl}homepage_icon_message@2x.png`" mode=""
						style="width:48rpx;height:48rpx;"></image>
					<u-badge v-if="token" :offset="[-4,-8]" size="mini" type="error" is-dot :count="count"></u-badge>
				</view>
				
					<image v-if="role_id !== 1 && token" @click="qrshow" :src="`${imgUrl}homepage_icon_arcode@2x.png`" mode=""
						style="width:48rpx;height:48rpx;margin-left: 20rpx;">
					</image>
				
				</view>
			</view>
			<!-- 会员、没登录 -->
			<block v-if="role_id == 1 || !token">
				<view class="no_box">
					<view class="u-font-32 u-m-b-40" style="font-weight: bold;">我的订单</view>
					<view class="u-flex-y-center u-flex-between u-flex-wrap ">
						<view class="u-flex-column u-flex-items-center u-relative" style="padding: 0 28rpx;"
							@click="gotoOrder(item)" v-for="item in boxList" :key="item.url">
							<image :src="`${imgUrl+item.url}.png`" mode="" style="width:80rpx;height:80rpx;"></image>
							<u-badge v-if="token" :offset="[0,10]" size="mini" type="error"
								:class="{unoverflow:item.num<=99}" :count="item.num"></u-badge>
							<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">
								{{item.name}}
							</view>
						</view>

					</view>
				</view>
				<view class="no_box u-m-t-24 u-p-24" style="flex-direction: row;justify-content: space-around">

					<view class="u-flex-column u-flex-items-center" @click="goto(item)" v-for="item in mineList"
						:key="item.url">
						<image :src="`${imgUrl+item.url}.png`" mode="" style="width:80rpx;height:80rpx;"></image>
						<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">
							{{item.name}}
						</view>
					</view>
				</view>
			</block>
			<!-- 营养师、医生 -->
			<block v-else>
				<view class="no_box" @click="jump({url:'mine/manage/index'})"  style="padding:32rpx 48rpx 10rpx 48rpx">
					<view class="u-font-32  person" style="font-weight: bold;">会员管理</view>
					<view class="u-flex u-flex-wrap">
						<view @click.stop="jump({url:'mine/manage/index',data:{params:item.value,diary:item.diary,is_current_month:item.is_current_month}})" class="u-flex-column u-flex-items-center" style="margin:28rpx 0rpx;min-width: 33%;"
							v-for="item in doctorList" :key="item.name">
							<view class="u-font-40" style="color:#2A2A2A;font-weight: bold;">{{item.num}}</view>
							<view class="u-font-28 u-m-t-10" style="color:#4B4B4B">{{item.name}}</view>
						</view>
					</view>
				</view>
				<view class="no_box u-m-t-24 u-p-24 u-flex-wrap"
					style="flex-direction: row;">

					<view class="u-flex-column u-flex-items-center u-m-b-24" style="min-width: 25%" @click="goto(item)"
						v-for="item in doctorList1" :key="item.url">
						<image :src="`${imgUrl+item.url}.png`" mode="" style="width:80rpx;height:80rpx;"></image>
						<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">
							{{item.name}}
						</view>
					</view>
				</view>
			</block>
		</block>

		<!-- 营养师、医生 二维码 -->
		<u-mask :show="mask" @click="mask = false" :custom-style="{paddingTop:'30%'}">
			<yswiper :userInfo="userInfo" ref="yswiper" :bg-color="'#000000 60%'" :list="qrcodeList" height="978"
				mode="none" :autoplay="false" :circular="false"></yswiper>
		</u-mask>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="638rpx" height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
					<view class="u-font-32 text-bold">您还未完善个人信息</view>
					<view class="u-font-32 ">请先完善信息再进行操作</view>
					<view class="u-flex-y-center u-flex-around" style="width: 100%;">
						<my-button width="208" height="72" color="#00B8A2" bg="#FFFFFF" @click="popshow = false">取消</my-button>
						<my-button width="208" height="72" @click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善</my-button>
					</view>
			</view>		
				</u-popup>
		<u-tabbar :before-switch="beforeSwitch" active-color="#00B8A2" inactive-color="#C2C2C2" height="120rpx"
			icon-size="60rpx" :list="list">
		</u-tabbar>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import myButton from '@/components/myButton.vue'
	import yswiper from './u-swiper/u-swiper.vue'
	export default {
		data() {
			return {
				count:0,
				popshow:false,
				flag: false,
				qrcodeList: [],
				mask: false,
				list: this.$store.state.tabbar.list,
				token: '',
				scene_id: '',
				doctorList: [{
					name: '累计',
					num: 0,
					key: 'total'
				}, {
					name: '本月新增',
					num: 0,
					key: 'current_month_total',
					is_current_month:1
				}, {
					name: '日记管理',
					num: 0,
					key: 'diary_total',
					diary:1,
				}, {
					name: '启动期',
					num: 0,
					key: 'start_total',
					value:1
				}, {
					name: '过渡期',
					num: 0,
					key: 'interim_total',
					value:2
				}, {
					name: '维持期',
					num: 0,
					key: 'holding_total',
					value:3
				}],
				doctorList1: [{
					url: 'v3_mine_order',
					name: '全部订单',
					path: 'order/order'
				}, {
					url: 'v3_mine_after1',
					name: '售后',
					path: 'order/refund'
				}, {
					url: 'homepage_icon_shoppingcart@2x',
					name: '购物车',
					path: 'home/shoppingMall/cart'
				}, {
					url: 'v3_mine_adress',
					name: '地址管理',
					path: 'mine/address/address'
				},{
					url: 'v3_mine_ask',
					name: '全部问卷',
					path: 'mine/manage/ask'
				}, ],
				mineList: [{
					url: 'v3_mine_dire',
					name: '我的日记',
					path: 'newHome/index'
				},{
					url: 'v3_mine_ask',
					name: '我的问卷',
					path: 'mine/manage/ask'
				}, {
					url: 'homepage_icon_shoppingcart@2x',
					name: '购物车',
					path: 'home/shoppingMall/cart'
				}, {
					url: 'v3_mine_adress',
					name: '地址管理',
					path: 'mine/address/address'
				}, ],
				boxList: [{
					url: 'v3_mine_pay',
					name: '待付款',
					current: 1,
					num: 0,
				}, {
					url: 'v3_mine_push',
					name: '待发货',
					current: 2,
					num: 0,
				}, {
					url: 'v3_mine_car',
					name: '待收货',
					current: 3,
					num: 0,
				}, {
					url: 'v3_mine_after',
					name: '售后',
					current: 0,
					num: 0,
				}, ]
			}
		},
		async onShow() {
			
			this.getData()
		},
		async onLoad(option) {
			console.log('option', option)
			
			// this.getData()
		},
		async onShareAppMessage() {
			if (uni.getStorageSync('token')) await this.getScene_id()
			return {
				title: '医学营养减重与控糖管理平台',
				path: `/pages/tabbar/mine?scene=` + this.scene_id,
				imageUrl:`${this.imgUrl}share.jpg`
			}
		},
		computed: {
			...mapGetters(['userInfo']),

			role_id: {
				set() {},
				get() {

					return this.$store.state.user.userInfo.role_id
				}

			}

		},
		watch: {
			'$store.state.message.unReadNum'(newValue, oldValue) {
				console.log('unReadNum',newValue)
				this.count += parseInt(newValue)
				
			}
		},
		methods: {
			gotoWrite(url){
				
				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			getScene_id() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/User/sharePage',
						// loading: true,
						// errMsg: true,
						method: 'get'
					}).then(({
						data
					}) => {
						this.scene_id = data.scene_id
						resolve()
					})
				})
			},
			login() {
				if (this.token) return
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			async getData() {
				console.log(this.token)
				this.token = uni.getStorageSync('token')
				if (this.token) {
					// 获取用户信息
					await this.$store.dispatch('getUserInfo')
					//获取通知消息
					this.getNotice()
					console.log('this.role_id', this.role_id)
					if (this.role_id !== 1) { //
						this.getMembersInfo()
					} else {
						this.getVipInfo()
					}
				}
			},
			getNotice(){
				this.$request({
						url: '/ApiV3/Mobile/Notice/unreadNum',
						method: 'GET'
					})
					.then((res) => {
						this.count = res.data.count
						this.count += parseInt(this.$store.state.message.unReadNum)
					})
					.catch(async (err) => {
						
					})
			},
			beforeSwitch() {

				const page = getCurrentPages()
				let pages = `/${page[page.length - 1]?.route ?? ''}`
				uni.setStorageSync('recordRoute', pages)
				return true
			},
			getVipInfo() { //会员
				this.$request({
						url: '/ApiV3/Mobile/User/orderStatistics',
						method: 'GET'
					})
					.then((res) => {
						this.flag = true
						this.$set(this.boxList[0], 'num', res.data.status_unpay)
						this.$set(this.boxList[1], 'num', res.data.status_pay)
						this.$set(this.boxList[2], 'num', res.data.status_shipped)
						this.$set(this.boxList[3], 'num', res.data.orderaftersale)

					})
					.catch(async (err) => {
						this.flag = true
					})
			},
			getMembersInfo() { //营养师
				this.$request({
						url: '/ApiV3/Mobile/Staff/index',
						method: 'GET'
					})
					.then((res) => {
						this.flag = true
						let {
							statistics
						} = res.data
						this.doctorList.forEach(v => {

							this.$set(v, 'num', statistics[v.key])
						})
						console.log('this.doctorList', this.doctorList)
					})
					.catch(async (err) => {
						this.flag = true
					})
			},
			qrshow() {
				if (!uni.getStorageSync('token')) {
					// return this.$common.jumpLogin()

					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}
				//营养师展示三个（销售代表展示两个）、医生展示一个 
				
				this.qrcodeList = this.userInfo.role_id == 3 ? [1] :this.userInfo.roles.isSaleRep?[1,2]: [1, 2, 3] //随便搞数组长度
				//解决方法：可以将绘制方法写在异步方法中;
				//同时要注意组件的生命周期，确保实例挂载成功之后再执行,一般延时50ms（经验值，与硬件处理速度有关）执行即可。
				//获取画布的尺寸大小
				this.canvasHight = Math.floor(this.$refs.yswiper.canvasHeight)
				this.canvasWidth = Math.floor(this.$refs.yswiper.canvasWidth)

				this.mask = true;
				// 如下，以canvasHight、canvasWidth为单位进行计算，达到动态布局以适应不同尺寸的手机

				setTimeout(() => {
					this.$refs.yswiper.init('#myCanvas0', this.canvasHight, this.canvasWidth, this.userInfo) //绘制画布
					
				}, 50)

			},
			gotoOrder(item) { //我的订单
				let url = item.name === '售后' ? 'order/refund' : 'order/order'
				this.jump({
					url,
					data: {
						current: item.current
					}
				})
				// uni.navigateTo({
				// 	url:'/pages/order/order?current=' + item.current
				// })
			},
			goto(item) {
				if(this.token && this.role_id === 1 && this.$store.state.user.userInfo.should_update){
					return this.popshow = true
				}
				let url = item.path
				// uni.navigateTo({
				// 	url
				// })
				this.jump({
					url
				})
			},
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				console.log(e)

				
				this.$common.uploadParams(avatarUrl).then(res=>{
					//更新数据到后台
					this.$request({
							url: '/ApiV2/Mobile/User/updateUserProfile',
							data: {
								avatar: res.key
							}
						})
						.then((res) => {
							this.userInfo.avatar = res.url
							this.$store.dispatch('getUserInfo')
						})
						.catch(async (err) => {})
				})
				


			},
			// 获取邀请二维码
			getCode() {
				// const scene = this.userInfo.admin_id + '_doctor'
				this.$request({
					url: '/ApiV2/Mobile/Bind/getMiniCode', // '/api/get_mp_qrcode',
					loading: true,
					errMsg: false,
					data: {
						type: 'INVITE_DOCTOR', //医生
						role: this.userInfo.role_id
					}
				}).then((res) => {
					this.qrcodeImg = res.data.url
				})
			},

			// 公共跳转
			jump({
				url = '',
				data = ''
			}) {
				console.log(11111111111111)
				if (!uni.getStorageSync('token')) {
					// return this.$common.jumpLogin()

					return uni.navigateTo({
						url: '/pages/login/index'
					})
				}

				this.$common.jump({
					url,
					data,
					that: this
				})
			},

		},
		components: {
			yswiper,
			myButton,


		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.u-navbar-inner {
		margin-right: 0 !important;
	}

	.u-navbar-content-title {
		position: static !important;
	}

	.unoverflow {
		::v-deep .u-badge {
			padding: 0 !important;
			width: 40rpx;
			height: 40rpx;
			border-radius: 50% !important;

		}

	}

	.container {
		padding-bottom: 30upx;
		background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_bg_home.png");
		min-height: 100vh;
		background-repeat: no-repeat;
		background-size: 750rpx 648rpx;

		.avatar-wrapper {
			margin: 0;
			padding: 0;
			height: 128rpx;
			background: transparent;

			&::after {
				border: none;
			}
		}

		.no_login {
			padding: 52rpx 32rpx 52rpx 56rpx;
			padding-bottom: 32rpx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 32rpx;
			font-weight: bold;
			color: #2a2a2a;

			.up_tag {
				background: transparent;
				border-radius: 24rpx;
				font-size: 20rpx;
				color: #c2c2c2;
				border: 1px solid #c2c2c2;
				padding: 6rpx 16rpx;
				text-align: center;
				margin-top: 8rpx;
			}
		}

		.no_box {
			background: #ffffff;
			box-shadow: 0px 0px 24px 2px rgba(0, 0, 0, 0.06);
			border-radius: 24rpx;
			margin: 0 32rpx;
			padding: 28rpx;
			// min-height: 254rpx;
			display: flex;
			flex-direction: column;
			

			.person {
				position: relative;

				&::before {
					content: "";
					position: absolute;
					top: 10%;
					left: -14rpx;
					width: 8rpx;
					height: 32rpx;

					background: #00b8a2;
				}
			}
		}
	}
</style>
