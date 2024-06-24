<template>
	<view class="container">
			<ren-calendar endDay="2022-12-09" ref='ren' @changeDate="changeDate" disabledAfter :markDays='markDays' :fillDate="fillDate" :headerBar='true' @onDayClick='onDayClick'></ren-calendar>
		
		<info-template v-show="checkedHidden" title="经期" :icon="false">
			<u-switch active-color="#00B8A2" v-model="checked" @change="checkedChange"></u-switch>
		</info-template>
	</view>
</template>

<script>
	import renCalendar from './ren-calendar/ren-calendar.vue'
	
	import infoTemplate from '@/components/infoTemplate.vue'
	export default {
		props:{
			userId:{
				type:String | Number,
				default:''
			}
		},
		data() {
			return {
				checkedHidden: false,
				checked: false,
				date: '',
				src:`data_icon_period@2x.png`,
				curDate: '',
				markDays: [],
				fillDate:[],//经期数据
				
				
			}
		},
		
		components: {
			
			infoTemplate,
			renCalendar
		},
		onReady() {
			// let today = this.$refs.ren.getToday().date;
			// this.curDate = today;
			// // this.markDays.push(today);
			// console.log('onReady',this.$refs.ren.getToday().date)
		},
		mounted() {
			this.checkedHidden = false
			let today = this.$refs.ren.getToday().date;
			this.curDate = today;
			// console.log('mounted',this.$refs.ren.getToday().date)
			this.getDate()
		},
		methods: {
			changeDate(date){
				let data = {
					date
				} 
				if(this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/DiaryFemalePeriod/date',
					method:'get',
					data
				}).then(({data})=>{
					
					this.fillDate = data.date
					
				})
			},
			getDate(){
				let data = {
					date:this.curDate
				} 
				if(this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/DiaryFemalePeriod/date',
					method:'get',
					data
				}).then(({data})=>{
					
					this.fillDate = data.date
					
				})
			},
			onDayClick(data) {
				//点击日历再显示经期按钮
				this.checkedHidden = true
				this.curDate = data.date;
				this.checked = !!this.fillDate.find(v=>v.date === this.curDate)
				
				
				console.log(this.checked)
				// this.markDays.pop()
				// this.markDays.push(this.curDate);
			},
			//获取选中区间的所有天数 value:['2022-2-1','2022-2-6']
			getBeforeTime (value) {
			      let arr = []
			      let str_b = value[0].split('-')
			      let str_e = value[1].split('-')
			      let date_b = new Date()
			      date_b.setUTCFullYear(str_b[0], str_b[1] - 1, str_b[2])
			      let date_e = new Date()
			      date_e.setUTCFullYear(str_e[0], str_e[1] - 1, str_e[2])
			      let unixDb = date_b.getTime() - 24 * 60 * 60 * 1000
			      let unixDe = date_e.getTime() - 24 * 60 * 60 * 1000
			      for (let j = unixDb; j <= unixDe;) {
			        j = j + 24 * 60 * 60 * 1000
			        arr.push(this.timestampToTime(new Date(parseInt(j))))
			      }
				  console.log(arr);
				  return arr
			      
			    },
			    timestampToTime (date) {
			      var Y = date.getFullYear() + '-';
			      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			      var D = date.getDate();
			      return Y + M + D;
			 },
			 getNextDay(date,num = 1){
			 	let day = date.replaceAll(/\-/g, '/')
			 	let beforeTimestemp = new Date(day).getTime() + num*24*60*60*1000
			 	return this.$common.formatDate( new Date(beforeTimestemp) ,false)
			 },
			 getBeforeDay(date){
			 	let day = date.replaceAll(/\-/g, '/')
			 	let beforeTimestemp = new Date(day).getTime() - 24*60*60*1000
			 	return this.$common.formatDate( new Date(beforeTimestemp) ,false)
			 },
			checkedChange(val) {
				let data = {
					date:[]
				}
				if(this.userId) data.user_id = this.userId
				if(val){
					//如果前一个日期是经期就续上 (只传当天经期记录
					if( this.fillDate.find(v=>v.date === this.getBeforeDay(this.curDate)) ){
						data.date = [{day:this.curDate}]
					}else{//获取选中日期往后5天 ,但是不能超过当前的日期 arr
						let endDay = new Date().getTime() >= new Date(this.getNextDay(this.curDate,4).replaceAll(/\-/g, '/')).getTime() 
						let arr = this.getBeforeTime([this.curDate,endDay?this.getNextDay(this.curDate,4):this.$refs.ren.getToday().date])
						arr.forEach(v=>{
							data.date.push({
								day:v
							})
						})
					}
					this.$request({
						url:'/ApiV3/Mobile/DiaryFemalePeriod/save',
						loading:true,
						data
					}).then(res=>{
						this.getDate()
					})
					
				}else{
					//传点击后一天的日期
					data.date = this.curDate // this.getNextDay(this.curDate)
					this.$request({
						url:'/ApiV3/Mobile/DiaryFemalePeriod/cancle',
						loading:true,
						data
					}).then(res=>{
						// this.checked = true
						this.getDate()
					})
				}
				
			},
		}
	}
</script>

<style lang="scss">
	.container {
		background: #f7f7f7;
		min-height: 100vh;
		.popup{
			position: absolute;
			z-index: 999;
			width: 750rpx;
			min-height: 432rpx;
			background: #FFFFFF;
			padding: 24rpx 0;
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-size: 28rpx;
			>view{
				width: 33%;
				display: flex;
				align-items: center;
				// justify-content: center;
				padding: 28rpx 0;
				padding-left: 70rpx;
			}
			image{
				width: 48rpx;
				height: 48rpx;
				margin-left: 8rpx;
			}
		}
		.mask {
			position: fixed;
			width: 100%;
			height: 100%;
			background: #000000;
			opacity: 0.6;
			z-index: 10;
			top: 0rpx;
		}
	}
</style>
