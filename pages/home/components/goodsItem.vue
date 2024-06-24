<template>
  <view
    class="goods_item_template border"
    @click="jump({ url: 'home/shoppingMall/goodsDetails', data: { id: item.goods_id || item.id } })"
  >
    <image class="goods_item_image" :src="item.goods_img || item.thumb" mode="aspectFill"></image>
    <view class="goods_item_content">
      <view class="goods_item_title u-line-2">
        <text>{{ item.title || item.goods_name }}</text>
      </view>
      <view class="goods_item_price">
        <text class="text1">￥{{ item.makeprice }}</text>
        <text v-if="item.makeprice != item.goodsprice" class="text2">￥{{ item.goodsprice }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    item: {
      default: {},
      type: Object
    }
  },
  methods: {
    jump({ url = '', data = '' }) {
      this.$common.jump({
        url,
        data,
        that: this
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.goods_item_template {
  width: 330upx;
  display: flex;
  flex-direction: column;

  .goods_item_image {
    width: 100%;
    height: 330upx;
    // border-radius: 10upx 10upx 0 0;
  }

  .goods_item_content {
    width: 330upx;
    height: 180upx;
    border-top: none;
    padding: 20upx;
    border-radius: 0 0 10upx 10upx;

    .goods_item_title {
      height: 80upx;
      line-height: 40rpx;
      font-size: 24upx;
    }

    .goods_item_price {
      .text1 {
        margin-top: 10upx;
        color: #fd5624;
        font-size: 30upx;
        // font-weight: bold;
      }

      .text2 {
        color: #999;
        text-decoration: line-through;
        font-size: 24rpx;
        margin-left: 10rpx;
        font-weight: normal;
      }
    }
  }
}
</style>
