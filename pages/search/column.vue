<template>
	<view class="container">
		<view class="search">
			
				<u-search style="flex:1"  placeholder="搜索内容" v-model="keyword" @custom="search" @search="search" @change="$u.debounce(search, 300)"
					height="72" :clearabled="true"></u-search>
			
		</view>
		
			<u-sticky>
				<u-tabs item-width="50vw" :list="tabList" :is-scroll="true" :current="current" inactive-color="#C2C2C2"
					active-color="#2A2A2A" :bar-style="{background:'#00B8A2'}" :bar-height="8" :bar-width="112"
					:font-size="32" @change="handleTabCurrent"></u-tabs>
			</u-sticky>
			<u-gap height="24"></u-gap>
			<view v-if="current === 0">
				<view v-if="flowList.length" class="u-flex u-flex-wrap">
					<view style="border-radius: 16rpx 16rpx 0 0; overflow: hidden;background: #ffffff;margin: 20rpx;width:44% " class="demo-warter  u-p-b-20" v-for="(item, index) in flowList" :key="index">
						<!-- 警告：微信小程序中需要hx2.8.11版本才支持在template中结合其他组件，比如下方的lazy-load组件 -->
						<!-- <u-lazy-load threshold="-450" border-radius="10" :image="item.thumb" :index="index">
						</u-lazy-load> -->
						<customVideo @play="play" :item="item"></customVideo>
						
						<view class="u-m-t-10 text-bold u-line-1 u-font-28" style="min-height: 36rpx;">
							{{item.title}}
						</view>
						<view class="u-font-24 u-m-t-10 u-flex">
					
							<u-avatar :src="item.author && item.author.avatar" size="64"></u-avatar>
					
							<view class="u-flex-column u-flex-between u-m-l-10" style="width: 234rpx;">
								<view>{{item.author && item.author.realname}} <text class="u-m-l-10">
										{{item.author && item.author.titles}}</text> </view>
								<text class="u-line-1"
									style="color:#C2C2C2;min-height: 32rpx;">{{item.author && item.author.hospital_title}}</text>
							</view>
						</view>
					</view>
				</view>	
				<block v-else>
					<view class="u-flex-column u-flex-items-center" style="transform: translate(0, 50%);">
						<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_empty_video.png`" mode="">
						</image>
						<view style="color:#C2C2C2;padding:16rpx 0">暂无视频</view>
					</view>
				</block>
			</view>
			<view v-else style="padding: 20rpx;">
				<block v-if="articleList.length">
					<view @click="gotoArticleDetail(item)" class="swiper-item-right" v-for="item in articleList"
						:key="item.id">
						<u-image height="200rpx" width="300rpx" :src="item.thumb" :lazy-load="true">
						</u-image>
						<view class="u-m-l-10">
							<text class="u-line-2">{{item.title}}</text>
							<view class=" u-p-t-10 u-line-2" style="flex-grow: 2">
								<view v-for="(v,i) in item.topics" :key="i" style="display: inline-block;"
									class="article_tab ">{{v.title}}</view>
							</view>
							<view class="u-flex-y-center u-font-24;flex-grow: 2">
								<u-avatar size="48"></u-avatar>
								<text class="u-m-l-10 u-m-r-10 u-line-1">{{item.author && item.author.realname}}</text>
								<text style="color:#C2C2C2"
									class="u-line-1">{{item.author && item.author.titles}}</text>
							</view>
						</view>
					</view>
				</block>
				<block v-else>
					<view class="u-flex-column u-flex-items-center" style="transform: translate(0, 50%);">
						<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3-empty.png`" mode=""></image>
						<view style="color:#C2C2C2;padding:16rpx 0">无搜索结果</view>
					</view>
				</block>
			</view>
		<playVideo @fullscreenchange="fullscreenchange" v-if="fullScreen" ref="playVideo"></playVideo>
	</view>
</template>

<script>
	import customVideo from '@/components/video.vue'
	import playVideo from '@/components/playVideo.vue'
	export default {
		data() {
			return {
				fullScreen:false,
				keyword: '',
				tabList: [{
					name: uni.getAccountInfoSync().miniProgram.envVersion === 'develop'?'图片' :'短视频'
				}, {
					name: '推文'
				}],
				current: 0,
				length: 0,
				page: 1,
				id:'',
				articleList: [],
				flowList: [],
			}
		},
		components: {
			customVideo,
			playVideo
		},
		onLoad(option) {
			this.id = option.id
			uni.setNavigationBarTitle({
				title:option.title
			})
			this.current = 0
			this.getVideoList()
			console.log('this.keyword', this.keyword)
		},
		onReachBottom() {
			console.log('底部')
			if (this.current === 0) {
				this.page++
				this.getVideoList()
			} else {
				this.page++
				this.getArticleList()
			}

		},
		methods: {
			fullscreenchange(val){
				this.fullScreen = val
			},
			async play(id){
				console.log(1111,id)
				this.fullScreen = true
				await this.$nextTick()
				this.$refs.playVideo.play(id)
			},
			getVideoList() { //获取视频列表
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Knowledge/videos',
						method: 'get',
						data: {
							page: this.page,
							title: this.keyword,
							type_id:this.id
						}
					}).then(({
						data
					}) => {
						if (this.page === 1) {
							this.flowList = []
							this.flowList = data.data
							
						} else {
							this.flowList = [...this.flowList, ...data.data]
						}
						
						this.length = data.next_page_url
						// this.per_page = data.per_page
						resolve()
					})
				})
			},
			getArticleList() { //获取推文列表
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV3/Mobile/Knowledge/articles',
						method: 'get',
						data: {
							page: this.page,
							title: this.keyword,
							type_id:this.id
						}
					}).then(({
						data
					}) => {
						if (this.page === 1) {
							this.articleList = data.data
			
						} else {
							this.articleList = [...this.articleList, ...data.data]
						}
						this.length = data.next_page_url
						resolve()
					})
				})
			},
			gotoArticleDetail(item) {
				uni.navigateTo({
					url: '/pages/search/articleDetail?id=' + item.id
				})
			},
			// 处理点击tab栏的索引
			handleTabCurrent(index) {
				this.current = index
				this.search()
			},
			setWrod(val) {
				this.keyword = val
				this.search(val)
			},
			search(val) {
				this.page = 1
				if (this.current === 0) {
					this.getVideoList()
					
				} else {
					  this.getArticleList()
					
				}
				// let pages = getCurrentPages()
				// let page = pages[pages.length - 2];

				// page.$vm.setKeyWord(this.keyword)
				// // page.$vm.keyword = this.keyword

				// uni.navigateBack({
				// 	delta: 1
				// })
			},
			
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background: #FAFAFA;
		padding-bottom: 100rpx;
	}

	.search {
		display: flex;
		align-items: center;
		padding: 20rpx 32rpx;
		background: #FFFFFF;
	}

	.word {
		max-width: 272rpx;
		background-color: #F3F3F3;
		border-radius: 36rpx;
		margin: 17rpx 11rpx;
		padding: 8rpx 24rpx;
		font-size: 28rpx;
		color: #2A2A2A;
	}

	.swiper-item-right {
		display: flex;
		// margin: 32rpx;
		// margin-top:16rpx;

		border-bottom: 1px solid #F3F3F3;
		padding: 16rpx 0;

		&:last-child {
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

		.article_tab {
			background-color: #F1FBFA;
			border-radius: 24rpx;
			color: #00B8A2;
			font-size: 24rpx;
			padding: 6rpx 16rpx;
			margin-right: 14rpx;
			margin-bottom: 12rpx;
		}

	}
</style>
