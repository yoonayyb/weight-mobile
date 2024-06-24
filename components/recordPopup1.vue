<template>
	<view class="recordBottom">
			
		<u-popup   v-model="recordShow" mode="bottom" @close="close" border-radius="24" >
			
			<view class="popup1">
		
				
				<view v-if="!today" style="background: #F3F3F3;padding: 12rpx 24rpx;border-radius: 24rpx;"  @click="onYMDhms">{{defaultTime}} </view>
			
				<!-- 体重 -->
				<block v-if="popPopTag === '体重'">
					
					<view class="popPupTime u-p-b-20 u-m-b-20">
						<text
						   @click="hideKeyBoard = !hideKeyBoard"
							style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;">{{ weightVal }}
						</text>
						<text class="u-font-40" style="color:#2A2A2A">kg</text>
					</view>
					<view v-if="popPopInt" style="width: 100%;">
						<block v-if="hideKeyBoard">
							<vue-scale v-if="horizontaPointVal" ref="vueScale" @loading="(val)=>{loading = val}" :min="1" :max="200" :int="false"
								:single="10" :h="30" :active="horizontaPointVal" :styles="styles"
								@value="horizontaPointMethods" />



							<view class="u-flex-xy-center u-relative">
								<image @click="hideKeyBoard = !hideKeyBoard" class="u-absolute"
									:src="`${imgUrl}popup_icon_keyboard@2x(1).png`"
									style="width: 48rpx;height:48rpx;left: 8rpx;" mode=""></image>
								<my-button @click="submit" :opacity="loading?0.6:1" width="562" margin="40rpx 0"
									height="80">确定</my-button>
							</view>
						</block>
						<number-keyboard @hideKeyBoard="hideKB" keyboarIcon v-else @input="input" :padding="0" ref="numberKeyboard" title="''"
							v-model="weightVal" rightBtnText="''" @confirm="submit"></number-keyboard>
					</view>

				</block>
				<!-- 喝水量 -->
				<block v-if="popPopTag === '喝水量'" >
					<view class="popPupTime u-p-b-20 u-m-b-20">
						<text @click="targget = true"
							style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
							:class="{disabled:!targget}">{{ water }}
						</text>
						<text class="u-font-40" style="color:#2A2A2A">ml</text>
					</view>
					<view style="width: 100%;">
						<number-keyboard @input="input" :padding="0" ref="numberKeyboard" title="''" v-model="water"
							rightBtnText="''" @confirm="submit"></number-keyboard>
					</view>
				</block>
				<!-- 尿酮 -->
				<block v-if="popPopTag === '尿酮'">
					<view class="u-flex u-flex-wrap">
						<view class="ketone_box" :class="{active:active === index}" @click="active = index"
							v-for="(item,index) in ketoneList" :key="item.index">
							<view class="u-m-l-16" style="width: 32rpx;height:32rpx" v-if="item.color"
								:style="{background:item.color}"></view>
							<view style="flex:1;text-align: center;">{{item.name}}</view>
						</view>
					</view>
					<view class="u-flex-xy-center">
						<my-button @click="submit" width="562" margin="40rpx 0" height="80">确定</my-button>
					</view>
				</block>
				<!-- 血糖 -->
				<block v-if="popPopTag === '血糖'">
					<view class="popup_blood_title">时间段</view>
					<view class="popup_blood_redio">
						<view :class="{ active: activeData === item.value }" @click="chooseItem(item.value)"
							class="popup_blood_redio_item" v-for="(item, index) in bloodlist" :key="index">
							{{ item.label }}
						</view>
					</view>
					<view class="popPupTime u-p-b-20 u-m-b-20">
						<text @click="hideKeyBoard = !hideKeyBoard" style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;">{{ bloodVal }}
						</text>
						<text class="u-font-40" style="color:#2A2A2A">mmol/L</text>
					</view>
					<view v-if="popPopInt" style="width: 100%;">
						<block v-if="hideKeyBoard">
							<vue-scale v-if="blood" @loading="(val)=>{loading = val}" ref="vueScale" :min="1" :max="30" :int="false"
								:single="10" :h="30" :active="blood" :styles="styles" @value="setBlood" />
						
						
						
							<view class="u-flex-xy-center u-relative">
								<image @click="hideKeyBoard = !hideKeyBoard" class="u-absolute"
									:src="`${imgUrl}popup_icon_keyboard@2x(1).png`"
									style="width: 48rpx;height:48rpx;left: 8rpx;" mode=""></image>
								<my-button :opacity="loading?0.6:1" @click="submit" width="562" margin="40rpx 0"
									height="80">确定</my-button>
							</view>
						</block>
						<number-keyboard @hideKeyBoard="hideKB" keyboarIcon v-else @input="input" :padding="0" ref="numberKeyboard" title="''"
							v-model="bloodVal" rightBtnText="''" @confirm="submit"></number-keyboard>
					</view>
				</block>
				<!-- 血压 -->
				<block v-if="popPopTag === '血压'">

					<view @click="active = 'sbp'" class="popPupTime u-p-b-20 u-m-b-20">
						<view class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;width: 152rpx;">收缩压/高压</view>
						<text style="border-bottom:2rpx solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
							:class="{fade_out:active === 'sbp',disabled:active !== 'sbp'}">{{ sbp }} </text>
						<text class="u-font-40" style="color:#2A2A2A;min-width: 140rpx">mmHg</text>
					</view>
					<view @click="active = 'dp'" class="popPupTime u-p-b-20 u-m-b-20">
						<view class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;width: 152rpx;">舒张压/低压</view>
						<text style="border-bottom:2rpx solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
							:class="{fade_out:active === 'dp',disabled:active !== 'dp'}">{{ dp }} </text>
						<text class="u-font-40" style="color:#2A2A2A;min-width: 140rpx">mmHg</text>
					</view>
					<view @click="active = 'mb'" class="popPupTime u-p-b-20 u-m-b-20">
						<view class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;width: 152rpx;text-align: end;">脉搏</view>
						<text style="border-bottom:2rpx solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
							:class="{fade_out:active === 'mb',disabled:active !== 'mb'}">{{ mb }} </text>
						<text class="u-font-40" style="color:#2A2A2A;min-width: 140rpx;text-align: start;">bpm</text>
					</view>
					<view style="width: 100%;">
						<number-keyboard  @input="input" :padding="0" v-if="active === 'sbp'" ref="numberKeyboard" title="''"
							v-model="sbp" rightBtnText="''" @confirm="submit"></number-keyboard>
							<number-keyboard  @input="input" :padding="0" v-else-if="active === 'mb'" ref="numberKeyboard" title="''"
								v-model="mb" rightBtnText="''" @confirm="submit"></number-keyboard>
						<number-keyboard  @input="input" :padding="0" v-else ref="numberKeyboard" title="''" v-model="dp"
							rightBtnText="''" @confirm="submit"></number-keyboard>
					</view>
				</block>
				<!-- 体围 -->
				<block v-if="popPopTag === '体围'">

					<view  class="popPupTime u-p-b-20 u-m-b-20" style="width: 750rpx;justify-content: center;align-items: flex-end;">
						
						<u-dropdown height="60" ref="uDropdown"   active-color="#00B8A2" inactive-color="#2a2a2a" style="flex:inherit;width: 190rpx;">
							<u-dropdown-item height="400" @change="change" v-model="tval" :title="tw_title" :options="hospitalList"></u-dropdown-item>
							
						</u-dropdown>
						<!-- <text class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;">腰围</text> -->
						<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;" class="fade_out"
							>{{ tw_value }} </text>
						<text class="u-font-40" style="color:#2A2A2A">cm</text>
					</view>
					<!-- <view @click="active = 'hipline'" class="popPupTime u-p-b-20 u-m-b-20">
						<text class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;">臀围</text>
						<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
							:class="{fade_out:active === 'hipline',disabled:active !== 'hipline'}">{{ hipline }} </text>
						<text class="u-font-40" style="color:#2A2A2A">cm</text>
					</view> -->
					<view style="width: 100%;">
						<number-keyboard :padding="0" ref="numberKeyboard" title="''"
							v-model="tw_value" rightBtnText="''" @confirm="submit"></number-keyboard>
					</view>
				</block>
				
			</view>
		</u-popup>
		<u-picker  mode="time" @confirm="confirmTime" confirm-color="#00B8A2" :default-time="defaultTime"
			:params="params" v-model="timeshow"></u-picker>


		

	</view>
</template>

<script>
	import vueScale from './vueScale/index.vue' //刻度尺
	import numberKeyboard from './numberKeyboard2.vue' //键盘
	import myButton from '@/components/myButton.vue'
	
	
	export default {
		props: {
			userId: {
				type: String | Number,
				default: ''
			}
		},
		data() {
			return {
				end:'',
				single: "",
				tw_edit:true,
				tw_value:0,
				tval:'CIRCUMFERENCE_WAIST',
				tw_title:'腰围',
				hospitalList:[
					{
						label:'腰围',
						value:'CIRCUMFERENCE_WAIST'
					},
					{
						label:'臀围',
						value:'CIRCUMFERENCE_HIPLINE'
					},
					{
						label:'胸围',
						value:'CIRCUMFERENCE_CHEST'
					},
					{
						label:'大腿围',
						value:'CIRCUMFERENCE_THIGH'
					},
					{
						label:'小腿围',
						value:'CIRCUMFERENCE_CALF'
					},
					{
						label:'手臂围',
						value:'CIRCUMFERENCE_ARM'
					},
				],
				hideKeyBoard: true,
				loading: false,
				targget: false,
				today: false,
				id: '',
				recordShow: false,
				params: {
					year: true,
					month: true,
					day: true,
					hour: true,
					minute: true,
					second: true
				},
				defaultTime: '',
				timeshow: false,
				sbp: 0, //收缩压
				dp: 0, //舒张压
				mb:0,//脉搏
				
				activeData: 0,
				bloodlist: [{
						label: '空腹',
						value: 1
					},
					{
						label: '早餐后2小时',
						value: 4
					},
					{
						label: '午餐前',
						value: 7,
					},
					{
						label: '午餐后2小时',
						value: 5
					},
					{
						label: '晚餐前',
						value: 8,
					},
					{
						label: '晚餐后2小时',
						value: 6
					},
					{
						label: '睡前',
						value: 2
					},
					{
						label: '凌晨3点',
						value: 3
					},
					
				],
				active: -1, //尿酮默认值
				popPopInt: false,
				ketoneList: [{
					name: '1+',
					color: '#E6BEE2',
					value: 1
				}, {
					name: '2+',
					color: '#B77BA6',
					value: 2
				}, {
					name: '3+',
					color: '#9A4586',
					value: 3
				}, {
					name: '4+',
					color: '#3A0151',
					value: 4
				}, {
					name: '无显示',
					color: '#FFEFCF',
					value: -1
				}, {
					name: '未检测',
					color: '#cacaca',
					value: 0
				}], //尿酮列表
				styles: { //刻度尺样式
					line: '#C2C2C2',
					bginner: '#00B8A2',
					bgoutside: '#ffffff',
					lineSelect: '#00B8A2', // 选中线颜色
					font: '#404040',
					fontColor: '#C2C2C2',
					fontSize: 16
				},
				horizontaPointVal: 0, //体重
				water: 0, //喝水量
				blood: 0, //血糖
				bloodVal: 0, //血糖刻度条val
				weightVal: 0, //体重刻度条val
				popPopTag: '',
				
			}
		},
		components: {
			
			vueScale,
			numberKeyboard,
			myButton
		},
		created() {

		},
		watch: {
			loading(newValue, oldValue) {
				
			}
		},
		methods: {
			
			onYMDhms(e){
				
				this.timeshow = true
			},
			
			
			
			change(value){
				if(!this.tw_edit) return this.$common.toast('不能修改围度类型')
				
				this.tw_title = this.hospitalList.find(v=>v.value === value).label
				
				
				let data = {
					date:this.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
					keys:this.tval.toLocaleLowerCase()
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/Diary/defaultValue',
					method:'get',
					data
				}).then(({data})=>{
					this.tw_value = Number(data[this.tval.toLocaleLowerCase()]) 
				})
			},
			
			hideKB(val){
				this.hideKeyBoard = val
				if (this.popPopTag === '体重') {
					this.horizontaPointVal = this.weightVal
					
					// setTimeout(()=>{
					// 	
					// 	
					// 	this.$refs.vueScale.init()
					// })
					
				}
				if (this.popPopTag === '血糖') {
					this.blood = this.bloodVal
					// setTimeout(()=>{
					// 	this.$refs.vueScale.init()
					// })
					
				}
			},
			input(val, type) {

				
				if (type === 'delete') {


					// if(this.targget){

					// }else{
					// 	if (this.popPopTag === '喝水量') {
					// 		this.water = 0
					// 	}

					// }
				} else {
					if (this.targget) {
						if (this.popPopTag === '血压') {
								let length =  (val).toString().length
							if (this.active === 'sbp') {
								
								this.sbp = parseInt(val)
								if(length>3){
									this.sbp = (val).toString().slice(0,3)
								}
								
							}else if (this.active === 'dp') {
								
								this.dp = parseInt(val)
								if(length>3){
									this.dp = (val).toString().slice(0,3)
								}
							} else {
								this.mb = parseInt(val)
								if(length>3){
									this.mb = (val).toString().slice(0,3)
								}
								
							}
						}
					} else {
						this.targget = true
						if (this.popPopTag === '喝水量') {
							this.water = val.slice(-1)
						}
						if (this.popPopTag === '血压') {

							
						}

					}
				}
			},
			
			
			close() {
				this.recordShow = false
				this.popPopInt = false
				
				if(this.$refs.uDropdown){
					this.$refs.uDropdown.close()
				}
				if(this.$refs.DatetimePicker){
					this.$refs.DatetimePicker.close()
				}
				this.$emit('close')
			},
			chooseItem(item) {
				this.activeData = this.activeData === item ? 0 : item
				
			},
			set(val) { //此方法仅为了刻度尺重置
				this.popPopInt = val
				this.recordShow = val
				
			},
			submit() {



				if (this.popPopTag === '体重') {
					if(this.weightVal  > 200) return this.$common.toast('最大值为200，请重新输入')
					if(this.weightVal  < 1)return this.$common.toast('最小值为1，请重新输入')
					this.horizontaPointVal = this.weightVal
					
					if (this.loading) return
					this.addWeight(this.horizontaPointVal, 'WEIGHT')
				}
				if (this.popPopTag === '喝水量') {
					
					uni.setStorageSync('water', this.water)
					this.addWeight(this.water, 'WATER')
				}
				if (this.popPopTag === '尿酮') {
					let val = this.ketoneList[this.active].value
					this.addWeight(val, 'URINE_KETONE')
					
				}
				if (this.popPopTag === '血糖') {
					
					
					if(this.bloodVal > 30) return this.$common.toast('最大值为30，请重新输入')
					if(this.bloodVal < 1)return this.$common.toast('最小值为1，请重新输入')
					this.blood = this.bloodVal
					if (this.loading) return
					let data = {
						date: this.defaultTime,
						sugar: this.blood,
						time_enum: this.activeData,
						id: this.id || 0 //新增
					}
					if (this.userId) data.user_id = this.userId
					this.$request({
						url: '/ApiV2/Mobile/Diary/bloodSugarSave',
					 data
					}).then((res) => {
						this.$common.toast('成功')
						this.$emit('success',this.defaultTime)
						this.close()
					})
					// this.addWeight(val,'URINE_KETONE')
				}
				if (this.popPopTag === '血压') {

					if (this.active === 'sbp') {
						

					} else if (this.active === 'dp') {
						

					} else {
						
					}

					this.addWeight({
						max: parseFloat(this.sbp) ,
						min: parseFloat(this.dp),
						mb: parseFloat(this.mb),
					}, 'BLOOD_PRESSURE')
				}
				if (this.popPopTag === '体围') {
					
					this.addWeight(this.tw_value, this.tval)
				}
				// if (this.popPopTag === '腰围') {
				// 	this.addWeight(this.waist,'WAIST')

				// }


			},
			// handleWeightConfirm(){
			// 	

			// },
			addWeight(value, type) {
				let data;
				if (type === 'URINE_KETONE') {
					data = {
						ketone: value,
						date: this.defaultTime,
						type
					}
				} else if (type === 'BLOOD_PRESSURE') {
					const {
						max,
						min,
						mb
					} = value
					data = {
						max,
						min,
						pulse:mb,
						date: this.defaultTime,
						type
					}
					if(mb) data.mb = mb
				} else if (type === 'WAIST_HIPLINE') {
					
					if (Number(value) <= 0) return this.$common.toast('请输入的值必须大于0')
					data = {
						value,
						date: this.defaultTime,
						type
					}

				} else {
					data = {
						value,
						date: this.defaultTime,
						type
					}
				}

				if (this.id) data.id = this.id
				if (this.userId) data.user_id = this.userId

				this.$request({
					url: '/ApiV3/Mobile/Diary/save',
					loading: true,
					data
				}).then(res => {
					this.$common.toast('成功')
					this.$emit('success',this.defaultTime)
					this.close()
				})
			},
			horizontaPointMethods(msg, status) {
				this.weightVal = msg
				if (status) { //最后一次触发的才赋值
					this.horizontaPointVal = msg
				}
			},
			setBlood(msg, status) {
				this.bloodVal = msg
				if (status) { //最后一次触发的才赋值
					this.blood = msg
				}
			},
			getNowDateTime(){
				var now = new Date();
				
				// 获取年、月、日、时、分、秒
				var year = now.getFullYear();
				var month = now.getMonth() + 1; // 月份从0开始，所以需要加1
				var date = now.getDate();
				var hour = now.getHours();
				var minute = now.getMinutes();
				var second = now.getSeconds();
				
				// 将单个数字的月、日、时、分、秒格式化为两位数
				month = month < 10 ? '0' + month : month;
				date = date < 10 ? '0' + date : date;
				hour = hour < 10 ? '0' + hour : hour;
				minute = minute < 10 ? '0' + minute : minute;
				second = second < 10 ? '0' + second : second;
				return  year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
			},
			open(item, today = false) {
				this.end = this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss')
				if(item.name === '喝水量') this.targget = false
				if(item.name === '血压') this.targget = true
				this.today = today
				this.hideKeyBoard = true
				this.recordShow = true
				this.id = ''
				this.popPopTag = item.name //标记打开的弹框
				this.popPopInt = true
				if(!this.defaultTime)this.defaultTime = this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss')
				if(item.defaultTime)this.defaultTime = item.defaultTime
				// this.defaultTime = item.defaultTime || this.$u.timeFormat(new Date().getTime(), 'yyyy-mm-dd hh:MM:ss')
				//血糖默认不选择
				this.activeData = 0
				//获取当天的默认数据
				let keys = ''
				if(item.name === '体重') keys = 'weight'
				if(item.name === '喝水量') keys = 'water'
				if(item.name === '尿酮') keys = 'urine_ketone'
				if(item.name === '血糖') keys = 'blood_sugars'
				if(item.name === '血压') keys = 'blood_pressure'
				if(item.name === '体围'){
					if(item.tw_title){
						this.tval = this.hospitalList.find(v=>v.label == item.tw_title).value
						this.tw_title = item.tw_title
					}
					keys =  this.tval.toLocaleLowerCase()
					this.tw_edit = true
					
				} 
				let data = {
					date:this.$u.timeFormat(new Date(), 'yyyy-mm-dd'),
					keys
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url:'/ApiV3/Mobile/Diary/defaultValue',
					method:'get',
					data
				}).then(({data})=>{
					
					
					
					//体重
					if(keys === 'weight'){
						this.horizontaPointVal = data.weight || 60
						this.weightVal = data.weight || 60
					}
					//喝水量
					if(keys === 'water'){
						this.water = data.water || 0
					}
					//尿酮
					if(keys === 'urine_ketone'){
						let index = this.ketoneList.map(res => res.value).indexOf(data.urine_ketone)
						this.active = index
					}
					if(keys === 'blood_sugars'){//血糖
						
						if(data.blood_sugars){
							this.blood = data.blood_sugars.sugar
							this.bloodVal = data.blood_sugars.sugar
							this.activeData  = data.blood_sugars.time_enum
						}else{
							this.blood = 5
							this.bloodVal = 5
						}
					}
					if(keys === 'blood_pressure'){//血压
						if(data.blood_pressure){
							this.sbp = parseInt(data.blood_pressure.max) 
							this.dp = parseInt(data.blood_pressure.min)  
							this.mb  = parseInt(data.blood_pressure.pulse)  
						}
						
					}
					if(keys === this.tval.toLocaleLowerCase()){//体围
						// if(data.waist_hipline){
							
						// 	// if(this.tval)
						// }
						this.tw_value = Number(data[this.tval.toLocaleLowerCase()]) 
						
					}
					
					
				}).catch(err=>{
					this.recordShow = false
					
				})
				
				if (item.name === '血压') {
					this.active = 'sbp'
				}
				if (item.name === '体围') {
					this.active = 'waist'
				}
			},
			//修改
			edit(item) {
				if(item.name === '喝水量') this.targget = false
				if(item.name === '血压') this.targget = true
				this.recordShow = true
				this.hideKeyBoard = true
				this.id = item.id
				this.popPopTag = item.name //标记打开的弹框
				this.popPopInt = true
				this.defaultTime = item.of_date
				if (item.name === '体围') {
					
					this.tw_edit = false
					this.tw_value = item.value
					this.tw_title = item.tw_title
					
				}else if(item.name === '血压') {
					this.sbp = parseInt(item.sbp) 
					this.dp = parseInt(item.dp) 
					this.mb = parseInt(item.pulse) 
					
					this.active = 'sbp'
				}else {
					if(item.name === '血糖'){
						this.activeData = item.time_enum
					}
					this.defaultVal(item.value)
				}


			},
			//回显默认值
			defaultVal(val) {
				if (this.popPopTag === '体重') {
					this.horizontaPointVal = val
					this.weightVal = val
				}
				if (this.popPopTag === '喝水量') {
					
					this.water = val
				}
				if (this.popPopTag === '尿酮') {
					let index = this.ketoneList.map(res => res.value).indexOf(val)
					this.active = index > -1 ? index : 0

					
				}
				if (this.popPopTag === '血糖') {
					
					this.blood = val
					this.bloodVal = val
					
				}
				if (this.popPopTag === '血压') {

					if (this.active === 'sbp') {
						
						this.sbp = val
					}else if (this.active === 'dp') {
						
						this.dp = val
					} else {
						
						this.mb = val
					}
				}


			},
			confirmTime(val) {
				
				if (this.popPopTag === '体重') {
					console.log('体重日期', val.year + '-' + val.month + '-' + val.day + ' ' + val.hour + ':' + val.minute +
						':' +
						val.second)
				}
				if (this.popPopTag === '喝水量') {
					console.log('喝水量日期', val.year + '-' + val.month + '-' + val.day + ' ' + val.hour + ':' + val.minute +
						':' +
						val.second)
				}
				this.defaultTime = val.year + '-' + val.month + '-' + val.day + ' ' + val.hour + ':' + val.minute + ':' +
					val.second


			},

		}
	}
</script>

<style lang="scss" scoped>
	
	.disabled {
		color: #C2C2C2;
	}

	.fade_out {
		// animation: point 0.5s;
		// animation-iteration-count: 100;
		// animation-direction: alternate
		border-bottom:1px solid #00B8A2 !important;
		
	}

	@keyframes point {
		from {
			border-bottom-color: #00B8A2;
		}

		to {
			border-bottom-color: #F3F3F3;

		}
	}
	
	.popup1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 24rpx 24rpx 0 24rpx;
		font-size: 28rpx;
		.uni-date{
			    width: auto !important;
		}
		.time {
			background: #F3F3F3;
			border-radius: 36rpx;
			padding: 8rpx 24rpx;
			margin-bottom: 48rpx;
		
		}
	}

	.popup_blood {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 32rpx 46rpx;

		&_time {
			font-size: 28rpx;
			background-color: #fafafa;
			border-radius: 20rpx;
			padding: 14rpx 32rpx;
			width: 316rpx;
			text-align: center;
		}

		&_title {
			font-size: 32rpx;
			font-weight: bold;
			margin: 32rpx 0;
			width: 100%;
			text-align: start;
		}

		&_redio {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			align-items: center;
			padding: 0 96rpx;
			width: 100%;

			.active {
				background-color: #00B8A2;
				color: #ffffff;
			}

			&_item {
				font-size: 28rpx;
				text-align: center;
				padding: 10rpx 0;
				width: 216rpx;
				margin: 16rpx 0;
				border-radius: 30rpx;
				background-color: #f5f7f9;
				color: #c2c2c2;
			}
		}

		&_mmol {
			margin: 32rpx 0;
			width: 100%;
			text-align: center;
			font-size: 40rpx;
			font-weight: bold;
			color: #00B8A2;
		}
	}

	.active {
		background: #00B8A2 !important;
		color: white !important;
	}

	.popPupTime {
		display: flex;
		align-items: baseline;
		font-size: 72rpx;
		font-weight: bold;
		color: #00B8A2;
		
		text {
			text-align: center;
		}

	}

	.ketone_box {
		width: 160rpx;
		background: #F3F3F3;
		padding: 8rpx 0rpx;
		margin: 24rpx 8rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		display: flex;
		
		align-items: center;
	}

	.wrap {
		display: flex;
		flex-wrap: wrap;
		padding: 28rpx;
		font-size: 24rpx;
		color: #2A2A2A;

		.wrap_box {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			align-items: center;
			margin: 31rpx;
		}

		image {
			width: 112rpx;
			height: 112rpx;

		}

	}
</style>
