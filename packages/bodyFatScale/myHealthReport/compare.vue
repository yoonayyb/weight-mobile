<template>
	<view class="container compare" v-if="loading">
		<!-- <image style="width: 686rpx;height: 278rpx;" :src="`${imgUrl}v3_body_compare_top4.png`" mode=""></image> -->
		<view style="padding: 0 32rpx 0 32rpx;margin-top: 12rpx;">
		<view style="width: 686rpx;height: 240rpx;" class="bg-title u-relative">
			<view class=" u-p-l-52 u-p-r-52 u-flex u-flex-between" style="color:#082723;padding-top: 10rpx">
				<view>{{userInfo.nickname}}</view>
				<view class="u-font-32 text-bold u-flex" style="color: #00B8A2;">{{userInfo.day || 0}} <text
						style="color:#082723" class="u-font-24 u-m-l-16">天</text></view>
			</view>
			<view style="margin-left: 66rpx;margin-top: 40rpx;">
				<image style="width: 110rpx;height: 110rpx;border-radius: 50%;" :src="userInfo.avatar" mode=""></image>
			</view>
			
			<view class="u-absolute u-p-r-44 u-p-l-44 u-flex u-flex-column"
				style="right: 0;bottom: 0rpx;width: 50vw;height: 184rpx;color:#fff">
				<view class="u-font-24 u-flex-1 u-flex u-flex-items-end u-p-b-22 u-relative" style="width: 100%;">
					<text>体重</text>
					<text style="width: 146rpx;text-align: center;line-height: 40rpx;"
						class="u-font-40 text-bold u-line-1">{{initDataList[0].compareValue}}</text>
					<text class="u-m-l-16">kg</text>
					<image v-if="initDataList[0].compareValue > 0" style="width: 48rpx;height: 48rpx;position: absolute;right: 0;bottom: 18rpx;"
						:src="`${imgUrl}v3_body_compare_u.png`" mode=""></image>
					<image v-if="initDataList[0].compareValue < 0" style="width: 48rpx;height: 48rpx;position: absolute;right: 0;bottom: 18rpx;"
						:src="`${imgUrl}v3_body_compare_d.png`" mode=""></image>
				</view>
				<view class="u-font-24 u-flex-1 u-flex u-flex-items-end u-p-b-26 u-relative" style="width: 100%;">

					<text>体脂</text>
					<text style="width: 146rpx;text-align: center;line-height: 40rpx;"
						class="u-font-40 text-bold u-line-1">{{initDataList[2].compareValue}}</text>
					<text class="u-m-l-16">%</text>
					<image v-if="initDataList[2].compareValue > 0" style="width: 48rpx;height: 48rpx;position: absolute;right: 0;bottom: 22rpx;"
						:src="`${imgUrl}v3_body_compare_u.png`" mode=""></image>
					<image v-if="initDataList[2].compareValue < 0" style="width: 48rpx;height: 48rpx;position: absolute;right: 0;bottom: 22rpx;"
						:src="`${imgUrl}v3_body_compare_d.png`" mode=""></image>
				</view>

			</view>
		</view>
		</view>
		<view style="padding: 0 32rpx 50rpx 32rpx; border-radius: 24rpx 24rpx 0 0;background: #FAFAFA;">
		<view style="padding: 12rpx 0;" class="u-flex">
			<image style="width: 48rpx;height: 48rpx;" :src="`${imgUrl}v3_body_compare_candar.png`" mode=""></image>
			<view style="color:#B2B2B2;font-size: 22rpx;margin-right: 24rpx;font-weight: bold;">{{start}}</view>
			<u-line color="#B2B2B2" />
			<view style="color:#B2B2B2;font-size: 22rpx;margin-left: 24rpx;font-weight: bold;">{{end}}</view>
			<image style="width: 48rpx;height: 48rpx;" :src="`${imgUrl}v3_body_compare_candar.png`" mode=""></image>
		</view>
		<view class="list-box">
			<view class="cell u-flex" v-for="(item,index) of initDataList" :key="index">
				<image :src="item.icon" style="width: 48rpx;height: 48rpx" mode="" class="u-m-r-14" />
				<view class="u-font-24" style="color:#707070;min-width: 144rpx;margin-right: 42rpx;">
					<view>{{item.title}}</view>
					<view>{{item.textUnit}}</view>
				</view>
				<view style="width: 100rpx;" class="u-line-1 text-bold">{{item.start}}</view>
				<view style="width: 100rpx;" class="u-line-1 text-bold u-m-l-12">{{item.end}}</view>
				<view style="flex:1;" class=" text-bold u-m-l-12 u-flex">
					<view style="width: 100rpx;font-weight: normal;" class=" u-line-1" :style="{'color':item.compareValue>0?'#FF8F2D':'#00B8A2'}">{{item.compareValue || 0}} </view>
					<image v-if="item.compareValue > 0" :src="`${imgUrl}v3_body_compare_up.png`"
						style="width: 48rpx;height: 48rpx" mode="" />
					<image v-if="item.compareValue < 0" :src="`${imgUrl}v3_body_compare_down.png`"
						style="width: 48rpx;height: 48rpx" mode="" />
				</view>


			</view>
		</view>
		</view>
		<!-- <u-picker v-model="showstar" @confirm="confirm()" mode="time" :default-time="start" :params="params"></u-picker>
	<u-picker v-model="showend" @confirm="confirm1()" mode="time" :default-time="end" :params="params"></u-picker> -->
		<image v-if="loading" @click="saveImg" :src="`${imgUrl}组 16344@2x (2)(1).png`" class="fixed_box" mode="">
		</image>
		
		<shareCanvas ref="shareCanvas" @tempFilePath="(e)=>{tempFilePath = e}"  :ifShow.sync="ifShow"></shareCanvas>
		<u-modal v-model="modalshow" mask-close-able :show-confirm-button="false" :show-title="false" width="382">
			<view class=" u-flex-column"  style="width: 382rpx; height:140rpx;background: rgba(0,0,0,0.5);justify-content: space-evenly;">
				<template v-if="imgLoading">
					<u-loading style="text-align: center;display: block;" color="#00B8A2" size="48" mode="circle"></u-loading>
					<view style="color: #fff;text-align: center;">生成海报中...</view>
				</template>
				<!-- <template v-else>
					<u-icon style="text-align: center;display: block;" size="48" color="#00B8A2" name="checkmark-circle"></u-icon>
					<view style="color: #fff;text-align: center;">已成功保存到本地相册</view>
				</template> -->
				
			</view>
		</u-modal>
	</view>
</template>

<script>
	import {
		bodyFatClass

	} from '@/utils/consts'
	import shareCanvas from './components/shareCanvas.vue'
	export default {
		data() {
			return {
				tempFilePath:'',
				posterData:{},//海报数据
				 ifShow: false,
				modalshow:false,
				imgLoading:false,
				canvasPath:'',
				scene_id: '',
				scene: '',
				loading: false,
				userInfo: {},
				bodyFatClass,
				initDataList: [],
				showstar: false,
				showend: false,
				startid: '',
				endid: '',
				user_id: '',
				start: this.$u.timeFormat(new Date().getTime() - 15 * 24 * 60 * 60 * 1000, 'yyyy-mm-dd hh:MM:ss'),
				end: this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss'),
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
			}
		},
		async onLoad(option) {
			
			this.initList()
			if (option.startid) {
				this.startid = option.startid
				this.endid = option.endid
			}
			if (option.user_id) {
				this.user_id = option.user_id
			}
			if (option.scene_id) { //统一在mixins里面绑定
				// this.scene_id = option.scene_id
			}
			if (option.scene) { //扫二维码
				//保存 防止未登录情况
				this.scene = option.scene
				uni.setStorageSync('inviterId', this.scene) //登陆的时候用到
				await this.decodeUrl(option.scene)
			}
			this.getData()
		},

		async onShareAppMessage() {
			if (uni.getStorageSync('token')) await this.getScene_id()
			// if (!uni.getStorageSync('token')) {
			//   return this.$common.toast('请先登陆')
			// }
			return {
				title: '分享报告',
				path: `/packages/bodyFatScale/myHealthReport/compare?startid=${this.startid}&endid=${this.endid}&scene_id=${this.scene_id}&user_id=${this.user_id}`,
				imageUrl:this.tempFilePath
				
			}
		},
		components: {
			shareCanvas
		},
		methods: {
			decodeUrl(scene_id) {
				return new Promise((resolve, reject) => {
					this.$request({
						url: '/ApiV2/Mobile/Tourists/decodeScene',
						loading: true,
						errMsg: true,
						data: {
							scene_id
						}
					}).then((res) => {
						//获取页面需要的数据
						console.log('res: ', res)
						this.startid = res.data.id_A
						this.endid = res.data.id_B
						this.user_id = res.data.user_id
						//   this.id = res.data.gid
						//   this.inviterId = res.data.user_id || ''

						resolve()
					})
				})

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
			saveImg() {
				// this.ifShow = true // 显示画布
					 
				//解决方法：可以将绘制方法写在异步方法中;
				//同时要注意组件的生命周期，确保实例挂载成功之后再执行,一般延时50ms（经验值，与硬件处理速度有关）执行即可。
				
			
				let posterData = {
					...this.posterData,
					id_A: this.startid,
					id_B: this.endid,
				}
				if(this.user_id)posterData.user_id = this.user_id
				uni.navigateTo({
					url:'/packages/bodyFatScale/myHealthReport/compareCanvas?posterData=' + JSON.stringify(posterData)
				})
				
			},
			saveCanvas() {
				this.imgLoading = true
				this.modalshow = true
				
				
				//请求接口
				this.$request({
					url:'/ApiV3/Mobile/BodyFatScaleWolai/poster',
					method:'get',
					errMsg:true,
					data:{
						id_A:this.startid,
						id_B:this.endid,
						user_id:this.user_id
					}
				}).then(res=>{
					//把网络路径转换成本地路径
					this.canvasPath = res.data.url
					this.modalshow = false
					this.imgLoading = false
					uni.previewImage({
						urls:[res.data.url]
					})
					return
					let that = this
					uni.getImageInfo({
						src:res.data.url,// that.canvasPath,
						success(res) {
							//保存canvas H5不支持uni.saveImageToPhotosAlbum
					
							uni.saveImageToPhotosAlbum({
								filePath: res.path,
								success: function() {
									console.log("save success");
									that.imgLoading = false
									setTimeout(()=>{
										that.modalshow = false
									},2000)
								},
								fail() {
									that.modalshow = false
									this.imgLoading = false
									that.$common.toast('保存失败')
									
								}
							});
						},
						fail() {
							that.modalshow = false
							this.imgLoading = false
							that.$common.toast('图片路径生成失败')
							
						}
					})
				}).catch(err=>{
					this.modalshow = false
					this.imgLoading = false
				})
				


			},
			getDaysDifference(date1, date2) {
				// 将日期字符串转换为日期对象
				const d1 = new Date(date1);
				const d2 = new Date(date2);

				// 计算两个日期的时间戳差值（毫秒数）
				const timeDiff = Math.abs(d2.getTime() - d1.getTime());

				// 将毫秒数转换为天数
				const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

				return daysDiff;
			},
			
			compare(item) {
				let start = item.start || 0
				let end = item.end || 0
				//type 1 上升 2 下降 3 相等
				this.$set(item, 'type', parseFloat((end - start).toFixed(1)) > 0 ? 1 : parseFloat((end - start).toFixed(1)) < 0 ? 2 : 3)

				return parseFloat((end - start).toFixed(1))
			},
			getData() {
				this.loading = false
				let data = {
					id_A: this.startid,
					id_B: this.endid,
				}
				if (this.user_id) data.user_id = this.user_id
				this.$request({
					url: '/ApiV3/Mobile/BodyFatScaleWolai/contrast',
					method: 'get',
					loading: true,
					data
				}).then(({
					data
				}) => {
					this.loading = true
					
					this.start = data.start_at
					this.end = data.end_at
					this.userInfo = {avatar:data.avatar,nickname:data.nickname,day:data.day}
					this.posterData = data
					// this.$set(this.initDataList,'start',Object.keys(start).length?start:{})
					// this.$set(this.initDataList,'end',Object.keys(end).length?end:{})
					// this.constructureData(start)
					this.initDataList.forEach(res => {
						if (res.field === 'weight') {
							res.start = parseFloat(data.list.weight[0]) || 0
							res.end = parseFloat(data.list.weight[1]) || 0
							res.compareValue = parseFloat(data.list.weight[2]) || 0
							res.textUnit = data.list.weight[3] || ''
						}
						if (res.field === 'bmi') {
							
							res.start = parseFloat(data.list.bmi[0]) || 0
							res.end = parseFloat(data.list.bmi[1]) || 0
							res.compareValue = parseFloat(data.list.bmi[2]) || 0
							res.textUnit = data.list.bmi[3] || ''
						}
						if (res.field === 'bfp') {
							
							res.start = parseFloat(data.list.bfp[0]) || 0
							res.end = parseFloat(data.list.bfp[1]) || 0
							res.compareValue = parseFloat(data.list.bfp[2]) || 0
							res.textUnit = data.list.bfp[3] || ''
						}
						if (res.field === 'vfal') {
							
							res.start = parseFloat(data.list.vfal[0]) || 0
							res.end = parseFloat(data.list.vfal[1]) || 0
							res.compareValue = parseFloat(data.list.vfal[2]) || 0
							res.textUnit = data.list.vfal[3] || ''
						}
						if (res.field === 'water') {
							
							res.start = parseFloat(data.list.water[0]) || 0
							res.end = parseFloat(data.list.water[1]) || 0
							res.compareValue = parseFloat(data.list.water[2]) || 0
							res.textUnit = data.list.water[3] || ''
						}
						if (res.field === 'bmr') {
							
							res.start = parseFloat(data.list.bmr[0]) || 0
							res.end = parseFloat(data.list.bmr[1]) || 0
							res.compareValue = parseFloat(data.list.bmr[2]) || 0
							res.textUnit = data.list.bmr[3] || ''
						}
						if (res.field === 'smkg') {
						
							res.start = parseFloat(data.list.smkg[0]) || 0
							res.end = parseFloat(data.list.smkg[1]) || 0
							res.compareValue = parseFloat(data.list.smkg[2]) || 0
							res.textUnit = data.list.smkg[3] || ''
						}
						if (res.field === 'protein') {
							res.start = parseFloat(data.list.protein[0]) || 0
							res.end = parseFloat(data.list.protein[1]) || 0
							res.compareValue = parseFloat(data.list.protein[2]) || 0
							res.textUnit = data.list.protein[3] || ''
						}
					})
					
					let posterData = {
						...this.posterData,
						id_A: this.startid,
						id_B: this.endid,
					}
					if(this.user_id)posterData.user_id = this.user_id
					this.ifShow = true // 显示画布
					
					//解决方法：可以将绘制方法写在异步方法中;
					//同时要注意组件的生命周期，确保实例挂载成功之后再执行,一般延时50ms（经验值，与硬件处理速度有关）执行即可。
					setTimeout(() => {
					  this.$refs.shareCanvas.init(posterData,1)
					}, 100)
				
				}).catch(err => {
					this.loading = true
				})
			},
			constructureData() {

			},

			initList() {
				return new Promise((resolve) => {
					this.bodyFatClass.forEach((item, i) => {
						this.initDataList.push({
							icon: `${this.imgUrl}icon-heal-${item.field}.png`,
							title: item.title,
							field: item.field,
							start: 0,
							end: 0,
							compareValue:0,
							show: false,
						})
					})
					setTimeout(() => {
						resolve()
					}, 100)
				})
			},
			confirm(val) {
				this.start = val.year + '-' + val.month + '-' + val.day + ' ' + val.hour + ':' + val.minute + ':' +
					val.second
				this.getData()
			},
			confirm1(val) {
				this.end = val.year + '-' + val.month + '-' + val.day + ' ' + val.hour + ':' + val.minute + ':' +
					val.second
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scope>
	.container {
		background: #FAFAFA;
		min-height: 100vh;
		padding-bottom:200rpx;
		// padding: 0 32rpx;
		// padding-bottom: 50rpx;
		
		.fixed_box {
			height: 124rpx;
			width: 124rpx;
			position: fixed;
			right: 44rpx;
			bottom: 150rpx;
		}

		.pop-box {
			display: flex;
			justify-content: space-around;
			padding: 100rpx 0;

			.pop-box-weixin {
				position: relative;

				button {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					opacity: 0;
				}
			}
		}

		.bg-title {
			background: url('https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/v3_body_compare_top5.png');
			background-size: 100%;
			background-repeat: no-repeat;
			
		}

		.list-box {
			background: #FFFFFF;
			box-shadow: 0rpx 40rpx 60rpx 2rpx rgba(211, 211, 211, 0.1);
			border-radius: 24rpx 24rpx 24rpx 24rpx;
			opacity: 1;
			padding: 20rpx 0 32rpx 50rpx;

			.cell {
				margin-bottom: 12rpx;
				margin-top: 12rpx;
				min-height: 130rpx;

				border-bottom: 2rpx solid rgba(0, 184, 162, 0.05);

				&:last-child {
					border: none
				}
			}
		}
	}
</style>