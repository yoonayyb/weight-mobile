<template>
	<view class="u-flex-x-center u-flex-items-end u-relative" style="width: 100vw;">
		<view class="u-m-r-40 u-flex-column u-flex-items-center">
			<view class="u-font-32 u-flex u-flex-items-start" :class="{'u-flex-items-end':Number(left) }"
				style="font-weight: bold;">{{ setValue(left)}} <text
					style="color:#C2C2C2;font-weight: normal;font-size: 24rpx;margin-left: 8rpx;">kg</text> </view>
			<view>目标体重</view>
		</view>
		<canvas :style="{width: width, height: height}" type="2d" canvas-id="circlefCanvas" id="circlefCanvas"></canvas>
		<view class="u-absolute weightbox u-m-b-40 u-flex u-flex-column">
			<view class="u-font-20">BMI</view>
			<view class="u-font-24" style="color: #00B8A2;">{{bmi}}</view>

		</view>
		<view class="u-m-l-40 u-flex-column u-flex-items-center">
			<!-- 没登陆、没有目标体重、没有完善体重信息 -->
			<template v-if="!token || Number(right)> 0 || !weight ">
				<view  class="u-font-32 u-flex u-flex-items-start" :class="{'u-flex-items-end':Number(left)}"
					style="font-weight: bold;">
					 {{ Number(left)? (Math.abs(right) || '--')  : '--' }}
					<text style="color:#C2C2C2;font-weight: normal;font-size: 24rpx;margin-left: 8rpx;">kg</text>

				</view>
				<view>距离目标</view>
			</template>
			<view v-else>目标达成</view>
		</view>
		<!-- <view  class="u-m-l-40 u-flex-column u-flex-items-center">
			<view class="u-font-32 u-flex u-flex-items-start" :class="{'u-flex-items-end':Number(left)}" style="font-weight: bold;">
			{{  Math.abs(right) || '--' }} 
			<text style="color:#C2C2C2;font-weight: normal;font-size: 24rpx;margin-left: 8rpx;">kg</text>
			 </view>
			<view>{{ Number(right)>= 0 && token ?'超出目标': '距离目标'}}</view>
		</view> -->
	</view>


</template>



<script>
	/**
	 * 注意该init只能同步执行，异步执行canvas会错乱 ---bug未修复
	 * 1.初始化的时候   
	 *   1.1区分有无token的时候执行一次  
	 *   1.2有token的时候weight为0也执行一次（没有完善体重信息的时候）
	 * 
	 */
	export default {
		data() {
			return {
				token: '',
				width: '51.2vw',
				height: '25.6vw',
				right: 0,//判断是否达成目标体重 当前体重-目标体重>0?'距离目标'：'目标达成'


			}
		},
		props: {
			bmi: {
				type: String | Number,
				default: '--',
			},
			//目标体重
			left: {
				type: String | Number,
				default: 0,
			},
			//百分比的值 用来画圆
			value: {
				type: String | Number,
				default: 0,
			},
			//当前体重 用来算是否达标
			weight: {
				type: String | Number,
				default: 0,
			},
			diaryAllData: {
				type: Object,
				default: () => {},
			}
		},
		watch: {
			weight: {
				handler(val) {
					console.log('handler diaryAllData', val)
					console.log('this.$store.state.user.userInfo.should_update', this.$store.state.user.userInfo
						.should_update)
					if(!uni.getStorageSync('token')){
						console.log('没登录的时候')
						this.init()
					}else if(this.$store.state.user.userInfo.should_update){
						console.log('登陆了，没完善体重的时候')
						this.init()
					}else if(val > 0){
						console.log('体重变化')
						this.init()
					}
				},
				immediate:true
			},
			left(val) {

				this.token = uni.getStorageSync('token')

				this.right = parseFloat((Number(this.weight || 0) - Number(this.left)).toFixed(2)) || 0
				console.log('监听left', this.right)
			}
		},
		mounted() {
			this.token = uni.getStorageSync('token')
		},
		methods: {
			setValue() {
				let flag = '--'
				if (Number(this.left)) {
					flag = parseFloat(Number(this.left).toFixed(2))
				}

				return flag
			},
			biSize(coordinate) {
				let v = 375 / this.canvasWidth; //375是设计稿的大小，得到的v值是：设计稿和设备宽度的比例关系，也可理解成在设计稿的大小基础上放大或缩小的倍数
				return coordinate / v; //返回的是当前坐标值或者大小与v的比例
			},
			// #ifndef MP-WEIXIN
			// #endif
			init() {

				/**
				 * 环形进度条
				 * arc(x, y, r, startAngle, endAngle, anticlockwise):
				 * 以(x, y) 为圆心，以r 为半径，90°代表0.5 * PI
				 * 从 startAngle 弧度开始到endAngle弧度结束。
				 * anticlosewise 是布尔值，true 表示逆时针，false 表示顺时针(默认是顺时针
				 */

				const query = uni.createSelectorQuery().in(this);
				let canvasWidth = 0
				let canvasHeight = 0

				query.select('#circlefCanvas').boundingClientRect(data => {

					canvasHeight = data.height
					canvasWidth = data.width * 1 // 0.256
					const circleProgressbar = async (value) => {
						let copyValue = Number(value) ? Number(value) : 0
						copyValue = copyValue < 0 ? 0 : copyValue >= 100 ? 100 : copyValue
						let val = parseFloat((copyValue / 100).toFixed(2))

						uni.createSelectorQuery().in(this).select('#circlefCanvas').fields({
							node: true,
							size: true
						}).exec((res) => {
							console.log(2222, res)

							// Canvas 对象
							const canvas = res[0].node
							// Canvas 画布的实际绘制宽高
							const renderWidth = res[0].width
							const renderHeight = res[0].height
							// Canvas 绘制上下文
							const ctx = canvas.getContext('2d')
							// 初始化画布大小
							const dpr = wx.getWindowInfo().pixelRatio
							canvas.width = renderWidth * dpr
							canvas.height = renderHeight * dpr
							ctx.scale(dpr, dpr)

							// ctx.save()
							let that = this

							try {
								uni.getImageInfo({
									src: `${that.imgUrl}half-circle.png`,
									success(res) {
										console.log('image0000', res.path)
										// ctx.translate(data.width* 0.2,0)

										const image = canvas.createImage()
										image.onload = () => {
											ctx.drawImage(
												image,
												0,
												0,
												canvasWidth * 1,
												canvasHeight * 1,
											)
										}
										image.src = res.path



										ctx.restore()
										//进度

										ctx.beginPath()
										let pointUrl = 'blue_point.png'
										if (Number(that.weight)) {


											const cgrd = ctx.createLinearGradient(0, 0,
												canvasWidth - 10, 0)

											// console.log('val',val)
											if (val >= 0 && val <= 0.1515) {
												pointUrl = 'blue_point.png'
												cgrd.addColorStop(0, '#ffffff')
												cgrd.addColorStop(0.15, '#76D1FF')
											} else if (val > 0.1515 && val <= 0.4242) {
												pointUrl = 'green_point.png'
												cgrd.addColorStop(0, '#ffffff')
												cgrd.addColorStop(0.41, '#70DBAC')
											} else if (val > 0.4242 && val <= 0.5454) {
												pointUrl = 'yellow_point.png'
												cgrd.addColorStop(0, '#ffffff')
												cgrd.addColorStop(0.54, '#FFE476')
											} else if (val > 0.5454 && val <= 0.8484) {
												pointUrl = 'orige_point.png'
												cgrd.addColorStop(0, '#ffffff')
												cgrd.addColorStop(0.84, '#FC775E')
											} else {
												cgrd.addColorStop(0, '#ffffff')
												cgrd.addColorStop(0.9, '#C62900')
												pointUrl = 'red_point.png'
											}
											ctx.strokeStyle = cgrd
											// ctx.setStrokeStyle(cgrd)
											ctx.lineCap = 'round'
											ctx.arc(canvasWidth / 2, canvasHeight - 4,
												canvasWidth / 2.8, Math.PI, Math.PI * (
													1 + val))
											// ctx.stroke();
										}




										let bi = canvasWidth / uni.upx2px(384)
										// console.log('bibibi',bi)
										// ctx.setLineWidth(7 * bi)
										ctx.lineWidth = 7 * bi
										ctx.stroke()
										ctx.closePath()

										let img11 = ''
										ctx.restore()
										uni.getImageInfo({
											src: `${that.imgUrl+pointUrl}`,
											success(res) {
												img11 = res.path


												//旋转角度，以弧度计 degrees * Math.PI/180；degrees 范围为 0-360
												let degrees = 0
												let cval = 0
												let cos = 0
												// let transDegY = -(canvasWidth-(-3*bi) ) // 
												// let transDegX = -(4*bi) // 

												if (val < 0.5 && val >= 0) {
													degrees = 180 + 180 * (0.5 +
														val)
													cval = 180 * val
													cos = canvasWidth / 2.8 -
														Number(Math.cos(cval * Math
														.PI / 180).toFixed(
															2)) * canvasWidth / 2.8
													// transDegY = -(canvasWidth/3 + 15)

												} else if (val == 0.5) {
													degrees = 0
													cval = 180 * val
													cos = canvasWidth / 2.8
													// transDegY = -(canvasWidth/3 + 15)
													// transDegX = -25

												} else {
													degrees = 180 * (val - 0.5)
													cval = 180 * (1 - val)
													cos = Number(Math.cos(cval *
																Math.PI / 180)
														.toFixed(2)) *
														canvasWidth / 2.8 +
														canvasWidth / 2.8
													// transDegY = -(canvasWidth/3 + 15)
													// transDegX = -25

												}
												//指针平移y距离
												let h = canvasHeight
												let th = canvasWidth / 2.8 * Math
												.sin(cval * Math.PI / 180)
												let ch = h - th

												//指针平移x距离
												let w = canvasWidth / 2 -
													canvasWidth / 2.8 //圆环之间距离

												let cw = w + cos








												if (Number(that.weight)) {

													// ctx.drawImage(img11, 0, 0,res.width*0.5*bi,res.height*0.5*bi)

													const image1 = canvas
													.createImage()
													image1.onload = () => {

														ctx.translate(cw, ch)
														ctx.rotate((degrees) *
															Math.PI / 180)
														let yh = -res.height *
															0.5 * bi + 7 * bi /
															2
														if (val >= 0 && val <
															0.5) {

															ctx.translate(0,
																yh)
														} else if (val ==
															0.5) {

															ctx.translate(0, -
																res
															.height *
															0.5 * bi)
														} else if (val > 0.5 &&
															val <= 0.7) {
															ctx.translate(-5, -
																res
															.height *
															0.5 * bi)

														} else if (val > 0.7 &&
															val <= 0.8) {
															ctx.translate(-8,
																yh)

														} else {
															ctx.translate(-res
															.width / 2,
															yh)
														}

														ctx.drawImage(
															image1,
															0,
															0,
															res.width *
															0.5 * bi,
															res.height *
															0.5 * bi,
														)

													}
													image1.src = img11

												}

											}
										})

									},
									fail(e) {
										console.log('报错', e)

									}
								})
							} catch (e) {
								//TODO handle the exception
								console.log('哪里错了', e)

							}

						})

					}

					this.right = parseFloat((Number(this.weight || 0) - Number(this.left)).toFixed(2)) || 0
					console.log('this.right', this.right)
					circleProgressbar(this.value)


				}).exec();
			},
		}
	}
</script>
<style scoped lang="scss">
	.weightbox {
		width: 230rpx;
		left: 50%;
		transform: translateX(-50%);
		bottom: 12rpx;
	}
</style>