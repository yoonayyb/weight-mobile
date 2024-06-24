<template>
	<view class="container">
		<view  v-if="flowList.length">
			<view class="u-flex u-flex-wrap">
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
			<view style="position: fixed;bottom:60rpx;left: 50%;transform: translate(-50%);width: 256rpx;" @click="gotoPush" class="btn">发布视频</view>
		</view>
		<view v-else class="u-flex-column u-flex-items-center" style="transform: translate(0, 100%);">
			<image style="width: 200rpx;height: 200rpx;" :src="`${imgUrl}v3_empty_video.png`" mode=""></image>
			<view style="color:#C2C2C2;padding:16rpx 0">暂无发布作品</view>
			<view @click="gotoPush" class="btn">去发布</view>
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
				page:1,
				length:0,
				flowList: []
					
			}
		},
		components: {
			customVideo,
			playVideo
		},
		onShow() {
			//先执行一次off 否则多次执行
			uni.$off('updateVideo')
			uni.$once('updateVideo',()=>{
				this.page = 1
				this.getMyVideo()
			})
		},
		async onPullDownRefresh(){
			this.page = 1
			await this.getMyVideo()
			uni.stopPullDownRefresh();
		},
		onLoad(){
			this.page = 1
			this.getMyVideo()
		},
		onReachBottom() {
		console.log('底部')
			if(this.length){
				this.page++
				this.getMyVideo()
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
			getMyVideo(){//获取视频列表
				return new Promise((resolve,reject)=>{
					this.$request({
						url:'/ApiV3/Mobile/StaffKnowledge/videos',
						method:'get',
						data:{
							page:this.page,
							
						}
					}).then(({data})=>{
						
						if(this.page === 1){
							this.flowList = []
							setTimeout(()=>{
								this.flowList =this.$u.deepClone(data.data);
								
							},50)
							
							
						}else{
							this.flowList = [...this.flowList,...data.data]
							
						}
						
						
						this.length =  data.next_page_url
						resolve()
					})
				})
			},
			
			
			gotoPush() {
				let that = this
				uni.chooseMedia({
					count: 1,
					mediaType: ['video'],
					sourceType: ['album', 'camera'],
					maxDuration: 30,
					camera: 'back',
					success(res) {
						console.log('tempFiles', res.tempFiles)
						
						let path = res.tempFiles[0].tempFilePath
						let size = res.tempFiles[0].size / 1024 /1024
						console.log('size', size)
						if(size >= 50) return that.$common.toast('视频不能超出50M,请重新上传')
						uni.navigateTo({
							url: '/pages/search/push?tempFiles=' + encodeURIComponent(path)
						})
					},
					fail(err) {
					 uni.showModal({
							content: err,
							showCancel: false
						})
					}
				})


			}
		}
	}
</script>

<style lang="scss">
	.container {
		min-height: 100vh;
		background-color: #FAFAFA;

		.btn {
			background: #00B8A2;
			border-radius: 40rpx;
			color: white;
			display: flex;
			align-items: center;
			justify-content: center;
			width: 164rpx;
			height: 72rpx;

		}
	}
</style>
