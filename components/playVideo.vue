<template>
	<view class="video_page" >
		 <sunny-video  ref="sunnyvideo" @fullscreenchange="fullscreenchange"></sunny-video>
		 
		<!-- <video  object-fit="contain"  @fullscreenchange="fullscreenchange" :direction="direction"
			:show-center-play-btn="false" @error="videoError" enable-play-gesture id="myVideo"
			style="width:336rpx;height:392rpx" :src="videoItem.url">

			<view v-if="fullScreen" class="animate__animated video_cover safe-area-inset-bottom"
				:class="{animate__fadeInUp:fullScreen}" style="color:#ffffff">

				<view class="u-flex u-font-28" style="line-height: 1;">
					<u-avatar :src="videoItem.author && videoItem.author.avatar" size="96"></u-avatar>
					<view class="u-flex-column u-m-l-10" style="line-height: 2;">
						<view class="u-line-1" style="max-width: 400rpx;">{{videoItem.author && videoItem.author.realname}}
							<text class="u-m-l-10">
								{{videoItem.author && videoItem.author.titles}}</text> </view>
						<text class="u-line-1"
							style="font-size: 24rpx; max-width: 500rpx;">{{videoItem.author && videoItem.author.hospital_title}}</text>
					</view>
					<view @click="flo" class="button u-m-l-20" :class="{followBtn:videoItem.is_follow}">
						{{videoItem.is_follow?'已关注':'关注'}}
					</view>

				</view>
			
				<text class="u-font-24" @click="gotoSearch(item)"  style="display: inline-block;color:#ffffff;margin-right:16rpx;margin-bottom:16rpx" v-for="(item,index) of videoItem.topics" :key="index">{{'#'+item.title+'#'}}</text>
				<view class="video_text">
					<u-read-more text-indent="0" close-text="展开" color="#C2C2C2" :shadow-style="shadowStyle" show-height="100" ref="uReadMore" toggle>
						<rich-text :nodes="videoItem.title"></rich-text>
					</u-read-more>
					

				</view>
				<view class="u-flex-end u-flex-y-center u-relative">

					<view @click="createLikes" class="animate__animated u-relative"
						style="top: 0;transform: translateX(100%);opacity: 0;" hover-class="fadeOutUp">
						<image name="thumb-fill" style="width: 48rpx;height:48rpx"
							:src="videoItem.thumb ? `${imgUrl}v3_thumb.png`:`${imgUrl}v3_thumb1.png`" mode=""></image>
					</view>
					<view>
						<image name="thumb-fill" style="width: 48rpx;height:48rpx"
							:src="videoItem.is_star ? `${imgUrl}v3_thumb1.png`:`${imgUrl}v3_thumb.png`" mode=""></image>
					</view>


					<text> {{videoItem.star_count}}</text>
				</view>
			</view>
		</video> -->
		
	</view>
</template>

<script>
	export default {
		props: {
			
		},
		data() {
			return {
				envVersion:'release',
				direction:0,
				id:'',
				fullScreen: false,
				shadowStyle:{
					backgroundImage: "none",
				},
				ashow: false,
				
				videoItem: {
					
				},
				videoContext:''
			}
		},
		mounted() {
			// console.log(11, this.videoItem)
			const accoutInfo =  uni.getAccountInfoSync()
			console.log('accoutInfo',accoutInfo)
			this.envVersion = accoutInfo.miniProgram.envVersion
		},
		methods: {
			
			gotoSearch(item){
				let data = JSON.stringify(item)
				uni.reLaunch({
					url:'/pages/tabbar/diary?data='+data+ '&current=0'
					
				})
			},
			 play(id){
			// 	this.id = id
			// 	if(!this.videoContext){
			// 		this.videoContext = uni.createVideoContext("myVideo", this);
			// 	}
			// 	this.videoContext.requestFullScreen()	
			
			// 	this.fullscreenchange()
				if(this.envVersion === 'trial' || this.envVersion === 'release'){
					this.$refs.sunnyvideo.play(id)
				}
				
			},
			//关注
			flo() {
				let url = this.videoItem.is_follow ? '/ApiV3/Mobile/Knowledge/unFollow' : '/ApiV3/Mobile/Knowledge/follow'
				this.$request({
					url,
					loading: true,
					data: {
						staff_id: this.videoItem.staff_id
					}
				}).then(({
					data
				}) => {
					this.videoItem.is_follow = !this.videoItem.is_follow

				})

			},
			fullscreenchange(e) {

				// this.ashow = false

				// this.fullScreen = e.detail.fullScreen
				
				// console.log('视频进入全屏',this.fullScreen)
				// if (this.fullScreen) {
				// 	this.$request({
				// 		url: '/ApiV3/Mobile/Knowledge/videoDetail',
				// 		method: 'get',
				// 		data: {
				// 			id: this.id
				// 		}
				// 	}).then(async ({
				// 		data
				// 	}) => {
				// 		this.videoItem = data
				// 		console.log('视频详情', this.videoItem)
				// 		this.$nextTick(() => {
				// 			this.$refs.uReadMore.init();
				// 		})
						
						
				// 		setTimeout(()=>{
							
				// 			this.videoContext.play()
				// 		},200)
						
						
				// 	})
				// }else{
					
				// }
				this.$emit('fullscreenchange',e)
			},
			videoError(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			createLikes() {

				// this.$emit('createLikes',this.videoItem)
				this.$request({
					url: '/ApiV3/Mobile/Knowledge/videoStar',
					loading: true,
					data: {
						id: this.videoItem.id,
						action: this.videoItem.is_star ? 'UNSTAR' : 'STAR'
					}
				}).then(({
					data
				}) => {
					this.videoItem.is_star = !this.videoItem.is_star
					this.videoItem.is_star ? this.videoItem.star_count++ : this.videoItem.star_count--
				})

			},
		}
	}
</script>

<style lang="scss">
	.video_page{
		
	}
	.animate__animated {

		animation-duration: 1s;

		animation-duration: 1s;

		animation-fill-mode: both;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;

			transform: translate3d(0, 100%, 0);
		}

		to {
			opacity: 1;

			transform: translate3d(0, 0, 0);
		}
	}

	.animate__fadeInUp {

		animation-name: fadeInUp;
	}

	@keyframes fadeOutUp {
		from {
			opacity: 1;
		}

		to {
			opacity: 0;
			transform: translate3d(0, -100%, 0);
		}
	}

	.fadeOutUp {

		animation-name: fadeOutUp;
	}

	@keyframes backOutUp {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		20% {
			transform: translateY(0px) scale(0.7);
			opacity: 0.7;
		}

		100% {
			transform: translateY(-700px) scale(0.7);
			opacity: 0.7;
		}
	}

	.backOutUp {
		animation-name: backOutUp;
	}

	.video_cover {


		position: absolute;
		line-height: 1;
		bottom: 100rpx;
		width: 100%;
		// height: 100%;
		box-sizing: border-box;
		padding: 32rpx;

		background: linear-gradient(rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 1) 100%);

		// background-color:  rgba(72, 72, 72, 0.4);
		.button {
			top: 20rpx;
			right: 32rpx;
			background-color: #00B8A2;
			color: white;
			font-size: 24rpx;
			width: 120rpx;
			height: 48rpx;
			border-radius: 40rpx;

			display: flex;
			align-items: center;
			justify-content: center;
		}

		.followBtn {
			background-color: transparent;
			border: 1px solid #FFF;
		}






		.video_text {
			color: #FFF;
			line-height: 1.3;
			display: flex;
			width: 100%;

			.line-clamp-content {
				max-height: 1.5em;
				line-height: 1.5;
				overflow: hidden;
				text-overflow: ellipsis;
				text-align: justify;
				position: relative;
			}

			.line-clamp-content::before {
				content: '';
				width: 0;
				float: right;
				height: calc(100% - 1.5em + 1px);
			}

			.line-clamp-content::after {
				content: '';
				position: absolute;
				width: 200vw;
				height: 100vh;
				// box-shadow: inset -100vw calc(1.5em - 100vh) 0 0 #fff;
				margin-left: -100vw;
			}



			.line-clamp-btn {
				float: right;
				// background-color: rgb(136, 110, 160);

				border-radius: 0.2em;
				padding: 0 0.2em;
				clear: both;
			}

			.line-clamp-btn>span {
				color: #C2C2C2;

			}

			.inherit {
				max-height: inherit;
			}

			.line-clamp-btn-open {
				margin-left: 1.3em;
				transform: translate(0, -1px);
				position: relative;
				cursor: pointer;
			}

			.line-clamp-btn-open::before {
				content: '...';
				transform: translate(-1.3em, 0);
				position: absolute;
			}

			.zzz {
				display: inline-block !important;
				float: none;
				z-index: 1000;
				position: relative;
				color: #C2C2C2;
			}

			.activeHide {
				display: none;
			}


		}
	}
</style>
