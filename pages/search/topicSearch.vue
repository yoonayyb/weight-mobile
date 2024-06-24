<template>
	<view class="container">
		
		
		
		
		<view class="box">
			<u-search   style="flex:1;margin-bottom:20rpx" focus placeholder="搜索更多话题" @input="search(1)" v-model="keyword" @custom="search" @search="search"
				height="72"  :clearabled="true"></u-search>
			<view v-for="(item,index) in topicList" :key="index" @click="goback(item)" class="u-flex-y-center u-p-t-32 u-p-b-32 u-font-32  box_item" >
				<image :src="`${imgUrl}v3_topic_search.png`" style="width:48rpx;height:48rpx;margin-right: 10rpx;" mode=""></image>
				<view class="u-flex-column">
				
					<view class="u-line-1" style="width:480rpx;">{{item.title}}</view> 
					<view v-if="!item.id"  style="color:#C2C2C2" class="u-font-28 u-m-t-10">点击创建自定义话题</view>
				</view>
				<view v-if="item.id" style="color:#C2C2C2;font-size: 28rpx">{{item.relation}}条动态</view>
			</view>
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
		onLoad(option){
			this.keyword = option.keyword
			this.getTopicList()
		},
		onReachBottom() {
		console.log('底部')
			if(this.length){
				this.page++
				this.getTopicList()
			}
			
		},
		methods:{
			search(type = false){
				if(!type && !this.keyword.trim()){
					let pages = getCurrentPages()
					let page = pages[pages.length - 2];
					
					page.$vm.setKeyWord(this.keyword)
					// page.$vm.keyword = this.keyword
					
					uni.navigateBack({
						delta: 1
					})
				}else{
					this.page = 1
					this.getTopicList()
				}
				
			},
			getTopicList(){
				this.$request({
					url:'/ApiV3/Mobile/Knowledge/topics',
					method:'get',
					loading:true,
					data:{
						title:this.keyword,
						page:this.page
					}
				}).then(({data})=>{
					if(this.page === 1){
						this.topicList = data.data
						//创建
						if(this.keyword.trim() !== '' && !data.data.length && !data.data.find(res=> res.title === this.keyword)){
							this.topicList.unshift({
								id:0,
								title:this.keyword,
								relation:0
							})
						}
						
						
					}else{
						this.topicList = [ ...this.topicList,...data.data]
					}
					this.length = data.next_page_url
				})
			},
			goback(item){
				if(!item.id){
					this.setNew()
				}else{
					let pages = getCurrentPages()
					let page = pages[pages.length - 2];
					
					page.$vm.setKeyWord(item.title)
					// page.$vm.keyword = this.keyword
					
					uni.navigateBack({
						delta: 1
					})
				}
					
				
				
			},
			addtopic(item){
				this.setNew()
			},
			setNew(){
				this.$request({
					url:'/ApiV3/Mobile/StaffKnowledge/topicAdd',
					loading:true,
					data:{
						title:this.keyword
					}
				}).then(res=>{
					this.$common.toast('添加成功');
					this.search()
				})
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
			// top:-24rpx;
			.box_item{
				border-bottom:1px solid #f8f8f8;
				display: flex;
				align-items: stretch;
				&:last-child{
					border-bottom:none;
				}
			}
			
		}
	}
</style>