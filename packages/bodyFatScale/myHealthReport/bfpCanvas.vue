<template>
	<view>
		<!-- <view class="fcanvas" v-if="ifShow" @click="changeIfShow" @longpress="saveCanvas"> -->
		<view class="fcanvas" @click="changeIfShow" @longpress="saveCanvas">

			<canvas type="2d" canvas-id="myCanvas" id="myCanvas" style="width: 750rpx;height: 1618rpx;" />
		</view>
		<u-modal v-model="modalshow" mask-close-able :show-confirm-button="false" :show-title="false" width="382">
			<view class=" u-flex-column"
				style="width: 382rpx; height:140rpx;background: rgba(0,0,0,0.5);justify-content: space-evenly;">
				<!-- <template v-if="imgLoading">
					<u-loading style="text-align: center;display: block;" color="#00B8A2" size="48" mode="circle"></u-loading>
					<view style="color: #fff;text-align: center;">生成海报中...</view>
				</template> -->
				<template>
					<u-icon style="text-align: center;display: block;" size="48" color="#00B8A2"
						name="checkmark-circle"></u-icon>
					<view style="color: #fff;text-align: center;">已成功保存到本地相册</view>
				</template>

			</view>
		</u-modal>
	</view>

</template>
<script>
	export default {

		data: function() {
			return {
				scene_id: '',
				modalshow: false,
				canvasPath: '',
				canvas: null,
				posterData: {},
				bg: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/bfp.jpg",
				upIcon: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/poster/up-icon.png",
				downIcon: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/poster/down-icon.png",
				mini_code: "",
			}
		},

		async onLoad(option) {
			this.posterData = JSON.parse(decodeURIComponent(option.posterData)) 
			console.log(111,this.posterData )
			
			await this.getmini_code()
			this.draw()
		},
		// async onShareAppMessage() {
		// 	if (uni.getStorageSync('token')) await this.getScene_id()
		// 	// if (!uni.getStorageSync('token')) {
		// 	//   return this.$common.toast('请先登陆')
		// 	// }
		// 	return {
		// 		title: '分享报告',
		// 		path: `/packages/bodyFatScale/myHealthReport/bfp?id=${this.id}&scene_id=${this.scene_id}&userId=${this.user_id}`,
				
		// 	}
		// },
		methods: {
			getScene_id() {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/User/sharePage',
						// loading: true,
						// errMsg: true,
						method: 'get'
					}).then(({
						data
					}) => {
						this.scene_id = data.scene_id
						resolve()
					})
				})
			},
			getmini_code() {
				return new Promise((resolve, reject) => {
					let data = {
						page:'packages/bodyFatScale/myHealthReport/bfp',
						is_hyaline:true,
						scene:{
							id:this.posterData.id
						}
					}
					if (this.posterData.user_id) data.scene.user_id = this.posterData.user_id
					this.$request({
						url: '/ApiV3/Mobile/Index/miniCode',
						data
					}).then(res => {
						this.mini_code = res.data.mini_code
						resolve()
					})
				})

			},

			changeIfShow() {
				//触发一个更新事件

				this.$emit("update:ifShow", false);
				console.log("隐藏canvas");
			},
			//获取数组中字符串长度最长的元素
			findLongestString(array) {
				let longestString = '';

				for (let i = 0; i < array.length; i++) {
					if (typeof array[i] === 'string' && array[i].length > longestString.length) {
						longestString = array[i];
					}
				}

				return longestString;
			},
			async draw() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				let that = this
				const system = uni.getSystemInfoSync()
				const pxScale = 750 / system.windowWidth
				const width = 750;
				const height = 1618;
				const {
					avatar,
					nickname,
					created_at,
					list
				} = this.posterData
				//新版canvas
				const ctx = await (() => {
					return new Promise((resolve, reject) => {
						wx.createSelectorQuery()
						.in(this)
						.select('#myCanvas') // 在 WXML 中填入的 id
						.fields({
							node: true,
							size: true
						})
						.exec(async (res) => {
							// Canvas 对象
							this.canvas = res[0].node;
							const canvas = res[0].node;
							console.log("this.canvas", this.canvas);
							// Canvas 画布的实际绘制宽高
							const renderWidth = res[0].width;
							const renderHeight = res[0].height;
							// Canvas 绘制上下文
							const ctx = canvas.getContext("2d");


							// 初始化画布大小
							const dpr = wx.getWindowInfo().pixelRatio;
							console.log(wx.getWindowInfo());
							canvas.width = renderWidth * dpr;
							canvas.height = renderHeight * dpr;
							// console.log(canvas.width)
							// console.log(canvas.height)
							ctx.scale(dpr, dpr);
							resolve(ctx)

						})
					})
				})()
				const loadImage = async (src) => {
					const img = await this.getImageInfo(src)
					return {
						img,
						x: 0,
						y: 0,
						w: img.width,
						h: img.height
					}
				}

				const [mainPic, avatarImg, upIconImg, downIconImg, miniCodeImg] = await Promise.all([
					loadImage(this.bg),
					loadImage(avatar || 'https://dev-gp.oss-accelerate.aliyuncs.com/default_avatar.jpg'),
					loadImage(this.upIcon),
					loadImage(this.downIcon),
					loadImage(this.mini_code)
				])
				const promiseImg = (imgCtx, x, y, xw, xy, x1, y1, xpxScale, ypxScale, imgSrc) => {
					imgCtx.src = imgSrc;
					return new Promise((resolve, reject) => {
						imgCtx.onload = () => {

							ctx.drawImage(imgCtx, x, y, xw, xy, x1, y1, xpxScale, ypxScale);
							// console.log(imgSrc);
							resolve();
						};
					});
				};
				
				await promiseImg(this.canvas.createImage(), 0, 0, mainPic.w, mainPic.h, 0, 0, width / pxScale, height / pxScale,
					mainPic.img.path)
				

				//绘制头像
				ctx.save()
				ctx.arc(69 / pxScale + 61 / pxScale / 2, 69 / pxScale + 61 / pxScale / 2, 61 / pxScale / 2,
					0, 2 * Math.PI)
				ctx.clip()

				await promiseImg(this.canvas.createImage(), 0, 0, avatarImg.w, avatarImg.h, 69 / pxScale, 69 /
					pxScale, 69 / pxScale, 69 / pxScale, avatarImg.img.path)

				
				ctx.restore()
				ctx.save()
				ctx.beginPath()

				const drawText = ({
					text,
					x,
					y,
					fontSize,
					color,
					align = 'left'
				}) => {

					ctx.font = `${fontSize/pxScale}px Arial`;
					ctx.fillStyle = color;
					ctx.textAlign = align;
					ctx.textBaseline = 'bottom'
					ctx.fillText(text, x / pxScale, y / pxScale);
				}
				drawText({
					text: nickname.substr(0, 20),
					x: 180,
					y: 114,
					fontSize: 28,
					color: '#082723'
				})
				drawText({
					text: created_at.split(' ')[0],
					x: 148,
					y: 389,
					fontSize: 28,
					color: '#00B8A2'
				})
				drawText({
					text: created_at.split(' ')[1],
					x: 750-200,
					y: 389,
					fontSize: 28,
					color: '#00B8A2',
					align:'right'
				})
				// drawText({
				// 	text: day,
				// 	x: 750 / 2,
				// 	y: 480,
				// 	fontSize: 31,
				// 	color: '#00B8A2',
				// 	align: 'center'
				// })
				// drawText({
				// 	text: start_at.substr(11, 17),
				// 	x: 190,
				// 	y: 415,
				// 	fontSize: 21,
				// 	color: '#B2B2B2'
				// })
				// drawText({
				// 	text: end_at.substr(11, 17),
				// 	x: 750-190,
				// 	y: 415,
				// 	fontSize: 21,
				// 	color: '#B2B2B2',
				// 	align:'right'
				// })
				let sy = 445;
				
				

				for (const index in list) {
					const item = list[index]
					sy += 109
					drawText({
						text: parseFloat(item.data),
						x: 90,
						y: sy,
						fontSize: 28,
						color: '#4B4B4B'
					})

					drawText({
						text: item.info.levels[item.info.level].title || '',
						x: 628,
						y: sy ,
						fontSize: 28,
						color: item.info.levels[item.info.level].color,
						align: 'center'
					})
					

				}
				uni.hideLoading()
				await promiseImg(this.canvas.createImage(), 0, 0, miniCodeImg.w, miniCodeImg.h, 160 / pxScale,
					1420 / pxScale, 120 / pxScale, 120 / pxScale, miniCodeImg.img.path)
				
				uni.canvasToTempFilePath({
					canvas: this.canvas,
					success: ({
						tempFilePath
					}) => {
						that.canvasPath = tempFilePath
						console.log(tempFilePath);
					},
					fail(err) {
						console.log('err', err);
					}
				});


			},
			getImageInfo(image) {
				return new Promise((req, rej) => {
					uni.getImageInfo({
						src: image,
						success: function(res) {
							req(res)
						},
						fail: function(res) {
							console.log('fail', res)
						}
					});
				})
			},
			saveCanvas() {

				let that = this
				uni.showModal({
					title: "温馨提示",
					content: "确定将图片保存到本地？",
					// showCancel: false,
					cancelText: "取消",
					confirmText: "确定",
					success: (res) => {
						if (res.confirm) {
							console.log("用户点击确定");
							// H5不支持uni.saveImageToPhotosAlbum
							uni.saveImageToPhotosAlbum({
								filePath: that.canvasPath,
								success: function() {
									console.log("save success");
									that.modalshow = true
									setTimeout(() => {
										that.modalshow = false
									}, 2000)
								},
								complete() {

								}
							});
						} else if (res.cancel) {
							console.log("用户点击取消");

						}
					},
					fail: () => {},
					complete: () => {

					},
				});
			},

		}

	}
</script>
<style lang="scss" scoped>
	.fcanvas {
		// position: fixed;
		// z-index: 99;
		// top: 0;
		// right: 0;
		position: relative;
		z-index: 1
	}
</style>