<template>
	<view class="container">
		<view class="search">
			<u-search style="flex:1" focus  placeholder="发现内容" v-model="keyword" @custom="search" @search="search" height="72"
				:clearabled="true"></u-search>
			
		</view>
		<view v-if="history.length" style="padding:26rpx 32rpx 0rpx 32rpx">
			<view>
				<text style="font-size: 32rpx;font-weight: bold;color:#2A2A2A">历史搜索</text>
				<image v-if="history.length" @click="cancel" :src="`${imgUrl}v3_shop_cancel.png`" style="width:48rpx;height:48rpx;float: right;" mode=""></image>
			</view>
			<veiw class="u-flex u-flex-wrap">
				<view class="u-line-1 word" @click="setWrod(item)" v-for="(item,index) of history.slice(0,8)" :key="item">{{item}}</view>
			</veiw>
			
		</view>
		<view v-if="token" class="topic" >
			
			<block v-if="topicList.length">
			<view class="title">发现话题  <image  :src="`${imgUrl}search_card_bg.png`" mode=""></image>   </view>
			<view @click="goback(item)" :style="{paddingTop:index?'24rpx':'0'}" v-for="(item,index) in topicList" :key="index" class="u-flex-y-center u-font-32 u-flex-between box_item" >
				<view class="u-flex"> 
				<text style="padding-right:16rpx;" :style="{color:index>2?'#C2C2C2':''}" :class="'topic'+index"> {{ index<9 ?'0'+(index+1):index+1}} </text> 
				<view class="u-line-1" style="width:380rpx;">{{item.title}}</view> 
				</view>
				<view style="color:#C2C2C2;font-size: 28rpx">{{item.relation}}条动态</view>
			</view>
			</block>
			<view v-else class="u-flex-column u-flex-items-center" style="transform: translate(0, 50%);">
				<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3-empty.png`" mode=""></image>
				<view style="color:#C2C2C2;padding:16rpx 0">暂无话题</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topicList:[],
				topic:'',
				token:'',
				keyword:'',
				page:1,
				length:0,
				history:uni.getStorageSync('diarySearch') && JSON.parse( uni.getStorageSync('diarySearch'))|| []
			}
		},
		onLoad(option) {
			this.keyword = option.keyword || ''
			this.token = uni.getStorageSync('token')
			console.log('this.keyword',this.keyword)
			if(this.token){
				this.getTopic()
			}
		},
		onReachBottom() {
		console.log('底部')
			if(this.length){
				this.page++
				this.getTopic()
			}
			
		},
		methods:{
			setWrod(val){
				this.keyword = val
				this.search()
			},
			goback(item){
				this.topic = item
				console.log(item)
				this.search()
			},
			getTopic(){
				this.$request({
					url:'/ApiV3/Mobile/Knowledge/topics',
					method:'get',
					data:{
						page:this.page
					}
				}).then(({data})=>{
					if(this.page === 1){
						this.topicList = data.data
					}else{
						this.topicList = [ ...this.topicList,...data.data]
					}
					this.length = data.next_page_url
				})
			},
			search(){
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				if(this.$u.trim(this.keyword)){
					this.history.includes(this.keyword)?'':this.history.unshift(this.keyword)
					uni.setStorageSync('diarySearch', JSON.stringify(this.history))
				}
				
				page.$vm.setKeyWord(this.$u.trim(this.keyword),this.topic)
				// page.$vm.keyword = this.keyword
				
				uni.navigateBack({
					delta:1
				})
			},
			cancel(){
				let that = this
				uni.showModal({
					title:'是否删除历史搜索',
					success(res) {
						if (res.confirm) {
							that.history = []
							uni.setStorageSync('diarySearch', JSON.stringify(that.history))
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

<style lang="scss" scoped>
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
		max-width:300rpx;
		background-color: #F3F3F3;
		border-radius: 36rpx;
		margin: 24rpx 11rpx 24rpx 0;
		padding: 8rpx 24rpx;
		font-size: 28rpx;
		color: #2A2A2A;
	}
	.topic{
		width: 100%;
		
		padding: 0 32rpx 32rpx 32rpx;
		
		.title{
			position: relative;
			font-weight: bold;
			padding: 32rpx 14rpx 8rpx 32rpx;
			font-size: 32rpx;
			background: linear-gradient(180deg, rgba(0,225,203,0.25), #FFFFFF 70%, #FFFFFF);
			height: 108rpx;
			border-radius: 24rpx 24rpx 0rpx 0rpx;
			image{
				width: 94rpx;
				height: 74rpx;
				position: absolute;
				right: 14rpx;
				top: 12rpx;
			}
		}
		
			.box_item{
				border-bottom:1px solid #f8f8f8;
				padding: 24rpx;
				background-color: #FFFFFF;
				&:last-child{
					border-bottom:none;
				}
			}
			.topic0{
				color:#F96647;
			}
			.topic1{
				color:#F58D34;
			}
			.topic2{
				color:#FFBB3D;
			}
		
	}
</style>