<template>
	<view class="input_popup_content" @touchmove.stop.prevent="clear">
		<view class="title">
			<text>{{title}}</text>
		</view>
		<view class="import_content">
			<!-- <slot></slot> -->
			<!-- #ifdef APP-PLUS -->
			<input v-if="type==='input'||type==='number'" :type="type==='input'?'text':'number'" :focus="focus"
			 :show-confirm-bar="false" :adjust-position="true" v-model="modelValue" :placeholder="placeholder" placeholder-class="light_color" />
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<input v-if="type==='input'||type==='number'" :type="type==='input'?'text':'digit'" :focus="focus" :show-confirm-bar="false"
			 :adjust-position="false" @confirm="handleClick" confirm-type="提交" v-model="modelValue" :placeholder="placeholder"
			 placeholder-class="light_color" />
			<!-- #endif -->
			<textarea :maxlength="-1" @confirm="handleClick" confirm-type="提交" v-if="type==='textarea'" :focus="focus"
			 :show-confirm-bar="false" :adjust-position="true" v-model="modelValue" :placeholder="placeholder" placeholder-class="light_color"></textarea>
			<scroll-view scroll-y="true" class="slot_content">
				<view class="slot_container">
					<slot></slot>
				</view>
			</scroll-view>
		</view>
		<view class="button">
			<my-button @click="handleClick" :width="460" :height="72">{{btn || '确认'}}</my-button>
		</view>
	</view>
</template>

<script>
	import myButton from './myButton.vue'
	export default {
		props: {
			placeholder: { //input框的placeholder
				default: '',
				type: String
			},
			title: { //弹框标题
				default: '',
				type: String
			},
			btn: { //按钮标题
				default: '',
				type: String
			},
			show: { //显示弹框
				default: false,
				type: Boolean
			},
			type: { //input框类型
				default: '',
				type: String
			},
			value: { //传入值用于一开始回显数据
				default: '',
				type: [String, Number]
			}
		},
		data() {
			return {
				focus: false,
				modelValue: ''
			}
		},
		components: {
			myButton
		},
		mounted() {
			if (this.type) {
				// #ifdef APP-PLUS
				// app端直接获取焦点
				this.focus = true
				// #endif
				if (this.value !== '') {
					// 如果有值则赋值给input框
					this.modelValue = this.value
				}
			}
		},
		watch: {
			show(value) {
				if (!this.type) return false
				// #ifdef MP-WEIXIN
				if (value) {
					setTimeout(() => {
						this.focus = true
					}, 50)
				} else {
					this.focus = false
				}
				// #endif
				// #ifdef APP-PLUS
				if (value === false) {
					this.focus = false
				}
				// #endif
			},
			value(value) {
				this.modelValue = value
			}
		},
		methods: {
			// 组织冒泡
			clear(e) {
				e.stopPropagation()
			},
			// 点击确定
			handleClick() {
				this.$emit('confirm', this.modelValue || '')
			}
		}
	}
</script>

<style lang="scss">
	.input_popup_content {
		border-radius: 24upx;
		width: 640upx;

		.title {
			padding: 50rpx 0 30rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 24upx;
			font-weight: bold;
			color:#9B9B9B
		}

		.import_content {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			input {
				width: 520upx;
				height: 80upx;
				line-height: 80upx;
				box-sizing: border-box;
				border: 1px solid rgba($color: #DEDBDB, $alpha: 0.5);
				border-radius: 10upx;
				padding: 10upx 20upx;
			}

			textarea {
				width: 520upx;
				height: 160upx;
				box-sizing: border-box;
				border: 1px solid rgba($color: #DEDBDB, $alpha: 0.5);
				border-radius: 10upx;
				padding: 10upx 20upx;
			}

			.slot_content {
				max-height: 50vh;

				.slot_container {
					padding: 0 30upx;
				}
			}
		}

		.button {
			padding-top: 60upx;
			padding-bottom: 40upx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32upx;
			font-weight: bold;
		}
	}
</style>
