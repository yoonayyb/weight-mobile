<template>
	<view class="container">
		<view class="search">
			<u-search style="flex:1" focus  placeholder="搜索好物" v-model="keyword" @custom="search" @search="search" height="72"
				:clearabled="true"></u-search>
			
		</view>
		<view style="padding:26rpx 42rpx">
			<view>
				<text style="font-size: 32rpx;font-weight: bold;color:#2A2A2A">历史搜索</text>
				<image v-if="history.length" @click="cancel" :src="`${imgUrl}v3_shop_cancel.png`" style="width:48rpx;height:48rpx;float: right;" mode=""></image>
			</view>
			<veiw class="u-flex u-flex-wrap">
				<view class="u-line-1 word" @click="setWrod(item)" v-for="(item,index) of history.slice(0,8)" :key="item">{{item}}</view>
			</veiw>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:'',
				hospitalId:0,
				history:uni.getStorageSync('historyGoods') && JSON.parse( uni.getStorageSync('historyGoods'))|| []
			}
		},
		onLoad(option) {
			this.keyword = option.keyword
			this.hospitalId = option.hospitalId
			console.log('this.keyword',this.keyword)
		},
		methods:{
			setWrod(val){
				this.keyword = val
				this.search(val)
			},
			search(val){
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				if(this.$u.trim(this.keyword)){
					this.history.includes(this.keyword)?'':this.history.unshift(this.keyword)
					uni.setStorageSync('historyGoods', JSON.stringify(this.history))
				}
				
				// page.$vm.setKeyWord(this.$u.trim(this.keyword))
				
				
				// uni.navigateBack({
				// 	delta:1
				// })
				console.log(111)
				uni.navigateTo({
					url:`/pages/home/shoppingMall/searchShopping?keyword=${this.keyword}&hospitalId=${this.hospitalId}`
				})
			},
			cancel(){
				let that = this
				uni.showModal({
					title:'是否删除历史搜索',
					success(res) {
						if (res.confirm) {
							that.history = []
							uni.setStorageSync('historyGoods', JSON.stringify(that.history))
							uni.showToast({
								title:'成功'
							})
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
						
					}
				})
				
			}
		}
	}
</script>

<style lang="scss">
	.container{
		min-height: 100vh;
		background: #FAFAFA;
	}
	.search {
		display: flex;
		align-items: center;
		padding: 20rpx 32rpx;
		background: #FFFFFF;
	}
	.word{
		max-width:272rpx;
		background-color: #F3F3F3;
		border-radius: 36rpx;
		margin: 17rpx 11rpx;
		padding: 8rpx 24rpx;
		font-size: 28rpx;
		color: #2A2A2A;
	}
</style>