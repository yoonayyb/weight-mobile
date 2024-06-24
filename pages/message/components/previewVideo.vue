<template>
	<view class="preview_viewo_template" v-if="show">
		<video :src="url" autoplay page-gesture controls></video>
		<view class="close_video u-flex" @click="close">
			<u-icon name="close" size="40" color="#ffffff"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
			};
		},
		props: {
			// 视频的url
			url: {
				type: String,
				default: '',
			},
			// 用于v-model
			value: {
				type: Boolean,
				default: false,
			}
		},
		watch: {
			value(val) {
				if (val) {
					this.show = true
				} else {
					this.show = false
				}
			}
		},
		mounted() {
			this.value && this.open()
		},
		methods: {
			open() {
				this.show = true
			},
			close() {
				this.$emit('input', false)
			}
		}
	}
</script>

<style lang="scss">
	.preview_viewo_template {
		position: fixed;
		padding-top: 100upx;
		top: 0;
		left: 0;
		width: 100vw;
		height: 120vh;
		background: #000000;

		video {
			width: 100vw;
			height: calc(100vh - 240upx);
		}

		.close_video {
			position: fixed;
			bottom: 20upx;
			left: 50%;
			transform: translate(-50%);
			justify-content: center;
			width: 100upx;
			height: 100upx;
			color: #FFFFFF;
		}
	}
</style>
