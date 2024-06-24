<template>
	<view class="topic_item_container u-flex border_b" @click.stop="handleClick">
		<image :src="item.thumb" mode="aspectFill"></image>
		<view class="topic_info">
			<text class="u-line-1" style="width: 500rpx;">{{item.title}}</text>
			<text>{{item.totalFormat|totalFormat}}人讨论 {{item.total_reading|totalFormat}}人围观</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			item: { //当前数据项
				default: {},
				type: Object
			}
		},
		methods: {
			// 点击事件
			handleClick() {
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.topic_item_container {
		padding: 20upx 30upx;

		>image {
			margin-right: 20upx;
			border-radius: 6upx;
			width: 140upx;
			height: 90upx;
		}

		.topic_info {
			height: 80upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			text {
				&:nth-child(1) {
					font-weight: 700;
				}

				&:nth-child(2) {
					font-size: 24upx;
					color: #888888;
				}
			}
		}
	}
</style>
