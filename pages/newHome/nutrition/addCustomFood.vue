<template>
	<view class="container">
		<info-template :textNoWidth="true" style_='min-height: 96rpx;border-bottom:1px solid #FAFAFA' title="食物照片">
			<u-upload :file-list="imgList" :max-count="5" :header="uploadHeader" ref="uUpload" width="88" height="88"
				:show-progress="false" :custom-btn='true' :auto-upload="false" @on-choose-complete="uploaded"
				@on-remove='onRemove'>

				<view slot="addBtn" class="slot-btn u-flex-xy-center" hover-class="slot-btn__hover"
					hover-stay-time="150">
					<image style="width: 88rpx;height: 88rpx;" :src="`${imgUrl}aftersales_icon_pic@2x.png`"
						mode="aspectFit"></image>
				</view>
			</u-upload>
		</info-template>
		<u-field v-if="!meals" label-width="230" input-align="right" v-model="name" label="食物名称" placeholder="请输入">

		</u-field>
		<u-field label-width="230" type="digit" input-align="right" v-model="weight" label="食物重量" placeholder="请输入"
			:disabled="checked1">
			<view slot="right">g</view>
		</u-field>
		<u-field label-width="230" input-align="right" v-model="value" label="食物热量" placeholder="请输入"
			:disabled="checked1">
			<!-- <view slot="right">kcal</view> -->
			<y-switch slot="right" v-model="checked" active-color="#F3F3F3"></y-switch>
		</u-field>
		<u-field label-width="350" type="digit" input-align="right" v-model="value1" disabled label="通过三大营养素计算热量">

			<u-switch size="44" slot="right" inactive-color="#F3F3F3" active-color="#00B8A2"
				v-model="checked1"></u-switch>
		</u-field>
		<u-gap height="24"></u-gap>
		<view class="box">
			<view class="u-font-28">备注说明</view>
			<u-input :show-confirmbar="false"
				:custom-style="{background:'#F3F3F3',borderRadius:'16rpx',marginTop:'24rpx',padding:'16rpx 24rpx'}"
				placeholder-style="color:#C2C2C2" placeholder="请输入" maxlength="200" v-model="remarks" type="textarea"
				:border="false" height="136" auto-height />
		</view>

		<block v-if="filedDis">
			<u-gap height="24"></u-gap>
			<info-template v-for="(item,index) of list" :key="index" :textNoWidth="true"
				style_='min-height: 96rpx;border-bottom:1px solid #FAFAFA' :title="item.title">
				<view>{{item.g}}g</view>

				<image @click="remove(item,index)" style="width: 32rpx;margin-left: 16rpx;"
					:src="`${imgUrl}icon_delete.png`" mode="widthFix"></image>
			</info-template>
		</block>
		<view class="u-flex-xy-center u-font-24 u-p-24" :style="{color:disabled && !filedDis?'#C2C2C2':'#00B8A2'}">
			<image v-if="disabled && !filedDis" :src="`${imgUrl}v3_icon_edit_disabled.png`"
				style="width: 32rpx;height:32rpx;margin-right: 8rpx;"></image>
			<image v-else :src="`${imgUrl}v3_icon_edit.png`" style="width: 32rpx;height:32rpx; margin-right: 8rpx;">
			</image>

			<text @click="addFoodCustom">添加食物</text>
		</view>
		<view @click="topic">
			<u-field label-width="230" type="digit" @input="input" :disabled="filedDis" input-align="right" v-model="ts"
				label="碳水化合物" :field-style="{color:'#C2C2C2'}" placeholder="请输入">
				<view slot="right">g</view>
			</u-field>
			<u-field label-width="230" type="digit" @input="input" :disabled="filedDis" input-align="right"
				v-model="dbz" label="蛋白质" :field-style="{color:'#C2C2C2'}" placeholder="请输入">
				<view slot="right">g</view>
			</u-field>
			<u-field label-width="230" type="digit" @input="input" :disabled="filedDis" input-align="right" v-model="zf"
				label="脂肪" :field-style="{color:'#C2C2C2'}" placeholder="请输入">
				<view slot="right">g</view>
			</u-field>
		</view>
		<view class="u-flex-xy-center u-m-t-40  u-p-b-40">
			<my-button @click="submit" width="562" height="80">保存</my-button>
		</view>
	</view>
</template>

<script>
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	import ySwitch from '../components/u-switch/u-switch.vue'

	import {
		baseUrl_v2
	} from '@/utils/common.js'
	export default {
		data() {
			return {
				checked1: false,
				checked: false,
				obj: {}, //修改的数据
				meals: '', //餐次
				activeDate: '', //时间
				list: [], //食材列表
				remarks: '',
				loading: true,
				imgList: [], //回显的图片
				upImgList: [], //这个才是上传后台的图片数据
				uploadHeader: {
					//上传请求头
					authorization: 'Bearer ' + uni.getStorageSync('token')
				},
				name: '',
				weight: 100,
				value: '',
				value1: '',
				ts: 0,
				dbz: 0,
				zf: 0,
				userId: ''
			}
		},
		onLoad(option) {
			console.log(option.obj)
			if (option.userId) this.userId = option.userId
			if (option.obj) { //快捷打卡
				let obj = JSON.parse(decodeURIComponent(option.obj))
				this.obj = obj
				uni.setNavigationBarTitle({
					title: '快捷上传'
				});

				if (obj.id) { //修改
					this.getDetail(obj.id)
				} else {
					this.meals = obj.meals
					this.activeDate = obj.activeDate

					let imgList = obj.images
					imgList.map(v => {
						this.imgList.push({
							url: v.url
						})
						this.upImgList.push({
							url: v.url
						})

					})
					console.log('this.imgList', this.imgList)
					console.log('this.upImgList', this.upImgList)
					return
					let taskPromises = imgList.map(res => this.$common.uploadParams(res.url))
					Promise.all(taskPromises).then(res => {
						console.log('promiseAll', res)

						this.imgList = res.map(v => ({
							url: v.url,
							key: v.key,
						}))
						this.upImgList = res.map(v => ({
							url: v.url,
							key: v.key,
						}))
						console.log('this.imgList', this.imgList)
					})

				}



			} else {
				uni.setNavigationBarTitle({
					title: '添加自定义食物'
				});

			}
			console.log(this.imgList)
		},
		computed: {
			disabled() {
				return Number(this.ts) || Number(this.dbz) || Number(this.zf)
			},
			filedDis() {
				return this.list.length
			}
		},
		components: {
			infoTemplate,
			myButton,
			ySwitch
		},
		watch: {
			checked(val) {

				if (!this.$u.test.number(this.value)) return this.$common.toast('请输入正确数值的食物热量')
				if (val) {
					this.value = parseFloat((this.value / 4.186).toFixed(2))
				} else {
					this.value = parseFloat((this.value * 4.186).toFixed(2))
				}
			},
			checked1(val) {
				console.log('checked1', val)
				if (val && this.list.length) {
					this.value = 0
					this.weight = 0
					this.ts = 0
					this.dbz = 0
					this.zf = 0
					this.list.map(res => {
						this.value += res.heat_amount * res.g / 100
						this.weight += res.g
						this.ts += res.g * res.carbohydrate / 100
						this.dbz += res.g * res.protein / 100
						this.zf += res.g * res.fat / 100
					})
					
					this.value = parseFloat(this.value.toFixed(2))
					this.changeValueUnit()
					this.weight = parseFloat(this.weight.toFixed(2))
					this.ts = parseFloat(this.ts.toFixed(2)) || ''
					this.dbz = parseFloat(this.dbz.toFixed(2)) || ''
					this.zf = parseFloat(this.zf.toFixed(2)) || ''
				} else if (val) {
					this.input()
				}
			},
			list: {
				handler(val) {
					if (this.checked1) {
						this.value = 0
						this.weight = 0
					}

					this.ts = 0
					this.dbz = 0
					this.zf = 0
					val.map(res => {
						if (this.checked1) {
							this.value += res.heat_amount * res.g / 100
							this.weight += res.g
						}

						this.ts += res.g * res.carbohydrate / 100
						this.dbz += res.g * res.protein / 100
						this.zf += res.g * res.fat / 100
					})
					
					if (this.checked1) {
					this.value = parseFloat(this.value.toFixed(2))
					this.changeValueUnit()
					this.weight = parseFloat(this.weight.toFixed(2))
					}
					this.ts = parseFloat(this.ts.toFixed(2)) || ''
					this.dbz = parseFloat(this.dbz.toFixed(2)) || ''
					this.zf = parseFloat(this.zf.toFixed(2)) || ''
				},
				deep: true
			}
		},
		methods: {
			getDetail(id) { //修改详情
				let data = {
					id
				}
				if (this.userId) data.user_id = this.userId
				this.$request({
					url: '/ApiV3/Mobile/HeatDiary/detail',
					method: 'get',
					data
				}).then(({
					data
				}) => {
					this.meals = data.meals
					this.activeDate = data.date.split(' ')[0]
					this.imgList = data.images.map(v => ({
						url: v,
						key: v
					}))
					this.upImgList = data.images.map(v => ({
						url: v,
						key: v
					}))
					if (data.sub_foods) {
						this.list = [...data.sub_foods]
					} else {
						this.value = data.heat_amount
						this.checked = true // 因为返回的heat_amount 单位是kcal
						this.weight = data.g
						this.ts = data.carbohydrate
						this.dbz = data.protein
						this.zf = data.fat
					}

					this.remarks = data.desc
				})
			},
			input() {
				if (!this.checked1) return
				this.value = parseFloat((Number(this.ts) * 4 + Number(this.dbz) * 4 + Number(this.zf) * 9).toFixed(2))
				if(this.checked) this.value = parseFloat((this.value / 4.186).toFixed(2))
				
				// this.changeValueUnit()
				this.weight = parseFloat((Number(this.ts) + Number(this.dbz) + Number(this.zf)).toFixed(2))
			},
			changeValueUnit(){
				if (this.checked) {
					this.value = parseFloat((this.value / 4.186).toFixed(2))
				} else {
					this.value = parseFloat((this.value * 4.186).toFixed(2))
				}
			},
			topic() {
				if (this.list.length) this.$common.toast('请先清空食物才可填写三大营养素信息')
			},
			addFoodCustom() {
				if ((Number(this.ts) || Number(this.dbz) || Number(this.zf)) && !this.list.length) return this.$common
					.toast('请先清空三大营养素信息才可添加食物')
				uni.navigateTo({
					url: '/pages/newHome/nutrition/addFood?addFoodType=1&userId=' + this.userId
				})
			},
			uploaded(lists) {
				console.log('uploaded', lists)
				this.upImgList = []
				lists.map(v => {
					this.upImgList.push({
						url: v.url,
					})
				})
				console.log('upImgList', this.upImgList)
				return
				let task = lists.map(res => this.$common.uploadParams(res.url))

				Promise.all(task).then(res => {

					// this.upImgList = []

					res.map(v => {
						this.upImgList.push({
							url: v.url,
							key: v.key,
						})
					})
					console.log('PromiseAll', this.upImgList)

				})
			},

			setList(val) {

				this.list.push({
					...val
				})
				console.log('添加的数据', val)
			},

			onRemove(index, lists) {

				console.log('remove', index, lists)
				this.upImgList.splice(index, 1)

			},
			remove(item, index) {
				let that = this
				uni.showModal({

					content: '是否删除' + item.title,
					success(res) {
						if (res.confirm) {
							that.list.splice(index, 1)
						}
					}
				})
			},

			awaitUploadPicture() {
				let filterImg = this.upImgList.filter(v => !v.url.includes('dev-gp.oss-accelerate.aliyuncs.com'))
				return new Promise((resolve, reject) => {
					let task = filterImg.map(res => this.$common.uploadParams(res.url))
					Promise.all(task).then(res => {



						resolve(res.map(res => res.key))
						// console.log('PromiseAll',images)

					}).catch(err => {

						uni.hideLoading()
						console.log('err', err)
						reject(err)
					})
				})

			},
			async submit() {
				
				// 用meals 区分是快捷上传还是添加自定义食物
				//快捷打卡不需要校验这些
				let value
				if (!this.meals) {
					if (!this.name && !this.meals) return this.$common.toast('请输入食物名称')
					if (!this.weight) return this.$common.toast('请输入食物重量')
					if (!this.$u.test.number(this.weight)) return this.$common.toast('请输入正确数值的食物重量')
					// if (!this.value) return this.$common.toast('请输入食物热量')

					if (!this.list.length) {
						// if (this.ts) return this.$common.toast('请输入碳水化合物')
						// if (this.dbz) return this.$common.toast('请输入蛋白质')
						// if (this.zf) return this.$common.toast('请输入脂肪')
					}
				}
				console.log('!this.$u.test.number(this.value)', this.$u.test.number(this.value))
				
				if (!this.$u.test.number(this.value)) return this.$common.toast('请输入正确数值的食物热量')
				if(this.list.length){
					const totalWeight = this.list.map(v=>v.g).reduce((a,c)=>a+c,0)
					if(totalWeight > this.weight)return this.$common.toast('子食材重量不能大于食物总重量')
					console.log('this.weight: ', this.weight)
					console.log('totalWeight: ', totalWeight)
				}
				value = this.value || 0
				if (!this.checked) { //虽然单位不同，但是还是要传kcal的值给后端 这里转换一下
					value = parseFloat((this.value / 4.186).toFixed(2))
				}
				console.log('热量value', value)
				if (!this.upImgList.length && this.meals) return this.$common.toast('请输入食物照片')

				
				let images = [];
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				try {
					if(this.upImgList.length){
						
						images = await this.awaitUploadPicture()
					}else{
						uni.hideLoading()
					}
				} catch (e) {
					//TODO handle the exception
					return this.$common.toast('上传图片有误请重试')
				}

				//过滤掉之前已经上传过的
				let imagesFliter = this.upImgList.filter(v => v.url.includes('dev-gp.oss-accelerate.aliyuncs.com'))
					.map(v => v.url)
				images = [...images, ...imagesFliter]
				console.log('最终上传的images', images)
				// 用meals 区分是快捷上传还是添加自定义食物
				let url = this.meals ? '/ApiV3/Mobile/HeatDiary/quickSave' : '/ApiV3/Mobile/Food/ufSave'
				let data = {
					id: this.obj.id ? this.obj.id : 0,
					images, // this.upImgList.map(res => res.key),
					date: this.activeDate + ' 00:00:00',
				}
				if (this.name) data.title = this.name
				if (this.weight) data.g = parseFloat(Number(this.weight).toFixed(2))
				data.heat_amount = parseFloat(Number(value).toFixed(2))
				if (this.remarks) data.desc = this.remarks
				if (this.meals) data.meals = this.meals
				data.carbohydrate = parseFloat(Number(this.ts).toFixed(2))
				data.protein = parseFloat(Number(this.dbz).toFixed(2))
				data.fat = parseFloat(Number(this.zf).toFixed(2))
				// if (this.ts) data.carbohydrate = parseFloat(Number(this.ts).toFixed(2))
				// if (this.dbz) data.protein = parseFloat(Number(this.dbz).toFixed(2))
				// if (this.zf) data.fat = parseFloat(Number(this.zf).toFixed(2))
				if (this.list.length) {
					data.sub_foods = this.list.map(res => {
						// data.carbohydrate += res.g * res.carbohydrate / 100
						// data.protein += res.g * res.protein / 100
						// data.fat += res.g * res.fat / 100
						return {
							type: res.type,
							id: res.id,
							g: parseFloat((res.g/this.weight * 100).toFixed(0)),
							title: res.title,
							heat_amount: res.heat_amount,
							carbohydrate: res.carbohydrate,
							protein: res.protein,
							fat: res.fat,
							dietary_fiber: res.dietary_fiber,
						}
					})

				} else {

				}
				console.log(data)

				if (this.userId) data.user_id = this.userId
				this.$request({
					url,
					loading: true,
					data
				}).then(res => {
					this.$common.toast('成功')
					uni.hideLoading()
					if (this.meals) { //快捷打卡添加订阅提醒
						uni.requestSubscribeMessage({
							tmplIds: ['klo5DKVBtOJmE2qwaoWyc7albYe0oHez8S7Eh0cHNL8'],
							success(res) {
								console.log('success', res)

							},
							complete(res) {
								console.log('complete', res)
							}
						})
					}
					uni.navigateBack()
				})

				// uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scope>
	.container {
		background: #f7f7f7;
		min-height: 100vh;

		.u-field {
			background: #FFF;
			// border-bottom: 1px solid #FAFAFA;
		}

		.box {
			padding: 28rpx 32rpx;
			background-color: #FFF;

		}
	}
</style>