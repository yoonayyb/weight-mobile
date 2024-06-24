<template>
	<view  class="container">
		<u-gap height="24"></u-gap>
		<view class="detail_box">
			<view class="title">{{item.title}}</view>
			<view v-for="v in item.topics" :key="v"  style="display: inline-block;" class="article_tab ">{{v.title}}</view>
			<view class="u-m-t-10 u-flex-y-center">
				<u-avatar  :src="item.author && item.author.avatar" size="96"></u-avatar>
				<view class="u-flex-column u-flex-around u-font-24 u-m-l-16" style="width: 420rpx;">
					<view> <text class="u-font-28 u-m-r-8" style="font-weight: bold;">{{item.author && item.author.realname || ''}}</text> <text>{{item.author && item.author.titles || ''}}</text> </view>
					<view style="color:#4B4B4B;margin-top: 16rpx;min-height:32rpx" class="u-line-1"> {{item.author && item.author.hospital_title || ''}}</view>
				</view>
				<view @click="flo" class="follow" :class="{active:item.is_follow}">{{item.is_follow?'已关注':'关注'}}</view>
			</view>
			<view class="u-m-b-20 u-font-24" style="color:#C2C2C2">
				{{item.created_at}}
			</view>
			<u-tag style="margin:0rpx 16rpx 16rpx 0;display: inline-block;" v-for="(item,index) of item.topics" :key="index" :text="'#'+item.title+'#'" shape="circle" border-color="#F1FBFA"  bg-color="#F1FBFA" color="#00B8A2"  @click="gotoSearch(item)"  mode="plain" />
			<rich-text :nodes="item.content">
				
			</rich-text>
			
			<view class="title u-m-t-20 u-m-b-32" style="font-size: 32rpx;" >相关内容</view>
			<block v-if="articleList.length">
			<view  @click="gotoArticleDetail(item)" class="swiper-item-right" v-for="item in articleList" :key="item.id">
				<u-image height="200rpx" width="300rpx" :src="item.thumb" :lazy-load="true">
				</u-image>
				<view class="u-m-l-10">
					<text class="u-line-2">{{item.title}}</text>
					<view  class=" u-p-t-10 u-line-2">
						<view v-for="v in item.topics" :key="v.id" style="display: inline-block;" class="article_tab ">{{v.title}}</view>
					</view>
					<view class="u-flex-y-center u-font-24">
						<u-avatar :src="item.author && item.author.avatar" size="48"></u-avatar>
						<text class="u-m-l-10 u-m-r-10 u-line-1">{{item.author && item.author.realname}}</text>
						<text style="color:#C2C2C2" class="u-line-1">{{item.author && item.author.titles}}</text>
					</view>
				</view>
			</view>
			</block>
			<view v-else style="text-align: center;margin: 120rpx 0;">
				
				<image :src="`${imgUrl}v3-empty.png`" style="width: 200rpx;height:200rpx" mode="widthFix"></image>
				<view style="color:#C2C2C2">暂时没有相关内容</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:'',
				length:0,
				page:1,
				item:{},
				articleList: []
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDetail()
		},
		onReachBottom() {
		console.log('底部')
			if(this.length){
				this.page++
				this.getArticleList()
			}
			
		},
		methods:{
			gotoSearch(item){
				let data = JSON.stringify(item)
				uni.reLaunch({
					url:'/pages/tabbar/diary?data='+data + '&current=1'
					
				})
			},
			getDetail(){
				this.$request({
					url: '/ApiV3/Mobile/Knowledge/articleDetail',
					method: 'get',
					data: {
						id:this.id
					}
				}).then(({data})=>{
					this.item = data
					this.item.content = this.item.content.replaceAll('<img ','<img style="max-width:100%;heigth:auto"')
					//相关内容推荐
					this.getArticleList()
				})
			},
			getArticleList(){
				let topics = this.item.topics && this.item.topics.map(res=>res.id).join(',')
				this.$request({
					url: '/ApiV3/Mobile/Knowledge/articles',
					method: 'get',
					data: {
						topics,
						_ids:this.id,
						page:this.page,
						hospital_id:uni.getStorageSync('hospitalId') || 0
					}
				}).then(({data})=>{
					if(this.page === 1){
						this.articleList = data.data
					}else{
						this.articleList = [...this.articleList,...data.data]
					}
					
					this.length = data.next_page_url
				})
			},
			gotoArticleDetail(item){
				uni.navigateTo({
					url: '/pages/search/articleDetail?id=' + item.id
				})
			},
			flo(){
				
				let url = this.item.is_follow?'/ApiV3/Mobile/Knowledge/unFollow':'/ApiV3/Mobile/Knowledge/follow'
					this.$request({
						url,
						loading:true,
						data:{
							staff_id:this.item.staff_id
						}
					}).then(({data})=>{
						this.item.is_follow = !this.item.is_follow
						
					})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		
		min-height: 100vh;
		padding-bottom:120rpx;
		background: #FAFAFA;
		.detail_box{
			background-color: #FFF;
			padding: 32rpx;
			.title{
				font-weight: bold;
				color: #2A2A2A;
				font-size: 40rpx;
				margin-bottom:20rpx;
			}
			
			.article_tab{
				background-color: #F1FBFA;
				border-radius: 24rpx;
				color:#00B8A2;
				font-size: 24rpx;
				padding:6rpx 16rpx;
				margin-right: 14rpx;
				margin-bottom:12rpx;
			}
			.follow{
				background: #00B8A2;
				border-radius: 40rpx;
				color: #FFFFFF;
				
				
				width: 120rpx;
				height: 48rpx;
				font-size: 24rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}
			.active{
				background:transparent;
				border: 1px solid #C2C2C2;
				color: #C2C2C2;
			}
			.swiper-item-right {
				display: flex;
				// margin: 32rpx;
				// margin-top:16rpx;
				
				border-bottom: 1px solid #F3F3F3;
				padding:16rpx 0;
				&:last-child{
					border-bottom: none;
				}
				>view {
					width: 378rpx;
					// flex: 1;
					display: flex;
					flex-direction: column;
					align-left: 8rpx;
					font-size: 28rpx;
					color: #2A2A2A;
					font-weight: bold;
				}
				.article_tab{
					background-color: #F1FBFA;
					border-radius: 24rpx;
					color:#00B8A2;
					font-size: 24rpx;
					padding:6rpx 16rpx;
					margin-right: 14rpx;
					margin-bottom:12rpx;
				}
			
			}
		}
	}
</style>