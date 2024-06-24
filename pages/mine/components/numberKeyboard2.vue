<template>
	<view class="number_keyboard" :v-if="show" @touchmove.stop.prevent="clear"
		:style="{ zIndex: zIndex ,background:bg,padding:padding}">
		<view class="mast fade_in" @click="close" :class="{ fade_out: fadeOut }" :style="{ zIndex: zIndex + 1 }">
		</view>
		<view class="number_keyboard_container" :style="{ zIndex: zIndex + 2, bottom: bottom + 'px' }"
			:class="{ bottom_reverse: fadeOut }">
			<slot />

			<view class="number_keyboard_content" :style="{background:bg}">
				<view class="number_keyboard_item" :style="{width:item.value === '0' && !keyboarIcon ?'66%':'33%'}" @click="handleClickKeyboard(item)"
					v-for="(item, index) in numberKeyboardOptions" :key="index">
					<text v-if="item.type !== 'icon'">{{ item.value }}</text>

					<image v-else style="width: 48rpx;height:48rpx" :src="`${imgUrl}popup_icon_rule@2x(1).png`" mode="">
					</image>

				</view>

			</view>
			<view class="u-flex-column">
				<view class="number_keyboard_item" style="width: 154rpx;" @touchstart.stop="backspaceClick"
					@touchend="clearTimer">
					<image :src="`${imgUrl}close.png`" mode="aspectFit"></image>
				</view>
				<view class="number_keyboard_confirm_btn u-flex" @click="handleConfirm">
					<text>确定</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bottom: uni.getStorageSync('numKeyboardHeight'),
				show: true, //是否显示弹窗
				fadeOut: false, //是否执行离开动画
				numberKeyboardOptions: null, //键盘中的每个按钮数据
				firstClick: true, //是否是第一次点击 保留字段 逻辑还没写
				timer: null
			}
		},
		props: {
			keyboarIcon: {
				type: Boolean,
				default: false,
			},
			bg: {
				type: [String],
				default: '#ffffff'
			},
			padding: {
				type: [String,Number],
				default: '24rpx'
			},
			title: {
				// 标题文字
				type: [String],
				default: '记体重'
			},
			rightBtnText: {
				//标题右边按钮的文字
				type: [String],
				default: ''
			},
			toFixed: {
				//小数点后保留几位数字
				type: [Number, String],
				default: 2
			},
			max: {
				// 最大值
				type: [String, Number],
				default: 100000000
			},
			value: {
				type: [String, Number],
				default: 0
			},
			// bottom: {
			//   //弹窗距离底部的距离
			//   type: [Number, String],
			//   default: uni.getStorageSync('numKeyboardHeight')
			// },
			zIndex: {
				//弹窗层级
				type: Number,
				default: 800
			}
		},
		created() {
			this.initializationData()
		},
		methods: {
			// 点击头部右边的按钮
			handleClickRightBtn() {
				this.$emit('clickRightBtn')
			},
			// 点击确定
			handleConfirm() {
				let value = this.value.toString()
				let length = value.indexOf('.')
				if (length > -1 && length + 1 === value.length) {
					console.log('后面没数')
					value = value.replace('.', '')

				} else {
					console.log(222, value)
				}

				this.$emit('input', parseFloat(value))
				this.$emit('confirm')
			},
			// 点击退格键
			backspaceClick() {
				this.handleClickKeyboard({
					type: 'delete'
				})
				clearInterval(this.timer) //再次清空定时器，防止重复注册定时器
				this.timer = null
				this.timer = setInterval(() => {
					this.handleClickKeyboard({
						type: 'delete'
					})
				}, 250)
			},
			clearTimer() {
				clearInterval(this.timer)
				this.timer = null
			},
			// 点击键盘的事件
			handleClickKeyboard(item) {
				let value = this.value.toString()
				if (item.type === 'delete') {
					//点击删除
					if (value === '0') return false
					if (value.length > 1) {
						value = value.substr(0, value.length - 1)
					} else {
						value = '0'
					}
				} else if (item.type === 'dot') {
					//点击'.'
					if (value.indexOf('.') === -1) value += '.' //如果值中没有'.'则添加'.'
					console.log(1111, value)

				}else if (item.type === 'icon') {
					//点击'键盘收起'
					this.$emit('hideKeyBoard',true)
				}else {
					if (item.value === '00' && value === '0') return false //如果没有值且点击的是00时直接返回
					if (item.value === '0' && value === '0') return false //如果没有值且点击的是0时直接返回
					if (value.indexOf('.') !== -1 && value.split('.')[1].length >= this.toFixed) {
						return false
					}
					const max = parseFloat(this.max) //最大值
					if (max !== NaN && max !== null && max !== '' && max !== undefined) {
						// 如果有设置最大值且超过了最大值则直接返回
						if (Number(value + item.value) > max) {
							return false
						}
					}
					if (value === '0') {
						// 如果没有原来值则直接变成点击的值
						value = item.value
					} else {
						// 如果有值则拼接在一起
						value += item.value
					}
				}
				this.$emit('input', value, item.type)
			},
			// 防止冒泡
			clear(e) {
				e.stopPropagation()
			},
			// 关闭键盘
			close() {
				this.fadeOut = true
				this.$emit('change', false)
				setTimeout(() => {
					this.fadeOut = false
					this.show = false
				}, 300)
			},
			// 打开键盘
			async open() {
				this.show = true
				this.$emit('change', true)
				this.bottom = uni.getStorageSync('numKeyboardHeight') || 84
			},
			// 生成键盘按钮数据
			initializationData() {
				this.numberKeyboardOptions = [{
						value: '1'
					},
					{
						value: '2'
					},
					{
						value: '3'
					},
					{
						value: '4'
					},
					{
						value: '5'
					},
					{
						value: '6'
					},
					{
						value: '7'
					},
					{
						value: '8'
					},
					{
						value: '9'
					}
				]
				if (this.keyboarIcon) {
					this.numberKeyboardOptions.push({
						value: '',
						type: 'icon'
					}, {
						value: '0'
					}, {
						value: '.',
						type: 'dot'
					}, )
				} else {
					this.numberKeyboardOptions.push({
						value: '0'
					}, {
						value: '.',
						type: 'dot'
					}, )
				}

			}
		}
	}
</script>

<style lang="scss">
	.number_keyboard {
		// position: fixed;
		// width: 100vw;
		// height: 100vh;
		// width: 100vw;
		width: 100%;
		padding: 24rpx;
		background: #F3F3F3;

		bottom:var(--window-bottom) .mast {
			// // position: fixed;
			// top: 0;
			// left: 0;
			// width: 100vw;
			// height: 100vh;
			background: #000000;
		}

		.number_keyboard_container {
			// position: fixed;
			display: flex;

			.number_keyboard_header {
				justify-content: space-between;
				background: #ffffff;

				.number_keyboard_close {
					padding: 30upx;
					width: 200upx;
					color: #888888;
				}

				.number_keyboard_title {
					font-size: 32upx;
					font-weight: bold;
				}

				.number_keyboard_btn {
					padding: 30upx;
					width: 200upx;
					color: #888888;

					image {
						margin-left: 10upx;
						width: 11upx;
						height: 20upx;
					}
				}
			}

			.number_keyboard_value {
				padding-top: 20upx;
				padding-bottom: 40upx;
				text-align: center;
				background: #ffffff;
				font-size: 76upx;
				font-weight: bolder;

				view {
					position: relative;
				}

				.unit {
					margin-left: 15upx;
					font-size: 36upx;
					font-weight: 400;
				}
			}

			.number_keyboard_content {
				// width: 750upx;
				flex: 1;
				background: #F3F3F3;
				display: flex;
				flex-wrap: wrap;


			}

			.number_keyboard_item {
				border-radius: 8rpx;
				// width: 154rpx;
				width: 33%;
				height: 90rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 40rpx;
				font-weight: bold;
				color: #2b2b2b;
				background: white;
				// margin: 10rpx;

				image {
					width: 66upx;
					height: 43upx;
				}

				&:active {
					background: $color;
					color: white
				}
			}

			.number_keyboard_confirm_btn {
				// border-top: 10upx solid #ffffff;
				width: 154rpx;
				height: 318rpx;
				justify-content: center;
				margin: 10rpx;
				background: $color;
				font-size: 32upx;
				color: #ffffff;
				border-radius: 8rpx;
			}
		}
	}

	.fade_in {
		animation: mask_animat 0.3s forwards;
	}

	.fade_out {
		animation: mask_animat_reverse 0.3s forwards !important;
	}

	// .bottom {
	//   left: 50%;
	//   transform: translate(-50%, 100%);
	//   animation: bottom_animat 0.3s forwards;
	// }

	.bottom_reverse {
		animation: bottom_animat_reverse 0.3s forwards;
	}

	@keyframes bottom_animat {
		from {
			transform: translate(-50%, 100%);
		}

		to {
			transform: translate(-50%, 0);
		}
	}

	@keyframes bottom_animat_reverse {
		from {
			transform: translate(-50%, 0);
		}

		to {
			transform: translate(-50%, 100%);
		}
	}

	@keyframes mask_animat {
		from {
			opacity: 0;
		}

		to {
			opacity: 0.5;
		}
	}

	@keyframes mask_animat_reverse {
		from {
			opacity: 0.5;
		}

		to {
			opacity: 0;
		}
	}
</style>
