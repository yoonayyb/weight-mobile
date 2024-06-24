<template>
	<view class="u-swiper-wrap" :style="{
		borderRadius: `${borderRadius}rpx`
	}">
		<swiper :current="elCurrent" @change="change" @animationfinish="animationfinish" :interval="interval"
			:circular="circular" :duration="duration" :autoplay="autoplay"
			:previous-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '84rpx'"
			:next-margin="effect3d ? effect3dPreviousMargin + 'rpx' : '58rpx'" :style="{
				height: height + 'rpx',
				backgroundColor: bgColor
			}">
			<swiper-item class="u-swiper-item" v-for="(item, index) in list" :key="index">
				<view class="u-list-image-wrap" @tap.stop.prevent="listClick(index)"
					:class="[uCurrent != index ? 'u-list-scale' : '']" :style="{
						borderRadius: `${borderRadius}rpx`,
						
					}" style="margin-right: 32rpx;">
					<view class="u-swiper-image">
						<block>
							<canvas type="2d" :id="'myCanvas'+index" @longpress.native="qrCodeKnow('myCanvas'+index)"
								:style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"></canvas>
						</block>
						<view class="u-swiper-image-foot">
							<view class="u-flex-column u-flex-items-center">
								<!-- <image :src="`${imgUrl}v3_mine_wx.png`" style="width:96rpx;height: 96rpx;" mode="">
								</image>
								<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;"> -->

								<button open-type="share" class="wx">
									<image :src="`${imgUrl}v3_mine_wx.png`" style="width:96rpx;height: 96rpx;" mode="">
									</image>
									<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">

										<button open-type="share" class="wx">微信好友</button>
									</view>
								</button>
								<!-- </view> -->
							</view>
							<view class="u-flex-column u-flex-items-center" @click="saveCanvas('myCanvas'+index)">
								<image :src="`${imgUrl}v3_mine_save.png`" style="width:96rpx;height: 96rpx;" mode="">
								</image>
								<view class="u-font-24 u-m-t-4" style="color: #C2C2C2;text-align: center;">
									保存图片
								</view>
							</view>
						</view>
					</view>

				</view>
			</swiper-item>
		</swiper>

	</view>
</template>

<script>
	/**
	 * swiper 轮播图
	 * @description 该组件一般用于导航轮播，广告展示等场景,可开箱即用
	 * @tutorial https://www.uviewui.com/components/swiper.html
	 * @property {Array} list 轮播图数据，见官网"基本使用"说明
	 * @property {Boolean} title 是否显示标题文字，需要配合list参数，见官网说明（默认false）
	 * @property {String} mode 指示器模式，见官网说明（默认round）
	 * @property {String Number} height 轮播图组件高度，单位rpx（默认250）
	 * @property {String} indicator-pos 指示器的位置（默认bottomCenter）
	 * @property {Boolean} effect3d 是否开启3D效果（默认false）
	 * @property {Boolean} autoplay 是否自动播放（默认true）
	 * @property {String Number} interval 自动轮播时间间隔，单位ms（默认2500）
	 * @property {Boolean} circular 是否衔接播放，见官网说明（默认true）
	 * @property {String} bg-color 背景颜色（默认#f3f4f6）
	 * @property {String Number} border-radius 轮播图圆角值，单位rpx（默认8）
	 * @property {Object} title-style 自定义标题样式
	 * @property {String Number} effect3d-previous-margin mode = true模式的情况下，激活项与前后项之间的距离，单位rpx（默认50）
	 * @property {String} img-mode 图片的裁剪模式，详见image组件裁剪模式（默认aspectFill）
	 * @event {Function} click 点击轮播图时触发
	 * @example <u-swiper :list="list" mode="dot" indicator-pos="bottomRight"></u-swiper>
	 */
	export default {
		name: "u-swiper",
		props: {
			myCanvasSize: {
				type: Array,
				default: () => {
					//props传递数据的时候，默认值如果是数组或者对象，应该使用一个函数返回默认值
					return [0.64, 660 / 482]; //[0]为画布占屏幕宽度的比例，[1]为背景画布长宽比
				},
			},
			// 轮播图的数据,格式如：[{image: 'xxxx', title: 'xxxx'}，{image: 'yyyy', title: 'yyyy'}]，其中title字段可选
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			// 是否显示title标题
			title: {
				type: Boolean,
				default: false
			},
			// 用户自定义的指示器的样式
			indicator: {
				type: Object,
				default () {
					return {};
				}
			},
			// 圆角值
			borderRadius: {
				type: [Number, String],
				default: 8
			},
			// 隔多久自动切换
			interval: {
				type: [String, Number],
				default: 3000
			},
			// 指示器的模式，rect|dot|number|round
			mode: {
				type: String,
				default: 'round'
			},
			// list的高度，单位rpx
			height: {
				type: [Number, String],
				default: 250
			},
			// 指示器的位置，topLeft|topCenter|topRight|bottomLeft|bottomCenter|bottomRight
			indicatorPos: {
				type: String,
				default: 'bottomCenter'
			},
			// 是否开启缩放效果
			effect3d: {
				type: Boolean,
				default: false
			},
			// 3D模式的情况下，激活item与前后item之间的距离，单位rpx
			effect3dPreviousMargin: {
				type: [Number, String],
				default: 90
			},
			// 是否自动播放
			autoplay: {
				type: Boolean,
				default: true
			},
			// 自动轮播时间间隔，单位ms
			duration: {
				type: [Number, String],
				default: 500
			},
			// 是否衔接滑动，即到最后一张时接着滑动，是否自动切换到第一张
			circular: {
				type: Boolean,
				default: true
			},
			// 图片的裁剪模式 
			imgMode: {
				type: String,
				default: 'aspectFill'
			},
			// 从list数组中读取的图片的属性名
			name: {
				type: String,
				default: 'image'
			},
			// 背景颜色
			bgColor: {
				type: String,
				default: '#f3f4f6'
			},
			// 初始化时，默认显示第几项
			current: {
				type: [Number, String],
				default: 0
			},
			// 标题的样式，对象形式
			titleStyle: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		watch: {
			// 如果外部的list发生变化，判断长度是否被修改，如果前后长度不一致，重置uCurrent值，避免溢出
			list(nVal, oVal) {
				if (nVal.length !== oVal.length) this.uCurrent = 0;
			},
			// 监听外部current的变化，实时修改内部依赖于此测uCurrent值，如果更新了current，而不是更新uCurrent，
			// 就会错乱，因为指示器是依赖于uCurrent的
			current(n) {
				this.uCurrent = n;
			}
		},
		data() {
			return {
				uCurrent: this.current, // 当前活跃的swiper-item的index
				canvasWidth: 0,
				canvasHeight: 0,
				canvas: null,
				cWidth: 0,
				myCanvas0: null,
				myCanvas1: null,
				myCanvas2: null,
				userInfo: {},
				scene_id:''
			};
		},
		
		created() {
			const res = uni.getSystemInfoSync();
			// console.log('SystemInf', res);
			// let signwidth = 289 //设计稿图片宽度
			this.canvasWidth = uni.upx2px(482) // res.windowWidth * this.myCanvasSize[0];
			this.canvasHeight = uni.upx2px(660)  //this.canvasWidth * this.myCanvasSize[1];
			// this.init(this.canvasHeight,this.canvasWidth)
		},
		computed: {
			titlePaddingBottom() {
				let tmp = 0;
				if (this.mode == 'none') return '12rpx';
				if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode ==
					'number') {
					tmp = '60rpx';
				} else if (['bottomLeft', 'bottomCenter', 'bottomRight'].indexOf(this.indicatorPos) >= 0 && this.mode !=
					'number') {
					tmp = '40rpx';
				} else {
					tmp = '12rpx';
				}
				return tmp;
			},
			// 因为uni的swiper组件的current参数只接受Number类型，这里做一个转换
			elCurrent() {
				return Number(this.uCurrent);
			}
		},
		methods: {
			
			getSaleCode(type) {
				return new Promise((resolve,reject)=>{
					this.$request({
					  url: '/ApiV2/Mobile/Bind/getMiniCode',
					  loading: true,
					  errMsg: false,
					  data: {
					    type, //INVITE_SALEREP' //销售代表
					    role: this.userInfo.role_id
					  }
					}).then((res) => {
					  resolve(res.data.url)
					})
				})
			  
			},
			qrCodeKnow(id) {
				console.log(id)
				this.canvasGet(id, 1) // 1 预览

			},
			canvasGet(id, type = 0) {
				console.log("下载canvas");
				let that = this
		 	if (type) {
					return this.qrcodePrevie(id)
				}
				//授权添加到相册
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
			qrcodePrevie(canvas) { //预览
				var that = this;
				console.log('canvas', this[canvas])
				uni.canvasToTempFilePath({
					canvas: this[canvas],
					success: function(res) {
						wx.previewImage({
							urls: [res.tempFilePath],


						})

					},
					fail: () => {
						console.log("下载失败");
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
			fitSize(coordinate) {
				// let v = 375 / this.canvasWidth; //375是设计稿的大小，得到的v值是：设计稿和设备宽度的比例关系，也可理解成在设计稿的大小基础上放大或缩小的倍数
				// return coordinate / v; //返回的是当前坐标值或者大小与v的比例
				return uni.upx2px(coordinate)
			},
			init(id, canvasHight, canvasWidth, userInfo) {

				this.uCurrent = this.list.length>1?1:0
				console.log('this.uCurrent',this.uCurrent)

				this.userInfo = userInfo
				console.log('this.userInfo', this.userInfo)
				wx.createSelectorQuery()
					.in(this)
					.select(".u-swiper-image").boundingClientRect(async res => {
						console.log('height', res)
						
						

						if (this.userInfo.role_id === 2) {
							if(this.userInfo.roles.isSaleRep){//销售代表
								let doctorQR = await this.getSaleCode('INVITE_DOCTOR')
								let userQR = await this.getSaleCode('INVITE_USER')
								this.drawCanvas(id, 'myCanvas0',doctorQR)//医生邀请码
								this.drawCanvas('#myCanvas1', 'myCanvas1',userQR)//自己的
							}else{//其他营养师
								let doctorQR = await this.getSaleCode('INVITE_DOCTOR')
								let saleQR = await this.getSaleCode('INVITE_SALEREP')
								let userQR = await this.getSaleCode('INVITE_USER')
								this.drawCanvas(id, 'myCanvas0',doctorQR)//医生邀请码
								this.drawCanvas('#myCanvas1', 'myCanvas1',userQR)//自己的
								this.drawCanvas('#myCanvas2', 'myCanvas2',saleQR)//销售代表
							}
							
						} else if (this.userInfo.role_id === 3) {
							let userQR = await this.getSaleCode('INVITE_USER')
							this.drawCanvasDoctor(id, 'myCanvas0',userQR)//自己的
						}



					}).exec()

			},
			/*
			str:要绘制的字符串
			canvas:canvas对象
			initX:绘制字符串起始x坐标
			initY:绘制字符串起始y坐标
			lineHeight:字行高，自己定义个值即可
			*/
			 canvasTextAutoLine(str,canvas,canvasWidth,initX,initY,lineHeight){
			    var ctx = canvas
			    var lineWidth = 0;
			   
			    var lastSubStrIndex= 0; 
			    for(let i=0;i<str.length;i++){ 
			        lineWidth+=ctx.measureText(str[i]).width; 
			        if(lineWidth>canvasWidth-initX){//减去initX,防止边界出现的问题
			            ctx.fillText(str.substring(lastSubStrIndex,i),initX,initY);
			            initY+=lineHeight;
			            lineWidth=0;
			            lastSubStrIndex=i;
			        } 
			        if(i==str.length-1){
			            ctx.fillText(str.substring(lastSubStrIndex,i+1),initX,initY);
			        }
			    }
			  },
			drawCanvasDoctor(id, name,qrPath) {
				wx.createSelectorQuery()
					.in(this)
					.select(id) // 在 WXML 中填入的 id
					.fields({
						node: true,
						size: true
					})
					.exec(async (res) => {
						// Canvas 对象
						this[name] = res[0].node;
						const canvas = res[0].node;

						console.log('this.canvas', this[name])

						
						
						// Canvas 画布的实际绘制宽高
						const renderWidth = res[0].width;
						const renderHeight = res[0].height;
						console.log('renderWidth',renderWidth);
						console.log('renderHeight',renderHeight);
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
						const tempFilePath = qrPath;



						const images = [
							`${this.imgUrl}bg.png`,
							this.userInfo.avatar, //`${this.imgUrl}v3_mine_person.png`,
							tempFilePath,

						];

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
									
									
									ctx.arc(x+xw/2,y+xy/2,xw/2,0,2*Math.PI)
									ctx.clip()
									ctx.closePath()
									ctx.drawImage(imgCtx, x, y, xw, xy);
									ctx.restore()
									console.log(imgSrc);
									resolve();
								};
							});
						};
						let image1 = canvas.createImage();
						let image2 = canvas.createImage();

						let image3 = canvas.createImage();
						// let image4 = canvas.createImage();
						//背景
						await promiseImg(
							image1,
							renderWidth * 0,
							renderHeight * 0,
							renderWidth * 1,
							renderHeight * 1,
							images[0]
						);
						console.log('图片宽度',renderWidth,'图片高度',renderHeight)
						ctx.save()
						//头像  不适用await - 临时文件有可能失效导致画图失败
						await promiseImg1(
							image2,
							renderWidth * 0.13,
							renderHeight * 0.05,
							renderWidth * 0.26,
							renderWidth * 0.26,
							images[1]
						);
						
						console.log('图片宽度',renderWidth * 0.26,'距离左边距离',renderWidth * 0.13,)
					
						//二维码
						await promiseImg(
							image3,
							renderWidth * 0.13,
							renderHeight * 0.23,
							renderWidth * 0.74,
							renderWidth * 0.76,
							images[2]
						);
						
						// 医生信息
						ctx.font = 'bold ' + parseInt(uni.upx2px(32)) + 'px'; //this.textHead[4];
						ctx.textAlign="start";
						ctx.fillStyle = '#2A2A2A';
						// this.canvasTextAutoLine('asjkdhaskjhdaskjdhaskjdhkajsd',ctx,renderWidth * 0.5,renderWidth * 0.41,renderHeight * 0.1,uni.upx2px(32))
						ctx.fillText(
							this.userInfo.nickname,
							renderWidth * 0.41,
							renderHeight * 0.1,
							renderWidth * 0.5
						);
						ctx.font = 'normal ' + parseInt(uni.upx2px(24)) + 'px'; //this.textHead[4];
						ctx.textAlign="start";
						ctx.fillStyle = '#C2C2C2'; 
						ctx.fillText(
							this.userInfo?.staff_info?.department || ' ',
							renderWidth * 0.41,
							renderHeight * 0.15,
							renderWidth * 0.5
						);
						
						//底部文字
						ctx.font = parseInt(this.fitSize(24)) + 'px'; //this.textHead[4];
						ctx.textAlign = "center";
						ctx.fillStyle = '#C2C2C2';
						let text = this.userInfo?.staff_info?.hos_name || ' '
						ctx.fillText(
							text,
							renderWidth * 0.5, 
							renderHeight * 0.88,
							renderWidth * 1
						);
						ctx.font = parseInt(this.fitSize(28)) + 'px'; //this.textHead[4];
						ctx.textAlign = "center";
						ctx.fillStyle = '#2A2A2A';
						ctx.fillText(
							'长按识别二维码，邀请注册',
							renderWidth * 0.5, 
							renderHeight * 0.94,
							renderWidth * 1
						);
						console.log('font-size:' + parseInt(this.fitSize(32)) + 'px')
						return;
					});
			},
			drawCanvas(id, name,qrPath) {
				wx.createSelectorQuery()
					.in(this)
					.select(id) // 在 WXML 中填入的 id
					.fields({
						node: true,
						size: true
					})
					.exec(async (res) => {
						// Canvas 对象
						this[name] = res[0].node;
						const canvas = res[0].node;

						console.log('this.canvas', this[name])

						// Canvas 画布的实际绘制宽高
						const renderWidth = res[0].width;
						const renderHeight = res[0].height;
						console.log('renderWidth',renderWidth);
						console.log('renderHeight',renderHeight);
						// Canvas 绘制上下文
						const ctx = canvas.getContext("2d");

						// 初始化画布大小
						const dpr = wx.getWindowInfo().pixelRatio;
						console.log(wx.getWindowInfo());
						canvas.width = renderWidth * dpr ;
						canvas.height = renderHeight * dpr ;
						
						ctx.scale(dpr, dpr);
						const tempFilePath = qrPath;



						const images = [
							`${this.imgUrl}bg.png`,
							this.userInfo.avatar, //`${this.imgUrl}v3_mine_person.png`,
							tempFilePath,

						];
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
									ctx.arc(x+xw/2,y+xy/2,xw/2,0,2*Math.PI)
									
									
									ctx.clip()
									ctx.closePath()
									ctx.drawImage(imgCtx, x, y, xw, xy);
									ctx.restore()
									console.log(imgSrc);
									resolve();
								};
							});
						};
						let image1 = canvas.createImage();
						let image2 = canvas.createImage();

						let image3 = canvas.createImage();
						// let image4 = canvas.createImage();
						//背景
						await promiseImg(
							image1,
							renderWidth * 0,
							renderHeight * 0,
							renderWidth * 1,
							renderHeight * 1,
							images[0]
						);
						ctx.save()
						// 头像  不适用await - 临时文件有可能失效导致画图失败
						await promiseImg1(
							image2,
							renderWidth * 0.38,
							renderHeight * 0.05,
							renderWidth * 0.26,
							renderWidth * 0.26,
							images[1]
						);
						
						//二维码
						await promiseImg(
							image3,
							renderWidth * 0.13,
							renderHeight * 0.32,
							renderWidth * 0.74,
							renderWidth * 0.76,
							images[2]
						);
						// textHead

						ctx.font = parseInt(this.fitSize(32)) + 'px'; //this.textHead[4];
						ctx.textAlign = "center";
						ctx.fillStyle = '#2A2A2A';
						ctx.fillText(
							this.userInfo.nickname,
							renderWidth * 0.5,
							renderHeight * 0.3,
							renderWidth * 1
						);
						ctx.font = parseInt(this.fitSize(28)) + 'px'; //this.textHead[4];
						ctx.textAlign = "center";
						ctx.fillStyle = '#2A2A2A';
						let text = id === '#myCanvas0' ? '邀请医生注册' : id === '#myCanvas1' ? '长按识别二维码，邀请注册' :
							'邀请销售代表注册'
						ctx.fillText(
							text,
							renderWidth * 0.5,
							renderHeight * 0.94,
							renderWidth * 1
						);
						console.log('font-size:' + parseInt(this.fitSize(28)) + 'px')
						return;
					});
			},
			// completeQrcode() { //二维码
			// 	return new Promise((resolve, reject) => {

			// 		this.$request({
			// 			url: "/ApiV2/Mobile/Goods/miniShareCode",
			// 			method: "get",
			// 			data: {
			// 				goods_id: 10,
			// 			},
			// 		}).then((res) => {
			// 			resolve(res.data.url);
			// 		});
			// 	});
			// },
			listClick(index) {
				this.$emit('click', index);
			},
			change(e) {
				let current = e.detail.current;
				this.uCurrent = current;
				// 发出change事件，表示当前自动切换的index，从0开始
				this.$emit('change', current);

			},
			// 头条小程序不支持animationfinish事件，改由change事件
			// 暂不监听此事件，因为不再给swiper绑定uCurrent属性
			animationfinish(e) {
				// #ifndef MP-TOUTIAO
				// this.uCurrent = e.detail.current;
				// #endif
			}
		}
	};
</script>

<style lang="scss" scoped>
	@mixin vue-flex($direction: row) {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: $direction;
		/* #endif */
	}

	.u-swiper-wrap {
		position: relative;
		overflow: hidden;
		transform: translateY(0);
	}

	.u-swiper-image {
		display: flex;
		justify-content: center;
		width: 100%;
		padding-top: 40rpx;
		will-change: transform;
		background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_mine_qrbg.png");
		background-repeat: no-repeat;
		background-size: 100%;
		position: relative;
		height: 100%;
		/* #ifndef APP-NVUE */
		// display: block;
		/* #endif */
		/* #ifdef H5 */
		pointer-events: none;

		/* #endif */
		.u-swiper-image-foot {
			width: 100%;
			position: absolute;
			bottom: 0;
			display: flex;
			justify-content: space-around;
			padding: 42rpx 0;

			.wx {
				margin: 0;
				padding: 0;
				color: #C2C2C2;
				font-size: 24rpx;
				background: transparent;
				line-height: 1.4;

				&::after {
					border: none;
				}
			}
		}
	}

	.u-swiper-indicator {
		padding: 0 24rpx;
		position: absolute;
		@include vue-flex;
		width: 100%;
		z-index: 1;
	}

	.u-indicator-item-rect {
		width: 26rpx;
		height: 8rpx;
		margin: 0 6rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.u-indicator-item-rect-active {
		background-color: rgba(255, 255, 255, 0.8);
	}

	.u-indicator-item-dot {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.u-indicator-item-dot-active {
		background-color: rgba(255, 255, 255, 0.8);
	}

	.u-indicator-item-round {
		width: 14rpx;
		height: 14rpx;
		margin: 0 6rpx;
		border-radius: 20rpx;
		transition: all 0.5s;
		background-color: rgba(0, 0, 0, 0.3);
	}

	.u-indicator-item-round-active {
		width: 34rpx;
		background-color: rgba(255, 255, 255, 0.8);
	}

	.u-indicator-item-number {
		padding: 6rpx 16rpx;
		line-height: 1;
		background-color: rgba(0, 0, 0, 0.3);
		border-radius: 100rpx;
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.u-list-scale {
		transform-origin: center center;
	}

	.u-list-image-wrap {
		width: 100%;
		height: 100%;
		flex: 1;
		transition: all 0.5s;
		overflow: hidden;
		box-sizing: content-box;
		position: relative;
	}

	.u-swiper-title {
		position: absolute;
		background-color: rgba(0, 0, 0, 0.3);
		bottom: 0;
		left: 0;
		width: 100%;
		font-size: 28rpx;
		padding: 12rpx 24rpx;
		color: rgba(255, 255, 255, 0.9);
	}

	.u-swiper-item {
		@include vue-flex;
		overflow: hidden;
		align-items: center;
		width: 610rpx !important;

	}
</style>
