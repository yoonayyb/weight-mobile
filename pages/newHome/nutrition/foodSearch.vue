<template>
	<view class="container">
		<view class="search">
			<u-search style="flex:1" focus  placeholder="请输入食物名称" v-model="keyword" @custom="search" @search="search" height="72"
				:clearabled="true" :show-action="false"></u-search>
			
		</view>
		<view style="padding:26rpx 42rpx">
			<view>
				<text style="font-size: 32rpx;font-weight: bold;color:#2A2A2A">搜索记录</text>
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
				
				history:uni.getStorageSync('historyFoods') && JSON.parse( uni.getStorageSync('historyFoods'))|| []
			}
		},
		onLoad(option) {
			this.keyword = option.keyword
			
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
				let trim_keyword = this.$u.trim(this.keyword)
				if(trim_keyword){
					if(this.history.includes(trim_keyword)){
						let index = this.history.indexOf(trim_keyword)
						this.history.splice(index,1)
						this.history.unshift(trim_keyword)
					}else{
						this.history.unshift(trim_keyword)
					}
					
					uni.setStorageSync('historyFoods', JSON.stringify(this.history))
				}
				
				page.$vm.setKeyWord(this.$u.trim(trim_keyword))
				
				
				uni.navigateBack({
					delta:1
				})
				// console.log(111)
				// uni.navigateTo({
				// 	url:`/pages/newHome/nutrition/addFood?keyword=${this.keyword}`
				// })
			},
			cancel(){
				let that = this
				uni.showModal({
					title:'是否删除历史搜索',
					success(res) {
						if (res.confirm) {
							that.history = []
							uni.setStorageSync('historyFoods', JSON.stringify(that.history))
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