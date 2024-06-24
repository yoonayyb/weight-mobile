<template>
	<view class="container">
		
		<image @click="back" style="position: absolute;top:108rpx;left:24rpx;width:48rpx;height:48rpx" :src="`${imgUrl}v3_topic_back.png`" mode=""></image>
		
		<image :src="`${imgUrl}v3_topic.png`" style="width:750rpx;height:400rpx" mode=""></image>
		<view class="box">
			<u-search  @click="gotoSearch" disabled style="flex:1;margin-bottom:20rpx" focus placeholder="搜索更多话题" v-model="keyword" @custom="search" @search="search"
				height="72" :show-action="false" :clearabled="false"></u-search>
				<block v-if="topicList.length">
			<view @click="goback(item)" v-for="(item,index) in topicList" :key="index" class="u-flex-y-center u-p-t-32 u-p-b-32 u-font-32 u-flex-between box_item" >
				<view class="u-flex"> 
				<text style="padding: 0 16rpx;" :style="{color:index>2?'#C2C2C2':''}" :class="'topic'+index"> {{ index<9 ?'0'+(index+1):index+1}} </text> 
				<view class="u-line-1" style="width:480rpx;">{{item.title}}</view> 
				</view>
				<view style="color:#C2C2C2;font-size: 28rpx">{{item.relation}}条动态</view>
			</view>
			</block>
			
			
			
		</view>
		<view v-if="!topicList.length" class="u-flex-column u-flex-items-center" style="transform: translate(0, 50%);">
			<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3-empty.png`" mode=""></image>
			<view style="color:#C2C2C2;padding:16rpx 0">暂无话题</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				keyword:'',
				page:1,
				length:0,
				topicList:[]
			}
		},
		
		onShow() {
			this.getTopic()
		},
		onReachBottom() {
		console.log('底部')
			if(this.length){
				this.page++
				this.getTopic()
			}
			
		},
		methods:{
			goback(item){
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				
				page.$vm.setTopic(item)
				// page.$vm.keyword = this.keyword
				
				uni.navigateBack({
					delta: 1
				})
			},
			getTopic(){
				this.$request({
					url:'/ApiV3/Mobile/Knowledge/topics',
					method:'get',
					data:{
						title:this.keyword,
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
			gotoSearch(){
				console.log(this.keyword)
				uni.navigateTo({
					url:'/pages/search/topicSearch?keyword=' + this.keyword
				})
			},
			back(){
				uni.navigateBack()
			},
			search(){
				
			},
			setKeyWord(val){
				this.keyword = val
			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color:#FAFAFA ;
		.box{
			background: #FFF;
			border-radius: 24rpx 24rpx 0 0;
			overflow: hidden;
			padding: 20rpx 32rpx;
			position: relative;
			top:-24rpx;
			.box_item{
				border-bottom:1px solid #f8f8f8;
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
	}
</style>