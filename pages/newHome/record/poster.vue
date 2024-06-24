<template>
	<view class="poster safe-area-inset-bottom" :style="{minHeight:height}">
		<!-- <image :src="`${imgUrl}record-bg.png`" style="width: 710rpx;height: 1491.78rpx;" mode="widthFix"></image> -->

		<canvas @longpress.native="qrCodeKnow('myCanvas')" :style="{
			width: widthPx + 'px',
			height: heightPx + 'px',
			background:'#00B8A2',
		}" id="myCanvas" type="2d" />

	</view>
</template>

<script>
	import {
		formatDate
	} from '@/utils/common.js'
	export default {
		name: 'poster',
		data() {
			return {
				height:'100vh',
				widthPx: uni.upx2px(750),
				heightPx: uni.upx2px(1490),
				paddingPx: uni.upx2px(48),
				userInfo: {},
				qrsrc: '',
				myCanvas: '',
				initDataList: []
			}
		},
		mounted() {
			// this.init()
			console.log(1111,this.$u.sys())
			this.height =this.$u.sys().windowHeight - this.$u.sys().statusBarHeight - 48 + 'px'
			
			console.log(2222,this.height)
		},
		components: {},
		methods: {
			
			qrCodeKnow(id) {
				var that = this;
				wx.getSetting({
					success(scope) {
						if (!scope.authSetting["scope.writePhotosAlbum"]) {
							wx.authorize({
								scope: "scope.writePhotosAlbum",
								success() {
									console.log("同意授权");
									that.saveCanvas(id);
								},
								fail(e) {
									console.log("拒绝授权", e);
									uni.showModal({
										title: "温馨提示",
										content: "请授权手机相册",
										showCancel: false,
										confirmText: "确定",
										success: (res) => {
											if (res.confirm) {
												console.log("用户点击确定");
												wx.openSetting();
											} else if (res.cancel) {
												console.log("用户点击取消");
											}
										},
										fail: () => {},
										complete: () => {},
									});
								},
							});
						} else {
							console.log("已经授权");
							that.saveCanvas(id);
						}
					},
				});
			},
			//保存canvas
			saveCanvas(canvas) {
				var that = this;
				console.log('canvas', this[canvas])
				uni.canvasToTempFilePath({
						canvas: this[canvas],
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							console.log(res.tempFilePath);
							let canvasPath = res.tempFilePath;
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
											filePath: canvasPath,
											success: function() {
												console.log("save success");
												// that.changeIfShow();
												uni.showToast({
													title: "保存成功",
													duration: 2000,
												});
											},
										});
									} else if (res.cancel) {
										console.log("用户点击取消");
									}
								},
								fail: () => {},
								complete: () => {},
							});
						},
						fail: () => {
							console.log("下载失败");
						},
					},
					that
				);
			},
			setData(initDataList, userInfo, qrsrc) {
				this.initDataList = initDataList
				this.userInfo = userInfo
				this.qrsrc = qrsrc
				console.log('initDataList', initDataList)
				console.log(11111111111111111111111, this.userInfo)
				this.init()
			},
			/**该方法用来绘制一个有填充色的圆角矩形 
			 *@param cxt:canvas的上下文环境 
			 *@param x:左上角x轴坐标 
			 *@param y:左上角y轴坐标 
			 *@param 矩形的宽度 
			 *@param height:矩形的高度 
			 *@param radius:圆的半径 
			 *@param fillColor:填充颜色 
			 **/
			fillRoundRect(cxt, x, y, width, height, radius, /*optional*/ fillColor) {
				//圆的直径必然要小于矩形的宽高          
				if (2 * radius > width || 2 * radius > height) {
					return false;
				}

				cxt.save();
				cxt.translate(x, y);
				//绘制圆角矩形的各个边  
				this.drawRoundRectPath(cxt, width, height, radius);
				cxt.fillStyle = fillColor || "#000"; //若是给定了值就用给定的值否则给予默认值  
				cxt.fill();
				cxt.restore();
			},
			drawRoundRectPath(cxt, width, height, radius) {
				cxt.beginPath(0);
				//从右下角顺时针绘制，弧度从0到1/2PI  
				cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

				//矩形下边线  
				cxt.lineTo(radius, height);

				//左下角圆弧，弧度从1/2PI到PI  
				cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

				//矩形左边线  
				cxt.lineTo(0, radius);

				//左上角圆弧，弧度从PI到3/2PI  
				cxt.arc(radius, radius, radius, Math.PI, Math.PI * 3 / 2);

				//上边线  
				cxt.lineTo(width - radius, 0);

				//右上角圆弧  
				cxt.arc(width - radius, radius, radius, Math.PI * 3 / 2, Math.PI * 2);

				//右边线  
				cxt.lineTo(width, height - radius);
				cxt.closePath();
			},
			init() {
				let imgurl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg.png'
				let imgurlHeight = ''
				let length = this.initDataList.length
				console.log('length',length)
				if (length > 0 && length <= 3) {
					imgurlHeight = uni.upx2px(760)
					 imgurl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg1.png'
				} else if (length > 3 && length <= 6) {
					imgurlHeight = uni.upx2px(760) + uni.upx2px(200)
					 imgurl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg2.png'
				} else if (length > 6 && length <= 9) {
					imgurlHeight = uni.upx2px(760) + 2 * uni.upx2px(200)
					 imgurl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg3.png'
				} else if (length > 9 && length <= 12) {
					imgurlHeight = uni.upx2px(760) + 3 * uni.upx2px(200)
					 imgurl = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg4.png'
				} else {
					imgurlHeight = uni.upx2px(1491)
				}
				wx.createSelectorQuery().in(this)
					.select('#myCanvas') // 在 WXML 中填入的 id
					.fields({
						node: true,
						size: true
					})
					.exec(async (res) => {
						// Canvas 对象
						const canvas = res[0].node
						this.myCanvas = canvas
						// Canvas 画布的实际绘制宽高
						let renderWidth = res[0].width 
						const renderHeight = res[0].height
						// Canvas 绘制上下文
						const ctx = canvas.getContext('2d')

						// 初始化画布大小
						const dpr = wx.getWindowInfo().pixelRatio
						canvas.width = renderWidth * dpr
						canvas.height = renderHeight * dpr
						ctx.scale(dpr, dpr)
						console.log(imgurlHeight)
						console.log(renderWidth)
						console.log(renderHeight)
						console.log(canvas.width)
						console.log(canvas.height)
						renderWidth = renderWidth - uni.upx2px(48)
						ctx.fillStyle = '#00B8A2'
						ctx.fillRect(0,0,renderWidth+uni.upx2px(48),renderHeight)
						// let imgurl1 = 'https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/share-bg-white.png'
						const promiseImg = (imgCtx, x, y, xw, xy, imgSrc) => {
							imgCtx.src = imgSrc;
							return new Promise((resolve, reject) => {
								imgCtx.onload = () => {
									ctx.drawImage(imgCtx, x, y, xw, xy);
									console.log(imgSrc);
									resolve();
								};
							});
						};
						const promiseImg1 = (imgCtx, x, y, xw, xy, imgSrc) => {
							imgCtx.src = imgSrc;
							return new Promise((resolve, reject) => {
								imgCtx.onload = () => {
									ctx.arc(x + xw / 2, y + xy / 2, xw / 2, 0, 2 * Math.PI)
									ctx.clip()
									ctx.closePath()
									ctx.drawImage(imgCtx, x, y, xw, xy);
									ctx.restore()
									console.log(imgSrc);
									resolve();
								};
							});
						};
						
						const image = canvas.createImage()
						const image2 = canvas.createImage();
						
						await promiseImg(
							image,
							0 + uni.upx2px(24),
							0,
							renderWidth,
							imgurlHeight,
							imgurl
						)
						ctx.save()
						//头像  不适用await - 临时文件有可能失效导致画图失败
					    promiseImg1(
							image2,
							uni.upx2px(48)+ uni.upx2px(24),
							uni.upx2px(150),
							uni.upx2px(96),
							uni.upx2px(96),
							this.userInfo.avatar
						);
						// 用户名称
						ctx.font = 'bold ' + uni.upx2px(32) + 'px';

						ctx.fillStyle = '#2A2A2A';
						ctx.fillText(
							this.userInfo.nickname,
							uni.upx2px(150)+ uni.upx2px(24),
							uni.upx2px(182), // 150 + 字体高度
							renderWidth * 0.5
						);
						// 日期
						ctx.font = uni.upx2px(24) + 'px';

						ctx.fillStyle = '#C2C2C2';
						ctx.fillText(
							formatDate(new Date(this.userInfo.time)),
							uni.upx2px(150)+ uni.upx2px(24),
							uni.upx2px(220), // 196 + 字体高度
							renderWidth * 0.5
						);
						// this.initDataList = [...this.initDataList]
						for (let i = 0; i < this.initDataList.length; i++) {
							let newImage = canvas.createImage()
							let toRight = uni.upx2px(200)
							if (i >= 0 && i <= 2) {

								await promiseImg(
									newImage,
									uni.upx2px(64) + i * toRight+ uni.upx2px(24),
									uni.upx2px(286),
									uni.upx2px(48),
									uni.upx2px(48),
									this.initDataList[i].icon
								)

								ctx.font = uni.upx2px(28) + 'px';
								ctx.textAlign = "start";
								ctx.fillStyle = '#C2C2C2';
								ctx.fillText(
									this.initDataList[i].title,
									uni.upx2px(64) + i * toRight + uni.upx2px(56)+ uni.upx2px(24),
									uni.upx2px(290 + 28),
									uni.upx2px(120)
								);
								
								ctx.fillStyle = '#2A2A2A';
								let measureText = ctx.measureText(this.initDataList[i].data).width
								
								
								let a = renderWidth / 3 - measureText >=0? (renderWidth / 3 - measureText)/2-10:0
								console.log('a',a)
								ctx.fillText(
									this.initDataList[i].data,
									uni.upx2px(64+a) + i * toRight+ uni.upx2px(24),
									uni.upx2px(342 + 28),
									renderWidth / 3
								);
								if (this.initDataList[i].info && typeof this.initDataList[i].info === 'object') {
									this.fillRoundRect(ctx, uni.upx2px(48)+ uni.upx2px(24) + i * uni.upx2px(206), uni.upx2px(390),
										uni
										.upx2px(136), uni.upx2px(48), uni.upx2px(24), this.initDataList[i].info
										.levels.find(v => v.active).color);
									console.log('i', i)
									ctx.fillStyle = '#FFF';
									ctx.font = uni.upx2px(28) + 'px';
									ctx.textAlign = "center";
									ctx.fillText(
										this.initDataList[i].info
										.levels.find(v => v.active).title,
										uni.upx2px(48) + i * uni.upx2px(206) + uni.upx2px(68)+ uni.upx2px(24),
										uni.upx2px(398 + 24),
										uni.upx2px(136)
									);
								}


							}
							if (i > 2 && i <= 5) {


								await promiseImg(
									newImage,
									uni.upx2px(64) + (i - 3) * toRight+ uni.upx2px(24),
									uni.upx2px(478),
									uni.upx2px(48),
									uni.upx2px(48),
									this.initDataList[i].icon
								)
								ctx.font = uni.upx2px(28) + 'px';

								ctx.fillStyle = '#C2C2C2';
								ctx.textAlign = "start";
								ctx.fillText(
									this.initDataList[i].title,
									uni.upx2px(64) + (i - 3) * toRight + uni.upx2px(56)+ uni.upx2px(24),
									uni.upx2px(482 + 28),
									uni.upx2px(120)
								);
								// ctx.textAlign = "center";
								ctx.fillStyle = '#2A2A2A';
								let measureText = ctx.measureText(this.initDataList[i].data).width
								
								
								let a = renderWidth / 3 - measureText >=0? (renderWidth / 3 - measureText)/2-10:0
								ctx.fillText(
									this.initDataList[i].data,
									uni.upx2px(a+64) + (i - 3) * toRight+ uni.upx2px(24),
									uni.upx2px(534 + 28),
									renderWidth / 3
								);
								if (this.initDataList[i].info && typeof this.initDataList[i].info === 'object') {
									this.fillRoundRect(ctx, uni.upx2px(48)+ uni.upx2px(24) + (i - 3) * uni.upx2px(206), uni.upx2px(
											582),
										uni.upx2px(136), uni.upx2px(48), uni.upx2px(24), this.initDataList[i]
										.info
										.levels.find(v => v.active).color);
									ctx.fillStyle = '#FFF';
									ctx.font = uni.upx2px(28) + 'px';
									ctx.textAlign = "center";
									ctx.fillText(
										this.initDataList[i].info
										.levels.find(v => v.active).title,
										uni.upx2px(48) + (i - 3) * uni.upx2px(206) + uni.upx2px(68)+ uni.upx2px(24),
										uni.upx2px(590 + 24),
										uni.upx2px(136)
									);
								}

								// ctx.fillStyle="#ff8826";
								// ctx.fillRect(canvasSW + i *box.width, canvasSH, box.width, box.height)
								console.log('i', i)
								// ctx.fillStyle="#217aff";
								// ctx.fillRect(canvasSW + (i-4) *box.width, canvasSH+box.height, box.width, box.height)
								// console.log('i',i)

							}
							if (i > 5 && i <= 8) {


								await promiseImg(
									newImage,
									uni.upx2px(64) + (i - 6) * toRight+ uni.upx2px(24),
									uni.upx2px(672),
									uni.upx2px(48),
									uni.upx2px(48),
									this.initDataList[i].icon
								)
								ctx.font = uni.upx2px(28) + 'px';
								ctx.textAlign = "start";
								ctx.fillStyle = '#C2C2C2';
								ctx.fillText(
									this.initDataList[i].title,
									uni.upx2px(64) + (i - 6) * toRight + uni.upx2px(56)+ uni.upx2px(24),
									uni.upx2px(676 + 28),
									uni.upx2px(120)
								);

								ctx.fillStyle = '#2A2A2A';
								let measureText = ctx.measureText(this.initDataList[i].data).width
								
								
								let a = renderWidth / 3 - measureText >=0? (renderWidth / 3 - measureText)/2-10:0
								ctx.fillText(
									this.initDataList[i].data,
									uni.upx2px(a+64) + (i - 6) * toRight+ uni.upx2px(24),
									uni.upx2px(726 + 28),
									renderWidth / 3
								);
								if (this.initDataList[i].info && typeof this.initDataList[i].info === 'object') {
									this.fillRoundRect(ctx, uni.upx2px(48) + uni.upx2px(24)+ (i - 6) * uni.upx2px(206), uni.upx2px(
											774),
										uni.upx2px(136), uni.upx2px(48), uni.upx2px(24), this.initDataList[i]
										.info
										.levels.find(v => v.active).color);
									ctx.textAlign = "center";
									ctx.font = uni.upx2px(28) + 'px';
									ctx.fillStyle = '#FFF';

									ctx.fillText(
										this.initDataList[i].info
										.levels.find(v => v.active).title,
										uni.upx2px(48) + (i - 6) * uni.upx2px(206) + uni.upx2px(68)+ uni.upx2px(24),
										uni.upx2px(782 + 24),
										uni.upx2px(136)
									);
								}




							}
							if (i > 8 && i <= 11) {
								await promiseImg(
									newImage,
									uni.upx2px(64) + (i - 9) * toRight+ uni.upx2px(24),
									uni.upx2px(862),
									uni.upx2px(48),
									uni.upx2px(48),
									this.initDataList[i].icon
								)
								ctx.font = uni.upx2px(28) + 'px';
								ctx.textAlign = "start";
								ctx.fillStyle = '#C2C2C2';
								ctx.fillText(
									this.initDataList[i].title,
									uni.upx2px(64) + (i - 9) * toRight + uni.upx2px(56)+ uni.upx2px(24),
									uni.upx2px(866 + 28),
									uni.upx2px(120)
								);
								// ctx.textAlign = "center";
								ctx.fillStyle = '#2A2A2A';
								let measureText = ctx.measureText(this.initDataList[i].data).width
								
								
								let a = renderWidth / 3 - measureText >=0? (renderWidth / 3 - measureText)/2-10:0
								ctx.fillText(
									this.initDataList[i].data,
									uni.upx2px(a+64) + (i - 9) * toRight+ uni.upx2px(24),
									uni.upx2px(918 + 28),
									renderWidth / 3
								);
								if (this.initDataList[i].info && typeof this.initDataList[i].info === 'object') {
									this.fillRoundRect(ctx, uni.upx2px(48)+ uni.upx2px(24) + (i - 9) * uni.upx2px(206), uni.upx2px(
											966),
										uni.upx2px(136), uni.upx2px(48), uni.upx2px(24), this.initDataList[i]
										.info
										.levels.find(v => v.active).color);
									ctx.textAlign = "center";
									ctx.font = uni.upx2px(28) + 'px';
									ctx.fillStyle = '#FFF';

									ctx.fillText(
										this.initDataList[i].info
										.levels.find(v => v.active).title,
										uni.upx2px(48) + (i - 9) * uni.upx2px(206) + uni.upx2px(68)+ uni.upx2px(24),
										uni.upx2px(974 + 24),
										uni.upx2px(136)
									);
								}



							}
							if (i > 11 && i <= 14) {
								await promiseImg(
									newImage,
									uni.upx2px(64) + (i - 12) * toRight+ uni.upx2px(24),
									uni.upx2px(1054),
									uni.upx2px(48),
									uni.upx2px(48),
									this.initDataList[i].icon
								)
								ctx.font = uni.upx2px(28) + 'px';
								ctx.textAlign = "start";
								ctx.fillStyle = '#C2C2C2';
								ctx.fillText(
									this.initDataList[i].title,
									uni.upx2px(64) + (i - 12) * toRight + uni.upx2px(56)+ uni.upx2px(24),
									uni.upx2px(1058 + 28),
									uni.upx2px(120)
								);
								// ctx.textAlign = "center";
								ctx.fillStyle = '#2A2A2A';
								ctx.font = uni.upx2px(28) + 'px';
								let measureText = ctx.measureText(this.initDataList[i].data).width
								
								
								let a = renderWidth / 3 - measureText >=0? (renderWidth / 3 - measureText)/2-10:0
								ctx.fillText(
									this.initDataList[i].data,
									uni.upx2px(a+64) + (i - 12) * toRight+ uni.upx2px(24),
									uni.upx2px(1110 + 28),
									renderWidth / 3
								);
								// 	this.fillRoundRect(ctx, uni.upx2px(48) + (i - 12) * uni.upx2px(206), uni.upx2px(
								// 		966),
								// 		uni.upx2px(136), uni.upx2px(48), uni.upx2px(24), this.initDataList[i].info
								// 		.levels[this.initDataList[i].info.level].color);
								// 	ctx.textAlign = "center";
								// 	ctx.fillStyle = '#FFF';

								// 	ctx.fillText(
								// 		this.initDataList[i].info.levels[this.initDataList[i].info.level].title,
								// 		uni.upx2px(48) + (i - 12) * uni.upx2px(206) + uni.upx2px(68),
								// 		uni.upx2px(966 + 28),
								// 		uni.upx2px(136)
								// 	);


							}

						}
						const image3 = canvas.createImage()
						await promiseImg(
							image3,
							uni.upx2px(222)+ uni.upx2px(24),
							imgurlHeight - uni.upx2px(252) - uni.upx2px(60),
							uni.upx2px(252),
							uni.upx2px(252),
							this.qrsrc
						)
						console.log(renderWidth)
						console.log(renderHeight)

					})
			},
		}
	}
</script>

<style lang="scss" scope>
	.poster {

		// min-height: calc(100vh - 136rpx);
		padding-top: 24rpx;
		background: #00B8A2;
		display: flex;
		justify-content: center;
		// background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/record-bg.png");
		// background-size: 86%;
		// background-repeat: no-repeat;
		// background-position: center;
	}
</style>
