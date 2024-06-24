<template>
	<view class="container border_t">
		<info-template title="所处阶段">
			<text>{{
        formData.plan_level === 0
          ? '未开始'
          : formData.plan_level === 1
          ? '启动期'
          : formData.plan_level === 2
          ? '过渡期'
          : formData.plan_level === 3
          ? '维持期'
          : '未开始'
      }}</text>
		</info-template>
		<u-gap height="24"></u-gap>
		<info-template title="阶段修改" :icon="true" @click="showStagePopup = true">
			<text v-if="formData.plan_level >= 0">{{ stageOptions.find(v=>v.value ===formData.plan_level).label }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template title="预计启动日期" :icon="true" @click="showTimePopup = true">
			<text v-if="formData.estimate_start_date">{{ formData.estimate_start_date }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<u-gap height="24"></u-gap>
		<info-template title="实际启动日期" :icon="true" @click="showStartTimePopup = true">
			<text v-if="formData.plan_start_date">{{ formData.plan_start_date }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template title="阶段持续天数" :icon="true" @click="setTotal_day">
			<text v-if="formData.total_day >= 0">{{ formData.total_day }}</text>
			<text v-else class="light_color">请输入</text>
		</info-template>
		<info-template title="是否暂停" :icon="true" @click="()=>{if(formData.plan_status!==2)showStatusPopup = true} ">
			<text v-if="formData.plan_status > -1">{{ formData.plan_status === 1 ? '正常' :formData.plan_status ===2?'已结束': '暂停' }}</text>
			<text v-else class="light_color">请输入</text>
		</info-template>
		<info-template title="结束日期">
			<text>{{formData.plan_finish_date}}</text>
		</info-template>
		<u-gap height="24"></u-gap>
		<info-template title="初始体重">
			<text>{{formData.start_weight}}</text>
		</info-template>
		<info-template title="目标体重" :icon="true" @click="showWeightPopup = true">
			<text v-if="formData.target_weight">{{ formData.target_weight }}kg</text>
			<text v-else class="light_color">请输入</text>
		</info-template>
		<info-template title="阶段变化">
			<text>{{formData.change_weight}}</text>
		</info-template>
		<info-template title="最终体重">
			<text>{{formData.end_weight}}</text>
		</info-template>
		<view class="content img">
			<view class="img_text">阶段照片（{{imgList.length || addImgList.length}}/20）</view>
			<u-upload :file-list="imgList"  :max-count="20" :header="uploadHeader" ref="uUpload" width="120" height="120" :show-progress="false"
			@on-choose-complete="uploaded"	:custom-btn='true' :auto-upload="false" 
				 @on-remove='onRemove'>
				<!-- <u-icon name="photo" size="60" :color="$u.color['lightColor']"></u-icon> -->
				<view slot="addBtn" class="slot-btn" hover-class="slot-btn__hover" hover-stay-time="150">
					<image class="image" :src="`${imgUrl}aftersales_icon_pic@2x.png`" mode="aspectFit"></image>
				</view>
			</u-upload>
			<view v-if="imgList.length === 20" @click="maxClick">
				<image class="image" :src="`${imgUrl}aftersales_icon_pic@2x.png`" mode="aspectFit"></image>
			</view>
		</view>
		<!-- 修改预计启动日期 -->
		<u-picker :end-year="endYear" @confirm="confirm" mode="time" v-model="showTimePopup"
			:params="{ year: true, month: true, day: true }" :default-time='formData.estimate_start_date'>
		</u-picker>
		<!-- 修改阶段 -->
		<u-select @confirm="confirmStage" mode="single-column" v-model="showStagePopup" :list="stageOptions"
			:default-value='[stageOptions.map(v=>v.value).indexOf(formData.plan_level) > -1 ?stageOptions.map(v=>v.value).indexOf(formData.plan_level):0]'></u-select>
		<!-- 修改启动日期 -->
		<u-picker :end-year="endYear" @confirm="confirmStartTime" mode="time" v-model="showStartTimePopup"
			:params="{ year: true, month: true, day: true }" :default-time='formData.plan_start_date'></u-picker>
		<!-- 修改阶段持续时长 -->
		<u-popup closeable negative-top="30vh" duration="50" v-model="showAllDayPopup" border-radius="20" mode="center">
			<input-popup title="持续时长" :value="formData.total_day" type="number"
				@confirm="inputConfirm($event, 'total_day', 'showAllDayPopup')" :show="showAllDayPopup">
			</input-popup>
		</u-popup>
		<!-- 修改阶段目标体重 -->
		<u-popup closeable negative-top="30vh" duration="50" v-model="showWeightPopup" border-radius="20" mode="center">
			<input-popup title="目标体重" :value="formData.target_weight" type="number"
				@confirm="inputConfirm($event, 'target_weight', 'showWeightPopup')" :show="showWeightPopup">
			</input-popup>
		</u-popup>
		<!-- 修改是否暂停 -->
		<u-select @confirm="confirmStatus" mode="single-column" v-model="showStatusPopup" :list="statusOptions"
			:default-value='[formData.plan_status]'></u-select>
		<view class="u-flex-xy-center u-p-t-40">
			<myButton :disabled="!userInfo.roles.isServer" @click="submit" height="82" width="562">保存</myButton>
		</view>
	</view>
</template>

<script>
	import {
		baseUrl_v2
	} from '@/utils/common.js'
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	import inputPopup from '@/components/inputPopup.vue'
	export default {
		data() {
			return {
				type:'',//新增还是编辑
				baseUrl: '',
				listsLength: 0,
				uploadHeader: {
					//上传请求头
					authorization: 'Bearer ' + uni.getStorageSync('token')
				},
				addImgList: [],
				formData: {},
				imgList: [],
				showWeightPopup: false, //目标体重
				showTimePopup: false, //预计启动日期
				showStagePopup: false, //阶段修改
				showStartTimePopup: false, //启动日期
				showAllDayPopup: false, //阶段持续时长
				showStatusPopup: false, //是否暂停
				stageOptions: [
					
					{
						value: 1,
						label: '启动期'
					},
					{
						value: 2,
						label: '过渡期'
					},
					{
						value: 3,
						label: '维持期'
					}
				], //阶段
				statusOptions: [{
						value: 0,
						label: '是'
					},
					{
						value: 1,
						label: '否'
					},
				]
			}
		},
		components: {
			infoTemplate,
			myButton,
			inputPopup
		},
		computed: {
			...mapGetters(['userInfo']),
			endYear() {
				const date = new Date()
				return date.getFullYear()
			}
		},
		onLoad(option) {
			this.baseUrl = this.$common.baseUrl
			if (option.item) {
				let formData = JSON.parse(option.item)
				if(formData.type  === 'add' || formData.id === 0){
					this.formData = {}
					this.formData.user_id = formData.user_id
					this.formData.plan_level = 0
					this.formData.estimate_start_date = ''
					this.formData.plan_start_date = ''
					this.formData.plan_status = 1
					this.formData.plan_finish_date = ''
					this.formData.change_weight = ''
					this.formData.start_weight = ''
					this.formData.end_weight = ''
					this.formData.total_day = ''
					this.formData.target_weight = 60
					
				}else{
					this.getDetail({
						user_id: formData.user_id,
						id:formData.id
					}, (res) => {
						if (res.data) {
							this.formData = res.data
							this.formData.estimate_start_date = this.splitDate(this.formData.estimate_start_date)
							this.formData.plan_start_date = this.splitDate(this.formData.plan_start_date)
							this.formData.plan_finish_date = this.splitDate(this.formData.plan_finish_date)
							this.formData.total_day = this.formData.total_day || 30
							this.formData.target_weight = this.formData.target_weight
							this.changeDate()
							this.getImgList()
						} else {
							
					
						}
					
					})
					
				}
				
				console.log('[ formData ]-168', formData)
				
			}
		},
		methods: {
			setTotal_day(){
				this.showAllDayPopup = true;
				// if(!this.formData.total_day)this.$set(this.formData,'total_day',30)
				
				
				console.log('this.formData.total_day',this.formData.total_day)
			},
			
			getCurrentDetail(data, callback) {
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/current',
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					callback && callback(res)
				})
			},
			getDetail(data, callback) {
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/detail',
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					callback && callback(res)
				})
			},
			removeImg(data, callback) {
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/delImg',
					method: 'post',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					callback && callback()
				})
			},
			uploadImg(data, callback) {
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/addImg',
					method: 'post',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					callback && callback(res)
				})
			},
			beforeUpload(index, list) {
				console.log('[ index, list ]-189', index, list)

				if (this.formData.id) {
					// let data = {
					// 	id: this.formData.id,
					// 	user_id: this.formData.user_id,
					// 	urls: [list[index].url]
					// }
					// this.uploadImg(data, (res) => {
					// 	this.imgList.push({
					// 		...res.data,
					// 		url: list[index].url
					// 	})
					// })
				} else {

				}

			},
			getImgList() {
				let data = {
					id: this.formData.id,
					user_id: this.formData.user_id
				}
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/images',
					method: 'get',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					this.imgList = res.data
					console.log('[ this.imgList  ]-189', this.imgList)
				})
			},
			splitDate(date) {
				return date && date.split(' ')[0]
			},
			maxClick() {
				uni.showToast({
					title: '上传图片已达到上限',
					icon: 'none'
				})
			},
			uploaded(lists){
			  lists = lists.filter(v=>v.file)
			   let urls = []
			   console.log('vvvvvvvvvvvvvvv',lists)
			   lists.map(async v=>{
				   
				  this.$common.uploadParams(v.file.path).then(data=>{
					  if (!this.formData.id) {
					  	this.addImgList.push(data.key)
					  }else{
					  	let params = {
					  		id: this.formData.id,
					  		user_id: this.formData.user_id,
					  		urls: [data.key]
					  	}
					  	this.uploadImg(params, (res) => {
					  		this.imgList.push({
					  			...res.data,
					  			url: data.key
					  		})
					  		this.imgList.pop()
					  	})
					  }
					  this.listsLength = lists.length
				  })
			   })
			  
			 
			   
			},
			
			onRemove(index, lists) {

				console.log(index)
				if (this.formData.id) {
					let data = {
						id: this.formData.id,
						user_id: this.formData.user_id,
						img_ids: [this.imgList[index].id]
					}
					this.removeImg(data, () => {
						console.log('[ lists ]-240', this.imgList[index], index, this.imgList, )
						this.imgList.splice(index, 1)
					})
				} else {
					this.addImgList.splice(index, 1)
				}

			},
			confirm(date) {
				const {
					year,
					month,
					day
				} = date
				this.formData.estimate_start_date = year + '-' + month + '-' + day

				console.log(111, this.formData.estimate_start_date)
			},
			confirmStage(val) {
				this.formData.plan_level = val[0].value
				console.log(val)
			},
			//根据阶段持续天数改变结束日期
			changeDate(data) {
				let date = this.formData.plan_start_date.replaceAll('-','/')
				console.log('date',date)
				if(this.formData.total_day){
					let startTime = new Date(date).getTime() + (86400000 * (this.formData.total_day -
						1))
					this.formData.plan_finish_date = this.$common.formatDate1(new Date(startTime), false)
				}else{
					this.formData.plan_finish_date = ''
				}
				
			},
			//根据实际启动日期获取初始体重
			getStartWeight(){
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/startWeight',
					method: 'get',
					loading: true,
					errMsg: true,
					data:{
						user_id:this.formData.user_id,
						plan_start_date:this.formData.plan_start_date + ' 00:00:00'
					}
				}).then(res=>{
					
					this.$set(this.formData,'start_weight',res.data.start_weight || 0)
					this.$forceUpdate();
				})
			},
			confirmStartTime(date) {
				const {
					year,
					month,
					day
				} = date
				
				if (year + '-' + month + '-' + day) {
					let maxDay = new Date().getTime()
					let current = new Date(new Date(year + '-' + month + '-' + day).toLocaleDateString()).getTime()
				
					if (current > maxDay) return this.$common.toast('启动日期不能超过今日')
				}
				this.formData.plan_start_date = year + '-' + month + '-' + day
				this.getStartWeight()
				// this.changeDate()
			},
			confirmStatus(val) {
				
				this.$set(this.formData,'plan_status',val[0].value)
				console.log(val)
			},
			submit() {
				if (!this.formData.plan_level) {
					return this.$common.toast('请选择阶段修改')
				}
				if (!this.formData.plan_start_date) {
					return this.$common.toast('请选择实际启动日期')
				}
				if (this.formData.plan_start_date) {
					let maxDay = new Date().getTime()
					let current = new Date(new Date(this.formData.plan_start_date).toLocaleDateString()).getTime()

					if (current > maxDay) return this.$common.toast('启动日期不能超过今日')
				}
				if (!this.formData.target_weight) {
					return this.$common.toast('请输入目标体重')
				}
				if (!this.formData.total_day) {
					return this.$common.toast('请输入正整数持续时长')
				}

				if (this.formData.total_day) {
					let objReg = new RegExp('^[0-9]*[1-9][0-9]*$')
					if (!objReg.test(this.formData.total_day)) {
						return this.$common.toast('请输入正整数持续时长')
					}
				}
				if (this.formData.plan_status !==0 && this.formData.plan_status !==1 && this.formData.plan_status !==2) {
					return this.$common.toast('请选择是否暂停')
				}
				// if (!this.formData.plan_level && this.formData.plan_level < 0) return this.$common.toast('请选择阶段')
				// if (!this.formData.estimate_start_date) return this.$common.toast('请选择预计启动日期')

				// if (!this.$u.trim(this.formData.total_day.toString()) && this.formData.total_day != '0') {
				//   return this.$common.toast('请输入持续时长')
				// }
				console.log('plan_status', this.formData.plan_level, this.formData.plan_status);
				
				let data = {
					user_id: this.formData.user_id,
					plan_level: this.formData.plan_level, //[0 => '未开始', 1 => '启动期', 2 => '过渡期', 3 => '维持期']
					plan_status: this.formData.plan_status, //1 正常 0 暂停 2.结束
					target_weight: +this.formData.target_weight, //目标体重
					plan_start_date: this.formData.plan_start_date + ' 00:00:00', //启动日期
					plan_finish_date: this.formData.plan_finish_date + ' 00:00:00', //结束日期
					
					id: this.formData.id, //更新时必填
				}
				console.log('plan_status', data.plan_level, data.plan_status);
				
				console.log(data)
				
				this.$request({
					url: '/ApiV2/Mobile/WeightCycle/save',
					method: 'post',
					loading: true,
					errMsg: true,
					data
				}).then((res) => {
					if (!this.formData.id && this.addImgList.length) {
						let data = {
							id: res.data.id,
							user_id: this.formData.user_id,
							urls: this.addImgList
						}
						this.uploadImg(data)
					}
					this.$common
						.showModal({
							content: '保存成功',
							showCancel: false
						})
						.then((res) => {
							const pages = getCurrentPages()
							let page = pages[pages.length - 2]; //获取上一个页面的实例
							console.log('[ page ]-355', page)

							// page.$vm.setInfo(this.formData.user_id)
							page.$vm.user_id = this.formData.user_id
							uni.navigateBack({
								delta: 1,
							})
						})
				})
			},

			// input弹框点击确定的回调
			inputConfirm(value, type, showType) {
				// if (!value.test(/^\d+$/)) return this.$common.toast({ title: '请输入数值' })
				this.formData[type] = value
				// this.formData.total_day = value
				this[showType] = false

				if (type === 'total_day') {
					
					this.changeDate()
					
					return
				}
				if (type === 'target_weight') {
					this.formData[type] = (+value).toFixed(2)
				}
				console.log(111, value)
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}

	.container {
		padding-bottom: 100rpx;

		.head {
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
		}

		.content {
			margin-bottom: 32rpx;
			background-color: #fff;

			.content_item {
				display: flex;
				justify-content: space-between;
				padding: 28rpx 32rpx;
				border-bottom: 1px solid #f5f5f5;

				&_l {
					color: #2a2a2a;
				}

				&_r {
					color: #c2c2c2;
				}
			}
		}

		.img {
			padding: 28rpx 32rpx;

			.img_text {
				font-weight: bold;
				color: #2a2a2a;
				font-size: 14px;
				margin-bottom: 24rpx;
			}

			.image {
				width: 120rpx;
				height: 120rpx;
			}
		}

		.u-list-item {
			margin: 9rpx !important;
		}
	}
</style>
