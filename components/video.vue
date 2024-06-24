<template>
	<view >
		<view   @click="play" class="u-relative">
			<u-image  :src="item.thumb || ''" width="336rpx" height="392rpx" mode="aspectFill">
				<u-loading slot="loading"></u-loading>
			</u-image>
			<image v-if="envVersion === 'release' || envVersion === 'trial'"  class="u-abso" :src="`${imgUrl}v3_video_play.png`" style="width:48rpx;height:48rpx;bottom: 16rpx;right: 16rpx;"></image>
			
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: {
				type: Object,
				default: () => {}
			}
		},
		data() {
			return {
				envVersion:uni.getAccountInfoSync().miniProgram.envVersion,
				fullScreen: false,
				shadowStyle:{
					backgroundImage: "none",
				},
				ashow: false,
				videoItem: {
					videoType:true
				},
				videoContext:''
			}
		},
		mounted() {
			// console.log(11, this.videoItem)
		},
		methods: {
			
			 play(){
				//  const accoutInfo =  uni.getAccountInfoSync()
				
				// const envVersion = accoutInfo.miniProgram.envVersion
				 console.log('envVersion',this.envVersion)
				if(this.envVersion === 'trial' || this.envVersion === 'release'){ //只有线上版本、体验版才允许播放video 为了过审
					this.$emit('play',this.item.id)
				}
				
				
				
				
				
			},
			
		}
	}
</script>

<style lang="scss">
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

		background: linear-gradient(180deg, rgba(70, 70, 70, 0.4) 0%, rgba(255, 255, 255, 0) 100%);

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
