<template>
  <view class="mine_operation_item border_b u-flex u-row-between" @click="handleClick">
    <view class="operation_left u-flex">
      <slot></slot>
      <!-- <image :src="`${igmUrl}address.png`" mode="widthFix"></image> -->
      <text>{{ label }}</text>
    </view>
    <view class="operation_right u-flex">
      <image :src="`${imgUrl}toRight2.png`" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    label: {
      default: '',
      type: String
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.mine_operation_item {
  height: 105upx;
  padding: 0 30upx;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translate(-50%);
    width: 630upx;
    height: 1px;
    background: rgba($color: #dedbdb, $alpha: 0.5);
  }

  &:last-child {
    &::after {
      height: 0;
    }
  }

  .operation_right {
    image {
      width: 14upx;
      height: 25upx;
    }
  }
}
</style>
