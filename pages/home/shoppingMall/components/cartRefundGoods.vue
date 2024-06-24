<template>
  <view class="goods_item_order_template"
    :style="{ width: typeof width === 'string' && width.includes('%')?width: width+ 'rpx' }">
    <u-checkbox-group>
      <u-checkbox class="uCheckbox" active-color="#00B8A2" inactive-color="#C2C2C2" shape="circle" size="40" v-for="(item, index) in cartList"
        :key="index" :name="item.id" v-model="item.checked" @change="checkboxChange(item,index)">
        <view class="checkbox" >
          <image  @click.stop="jumpGoodsDetails(item)" class="goods_item_order_image" :src="item.thumb" mode="aspectFill"></image>
          <view class="goods_item_order_content">
            <view class="goods_item_order_name u-line-1" :style="{ width: '100%' }">
              {{ item.short_title || item.title }}
            </view>
            <view @click.stop="categoryClick(item,index)" class="goods_item_order_category ">
              <text class="ellipsis"> {{item.short_title || item.title }} </text>
              <u-icon name="arrow-down" size="28"></u-icon>
            </view>
            <view class="goods_item_order_bottom">

              <view class="goods_item_order_price">
                <text v-if="Number(item.makeprice)  !== Number(item.goodsprice) " class="goods_item_order_price_scribing">
                  ￥{{item.goodsprice}}
                </text>
                <text class="goods_item_order_price_makeprice">￥{{ item.makeprice || '' }}</text>
              </view>
              <view class="goods_item_order_number" style="color:#C2C2C2">
                <!-- <text>x{{ item.goods_number || '' }}</text> -->
                <u-number-box class="number_box" :disabled-input="true" bg-color="#00B8A2" color="#FFFFFF"
                  input-width="56" size="28" :min="1" :max="100" v-model="item.amount"
				  @minus="numberChange(item,index)"
                  @plus="numberChange(item,index)">
                </u-number-box>
              </view>
            </view>
          </view>

        </view>
      </u-checkbox>

    </u-checkbox-group>

  </view>
</template> 

<script>
import myButton from '@/components/myButton.vue'
export default {
  data () {
    return {
      // cartList: [],
      show: false,
    }
  },
  methods: {
    categoryClick (item, index) {
      this.$emit('categoryClick', item, index)
    },
    numberChange (item, index) {
      this.$emit('numberChange', item, index)
    },
    checkboxChange (item, index) {
	
      this.$emit('change', item, index)
    },
    jumpGoodsDetails (item) {
      this.jump({
        url: 'home/shoppingMall/goodsDetails',
        data: { id: item.id}
      })
    },
    // 公共跳转
    jump ({
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
      // default: {},
      // type: ()=>{}
    },
    cartList: {
      type: Array,
      default:()=> []
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
    myButton,
  }
}
</script>
<style>
.number_box .u-icon-minus {
  width: 32rpx !important;
}
.uCheckbox {
  border-radius: 24rpx !important;
}
.uCheckbox ::v-deep > view {
  width: 100% !important;
  background-color: #fff;
  border-radius: 24rpx;
  margin-bottom: 24rpx !important;
  padding-left: 8rpx;
}
</style>
<style lang="scss" scoped>
.ellipsis {
  font-size: 24rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goods_item_order_template {
  width: 750upx;
  // padding: 0 24upx;
  min-height: 180upx;
  display: flex;
  background: #fafafa;

  
  .checkbox {
    width: 600rpx;
    display: flex;
    align-items: stretch;
    padding-left: 12rpx;
	margin: 32rpx 8rpx 32rpx 0;
  }
  .goods_item_order_image {
    width: 190upx;
    height: 190upx;
    
    margin-right: 20upx;
    
  }

  .goods_item_order_content {
    flex: 1;
    // height: 180upx;
    display: flex;
    flex-direction: column;
	    position: relative;
		min-width: 0;
    // justify-content: space-around;
    // align-items: flex-start;
    .goods_item_order_category {
      display: flex;
      justify-content: space-between;
      max-width: 340rpx;
      font-size: 24rpx;
      padding: 0 20rpx;
      background-color: #f3f3f3;
      border-radius: 36rpx;
      height: 48rpx;
	  align-items: center;
    }
    .goods_item_order_name {
      // height: 80upx;
      display: flex;
      text-align: start;
      margin-bottom: 8rpx;
    }

    .goods_item_order_sku {
      width: 100%;
      margin-top: 5upx;
      position: relative;
      display: flex;
      height: 34upx;

      > text {
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
	  position: absolute;
	  bottom: 0;
	  left: 0;
	  width: 100%;
		
      .goods_item_order_price {
        display: flex;
        flex-direction: column;

        flex: 1;
        font-size: 28upx;
        color: #2a2a2a;
        font-weight: 700;

        &_scribing {
          position: relative;
          top: 12rpx;
          font-size: 24rpx;
          color: #c2c2c2;
          text-decoration: line-through;
          font-weight: normal;
        }
        &_makeprice {
          font-size: 28upx;
          color: #fd5624;
        }
      }
    }
  }
}
</style>
