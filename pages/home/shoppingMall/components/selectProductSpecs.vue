<template>
	<u-popup v-model="show" mode='bottom' border-radius="24" safe-area-inset-bottom closeable @close="close" >
		<view style="padding: 40rpx;">
			<view class="product">
				<image class="product_image" :src="item.thumb " mode="aspectFill"></image>
				<view class="product_content">
					<view class="product_name u-line-2" :style="{ width: '100%' }">
						{{ item.title  }}
					</view>

					<view class="product_bottom u-flex-column">
						<view class="product_price">
							<!-- v-if="item.is_points === 0" -->
							<block>￥</block>
							<text>{{ item.makeprice || '' }}</text>
						</view>
						<view v-if="item.makeprice != item.goodsprice" class="product_bottom">
							<view class="product_price">

								<text class="goods_price_goodsprice">￥{{ item.goodsprice || '' }}</text>
							</view>
						</view>
					</view>

				</view>
			</view>
			<view class="category">
				<view class="category_text" v-for="(v,i) in item.packs" :key='i' @click.stop="categoryClick(v,i)">
					<text :class="{category_text_check:v.check}"
						class="category_text_ellipsis u-line-1">{{v.short_title || v.title}}</text>
				</view>
			</view>

			<view class="number" style="color:#C2C2C2">
				<text>数量</text>
				<u-number-box class="number_box" :disabled-input="true" bg-color="#00B8A2" color="#FFFFFF"
					input-width="56" size="28" :min="1" :max="max" v-model="item.goods_num"
					@change="numberChange(item)">
				</u-number-box>
			</view>
			<view class="button">
				<my-button @click="handleClick" :width="560" :height="80">{{item.type==='buy'?'立即购买':'加入购物车'}}</my-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import MyButton from '@/components/myButton.vue'
	export default {
		name: '',
		components: {
			MyButton
		},
		data() {
			return {
				show: false,
				item: {}, //商品详情
				index: 0, //购物车页面 有多个商品 所以需要索引
				max: 100, //当前规格最大数量
				categoryList: [],
				id: '', //选中的id
			}
		},

		methods: {
			handleClick() {
				if (!this.item.packs.some(res => res.check)) return this.$common.toast('请选择规格')
				this.item = {
					...this.item,
					...this.item.packs.find(res => res.id === this.id)
				}
				console.log('item', this.item)
				this.$emit('specsConfirm', this.item,this.index)
				this.show = false
			},
			close() {
				if (!this.item.packs.some(res => res.check)) return
				this.item = {
					...this.item,
					...this.item.packs.find(res => res.id === this.id)
				}
				console.log('item', this.item)
				this.$emit('close', this.item)

			},
			numberChange(item) {
				
			},
			categoryClick(v, categoryIndex) {
				this.id = v.id
				this.item.packs = this.item.packs.map((e, i) => {
					let obj = {
						...e,
						check: false
					}
					if (i === categoryIndex) {
						obj.check = !v.check
						// this.max = e.total

					}
					return obj
				});
				if (!this.item.packs.some(res => res.check)) return
				this.item = {
					...this.item,
					...this.item.packs.find(res => res.id === this.id)
				}
				// this.max = this.item.total
				// this.item.goods_num = this.max >= this.item.goods_num ? this.item.goods_num : this.max
				console.log(this.item)
			},
			//item  为商品详情
			//index 为索引 可不传
			open(item, index = 0) {
				this.show = true
				this.item = item
				this.index = index
				this.item.packs.forEach(res => {
					res.check = res.id === this.item.id
					if (res.check) {
						// this.max = res.total
					}

				})

				console.log('[ item ]-19', item)
			}
		}
	}
</script>

<style lang='scss' scoped>
	.product {
		display: flex;
		

		.product_image {
			width: 190rpx;
			height: 190rpx;
		}

		.product_content {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 8rpx;
			min-width: 0;
			flex: 1;
			.product_name {
				font-weight: bold;
				color: #2a2a2a;
				font-size: 28rpx;
			}

			.product_bottom {
				.product_price {
					font-size: 28rpx;
					font-weight: bold;
					color: #ff7569;

					.goods_price_goodsprice {
						font-size: 28upx;
						color: #c6c3c3;
						text-decoration: line-through;
					}
				}
			}
		}
	}

	.category {
		margin-top: 36rpx;

		&_text {
			margin-bottom: 44rpx;

			&_ellipsis {
				padding: 10rpx 22rpx;
				font-size: 28rpx;
				border-radius: 36rpx;
				background-color: #f3f3f3;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				display: inline-block;
				max-width: 80vw;
			}

			&_check {
				color: #ffffff;
				background-color: #00b8a2;
			}
		}
	}

	.number {
		display: flex;
		justify-content: space-between;

		.number_box {}
	}

	.button {
		display: flex;
		justify-content: center;
		margin-top: 48rpx;
	}
</style>
