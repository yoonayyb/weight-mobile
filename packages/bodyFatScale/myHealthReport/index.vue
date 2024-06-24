<template>
	<view class="my-health-report">
		<view class="canvas-top">
			<image :src="`${imgUrl}weight-canvas.png`" class="u-absolute" mode="widthFix"
				style="width:420rpx;top: 16rpx;" />
			<my-canvas :percent="percent" inactive-color="#FFF" active-color="#4BCCBC" :width="canvasWidth">



				<view  class='u-progress-info text-bold u-line-1'>{{parseFloat(info.weight)}} <text
						class="u-font-22 text-bold u-p-t-14 u-m-l-8"> kg</text> </view>

			</my-canvas>
			<view class="u-font-24rpx u-m-t-24" style="color: #C2C2C2;">{{createdTime}}</view>
		</view>
		<view v-if="bfp != 0" class="share-bg u-absolute" style="top: 0;position: absolute">
			<view @click="jump" class="share-img u-flex u-font-24">
				<image :src="`${imgUrl}v3_commodity_icon_share.png`" mode="widthFix" class="u-m-r-6" /> 分享
				<!-- <button open-type="share" class="share-btn u-abso">分享</button> -->
			</view>
		</view>
		<!-- <view class="heal-wrap bg-white u-p-30">
			<view class="_flex">
				<view class="u-font-16 text-bold">当前体重（kg）</view>
				<view class="u-font-12">{{ info.updated_at }}</view>
			</view>
			<view class="heal-w-text text-bold u-m-t-24 u-m-b-42">{{ info.weight }}</view>
			<view class="heal-line-wrap u-flex">
				<view class="heal-line u-flex-1 u-rela" v-for="(item, i) in info.weight_info.levels" :key="i"
					:style="{ background: item.color }">
					<p v-if="item.active"
						:style="{ background: item.color, left: info.weight_info.scale + '% !important;' }"
						class="u-abso point"></p>
					
					<view class="u-abso">{{ item.title }}</view>
				</view>
			</view>
		</view> -->
		<!-- 未达标 -->
		<view v-if="bfp != 0" class="weight-title">未达标 <text style="color:#FF7569">{{ setData(1).length}}</text>项</view>
		<view class="heal-list-wrap bg-white">

			<view class="heal-list-box">
				<block v-for="(item, i) in setData(1)" :key="i">
					<view class="u-flex-column">
						<view class="heal-list _flex" :style="{ background:  '#fff' }" @click="collapseShow(1,i)"
							v-if="bfp == 0 ? i < 2 : true">
							<view class="u-flex u-flex-items-center">
								<image :src="item.icon" mode="" class="img-left u-m-r-20" />
								<view class="u-flex-column u-m-l-4 u-flex-between">
									<text class="u-font-28" style="color:#C2C2C2">{{ item.title }}</text>
									<text class="u-font-28 text-bold">{{ item.data }}</text>
								</view>

							</view>
							<view class="heal-list-r u-flex u-flex-items-baseline">
								<text class="u-font-28">{{item.info.levels[item.info.level].title}}</text>
								<u-icon class="u-m-l-8" v-if="!item.show" name="arrow-down"></u-icon>
								<u-icon class="u-m-l-8" v-else name="arrow-up"></u-icon>
							</view>
						</view>
						<view class="box-detail" v-if="item.show">
							<detail :detailId="id" :field="item.field" :info="info" :userId="userId"></detail>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view v-if="bfp != 0" class="weight-title">已达标 <text>{{ setData(2).length}}</text>项</view>
		<view class="heal-list-wrap bg-white">

			<view class="heal-list-box">
				<block v-for="(item, i) in setData(2)" :key="i">
					<view class="u-flex-column">
						<view class="heal-list _flex" :style="{ background:  '#fff' }" @click="collapseShow(2,i)"
							v-if="bfp == 0 ? i < 2 : true">
							<view class="u-flex u-flex-items-center">
								<image :src="item.icon" mode="" class="img-left u-m-r-20" />
								<view class="u-flex-column u-m-l-4 u-flex-between">
									<text class="u-font-28" style="color:#C2C2C2">{{ item.title }}</text>
									<text class="u-font-28 text-bold">{{ item.data }}</text>
								</view>

							</view>
							<view class="heal-list-r u-flex u-flex-items-baseline">
								<text class="u-font-28">{{item.info.levels[item.info.level].title}}</text>
								<u-icon class="u-m-l-8" v-if="!item.show" name="arrow-down"></u-icon>
								<u-icon class="u-m-l-8" v-else name="arrow-up"></u-icon>
							</view>
						</view>
						<view class="box-detail" v-if="item.show">
							<detail :detailId="id" :field="item.field" :info="info" :userId="userId"></detail>
						</view>
					</view>
				</block>
			</view>
		</view>
		<view class="w_nodata u-flex-column" v-if="bfp == 0">
			<view class="u-flex u-flex-items-start u-m-b-32 ">
				<image :src="`${imgUrl}health-dange.png`" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" />
				<view style="flex:1">请确保测量时赤脚、身体正对显示屏以直立姿势站在秤面上，双脚与秤面电极充分接触。</view>
			</view>
			<view class="u-flex u-flex-items-start ">
				<image :src="`${imgUrl}health-dange.png`" style="width: 32rpx;height: 32rpx;margin-right: 8rpx;" />
				<view style="flex:1">请确保测量时脚底洁净，秤面洁净、无金属异物或水渍。脚底与秤面之间有异物可能导致体脂秤阻抗异常而无法计算出体脂率。</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		bodyFatClass,
		colorArr,
		colorList
	} from '@/utils/consts'
	import myButton from '@/components/myButton.vue'
	import myCanvas from './canvas.vue'
	import detail from './components/detail.vue'
	export default {
		components: {
			myButton,
			myCanvas,
			detail
		},
		computed: {
			setData() {
				return function(type) {
					let standard = []
					let nostandard = []


					this.initDataList.forEach(res => {
						if(!res.info){
							nostandard.push(res)
						}else{
							if ((res.field === 'weight' || res.field === 'bmi' || res.field === 'bmr' || res
									.field === 'smkg' || res.field === 'protein')  && res.info.level !== 1) {
								nostandard.push(res)
							} else if ((res.field === 'bfp' || res.field === 'water') && res.info.level !== 1 &&
								res.info.level !== 2) {
								nostandard.push(res)
							} else if (res.field === 'vfal' && res.info.level !== 0) {
								nostandard.push(res)
							} else {
								standard.push(res)
							}
						}
						
					})
					if (type === 1) {
						return nostandard
					} else {
						return standard
					}

				}

			}
		},
		data() {
			return {
				createdTime:'',
				userId: '',
				bodyFatClass,
				canvasWidth: 340,
				percent: 0,
				initDataList: [],
				colorArr,
				colorList,
				info: {weight:0},
				timer: '',
				weight: '',
				resistance: '',
				weightData: '',
				advertisData: '',
				id: '',
				bfp: 0 // 体脂率 为0时表示没有电阻
			}
		},

		async onLoad(e) {
			if (e.data) this.weightData = JSON.parse(e.data)
			
			this.userId =  this.$store.state.user.userInfo.id
			if(e.userId) this.userId = e.userId
			console.log('e',e)
			console.log('this.userId',this.userId)
			this.createdTime = e.time || this.$common.formatDate(new Date(),false,true)
			await this.initList()
			if (e.data) this.getData(1)
			if (e.id) {
				this.id = e.id
				this.getData(2)
			}
		},
		// onShareAppMessage() {
		// 	return {
		// 		title: '我的健康数据',
		// 		path: '/packages/bodyFatScale/myHealthReport/index'
		// 	}
		// },
		methods: {
			jump() {


				uni.navigateTo({
					url: `/packages/bodyFatScale/myHealthReport/share?id=${this.id}&userId=${this.userId}&time=${this.createdTime}`
				})
			},
			collapseShow(num, i) {
				this.setData(num)[i].show = !this.setData(num)[i].show
				this.$forceUpdate()
				// this.$set(item,'show',!item.show)
				console.log(this.setData(num)[i].show)
			},
			setBackground() {},
			getData(type) {
				let params = {}
				if (type == 1) {
					params = {
						url: '/ApiV3/Mobile/BodyFatScaleWolai/save',
						data: {
							...this.weightData
						},
						loading: true,
						errMsg: true
					}
				}
				if (type == 2) {
					params = {
						url: '/ApiV3/Mobile/BodyFatScaleWolai/detail',
						data: {
							id: this.id
						},
						loading: true,
						method: 'GET',
						errMsg: true
					}
					if (this.userId && this.userId !== 'undefined') params.data.user_id = this.userId
				}
				this.$request(params).then((res) => {
					let {
						data
					} = res
					console.log(11111,data)
					this.info = data
					this.id = this.info.id
					this.percent = data.weight_scale

					this.bfp = parseFloat(this.info.bfp || 0)
					let a = parseFloat(data.weight)
					this.info.weight_info.range.push(a)
					let range = this.info.weight_info.range.map((res) => +res).sort()
					
					let arr = [{
							data: data.weight,
							field: 'weight',
							show: false,
							info: data.weight_info
						},
						{
							data: data.bmi,
							field: 'bmi',
							show: false,
							info: data.bmi_info
						},
						{
							data: data.bfp,
							field: 'bfp',
							show: false,
							info: data.bfp_info
						},
						// {
						//   data: data.muscle,
						//   field: 'muscle',
						//   info: data.muscle_info
						// },
						// {
						//   data: data.musclekg,
						//   field: 'musclekg',
						//   info: data.musclekg_info
						// },
						{
							data: data.vfal,
							field: 'vfal',
							show: false,
							info: data.vfal_info
						},
						{
							data: data.water,
							field: 'water',
							show: false,
							info: data.water_info
						},
						{
							data: data.bmr,
							field: 'bmr',
							show: false,
							info: data.bmr_info
						},
						// {
						//   data: data.bone,
						//   field: 'bone',
						//   info: data.bone_info
						// },
						{
							data: data.smkg,
							field: 'smkg',
							show: false,
							info: data.smkg_info
						},
						{
							data: data.protein,
							field: 'protein',
							show: false,
							info: data.protein_info
						}
						// {
						//   data: data.leanbodymass,
						//   field: 'leanbodymass',
						//   info: data.leanbodymass_info
						// },
						// {
						//   data: data.age,
						//   field: 'age',
						//   info: data.age_info
						// }
					]
					this.initDataList.forEach((item, i) => {
						item.data = arr[i].data
						item.field = arr[i].field
						item.info = arr[i].info
					})
					this.initDataList = this.initDataList.filter(v=>v.field !== 'vfal' && v.field !== 'bfp' && v.field !== 'water')
				})
			},
			initList() {
				
				return new Promise((resolve) => {
					this.bodyFatClass.forEach((item, i) => {
						this.initDataList.push({
							icon: `${this.imgUrl}icon-heal-${item.field}.png`,
							title: item.title,
							data: '',
							show: false,
						})
					})
					setTimeout(() => {
						resolve()
					}, 100)
				})
			},
			
		}
	}
</script>
<style lang="scss">
	page {
		background: #f7f7f7;
	}
</style>
<style lang="scss" scoped>
	.u-progress-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}



	.u-progress-info {
		font-size: 62rpx;
		text-align: center;
		width: 280rpx;
		// display: flex;
		// flex-wrap: wrap;
		// justify-content: center;
		// align-items: center;
	}

	.my-health-report {
		padding-bottom: 100rpx;

		.canvas-top {
			background: #fff;
			padding: 24rpx 34rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-end;
			min-height: 320rpx;

		}

		.weight-title {
			margin: 32rpx 24rpx;
			font-size: 32rpx;
			font-weight: bold;

		}

		.point {
			border-radius: 50%;
			width: 36rpx;
			height: 36rpx;
			background: rgb(111, 190, 215);
			left: 50% !important;
			top: 50% !important;
			transform: translate(-50%, -50%) !important;
		}

		color: #4a4a4a;

		.share-bg {
			width: 100%;
			height: 180rpx;
			// background-color: #00b8a2;
			position: relative;

			.share-img {
				position: absolute;
				top: 30rpx;
				right: 30rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				.share-btn {
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}

		.heal-wrap {
			width: 690rpx;
			margin: auto;
			margin-top: -80rpx;
			padding-bottom: 120rpx !important;
			border-radius: 20rpx;
			position: relative;
			z-index: 1;

			.heal-w-text {
				font-size: 80rpx;
				line-height: 112rpx;
			}

			.heal-line-wrap {
				.heal-line {
					width: 100%;
					height: 16rpx;
					margin-right: 4rpx;

					&:nth-child(1) {
						border-radius: 16rpx 0 0 16rpx;
					}

					&:last-child {
						border-radius: 0 16rpx 16rpx 0;
						margin-right: 0;
					}

					image {
						width: 44rpx;
						height: auto;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}

					>view {
						position: absolute;
						top: 50rpx;
						left: 50%;
						transform: translateX(-50%);
					}
				}
			}
		}

		.heal-list-wrap {
			width: 690rpx;
			margin: 20rpx auto 20rpx;
			border-radius: 20rpx;
			overflow: hidden;

			.heal-list-t {
				padding: 40rpx 30rpx;

				._text {
					font-size: 52rpx;
				}
			}

			.heal-list-box {
				.box-detail {
					padding: 0 24rpx;
					font-size: 24rpx;
				}

				.heal-list {
					padding: 36rpx 24rpx;

					.img-left {
						width: 72rpx;
						height: 72rpx;
					}

					.img-right {
						width: 12rpx;
						height: auto;
					}

					.heal-list-r {
						._btn {
							margin: 0 16rpx 0 30rpx;
						}
					}
				}
			}
		}

		.w_nodata {
			// margin: 160rpx auto;
			color: #C2C2C2;
			font-size: 24rpx;
			padding: 0 48rpx;
		}
	}
</style>
