<template>
	<view class="container u-skeleton" @click="login">
		
			<!-- <view class="search u-skeleton-fillet">
				<u-search disabled style="flex:1" @click="gotoSearch" :show-action="false" placeholder="搜索好物"
					v-model="keyword" height="72" :clearabled="true"></u-search>
					
					<image @click="jump({url:'home/shoppingMall/cart'})" :src="`${imgUrl}v3_tab_commodity_icon_shoppingcart.png`" mode=""
						style="width:48rpx;height:48rpx;margin-left:16rpx"></image>
				
			</view> -->
			<u-gap height="24" ></u-gap>
			
			<block v-if="goodsList.length > 0">
				<view class="goods_list">
					<view class="goods_item u-skeleton-fillet" v-for="(item, index) in goodsList" :key="index">
						<goods-item :item="{...item,hospitalId}"></goods-item>
					</view>
				</view>
				<!-- <scroll-view scroll-y  class="goods_list" :style="{height: scrollViewHeight + 'px'}" @scrolltolower="scrolltolower">
					<view style="display: inline-block;" class="goods_item u-skeleton-fillet" v-for="(item, index) in goodsList" :key="index">
						<goods-item style="display: inline-block;" :item="{...item,hospitalId}"></goods-item>
					</view>
				</scroll-view> -->
			</block>
			<view v-else class="u-flex u-flex-column u-flex-center" style="width: 100%;height: 100vh;">
				<image :src="`${imgUrl}v3_shop_empty.png`" style="width:200rpx;height: 200rpx;" slot="img" />
				<text style="color: #C2C2C2;margin-top: 20rpx;">暂无搜索结果换一个关键词试试</text>
			</view>
		
	</view>
</template>

<script>
	import goodsItem from '@/components/goodsItem.vue'
	import myButton from '@/components/myButton.vue'
	
	export default {
		data() {
			return {
				loading: false,
				hospitalId: 0, //医院id
				keyword: '', //搜索商品
				length: 0,
				page: 1,
				size: 15,
				goodsList: [], //商品列表数据
				
			}
		},
		watch: {
			
		},
		
		onLoad(option) {
			this.keyword = option.keyword
			this.hospitalId = option.hospitalId
			this.getGoodsList()
			console.log('this.keyword',this.keyword)
		},
		async onPullDownRefresh(){
			if(!this.token) return uni.stopPullDownRefresh();
			this.page = 1
			await this.getGoodsList()
			uni.stopPullDownRefresh();
		},
		async onShow(){
			
		},
		// 触底通知子组件加载更多
		onReachBottom() {
			console.log('触底')
			if (this.length === this.size) {
				this.page++
				this.getGoodsList()
			}
		},
		methods: {
			
			login(){
					if(this.token) return
					uni.navigateTo({
						url:'/pages/login/index'
					})
			},
			//搜索
			search(val) {
				console.log(val)
			},
			change(index) {
				this.current = index

				this.page = 1
				this.getGoodsList()
				// this.getClassIdGoodsList(this.classifysList[index].id)
			},
			// 去登陆
			jumpLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			// 提交小程序码传进来的参数
			submitInviterId() {
				this.$request({
					url: '/ApiV2/Mobile/Bind/bindByScene',
					data: {
						scene_id: this.inviterId
					}
				}).then((res) => {
					console.log('提交成功小程序码传进来的参数: ', res)
				})
			},
			// banner跳转
			bannerJump(item) {
				if (item.appid === 'myapp') {
					uni.navigateTo({
						url: item.url
					})
				}
			},
			//分类商品数据
			// getClassIdGoodsList(class_id) {
			// 	this.$request({
			// 		url: '/ApiV2/Mobile/Goods/index',
			// 		method: 'get',
			// 		data: {
			// 			lengthNum: this.size,
			// 			page: this.page,
			// 			class_id,
			// 			hospital_id:this.hospitalId
			// 		}
			// 	}).then((res) => {
			// 		console.log('res: ', res)
			// 		if (this.page === 1) {
			// 			this.goodsList = res.data.data
			// 		} else {
			// 			this.goodsList = [...this.goodsList, ...res.data.data]
			// 		}
			// 		this.length = res.data.data.length

			// 	})
			// },
			// 获取商品列表数据
			getGoodsList() {
				let data =  {
							lengthNum: this.size,
							page: this.page,
							keywords:this.keyword,
							hospital_id:this.hospitalId
						}
			
				return new Promise((resolve,reject)=>{
					this.$request({
						url: '/ApiV3/Mobile/Goods/index',
						method: 'get',
						data
					}).then((res) => {
						
						console.log('res: ', res)
						if (this.page === 1) {
							this.goodsList = res.data.data
						} else {
							this.goodsList = [...this.goodsList, ...res.data.data]
						}
						this.length = res.data.data.length
						
						resolve()
					}).catch(err=>{
						
					})
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
			goodsItem,
			myButton,
			
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		::-webkit-scrollbar {
		  display: none;
		  width: 0 !important;
		  height: 0 !important;
		  -webkit-appearance: none;
		  background: transparent;
		}
		min-height: 100vh;
		background: #FAFAFA;
		::v-deep .u-tab-item{
			border-radius: 36rpx;
			margin-right: 16rpx;
			background: #F3F3F3;
		}
		.u-select {


			&__body {
				width: 100%;
				height: 300rpx;
				overflow: hidden;
				background-color: #fff;

				&__picker-view {
					height: 100%;
					box-sizing: border-box;

					&__item {
						display: flex;
						align-items: center;
						justify-content: center;
						font-size: 32rpx;
						color: $u-main-color;
						padding: 0 8rpx;
					}
				}
			}
		}

		.u-navbar-inner {
			margin-right: 0 !important;
		}

		.u-navbar-content-title {
			position: static !important;
		}

		.slot-wrap {
			// width: 100vw;

			display: flex;
			align-items: center;

		}

		.popup-hospital {
			position: absolute;
			top: 0;
			width: 100%;
			z-index: 10080;
			background-color: #FFFFFF;
			min-height: 600rpx;
		}

		.search {
			display: flex;
			align-items: center;
			padding: 20rpx 32rpx;
			background: #FFFFFF;
		}

		.banner {
			width: 750upx;
			height: 300upx;

			.swiper {
				width: 100%;
				height: 100%;

				image {
					width: 100%;
					height: 100%;
				}
			}
		}

		.classifys {
			padding: 0rpx 20rpx;
			padding-bottom: 30upx;
			display: flex;
			flex-wrap: wrap;

			.classify_item {
				margin-top: 30upx;
				flex-direction: column;
				justify-content: center;
				width: 25%;
				font-size: 24upx;

				image {
					width: 100upx;
					height: 100upx;
					border-radius: 50%;
					filter: drop-shadow(1px 3px 5px);
				}

				text {
					margin-top: 12upx;
				}
			}
		}

		.goods_list {
			// border-top: 30upx solid #f7f7f7;
		}
	}
</style>
