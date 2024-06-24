<template>
	<u-popup v-model="showPopup" mode="bottom" border-radius="24" @close="close" safe-area-inset-bottom closeable>
		<block v-if="name !== '运动'">
		<scroll-view  scroll-y="true" :show-scrollbar="true" :style="{height: '600rpx',padding:'20rpx 0'}" >
		<view class="mealpopup">
			<view  class="u-font-32 text-bold u-m-b-34" style="text-align: center;">{{title}}</view>
				<view  class="u-flex-column u-flex-items-stretch" style="min-height: 260rpx;">
					<view class="u-flex-1">
						<view class=" u-p-b-24" style="width: 100%;">
							
							
							<block >
								<view class=" u-flex u-flex-1 u-flex-items-baseline" style="width: 90%;">
									<view class="u-font-32 text-bold u-line-1 u-m-r-10" >{{obj.title}}</view>
									<view  class="u-font-24 u-line-1" style="color:#C2C2C2">{{   obj.heat_amount + 'kcal' +'/100g' }}</view>
								
								</view>
							<block v-if="!allowUpload">
							<u-image  :border-radius="8" v-for="(s,i) of obj.images" :key="i" style="display: inline-block;margin-right: 16rpx;"  class="u-m-t-10" :src="s" width="124" height="124"></u-image>
							</block>
							<!-- 有子食材 -->
							<block v-else>
							<u-image :border-radius="8"   v-for="(s,index) of imgList" :key="index" style="display: inline-block;margin-right: 16rpx;"  class="u-m-t-10" :src="s.url" width="124" height="124"></u-image>
							</block>
							</block>
						</view>
					</view>
					<view class="u-flex">
					<view class="u-flex-1">
						<view  class="u-flex u-flex-y-center u-p-6 u-font-24" v-for="(item,index) of nutritionList"
							:key="index">
							<view :style="{background:item.color}" style="width: 54rpx;height:24rpx;margin-right: 8rpx;border-radius: 8rpx;">
							</view>
							<view style="flex:1"> {{item.name}}</view>
							<view> {{item.value}}</view>
						</view>
						
					</view>
					<view class="u-flex-1" style="height: 260rpx;">
						<l-echart ref="chart" ></l-echart>
									
					</view>
					</view>
				</view>
				<!-- 有子食材 -->
				<view v-if="allowUpload" class="u-flex u-flex-wrap u-flex-column" style="padding: 12rpx 0;">
					<view @click="active = 'all';nutritionVal = obj.g" class="u-font-28 tab" style="width:100%;justify-content: flex-start;align-items: center;">
						<view style="width: 300rpx;">
						<text class="text-bold">总重量</text>
						<u-icon @click="reset" name="reload" size="32"></u-icon>
						</view>
						<text :class="{fade_out:active === 'all'}" class="u-m-r-10" style="border-bottom: 1px solid #C2C2C2;min-width: 84rpx;text-align: center;">{{obj.g}}</text>
						<text >g</text>
						<text style="color:#C2C2C2" class="u-font-24 u-m-l-8">共计{{obj.sub_foods.length}}种食物</text>
					</view>
					<view class="u-font-28 tab" @click="active = index;nutritionVal = item.g"  
						v-for="(item,index) of obj.sub_foods" :key="index">
						<text class="text-bold u-line-1" style="width: 300rpx;">{{item.title}}</text>
						<text :class="{fade_out:active === index}" class="u-m-r-10 u-line-1" style="max-width: 20%;border-bottom: 1px solid #C2C2C2;min-width: 84rpx;text-align: center;">{{item.g}}</text>
						<text >g</text>
					</view>
				</view>
			
			
			
			
		</view>
		
		</scroll-view >
			<u-gap bg-color="#FAFAFA " height="8"></u-gap>
			<view class="popPupTime u-p-b-20 ">
				<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;">{{ nutritionVal }}
				</text>
				<text class="u-font-40" style="color:#2A2A2A">{{unit}}</text>
			</view>
			<view class="safe-area-inset-bottom"></view>
			<number-keyboard2 max="99999" bg="#FFFFFF" padding="0" ref="numberKeyboard" title="''" v-model="nutritionVal"
				rightBtnText="''" @input="input" @confirm="sumbit"></number-keyboard2>
		</block>		
		<view  class="mealpopup safe-area-inset-bottom" v-else>
			<view  class="u-font-32 text-bold u-m-b-34" style="text-align: center;">添加运动时长</view>
			
			<block > 
				<view class="u-flex u-flex-items-stretch u-p-b-24" style="width: 100%;">
					<u-image :border-radius="8"  :src="obj.thumb" width="124" height="124"></u-image>
					<view class="u-m-l-8 u-flex-column u-flex-1">
						<view class="u-font-28 text-bold u-line-1" style="width: 80%;">{{obj.title}}</view>
						<view  class="u-font-24" style="color:#C2C2C2">{{obj.kcal + ' kcal/min'}}</view>
					</view>
				</view>
			</block>
			<view class="popPupTime u-p-b-20 ">
				<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;">{{ nutritionVal }}
				</text>
				<text class="u-font-40" style="color:#2A2A2A">{{unit}}</text>
			</view>
			<view  class="u-font-24 u-flex-xy-center" style="color:#C2C2C2">共计消耗{{sportVal}}kcal</view>
			<number-keyboard2 max="99999" bg="#FFFFFF" padding="0" ref="numberKeyboard" title="''" v-model="nutritionVal"
				rightBtnText="''" @input="input" @confirm="sumbit"></number-keyboard2>
		</view>
	</u-popup>

</template>

<script>
	import numberKeyboard2 from '../../numberKeyboard2.vue'
	import * as echarts from '@/utils/echarts.min.js'
	import {
		baseUrl_v2
	} from '@/utils/common.js'
	export default {
		name: 'mealpopup',
		props:{
			name:{
				type:String,
				default:''
			}
			
		},
		data() {
			return {
				imgList: [],//回显的图片
				upImgList:[],//这个才是上传后台的图片数据
				uploadHeader: {
					//上传请求头
					authorization: 'Bearer ' + uni.getStorageSync('token')
				},
				sportVal:0,//运动消耗
				editType:false,//是否修改
				allowUpload:false,//修改图片、体重等数据
				showPopup: false,
				nutritionVal: 0,
				unit: 'g',
				active: 'all',
				guige: [{
					name: '一片',
					value: 0
				}, {
					name: '一片厚',
					value: 1
				}],
				title: '营养元素',
				obj: {},
				cloneObj:{},//备份
				nutritionList: [{
					name: '碳水化合物',

					color: '#A9A0FF',
					value: '54g',
				}, {
					name: '蛋白质',
					color: '#FFAA8E',
					value: '8.5g',
				}, {
					name: '脂肪',
					color: '#FFD06A',
					value: '1g',
				}],

			}
		},
		mounted(option) {

		},
		components: {
			numberKeyboard2
		},
		methods: {
			open(item,type = false,allowUpload=false ) {
				console.log('itemitemitem',item)
				this.showPopup = true
				this.editType = type //true 修改
				this.allowUpload = allowUpload // 修改图片、体重等数据
				
				this.obj = this.$u.deepClone(item);
				if(this.name === '运动'){
					this.unit = 'min'
					this.sportVal = this.obj.total_kcal || 0
					this.nutritionVal = this.obj.minute ||  0
				}else{
					this.unit = 'g'
					this.title = `营养元素`
					this.setOptionPie(this.obj) //圆环
					this.nutritionVal = this.obj.nutritionVal || this.obj.g || 0
					this.nutritionList =  [{
						name: '碳水化合物',
					
						color: '#A9A0FF',
						value: this.obj.carbohydrate + 'g',
					}, {
						name: '蛋白质',
						color: '#FFAA8E',
						value: this.obj.protein + 'g',
					}, {
						name: '脂肪',
						color: '#FFD06A',
						value: this.obj.fat + 'g',
					}]
					if(this.allowUpload){
						this.cloneObj = this.$u.deepClone(this.obj);
						this.imgList = this.obj.images.map(v=>({url:v}))
						this.upImgList = this.obj.images.map(v=>({url:v}))
						if(this.obj.sub_foods.length){//如果有子食材 就用子食材的数据来算三大营养素
							this.setFoodWeight()
							this.nutritionList =  [{
								name: '碳水化合物',
							
								color: '#A9A0FF',
								value: this.setFoodNutrition('carbohydrate')  + 'g',
							}, {
								name: '蛋白质',
								color: '#FFAA8E',
								value: this.setFoodNutrition('protein') + 'g',
							}, {
								name: '脂肪',
								color: '#FFD06A',
								value: this.setFoodNutrition('fat') + 'g',
							}]
						}
					}
					
					
					
				}
				
				this.$emit('open', this.showPopup)
			},
			reset(){
				this.obj = this.$u.deepClone(this.cloneObj);
			},
			setFoodNutrition(name){
				let value = 0
				this.obj.sub_foods.map(res=>{
					value += res.g * res[name] / 100
				})
				value = parseFloat(value.toFixed(2)) 
				console.log(name,value)
				return value
			},
			setFoodWeight(){// 构造变量g
				let g = 0
				if(this.obj.g){
					
					this.nutritionVal = this.obj.g
				}else{
					this.obj.g = 100
					this.cloneObj.g = 100 
					// this.obj.sub_foods.forEach(res=>{
					// 	this.obj.g += res.g
					// 	this.cloneObj.g += res.g
					// })
					// this.obj.g = parseFloat(this.obj.g.toFixed(2))
					// this.cloneObj.g = parseFloat(this.cloneObj.g.toFixed(2))
					this.nutritionVal = parseFloat(this.obj.g.toFixed(2))
					console.log('this.obj.g',this.obj.g)
				}
				
			},
			onSuccess(data, index, lists) {
				
				this.upImgList.push({ url: data.data.url })
				console.log('[ data ]-202', data,this.upImgList)
			},
			onRemove(index, lists) {
				
				console.log('remove',index,lists)
				this.upImgList.splice(index,1)
				
			},
			close() {
				this.showPopup = false
				this.$emit('open', this.showPopup)
			},
			input(val){
				console.log('input',val)
				let num = parseFloat(val)
				if(this.name === '运动'){
					this.sportVal =  (this.obj.kcal * num).toFixed(num?2:0)
				}else{
					if(this.allowUpload){//有子食材
						
						if(this.active === 'all'){
							this.obj.g = num
							this.cloneObj.sub_foods.forEach((v,index)=>{
								this.obj.sub_foods[index].g = parseFloat((num * v.g / 100).toFixed(2)) 
							})
							console.log('this.cloneObj: ', this.cloneObj)
							console.log('this.obj1: ', this.obj)
						}else{
							this.obj.sub_foods[this.active].g = num
							this.obj.g = parseFloat((this.obj.sub_foods.map(res=>res.g).reduce((a,b)=>{
								return a + b
							})).toFixed(2)) 
							console.log('this.obj2: ', this.obj)
						}
					} 
					
				}
			},
			sumbit() {
			
				
				this.showPopup = false
				if(this.allowUpload){//有子食材
					this.obj.heat_amount = parseFloat((this.setFoodNutrition('carbohydrate')*4 + this.setFoodNutrition('protein')*4 + this.setFoodNutrition('fat')*9).toFixed(2))
					return this.$emit('submitSunFood',this.obj,this.editType)
				}
				
				this.$emit('submit', this.nutritionVal,this.editType)

			},
			setOptionPie(obj) {

				const option = {
					legend: {
						top: '5%',
						left: 'center'
					},
					graphic: [ {
						type: 'text',
						left: 'center',
						top: uni.upx2px(100),
						style: {
							text:this.allowUpload? parseInt((this.setFoodNutrition('carbohydrate')*4 + this.setFoodNutrition('protein')*4 + this.setFoodNutrition('fat')*9).toFixed(2)) : parseInt(obj.heat_amount ),
							textAlign: 'start',
							fill: '#2A2A2A',
							fontSize: uni.upx2px(40),
							width:uni.upx2px(200),
							overflow:'truncate',
							fontWeight:'bold',
							color: "#2A2A2A",
						}
					}, {
						type: 'text',
						left: 'center',
						top: uni.upx2px(156),
						style: {
							text: 'kcal',
							textAlign: 'center',
							fill: '#C2C2C2',
							fontSize: uni.upx2px(28),
							color: "#C2C2C2",
						}
					}],
					series: [{
						name: 'Access From',
						type: 'pie',
						radius: ['65%', '80%'],
						labelLine: {
							show: false
						},
						label: { //  饼图图形上的文本标签
							// normal: { // normal 是图形在默认状态下的样式
							// 	show: true,
							// 	position: 'center',
							// 	color: '#000',
							// 	fontSize: 16,
							// 	fontWeight: 'bold',
							// 	formatter:this.allowUpload? parseFloat((this.setFoodNutrition('carbohydrate')*4 + this.setFoodNutrition('protein')*4 + this.setFoodNutrition('fat')*9).toFixed(2)) + 'kcal':obj.heat_amount + 'kcal'
								
							// 	  // {b}:数据名； {c}：数据值； {d}：百分比，可以自定义显示内容，
							// }
						},
						data: [{
								value:this.allowUpload?this.setFoodNutrition('carbohydrate'): obj.carbohydrate,
								itemStyle: {
									normal: {
										color: '#A9A0FF',
										label: {
											normal: {
												show: true
											}
										}
									}
								}
							},
							{
								value: this.allowUpload?this.setFoodNutrition('protein'): obj.protein,
								itemStyle: {
									normal: {
										color: '#FFAA8E',
										label: {
											normal: {
												show: true
											}
										}
									}
								}
							},
							{
								value:this.allowUpload?this.setFoodNutrition('fat'): obj.fat,
								itemStyle: {
									normal: {
										color: '#FFD06A',
										label: {
											normal: {
												show: true
											}
										}
									}
								}
							},
						]
					}]
				}




				console.log('option', option)
				console.log('this.$refs.chart', this.$refs.chart)
				this.$refs.chart.init(echarts, (echart) => {
					echart.setOption(option)
				})
			},
		}
	}
</script>

<style lang="scss" scope>
	
	.mealpopup {
		padding: 24rpx 24rpx 0 24rpx;
		::-webkit-scrollbar {
		  width: 10rpx;
		  height: 10rpx;
		  color:#ffffff;
		}
		/*定义滚动条轨道 内阴影+圆角*/
		::-webkit-scrollbar-track {
		  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
		  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
		  border-radius: 10px;
		  background-color:#FFFFFF;
		}
		/*定义滑块 内阴影+圆角*/
		::-webkit-scrollbar-thumb {
		  border-radius: 10px;
		  -webkit-box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
		  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
		  background-color:#d2d2d2;
		}
		.tab {
			width: 100%;
			padding: 8rpx 24rpx;
			display: flex;
			align-items: stretch;
			justify-content: flex-start;
			// border-radius: 35rpx;
			// background-color: #F3F3F3;
			// margin-bottom: 12rpx;
		}
		.fade_out {
			animation: point 0.5s;
			animation-iteration-count: infinite;
			animation-direction: alternate
		}
		
		@keyframes point {
			from {
				border-bottom-color: #00B8A2;
			}
		
			to {
				border-bottom-color: #F3F3F3;
		
			}
		}
		.active {
			background: #00B8A2;
			color: #FFFFFF;
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
</style>
