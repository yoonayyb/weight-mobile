<template>
	<view class="container border_t safe-area-inset-bottom" style="padding-bottom:100rpx">
		<u-navbar :custom-back="customBack" back-text="返回" title="营养设定"></u-navbar>
		<u-gap height="24"></u-gap>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('genderShow',true)" title="性别" icon>
			<text v-if="infoObj.sex == 0 || infoObj.sex == 1">{{ infoObj.sex == 0 ? '女' : '男' }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('birthdayShow',true)" title="出生日期" icon>
			<text v-if="infoObj.birthday">{{ infoObj.birthday }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('heightWeightPopupShow',true,'height')"
			title="身高" icon>
			<text v-if="infoObj.height">{{infoObj.height + ' cm'}}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('heightWeightPopupShow',true,'weight')"
			title="体重" icon>
			<text v-if="infoObj.weight">{{ infoObj.weight + ' kg' }}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<u-gap height="24"></u-gap>
		<u-cell-group>
			<u-cell-item @click="show = true" title="体力活动" :value="physicalText"></u-cell-item>
		</u-cell-group>
		<u-gap height="24"></u-gap>
		<view class="box">
			<view class="u-font-32 text-bold u-m-b-24">热量摄入</view>
			<view class="u-flex-column u-flex-items-center">
				<view  class="u-flex u-m-b-20" @click="setnumberKeyboard('allVal')">
					<view class="box-input">{{allVal}}</view>
					<view class="u-font-40 text-bold">kcal</view>
				</view>
				<view style="text-align: center;color:#C2C2C2">
					营养减重是根据您的基础信息、体力活动、人群类型。计算出所需每日热量推荐值，您可以根据自身情况进行调整。
				</view>
				<view class="u-m-t-40">
					<my-button @click="setKcal" width="176" height="56">计算热量</my-button>
				</view>
			</view>
		</view>
		<u-gap height="24"></u-gap>
		<view class="box">
			<view class="u-font-32 text-bold u-m-b-24">三大营养素</view>
			<view class="u-flex-column u-flex-items-center">
				<view style="width: 100vw;height:300rpx;margin: 40rpx 0;">
					<l-echart ref="chart"></l-echart>
				</view>
				<view style="width:80vw;font-size: 24rpx;">
					<u-row>
						<u-col span="4">
							<view style="color:#FFF" class="u-flex-x-center"> 占位</view>
						</u-col>
						<u-col span="4">
							<view class="u-font-28 text-bold u-flex-x-center">重量</view>
						</u-col>
						<u-col span="4">
							<view class="u-font-28 text-bold u-flex-x-center">供能占比</view>
						</u-col>

					</u-row>
					<u-grid :col="3" :border="false">
						<u-grid-item v-for="(item,index) of nutritionList" :key="index">
							<view @click="setnumberKeyboard(item,index,'nutritionList')" class="u-flex-xy-center u-font-28"
								:style="{justifyContent:item.color?'flex-start':'center'}"
								style="width: 100%;">
								<view v-if="item.color" :style="{background:item.color}"
									style="width: 32rpx;height:24rpx;margin-right: 8rpx;border-radius: 8rpx;"></view>
								<view v-else style="border-bottom: 1px solid #C2C2C2;padding:0rpx 16rpx;">
									{{item.value}}
								</view>
								<view> {{item.name}}</view>
							</view>
						</u-grid-item>

					</u-grid>

				</view>
				<view class="u-m-t-40 u-flex u-flex-xy-center" style="width:100vw">
					<view class="u-m-r-28">
					<my-button @click="weightSet" width="204" height="56">按重量计算</my-button>
					</view>
					<my-button @click="ratioSet" width="204" height="56">按占比计算</my-button>
				</view>
			</view>
		</view>
		<view class="box u-m-t-24">
			<view class="u-font-32 text-bold u-m-b-24">三餐占比</view>
			<view class="u-flex-column u-flex-items-center">

				<view style="width:80vw;font-size: 24rpx;">
					<u-row>
						<u-col span="4">
							<view style="color:#FFF" class="u-flex-x-center"> 占位</view>
						</u-col>
						<u-col span="4">
							<view class="u-font-28 text-bold u-flex-x-center">热量</view>
						</u-col>
						<u-col span="4">
							<view class="u-font-28 text-bold u-flex-x-center">供能占比</view>
						</u-col>

					</u-row>
					<u-grid :col="3" :border="false">
						<u-grid-item v-for="(item,index) of mealList" :key="index">
							<!-- <view class="u-flex-xy-center"
								
								>
								<image v-if="item.url" :src="`${imgUrl}`+item.url"
									style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>
								<view v-else style="border-bottom: 1px solid #C2C2C2;padding:6rpx 16rpx;">
									{{item.value}}
								</view>
								<view> {{item.name}}</view>
							</view> -->
							<view @click="setnumberKeyboard(item,index,'mealList')" class="u-flex-xy-center u-font-28"
								style="width: 100%;height: 32rpx;">

								<image v-if="item.url" :src="`${imgUrl}`+item.url"
									style="width: 48rpx;height:48rpx;margin-right: 8rpx;"></image>


								<view v-else style="border-bottom: 1px solid #C2C2C2;padding:0rpx 16rpx;">
									{{item.value}}
								</view>
								<view> {{item.name}}</view>
							</view>
						</u-grid-item>

					</u-grid>

				</view>
				<view class="u-m-t-40 u-flex-xy-center" style="width:100vw">
					<view class="u-m-r-28">
					<my-button @click="weightSet('mealList')" width="204" height="56">按热量计算</my-button>
					</view>
					<my-button @click="ratioSet('mealList')" width="204" height="56">按占比计算</my-button>
				</view>
			</view>
		</view>
		<view v-if="allowDel" class="u-flex-x-center u-m-t-40">
			<my-button @click="saveSetting" width="562" height="80" >保存</my-button>
		</view>
		
		<!-- 修改身高体重弹框 -->
		<u-popup closeable negative-top="30vh" duration="50" v-model="showParams.heightWeightPopupShow"
			@close='heightWeightPopupFn(false)' border-radius="20" mode="bottom">
			<person-scale @confirm="handleConfirm" @value='heightWeightValueFn' ref="scale"></person-scale>
		</u-popup>
		<u-popup closeable negative-top="30vh" duration="50" v-model="showParams.realnamePopupShow" border-radius="20"
			mode="center">
			<input-popup cancelText='取消' title="修改备注姓名" placeholder='请输入备注姓名' type="input" :maxlength="20"
				:value="realname" @confirm="handleConfirm($event, 'realname')"
				@cancelClick='showParams.realnamePopupShow=false' :show="showParams.realnamePopupShow">
			</input-popup>
		</u-popup>
		<!-- 性别选择 -->
		<u-select v-model="showParams.genderShow" :default-value='[infoObj.sex === 0?1:0]' confirm-color="#00B8A2"
			:list="genderOptions" @confirm="handleConfirm($event, 'gender')"></u-select>
		<!-- 生日选择 -->
		<u-picker class="personalInfo_picker" title='选择日期' mode="time" v-model="showParams.birthdayShow"
			@confirm="handleConfirm($event, 'birthday')" :default-time="infoObj.birthday || '2020-01-01'"
			:end-year="endYear" confirm-color="#00B8A2"></u-picker>
		<u-action-sheet safe-area-inset-bottom :list="list"
			@click="(i)=>{physicalText = list[i].text;physicalVal = list[i].value;setKcal()}" v-model="show"></u-action-sheet>
		<!-- 键盘 -->
		<u-popup safe-area-inset-bottom v-model="numberKeyboardShow" mode="bottom">
			<view class="popPupTime u-p-b-20 u-m-b-20">
				<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;">{{ nutritionVal }}
				</text>
				<text class="u-font-40" style="color:#2A2A2A">{{unit}}</text>
			</view>
			<number-keyboard2 bg="#FFFFFF" ref="numberKeyboard" title="''" v-model="nutritionVal" rightBtnText="''"
				@confirm="sumbit"></number-keyboard2>
		</u-popup>
		<!-- 保存提示 -->
		<!-- <u-modal show-title title="是否确认退出?" :confirm-style="" confirm-color="#00B8A2" show-cancel-button v-model="saveShow" @confirm="saveConfirm" :content="content"></u-modal> -->
		<u-popup width="638rpx" height="288rpx" border-radius="24"  v-model="saveShow" mode="center">
			<view class="u-flex-column u-flex-items-center u-flex-center" style="height: 100%;">
			<view class="u-font-32 text-bold u-m-b-40">
				是否确认退出?
			</view>
			<view class="u-font-32 u-m-b-40">
				{{content}}
			</view>
			<view class="u-flex u-flex-around" style="width: 100%;">
				<my-button @click="saveShow = false" width="208" height="72" color="#00B8A2" bg="#FFFFFF">取消</my-button>
				<my-button @click="saveConfirm" width="208" height="72">确定</my-button>
			</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex'
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	import inputPopup from '@/components/inputPopup.vue'
	import personScale from '../components/personScale.vue'
	import numberKeyboard2 from '../components/numberKeyboard2.vue'
	import * as echarts from '@/utils/echarts.min.js'
	export default {
		data() {
			return {
				content:'当前饮食方案还未进行保存',//未保存提示
				saveShow:false,//未保存弹框
				loading:false,//是否保存
				allVal:0,//总热量摄入
				numberKeyboardShow: false,
				nutritionVal: '', //键盘输入值
				unit: '', //单位
				index:'',//输入值的下标,
				valueKey:'',//输入值的key
				mealList: [{
					name: '早餐',

					url: 'tab_icon_breakfast.png'
				}, {
					name: 'kcal',
					value: 54,

				}, {
					name: '%',
					value: 54,

				}, {
					name: '午餐',

					url: 'tab_icon_lunch.png'
				}, {
					name: 'kcal',
					value: 54,

				}, {
					name: '%',
					value: 54,

				}, {
					name: '晚餐',

					url: 'tab_icon_dinner.png'
				}, {
					name: 'kcal',
					value: 54,

				}, {
					name: '%',
					value: 54,

				}, ],
				nutritionList: [{
					name: '碳水化合物',

					color: '#A9A0FF'
				}, {
					name: 'g',
					value: 54,
				}, {
					name: '%',
					value: 54,
				}, {
					name: '蛋白质',
					color: '#FFAA8E'
				}, {
					name: 'g',
					value: 54,
				}, {
					name: '%',
					value: 54,
				}, {
					name: '脂肪',
					color: '#FFD06A'
				}, {
					name: 'g',
					value: 54,
				}, {
					name: '%',
					value: 54,
				}, ],
				show: false,
				physicalText: '静态活动',
				physicalVal: 1,
				list: [{
					text: '静态活动',
					value: 1
				}, {
					text: '轻体力活动',
					value: 2
				}, {
					text: '中体力活动',
					value: 3
				}, {
					text: '重体力活动',
					value: 4
				}],

				showBriefPopup: false,
				gender: '', //性别
				genderOptions: [{
						value: 1,
						label: '男'
					},
					{
						value: 0,
						label: '女'
					}
				],
				birthday: '', //生日
				defaultTime: '2020-01-01',


				showType: '',
				showParams: {
					genderShow: false,
					showNamePopupShow: false,
					heightWeightPopupShow: false,
					birthdayShow: false,
				},
				userId:'',
				infoObj: {},
				allowDel:false,

			}
		},
		components: {
			infoTemplate,
			myButton,
			inputPopup,
			personScale,
			numberKeyboard2
		},
		computed: {
			...mapGetters(['userInfo']),
			endYear() {
				const date = new Date()
				return date.getFullYear()
			}
		},

		onLoad(option) {
			// this.infoObj = {
			// 	...this.userInfo
			// }
			
			this.userId = option.userId
			this.allowDel = option.allowDel
			console.log(11111,this.userId)
			this.getData()
			
		},
		
		methods: {
			saveSetting(){
				this.loading =  this.ratioSet('mealList','one') || this.ratioSet('nutritionList','one')
				if(!this.loading){
					this.$request({
						url:'/ApiV3/Mobile/HeatDiary/setDRIs',
						data:{
							birthday: this.infoObj.birthday,
							user_id: this.userId || this.infoObj.user_id,
							sex:this.infoObj.sex,
							height:this.infoObj.height,
							weight:this.infoObj.weight,
							group_type:this.infoObj.group_type,
							work_type:this.infoObj.work_type,
							heat_kcal:this.allVal,
							carbohydrate:this.nutritionList[1].value,
							carbohydrate_ratio:this.nutritionList[2].value,
							protein:this.nutritionList[4].value,
							protein_ratio:this.nutritionList[5].value,
							fat:this.nutritionList[7].value,
							fat_ratio:this.nutritionList[8].value,
							meals_breakfast:this.mealList[1].value,
							meals_breakfast_ratio:this.mealList[2].value,
							meals_lunch:this.mealList[4].value,
							meals_lunch_ratio:this.mealList[5].value,
							meals_dinner:this.mealList[7].value,
							meals_dinner_ratio:this.mealList[8].value,
							
						}
					}).then(res=>{
						this.loading = false
						this.$common.toast('保存成功')
					})
				}
			},
			weightSet(name = 'nutritionList',type,val){
				console.log(val)
				console.log('this.allVal',this.allVal)
				let cWeight = this[name][1].value
				let pWeight = this[name][4].value
				let fWeight = this[name][7].value
				console.log('cWeight',cWeight)
				console.log('pWeight',pWeight)
				console.log('fWeight',fWeight)
				if(name === 'nutritionList'){
					this.allVal = val ||  parseFloat((cWeight * 4 + pWeight * 4 + fWeight * 9).toFixed(0))  || 1
					if(val){
						this[name][2].value = parseFloat( (cWeight * 4 / this.allVal * 100 / 13).toFixed(0) )
						this[name][5].value = parseFloat( (pWeight * 4 / this.allVal * 100/ 13).toFixed(0) )
						this[name][8].value = parseFloat( (fWeight * 9 / this.allVal * 100/ 13).toFixed(0) )
					}else{
						this[name][2].value = parseFloat( (cWeight * 4 / this.allVal * 100).toFixed(0) )
						this[name][5].value = parseFloat( (pWeight * 4 / this.allVal * 100).toFixed(0) )
						this[name][8].value = parseFloat( (fWeight * 9 / this.allVal * 100).toFixed(0) )
					}
					
					this.setOptionPie()
					if(type) return
					this.ratioSet('mealList','once',this.allVal)
					
				}else{
					this.allVal = val || parseFloat((cWeight  + pWeight  + fWeight ).toFixed(0)) || 1
					this[name][2].value = parseFloat( (cWeight  / this.allVal * 100).toFixed(0) )
					this[name][5].value = parseFloat( (pWeight  / this.allVal * 100).toFixed(0) )
					this[name][8].value = parseFloat( (fWeight  / this.allVal * 100).toFixed(0) )
					console.log('执行到这里了')
					if(type) return
					this.ratioSet('nutritionList','once')
				}
				
				
			},
			ratioSet(name = 'nutritionList',type,val){
				console.log(val)
				console.log('this.allVal',this.allVal)
				let cRatio = this[name][2].value
				let pRatio = this[name][5].value
				let fRatio = this[name][8].value
				console.log('cRatio',cRatio)
				console.log('pRatio',pRatio)
				console.log('fRatio',fRatio)
				if((cRatio + pRatio + fRatio).toFixed(0) != 100){
					let toast = name === 'nutritionList'? '三大营养素':'三餐'
					return  this.$common.toast('请检查' + toast + '供能占比') || true
				} 
				if(name === 'nutritionList'){
					this[name][1].value = parseFloat((this.allVal * cRatio/100/4).toFixed(0))
					this[name][4].value = parseFloat((this.allVal * pRatio/100/4).toFixed(0)) 
					this[name][7].value = parseFloat((this.allVal * fRatio/100/9).toFixed(0)) 
					if(type) return
					this.ratioSet('mealList','once',this.allVal)
				}else{
					this[name][1].value = parseFloat((this.allVal * cRatio/100).toFixed(0))
					this[name][4].value = parseFloat((this.allVal * pRatio/100).toFixed(0)) 
					this[name][7].value = parseFloat((this.allVal * fRatio/100).toFixed(0)) 
					if(type) return
					this.ratioSet('nutritionList','once',this.allVal)
				}
				
				
				
			},
			getData(){
				let data = {
					user_id: this.userId || this.userInfo.id,
					date:this.$common.formatDate(new Date(),false) + ' 00:00:00'
				}
					this.$request({
						url:'/ApiV3/Mobile/HeatDiary/getDRIs',
						method:'get',
						data
					}).then(res=>{
						this.infoObj = res.data
						//复现体力活动
						this.physicalVal =  this.infoObj.work_type
						this.physicalText = this.list.find(v=>v.value == this.physicalVal)?.text || '请选择'
						this.allVal = Number(res.data.heat_kcal) || 0
						//三大营养素
						// this.nutritionList[0].value = this.allVal * 4/17
						this.nutritionList[2].value = Number((this.infoObj.carbohydrate_ratio || 60).toFixed(0)) //碳水占比默认60%
						this.nutritionList[5].value = Number((this.infoObj.protein_ratio || 15).toFixed(0)) //蛋白质占比默认15%
						this.nutritionList[8].value = Number((this.infoObj.fat_ratio || 25).toFixed(0)) //脂肪占比默认15%
						
						
						if(this.infoObj.carbohydrate){
							this.nutritionList[1].value = this.infoObj.carbohydrate
						}else{
							this.nutritionList[1].value = parseFloat((this.allVal * this.nutritionList[2].value/100/4).toFixed(0)) 
						}
						if(this.infoObj.protein){
							this.nutritionList[4].value = this.infoObj.protein
						}else{
							this.nutritionList[4].value = parseFloat((this.allVal * this.nutritionList[5].value/100/4).toFixed(0)) 
						}
						if(this.infoObj.fat){
							this.nutritionList[7].value = this.infoObj.fat
						}else{
							this.nutritionList[7].value = parseFloat((this.allVal * this.nutritionList[8].value/100/9).toFixed(0)) 
						}
						
						//三餐占比
						this.mealList[2].value = Number((this.infoObj.meals_breakfast_ratio || 40).toFixed(0)) //早餐占比默认40%
						this.mealList[5].value = Number((this.infoObj.meals_lunch_ratio || 30).toFixed(0)) //午餐占比默认30%
						this.mealList[8].value = Number((this.infoObj.meals_dinner_ratio || 30).toFixed(0)) //晚餐比默认30% 
						
						if(this.infoObj.meals_breakfast){
							this.mealList[1].value = this.infoObj.meals_breakfast
						}else{
							this.mealList[1].value = parseFloat((this.allVal * this.mealList[2].value/100).toFixed(0)) 
						}
						if(this.infoObj.meals_dinner){
							this.mealList[4].value = this.infoObj.meals_dinner
						}else{
							this.mealList[4].value = parseFloat((this.allVal * this.mealList[5].value/100).toFixed(0)) 
						}
						if(this.infoObj.meals_lunch){
							this.mealList[7].value = this.infoObj.meals_lunch
						}else{
							this.mealList[7].value = parseFloat((this.allVal * this.mealList[8].value/100).toFixed(0)) 
						}
						this.setOptionPie()
						
					})
			},
			setKcal(){//计算热量
			let data = {
				sex:this.infoObj.sex,
				birthday:this.infoObj.birthday,
				work_type:this.physicalVal
			}
				this.$request({
					url:'/ApiV3/Mobile/HeatDiary/heat',
					data
				}).then(res=>{
					
					this.allVal = Number(res.data.heat_kcal) || 0
					this.ratioSet('nutritionList','once',this.allVal)
					this.ratioSet('mealList','once',this.allVal)
				})
			},
			setOptionPie() {
			
				const option = {
				  legend: {
				    top: '5%',
				    left: 'center'
				  },
				  color:['#A9A0FF','#FFAA8E','#FFD06A'],
				  series: [
				    {
				      name: 'Access From',
				      type: 'pie',
				      radius: ['60%', '80%'],
				      labelLine: {
				        show: false
				      },
				      data: [
				        { value: this.nutritionList[2].value || 60 },
				        { value: this.nutritionList[5].value || 15},
				        { value: this.nutritionList[8].value || 25},
				      ]
				    }
				  ]
				}
				
			
			
			
				console.log('option', option)
				console.log('this.$refs.chart', this.$refs.chart)
				this.$refs.chart.init(echarts, (echart) => {
					echart.setOption(option)
				})
			},
			setnumberKeyboard(item,index,valueKey) {
				if(item === 'allVal'){//特殊处理 总热量摄入
					
					this.nutritionVal = this.allVal
					this.valueKey = 'allVal'
					this.unit = 'kcal' //单位
					this.numberKeyboardShow = true
					
				}else{
					this.nutritionVal = item.value //键盘值
					this.unit = item.name //单位
					this.index = index //保存值方便查找
					this.valueKey = valueKey
					this.numberKeyboardShow = true
				
					
				}
				// if (item.value) {
				// 	this.nutritionVal = item.value //键盘值
				// 	this.unit = item.name //单位
				// 	this.index = index //保存值方便查找
				// 	this.valueKey = valueKey
				// 	this.numberKeyboardShow = true
				// }
			},
			sumbit() {
				
				if(this.valueKey === 'allVal'){
					this.allVal = Number(this.nutritionVal) 
				}else{
					this[this.valueKey][this.index].value = this.nutritionVal
					console.log(111,this[this.valueKey][this.index]) 
					
				}
				this.loading = true
				
				
				this.numberKeyboardShow = false
			},
			customBack() {
				console.log(11111)
				
				if(this.loading){
					this.saveShow = true
					
				}else{
					uni.navigateBack()
				}
			},
			saveConfirm(){
				console.log('确认退出')
				uni.navigateBack()
			},
			infoTempClick(type, status, hwType) {

				if(!this.allowDel) return
				this.showType = type
				this.$set(this.showParams, type, status)
				// this.showParams[type] = status
				if (hwType) {
					this.heightWeightPopupFn(true, hwType)
				}

			},
			heightWeightValueFn({
				value,
				type
			}) {
				console.log('[ value,type ]-144', value, type)
				// this.$set(this.userInfo, type, value)
			},
			heightWeightPopupFn(status, type) {
				console.log(this.infoObj[type], this.infoObj, ' this.infoObj[type] this.infoObj[type]');
				let obj
				if (type === 'height') {
					obj = {
						min: 40,
						max: 230,
						title: '修改身高',
						unit: 'cm',
						value: this.infoObj[type] || 160
					}
				} else {
					obj = {
						min: 1,
						max: 200,
						title: '修改体重',
						unit: 'kg',
						value: this.infoObj[type] || 60
					}
				}
				this.$refs.scale.reset({
					...obj,
					status,
					type,
					btnStatus: true,
				})
				this.showParams.heightWeightPopupShow = status
			},
			horizontaPointMethods(e) {
				console.log('[ e ] >', e)
			},
			// 修改用户信息
			editUserInfo(data, callback) {
				
				this.$request({
					url: '/ApiV2/Mobile/User/edit',
					data,
					errMsg: true,
					loading: true
				}).then((res) => {

					callback && callback()
				})
			},
			// editConsumerInfo(data, callback) {
			// 	let dataObj = data ? {
			// 		...data,
			// 		user_id: this.infoObj.id
			// 	} : {
			// 		...this.infoObj
			// 	}
			// 	//更新客户资料
			// 	this.$request({
			// 		url: '/ApiV3/Mobile/Staff/customerEdit',
			// 		data: dataObj,
			// 		errMsg: true,
			// 		loading: true
			// 	}).then((res) => {

			// 		callback && callback()
			// 	})
			// },
			// 公共跳转
			jump({
				url = '',
				data = ''
			}) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			},
			// 选择器点击确定的回调
			handleConfirm(e, type) {
				console.log('[ e, type ]-213', e, type)
				let data
				if (type === 'avatar') {
					const {
						avatarUrl
					} = e.detail
					this.infoObj.avatar = avatarUrl
					data = {
						avatar: avatarUrl
					}
				} else if (type === 'birthday') {
					this.birthday = e.year + '-' + e.month + '-' + e.day
					this.defaultTime = e.year + '-' + e.month + '-' + e.day
					data = {
						birthday: this.birthday
					}
				} else if (type === 'gender') {
					this[type] = e[0].label
					data = {
						sex: e[0].value
					}
				} else {
					data = {
						[type]: e.value || e
					}
				}
				this.editUserInfo(data, () => {
					const userInfo = {
						...this.infoObj,
						...data
					}

					// this.$store.commit('setUserInfo', userInfo)
					this.infoObj = {
						...userInfo
					}
					this.setKcal()
					console.log('this.infoObj', this.infoObj)
					this.showParams.heightWeightPopupShow = false
					
				})
			},
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
	}
	::v-deep .u-grid-item-box{
		padding: 12rpx 0 !important;
	}
	.container {
		.head {
			width: 96upx;
			height: 96upx;
			border-radius: 50%;
		}

		.box {
			background-color: #fff;
			padding: 28rpx 32rpx;
			font-size: 24rpx;

			&-input {
				border-bottom: 1px solid #C2C2C2;
				padding: 6rpx 16rpx;
				font-size: 40rpx;
			}
		}
		
		.popPupTime {
			display: flex;
			justify-content: center;
			align-items: baseline;
			padding-top: 20rpx;
			font-size: 72rpx;
			font-weight: bold;
			color: #00B8A2;

			text {
				text-align: center;
			}

		}
	}

	.personalInfo_picker {
		::v-deep .u-picker__title {
			font-size: 32rpx;
			font-weight: bold;
			color: #2a2a2a;
		}
		::v-deep .u-datetime-picker{
			padding-bottom: 120rpx;
		}
		::v-deep picker-view-column {
			&:nth-child(1) {
				.u-column-item {
					justify-content: flex-end;
				}
			}

			// &:nth-child(2) {
			// }
			&:nth-child(3) {
				.u-column-item {
					justify-content: flex-start;
				}
			}
		}

		::v-deep .u-picker-header {
			border-radius: 30rpx !important;
		}

		::v-deep .u-drawer-content {
			border-radius: 30rpx !important;
		}

		::v-deep .u-picker-body {
			height: 282rpx !important;
			padding: 20rpx 0;
		}

		// ::v-deep .u-column-item {
		//   height: 80rpx !important;
		// }
	}

	.avatar-wrapper {
		padding: 0;
		height: 96rpx;
		border-radius: 50%;
	}

	.textarea {
		.u-input__textarea {
			background-color: #f3f3f3;
			border-radius: 16rpx;
			padding: 24rpx !important;
		}
	}
</style>
