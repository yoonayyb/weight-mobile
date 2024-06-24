<template>
	<view class="container compare" v-if="loading">
		<!-- <image style="width: 686rpx;height: 278rpx;" :src="`${imgUrl}v3_body_compare_top4.png`" mode=""></image> -->
		<view style="padding: 0 32rpx 0 32rpx;margin-top: 12rpx;">
		<view style="width: 686rpx;height: 240rpx;" class="bg-title u-relative">
			<view class=" u-p-l-52 u-p-r-52 u-flex u-flex-between" style="color:#082723;padding-top: 10rpx">
				<view>{{userInfo.nickname}}</view>
				<view class="u-font-22 text-bold u-flex" style="color:#9B9B9B;">{{info.created_at || ''}} </view>
			</view>
			<view style="margin-left: 66rpx;margin-top: 42rpx;">
				<image style="width: 110rpx;height: 110rpx;border-radius: 50%;" :src="userInfo.avatar" mode=""></image>
			</view>
			
			<view class="u-absolute u-p-r-44 u-p-l-44 u-flex u-flex-column"
				style="right: 0;bottom: 0rpx;width: 50vw;height: 184rpx;color:#fff">
				<view class="u-font-24 u-flex-1 u-flex u-flex-items-end u-p-b-22 u-relative u-flex-end" style="width: 100%;">
					<text>体重</text>
					<text style="width: 146rpx;text-align: center;line-height: 40rpx;"
						class="u-font-40 text-bold u-line-1">{{parseFloat(initDataList[0].data) }}</text>
					<text class="u-m-l-16">kg</text>
				
				</view>
				<view class="u-font-24 u-flex-1 u-flex u-flex-items-end u-p-b-26 u-relative u-flex-end" style="width: 100%;">

					<text>体脂</text>
					<text style="width: 146rpx;text-align: center;line-height: 40rpx;"
						class="u-font-40 text-bold u-line-1">{{parseFloat(initDataList[2].data) }}</text>
					<text class="u-m-l-16">%</text>
					
				</view>

			</view>
		</view>
		</view>
		<view style="padding: 0 32rpx 50rpx 32rpx; border-radius: 24rpx 24rpx 0 0;background: #FAFAFA;">
			<u-gap height="24"></u-gap>
	<!-- 	<view style="padding: 12rpx 0;" class="u-flex">
			<image style="width: 48rpx;height: 48rpx;" :src="`${imgUrl}v3_body_compare_candar.png`" mode=""></image>
			<view style="color:#B2B2B2;font-size: 22rpx;margin-right: 24rpx;font-weight: bold;">{{start}}</view>
			<u-line color="#B2B2B2" />
			<view style="color:#B2B2B2;font-size: 22rpx;margin-left: 24rpx;font-weight: bold;">{{end}}</view>
			<image style="width: 48rpx;height: 48rpx;" :src="`${imgUrl}v3_body_compare_candar.png`" mode=""></image>
		</view> -->
		<view class="list-box">
			<view class="cell u-flex" v-for="(item,index) of initDataList" :key="index">
				<image :src="item.icon" style="width: 48rpx;height: 48rpx" mode="" class="u-m-r-14" />
				<view class="u-font-24" style="color:#707070;min-width: 144rpx;margin-right: 42rpx;">
					<view>{{item.title}} <text v-if="item.textUnit" class="u-font-20 u-m-l-8" style="color:#B2B2B2">({{item.textUnit}})</text> </view>
				
				</view>
				<view style="width: 200rpx;" class="u-line-1 text-bold u-text-center">{{parseFloat(item.data)}}</view>
				
				<view style="flex:1;" class="text-bold u-m-l-12 u-text-center" :style="{color:item.info.levels[item.info.level].color}">
					{{item.info.levels[item.info.level].title || ''}}
					<!-- <image v-if="item.compareValue > 0" :src="`${imgUrl}v3_body_compare_up.png`"
						style="width: 48rpx;height: 48rpx" mode="" />
					<image v-if="item.compareValue < 0" :src="`${imgUrl}v3_body_compare_down.png`"
						style="width: 48rpx;height: 48rpx" mode="" /> -->
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
		bodyFatClass2

	} from '@/utils/consts'
	import shareCanvas from './components/shareCanvas.vue'
	export default {
		data() {
			return {
				tempFilePath:'',
				id:'',
				data:{},
				createdTime:'',
				posterData:{},//海报数据
				 ifShow: false,
				modalshow:false,
				imgLoading:false,
				canvasPath:'',
				scene_id: '',
				scene: '',
				loading: false,
				userInfo: {},
				bodyFatClass2,
				initDataList: [],
				showstar: false,
				showend: false,
				startid: '',
				endid: '',
				info:{},
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
		async onLoad(e) {
			
			if (e.data) this.weightData = JSON.parse(e.data)
			
			this.user_id =  this.$store.state.user.userInfo.id
			if(e.userId) this.user_id = e.userId
			console.log('e',e)
			
			
			// this.createdTime = e.time || this.$common.formatDate(new Date(),false,true)
			await this.initList()
			if (e.data){
				await this.getData(1)
				this.getData(2)
			} 
			if (e.id) {
				this.id = e.id
				this.getData(2)
			}
			if (e.scene) { //扫二维码
				//保存 防止未登录情况
				this.scene = e.scene
				uni.setStorageSync('inviterId', this.scene) //登陆的时候用到
				await this.decodeUrl(e.scene)
				this.getData(2)
			}
			
		},

		async onShareAppMessage() {
			if (uni.getStorageSync('token')) await this.getScene_id()
			// if (!uni.getStorageSync('token')) {
			//   return this.$common.toast('请先登陆')
			// }
			
			return {
				title: '分享报告',
				path: `/packages/bodyFatScale/myHealthReport/bfp?id=${this.id}&scene_id=${this.scene_id}&userId=${this.user_id}`,
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
						this.id = res.data.id
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
					list: this.initDataList,
					avatar:this.info.avatar,
					nickname:this.info.nickname,
					created_at:this.info.created_at,
					id:this.info.id
				}
				if(this.user_id)posterData.user_id = this.user_id
				uni.navigateTo({
					url:'/packages/bodyFatScale/myHealthReport/bfpCanvas?posterData=' + encodeURIComponent(JSON.stringify(posterData)) 
				})
				return 
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
			getData(type) {
			return new Promise((resolve,reject)=>{
				let params = {data:{}}
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
					
				}
				if (this.user_id && this.user_id !== 'undefined') params.data.user_id = this.user_id
				this.loading = false
				this.$request(params).then((res) => {
					let {
						data
					} = res
					console.log(11111,data)
					this.loading = true
					
					this.info = data
					this.id = this.info.id
					this.percent = data.weight_info?.scale
					this.userInfo = {avatar:data.avatar,nickname:data.nickname,day:data.day}
					this.bfp = parseFloat(this.info.bfp || 0)
					let a = parseFloat(data.weight)
					this.info.weight_info.range.push(a)
					let range = this.info.weight_info.range.map((res) => +res).sort()
					resolve()
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
						{
							data: data.protein,
							field: 'protein',
							show: false,
							info: data.protein_info
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
							data: data.vfal,
							field: 'vfal',
							show: false,
							info: data.vfal_info
						},
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
					let posterData = {
						list: this.initDataList,
						avatar:this.info.avatar,
						nickname:this.info.nickname,
						created_at:this.info.created_at,
						id:this.info.id
					}
					if(this.user_id)posterData.user_id = this.user_id
					this.ifShow = true // 显示画布
						 
					//解决方法：可以将绘制方法写在异步方法中;
					//同时要注意组件的生命周期，确保实例挂载成功之后再执行,一般延时50ms（经验值，与硬件处理速度有关）执行即可。
					setTimeout(() => {
					  this.$refs.shareCanvas.init(posterData,2)
					}, 100)
					
				}).catch(err=>{
					this.loading = true
				})
			})
				
			},
			constructureData() {

			},

			initList() {
				return new Promise((resolve) => {
					this.bodyFatClass2.forEach((item, i) => {
						this.initDataList.push({
							icon: `${this.imgUrl}icon-heal-${item.field}.png`,
							title: item.title,
							data:'',
							show: false,
							textUnit:item.textUnit
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