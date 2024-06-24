<template>
	<view class="container" @click="show">
		<view class="wrap">
			<view class="wrap_box" v-for="(item,index) in imgList" @click="open(item)" :key="item.url">
				<image :src="`${imgUrl+item.url}`"  :style="index === 2?'width:104rpx;height:104rpx':''"></image>
				<div>{{item.name}}</div>
			</view>
		</view>
		<view class="u-flex-xy-center u-absolute" style="bottom:100rpx;width: 100%;">
			<image @click.stop="back" :src="`${imgUrl}v3_record_close.png`" style="width: 56rpx;height: 56rpx;" mode="">
			</image>
		</view>
		
		<recordPopup1 ref="recordPopup1"></recordPopup1>
		<u-popup v-model="popshow" mode="center" border-radius="24" width="638rpx" height="288rpx">
			<view class="u-flex-column u-flex-items-center u-flex-around" style="height: 100%;">
				<view class="u-font-32 text-bold">您还未完善个人信息</view>
				<view class="u-font-32 ">请先完善信息再进行操作</view>
				<view class="u-flex-y-center u-flex-around" style="width: 100%;">
					<my-button width="208" height="72" color="#00B8A2" bg="#FFFFFF"
						@click="popshow = false">取消</my-button>
					<my-button width="208" height="72"
						@click="gotoWrite('/pages/mine/invite/updatePersonalInfo')">去完善</my-button>
				</view>
			</view>
		</u-popup>
		<!-- <u-tabbar active-color="#00B8A2" inactive-color="#C2C2C2" height="120rpx" icon-size="60rpx" :list="list"> 
		</u-tabbar>-->
	</view>
</template>

<script>
	import recordPopup1 from '@/components/recordPopup1.vue'

	import myButton from '@/components/myButton.vue'

	export default {
		data() {
			return {
				popshow: false,
				imgList: [{
						url: 'record_icon_weight@2x.png',
						name: '体重'
					},
					{
						url: 'record_icon_water@2x.png',
						name: '喝水'
					},
					{
						url: 'record_icon_dinner@6x.png',
						name: '饮食'
					},
					{
						url: 'record_icon_sport@2x.png',
						name: '运动'
					},
					{
						url: 'record_icon_ketone@2x.png',
						name: '尿酮'
					},
					{
						url: 'record_icon_glu@2x.png',
						name: '血糖'
					},
					{
						url: 'record_icon_bp@2x.png',
						name: '血压'
					},
					{
						url: 'record_icon_feeling@2x.png',
						name: '记感受'
					},
					{
						url: 'record_icon_girth@4x.png',
						name: '体围'
					},
					// {
					// 	url: 'record_icon_waistline@2x.png',
					// 	name: '腰围'
					// },
					// {
					// 	url: 'record_icon_hipline@2x.png',
					// 	name: '臀围'
					// },
				],
				list: this.$store.state.tabbar.list,
			}
		},
		components: {
			recordPopup1,
			myButton
		},

		methods: {

			back() {
				let url = uni.getStorageSync('recordRoute')

				console.log(111, url)
				if (url) {
					uni.switchTab({
						url
					})
				} else {
					uni.switchTab({
						url: '/pages/tabbar/diary'
					})
				}
			},
			show() {

				if (this.$store.state.user.userInfo.should_update) {
					return this.popshow = true
				}
			},
			gotoWrite(url) {

				this.popshow = false
				uni.navigateTo({
					url
				})
			},
			open(item) {
				if (this.$store.state.user.userInfo.should_update) {
					return this.popshow = true
				}
				if (item.name === '饮食') {
					return uni.navigateTo({
						url: '/pages/newHome/index?name=热量',

					})
				}
				if (item.name === '运动') {
					return uni.navigateTo({
						url: '/pages/newHome/nutrition/addFood?name=运动&activeDate=' + this.$common.formatDate(
							new Date(), false),

					})
				}
				if (item.name === '记感受') {
					return uni.navigateTo({
						url: '/pages/newHome/index?name=感受',

					})
				}
				let name = item.name === '喝水' ? '喝水量' : item.name
				this.$refs.recordPopup1.open({
					name
				})



			},

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
	}

	.disabled {
		color: #C2C2C2;
	}

	.fade_out {
		animation: point 0.5s;
		animation-iteration-count: infinite;
		animation-direction: alternate
	}

	@keyframes point {
		from {
			border-bottom-color: #00B8A2;
		}

		to {
			border-bottom-color: #F3F3F3;

		}
	}

	.popup_blood {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32rpx 46rpx;

		&_time {
			font-size: 28rpx;
			background-color: #fafafa;
			border-radius: 20rpx;
			padding: 14rpx 32rpx;
			width: 316rpx;
			text-align: center;
		}

		&_title {
			font-size: 32rpx;
			font-weight: bold;
			margin: 32rpx 0;
			width: 100%;
			text-align: start;
		}

		&_redio {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			padding: 0 96rpx;
			width: 100%;

			.active {
				background-color: #00B8A2;
				color: #ffffff;
			}

			&_item {
				font-size: 28rpx;
				text-align: center;
				padding: 10rpx 0;
				width: 216rpx;
				margin: 16rpx 0;
				border-radius: 30rpx;
				background-color: #f5f7f9;
				color: #c2c2c2;
			}
		}

		&_mmol {
			margin: 32rpx 0;
			width: 100%;
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
			color: #00B8A2;
		}
	}

	.active {
		background: #00B8A2 !important;
		color: white !important;
	}

	.popPupTime {
		display: flex;
		align-items: baseline;
		font-size: 72rpx;
		font-weight: bold;
		color: #00B8A2;

		text {
			text-align: center;
		}

	}

	.ketone_box {
		width: 160rpx;
		background: #F3F3F3;
		padding: 8rpx 0rpx;
		margin: 24rpx 8rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.wrap {
		position: absolute;
		bottom: 200rpx;
		display: flex;
		flex-wrap: wrap;
		padding: 28rpx;
		font-size: 24rpx;
		color: #2A2A2A;

		.wrap_box {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin: 20rpx 30rpx;
		}

		image {
			width: 112rpx;
			height: 112rpx;

		}

	}
</style>