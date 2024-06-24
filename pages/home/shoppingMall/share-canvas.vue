<template>
	<view class="content" v-if="ifShow" @click="changeIfShow">
		<u-loading v-if="qrcodeShow" color="success" mode="circle"></u-loading>

		<block v-else>
			<!-- <canvas
        :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
        id="firstCanvas"
        type="2d"
        @longpress="qrCodeKnow"
      ></canvas> -->
			<canvas type="2d" :id="'myCanvas'+count" @longpress="qrCodeKnow"
				:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
			<view @click.stop="" :style="{width: canvasWidth + 'px',}" style="height:100rpx;line-height: 100rpx;color:#fff" class="u-flex">
				<view @click.stop="checked1 = !checked1;count++;clearCanvas()" class="u-flex u-flex-1 u-flex-center">
					<image v-if="!checked1" style="width: 48rpx;height: 48rpx;margin-right: 8rpx"  :src="`${imgUrl}v3_goods_nochecked.png`"></image> 
					<image v-else style="width: 48rpx;height: 48rpx;margin-right: 8rpx"  :src="`${imgUrl}v3_goods_checked.png`"></image> 
					展示个人信息
				</view>
				<view v-if="hospitalTitle" @click.stop="checked2 = !checked2;count++;clearCanvas()" class="u-flex u-flex-1 u-flex-center">
					<image v-if="!checked2" style="width: 48rpx;height: 48rpx;margin-right: 8rpx"  :src="`${imgUrl}v3_goods_nochecked.png`"></image>
					<image v-else style="width: 48rpx;height: 48rpx;margin-right: 8rpx"  :src="`${imgUrl}v3_goods_checked.png`"></image> 
					展示医院信息
				</view>
				
				
			</view>
				<my-button @click="canvasGet" width="420" height="80">保存图片
				</my-button>
			
		</block>
		<!-- <uqrcode
      class="uqrcode"
      size="100"
      :options="options"
      :start="false"
      :hide="true"
      ref="uqrcode"
      canvas-id="qrcode"
      @complete="completeQrcode"
      :value="qrcode"
    ></uqrcode> -->
	</view>
</template>

<script>
	import myButton from "@/components/myButton.vue";
	import {
		imgUrl
	} from "../../../utils/common";

	export default {
		name: "yz-canvas-poster",
		data() {
			return {
				bgblack:false,
				ctx:null,
				active:true,
				count:0,
				checked1: false,
				checked2: false,
				canvas: null,
				qrcodeShow: false,
				options: {
					size: 100,
					backgroundImageSrc: "",
				},
				imageQrcode: "",
				canvasPath: "",
				context: null,
				windowWidth: 0, //屏幕可用宽度
				windowHeight: 0, //屏幕可用高度
				canvasWidth: 0, //图片宽度
				canvasHeight: 0, //图片高度
			};
		},
		props: {
			ifShow: {
				type: Boolean,
				default: false,
			},
			hospitalTitle: {
				type: String,
				default: "",
			},
			goods_id: {
				type: String,
				default: "",
			},
			imageBg: {
				type: String,
				default: `${imgUrl}v3_share-bg.png`,
			},
			myCanvasSize: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [0.85, 1000 / 638]; //[0]为画布占屏幕宽度的比例，[1]为背景画布长宽比
				},
			},
			imageHead: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [];
				},
			},
			imageBody: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [];
				},
			},
			textHead: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [];
				},
			},
			textHead2: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [];
				},
			},
		},
		onLoad() {},
		created() {
			this.reset()
		},

		methods: {
			reset(){
				const res = uni.getSystemInfoSync();
				// console.log('SystemInf', res);
				this.windowHeight = res.windowHeight;
				this.windowWidth = res.windowWidth;
				this.canvasWidth = this.windowWidth * this.myCanvasSize[0];
				this.canvasHeight = this.canvasWidth * this.myCanvasSize[1];
			},
			fitSize(coordinate) {
				let v = 375 / this.canvasWidth; //375是设计稿的大小，得到的v值是：设计稿和设备宽度的比例关系，也可理解成在设计稿的大小基础上放大或缩小的倍数
				return coordinate / v; //返回的是当前坐标值或者大小与v的比例
			},
			completeQrcode() {
				return new Promise((resolve, reject) => {
					// this.$refs.uqrcode.toTempFilePath({
					//   success: (res) => {
					//     console.log(222, res)
					//     resolve(res.tempFilePath)
					//   }
					// })
					this.$request({
						url: "/ApiV2/Mobile/Goods/miniShareCode",
						method: "get",
						data: {
							goods_id: this.goods_id,
							hospital_id: uni.getStorageSync('hospitalId') || 0
						},
					}).then((res) => {
						resolve(res.data.url);
					});
				});
			},
			clearCanvas(){
					// this.reset()
					this.$emit("update:ifShow", false);
					setTimeout(()=>{
						this.$emit("update:ifShow", true);
						setTimeout(()=>{
							this.init(this.canvasHight,this.canvasWidth)
						},50)
					},50)
					
					
				
			},
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
				console.log('执行到这里drawRoundRectPath')
				//右边线  
				cxt.lineTo(width, height - radius);
				cxt.closePath();
			},
			fontEllipsis(ctx,text,textWidth,maxWidth=160){
				if (textWidth > maxWidth) {
				  var ellipsis = "..."; // 省略符号
				  var ellipsisWidth = ctx.measureText(ellipsis).width;
				
				  var drawWidth = 0;
				  var ellipsisIndex = 0;
				
				  for (var i = 0; i < text.length; i++) {
				    drawWidth += ctx.measureText(text[i]).width;
				
				    if (drawWidth + ellipsisWidth > maxWidth) {
				      ellipsisIndex = i;
				      break;
				    }
				  }
				
				   text = text.substring(0, ellipsisIndex) + ellipsis;
				}
				return text
			},
			init(canvasHight, canvasWidth) {
				
				// this.qrcodeShow = true
				this.canvasHight = canvasHight
				this.canvasWidth = canvasWidth
				let aa = "#myCanvas" + this.count
				setTimeout(()=>{
					//新版canvas
					wx.createSelectorQuery()
					.in(this)
					.select(aa) // 在 WXML 中填入的 id
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
						
						console.log('this.ctx',this.ctx)
						// 初始化画布大小
						const dpr = wx.getWindowInfo().pixelRatio;
						console.log(wx.getWindowInfo());
						canvas.width = renderWidth * dpr;
						canvas.height = renderHeight * dpr;
						// console.log(canvas.width)
						// console.log(canvas.height)
						ctx.scale(dpr, dpr);
						const tempFilePath = await this.completeQrcode();
					   ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
						// const promixify = (api) => {
						//   return (options, ...params) => {
						//     return new Promise((resolve, reject) => {
						//       api(
						//         Object.assign({}, options, {
						//           success: resolve,
						//           fail: reject,
						//         }),
						//         ...params
						//       );
						//     });
						//   };
						// };
					
						// const getImageInfo = promixify(uni.getImageInfo);
						const images = [
							`${this.imgUrl}v3_share-bg.png`,
							`${this.imgUrl}share-white.png`,
							this.imageHead[0],
							tempFilePath,
						];
						//   let imageInfos = []
						//    //图片地址全部转换成临时地址
						//   const filterImgPath = (path)=>{
						//     return new Promise((resolve,reject)=>{
						//       uni.getImageInfo({
						//         src:path,
						//         success:(res)=>{
						//           imageInfos.push(res.path)
						//           resolve(res.path)
						//         }
						//       })
						//     })
						//   }
						//  await filterImgPath(images[0])
						//  await filterImgPath(images[1])
						//  await filterImgPath(images[2])
						//  await filterImgPath(images[3])
						// console.log('imageInfos',imageInfos)
					
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
						//切圆头像
						const promiseImg1 = (imgCtx, x, y, xw, xy, imgSrc) => {
							imgCtx.src = imgSrc;
							return new Promise((resolve, reject) => {
								imgCtx.onload = () => {
									
									
									ctx.beginPath();
									ctx.arc(x+xw/2,y+xy/2,xw/2,0,2*Math.PI)
									ctx.closePath()
									ctx.clip();
									ctx.drawImage(imgCtx, x, y, xw, xy);
									ctx.restore()
									console.log(imgSrc);
									resolve();
								};
							});
						};
						let image11 = canvas.createImage();
						let image2 = canvas.createImage();
						let image3 = canvas.createImage();
						let image4 = canvas.createImage();
						let image5 = canvas.createImage();
						
					
						ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
						ctx.fillStyle = 'transparent';
						ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
						//背景
						await promiseImg(
							image11,
							0,
							0,
							this.canvasWidth,
							this.canvasHeight,
							images[0]
						);
						console.log('先画背景')
						await promiseImg(
							image2,
							canvasWidth * 0.05,
							canvasHight * 0.04,
							canvasWidth * 0.9,
							canvasHight * 0.628,
							images[1]
						);
						console.log('然后白色背景')
						await promiseImg(
							image3,
							canvasWidth * 0.08,
							canvasHight * 0.06,
							canvasWidth * 0.84,
							canvasHight * 0.484,
							images[2]
						);
						console.log('然后商品图片')
						await promiseImg(
							image4,
							canvasWidth * 0.43,
							canvasHight * 0.85,
							canvasWidth * 0.15,
							canvasWidth * 0.15,
							images[3]
						);
						// textHead
						console.log('然后二维码')
						
						this.fillRoundRect(ctx,uni.upx2px(60),canvasHight * 0.71,uni.upx2px(518),uni.upx2px(100),uni.upx2px(50),'#fff')
						//什么都没勾选
						if(!this.checked1 && !this.checked2){
							
							await promiseImg(
								image5,
								uni.upx2px(68),
								uni.upx2px(718),
								uni.upx2px(84),
								uni.upx2px(84),
								`${this.imgUrl}logo@2x(1).png`,
							)
							ctx.font ='bold '+ uni.upx2px(24) + 'px Arial';
							ctx.textBaseline = "middle";
							ctx.fillStyle = '#4B4B4B';
							ctx.fillText(
								'均衡代谢管理',
								uni.upx2px(248),
								uni.upx2px(760),
								uni.upx2px(144)
							);
						}
						//只勾选展示个人信息
						if(this.checked1 && !this.checked2){
							//不能用await  暂时不清楚
							 promiseImg1(
								image5,
								uni.upx2px(68),
								uni.upx2px(718),
								uni.upx2px(84),
								uni.upx2px(84),
								this.$store.state.user.userInfo.avatar
							)
							ctx.font = 'bold '+ uni.upx2px(24) + 'px Arial';
							ctx.fillStyle = '#4B4B4B';
							ctx.textBaseline = "middle";
							// ctx.measureText() 重复执行会一直渲染 要用引用变量使用
							let realname = this.$store.state.user.userInfo?.staff_info?.realname || this.$store.state.user.userInfo.realname
							let namelength = ctx.measureText(realname).width
							realname =  this.fontEllipsis(ctx,realname,namelength,uni.upx2px(160))
							console.log('realname',realname)
							
							ctx.fillText(
								realname,
								uni.upx2px(228),
								uni.upx2px(760),
								uni.upx2px(160)
							);
							ctx.font = uni.upx2px(20) + 'px Arial';
							ctx.fillStyle = '#4B4B4B';
							ctx.textBaseline = "middle";
							console.log('姓名长度',namelength)
							let maxlength = namelength > uni.upx2px(160)?uni.upx2px(160):namelength
							ctx.fillText(
								'分享了一件商品',
								uni.upx2px(228) + maxlength +uni.upx2px(30),
								uni.upx2px(760),
								uni.upx2px(200)
							);
						}
						//只勾选展示医院信息
						if(!this.checked1 && this.checked2){
							
							ctx.font = uni.upx2px(20) + 'px Arial';
							ctx.fillStyle = '#9B9B9B';
							ctx.textBaseline = "middle";
							// ctx.textAlign = 'center';
							let measureText = ctx.measureText(this.hospitalTitle).width
							console.log('measureText',measureText)
							ctx.fillText(
								this.hospitalTitle,
								uni.upx2px(638/2)-measureText/2,
								uni.upx2px(760),
								uni.upx2px(400)
							);
						
						}
						//勾选展示个人、医院信息
						if(this.checked1 && this.checked2){
							//不能用await  暂时不清楚
							  promiseImg1(
								image5,
								uni.upx2px(68),
								uni.upx2px(718),
								uni.upx2px(84),
								uni.upx2px(84),
								this.$store.state.user.userInfo.avatar
							)
							//个人信息
							ctx.font = 'bold '+ uni.upx2px(24) + 'px Arial';
							ctx.fillStyle = '#4B4B4B';
							ctx.textBaseline = "middle";
							let realname = this.$store.state.user.userInfo?.staff_info?.realname || this.$store.state.user.userInfo.realname
							
							realname = this.fontEllipsis(ctx,realname,ctx.measureText(realname).width,uni.upx2px(300))
							let realnameLength = ctx.measureText(realname).width
							console.log('名字长度',realnameLength)
							ctx.fillText(
								realname,
								uni.upx2px(638/2)-realnameLength/2,
								uni.upx2px(742),
								uni.upx2px(300)
							);
							ctx.font = uni.upx2px(20) + 'px Arial';
							ctx.fillStyle = '#9B9B9B';
							ctx.textBaseline = "middle";
							// ctx.textAlign = 'center';
							let measureText1 = ctx.measureText(this.hospitalTitle).width
							console.log('measureText',measureText1)
							ctx.fillText(
								this.hospitalTitle,
								uni.upx2px(638/2)-measureText1/2,
								uni.upx2px(780),
								uni.upx2px(400)
							);
						
						}
						ctx.font = parseInt(this.fitSize(this.textHead[4])) + 'px Arial'; //this.textHead[4];
						ctx.textBaseline = "middle";
						ctx.fillStyle = this.textHead[3];
						
						ctx.fillText(
							this.textHead[0],
							canvasWidth * 0.08,
							canvasHight * 0.58,
							canvasWidth * 0.5
						);
											
						//textHead2
						ctx.font = parseInt(this.fitSize(this.textHead2[4])) + 'px Arial';
						ctx.textBaseline = "middle";
						ctx.fillStyle = this.textHead2[3];
						
						ctx.fillText(
							this.textHead2[0],
							canvasWidth * 0.08,
							canvasHight * 0.58+24,
							canvasWidth * 0.78
						);
						//长按二维码文字
						ctx.font = uni.upx2px(20) + 'px Arial';
						ctx.textBaseline = "middle";
						ctx.textAlign = "center";
						ctx.fillStyle = "#4A4A4A";
						
						ctx.fillText(
							"长按图片识别小程序码",
							canvasWidth * 0.5,
							canvasHight * 0.97,
							this.canvasHeight * 0.3
						);
						// ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
						this.qrcodeShow = false;
						console.log('font-size:' + parseInt(this.fitSize(16)) + 'px')
						return;
					});
				},100)
				
			},
			changeIfShow() {
				//触发一个更新事件
				
				this.$emit("update:ifShow", false);
				console.log("隐藏canvas");
			},
			qrCodeKnow() {
				this.canvasGet()
				// uni.showModal({
				//   title: "温馨提示",
				//   content: "识别二维码",
				//   // showCancel: false,
				//   cancelText: "取消",
				//   confirmText: "确定",
				//   success: (res) => {
				//     if (res.confirm) {

				//     } else if (res.cancel) {
				//       console.log("用户点击取消");
				//     }
				//   },
				//   fail: () => {},
				//   complete: () => {},
				// });
			},
			canvasGet() {
				console.log("下载canvas");
				let that = this
				//授权添加到相册
				wx.getSetting({
					success(scope) {
						if (!scope.authSetting["scope.writePhotosAlbum"]) {
							wx.authorize({
								scope: "scope.writePhotosAlbum",
								success() {
									console.log("同意授权");
									that.saveCanvas();
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
							that.saveCanvas();
						}
					},
				});
			},
			//保存canvas
			saveCanvas() {
			
				var that = this;
				
				uni.canvasToTempFilePath({
						canvas: that.canvas,
						success: function(res) {
							// 在H5平台下，tempFilePath 为 base64
							console.log(res.tempFilePath);
							that.canvasPath = res.tempFilePath;
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
												
												that.changeIfShow();
												uni.showToast({
													title: "保存成功",
													duration: 2000,
												});
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
						fail: () => {
							console.log("下载失败");
							
						},
					},
					that
				);
			},
		},
		components: {
			myButton,
		},
	};
</script>

<style>
	.content {
		position: fixed;
		top: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.2);
		width: 100vw;
		height: 100vh;
		z-index: 2;

		/* 设置显示层级 */
	}

	.canvas-img {
		/* position: sticky; */
	}

	.uqrcode {
		position: absolute;
		bottom: 10rpx;
	}
</style>