<template>
	<view class="container" @click="closeSelectLay">
		<view style="position: relative;
    z-index: 999;">
			<u-tabs :list="tabList" :is-scroll="true" :current="current" inactive-color="#C2C2C2" active-color="#2A2A2A"
				:bar-style="{background:'#00B8A2'}" :bar-height="8" :bar-width="112" :font-size="32"
				@change="handleTabCurrent"></u-tabs>
		</view>
		<view class="searchOrder" v-if="role_id != 1">
			<view @click="searchPopupShow = !searchPopupShow">筛选 <u-icon :name="searchPopupShow?'arrow-up':'arrow-down'"
					size="32rpx" style="margin-left:4rpx;">
				</u-icon>
			</view>
			<block v-if="!other">
				<my-button @click="myOrder = true " v-if="!myOrder" width="148" height="56" color="#2A2A2A"
					border="#C2C2C2">我的订单</my-button>
				<my-button @click="myOrder = false" v-else width="148" height="56">我的订单</my-button>
			</block>
		</view>
		<view v-if="searchPopupShow" class="searchOrder searchOrderPopup">
			<view>
				<text style="margin-right: 22rpx;font-weight: bold;width:90rpx">营养师</text>
				<select-lay ref="selectLay1" style="flex:1" @remove="tval = '';changeValue()" :zindex="3" :value="tval" name="name"
					placeholder="请选择营养师" :showplaceholder="false" :options="datalist" @input="changeValue"
					@selectitem="selectitem">
				</select-lay>
			</view>
			<view>
				<text style="margin-right: 22rpx;font-weight: bold;width:90rpx">医生</text>
				<select-lay ref="selectLay2" style="flex:1" @remove="tval1 = '';changeValue1()" :zindex="2" :value="tval1" name="name1"
					placeholder="请选择医生" :showplaceholder="false" :options="datalist1" @input="changeValue1"
					@selectitem="selectitem1">
				</select-lay>
			</view>
			<view v-if="!other">
				<text style="margin-right: 22rpx;font-weight: bold;width:90rpx">会员</text>
				<select-lay ref="selectLay3" @input="changeValueVip" style="flex:1" @remove="tval2 = '';changeValueVip()" :zindex="1"
					:value="tval2" name="name2" placeholder="请选择会员" :showplaceholder="false" :options="datalist2"
					@selectitem="selectitem2">
				</select-lay>
			</view>
			<view style="display: flex; justify-content: center;margin-top: 16rpx;">
				<my-button @click="selectOrderReset" width="184" height="72" color="#2A2A2A" border="#C2C2C2"
					margin="0 48rpx 0 0">重置</my-button>
				<my-button @click="selectOrderConfirm" width="184" height="72">确定</my-button>
			</view>
		</view>
		<view v-if="searchPopupShow" class="mask" @click="searchPopupShow = false">

		</view>
		<swiper :current="current" @change="handleSwiperCurrent" class="swiper">

			<swiper-item class="swiper_item" :class="searchPopupShow?'hidden':''" v-for="(tabItem, tabIndex) in tabList"
				:key="tabIndex">

				<scroll-view :refresher-triggered="triggered" scroll-y @scrolltolower="pullOnLoading"
					:show-scrollbar="false" :refresher-enabled="refresherEnabled" @refresherrefresh="refreshRrder">
					<view class="order_content" v-if="tabIndex === current ">
						<view class="order_item" @click="
                jump({
                  url: 'order/orderDetails',
                  data: {
                    id: orderItem.id,
                    currendIndex: orderIndex,
					other
                  }
                })
              " v-for="(orderItem, orderIndex) in orderList" :key="orderIndex">
							<view class="order_header u-flex">
								<view class="u-flex" style="flex-direction: column; align-items: flex-start">

									<view style="text-align: start;">
										<text>订单编号：{{ orderItem.order_sn }}</text>
									</view>
									<view style="color:#C2C2C2;font-size: 24rpx;">
										{{orderItem.created_at}}
									</view>
								</view>
								<text style="min-width: 100rpx;text-align: end;">{{ orderItem.status_text }}</text>
							</view>
							<view class="goods_content">
								<view class="goods_item" v-for="(goodsItem, goodsIndex) in orderItem.goods"
									:key="goodsIndex">
									<goods-item-order :jumpGoods="false" width="690" :item="goodsItem">
									</goods-item-order>
								</view>
							</view>
							<!-- <view class="total" v-if="orderItem.refund_sn">
								<text>申请退款：</text>
								<text>{{ !orderItem.is_points ? '￥' : '' }}</text>
								<text>{{ orderItem.refund_fee }}</text>
							</view> -->
							<view v-if="orderItem.user" class="u-flex u-flex-between u-m-t-16" style="padding:0 24rpx">
								<view class="u-flex u-flex-items-center" style="flex:1;min-width: 0;">
									<u-image style="margin-right:8rpx" shape="circle" width="64rpx" height="64rpx"
										:src="orderItem.user && orderItem.user.avatar"></u-image>
									<text class="u-font-28 text-bold u-line-1">{{orderItem.user && orderItem.user.nickname}}</text>
								</view>
								<view >
									<text>{{orderItem.status === 0?'应付款':'实付款'}}：</text>
									<text>￥{{ orderItem.pay_fee }}</text>
								</view>
								
							</view>
							<view v-else class="total" >
								<text>{{orderItem.status === 0?'应付款':'实付款'}}：</text>
								<text>￥{{ orderItem.pay_fee }}</text>
							</view>
							<!-- 其他人的订单只有查看物流 -->
							<view v-if="user_id !== orderItem.user_id" class="order_font">
								<!-- <my-button color="#2A2A2A" border="#C2C2C2" width="160" height="56"
									v-if="setOrderBtn('查看物流',orderItem.status)"
									@click="jump({ url: 'order/logistics', data: { express_code: orderItem.express_code,express_no:orderItem.express_no } })">
									查看物流</my-button> -->
							</view>
							<view v-else class="order_font">
								<!-- <my-button color="#2A2A2A" border="#C2C2C2" width="160" height="56"
									v-if="setOrderBtn('查看物流',orderItem.status)"
									@click="jump({ url: 'order/logistics', data: { express_code: orderItem.express_code,express_no:orderItem.express_no,order_id:orderItem.id } })">
									查看物流</my-button> -->

								<my-button v-if="setOrderBtn('确认收货',orderItem.status)" width="160" height="56"
									@click="$refs.orderPopup.open();id=orderItem.id;orderItem=orderItem">
									确认收货</my-button>

								<my-button v-if="setOrderBtn('再次购买',orderItem.status)" width="160" height="56" color="#2A2A2A"
									border="#C2C2C2"
									@click="buyAgain(orderItem)">
									再次购买</my-button>
								<my-button v-if="setOrderBtn('取消订单',orderItem.status)" width="160" height="56" color="#2A2A2A"
									border="#C2C2C2" @click="cancelPopupShow = true;id=orderItem.id">
									取消订单</my-button>
								<my-button v-if="setOrderBtn('去付款',orderItem.status)" width="160" height="56"
									@click="jump({ url: 'home/shoppingMall/pay', data: { order_id: orderItem.id,order_sn:orderItem.order_sn,pay_amount:orderItem.pay_fee } })">
									去付款</my-button>
							</view>
						</view>
						<block v-if="!orderList.length && afterLoading">
							<image style="margin-top:20vh;width:200rpx;height:200rpx" :src="`${imgUrl}v3-empty.png`"
								mode=""></image>
							<view style="color:#C2C2C2;font-size: 28rpx;margin: 8rpx 0 16rpx 0;">暂时没有订单</view>
							<my-button v-if="!other" style="display: flex;justify-content: center;" width="174"
								height="72" borderRadius="40rpx" @click="jump({ url: 'tabbar/shoppingMall' })"
								fontWeight="none">去下一单</my-button>
						</block>
						<view v-if="!orderList.length && !afterLoading" class="u-flex-column u-flex-items-center" style="transform: translate(0, 100%);">
							<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_shop_nologin.png`" mode="">
							</image>
							<view  style="color:#C2C2C2;padding:16rpx 0">您当前尚未登录，请前往登录</view>
							<my-button @click="jumpLogin" width="176" height="72" >去登录</my-button>
							<!-- <view v-else   style="text-align: center;">
								<view class="u-m-b-10" style="color:#C2C2C2;padding:16rpx 0">暂无视频,请先登录</view>
								<my-button @click="jumpLogin" width="280" height="72" >去登陆</my-button>
							</view> -->
							
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<!-- 确认收货弹框 -->
		<orderPopup ref="orderPopup" title="是否确认收货？" :content="orderItem.express_code==='offline'?'当前订单为线下发货，请确认已收到货物。':'请收到商品确认无误后再确认收货' " @submit="submit"></orderPopup>
		<!-- 取消订单弹框 -->
		<u-popup duration="50" v-model="cancelPopupShow" border-radius="20" mode="bottom">
			<view class="popup_content" style="width: 100%;">
				<text class="popup_content_title">取消订单</text>
				<view class="popup_content_box" style="width: 100%;">
					<text style="color:#C2C2C2;font-size: 28rpx;padding: 12rpx 0;">请选择取消订单的原因：</text>
					<!-- <view v-for="(item,index) of cancelList" :key="index">
						{{item.label}}
					</view> -->
					<u-radio-group active-color="#00B8A2" inactive-color="#C2C2C2" v-model="value"
						@change="radioGroupChange">
						<u-radio v-for="(item, index) in cancelList" :key="index" :name="item.label"
							:disabled="item.disabled">
							{{item.label}}
						</u-radio>
					</u-radio-group>
				</view>
				<view class="popup_content_foot">

					<my-button @click="cancelOrder" width="562" height="80" margin="0 12rpx">确定</my-button>
				</view>
			</view>
		</u-popup>

	</view>
</template>

<script>
	import orderPopup from './components/order_popup.vue'
	import selectLay from './components/select-lay/components/select-lay/select-lay.vue'
	import goodsItemOrder from './components/goodsItemOrder.vue'
	import myButton from '@/components/myButton.vue'
	import {
		mapGetters
	} from 'vuex'

	function geTel(tel) {
		return tel.substring(0, 3) + "****" + tel.substr(tel.length - 4);
	}
	export default {
		data() {
			return {
				orderItem:{},//选中订单详情
				other: 0, //用户订单标识
				myOrder: false,
				tval: '',
				tval1: '',
				tval2: '',
				datalist: [],
				datalist1: [],
				datalist2: [],
				searchPopupShow: false,
				cancelList: [{
						value: 1,
						label: '不需要了'
					},
					{
						value: 2,
						label: '商品选错/选多'
					},
					{
						value: 3,
						label: '地址信息填写错误'
					},
					{
						value: 4,
						label: '支付遇到问题'
					},
					{
						value: 5,
						label: '其他原因'
					},

				],
				value: '不需要了',
				cancelPopupShow: false,
				name: 'order', //页面名字
				page: 1,
				length: 0,
				// #ifdef MP-WEIXIN
				refresherEnabled: true, //是否开启下拉刷新
				// #endif
				// #ifdef APP-PLUS
				refresherEnabled: false, //app端有bug所以不开启
				// #endif
				triggered: false, //下拉刷新状态
				tabList: [{
						name: '全部'
					},
					{
						name: '待付款'
					},
					{
						name: '待发货'
					},
					{
						name: '待收货'
					},
					{
						name: '已完成'
					}
				],
				current: 0, //当前索引
				orderList: [], //订单列表数据
				afterLoading: false,
				role_id: '',
				status: '', //订单状态
				id:'',//点击订单的id
				user_id:''//用户id
			}
		},
		onLoad(option) {
			if (option.current > -1) {
				this.current = Number(option.current)
			}

			this.other = Number(option.other) //用户订单

			if (this.other) {
				this.current = 0
				uni.setNavigationBarTitle({
					title: '会员订单'
				})
			}
			
			this.role_id = this.$store.state.user.userInfo.role_id
			this.user_id = this.$store.state.user.userInfo.id
			if(option.user_id) this.tval2 = option.user_id
			this.getOrderData()
			//营养师列表
			this.getPerson('site,director,server,sale', '', 'datalist', )
			//医生列表
			this.getPerson('doctor', '', 'datalist1', )
			//会员列表
			this.getVip()
		},
		watch: {
			current(val) {
				this.status = val === 0 ? '' : val === 1 ? 0 : val === 2 ? 1 : val === 3 ? 2 : 4
				this.page = 1
				this.getOrderData()
			},
			myOrder(val){
				this.page = 1
				this.getOrderData()
			}

		},
		computed: {
			...mapGetters(['userInfo']),
			setOrderBtn() {
				return function(name,status) {
					let flag = false
					if(name === '查看物流'){
						flag = status == 2 || status == 3 || status == 4//已发货、已收货、已完成
					}
					if(name === '确认收货'){
						flag = status == 2  //待收货
					}
					if(name === '再次购买'){
						flag = status == 1 ||  status == 4 || status == 10 || status == 12//待发货、已完成、已取消、已关闭
					}
					if(name === '取消订单'){
						flag = status == 0 //待支付
					}
					if(name === '去付款'){
						flag = status == 0 //待支付
					}
					return flag
				}
			}
		},
		methods: {
			// 去登陆
			jumpLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			closeSelectLay(){
				[1,2,3].forEach(e=>{
					if(this.$refs['selectLay'+e]){
						this.$refs['selectLay'+e].close()
					}
					
				})
			},
			buyAgain(item){//再次购买
				console.log(item)
				
				let data = {
					goods:item.goods.map(v=>({goods_id:v.goods_id,goods_num:v.goods_number})),
				}
				if(this.$store.state.user.userInfo.role_id != 1) data.hospital_id = item.hospital_id
				this.$request({
					url:'/ApiV3/Mobile/Order/createBefore',
					loading:true,
					data
				}).then(res=>{
					let address = uni.getStorageSync('submitOrderData') && JSON.parse(uni.getStorageSync('submitOrderData')).address || ''
					const data = JSON.stringify({...res.data,address})
					uni.setStorageSync('submitOrderData', data)
					  uni.navigateTo({
					    url: `/pages/home/shoppingMall/submitOrder?type=buy`
					  })
				})
			},
			submit(){//确认收货
				this.$request({
					url:'/ApiV3/Mobile/Order/confirm',
					loading:true,
					data:{
						id:this.id
					}
				}).then(res=>{
					this.$common.toast('成功')
					this.page = 1
					this.getOrderData()
				})
			},
			changeValue(val) {

				this.getPerson('site,director,server,sale', val, 'datalist')
			},
			changeValue1(val) {

				this.getPerson('doctor', val, 'datalist1')
			},
			changeValueVip(val) {

				this.getVip(val)
			},
			getVip(keywords) {
				this.$request({
					method: 'get',
					url: '/ApiV2/Mobile/ReportingOrder/customers',
					data: {
						page: 1,
						lengthNum: 15,
						keywords
					}
				}).then(res => {

					this.datalist2 = res.data.data.map(v => {
						return {
							label: v.nickname + '(' + geTel(v.mobile) + ')',
							value: v.id,
							mobile: v.mobile,
						}
					})



				})
			},
			getPerson(doctor_type, keywords, list) {
				this.$request({
					method: 'get',
					url: '/ApiV2/Mobile/ReportingOrder/staffs',
					data: {
						doctor_type,
						keywords,
						page: 1,
						lengthNum: 15,
					}
				}).then(res => {
					this[list] = res.data.data.map(v => {
						return {
							label: v.nickname + '(' + geTel(v.mobile) + ')',
							mobile: v.mobile,
							value: v.id
						}
					})
				})
			},
			selectOrderReset() {
				this.tval = ''
				this.tval1 = ''
				this.tval2 = ''
			},
			selectOrderConfirm() {
				console.log(this.tval, this.tval1, this.tval2)
				this.getOrderData()
				this.searchPopupShow = false
			},
			selectitem(index, item) {
				console.log(item)
				if (index >= 0) {
					this.tval = item.value;
				} else {
					this.tval = ""
				}
			},
			selectitem1(index, item) {
				console.log(item)
				if (index >= 0) {
					this.tval1 = item.value;
				} else {
					this.tval1 = ""
				}
			},
			selectitem2(index, item) {
				console.log(item)
				if (index >= 0) {
					this.tval2 = item.value;
				} else {
					this.tval2 = ""
				}
			},
			// 售后单取消申请
			handleCancelApplyFor(item, index) {
				this.$common
					.showModal({
						content: '您确定要取消申请退款吗？',
						confirmColor: '#fd5624'
					})
					.then((r) => {
						this.$axios({
							url: '/api/refund_order_cancel',
							errMsg: true,
							loading: true,
							data: {
								refund_id: item.id
							}
						}).then((res) => {
							item.status = 6
							item.status_msg = '已取消'
							this.$common.toast('取消成功')
						})
					})
			},
			
			// 取消订单
			cancelOrder() {
				this.$request({
					url: '/ApiV3/Mobile/Order/cancle',
					errMsg: true,
					loading: true,
					data: {
						id: this.id,
						cancle_reason:this.value,
					}
				}).then((res) => {
					this.cancelPopupShow = false
					this.$common.toast('取消成功')
					this.page = 1
					this.getOrderData()
				})
			},
			// 获取订单数据
			getOrderData(callback) {
				this.afterLoading = false
				let data = {
					page: this.page,
					only_me: Number(this.myOrder),
					user_id:this.tval2,
					dietitian_id:this.tval,
					doctor_id:this.tval1,
				}
				if (this.status !== '') data.status = this.status
				this.$request({
					url: '/ApiV3/Mobile/Order/index',
					errMsg: true,
					loading: true,
					method: 'get',
					data
				}).then(({
					data
				}) => {
					if (this.page === 1) {
						this.orderList = data.data
					} else {
						this.orderList = [...this.orderList, ...data.data]
					}
					this.afterLoading = true
					this.length = data.next_page_url
					callback && callback()
				}).catch((err) => {
					callback && callback()
				})
			},
			// 下拉刷新
			refreshRrder() {
				if (this.triggered) return false
				this.triggered = true
				this.getOrderData(() => {
					this.page = 1
					this.triggered = false
				})
			},
			// 上拉加载
			pullOnLoading() {
				if (this.length) {
					this.page++
					this.getOrderData()
				}
			},
			// 处理左右滑动的索引
			handleSwiperCurrent(e) {
				this.current = e.detail.current
			},
			// 处理点击tab栏的索引
			handleTabCurrent(index) {
				this.current = index
			},
			// 公共跳转
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
		},
		components: {
			goodsItemOrder,
			myButton,
			orderPopup,
			selectLay
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.searchOrder {
		position: relative;
		z-index: 999;
		display: flex;
		padding: 24rpx 48rpx;
		font-size: 28rpx;
		justify-content: space-between;
		background-color: #FFFFFF;

		>view {
			display: flex;
			align-items: center;
			margin: 8rpx 0;
		}
	}

	.searchOrderPopup {
		flex-direction: column;
		position: absolute;
		z-index: 99999;
		width: 100%;
	}

	.mask {
		position: fixed;
		width: 100%;
		height: 100%;
		background: #000000;
		opacity: 0.6;
		z-index: 10;
		top: 0rpx;
	}

	.order_font {
		display: flex;
		justify-content: flex-end;
		padding-top: 24rpx;

		my-button {
			margin: 0 12rpx;
		}
	}

	.container {
		text-align: center;

		.hidden {
			position: absolute;
			top: 0;
		}

		.swiper {
			height: calc(100vh - 88upx - 150upx);

			.swiper_item {
				height: calc(100vh - 88upx - 150upx);

				scroll-view {
					height: calc(100vh - 88upx - 150upx);
					box-sizing: border-box;


				}
			}
		}

		.order_content {
			padding: 30upx;
		}

		.order_item {
			margin: 0 auto 30upx;
			width: 690upx;
			padding: 24rpx 0;
			background: #ffffff;
			border-radius: 20upx;
			font-size: 28rpx;

			&:last-child {
				margin-bottom: 0;
			}

			.order_header {
				padding: 0 24upx;
				padding-bottom: 16upx;
				justify-content: space-between;
				align-items: flex-start;
				>text {
					color: #00B8A2;
				}
			}

			.goods_item {
				margin-bottom: 30upx;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.total {
				margin-top: 20upx;
				padding-right: 30upx;
				text-align: right;
				font-weight: bold;

				text {
					&:nth-child(2) {
						font-weight: bold;
						font-size: 24upx;
					}

					&:nth-child(3) {
						font-weight: bold;
						font-size: 32upx;
					}
				}
			}

			.order_btn {
				width: 630upx;
				margin: 30upx auto 0;
				padding-top: 30upx;
				justify-content: flex-end;
			}
		}
	}
</style>
