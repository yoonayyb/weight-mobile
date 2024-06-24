<template>
	<view class="connect-wrap u-flex u-row-between">

		<animate-wave :connecting="!connecting"></animate-wave>
		<block>
			<view class="u-flex-column u-flex-items-center u-absolute" style="top: 20%;">
				<view class="u-font-32 text-bold u-m-b-16">{{!blueStatus?'请开启手机蓝牙':'请光脚踩亮秤面后上称'}}</view>
				<block v-if="!blueStatus">
					<view class="u-font-28 u-m-b-8" style="color:#C2C2C2">请将体脂秤放在平坦的地面，开启手机蓝牙</view>
					<view class="u-font-28 u-m-b-8" style="color:#C2C2C2">安卓手机需要打开定位功能</view>
				</block>
				<view v-else class="u-font-28 u-m-b-8" style="color:#C2C2C2">直到体脂秤的数字趋于稳定后，完成测量</view>
			</view>
			<image v-if="!blueStatus" :src="`${imgUrl}tizhicheng.png`" mode="widthFix" />
			<image v-else :src="`${imgUrl}tizhicheng1.png`" mode="widthFix" />
		</block>
		<!-- <view class="u-font-16" style="width: 100%">
			<image :src="`${imgUrl}icon-b-wifi.png`" mode="widthFix" :style="[{ opacity: connecting ? 1 : 0 }]" />
			<image :src="`${imgUrl}icon-connect-f.png`" mode="widthFix" />
			<block v-if="!connecting">
				<view class="u-m-b-10" @click="openBlue">1.请打开手机<text>蓝牙</text></view>
				<view>2.体脂秤保持电量充足，<text>点亮体脂秤屏幕</text></view>
			</block>
			<block v-else>
				<view class="u-m-b-10 text-center"><text>测量体重中，请不要下秤</text></view>
				<view class="text-center">等待数据稳定后，系统提示在下秤</view>
			</block>
		</view> -->
		<view class="btn">
			<my-button width="300" height="90" fontSize="32"
				@click="$u.route('/packages/bodyFatScale/myHealthReport/history?userId='+userId)">历史数据</my-button>
		</view>
	</view>
</template>

<script>
	let icommon = requirePlugin('ICDeviceManager')
	let ICDeviceManager = new icommon.ICDeviceManager()

	import MyButton from '@/components/myButton.vue'
	import animateWave from './animate-wave.vue'
	export default {
		components: {
			MyButton,
			animateWave
		},
		data() {
			return {
				tipNum: '',
				blueStatus:this.$store.state.user.blueStatus,
				searchMacAddr: '0B:76:1C:C1:2D:DC',
				weightData: {},
				onshowType: true,
				connecting: false,
				timer: '',
				weight: '',
				resistance: '',
				advertisData: '',
				i: 0,
				showTip: 0,
				userId: '',
				navigateNum: 1 //次数大于1不在接收数据跳转，防止多次跳转
			}
		},
		computed: {
			// ...mapState({
			// 	// messageList: (state) => state.message.currentMessageList,
			// 	blueStatus: (state) => state.user.blueStatus
			// }),
			
		},
		watch: {
			'$store.state.user.blueStatus'(newValue, oldValue) {
				this.blueStatus = newValue
			}
		},
		onLoad(option) {
			console.log(111, option)
			if (option.userId) this.userId = option.userId
			// 测试数据
			// let d = {
			//   weight: 60,
			//   impendances: [0, 0, 0, 0, 0]
			// }
			// uni.navigateTo({ url: `/packages/bodyFatScale/myHealthReport/index?data=${JSON.stringify(d)}` })
			// this.onshowType = false
			this.initBlue()
		},
		onShow() {
			setTimeout(() => {
				this.scanBlue()

			}, 1000)
			this.navigateNum = 1 // 页面显示 重置
			this.showTip++
			// this.openBlue()
		},
		onHide() {
			uni.hideLoading()
			clearInterval(this.timer)
		},
		onUnload() {
			uni.hideLoading()
			console.log('离开了')
			clearInterval(this.timer)
		},
		methods: {
			//是否授权蓝牙
			getBluetooth() {

				let that = this
				wx.getSetting({
					success(scope) {
						if (!scope.authSetting["scope.bluetooth"]) {
							wx.authorize({
								scope: "scope.bluetooth",
								success() {
									console.log("同意授权");

								},
								fail(e) {
									console.log("拒绝授权", e);
									uni.showModal({
										title: "温馨提示",
										content: "请开启小程序蓝牙权限",
										confirmText: "确定",
										success: (res) => {
											if (res.confirm) {
												console.log("用户点击确定");
												uni.openSetting({
													success(res) {

														if (res.authSetting[
																'scope.bluetooth']) {
															// that.blueStatus = true
															that.$store.commit(
																'setBlueStatus',
																true)
															uni.restartMiniProgram({
																path: '/pages/tabbar/projects',
																complete: (
																	res) => {
																		console
																			.log(
																				'重启小程序',
																				res
																				)
																	}
															})
															// that.$common.toast('授权后请重新打开小程序')
														}
													}
												});
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
							// that.blueStatus = true

							if (that.showTip > 1 || uni.getStorageSync('blueStauts') == 1) {
								uni.setStorageSync('blueStauts', 1)
								// uni.restartMiniProgram({
								// 	path:'/pages/tabbar/projects',
								// 	complete:(res)=>{
								// 		console.log('重启小程序',res)
								// 	}
								// })
								// that.$common.toast('授权后请重新打开小程序')
							}

						}
					},
				});
			},
			initBlue() {
				try{
					ICDeviceManager.init((isInit) => {
						console.log('初始化状态: ', isInit)
						// if(!isInit)
						// 除setBleStateCallback，updateUserInfo, setDelegate,
						// 其它接口只有初始化完以后才能调用
						// 其它接口可以在任意地方调用，无需一定要在这里面调用
						let that = this
					
						// 设置蓝牙状态代理监听
						ICDeviceManager.setBleStateCallback((state) => {
							console.log('蓝牙状态：' + state)
							// this.blueStatus = false
							this.$store.commit('setBlueStatus', false)
							if (state == 4) {
								// this.blueStatus = true
								this.$store.commit('setBlueStatus', true)
								this.scanBlue()
								// this.timer = setInterval(() => {
								//   this.scanBlue()
								// }, 1500)
							} else if (state == 2) {
								this.$common.toast('应用未获取蓝牙授权')
					
							}else if (state == 3) {
								this.$common.toast('蓝牙关闭')
					
							} else if (state == 0) {
								this.$common.toast('未知状态')
							} else if (state == 1) {
								this.$common.toast('手机不支持BLE')
							} else if (state == 5) {
								this.$common.toast('蓝牙异常建议开关蓝牙或重启手机')
							}
						})
						// 设置连接状态和数据代理监听
						ICDeviceManager.setDelegate({
							onDeviceConnectionChanged: (device, state) => {
								console.log('设备连接状态：' + state)
					
							},
							onReceiveWeightData: (device, model) => {
								try{
									const pages = getCurrentPages()
									let page = pages[pages.length - 1];
									console.log('onReceiveWeightData', model)
														
									console.log('page', page)
									if (!page.route.includes('packages/bodyFatScale/connect/connect')) return
									
									this.connecting = true
									if (this.tipNum = 1) {
										uni.showLoading({
											title: '正在测量请稍等...'
										})
									}
									this.tipNum++
									if (model.isStabilized && this.navigateNum == 1) {
														
										clearInterval(this.timer)
										this.navigateNum++
										this.weightData = {
											weight: model.weight_kg,
											impendances: model.impendences
										}
										uni.navigateTo({
											url: `/packages/bodyFatScale/myHealthReport/bfp?data=${JSON.stringify(this.weightData)}&userId=${this.userId}`
										})
										
										
									}
								}catch(e){
									//TODO handle the exception
									this.$request({
										  url:'/ApiV3/Mobile/ClientLog/write',
										  method:'POST',
										  data:{
											  type:'ERROR',
											  content:JSON.stringify(e)
										  }
									}).then(res=>{
										 console.log('监听报错',e )
									})
								}
								
							},
							onReceiveWeightHistoryData: (macAddr, code) => {
								console.log('历史数据: ', macAddr, code)
							}
						})
					})
				}catch(e){
					//TODO handle the exception
					this.$request({
						  url:'/ApiV3/Mobile/ClientLog/write',
						  method:'POST',
						  data:{
							  type:'ERROR',
							  content:JSON.stringify(e)
						  }
					}).then(res=>{
						 console.log('initBlue初始化报错',e )
					})
				}
				
				// }
			},
			scanBlue() {
				console.log('执行到scanBlue', ICDeviceManager.isInit())
				// if(ICDeviceManager.isInit())this.blueStatus = true

				// console.log('执行到scanBlue')
				
				try{
					this.getBluetooth()
					ICDeviceManager.scanDevice((model) => {
						console.log('model', model)
						// this.blueStatus = true
						uni.hideLoading()
						if (model.macAddr) {
							// 找到设备后，停止扫描。调用scanDevice后，需开发者自己调用stopScan才会停止扫描，否则将会一直扫描，特例：蓝牙关闭后也会自己停止扫描
							ICDeviceManager.stopScan()
							// 添加回调成功不代表连接成功，这里只是说明设备已经添加到插 件了，连接状态看onDeviceConnectionChanged
							ICDeviceManager.addDevice(model.macAddr, (macAddr, code) => {
								console.log('add device code=' + code)
								this.connecting = true
								if (code == 0) {
									this.tipNum = 1
									// uni.hideLoading()
									// uni.showLoading({
									// 	title: '设备添加成功,请上称'
									// })
									console.log('设备添加成功')
								} else if (code == 2) {
									this.tipNum = 1
									// uni.hideLoading()
									// uni.showLoading({
									// 	title: '设备已存在,请上称'
									// })
					
									// console.log('设备添加失败，设备已存在')
								}
							})
						} else {
							
							this.$common.toast('连接失败')
						}
					})
				}catch(e){
					//TODO handle the exception
					this.$request({
						  url:'/ApiV3/Mobile/ClientLog/write',
						  method:'POST',
						  data:{
							  type:'ERROR',
							  content:JSON.stringify(e)
						  }
					}).then(res=>{
						 console.log('扫描设备报错',e )
					})
				}	
				
			},
			// 以下代码已不再使用
			openBlue() {
				uni.openBluetoothAdapter({
					success: (res) => {
						this.connecting = true
						uni.startBluetoothDevicesDiscovery({
							allowDuplicatesKey: false,
							interval: 0,
							success: (res) => {
								uni.showLoading({
									title: '正在搜索设备',
									mask: true
								})
								this.timer = setInterval(() => {
									this.i++
									this.getBlue()
								}, 1000)
								setTimeout(() => {
									uni.hideLoading()
								}, 60000)
							}
						})
					},
					fail: () => {
						uni.showToast({
							title: '请开启蓝牙',
							icon: 'none'
						})
					}
				})
			},
			getBlue() {
				uni.getBluetoothDevices({
					success: (res) => {
						console.log('res: ', res)

						let devices = res.devices
						devices.map((item) => {
							item.advertisData = this.ab2hex(item.advertisData)
						})
						let arr = devices.filter((item) => {
							return (
								item.advertisData.length == 30 &&
								item.advertisData.substr(0, 2) == 'c0' &&
								item.advertisData.indexOf('0002') > -1
							)
						})
						if (arr.length == 0) return
						uni.stopBluetoothDevicesDiscovery({})
						this.advertisData = arr[0].advertisData
						console.log('this.advertisData: ', this.advertisData)
						let weight = arr[0].advertisData.substr(4, 4)
						let resistance = arr[0].advertisData.substr(8, 4)
						weight = this.hex2int(weight)
						resistance = this.hex2int(resistance)
						console.log('weight: ', weight)
						console.log('resistance: ', resistance)
						if (!resistance) {
							arr = []
							uni.startBluetoothDevicesDiscovery()
							if (this.i % 3 == 0) {
								return uni.showToast({
									title: '请光脚上秤',
									icon: 'none'
								})
							} else {
								return false
							}
						}
						this.weight = weight / 10
						this.resistance = resistance / 10
						uni.hideLoading()
						clearInterval(this.timer)
						uni.stopBluetoothDevicesDiscovery({})
						setTimeout(() => {
							uni.navigateTo({
								url: `/packages/bodyFatScale/myHealthReport/index?weight=${this.weight}&resistance=${this.resistance}`
							})
						}, 1000)
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({
							title: '搜索不到设备',
							icon: 'none'
						})
					}
				})
			},
			ab2hex(buffer) {
				const hexArr = Array.prototype.map.call(new Uint8Array(buffer), function(bit) {
					return ('00' + bit.toString(16)).slice(-2)
				})
				return hexArr.join('')
			},
			hex2int(hex) {
				var len = hex.length,
					a = new Array(len),
					code
				for (var i = 0; i < len; i++) {
					code = hex.charCodeAt(i)
					if (48 <= code && code < 58) {
						code -= 48
					} else {
						code = (code & 0xdf) - 65 + 10
					}
					a[i] = code
				}
				return a.reduce(function(acc, c) {
					acc = 16 * acc + c
					return acc
				}, 0)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.connect-wrap {
		width: 100%;
		height: 100vh;
		background-color: #FFF;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		image {
			width: 500rpx;
			height: 440rpx;
			position: relative;
			z-index: 99;
		}



		.btn {
			position: fixed;
			bottom: 130rpx;
		}

		.text-center {
			text-align: center;
		}
	}
</style>