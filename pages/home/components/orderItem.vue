<template>
  <view
    class="goods_item_template"
    @click="jump({ url: 'home/shoppingMall/goodsDetails', data: { id: item.goods_id || item.id } })"
  >
    <image class="goods_item_image" :src="item.goods_img || item.thumb" mode="aspectFill"></image>
    <view class="goods_item_content">
      <view class="goods_item_title u-line-1" style="font-size: 32rpx">
        <text>{{ item.goods_name }}</text>
      </view>
      <view class="goods_item_title u-line-1" style="color: #888888">
        <text>{{ item.goods_attr_title || '' }}</text>
      </view>
      <view class="goods_item_price">
        <text class="text1">￥{{ item.makeprice }}</text>
        <view v-if="item.makeprice !== item.goodsprice" class="text2"> ￥{{ item.goodsprice }} </view>
        <view v-else class="text2"> </view>
        <text v-if="item.goods_number" style="color: #999; float: right; font-size: 26rpx"
          >x{{ item.goods_number }}</text
        >
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
  display: flex;
  padding: 30rpx;
  .goods_item_image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 20rpx;
    // border-radius: 10upx 10upx 0 0;
  }

  .goods_item_content {
    flex: 1;
    border-top: none;
    padding-left: 30rpx;
    // border-radius: 0 0 10upx 10upx;

    .goods_item_title {
      font-size: 24upx;
    }

    .goods_item_price {
      margin-top: 20upx;
      .text1 {
        color: #fd5624;
        font-size: 30upx;
        // font-weight: bold;
      }

      .text2 {
        color: #999;
        text-decoration: line-through;
        font-size: 30rpx;
        font-weight: normal;
      }
    }
  }
}
</style>
