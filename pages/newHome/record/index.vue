<template>
	<view class="container">
		<u-navbar :custom-back="back" back-text=" " title=" ">
			<view class="slot-wrap" @click="show = true">{{time}}</view>
		</u-navbar>
		<block v-if="canvasShow">
			<poster ref="poster"></poster>
		</block>
		<view v-else class="u-flex-column u-flex-items-center" style="margin: 30% auto;">
		<image :src="`${imgUrl}record-empty.png`" style="width: 200rpx" mode="widthFix"></image>
		<view class="u-font-28 u-m-t-16" style="color:#C2C2C2">当日暂无记录</view>
		</view>
		<u-picker @confirm="confirm" v-model="show" mode="time" :params="params"></u-picker>
	</view>
</template>

<script>
	import {
		bodyFatClass1,
	} from '@/utils/consts'
	import poster from './poster.vue'
	export default {
		data() {
			return {
				info:{},
				initDataList:[],
				time: this.$common.formatDate(new Date(),false),
				params: {
					year: true,
					month: true,
					day: true,
					hour: false,
					minute: false,
					second: false
				},
				scene:'',
				qrsrc:'',
				id:27,
				show: false,
				canvasShow:true,
				
			}
		},
		async onShow(){
			// uni.$once('update', async ({data})=>{
			// 	console.log('监听到事件来自 update ，携带参数 msg 为：' + data);
			// 	await this.getQrcode()
			// 	this.getDetail()
			// })
		},
		async onLoad(option) {
			await this.initList()
			console.log('option',option)
			if(option.scene){
				this.scene = option.scene
			}
			await this.getQrcode()
			this.getDetail()
		},
		components: {
			poster
		},
		methods: {
			setUrine(e){
				
					let flag = ''
					if(e === 1) flag = '1+'
					if(e === 2) flag = '2+'
					if(e === 3) flag = '3+'
					if(e === 4) flag = '4+'
					if(e === -1) flag = '无显示'
					if(e === 0) flag = '未检测'
					return flag
				
			},
			back(){
				uni.switchTab({
					url:'/pages/tabbar/projects'
				})
			},
			async confirm(val){
				console.log(val)
				const {year,month,day} = val
				this.time = year+ '-'+month+ '-'+day
				//切换日期只能看自己的数据
				this.scene = ''
				this.initDataList = []
				await this.initList()
				await this.getQrcode()
				this.getDetail()
			},
			getQrcode() {
				let data = {
					date:this.time + ' 00:00:00',
				}
				if(this.scene) data._scene = this.scene
				return new Promise((resolve,reject)=>{
					this.$request({
						url: `/ApiV3/Mobile/Diary/share`,
						loading:true,
						data
					}).then(res => {
						this.qrsrc = res.data.url
						resolve()
					})
				})
				
			},
			getDetail() {
				let data = {
					date:this.time + ' 00:00:00',
				}
				if(this.scene) data._scene = this.scene
				this.$request({
					url: `/ApiV3/Mobile/Diary/allDiary`,
					data,
					method: 'get',
					loading: true,
				}).then(({data})=>{
					this.canvasShow = data.has_diary
					if(!this.canvasShow)return
					this.initDataList[0].data = data.weight
					this.initDataList[0].info = data.weight_info
					this.initDataList[1].data = data.bmi
					this.initDataList[1].info = data.bmi_info
					this.initDataList[2].data = data.bfp
					this.initDataList[2].info = data.bfp_info
					this.initDataList[3].data = data.vfal
					this.initDataList[3].info = data.vfal_info
					this.initDataList[4].data = data.water
					this.initDataList[4].info = data.water_info
					this.initDataList[5].data = data.bmr
					this.initDataList[5].info = data.bmr_info
					this.initDataList[6].data = data.smkg
					this.initDataList[6].info = data.smkg_info
					this.initDataList[7].data = data.protein
					this.initDataList[7].info = data.protein_info
					this.initDataList[8].data = data.drink_info && data.drink_info.value && parseInt(data.drink_info.value) + 'mL'
					this.initDataList[8].info = data.drink_info
					this.initDataList[9].data = data.blood_sugars_info && data.blood_sugars_info.value
					this.initDataList[9].info = data.blood_sugars_info
					this.initDataList[10].data = data.blood_pressure_info && (parseInt(data.blood_pressure_info.max)  + '/' + parseInt(data.blood_pressure_info.min))
					this.initDataList[10].info = data.blood_pressure_info
					this.initDataList[11].data = data.urine_ketone && this.setUrine(data.urine_ketone)
					this.initDataList[11].info = data.urine_ketone && this.setUrine(data.urine_ketone)
					
					this.initDataList[12].data = data.diary_waist
					this.initDataList[12].info = data.diary_waist
					this.initDataList[13].data = data.diary_hipline
					this.initDataList[13].info = data.diary_hipline
					
					this.initDataList = this.initDataList.filter(v=>v.info)
					this.$nextTick(()=>{
						this.$refs.poster.setData(this.initDataList,{avatar:data.user_info.avatar,nickname:data.user_info.nickname,time:this.time},this.qrsrc)
					})
					
					this.time = data.date.split(' ')[0]
				})
				
			},
			initList() {
				return new Promise((resolve) => {
					console.log(111111111,bodyFatClass1)
					
					bodyFatClass1.forEach((item, i) => {
						this.initDataList.push({
							icon: `${this.imgUrl}icon-heal2-${item.field}.png`,
							title: item.title,
							field:item.field,
							data: '',
							info:'',
							show: false,
						})
					})
					console.log(222222,this.initDataList)
					setTimeout(() => {
						resolve()
					}, 100)
				})
			},
		}
	}
</script>

<style lang="scss" scope>
	page{
		padding-bottom:0
	}
	.container {
		background: #f7f7f7;
		min-height: 100vh;

		.u-navbar-content-title {
			.u-title {
				flex: none
			}
		}

		.slot-wrap {
			display: flex;
			align-items: center;
			/* 如果您想让slot内容占满整个导航栏的宽度 */
			// flex: 1; 
			/* 如果您想让slot内容与导航栏左右有空隙 */
			/* padding: 0 30rpx; */
		}
	}
</style>
