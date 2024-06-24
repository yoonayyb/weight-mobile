<template>
	<view class="goods_item_order_template"
		:style="{ width: typeof width === 'string' && width.includes('%')?width: width+ 'rpx' }" @click="
      jump({
        url: 'home/shoppingMall/goodsDetails',
        data: { id: item.goods_id || item.order_goods.goods_id }
      })
    ">
		<image :src="item.goods_img || item.order_goods.goods_img" mode="aspectFill"></image>
		<view class="goods_item_order_content">
			<view class="goods_item_order_name u-line-2" :style="{ width: '100%' }">
				{{ item.goods_name || item.order_goods.goods_name }}

			</view>
			
			<view class="goods_item_order_bottom">
				<!-- 订单 -->
				<view v-if="!item.order_goods" class="goods_item_order_price">
					<view v-if="Number(item.goodsprice) !== Number(item.makeprice)" style="color:#C2C2C2;text-decoration: line-through;font-weight: normal;">
						￥{{item.goodsprice}}
					</view>
					<view>
						<block >￥</block>
						<text>{{ item.makeprice || '' }}</text>
					</view>

				</view>
				<!-- 售后订单 -->
				<view v-else class="goods_item_order_price">
					<view v-if="Number(item.order_goods.goodsprice) !== Number(item.order_goods.makeprice)" style="color:#C2C2C2;text-decoration: line-through;font-weight: normal;">
						￥{{item.order_goods.goodsprice}}
					</view>
					<view>
						<block >￥</block>
						<text>{{ item.order_goods.makeprice || '' }}</text>
					</view>
				</view>
				<view class="goods_item_order_number" style="color:#C2C2C2">
					<text>x{{ item.goods_number || item.refund_num }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import myButton from '@/components/myButton.vue'
	export default {
		data() {
			return {}
		},
		methods: {
			
			// 公共跳转
			jump({
				url = '',
				data = ''
			}) {
				if (this.jumpGoods) {
					this.$common.jump({
						url,
						data,
						that: this
					})
				}
			}
		},
		props: {
			orderId: {
				default: 0,
				type: [String, Number]
			},
			item: {
				type:Object,
				default: ()=>{},
			},
			width: {
				default: 750,
				type: [String, Number]
			},
			jumpGoods: {
				default: true,
				type: Boolean
			},
			applyForAfterSaleBtn: {
				default: false,
				type: Boolean
			},
			stop: {
				default: false,
				type: Boolean
			}
		},
		components: {
			myButton
		}
	}
</script>

<style lang="scss">
	.goods_item_order_template {
		width: 750upx;
		padding: 0 24upx;
		height: 180upx;
		display: flex;
		background: #ffffff;
		align-items: center;

		>image {
			width: 160upx;
			height: 160upx;
			// border-radius: 10upx;
			margin-right: 20upx;
		}

		.goods_item_order_content {
			flex: 1;
			height: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			// align-items: flex-start;

			.goods_item_order_name {
				
				// display: flex;
				text-align: start;
				
			}

			.goods_item_order_sku {
				width: 100%;
				margin-top: 5upx;
				position: relative;
				display: flex;
				height: 34upx;

				>text {
					color: #888888;
					font-size: 28upx;
				}

				.goods_item_order_number {
					font-size: 28rpx;
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}
			}

			.goods_item_order_bottom {
				// margin-top: 20upx;
				display: flex;
				align-items: flex-end;
				justify-content: flex-end;

				.goods_item_order_price {

					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: flex-start;
					font-size: 24upx;
					color: #2A2A2A;
					font-weight: 700;


				}
			}
		}
	}
</style>
