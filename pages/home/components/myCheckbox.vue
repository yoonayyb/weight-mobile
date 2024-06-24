<template>
	<view class="checkbox_template">
		<view class="checkbox_title">
			<text>{{title}}</text>
		</view>
		<view class="checkbox_content">
			<view @click="handleClick(item)" class="checkbox_item u-flex" v-for="(item,index) in option" :key="index" :style="{color:handleChecked(item)?'#ffffff':'#888888',background:handleChecked(item)?activeColor:'#f7f7f7'}">
				<text>{{item.title}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				checkedOptions: [], //已选择的数据  单项的话该数组永远只有一项，多选能为多项
			};
		},
		props: {
			multiple: { //是否可以多选
				default: false,
				type: Boolean
			},
			title: { //标题
				default: '',
				type: String
			},
			value: {
				default: '',
				type: [String, Array, Number]
			},
			option: { //选择的数据项
				default: [],
				type: Array
			},
			activeColor: { //选择的按钮颜色
				default: '',
				type: String
			}
		},
		watch: {
			value(val) {
				this.init(val)
			}
		},
		mounted() {
			this.value && this.init(this.value)
		},
		methods: {
			// 初始化处理传入的value数据
			init(val) {
				if (val === '' || val === null || val === undefined) return false
				if ((val instanceof Array) && val.length) {
					// 如果是数组就直接赋值
					this.checkedOptions = val
				} else {
					// 传入的不是数组就变成只有一项数据的数组
					this.checkedOptions = [val]
				}
			},
			// 点击checkbox
			handleClick(clickItem) {
				let hasSelect = false //当前点击项有没有选
				for (let i = 0; i < this.checkedOptions.length; i++) {
					if (clickItem.id === this.checkedOptions[i]) {
						// 如果当前点击项已经选了 则取消勾选 即在数组中去除掉
						this.checkedOptions.splice(i, 1)
						hasSelect = true
						break
					}
				}
				if (!hasSelect) { //当前项之前没有选
					if (this.multiple) {
						// 如果是多选则添加进数组
						this.checkedOptions = [...this.checkedOptions, clickItem.id]
					} else {
						// 如果是单选直接替换数组
						this.checkedOptions = [clickItem.id]
					}
				}
				let params = null
				if (this.multiple) {
					params = this.checkedOptions.length ? this.checkedOptions : ''
				} else {
					params = this.checkedOptions.length ? this.checkedOptions[0] : ''
				}
				// 更改外部v-model的值
				this.$emit('input', params);
			},
			// 判断这一项有没有选  用于选择的那一项高亮
			handleChecked(item) {
				return this.checkedOptions.some(checkedOptionsItem => {
					return checkedOptionsItem === item.id
				})
			}
		}
	}
</script>

<style lang="scss">
	.checkbox_template {
		padding: 20upx 60upx 40upx 60upx;

		.checkbox_title {
			margin-bottom: 30upx;
		}

		.checkbox_content {
			.checkbox_item {
				margin-bottom: 30upx;
				padding: 30upx;
				width: 630upx;
				background: #f7f7f7;
				border-radius: 20upx;
				color: #888888;

				&:last-child {
					margin-bottom: 0;
				}
			}

			.active {
				color: #FFFFFF;
			}
		}
	}
</style>
