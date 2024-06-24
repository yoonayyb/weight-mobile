<template>
	<view class="container">
		<view v-if="textData.status === 6" class="container_img">
			<image :src="`${imgUrl}v3_refund_close.png`" mode=""></image>
			<text>售后申请已撤销</text>
		</view>
		<view v-if="textData.status === 3" class="container_img">
			<image :src="`${imgUrl}v3_refund_huo.png`" mode=""></image>
			<text>待退货</text>
		</view>
		<!-- <view v-if="textData.status === 3" class="container_img">
			<image  :src="`${imgUrl}v3_refund_huo.png`" mode=""></image>
			<text>待退款</text>
		</view> -->
		<view v-if="textData.status === 0" class="container_img">
			<image :src="`${imgUrl}v3_refund_ready.png`" mode=""></image>
			<text>待审核</text>
		</view>
		<view v-if="textData.status === 2" class="container_img">
			<image :src="`${imgUrl}v3_refund_fail.png`" mode=""></image>
			<text>审核已驳回,请重新申请</text>
		</view>
		<view v-if="textData.status === 1" class="container_img">
			<image :src="`${imgUrl}v3_refund_finish.png`" mode=""></image>
			<text>已退款</text>
		</view>

		<view v-if="textData.status !== 6" style="margin:32rpx 0">
			<u-steps mode="dot" active-color="#00B8A2" un-active-color="#C2C2C2"
				:list="textData.status_step && textData.status_step.steps.map(v=>({name:v}))" :current="textData.status_step && textData.status_step.step"></u-steps>
		</view>
		<view class="goods_container u-flex">
			<view @click="_jump({url:'order/refund_progress',data:{id:textData.id}}) " style="flex:1;padding: 0 24rpx;font-size: 26rpx;">
				<text>{{textData.log && textData.log.title}}</text>
				<view style="font-size: 24rpx;color:#C2C2C2;margin: 12rpx 0;">
					{{textData.log && textData.log.create_time}}</view>
			</view>
			<u-icon style="margin-right: 24rpx;" name="arrow-right" size="32"></u-icon>
		</view>
		<view v-if="textData.is_can_refund" class="goods_container">
			<view class="goods_container_name">退货信息</view>

			<view class="copy" @click="copyText">
				<u-icon name="order" size="24" color="#00B8A2"></u-icon> 复制
			</view>

			<view class="order_desc">
				<text class="order_desc_title u-line-1">收件人：</text>
				<text class="order_desc_right u-line-2">{{textData.com_name}} {{textData.com_mobile}}</text>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1">地址：</text>
				<text class="order_desc_right u-line-2" style="font-weight: normal;">
					{{textData.com_address}}
				</text>
			</view>
			<!-- 其他人订单 -->
			<block v-if="user_id != loginUserId">
				<view class="order_desc">
					<text class="order_desc_title u-line-1">物流公司</text>
					<view class="order_desc_right u-line-2" style="font-weight: normal;" :style="{color:'#2A2A2A'}">
						{{logisticsName.label}}
					</view>
				</view>
				<view class="order_desc">
					<text class="order_desc_title u-line-1">快递单号</text>
					<text class="order_desc_right u-line-2" style="font-weight: normal;"
						:style="{color:'#2A2A2A'}">{{express}}</text>
				</view>
			</block>
			<block v-else>
				<view class="order_desc" 
					@click="()=>{if(textData.status === 3) logistics = true}">
					<text class="order_desc_title u-line-1">物流公司</text>
					<view class="order_desc_right u-line-2" style="font-weight: normal;"
						:style="{color:logisticsName.value != 0?'#2A2A2A':'#C2C2C2'}">{{logisticsName.label}}
						<u-icon size="32" color="#2A2A2A" name="arrow-right"></u-icon>
					</view>
				</view>
				<view class="order_desc" >
					<text class="order_desc_title u-line-1">快递单号</text>
					<text class="order_desc_right u-line-2" style="font-weight: normal;"
						:style="{color:!express?'#C2C2C2':'#2A2A2A'}"
						@click="expressPopupShow = true">{{express?express:'请填写'}}</text>
				</view>
				<view v-if="textData.status === 3" style="display: flex;justify-content: center;margin:12rpx 0">
					<my-button v-if="initialization" @click="add" width="152" height="56"> 提交</my-button>
					<my-button v-else width="152" height="56" @click="add"> 修改</my-button>
				</view>
			</block>
			
		</view>
		<view class="goods_container">
			<goods-item-order v-for="(item, index) in textData.items" :key="index" width="100%" :item="item">
			</goods-item-order>
		</view>
		<view class="goods_container">
			<view class="order_desc" v-if="textData.order_sn">
				<text class="order_desc_title u-line-1">售后订单</text>
				<text class="order_desc_right u-line-1">{{textData.order_sn}}</text>
			</view>
			<view class="order_desc" v-if="textData.order && textData.order.order_sn">
				<text class="order_desc_title u-line-1">商城订单</text>
				<text class="order_desc_right u-line-1">{{textData.order && textData.order.order_sn}}</text>
			</view>
			<view class="order_desc" >
				<text class="order_desc_title u-line-1">退款状态</text>
				<text class="order_desc_right u-line-1">{{textData.refund_type==1?'仅退款':'退货退款'}}</text>
			</view>
			<view class="order_desc">
				<text class="order_desc_title u-line-1">货物状态</text>
				<text class="order_desc_right u-line-1">{{textData.shipping_status?'已收到货':'未收到货'}}</text>
			</view>
			<view class="order_desc" >
				<text class="order_desc_title u-line-1">退款原因</text>
				<text class="order_desc_right u-line-1">
					{{textData.refund_reason==1?'不需要了':textData.refund_reason==2?'发货速度慢':textData.refund_reason==3?'协商一致退款':'商品降价'}}
				</text>
			</view>
			<view class="order_desc" v-if="textData.created_at">
				<text class="order_desc_title u-line-1">售后申请</text>
				<text class="order_desc_right u-line-1">{{textData.created_at|| '-'}}</text>
			</view>
			<view class="order_desc" v-if="textData.cancle_at">
				<text class="order_desc_title u-line-1">撤销申请</text>
				<text class="order_desc_right u-line-1">{{textData.cancle_at|| '-'}}</text>
			</view>
			<view class="order_desc" v-if="textData.refund_amount">
				<text class="order_desc_title u-line-1">退款金额</text>
				<text class="order_desc_right u-line-1" style="color:red">-¥{{textData.refund_amount || '-'}}</text>
			</view>
			<view class="order_desc" v-if="textData.audit_at">
				<text class="order_desc_title u-line-1">通过时间</text>
				<text class="order_desc_right u-line-1">{{textData.audit_at|| '-'}}</text>
			</view>
			<view class="order_desc" v-if="textData.refund_at">
				<text class="order_desc_title u-line-1">退款时间</text>
				<text class="order_desc_right u-line-1">{{textData.refund_at|| '-'}}</text>
			</view>

		</view>
		<view v-if="user_id == loginUserId" class="order_font">

			<!-- 撤销申请的条件是 除了已取消、已退款 -->
			<my-button v-if="textData.status !== 6 && textData.status !== 1"  width="192" height="72" color="#4B4B4B" margin="0 12rpx" @click="$refs.orderPopup.open()">撤销申请
			</my-button>
			<!-- 重新申请的条件是：待审核 已驳回 待退货 待退款  已取消 -->
			<my-button v-if="textData.status !== 1" width="192" height="72" margin="0 12rpx" @click="_jump({url:'order/applyAfterSales',data:{order_id:textData.order.id}})">重新申请
			</my-button>

		</view>
		<!-- 快递单号弹框 -->
		<u-popup closeable negative-top="30vh" duration="50" v-model="expressPopupShow" border-radius="20"
			mode="center">
			<input-popup title="快递单号" :value="express" type="input" :show="expressPopupShow"
				@confirm="inputConfirm($event, 'express', 'expressPopupShow')">
			</input-popup>
		</u-popup>
		<!-- 撤销申请弹框 -->
		<orderPopup ref="orderPopup" title="撤销申请" content="您将撤销本次申请，如果问题未解决可以再次发起申请。确定继续吗？" @submit="submit">
		</orderPopup>
		<!-- 物流公司弹框 -->
		<u-select v-model="logistics" @confirm="getLogisticsDate" :list="logisticsList"></u-select>
		<!-- <u-popup closeable negative-top="30vh" duration="50" v-model="applayPopupShow" border-radius="20" mode="center">
			<view class="popup_content">
		 	<text class="popup_content_title">撤销申请</text>
				<text class="popup_content_box" >您将撤销本次申请，如果问题未解决
					可以再次发起申请。确定继续吗？</text>
				<view class="popup_content_foot">
					<my-button width="182" height="72" color="#00B8A2" bg="#FFFFFF" margin="0 12rpx">取消</my-button>
					<my-button width="182" height="72" margin="0 12rpx">确定</my-button>
				</view>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	import infoTemplate from '@/components/infoTemplate.vue'
	import inputPopup from '@/components/inputPopup.vue'
	import orderPopup from './components/order_popup.vue'
	import goodsItemOrder from './components/goodsItemOrder.vue'
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				initialization: true, //初始化为空的时候是提交
				logisticsName: {
					label: '请选择',
					value: 0
				},
				logistics: false, //物流公司
				logisticsList: [],
				express: '', //快递单号
				expressPopupShow: false,
				applayPopupShow: false,
				textData: {},
				id: '',
				role_id: '',
				user_id: '',//该订单用户id
				loginUserId:'',//当前账号用户id
			}
		},
		components: {
			goodsItemOrder,
			myButton,
			infoTemplate,
			inputPopup,
			orderPopup
		},
		onLoad(option) {
			
			this.id = option.id
			this.user_id = this.$store.state.user.userInfo.id
			// let pages = getCurrentPages()
			// let currentPages = pages[pages.length - 1]
			// //扫码跳转进来的时候保存当前路径
			// uni.setStorageSync('beforPage',currentPages.$page.fullPath)
			// console.log('beforPage',uni.getStorageSync('beforPage'))
		},
		onShow() {
			this.getDetail()
			this.role_id = this.$store.state.user.userInfo.role_id
			this.loginUserId = this.$store.state.user.userInfo.id
			
		},
		methods: {
			add(){//提交、编辑
				if(!this.express.trim()) return this.$common.toast('请输入快递单号')
				if(!this.logisticsName.value) return this.$common.toast('请选择物流公司')
				this.$request({
					url:'/ApiV3/Mobile/OrderAfterSale/express',
					loading:true,
					data:{
						id:this.id,
						express_code:this.logisticsName.value,
						express_no:this.express.trim()
					}
				}).then(res=>{
					this.$common.toast('成功')
					this.getDetail()
				})
			},
			getLogisticsDate(arr) {

				this.logisticsName = arr[0]


			},
			getDetail() {

				this.$request({
					url: '/ApiV3/Mobile/OrderAfterSale/detail',
					method: 'get',
					data: {
						id: this.id,
					}
				}).then(({
					data
				}) => {
					this.textData = data
					this.express = this.textData.express_no
					this.initialization = !this.express // 如果有快递单号就编辑 否则是新增
					
					if(data.is_can_refund){//如果有退货信息 才请求物流信息列表
						this.getLogisticsList()
					}
				})
			},
			getExpress(){
				
			},
			getLogisticsList(){
				
				this.$request({
					url:'/ApiV3/Mobile/Address/expressCode',
					method:'get',
				}).then(({data})=>{
					this.logisticsList = []
					for(let i in data.codes){
						this.logisticsList.push({
							value: i,
							label: data.codes[i]
						})
						if(this.textData.express_code){//如果已经填了物流公司 就赋值
							this.logisticsName = this.logisticsList.filter(v=>v.value === this.textData.express_code)[0]
						}
						
					}
				})
			},
			submit() {
				this.$request({
					url:'/ApiV3/Mobile/OrderAfterSale/cancle',
					loading:true,
					data:{
						id:this.id
					}
				}).then(res=>{
					
					
					this.getDetail()
				})
			},
			revoke() {

			},
			inputConfirm(value, type, showType) {
				this[type] = value.trim()
				this[showType] = false
			},
			copyText() {
				uni.setClipboardData({
					
					data: this.textData.com_name +' '+ this.textData.com_mobile + ' ' + this.textData.com_address,
					success: function(res) {
						
						uni.showToast({
							title: '复制成功',
						});
					}
				});
			}
		}
	}
</script>
<style>
	.u-steps .u-steps__item__dot{
		    width: 28rpx !important;
		    height: 28rpx!important;
	}
	.u-steps .u-steps__item--row .u-steps__item__line{
			left: 56%!important;
		    width: 90%!important;
	}
</style>
<style lang="scss" scoped>
	.disabledBg {
		background-color: #e2e2e2 !important;

		.order_desc_title,
		.order_desc_right {
			color: #C2C2C2 !important
		}

	}

	.container {
		background: #FAFAFA;
		min-height: 100vh;



		.container_img {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #00B8A2;
			padding-top: 32rpx;

			image {
				width: 56rpx;
				height: 56rpx;
				margin-right: 12rpx;
			}


		}

		.copy {
			position: absolute;
			right: 36rpx;
			top: 24rpx;
			color: #00B8A2;
			font-size: 24rpx;

		}

		.goods_container {
			position: sticky;
			background: #ffffff;
			border-radius: 24rpx;
			margin: 32rpx;
			overflow: hidden;
			padding: 24rpx 0;

			.goods_container_name {
				font-size: 32rpx;
				font-weight: bold;
				color: #2A2A2A;
				padding: 0 0 12rpx 24rpx
			}
		}

		.order_desc {
			display: flex;
			justify-content: space-between;
			font-weight: bold;
			font-size: 28rpx;
			padding: 12rpx 32rpx;
			background-color: #FFFFFF;

			&_title {
				font-weight: normal;
				width: 130rpx;
				color: #4B4B4B
			}

			&_right {
				color: #2A2A2A;
				flex: 1;
				display: flex;
				justify-content: flex-end;
			}
		}

		.order_font {
			width: 100vw;
			position: fixed;
			bottom: 24rpx;
			padding: 24rpx 32rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: flex-end;
			padding-bottom: 0!important;
			padding-bottom: constant(safe-area-inset-bottom)!important;
			padding-bottom: env(safe-area-inset-bottom) !important;
		}
	}
</style>
