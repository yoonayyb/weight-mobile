<template>
	<view class="container">
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: '',
			};
		},
		onLoad(option) {
			const {
				type
			} = option
			if (type == 1) {
				uni.setNavigationBarTitle({
					title: '用户协议'
				})
			} else if (type == 2) {
				uni.setNavigationBarTitle({
					title: '隐私政策'
				})
			}
			this.getContent(type)
		},
		methods: {
			getContent(type) {
				this.$axios({
					url: '/api/user_agreement',
					errMsg: true,
					loading: true,
					data: {
						type
					}
				}).then(res => {
					this.content = res.data
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding: 20upx;
	}
</style>
