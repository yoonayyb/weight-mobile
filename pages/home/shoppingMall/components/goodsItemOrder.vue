<template>
  <view class="goods_item_order_template"
    :style="{ width: typeof width === 'string' && width.includes('%')?width: width+ 'rpx' }" @click="
      jump({
        url: 'home/shoppingMall/goodsDetails',
        data: { id: item.id,hospitalId:item.hospitalId}
      })
    ">
    <image  :src="item.thumb" mode="aspectFill"></image>
    <view class="goods_item_order_content">
      <view class="goods_item_order_name u-line-2" :style="{ width: '100%' }">
        {{ item.title || '' }}

      </view>
      <!-- <view class="goods_item_order_sku">
        <text class="u-line-1" :style="{ width: width - 350 + 'rpx' }">{{ item.goods_attr_title || '' }}</text>
        <view v-if="applyForAfterSaleBtn" class="goods_item_order_number">
          <text>x{{ item.goods_number || '' }}</text>
        </view>
      </view> -->
      <view class="goods_item_order_bottom">
        <!-- <view class="goods_item_order_price">
          <block v-if="item.is_points === 0">￥</block>
          <text>{{ item.makeprice || '' }}</text>
        </view> -->
        <view class="goods_item_order_price">
          <view v-if="Number(item.makeprice)  !== Number(item.goodsprice) " style="color:#C2C2C2;text-decoration: line-through;font-weight: normal;">
            ￥{{item.goodsprice}}
          </view>
          <view >
            <block>￥</block>
            <text>{{ item.makeprice || '' }}</text>
          </view>

        </view>
        
        <view class="goods_item_order_number" style="color:#C2C2C2">
          <text>x{{ item.goods_num || '' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import myButton from '@/components/myButton.vue'
export default {
  data () {
    return {}
  },
  methods: {
    
    // 公共跳转
    jump ({ url = '', data = '' }) {
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
  margin-bottom: 20rpx;
  height: 180upx;
  display: flex;
  background: #ffffff;
  align-items: center;
  > image {
    width: 160upx;
    height: 160upx;
   
    margin-right: 20upx;
  }

  .goods_item_order_content {
    flex: 1;
    height: 160upx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    // align-items: flex-start;

    .goods_item_order_name {
      
      text-align: start;
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
      justify-content: flex-end;

      .goods_item_order_price {
        flex: 1;

        font-size: 24upx;
        color: #2a2a2a;
        font-weight: 700;
      }
    }
  }
}
</style>
