<template>
	<view class="container">
		<view class="goods_container">
			<view class="goods_container_name">退款商品</view>
			<!-- <refund-goods :copyList="refundList" @change="getRefundList" width="100%" :applyForAfterSaleBtn="false" :jumpGoods="true" :cartList='textData' /> -->
			<refund-goods width="100%"  :cartList='data.goods' @change="checkboxChange"
			  @numberChange='numberChange'>
			</refund-goods>
		</view>
		<view class="goods_container">
			<view class="goods_container_name">选择服务类型</view>
			<view class="goods_container_box">
				<view v-for="(item,index) in serverTypeList" :key="index" @click="checked=index===1 && btnDisable?checked:item.value;changeDate(item,index)" class="goods_container_checked"
					:class="{active:checked == item.value,disable:index===1 && btnDisable}">{{item.label}}</view>
			</view>
		</view>
		<view class="goods_container">
			<view class="goods_container_name">退款信息</view>
			
			<view class="refund_left u-flex">
				<text class="symbol">*</text>
				<text>货物状态</text>
			</view>
			<view class="goods_container_box">
				<view v-for="(item,index) in foodTypeList " :key="index" @click="checked1=index===1 && btnDisable?checked1:item.value;changeDate(item,index)" class="goods_container_checked"
					:class="{active:checked1 == item.value,disable:index===1 && btnDisable}">{{item.label}}</view>
			</view>
			
			<view class="refund_left u-flex">
				<text class="symbol">*</text>
				<text>退款原因</text>
			</view>
			<view class="goods_container_box">
				<view v-for="(item,index) in refundResonList" :key="index" @click="checked2=item.value;changeDate(item,index)" class="goods_container_checked"
					:class="{active:checked2 == item.value}">{{item.label}}</view>
			</view>
			<view class="refund_left u-flex">
				<text class="symbol">*</text>
				<text>退款金额</text>
				<text class="refund_price">￥{{price}}</text>
			</view>
		</view>
		<view class="goods_container">
			<view class="goods_container_name">申请说明</view>
			<view class="describe_container">
				<textarea v-model="describe" :maxlength="500" placeholder-class="light_color"
					placeholder="请输入文本内容"></textarea>
				<view>
					<u-upload :max-count="9" :header="uploadHeader" ref="uUpload" width="140" height="140" :show-progress="false"
						:auto-upload="false" action="111"></u-upload>
				</view>
			</view>
		</view>
		<view style="display: flex;justify-content: center;">
			<my-button width="562" height="80" @click="submit">提交</my-button>
		</view>
	</view>
</template>

<script>
	import refundGoods from './components/refundGoods.vue'
	import myButton from '@/components/myButton.vue'
	const params = {
		"refund_type_map": {
		"仅退款": 1,
		"退货退款": 2
		},
		"shipping_status_map": {
		"未收到货": 0,
		"已收到货": 1
		},
		"refund_reason_map": {
		"不需要了":1,
		"发货速度慢":2,
		"协商一致退款":3,
		"商品降价":4
		}
	}
	export default {
		data() {
			return {
				btnDisable:true,//按钮禁用
				serverTypeList:[],//服务类型
				foodTypeList:[],//货物状态
				refundResonList:[],//退款原因
				checkedList:[],//选中的退款商品数据
				refundList:[],
				goods: [],
				price:0,
				checked: 1,//服务类型
				checked1:0,//货物状态
				checked2:1,//退款原因
				data: {}, //退款信息
				currentCauseData: {}, //当前选择的原因数据
				causeOptions: [], //原因数据配置项
				describe: '', //描述
				uploadHeader: {
					//上传请求头
					authorization: 'Bearer ' + uni.getStorageSync('token')
				},
				baseUrl: '', //上传图片的baseurl
				id:'',//订单id
			}
		},
		watch: {
			
			
		},
		onLoad(option) {
			
			
			this.baseUrl = this.$common.baseUrl_v2
			this.id = option.order_id
			this.getRefundData()
			//服务类型
			for( let i in params.refund_type_map){
				this.serverTypeList.push({
					label:i,
					value:params.refund_type_map[i]
				})
			}
			//货物状态
			for( let i in params.shipping_status_map){
				this.foodTypeList.push({
					label:i,
					value:params.shipping_status_map[i]
				})
			}
			//退款原因
			for( let i in params.refund_reason_map){
				this.refundResonList.push({
					label:i,
					value:params.refund_reason_map[i]
				})
			}
			
		},
		methods: {
			setPrice(){
				this.price = 0
				this.data.goods.forEach(v=>{
					if(v.checked){
						this.price += Number(v.goods_number) * Number(v.makeprice)
					}
				})
				this.price = parseFloat(this.price.toFixed(2))
			},
			getRefundData(){
				
				this.$request({
					url:'/ApiV3/Mobile/OrderAfterSale/createBefore',
					data:{
						id:this.id
					}
				}).then(({data})=>{
					this.data = data.order_info
					this.data.goods.forEach(v=>{
						v.checked = false,
						v.max = v.goods_number-v.refund_apply_num-v.refund_num
						v.goods_number = v.max
					})
					//待发货的时候禁用 退货退款、已收到货
					this.btnDisable = this.data.status === 1
					
				})
			},
			checkboxChange (item, index) {
			  console.log('item',item)
			  this.$set(this.data.goods[index],'checked',!item.checked)
			  this.setPrice()
			},
			numberChange (item, index) {
			
			  this.$set(this.data.goods[index],'goods_number',item.goods_number)
			  this.setPrice()
			},
			changeDate(item,index){
				
				console.log(this.checked,this.checked1,this.checked2)
			},
			
			async submit(){
				
				if(!this.price) return this.$common.toast('请选择需要退款的商品')
				this.checkedList = this.data.goods.filter(v=>v.checked).map(v=>({og_id:v.id,refund_num:v.goods_number}))
				console.log('退款商品',this.checkedList)
				console.log('服务类型',this.checked)
				console.log('货物状态',this.checked1)
				console.log('退款原因',this.checked2)
				console.log('申请说明',this.describe)
				const images = []
				
				let task = this.$refs.uUpload.lists.map(async (item) => {
					console.log('item',item)
					const {key} = await this.$common.uploadParams(item.file.path)
					return images.push(key)
				})
				Promise.all(task).then(res=>{
					console.log('images',images)
					let data = {
						order_id:this.id,
						refund_type:this.checked,
						shipping_status:this.checked1,
						refund_reason:this.checked2,
						apply_remark:this.describe,
						images,
						order_goods:this.checkedList
					}
					this.$request({
						url:'/ApiV3/Mobile/OrderAfterSale/apply',
						loading:true,
						data
					}).then(res=>{
						this.$common.toast('提交成功')
						uni.redirectTo({
							url:'/pages/order/refundDetails?id=' + res.data.id
						})
					})
				})
				
				
				
			},
		},
		components: {
			refundGoods,
			myButton
		}
	}
</script>

<style>
	page {
		background: #f7f7f7;
	}
</style>

<style lang="scss" scoped>
	.container {
		padding-bottom: 44rpx;
	}

	.goods_container {

		background: #ffffff;
		border-radius: 24rpx;
		margin: 32rpx;
		overflow: hidden;
		padding-bottom: 24rpx;

		.goods_container_name {
			font-size: 32rpx;
			font-weight: bold;
			color: #2A2A2A;
			padding: 24rpx 0 12rpx 24rpx
		}

		.goods_container_box {
			display: flex;
			flex-wrap: wrap;
			padding: 0 22rpx;

			.goods_container_checked {
				min-width: 174rpx;
				height: 56rpx;
				padding: 8rpx 24rpx;
				text-align: center;
				margin: 12rpx 16rpx 12rpx 0;
				background: #F3F3F3;
				color: #2A2A2A;
				border-radius: 36px 36px 36px 36px;

			}
			.disable{
				color:#C2C2C2
			}
			.active {
				background: #00B8A2;
				color: white;
			}
		}

		.refund_left {
			padding: 0rpx 24rpx;

			.symbol {
				position: relative;
				top: 4upx;
				margin-right: 2rpx;
				color: red;
				font-size: 36upx;
				font-weight: 700;
			}

			.refund_price {
				position: absolute;
				right: 60rpx;
				color: #FF5E50;
				font-weight: bold;
			}
		}

		.describe_container {
			background: #ffffff;
			padding: 0 22rpx;
			padding-bottom: 24rpx;

			textarea {
				margin-top: 12rpx;
				box-sizing: border-box;
				padding: 24rpx;
				background: #f7f7f7;
				border-radius: 24rpx;
				width: 100%;
				height: 280upx;
			}
		}

	}

	.refund_container {
		margin-top: 20upx;
		background: #ffffff;

		.title {
			padding: 30upx;
			font-size: 32upx;
		}

		.refund_item_wrap {
			padding: 30upx;
			justify-content: space-between;

			.refund_left {
				.symbol {
					position: relative;
					top: 8upx;
					margin-right: 10upx;
					color: red;
					font-size: 36upx;
					font-weight: 700;
				}
			}
		}
	}
</style>
