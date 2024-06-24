<template>
	<view class="container u-skeleton">
		<u-navbar :is-back="false" :border-bottom="false" title-color="#2A2A2A" :title-size="32" title-bold
			:title="title"></u-navbar>
		<!-- <u-search margin="20rpx 32rpx" bg-color="#ffffff" v-if="role_id == 3" shape="round" @custom="search" @search="search" :show-action="false"
			placeholder="发现内容" clearabled @clear="search" v-model="keyword">
			<u-tag v-if="topics.length" slot="topic" shape="circle" style="margin:12rpx;display: inline-block;"
				v-for="(item,index) of topics" :key="index" :text=" '#'+item.title" border-color="#F1FBFA"
				bg-color="#F1FBFA" color="#00B8A2" closeable :show="item.show" @close="tagClick(index)" mode="light" />
		</u-search>
		</u-search> -->
		<!-- <u-button @click="_jump({url:'player/player'})">拉流</u-button>
		<u-button @click="_jump({url:'pusher/pusher'})">直播推流</u-button> -->
		<view style="padding:20rpx 32rpx;background: #ffffff;" class="u-flex-xy-center">
			<u-search @click="_jump({url:'search/diarySearch',data:{keyword}})" style="flex:1" shape="round"
				@custom="search" @search="search" disabled :show-action="false" placeholder="发现内容" clearabled
				@clear="search" v-model="keyword">
				<u-tag v-if="topics.length" slot="topic" shape="circle" style="margin:12rpx;display: inline-block;"
					v-for="(item,index) of topics" :key="index" :text=" '#'+item.title" border-color="#F1FBFA"
					bg-color="#F1FBFA" color="#00B8A2" closeable :show="item.show" @close="tagClick(index)"
					mode="light" />
			</u-search>
			<image v-if="role_id != 1 && token" @click="jump({url:'search/myVideo'})"
				style="width:48rpx;height:48rpx;margin-left:16rpx" :src="`${imgUrl}v3_video.png`" mode=""></image>
		</view>
		<view v-if="!keyword && !topics.length" style="padding: 0 32rpx 32rpx 32rpx;background: #ffffff;">
			<u-swiper class="u-skeleton-fillet" @click="bannerJump" height="320" border-radius="16"
				:list="bannerList && bannerList.knowledge_banner && bannerList.knowledge_banner.map(v=>v.thumb)"></u-swiper>
		</view>
		<view style="padding:0 32rpx;background: #ffffff;" v-if="knowledge.length && !keyword && !topics.length"
			class="special_box">
			<image class="u-skeleton-fillet" style=" border-radius:16rpx"
				@click="_jump({url:'search/column',data:{id:item.id,title:item.title}})"
				v-for="(item,index) of knowledge" :key="index" :src="item.icon" mode="aspectFit"></image>
		</view>
		<!-- <u-sticky @fixed="fixed" @unfixed="unfixed">
			<view>
				<u-tabs item-width="50vw" :list="ulist" :is-scroll="false" :current="current" inactive-color="#C2C2C2"
					active-color="#2A2A2A" :bar-style="{background:'#00B8A2'}" :bar-height="8" :bar-width="112"
					:font-size="32" @change="tabsChange"></u-tabs>
			</view>
		</u-sticky> -->
		<view>
			<u-tabs item-width="50vw" :list="ulist" :is-scroll="false" :current="current" inactive-color="#C2C2C2"
				active-color="#2A2A2A" :bar-style="{background:'#00B8A2'}" :bar-height="8" :bar-width="112"
				:font-size="32" @change="tabsChange"></u-tabs>
		</view>
		<swiper style="padding:0" :style="{height: swiperHeight + 'px'}" :current="current" @change="animationfinish">
			<swiper-item class="swiper-item swiper1 u-skeleton-fillet">
				<block v-if="flowList.length">
					<view class="u-flex u-flex-wrap">
						<view
							style="border-radius: 16rpx 16rpx 0 0; overflow: hidden;background: #ffffff;margin: 20rpx;width:44% "
							class="demo-warter  u-p-b-20" v-for="(item, index) in flowList" :key="index">
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
				</block>
				<block v-else>
					<view class="u-flex-column u-flex-items-center" style="transform: translate(0, 50%);">
						<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_empty_video.png`" mode="">
						</image>
						<view style="color:#C2C2C2;padding:16rpx 0">暂无视频</view>
						<!-- <view v-else   style="text-align: center;">
							<view class="u-m-b-10" style="color:#C2C2C2;padding:16rpx 0">暂无视频,请先登录</view>
							<my-button @click="jumpLogin" width="280" height="72" >去登陆</my-button>
						</view> -->
					</view>
				</block>
			</swiper-item>
			<swiper-item class="swiper-item swiper2">
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
							<view class="u-flex u-flex-items-end u-font-24" style="flex-grow: 2">
								<u-avatar :src="item.author && item.author.avatar" size="48"></u-avatar>
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
						<view style="color:#C2C2C2;padding:16rpx 0">暂无推文</view>
						<!-- <view v-else   style="text-align: center;">
							<view class="u-m-b-10" style="color:#C2C2C2;padding:16rpx 0">暂无推文,请先登录</view>
							<my-button @click="jumpLogin" width="280" height="72" >去登陆</my-button>
						</view> -->
					</view>
				</block>
			</swiper-item>
		</swiper>
		<u-loadmore v-if="current === 0 && flowList.length" margin-top="60" :load-text="loadText" icon-type="flower"
			color="#C2C2C2" :status="loadStatus" @loadmore="loadmoreData"></u-loadmore>
		<u-loadmore v-if="current === 1 && articleList.length" margin-top="60" :load-text="loadText" icon-type="flower"
			color="#C2C2C2" :status="loadStatus" @loadmore="loadmoreData"></u-loadmore>
		<!--引用组件-->
		<playVideo @fullscreenchange="fullscreenchange" v-if="fullScreen" ref="playVideo"></playVideo>
		<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		<u-tabbar :before-switch="beforeSwitch" active-color="#00B8A2" inactive-color="#C2C2C2" ref="custom-tabbar"
			height="120rpx" icon-size="60rpx" class="custom-tabbar" :list="list"></u-tabbar>
	</view>
</template>
<script>
	import myButton from '@/components/myButton.vue'
	import customVideo from '@/components/video.vue'
	import playVideo from '@/components/playVideo.vue'
	export default {
		data() {
			return {
				envVersion: 'release',
				title: this.$store.state.user.home_title,
				fullScreen: false,
				loadStatus: 'loadmore',
				loadText: {
					loadmore: '轻轻上拉',
					loading: '努力加载中',
					nomore: '实在没有了'
				},
				loading: true,
				keyword: '',
				topics: [], //标题
				bannerList: {
					knowledge_banner: [{
						thumb: 'https://qlogo2.store.qq.com/qzone/1416956117/1416956117/100?1531323520'
					}]
				},
				swiperHeight: 1000,
				vlength: 1,
				vpage: 1,
				alength: 1,
				apage: 1,
				articleList: [{
					title: ''
				}],
				knowledge: [{
					icon: '',
					title: ''
				}, {
					icon: '',
					title: ''
				}],
				flowList: [],
				token: '', //登录token
				list: this.$store.state.tabbar.list,
				ulist: [{
					name: uni.getAccountInfoSync().miniProgram.envVersion === 'develop' ? '图片' : '短视频'
				}, {
					name: '推文'
				}],
				current: 0,
				scene_id: '',
			}
		},
		computed: {
			role_id() {
				console.log('this.role_id', uni.getStorageSync('role_id'))
				return uni.getStorageSync('role_id') || 1
			}
		},
		async onShow() {
			const accoutInfo = uni.getAccountInfoSync()
			this.envVersion = accoutInfo.miniProgram
			console.log('commonApi', (uni.getStorageSync('baseUrl_v2') || this.$common.commonApi.api.new))
			this.title = this.$store.state.user.home_title
			// let env = (uni.getStorageSync('baseUrl_v2') ||  this.$common.commonApi.api.new) 
			// if(env === 'https://pre-test.subweight.weehealth.cn'){
			// 	this.title = this.$store.state.user.home_title 
			// }else if(env === 'https://testv2.subweight.weehealth.cn'){
			// 	this.title = '发现（测试）'
			// }else if(env === 'http://192.168.8.66:9501'){
			// 	this.title = '发现（本地）'
			// }
			//获取医院id更新banna
			this.token = uni.getStorageSync('token')
			if (!this.token) {
				// #ifndef APP-PLUS
				wx.hideShareMenu()
				// #endif
			} else {
				// #ifndef APP-PLUS
				wx.showShareMenu()
				// #endif
			}
			//先执行一次off 否则多次执行
			uni.$off('diary')
			uni.$once('diary', async (data) => {
				console.log('执行到这里')
				await this.getKonwLedge() //专题
				await this.getBanner() //banner
				this.search()
			})
			if (uni.getStorageSync('hospitalId')) {
				this.getLoginData(uni.getStorageSync('hospitalId'))
			}
		},
		async onLoad(option) {
			console.log('option: ', option)
			
			uni.setStorageSync('shop', 0)
			await this.getKonwLedge() //专题
			await this.getBanner() //banner
			if (option.scene) {
				uni.setStorageSync('inviterId', option.scene)
				if(option.scene.includes('_video_detail')){//扫视频二维码
					let videoID = option.scene.split('_')[0]
					console.log('videoID: ', videoID)
					this.play(videoID)
				}
				
				
			}else {
				this.current = Number(option.current) || 0
				if (Object.keys(option).length) {
					let data = JSON.parse(option.data)
					this.topics.push({
						...data,
						show: true
					})
				}
			}
			this.search()
		},
		async onShareAppMessage() {
			if (uni.getStorageSync('token')) {
				await this.getScene_id()
				return {
					title: '医学营养减重与控糖管理平台',
					path: `/pages/tabbar/diary?scene=${this.scene_id}`,
					imageUrl: `${this.imgUrl}share.jpg`
				}
			} else {}
		},
		async onReachBottom() {
			console.log('底部')
			console.log('this.length', this.length)
			if (this.current === 0) {
				if (this.vlength) {
					this.loadStatus = 'loading';
					this.vpage++
					await this.getVideoList()
					this.loadStatus = 'loadmore';
				} else {
					await this.videoHeight()
					this.loadStatus = 'nomore';
				}
			} else {
				if (this.alength) {
					this.loadStatus = 'loading';
					this.apage++
					await this.getArticleList()
					this.loadStatus = 'loadmore';
				} else {
					await this.articleHeight()
					this.loadStatus = 'nomore';
				}
				// this.articleList.push(...this.articleList)
			}
		},
		watch: {
			'$store.state.user.hospital_id'(val) {
				console.log('$store.state.user.hospital_id', val)
				this.getBanner()
				this.getKonwLedge() //专题
				this.search()
				this.getLoginData(val)
			},
			// 'flowList.length':async function(val) {
			// 	// console.log('this.current',this.current)
			// 	if (this.current === 0) {
			// 		if(val){
			// 			// this.loadStatus = 'loadmore';
			// 			await this.$nextTick()
			// 			await this.videoHeight()
			// 			// let len = val || 2
			// 			// const num = len % 2 === 0 ? parseInt(len / 2) : parseInt(len / 2) + 1
			// 			// this.swiperHeight = num * uni.upx2px(1100)
			// 			// console.log('num',num)
			// 			console.log('this.swiperHeight',this.swiperHeight)
			// 		}else{
			// 			this.loadStatus = 'nomore';
			// 		}
			// 	}
			// },
			// 'articleList.length': async function(val) {
			// 	console.log('this.current',this.current)
			// 	if (this.current === 1) {
			// 		if(val){
			// 			// this.loadStatus = 'loadmore';
			// 			await this.$nextTick()
			// 			await this.articleHeight()
			// 			// let len = val || 2
			// 			// this.swiperHeight = (len || 2) * uni.upx2px(280)
			// 		}else{
			// 			this.loadStatus = 'nomore';
			// 		}
			// 	}
			// }
		},
		async onPullDownRefresh() {
			await this.getKonwLedge() //专题
			await this.getBanner() //banner
			await this.search()
			uni.stopPullDownRefresh();
		},
		methods: {
			async getLoginData(hospital_id) {
				console.log('this.role_id111111', this.role_id)
				let data = {}
				if (this.role_id == 2 && hospital_id) {
					data.hospital_id = hospital_id
				} else {
					data.hospital_id = await this.getHospitalId() //用户的医院id
				}
				this.$request({
					url: '/ApiV2/Mobile/Tourists/diyPage',
					method: 'get',
					data
				}).then(({ data }) => {
					this.$store.commit('savehome_title', data.home_title || '发现')
					this.title = data.home_title || '发现'
				})
			},
			// 获取微信code
			getLoginCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						onlyAuthorize: true,
						success: (res) => {
							resolve(res.code)
						},
						fail: (err) => {
							reject(err)
						}
					})
				})
			},
			//获取医院id
			async getHospitalId() {
				const code = await this.getLoginCode()
				return new Promise((resolve, reject) => {
					let data = {
						code
					}
					this.$request({
						url: '/ApiV2/Mobile/Tourists/hospital',
						method: 'get',
						data
					}).then(({ data }) => {
						console.log('data', data)
						resolve(data.hospital_id)
					})
				})
			},
			fullscreenchange(val) {
				this.fullScreen = val
			},
			async play(id) {
				console.log(1111, id)
				this.fullScreen = true
				await this.$nextTick()
				this.$refs.playVideo.play(id)
			},
			getScene_id() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/User/sharePage',
						// loading: true,
						// errMsg: true,
						method: 'get'
					}).then(({ data }) => {
						this.scene_id = data.scene_id
						resolve()
					})
				})
			},
			submitInviterId(scene) {
				if (!uni.getStorageSync('inviterId')) return
				this.$request({
					url: '/ApiV2/Mobile/Bind/bindByScene',
					data: {
						scene_id: scene
					}
				}).then((res) => {
					console.log('提交成功小程序码传进来的参数: ', res)
				})
			},
			beforeSwitch() {
				const page = getCurrentPages()
				let pages = `/${page[page.length - 1]?.route ?? ''}`
				uni.setStorageSync('recordRoute', pages)
				return true
			},
			fixed() {
				console.log('吸顶了')
			},
			unfixed() {
				console.log('没吸顶')
			},
			tagClick(index) {
				this.topics.splice(index, 1)
				this.search()
			},
			bannerJump(index) {
				if (this.bannerList?.knowledge_banner[index].appid === 'action') {
					if (this.bannerList?.knowledge_banner[index].action === 'VIDEO') {
						this.play(this.bannerList?.knowledge_banner[index].action_param)
					} else if (this.bannerList?.knowledge_banner[index].action === 'ARTICLE') {
						this.gotoArticleDetail({ id: this.bannerList?.knowledge_banner[index].action_param })
					} else if (this.bannerList?.knowledge_banner[index].action === 'PIC') {
						uni.navigateTo({
							url: '/pages/home/poster/poster?poster=' + this.bannerList?.knowledge_banner[index]
								.action_param,
						})
					}
				} else {
					let url = this.bannerList?.knowledge_banner[index]?.url
					console.log(index)
					console.log(url)
					uni.navigateTo({
						url,
					})
				}
			},
			getBanner() {
				return new Promise((resolve, reject) => {
					let data = {}
					if (uni.getStorageSync('hospitalId') && this.role_id == 2) data.hospital_id = uni
						.getStorageSync('hospitalId')
					this.$request({
						url: '/ApiV3/Mobile/Index/banner',
						method: 'get',
						data
					}).then(({
						data
					}) => {
						this.bannerList = data
						resolve()
					})
				})
			},
			getKonwLedge() {
				return new Promise((resolve, reject) => {
					let params = {}
					if (uni.getStorageSync('hospitalId') && this.role_id == 2) params.hospital_id = uni
						.getStorageSync('hospitalId')
					this.$request({
						url: '/ApiV3/Mobile/Knowledge/index',
						method: 'get',
						data: params
					}).then(({
						data
					}) => {
						this.knowledge = data.types
						resolve()
					})
				})
			},
			async search() {
				this.vpage = 1
				this.apage = 1
				if (this.current === 0) {
					await this.getVideoList()
				} else {
					await this.getArticleList()
				}
				this.loading = false
				return
			},
			async loadmoreData() {
				if (this.current === 0) {
					this.vpage++
					await this.getVideoList()
				} else {
					this.apage++
					await this.getArticleList()
				}
				this.loading = false
				return
			},
			getVideoList() { //获取视频列表
				return new Promise((resolve, reject) => {
					let data = {
						page: this.vpage,
						title: this.keyword,
						topics: this.topics.map(v => v.id).join(','),
					}
					if (this.role_id == 2) data.hospital_id = uni.getStorageSync('hospitalId') || 0
					this.$request({
						url: '/ApiV3/Mobile/Knowledge/videos',
						method: 'get',
						data
					}).then(async ({
						data
					}) => {
						if (this.vpage === 1) {
							this.flowList = data.data
						} else {
							this.flowList = [...this.flowList, ...data.data]
						}
						this.vlength = data.next_page_url
						this.videoHeight()
						// this.per_page = data.per_page
						resolve()
					})
				})
			},
			getArticleList() { //获取推文列表
				return new Promise((resolve, reject) => {
					let data = {
						page: this.apage,
						title: this.keyword,
						topics: this.topics.map(v => v.id).join(','),
					}
					if (this.role_id == 2) data.hospital_id = uni.getStorageSync('hospitalId') || 0
					this.$request({
						url: '/ApiV3/Mobile/Knowledge/articles',
						method: 'get',
						data
					}).then(async ({
						data
					}) => {
						if (this.apage === 1) {
							this.articleList = data.data
						} else {
							this.articleList = [...this.articleList, ...data.data]
						}
						this.alength = data.next_page_url
						// this.swiperHeight = this.articleHeight()
						resolve()
					})
				})
			},
			gotoArticleDetail(item) {
				uni.navigateTo({
					url: '/pages/search/articleDetail?id=' + item.id
				})
			},
			//计算短视频内容高度
			videoHeight() {
				return new Promise((resolve, reject) => {
					uni.createSelectorQuery().in(this).select('.swiper1').boundingClientRect(res => {
						// console.log(1111, res)
						this.swiperHeight = res.height < (uni.upx2px(1100) && !this.flowList.length) ? uni
							.upx2px(1100) : res.height
						resolve()
					}).exec()
				})
			},
			//计算推文内容高度
			articleHeight() {
				return new Promise((resolve, reject) => {
					uni.createSelectorQuery().in(this).select('.swiper2').boundingClientRect(res => {
						// console.log(1111, res)
						this.swiperHeight = res.height < (uni.upx2px(1100) && !this.articleList.length) ?
							uni.upx2px(1100) : res.height
						resolve()
					}).exec()
				})
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.current = index
				console.log(this.current)
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			// transition(e) {
			// 	this.page = 1
			// 	let dx = e.detail.dx;
			// 	this.$refs.uTabs.setDx(dx);
			// },
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			async animationfinish(e) {
				let current = e.detail.current;
				this.current = current;
				// this.apage = 1
				// this.vpage = 1
				console.log('手指滑动结束', e)
				//预设一个高度
				// this.swiperHeight = uni.upx2px(1100)
				// if(!this.token) return
				uni.pageScrollTo({
					scrollTop: 0
				})
				if (current === 0) {
					if (!this.flowList.length && this.vpage === 1) {
						await this.getVideoList()
					}
					this.videoHeight()
				} else {
					if (!this.articleList[0].title && this.apage === 1) {
						await this.getArticleList()
						uni.pageScrollTo({
							scrollTop: 0
						})
					}
					// this.articleList = []
					// await this.getArticleList()
					this.articleHeight()
				}
			},
			// 去登陆
			jumpLogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			},
			setKeyWord(keyword, topic) {
				this.keyword = keyword
				if (topic) this.topics = [{ ...topic, show: true }]
				this.search()
			},
			// 通用跳转
			jump({
				url = '',
				data = {},
				type = ''
			} = {}, id) {
				console.log(url)
				this.$common.jump({
					url,
					data,
					that: this
				})
			}
		},
		components: {
			myButton,
			customVideo,
			playVideo
		}
	}
</script>
<style lang="scss">
	page {
		// background-color: #f7f7f7;
	}

	.container {
		min-height: 100vh;
		// padding: 20rpx 32rpx;
		background: #FAFAFA;

		.special_box {

			// margin: 16rpx 0;
			// display: flex;
			// justify-content: space-between;
			// overflow-x: scroll;
			// white-space: nowrap;
			image {
				height: 170rpx;
				width: 334rpx;
			}

			image:first-child {
				margin-right: 16rpx;
			}
		}

		::v-deep .swiper-item {
			height: auto !important;
			min-height: 1100rpx;
		}

		.swiper-item-right {
			display: flex;
			// margin: 32rpx;
			// margin-top:16rpx;
			border-bottom: 1px solid #F3F3F3;
			padding: 16rpx;

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
	}
</style>