<template>
  <view
    class="button_template"
    @click.stop="handleClick"
    :style="{
      width: width + 'rpx',
      height: height + 'rpx',
      borderRadius: borderRadius !== '' ? borderRadius : height / 2 + 'rpx',
      background:(bg==='#9B9B9B' || bg==='#E8E8E8')  ? bg:color ? '' : bg,
      color: color,
      border:border? `2rpx solid ${border}`: color ? `2rpx solid ${color}` : `2rpx solid none`,
      margin: margin,
      fontSize: fontSize + 'rpx',
      fontWeight,
	  opacity
    }"
    :class="stop ? 'stop' : ''"
  >
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
	opacity: {	
      //透明度
      default: '1',
      type: [String,Number]
    },
    borderRadius: {
      //圆角  如果没传则默认是椭圆  即高度的一半
      default: '',
      type: String
    },
	border:{
      default: '',
      type: String
    },
    color: {
      //边框和字体颜色  如果传了color 则没有背景色 出现边框
      default: '',
      type: String
    },
    margin: {
      default: '',
      type: String
    },
    bg: {
      //背景颜色
      default: '#00B8A2',
      type: String
    },
    width: {
      default: 200,
      type: [Number, String]
    },
    height: {
      default: 70,
      type: [Number, String]
    },
    stop: {
      //是否禁用
      default: false,
      type: [String, Boolean]
    },
    fontSize: {
      //字体大小
      default: '28',
      type: [String, Number]
    },
    fontWeight: {
      //字体粗细
      default: 'normal',
      type: [String, Number]
    }
  },
  methods: {
    // 点击事件
    handleClick() {
      if (this.stop) return false
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.button_template {
  // margin-left: 20upx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 28upx;
  position: relative;
}

.stop {
  opacity: 0.6 !important;
}
</style>
