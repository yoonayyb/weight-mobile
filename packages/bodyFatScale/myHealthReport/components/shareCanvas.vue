<template>
	<view class="fcanvas" v-if="ifShow" @click="changeIfShow">



		<canvas type="2d" canvas-id="myCanvas" id="myCanvas"
			:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }" />

	</view>

</template>
<script>
	export default {
		name: "shareCanvas",
		props: {
			ifShow: {
				type: Boolean,
				default: false,
			}
		},



		data: function() {

			return {
				canvasWidth: uni.upx2px(750), //图片宽度
				canvasHeight: uni.upx2px(650), //图片高度
				scene_id: '',
				modalshow: false,
				canvasPath: '',
				canvas: null,
				posterData: {},
				type: 1,
				u:"https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_body_compare_u.png",
				d:"https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_body_compare_d.png",
				bg: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/compareShare.jpg",
				upIcon: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/poster/up-icon.png",
				downIcon: "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/poster/down-icon.png",
				mini_code: "",
			}
		},

		async onLoad(option) {
			// this.posterData = JSON.parse(decodeURIComponent(option.posterData)) 
			// console.log(111,this.posterData )

			// await this.getmini_code()
			// this.draw()

		},


		methods: {

			setCanvasPath() {
				return new Promise((resolve, reject) => {
					uni.canvasToTempFilePath({
						canvasId: 'myCanvas',

						success: ({
							tempFilePath
						}) => {

							resolve(tempFilePath)
							console.log('tempFilePath', tempFilePath);
						},
						fail(e) {
							console.log('setCanvasPatheeee', e);
						}
					}, this.canvas);
				})

			},

			async init(posterData, type = 1) { //type 1对比报告 2.数据报告
				this.type = type
				this.bg = type === 1 ? "https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/compareShare.jpg" :
					"https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/dataShare.jpg"
				this.posterData = posterData
				console.log(111, this.posterData)
				this.canvasHeight = uni.upx2px(650)
				this.canvasWidth = uni.upx2px(750)
				if (type === 1) {
					// await this.getmini_code()
					this.draw()
				} else {
					// await this.getmini_code1()
					this.draw1()



				}


			},
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
						id_A: this.posterData.id_A,
						id_B: this.posterData.id_B,
					}
					if (this.posterData.user_id) data.user_id = this.posterData.user_id
					this.$request({
						url: '/ApiV3/Mobile/BodyFatScaleWolai/miniCode',
						method: 'get',
						data
					}).then(res => {
						this.mini_code = res.data.mini_code
						resolve()
					})
				})

			},
			getmini_code1() {
				return new Promise((resolve, reject) => {
					let data = {
						page: 'packages/bodyFatScale/myHealthReport/bfp',
						is_hyaline: true,
						scene: {
							id: this.posterData.id
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
				
				let that = this
				const system = uni.getSystemInfoSync()
				const pxScale = 750 / system.windowWidth
				const width = 750;
				const height = 675;
				const {
					avatar,
					nickname,
					start_at,
					end_at,
					day,
					list
				} = this.posterData
				// const ctx = uni.createCanvasContext('myCanvas', this)
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
							console.log("renderWidth", renderWidth);
							console.log("renderHeight", renderHeight);
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
				let drawText = ({
					text,
					x,
					y,
					fontSize,
					color,
					align = 'left'
				}) => {
					// ctx.setFontSize(uni.upx2px(fontSize))
					// ctx.setFillStyle(color)
					// ctx.setTextAlign(align)
					
					// ctx.fillText(text, uni.upx2px(x), uni.upx2px(y))
					ctx.font = `${uni.upx2px(fontSize)}px Arial`;
					ctx.fillStyle = color;
					ctx.textAlign = align;
					ctx.fillText(text, uni.upx2px(x), uni.upx2px(y))
				
				}
				
					const [mainPic, avatarImg,upIconImg,downIconImg,u,d] = await Promise.all([
						loadImage(this.bg),
						loadImage(avatar || 'https://dev-gp.oss-accelerate.aliyuncs.com/default_avatar.jpg'),
						loadImage(this.upIcon),
						loadImage(this.downIcon),
						loadImage(this.u),
						loadImage(this.d),
					])
					const promiseImg = (imgCtx, x, y, xw, xy, imgSrc) => {
						imgCtx.src = imgSrc;
						return new Promise((resolve, reject) => {
							imgCtx.onload = () => {
					
								ctx.drawImage(imgCtx, x, y, xw, xy);
								// console.log(imgSrc);
								resolve();
							};
						});
					};
					
					// ctx.drawImage(mainPic.img.path, 0, 0, mainPic.w, mainPic.h, 0, 0, width / pxScale, height /
					// 	pxScale);
				
					await promiseImg(this.canvas.createImage(), 0, 0, uni.upx2px(750), uni.upx2px(675), mainPic.img.path)
				
					//绘制头像
					ctx.save()
					ctx.arc(uni.upx2px(154), uni.upx2px(350), uni.upx2px(50), 0, 2 * Math.PI)
					
					ctx.clip()
					
					await promiseImg(this.canvas.createImage(),uni.upx2px(154) - uni.upx2px(50), uni.upx2px(350) - uni.upx2px(50), uni.upx2px(100), uni.upx2px(100), avatarImg.img.path)
				
				
					ctx.restore()
					ctx.save()
					ctx.beginPath()
				
				drawText({
					text: nickname.substr(0, 20),
					x: 80,
					y: 250,
					fontSize: 21,
					color: '#082723'
				})
				drawText({
					text: day,
					x: 560,
					y: 250,
					fontSize: 32,
					color: '#00B8A2'
				})
				drawText({
					text: start_at,
					x: 100,
					y: 478,
					fontSize: 21,
					color: '#B2B2B2'
				})
				drawText({
					text: end_at,
					x: 450,
					y: 478,
					fontSize: 21,
					color: '#B2B2B2',
				})
				drawText({
					text: parseFloat(list.weight[2]),
					x: 510,
					y: 325,
					fontSize: 40,
					color: '#fff'
				})
				drawText({
					text: parseFloat(list.bfp[2]),
					x: 510,
					y: 410,
					fontSize: 40,
					color: '#fff'
				})
				drawText({
					text: list.weight[0],
					x: 330,
					y: 585,
					fontSize: 28,
					color: '#4B4B4B',
				})
				drawText({
					text: list.weight[1],
					x: 430,
					y: 585,
					fontSize: 28,
					color: '#4B4B4B',
				})
				
				const valueNumber = Number(list.weight[2])
				let iconImg = null
				let uiconImg = null
				let diconImg = null
				let color = '#4B4B4B'
				if (valueNumber > 0) {
					iconImg = upIconImg
					uiconImg = u
					color = '#FF8F2D'
				} else if (valueNumber < 0) {
					iconImg = downIconImg
					color = '#00B8A2'
					diconImg = d
				}
				if (iconImg) {
					await promiseImg(this.canvas.createImage(), uni.upx2px(650), uni.upx2px(545), uni.upx2px(48), uni.upx2px(48),iconImg.img.path)
					// ctx.drawImage(iconImg.img.path, uni.upx2px(650),uni.upx2px(545),uni.upx2px(48),uni.upx2px(48));
					
				}
				//体重差判断
				if(uiconImg){
					await promiseImg(this.canvas.createImage(), uni.upx2px(650), uni.upx2px(290), uni.upx2px(48), uni.upx2px(48),uiconImg.img.path)
					// ctx.drawImage(uiconImg.img.path, uni.upx2px(630),uni.upx2px(290),uni.upx2px(48),uni.upx2px(48));
				}
				if(diconImg){
					await promiseImg(this.canvas.createImage(), uni.upx2px(650), uni.upx2px(290), uni.upx2px(48), uni.upx2px(48),diconImg.img.path)
					// ctx.drawImage(diconImg.img.path, uni.upx2px(630),uni.upx2px(290),uni.upx2px(48),uni.upx2px(48));
				}
				//体脂率差判断
				const valueNumber1 = Number(list.bfp[2])
				 uiconImg = null
				 diconImg = null
				if (valueNumber1 > 0) {
					
					uiconImg = u
					
				} else if (valueNumber1 < 0) {
					
					diconImg = d
				}
				if(uiconImg){
					await promiseImg(this.canvas.createImage(), uni.upx2px(630), uni.upx2px(375), uni.upx2px(48), uni.upx2px(48), uiconImg.img.path)
					// ctx.drawImage(uiconImg.img.path, uni.upx2px(630),uni.upx2px(375),uni.upx2px(48),uni.upx2px(48));
				}
				if(diconImg){
					await promiseImg(this.canvas.createImage(), uni.upx2px(630), uni.upx2px(375), uni.upx2px(48), uni.upx2px(48),diconImg.img.path)
					// ctx.drawImage(diconImg.img.path, uni.upx2px(630),uni.upx2px(375),uni.upx2px(48),uni.upx2px(48));
				}
				drawText({
					text: list.weight[2],
					x: 560,
					y: 585,
					fontSize: 28,
					color
				})
					uni.canvasToTempFilePath({
						canvas: this.canvas,
				
						success: ({
							tempFilePath
						}) => {
				
							this.$emit('tempFilePath', tempFilePath)
							console.log('tempFilePath', tempFilePath);
						},
						fail(e) {
							console.log('setCanvasPatheeee', e);
						}
					}, this);
				// 绘制完成后将 canvas 转换为临时文件路径
				// ctx.draw(false, () => {
				// 	console.log('draw')
				// 	uni.canvasToTempFilePath({
				// 		canvasId: 'myCanvas',
				
				// 		success: ({
				// 			tempFilePath
				// 		}) => {
				
				// 			this.$emit('tempFilePath', tempFilePath)
				// 			console.log('tempFilePath', tempFilePath);
				// 		},
				// 		fail(e) {
				// 			console.log('setCanvasPatheeee', e);
				// 		}
				// 	}, this);
				// });


			},
			async draw1() {

				let that = this
				const system = uni.getSystemInfoSync()
				const pxScale = 750 / system.windowWidth
				const width = 750;
				const height = 675;
				const {
					avatar,
					nickname,
					created_at,
					list
				} = this.posterData
				// const ctx = uni.createCanvasContext('myCanvas', this)
				
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
							console.log("renderWidth", renderWidth);
							console.log("renderHeight", renderHeight);
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
				let drawText = ({
					text,
					x,
					y,
					fontSize,
					color,
					align = 'left'
				}) => {
					// ctx.setFontSize(uni.upx2px(fontSize))
					// ctx.setFillStyle(color)
					// ctx.setTextAlign(align)
					
					// ctx.fillText(text, uni.upx2px(x), uni.upx2px(y))
					ctx.font = `${uni.upx2px(fontSize)}px Arial`;
					ctx.fillStyle = color;
					ctx.textAlign = align;
					ctx.fillText(text, uni.upx2px(x), uni.upx2px(y))

				}
				
					const [mainPic, avatarImg, miniCodeImg] = await Promise.all([
						loadImage(this.bg),
						loadImage(avatar),
					])
					const promiseImg = (imgCtx, x, y, xw, xy, imgSrc) => {
						imgCtx.src = imgSrc;
						return new Promise((resolve, reject) => {
							imgCtx.onload = () => {
					
								ctx.drawImage(imgCtx, x, y, xw, xy);
								// console.log(imgSrc);
								resolve();
							};
						});
					};
					
					
									
					await promiseImg(this.canvas.createImage(), 0, 0, uni.upx2px(750), uni.upx2px(675), mainPic.img.path)
									
					//绘制头像
					ctx.save()
					ctx.arc(uni.upx2px(154), uni.upx2px(350), uni.upx2px(50), 0, 2 * Math.PI)
					
					ctx.clip()
					
					await promiseImg(this.canvas.createImage(),uni.upx2px(154) - uni.upx2px(50), uni.upx2px(350) - uni.upx2px(50), uni.upx2px(100), uni.upx2px(100), avatarImg.img.path)
									
									
					ctx.restore()
					ctx.save()
					ctx.beginPath()
					
					drawText({
						text: nickname.substr(0, 20),
						x: 80,
						y: 250,
						fontSize: 21,
						color: '#082723'
					})
					drawText({
						text: created_at,
						x: 480,
						y: 250,
						fontSize: 20,
						color: '#9B9B9B'
					})
					
					
					drawText({
						text: parseFloat(list[0].data),
						x: 510,
						y: 325,
						fontSize: 40,
						color: '#fff'
					})
					drawText({
						text: parseFloat(list[2].data),
						x: 510,
						y: 405,
						fontSize: 40,
						color: '#fff'
					})
					drawText({
						text: parseFloat(list[0].data),
						x: 400,
						y: 580,
						fontSize: 28,
						color: '#2A2A2A'
					})
					drawText({
						text: list[0].info.levels[list[0].info.level].title,
						x: 580,
						y: 580,
						fontSize: 28,
						color: list[0].info.levels[list[0].info.level].color
					})
					uni.canvasToTempFilePath({
						canvas: this.canvas,
									
						success: ({
							tempFilePath
						}) => {
									
							this.$emit('tempFilePath', tempFilePath)
							console.log('tempFilePath', tempFilePath);
						},
						fail(e) {
							console.log('setCanvasPatheeee', e);
						}
					}, this);
					// 绘制完成后将 canvas 转换为临时文件路径
					// ctx.draw(false, () => {
					// 	console.log('draw')
					// 	uni.canvasToTempFilePath({
					// 		canvasId: 'myCanvas',

					// 		success: ({
					// 			tempFilePath
					// 		}) => {

					// 			this.$emit('tempFilePath', tempFilePath)
					// 			console.log('tempFilePath', tempFilePath);
					// 		},
					// 		fail(e) {
					// 			console.log('setCanvasPatheeee', e);
					// 		}
					// 	}, this);
					// });


				
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
		// display: none;
		position: absolute;
		z-index: -111;
		top: 20rpx;
	}
</style>