<template>
  <view class="info_template border_b" :style="style_" @click="handleClick">
    <view class="info_left u-flex">
      <slot name="icon"></slot>
      <text>{{ title }}</text>
    </view>
    <view class="info_right" :class="textNoWidth ? '' : 'text_width'">
      <slot></slot>
      <image v-if="icon" class="icon" :src="`${imgUrl}toRight2.png`" mode="aspectFit"></image>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      //对应左边的text
      default: '',
      type: String
    },
    icon: {
      //是否有右边箭头的icon
      default: false,
      type: Boolean
    },
    style_: {
      //传入的样式
      default: '',
      type: String
    },
    textNoWidth: {
      //右边的内容是否有默认宽度
      default: false,
      type: Boolean
    }
  },
  methods: {
    // 点击事件
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.info_template {
  background: #ffffff;
  padding: 0 30upx;
  min-height: 105upx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28upx;
  position: relative;

  .info_left {
    display: flex;
    align-items: center;
	min-width: 120rpx;
  }

  .info_right {
    display: flex;
    align-items: center;

    .icon {
      margin-left: 16upx;
      width: 14upx;
      height: 25upx;
    }

    .head {
      width: 80upx;
      height: 80upx;
      border-radius: 50%;
    }

    text {
      text-align: right;
    }

    input {
      text-align: right;
    }
  }

  .text_width {
    text {
      width: 400upx;
    }
  }
}
</style>
