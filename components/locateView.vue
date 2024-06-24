<template>
  <view
    class="locate_menu_view"
    v-if="showOperationMenu"
    :style="{ top: operationMenuTop + 'px', left: operationMenuLeft + 'px' }"
  >
    <view
      class="locate_menu_item"
      :style="{ width: itemWidth + 'rpx', height: itemHeight + 'rpx' }"
      v-for="(item, index) in buttons"
      :key="index"
      @click.stop="handleClick(index)"
    >
      <text>{{ item }}</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showOperationMenu: false, //显示操作菜单
      operationMenuTop: 0, //操作菜单定位值
      operationMenuLeft: 0 //操作菜单定位值
    }
  },
  /*
   * @property {Number} itemWidth 按钮操作菜单每一项的宽度
   * @property {Number} itemHeight 按钮操作菜单每一项的高度
   * @property {Array} buttons 按钮操作菜单配置
   */
  props: {
    itemWidth: {
      type: Number,
      default: 250
    },
    itemHeight: {
      type: Number,
      default: 80
    },
    buttons: {
      type: Array,
      default: ['操作']
    }
  },
  methods: {
    // 点击某个按钮菜单
    handleClick(index) {
      this.$emit('click', index)
    },
    // 打开操作菜单
    open(e) {
      const x = e.touches[0].pageX
      const y = e.touches[0].pageY
      const menuWidth = uni.upx2px(this.itemWidth)
      const menuHeight = uni.upx2px(this.itemHeight * this.buttons.length)
      uni.getSystemInfo({
        success: (res) => {
          if (x + menuWidth + 20 >= res.windowWidth) {
            this.operationMenuLeft = x - menuWidth - 10
          } else {
            this.operationMenuLeft = x + 10
          }
          if (y + menuHeight + 20 >= res.windowHeight) {
            this.operationMenuTop = y - menuHeight - 10
          } else {
            this.operationMenuTop = y + 10
          }
          this.showOperationMenu = true
        }
      })
    },
    // 关闭操作菜单
    close() {
      this.showOperationMenu = false
    }
  }
}
</script>

<style lang="scss">
.locate_menu_view {
  position: absolute;
  z-index: 2;
  background: #ffffff;
  box-sizing: border-box;
  box-shadow: 0 2rpx 10rpx 0 rgba(136, 136, 136, 0.2);

  .locate_menu_item {
    padding: 0 30upx;
    display: flex;
    align-items: center;

    &:active {
      background: #f1f1f1;
    }
  }
}
</style>
