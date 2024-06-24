<template>
	<view class="container">
		<u-navbar :custom-back="back" :is-fixed="false" :border-bottom="false" back-text=" " back-icon-color="#FFF" title-color="#FFF" title-bold :background="background" title="分享报告"></u-navbar>
		<view class="content">
			<view class="u-absolute" style="top:-69rpx">
			<u-avatar :src="avatar" :size="128"  ></u-avatar>
			</view>
			<view class="u-font-32 text-bold u-m-t-74 u-m-b-8">
				{{nickname}}
			</view>
			<view style="color:#C2C2C2" class="u-font-24 u-m-b-18">
				{{createdTime}}
			</view>
			<view class="text-bold u-m-b-8">
				<text  style="color:#00B8A2;font-size: 72rpx;"> {{parseFloat(info.weight)}}</text> <text class="u-font-40" style="color:#2A2A2A">kg</text>
			</view>
			<view class="u-font-28 u-m-b-16">
				BMI <text class="u-m-l-8">{{parseFloat(info.bmi)}}</text>
			</view>
			<u-grid :col="3" :border="false">
				<u-grid-item v-for="(item,index) of initDataList" :key="index">
					<view class="u-flex" style="color:#C2C2C2">
						<image :src="item.icon" mode="" style="width: 48rpx;height:48rpx" />
						{{item.title}}
					</view>
					<view class="u-m-12">{{parseFloat(item.data)?parseFloat(item.data):'--'}}</view>
					<view>
						<my-button width="180" height="48" :bg="item.info.levels[item.info.level].color">
							<view class="u-font-24">{{item.info.levels[item.info.level].title}}</view>
							
						</my-button>
					</view>
				</u-grid-item>
				
			</u-grid>
		</view>
		<view class="u-flex u-flex-center safe-area-inset-bottom" style="margin-top:122rpx">
			<!-- <u-image 	show-menu-by-longpress width="250rpx" height="250rpx" :src="qrsrc"></u-image> -->
			<image 	show-menu-by-longpress style="width: 250rpx;height:250rpx"  :src="qrsrc"></image>
		</view>
		<!-- <canvas :style="{
			width: widthPx + 'px',
			height: heightPx + 'px',
			
		}" id="myCanvas" type="2d" /> -->
	</view>
</template>

<script>
	import {
		bodyFatClass,
		colorArr,
		colorList
	} from '@/utils/consts'
	import myButton from '@/components/myButton.vue'

	export default {
		data() {
			return {
				widthPx: uni.upx2px(750),
				heightPx: uni.upx2px(1624),
				userInfo: this.$store.state.user.userInfo,
				qrsrc: '',
				background: {
					backgroundColor: 'transparent'
				},
				info: {
					weight:0,
					bmi:0
				},
				createdTime: '',
				id: '',
				userId: '',
				nickname:'',
				avatar:'',
				initDataList: [],
				
			}
		},
		onShareAppMessage() {
			return {
				title: '分享报告',
				path: `/packages/bodyFatScale/myHealthReport/share?id=${this.id}&userId=${this.userId}`,
			
			}
		},
		async onShow(){
			
		},
		async onLoad(options) {
			await this.initList()
			console.log('share options',options)
			if(options.scene){
				await this.decodeUrl(options.scene)
			}else{
				this.id = options.id
				this.userId = options.userId
				
			}
			console.log('this.userInfo',this.userInfo)
			this.getDetail()
			this.getQrcode()
			// this.init()
		},

		methods: {
			back() {
				console.log('自定义返回')
				let pages = getCurrentPages()
				let page = pages[pages.length - 2];
				console.log(page)
				if(page){
					
					let type = page.route == '/pages/login/index'  || page.route == '/myHealthReport/share'
					if (type) {
						
						wx.switchTab({
							url: '/pages/tabbar/projects'
						})
					} else {
						uni.navigateBack()
					}
				}else {
					wx.switchTab({
						url: '/pages/tabbar/projects'
					})
				}
			
			
			},
			decodeUrl(scene_id){
				
				return new Promise((resolve,reject)=>{
					this.$request({
					  url: '/ApiV2/Mobile/Tourists/decodeScene',
					  loading: true,
					  errMsg: true,
					  data:{
						  scene_id
					  }
					}).then((res) => {
					  console.log('res: ', res)
					  this.id = res.data.id
					  this.userId = res.data.user_id
					  resolve()
					})
				})
				
			},
			getQrcode() {
				let data =  {
						id: this.id,
					  }
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: `/ApiV3/Mobile/BodyFatScaleWolai/share`,
					data
				}).then(res => {
					this.qrsrc = res.data.url
				})
			},
			getDetail() {
				const data = {
					id: this.id,
					is_color2:1
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: `/ApiV3/Mobile/BodyFatScaleWolai/detail`,
					data,
					method: 'get',
					loading: true,
					errMsg: true
				}).then((res) => {
					let {
						data
					} = res
					this.info = data
					this.createdTime = data.created_at
					this.nickname = this.info.user_info.nickname
					this.avatar = this.info.user_info.avatar
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
					// let info = res.data
					// this.primaryColor = info.levels[info[`${this.field}_level`][0] - 1].color
					// info[`range`] = info[`${this.field}_range`] && info[`${this.field}_range`].filter(item => item)
					// info[`level`] = info[`${this.field}_level`] && info[`${this.field}_level`].filter(item => item)
				})
			},
			initList() {
				return new Promise((resolve) => {
					bodyFatClass.forEach((item, i) => {
						this.initDataList.push({
							icon: `${this.imgUrl}icon-heal2-${item.field}.png`,
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
		},
		components: {

			myButton,

		}
	}
</script>

<style lang="scss">
	.container {
		background-image: url("https://dev-gp.oss-cn-shenzhen.aliyuncs.com/app_icon/health-share-bg.png");
		background-size: 100%;
		background-repeat: no-repeat;
		min-height: 100vh;
		background-color: #FAFAFA;

		.content {
			width: 686rpx;
			min-height: 988rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			position: relative;
			margin: 0 auto;
			top: 98rpx;
			display: flex;
			flex-direction: column;
			align-items: center;

		}
	}
</style>
