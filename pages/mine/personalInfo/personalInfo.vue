<template>
	<view class="container border_t safe-area-inset-bottom" style="padding-bottom:100rpx">
		<info-template style_='min-height: 144rpx' title="头像" :icon="!other ">
			<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="handleConfirm($event, 'avatar')">
				<image v-if="infoObj.avatar" class="head" :src="infoObj.avatar" mode="aspectFill"></image>
				<image v-else class="head" :src="`${imgUrl}defaultHead.png`" mode="aspectFill"></image>
			</button>
		</info-template>
		<info-template style_='min-height: 96rpx' title="昵称" :icon="!other"
			@click="infoTempClick('showNamePopupShow',true)">
			<text v-if="infoObj.nickname">{{ infoObj.nickname }}</text>
			<text v-else class="light_color">用户昵称</text>
		</info-template>
		<!-- <info-template title="健康号">
			<text>{{infoObj.user_no||'未绑定'}}</text>
		</info-template> -->
		<info-template style_='min-height: 96rpx' @click="infoTempClick('genderShow',true)" title="性别" :icon="!other">
			<text v-if="infoObj.sex == 0 || infoObj.sex == 1">{{ infoObj.sex == 0 ? '女' : '男' }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('birthdayShow',true)" title="出生日期"
			:icon="!other">
			<text v-if="infoObj.birthday">{{ infoObj.birthday }}</text>
			<text v-else class="light_color">请选择</text>
		</info-template>
		<info-template style_='min-height: 96rpx' @click="infoTempClick('heightWeightPopupShow',true,'height')"
			title="身高" :icon="!other">
			<text v-if="infoObj.height">{{infoObj.height + ' cm'}}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<u-gap height="24" v-if="other"></u-gap>
		<!-- 自己看自己 -->
		<info-template v-if="!other" style_='min-height: 96rpx' title="初始体重" :icon="false">
			<text v-if="infoObj.weight">{{ infoObj.initial_weight + ' kg' }}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<info-template v-if="!other" style_='min-height: 96rpx' title="目标体重" :icon="false">
			<text v-if="infoObj.target_weight">{{ infoObj.target_weight + ' kg' }}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<!-- 1.如果是会员 2.会员这里如果有营养师，就拿最新阶段的目标体重，禁止编辑。3.如果没有营养师，就让他自己填 -->
		<info-template v-if="other" style_='min-height: 96rpx' title="初始体重" :icon="!other"
			@click="infoTempClick('heightWeightPopupShow',true,'initial_weight')">
			<text v-if="infoObj.initial_weight">{{ infoObj.initial_weight + ' kg' }}</text>
			<text v-else class="light_color">请填写</text>
		</info-template>
		<view v-if="!other" style="margin-top: 32rpx;"></view>
		<!--  @click="jump({ url: 'mine/personalInfo/bindMobile' })" -->
		<info-template style_='min-height: 96rpx' :title="other?'手机号码':'绑定手机号'" :icon="false">
			<text>{{ infoObj.mobile }}</text>
		</info-template>
		<u-gap height="24" v-if="other"></u-gap>
		<info-template v-if="rolesType !== 0" style_='min-height: 96rpx;' title="备注姓名"
			:icon="rolesType=== 2 || rolesType === 3" @click="infoTempClick('realnamePopupShow',true)">
			<text v-if="infoObj.realname">{{ infoObj.realname}}</text>
			<text v-else class="light_color">请输入备注名</text>
		</info-template>
		<view v-if=" rolesType === 2 " class="box">
			<view class="u-m-b-16">备注信息</view>
			<u-input class="textarea" placeholder="请输入备注信息" v-model="infoObj.remark" type="textarea" auto-height
				height="216" />
		</view>
		<view v-if="other" class="u-flex-xy-center u-m-t-40">
			<my-button @click="confirm" height="80" width="562">保存</my-button>
		</view>
		<!-- 修改姓名弹框 -->
		<u-popup :closeable='false' negative-top="30vh" duration="50" v-model="showParams.showNamePopupShow"
			border-radius="20" mode="center">
			<input-popup cancelText='取消' title="修改昵称" placeholder='这是一个昵称名字' :maxlength="20" :value="name"
				type="nickname" @confirm="handleConfirm($event, 'nickname')"
				@cancelClick='showParams.showNamePopupShow=false' :show="showParams.showNamePopupShow">
			</input-popup>
		</u-popup>
		<!-- 修改身高体重弹框 -->
		<u-popup closeable negative-top="30vh" duration="50" v-model="showParams.heightWeightPopupShow"
			@close='heightWeightPopupFn(false)' border-radius="20" mode="bottom">
			<person-scale @confirm="handleConfirm" @value='heightWeightValueFn' ref="scale"></person-scale>
		</u-popup>
		<!-- 修改备注姓名弹框 -->
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

	</view>
</template>

<script>
	import { mapGetters, mapState } from 'vuex'
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	import inputPopup from '@/components/inputPopup.vue'
	import personScale from './components/personScale.vue'
	export default {
		data() {
			return {
				name: '', //姓名
				realname: '', //备注姓名
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
				other: 0, //1是查看他人资料
				rolesType: '', //1.医生 2.服务营养师 3.其他营养师
				showType: '',
				showParams: {
					genderShow: false,
					showNamePopupShow: false,
					heightWeightPopupShow: false,
					birthdayShow: false,
				},
				roles: {},
				infoObj: {
					nickname: ''

				},
				userId: ''
			}
		},
		components: {
			infoTemplate,
			myButton,
			inputPopup,
			personScale,

		},
		computed: {
			...mapGetters(['userInfo']),
			endYear() {
				const date = new Date()
				return date.getFullYear()
			}
		},

		onLoad(option) {

			this.other = option.other //1是查看他人资料


			console.log('[   this.userInfo ]-143', this.userInfo, this.userInfo.roles)
			if (this.other) {
				uni.setNavigationBarTitle({
					title: '会员资料'
				})

				this.infoObj = { ...option }
				this.rolesType = this.$store.state.user.userInfo.id === option.id ? 0 : '' //判断是否是本人 0本人



			} else {
				this.rolesType = 0 // 本人并且是会员
				this.infoObj = { ...this.userInfo }
			}
			/*
			 会员角色：无法查看备注姓名和备注信息    other = 1
			 医生角色：可以看见备注姓名，但看不见备注信息并且不可编辑备注姓名 rolesType = 1
			 服务营养师：可以看见并修改备注姓名和备注信息 rolesType = 2
			 其他营养师：可以看见备注姓名和备注信息，但不可以编辑 rolesType = 3
			 */
			if (this.userInfo?.roles) { //小程序初始进入这个页面userInfo有可能为空
				Object.keys(this.userInfo.roles).forEach((v, i) => {
					if (v === 'isDoctor' && this.userInfo.roles[v]) { //医生
						this.rolesType = 1
						return
					}
					if (v === 'isServer' && this.userInfo.roles[v]) { //服务营养师
						this.rolesType = 2
						return
					}
					if (this.userInfo.roles[v]) { //其他营养师
						this.rolesType = 3
					}
				})
			}

			this.name = this.infoObj.nickname
			this.realname = this.infoObj.realname
		},

		methods: {
			infoTempClick(type, status, hwType) {
				//rolesType 0是查看自己信息 2是服务营养师
				console.log('type', type)


				if (!this.other || (this.rolesType === 2 && type === 'realnamePopupShow')) {
					//本人也只有是服务营养师才能修改
					if (this.rolesType !== 2 && type === 'realnamePopupShow') return
					//只有服务营养师在查看他人时可以修改备注姓名
					this.showType = type
					this.$set(this.showParams, type, status)
					// this.showParams[type] = status
					if (hwType) {
						this.heightWeightPopupFn(true, hwType)
					}
				}
			},
			heightWeightValueFn({ value, type }) {
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
						title: '修改目标体重',
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
				this.heightWeightPopupShow = status
			},
			horizontaPointMethods(e) {
				console.log('[ e ] >', e)
			},
			// 修改用户信息
			editUserInfo(data, callback) {
				if (this.other === 0) {
					//修改自己资料
					this.$request({
						url: '/ApiV2/Mobile/User/edit',
						data,
						errMsg: true,
						loading: true
					}).then((res) => {
						callback && callback()
					})
				} else {
					this.editConsumerInfo(data, callback)
				}
			},
			editConsumerInfo(data, callback) {
				let dataObj = data ? { ...data, user_id: this.infoObj.id } : { ...this.infoObj }
				//更新客户资料
				this.$request({
					url: '/ApiV3/Mobile/Staff/customerEdit',
					data: dataObj,
					errMsg: true,
					loading: true
				}).then((res) => {
					callback && callback()
				})
			},
			// 公共跳转
			jump({ url = '', data = '' }) {
				this.$common.jump({
					url,
					data,
					that: this
				})
			},
			onChooseAvatar(avatarUrl) {

				return new Promise((resolve, reject) => {
					let that = this
					this.$common.uploadParams(avatarUrl).then(data => {
						//更新数据到后台
						that.$request({
								url: '/ApiV2/Mobile/User/updateUserProfile',
								data: {
									avatar: data.key
								}
							})
							.then((res) => {

								this.$set(that.infoObj, 'avatar', data.url)
								that.$store.dispatch('getUserInfo')
							})
							.catch(async (err) => {})
					}).catch(err => {
						this.$common.toast('上传失败，请重试');
					})
				})


			},
			// 选择器点击确定的回调
			async handleConfirm(e, type) {
				console.log('[ e, type ]-213', e, type)
				let data
				if (type === 'avatar') {
					const { avatarUrl } = e.detail
					await this.onChooseAvatar(avatarUrl)
					data = { avatar: this.infoObj.avatar }
				} else if (type === 'birthday') {
					this.birthday = e.year + '-' + e.month + '-' + e.day
					this.defaultTime = e.year + '-' + e.month + '-' + e.day
					data = { birthday: this.birthday }
				} else if (type === 'gender') {
					this[type] = e[0].label
					data = { sex: e[0].value }
				} else {
					data = {
						[type]: e.value || e }
				}
				this.editUserInfo(data, () => {
					const userInfo = {
						...this.infoObj,
						...data
					}
					this.infoObj.nickname = userInfo.nickname
					this.infoObj.realname = userInfo.realname
					this.name = userInfo.nickname
					this.realname = userInfo.realname
					this.infoObj = { ...userInfo }
					this.$store.commit('setUserInfo', userInfo)
					this.showParams[this.showType] = false
					this.$common.toast('保存成功')
				})
			},
			confirm() { //这个是修改会员 不能保存到本地记录
				this.editConsumerInfo({ remark: this.infoObj.remark }, () => {
					// const userInfo = {
					//   ...this.infoObj,
					// }
					// this.realname = userInfo.realname
					// this.$store.commit('setUserInfo', userInfo)
					this.showParams[this.showType] = false
					this.$common.toast('保存成功')
				})
			},
			// input弹框点击确定的回调
			/*   inputConfirm (value, type, showType) {
        const self = this
  
        function submit (key) {
          const data = {}
          data[key] = value
          self.editUserInfo(data, () => {
            self[showType] = false
            const userInfo = {
              ...self.userInfo
            }
            userInfo[key] = value
            self.$store.commit('setUserInfo', userInfo)
          })
        }
        this[type] = value
        if (type === 'name') {
          submit('nickname')
        } else if (type === 'brief') {
          submit('remark')
        } else if (type === 'weight') {
          submit('weight')
        } else {
          this[showType] = false
        }
      } */
		}
	}
</script>

<style lang="scss">
	page {
		background: #f7f7f7;
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
			font-size: 28rpx;
		}
	}

	.personalInfo_picker {
		::v-deep .u-picker__title {
			font-size: 32rpx;
			font-weight: bold;
			color: #2a2a2a;
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