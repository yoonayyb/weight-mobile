<template>
	<view class="container container_padding_bottom" style="padding-bottom: 220rpx;">
		<u-navbar :custom-back="back" back-icon-color="#FFFFFF" title="订单详情" :background="{backgroundColor}" title-color="#FFFFFF"
			:border-bottom="false" :title-bold="true"></u-navbar>
		<image v-if="data.status === 0" :src="`${imgUrl}v3-order-paying.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>
		<image v-if="data.status === 10" :src="`${imgUrl}v3-order-cancel.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>
		<image v-if="data.status === 1" :src="`${imgUrl}v3-order-push.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>
		<image v-if="data.status === 2" :src="`${imgUrl}v3-order-in.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>
		<image v-if="data.status === 4" :src="`${imgUrl}v3-order-finish.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>
		<image v-if="data.status === 12" :src="`${imgUrl}v3-order-close.png`"
			style="width:750rpx;height:502rpx;position: absolute;top: -32rpx;"></image>

		<view class="content-list" v-if="data.id">
			<view class="order_status">
				<text class="status_text">{{ data.status_text }}</text>


				<view class="cancel_time" v-if="data.status === 0">
					<block v-if="showTime">
						<text style="margin-right: 16rpx;">请于 </text>
						<u-count-down @end="downEnd" separator="colon" separator-size="28" font-size="28"
							:show-hours="false" bg-color="#00B8A2" color="#FFFFFF" separator-color="#FFFFFF"
							:timestamp="data.downTime"></u-count-down>
						<text style="margin-left: 16rpx;"> 内付款，超时订单将自动关闭</text>
					</block>
				</view>
				<block>
					<view class="cancel_time" v-if="data.status === 10 ">
						您的订单已取消
					</view>
					<view class="cancel_time" v-if="data.status === 1 ">
						已成功付款，请耐心等待发货
					</view>
					<view class="cancel_time" v-if="data.status === 2 ">
						<block v-if="showTime">
							<text style="margin-right: 16rpx;">还剩 </text>
							<u-count-down @end="downEnd" separator="cn" separator-size="28" font-size="28"
								bg-color="#00B8A2" color="#FFFFFF" separator-color="#FFFFFF" :timestamp="data.downTime">
							</u-count-down>
							<text style="margin-left: 16rpx;"> 自动确认收货</text>
						</block>
					</view>
					<view class="cancel_time" v-if="data.status === 4 ">
						您的订单已交易成功
					</view>

				</block>
				<view class="cancel_time" v-if="data.status === 12">
					您的订单已关闭
				</view>

			</view>

			<view class="order_address">
				<view v-if="data.status === 2" class="address_top u-flex" style="margin-bottom: 48rpx;">
					<image :src="`${imgUrl}v3_car.png`" style="width:48rpx;height:48rpx;position: absolute;top: 0rpx;"
						mode="">
					</image>
					<view @click="jump({url:'order/logistics',data: { express_code: data.express_code,express_no:data.express_no,order_id:data.id }})"
						style="margin-left: 72rpx;font-weight: bold;flex:1">
						<text style="width: 400rpx;display: inline-block;" class="u-line-1"> {{data.express_code=== 'offline'?'订单已发货，发货方式为线下发货':logisticsData.context}} </text>

						<view class="address_details" v-if="data.province">
							<text>{{ logisticsData.time || (data.shipping_time | format)}}</text>
						</view>
					</view>

					<u-icon size="32rpx" name="arrow-right"></u-icon>

				</view>

				<view class="address_top u-flex">
					<image :src="`${imgUrl}v3-address.png`"
						style="width:48rpx;height:48rpx;position: absolute;top: 0rpx;" mode=""></image>
					<view style="margin-left: 72rpx;font-weight: bold;flex:1">
						<text style="margin-right: 16rpx;"> {{ data.realname || '' }}</text>
						<text>{{ data.mobile || '' }}</text>
						<view class="address_details" v-if="data.province">
							<text>{{ data.province + data.city + data.area + data.address }}</text>
						</view>
					</view>

					<!-- <u-icon size="32rpx" name="arrow-right"></u-icon> -->

				</view>

			</view>

			<view class="content-list-item">

				<view class="order_goods_container">
					<veiw v-if="data.user" style="display: flex;align-items: center;margin:0 0 16rpx 32rpx;">
						<u-image style="margin-right:8rpx" shape="circle" width="64rpx" height="64rpx"
							:src="data.user && data.user.avatar"></u-image>
						<text>{{data.user && data.user.nickname}}</text>
					</veiw>
					<view class="order_goods_item" v-for="(item, index) in data.goods" :key="index">
						<goods-item-order width="100%" :orderId="id" :jumpGoods="true" :item="item"></goods-item-order>
					</view>
					<view class="order_desc">
						<text class="order_desc_title  justify" >订单编号<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right ">{{data.order_sn}}</text>
					</view>
					<view class="order_desc" v-if="data.created_at">
						<text class="order_desc_title  justify">下单时间<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right ">{{data.created_at}}</text>
					</view>
					<view class="order_desc" v-if="data.goods_price_sum">
						<text class="order_desc_title  justify">商品总额<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right ">¥{{data.goods_price_sum}}</text>
					</view>
					<view class="order_desc" v-if="data.freight">
						<text class="order_desc_title  flex_text justify">运费<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right ">¥{{data.freight}}</text>
					</view>
					<view class="order_desc" v-if="data.benefits">
						<text class="order_desc_title  justify">优惠金额<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right  order_desc_discount">-¥{{data.benefits}}</text>
					</view>
					<view class="order_desc" v-if="data.pay_remark">
						<text class="order_desc_title  justify">订单备注<text style="width:100%;display: inline-block;"></text></text>
						<text class="order_desc_right ">{{data.pay_remark}}</text>
					</view>
					<view class="order_desc" v-if="data.pay_fee">
						<text class="order_desc_title "></text>
						<text class="order_desc_right "><text style="font-weight: normal;">{{data.status === 0?'应付款':'实付款'}}</text> <text
								style="color:#FF5E50;margin-left: 24rpx;">¥{{data.pay_fee}}</text> </text>
					</view>

				</view>

			</view>
		</view>

		<view class="order_box" v-if="data.status === 2 || data.status === 4 || data.status === 12">
			<view class="order_desc" v-if="data.pay_name">
				<text class="order_desc_title ">支付方式</text>
				<text class="order_desc_right ">{{data.pay_name}}</text>
			</view>
			<view class="order_desc" v-if="data.pay_time">
				<text class="order_desc_title ">支付时间</text>
				<text class="order_desc_right ">{{data.pay_time | format}}</text>
			</view>
			<view class="order_desc" v-if="data.shipping_time">
				<text class="order_desc_title ">发货时间</text>
				<text class="order_desc_right ">{{data.shipping_time | format }}</text>
			</view>
			<view class="order_desc" v-if="data.confirm_time">
				<text class="order_desc_title ">收货时间</text>
				<text class="order_desc_right ">{{data.confirm_time | format }}</text>
			</view>
		</view>
		<view class="order_box" v-if="data.after_sale">
			<view class="order_desc" v-if="data.after_sale && data.after_sale.created_at">
				<text class="order_desc_title ">售后申请</text>
				<text class="order_desc_right ">{{data.after_sale && data.after_sale.created_at}}</text>
			</view>
			<view class="order_desc" v-if="data.after_sale && data.after_sale.refund_amount">
				<text class="order_desc_title ">退款金额</text>
				<text class="order_desc_right ">￥{{data.after_sale && data.after_sale.refund_amount}}</text>
			</view>
			<view class="order_desc" v-if="data.after_sale && data.after_sale.finish_at">
				<text class="order_desc_title ">售后完成</text>
				<text class="order_desc_right ">{{data.after_sale && data.after_sale.finish_at}}</text>
			</view>
		</view>

		<view v-if="data.staff_info" class="order_box">
			<view class="order_desc" v-if="data.staff_info && data.staff_info.dietitian">
				<text class="order_desc_title  justify" style="width:140rpx">服务营养师<text style="width:100%;display: inline-block;"></text></text>
				<text class="order_desc_right ">{{data.staff_info && data.staff_info.dietitian || '无'}}</text>
			</view>
			<view class="order_desc" v-if="data.staff_info && data.staff_info.sale">
				<text class="order_desc_title  justify" style="width:140rpx">销售营养师<text style="width:100%;display: inline-block;"></text></text>
				<text class="order_desc_right ">{{data.staff_info && data.staff_info.sale || '无'}}</text>
			</view>
			<view class="order_desc" v-if="data.staff_info && data.staff_info.belonger">
				<text class="order_desc_title  justify" style="width:140rpx">驻场营养师<text style="width:100%;display: inline-block;"></text></text>
				<text class="order_desc_right ">{{data.staff_info && data.staff_info.belonger || '无'}}</text>
			</view>
			<view class="order_desc" v-if="data.staff_info && data.staff_info.sale_rep">
				<text class="order_desc_title  justify" style="width:140rpx">销售代表<text style="width:100%;display: inline-block;"></text></text>
				<text class="order_desc_right ">{{data.staff_info && data.staff_info.sale_rep || '无'}}</text>
			</view>
			<view class="order_desc" v-if="data.staff_info && data.staff_info.references">
				<text class="order_desc_title  justify" style="width:140rpx">医生<text style="width:100%;display: inline-block;"></text></text>
				<text class="order_desc_right ">{{data.staff_info && data.staff_info.references || '无'}}</text>
			</view>
		</view>
		<!-- 其他人的订单只有查看物流 -->
		<view class="order_font" v-if="user_id !== data.user_id">
			<!-- <my-button v-if="setOrderBtn('查看物流',data.status)" width="192" height="72" border="#C2C2C2"
				@click="jump({url:'order/logistics',data: { express_code: data.express_code,express_no:data.express_no,order_id:data.id }})"
				color="#4B4B4B" margin="0 12rpx">查看物流</my-button> -->
		</view>
		<view class="order_font u-flex-wrap" v-else>
			<my-button v-if="setOrderBtn('申请售后',data.status)" width="192" height="72" margin="0 12rpx" border="#C2C2C2"
				@click="gotoApplyAfterSales" color="#4B4B4B">申请售后</my-button>
			<my-button v-if="setOrderBtn('售后订单',data.has_after_sale)" width="192" height="72" margin="0 12rpx"
				border="#C2C2C2" @click="jump({url:'order/refund',data:{order_id:data.id}})" color="#4B4B4B">售后订单</my-button>
			<my-button v-if="setOrderBtn('再次购买',data.status)" width="192" height="72" color="#4B4B4B" border="#C2C2C2"
				@click="buyAgain(data)" margin="0 12rpx">再次购买</my-button>
			<my-button v-if="setOrderBtn('取消订单',data.status)" width="192" height="72" color="#4B4B4B" border="#C2C2C2"
				margin="0 12rpx" @click="cancelPopupShow = true">取消订单
			</my-button>
			<my-button v-if="setOrderBtn('去付款',data.status)" width="192" height="72" margin="0 12rpx"
				@click="jump({ url: 'home/shoppingMall/pay', data: { order_id: data.id,order_sn:data.order_sn,pay_amount:data.pay_fee } })">
				去付款</my-button>
			<!-- <my-button v-if="setOrderBtn('查看物流',data.status)" width="192" height="72" border="#C2C2C2"
				@click="jump({url:'order/logistics',data: { express_code: data.express_code,express_no:data.express_no,order_id:data.id }})"
				color="#4B4B4B" margin="0 12rpx">查看物流</my-button> -->
			<my-button v-if="setOrderBtn('确认收货',data.status)" width="192" height="72" margin="0 12rpx"
				@click="$refs.orderPopup.open()">确认收货</my-button>
		</view>
		<!-- 确认收货弹框 -->
		<orderPopup ref="orderPopup" title="是否确认收货？" :content="data.express_code==='offline'?'当前订单为线下发货，请确认已收到货物。':'请收到商品确认无误后再确认收货' " @submit="submit"></orderPopup>
		<!-- 取消订单弹框 -->
		<u-popup duration="50" v-model="cancelPopupShow" border-radius="20" mode="bottom">
			<view class="popup_content" style="width: 100%;">
				<text class="popup_content_title">取消订单</text>
				<view class="popup_content_box" style="width: 100%;">
					<text style="color:#C2C2C2;font-size: 28rpx;padding: 12rpx 0;">请选择取消订单的原因：</text>
					<!-- <view v-for="(item,index) of cancelList" :key="index">
						{{item.label}}
					</view> -->
					<u-radio-group active-color="#00B8A2" inactive-color="#C2C2C2" v-model="value">
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
	import goodsItemOrder from './components/goodsItemOrder.vue'
	import myButton from '@/components/myButton.vue'
	import {
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				showTime: false, //倒计时
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
				role_id: '', //用户身份
				cancelPopupShow: false,
				backgroundColor: 'transparent',
				name: 'orderDetails', //上前页面的名字

				currendIndex: null, //当前详情页对应列表页的索引
				id: '', //id值
				data: {}, //详情数据
				user_id:'',
				logisticsData:{context:'',time:''},
			}
		},
		filters: {
			format(timeStamp) {
				if (!timeStamp) return '-'

				function add0(m) {
					return m < 10 ? '0' + m : m
				}
				let time = new Date(timeStamp * 1000)
				const y = time.getFullYear()
				const m = time.getMonth() + 1
				const d = time.getDate()
				const h = time.getHours()
				const mm = time.getMinutes()
				const s = time.getSeconds()
				return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
			}
		},
		onPageScroll(e) {
			this.backgroundColor = e.scrollTop > 10 ? '#00B8A2' : 'transparent'
		},
		onLoad(option) {
			// this.currendIndex = option.currendIndex
			this.id = option.id
			this.user_id = this.$store.state.user.userInfo.id
			// let pages = getCurrentPages()
			// let currentPages = pages[pages.length - 1]
			// //扫码跳转进来的时候保存当前路径
			// uni.setStorageSync('beforPage',currentPages.$page.fullPath)
			// console.log('beforPage',uni.getStorageSync('beforPage'))
		},
		onShow() {
			this.getOrderDetailsData()
			this.role_id = this.$store.state.user.userInfo.role_id
			
			console.log('this.role_id', this.role_id)
		},
		computed: {
			...mapGetters(['userInfo']),
			setOrderBtn() {
				return function(name, status) {
					let flag = false
					if (name === '查看物流') {
						flag = status == 2 || status == 3 || status == 4 //已发货、已收货、已完成
					}
					if (name === '售后订单') {
						flag = status //has_after_sale true就是有售后订单 
					}
					if (name === '申请售后') {
						flag = status != 0 && status != 10 && status != 12 //除了待支付，已取消，已关闭，都可以售后
					}
					if (name === '确认收货') {
						flag = status == 2 //待收货
					}
					if (name === '再次购买') {
						flag = status == 1 ||status == 4 || status == 10 || status == 12 //待发货、已完成、已取消、已关闭
					}
					if (name === '取消订单') {
						flag = status == 0 //待支付
					}
					if (name === '去付款') {
						flag = status == 0 //待支付
					}
					return flag
				}
			}
		},
		methods: {
			back() {
				console.log('自定义返回')
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				if (page) {
					let type = page.$page.fullPath !== '/pages/login/index' && 
						page.$page.fullPath !== '/pages/order/orderDetails'
					if (type) {
						uni.navigateBack()
					} else {
						wx.switchTab({
							url: '/pages/tabbar/projects'
						})
					}
				} else {
					wx.switchTab({
						url: '/pages/tabbar/projects'
					})
				}
				console.log(page)
			
			
			
			},
			gotoApplyAfterSales() { //申请售后


				uni.navigateTo({
					url: '/pages/order/applyAfterSales?order_id=' + this.data.id
				})
			},
			downEnd() { //倒计时结束
				this.showTime = false
			},
			buyAgain(item) { //再次购买
				console.log(item)

				let data = {
					goods: item.goods.map(v => ({
						goods_id: v.goods_id,
						goods_num: v.goods_number
					})),
				}
				if (this.role_id != 1) data.hospital_id = item.hospital_id
				this.$request({
					url: '/ApiV3/Mobile/Order/createBefore',
					loading:true,
					data
				}).then(res => {
					
					let address = uni.getStorageSync('submitOrderData') && JSON.parse(uni.getStorageSync('submitOrderData')).address || ''
					const data = JSON.stringify({...res.data,address})
					uni.setStorageSync('submitOrderData', data)
					uni.navigateTo({
						url: `/pages/home/shoppingMall/submitOrder?type=buy`
					})
				})
			},
			submit() { //确认收货
				this.$request({
					url: '/ApiV3/Mobile/Order/confirm',
					loading:true,
					data: {
						id: this.id
					}
				}).then(res => {
					this.$common.toast('成功')
					this.getOrderDetailsData()
				})
			},
			// 预览图片
			preview(urls, current) {
				uni.previewImage({
					urls,
					current
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
						cancle_reason: this.value,
					}
				}).then((res) => {
					this.cancelPopupShow = false
					this.$common.toast('取消成功')
					// if (this.$common.prePage().orderList && this.$common.prePage().orderList.length) {
					// 	this.$common.prePage().orderList[this.currendIndex].status = 10
					// }
					this.getOrderDetailsData()
				})

			},
			// 获取详情数据
			getOrderDetailsData() {
				this.$request({
					url: '/ApiV3/Mobile/Order/detail',
					method: 'get',
					data: {
						id: this.id,
					}
				}).then(({
					data
				}) => {
					this.data = data
					console.log(111, data.auto_cancle_time * 1000 > new Date().getTime())
					if (data.status === 0 && data.auto_cancle_time * 1000 > new Date().getTime()) {
						this.showTime = true
						data.downTime = (data.auto_cancle_time * 1000 - new Date().getTime()) / 1000
					}
					if (data.status === 2 && data.auto_confirm_time * 1000 > new Date().getTime()) {
						this.showTime = true
						data.downTime = (data.auto_confirm_time * 1000 - new Date().getTime()) / 1000
					}
					if(data.status === 2){
						this.getLogisticsData({express_code:data.express_code,express_no:data.express_no,order_id:data.id})
					}
					
				})


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
					this.logisticsData = data?.logistics?.data[0]
					
				})
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
			orderPopup
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #f7f7f7;
	}

	.container {
		background: #fafafa;
		min-height: 100vh;
		.justify{
			text-align: justify;
			height: 40rpx;
			width:120rpx
		}
		
		.order_status {
			// position: relative;
			// top: 16rpx;
			// left: 48rpx;
			margin-top: 16rpx;
			margin-left: 48rpx;
			color: #ffffff;
			font-size: 40rpx;
			font-weight: bold;
			background: transparent;

			.status_text {
				color: #ffffff;
			}

			.cancel_time {
				margin-top: 16upx;
				font-size: 28rpx;
				font-weight: normal;
				color: #ffffff;
			}
		}

		.order_address {
			margin: 0 32rpx;
			// position: relative;
			// top: 140rpx;
			margin-top: 24rpx;
			border-radius: 24rpx;
			padding: 32upx;
			background: #ffffff;
			font-size: 28upx;

			.address_top {
				justify-content: start;

				align-items: center;
				position: relative;
			}

			.address_details {
				margin-top: 14upx;
				// font-size: 24upx;
				font-weight: normal;
				color: #888888;
			}
		}

		.content-list {
			position: relative;

			.content-list-item {
				margin: 32rpx;
				overflow: hidden;
				border-radius: 24rpx;
			}
		}


		.order_box {
			background: #ffffff;
			margin: 32rpx;
			padding: 32rpx 0;
			overflow: hidden;
			border-radius: 24rpx;
		}

		.order_font {
			width: 100vw;
			position: fixed;
			bottom: 0;
			padding: 24rpx 32rpx;
			background-color: #ffffff;
			display: flex;
			justify-content: flex-end;
			my-button{
				margin-bottom: 20rpx;
			}
		}

		.schedule_container {
			margin-top: 20upx;
			padding: 30upx;
			display: flex;
			background: #ffffff;
			position: relative;

			.left_icon {
				position: absolute;
				top: 34upx;
				left: 30upx;
				width: 42upx;
				height: 42upx;
			}

			.schedule_content {
				padding-left: 62upx;
				display: flex;
				flex-direction: column;

				text {
					width: 550upx;
				}

				.title {
					font-size: 32upx;
				}

				.text {
					margin-top: 12upx;
					color: #888888;
				}

				.date {
					margin-top: 4upx;
					padding-left: 20upx;
					color: #888888;
					font-size: 24upx;
				}
			}

			.right_icon {
				position: absolute;
				top: 50%;
				right: 30upx;
				transform: translateY(-50%);
				width: 16upx;
				height: 26upx;
			}
		}

		.order_goods_container {
			background: #ffffff;
			padding: 30rpx 0;
			// margin-top: 20upx;

			.order_goods_item {
				margin-bottom: 20upx;

				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.leave_a_message {
			background: #ffffff;
			padding: 30upx;
			display: flex;

			>view {
				flex: 1;
			}
		}

		.order_price_info {
			padding: 15upx 0;
			margin-top: 20upx;
			background: #ffffff;

			.price_info_row {
				justify-content: space-between;
				padding: 15upx 30upx;
			}
		}

		.total_container {
			background: #ffffff;
			padding: 30upx;
			text-align: right;

			.total_price {
				font-size: 32upx;
				font-weight: bold;
				color: #fd5624;
			}
		}

		.order_basic_info {
			margin-top: 20upx;
			background: #ffffff;
			padding: 15upx 30upx;
			font-size: 24upx;
			color: #888888;

			.basic_info_row {
				padding: 15upx 0;
				justify-content: space-between;

				.content {
					flex: 1;
					color: #4a4a4a;
				}
			}

			.images {
				margin-top: 20upx;
				display: flex;
				flex-wrap: wrap;

				image {
					margin-right: 20upx;
					margin-bottom: 20upx;
					width: 140upx;
					height: 140upx;
				}
			}
		}

		.footer_button {
			background: #ffffff;
			padding-right: 30upx;
			justify-content: flex-end;
		}
	}
</style>
