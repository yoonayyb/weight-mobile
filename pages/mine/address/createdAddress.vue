<template>
	<view class="container">
		<u-form class="container_uForm" :model="form" label-width='240rpx' :label-style='labelStyle' ref="uForm">
			<u-form-item label="收货人" prop="realname">
				<u-input v-model="form.realname" placeholder='请填写收货人姓名' />
			</u-form-item>
			<u-form-item label="联系电话" prop="mobile">
				<u-input v-model="form.mobile" placeholder='请填写收货人联系电话' />
			</u-form-item>
			<u-form-item label="所在地区" prop="province">
				<view @click="regionShow=true">
					<text style="font-size:32rpx" v-if="form.adcode">{{form.province+form.city+form.area}}</text>
					<text style="font-size:32rpx" v-else class="light_color">请选择地区</text>
				</view>
			</u-form-item>
			<u-form-item label="详细地址" prop="address">
				<u-input v-model="form.address" placeholder='小区栋楼/门牌号等' />
			</u-form-item>
			<view class="separate"></view>
			<u-form-item label="设置默认地址">
				<view class="flex_aic">
					<view class="flex_aic_flex1"></view>
					<u-switch v-model="is_default" style="transform:scale(0.9)" inactive-color='#c2c2c2'
						active-color='#00b8a2'>
					</u-switch>
				</view>
			</u-form-item>
		</u-form>
		<view class="delete_address" v-if="edit" @click="delShow = true">删除地址</view>
		<view class="footer_button">
			<my-button width="690" height="100" bg="#00B8A2" @click="submit">保存</my-button>
		</view>

		<u-modal v-model="delShow" :show-title='false' :show-confirm-button="false">
			<view class="delModel_text">是否确认删除该地址？</view>
			<view class="delModel_button">
				<my-button class="cancel" width="208" height="72" color="#00B8A2" fontWeight='300'
					@click="delShow = false">取消
				</my-button>
				<my-button width="208" height="72" bg="#00B8A2" fontWeight='300' @click="delBtn">确定</my-button>
			</view>

		</u-modal>
		<u-picker mode="region" confirm-color="#00B8A2" v-model="regionShow" @confirm="handleConfirmAddress"></u-picker>
	</view>
</template>

<script>
	import infoTemplate from '@/components/infoTemplate.vue'
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {
				form: {
					realname: '', //收货人
					mobile: '', //手机号
					province: '', //省
					city: '', //市
					area: '', //区
					address: '', //详细地址
					cityStr: '',
					id: '', //地址id
				},
				is_default: false, //是否默认
				regionShow: false, //选择地区弹框
				labelStyle: { color: '#2A2A2A', fontSize: '32rpx', paddingLeft: '32rpx' }, //是否默认
				edit: false, //ture为编辑页
				delShow: false,
				// rules: {
				//   realname: [{ required: true, message: '请填写收货人姓名', trigger: ['change', 'blur'] }],
				//   mobile: [{ required: true, message: '请填写收货人联系电话', trigger: ['change', 'blur'] }],
				//   cityStr: [{ required: true, message: '请输入所在地区', trigger: ['change', 'blur'] }],
				//   address: [{ required: true, message: '请输入详细地址', trigger: ['change', 'blur'] }],
				// },
			};
		},

		onLoad(option) {
			console.log('[ onLoad ]-77', )
			if (option.edit) {
				// 如果是编辑则回显信息
				const addressData = JSON.parse(option.addressData)
				this.form = { ...addressData }
				this.is_default = addressData.is_default === 1 ? true : false
				this.edit = true
				uni.setNavigationBarTitle({
					title: '编辑收货地址'
				});
			}
		},
		onReady(option) {
			console.log('[ onReady ]-87', )
			console.log('[ option ]-86', option)

			// this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			// 删除地址按钮
			delBtn() {
				this.$request({
					url: '/ApiV3/Mobile/OrderAddress/del',
					data: {
						id: this.form.id
					},
					errMsg: true,
					loading: true
				}).then((res) => {
					console.log('[ res ]-106', res)
					this.$common.toast('删除成功')
					uni.navigateBack()
				})
			},

			// 提交数据
			submit() {
				if (!this.$u.trim(this.form.realname)) return this.$common.toast('请填写收货人姓名')
				if (this.form.mobile === '') return this.$common.toast('请填写手机号')
				if (!this.$u.test.mobile(this.form.mobile)) return this.$common.toast('手机号格式错误')
				if (this.form.address === '') return this.$common.toast('请选择地区')
				if (!this.$u.trim(this.form.address)) return this.$common.toast('请填写详细地址')
				this.$request({
					url: '/ApiV3/Mobile/OrderAddress/save',
					data: {
						...this.form,
						is_default: this.is_default ? 1 : 0,
					},
					errMsg: true,
					loading: true
				}).then(res => {
					this.$common.submitSuccess()
				})
			},
			// 默认地址改变
			defaultChange(e) {
				this.is_default = e.detail.value
			},
			// 选址省市区
			handleConfirmAddress(e) {
				console.log('e: ', e)
				this.form.province = e.province.label
				this.form.city = e.city.label
				this.form.area = e.area.label
				this.form.adcode = e.area.value
			}
		},

		components: {
			infoTemplate,
			myButton
		}
	}
</script>

<style lang="scss">
	page {
		background: #fafafa;
	}

	.address_input {
		width: 500upx;
		text-align: right;
	}

	.container {
		.container_uForm {
			.u-form {
				margin-top: 24rpx;
				font-size: 32rpx;
				background-color: #fff;

				.u-form-item {
					padding: 0 !important;
					height: 96rpx;
					line-height: 96rpx !important;
				}

				.u-input__input {
					font-size: 32rpx !important;
				}
			}

			.flex_aic {
				display: flex;
				align-items: center;
				padding-right: 32rpx;

				.flex_aic_flex1 {
					flex: 1;
				}
			}
		}
	}

	.separate {
		padding: 16rpx 0;
		background-color: #fafafa;
	}

	.delete_address {
		margin-top: 32rpx;
		height: 96rpx;
		line-height: 96rpx;
		background-color: #fff;
		text-align: center;
		color: #ff5e50;
		font-size: 32rpx;
		font-weight: bold;

		&:after {
			border-bottom-width: 1px;
		}
	}

	.delModel_text {
		font-size: 32rpx;
		text-align: center;
		padding: 32rpx;
		font-weight: bold;
		color: #2a2a2a;
	}

	.delModel_button {
		display: flex;
		justify-content: center;
		margin-bottom: 32rpx;

		.cancel {
			border-radius: 40rpx;
			border: 1px solid #00b8a2;
			color: #00b8a2;
			margin-right: 60rpx;
		}
	}
</style>