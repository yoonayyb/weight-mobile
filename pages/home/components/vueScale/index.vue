<template>
  <div>
    <!-- 横向 -->
    <view class="wrapper horizontal-box" id="scale-wrapper" :style="{ background: stylesObj.bgoutside }"
      v-if="direction === 'horizontal'">
      <view class="scale-mask" v-if="!scroll" />
      <!-- 选中的横条  -->
      <view class="zz" :style="{ backgroundColor: stylesObj.lineSelect }" />
      <scroll-view class="scroll-view" style="width: 100vw" :scroll-x="true" :scroll-left="centerNum"
        :scroll-with-animation="true" @scroll="bindscroll" @scrollEnd='scrollEnd' :show-scrollbar="false"
        :enhanced="true">
        <view class="scroll-wrapper">
          <!-- 左补白 -->
          <view class="seat" :style="{ width: windowLeftWidth / 2 + 'px' }" />

          <!-- 标尺容器 -->
          <view class="scale-container">
            <view class="scale-wrapper">
              <view class="scale-grip" v-for="(item, index) in grid" :key="index"
                :style="{ height: h + 'px', borderColor: stylesObj.line }">
                <view class="scale-grip-item" v-for="(it, idx) in 10" :key="idx" :style="{
                    width: single + 'px',
                    height: (idx === 4 ? '80' : '60') + '%',
                    borderColor: stylesObj.line
                  }" />
              </view>
            </view>
            <!-- 标尺数显示，长度：每格长度*个数 -->
            <view class="scale-vaule-wrapper" :style="{
                width: single * 10 * grid + 'px',
                color: stylesObj.fontColor,
                fontSize: stylesObj.fontSize + 'px'
              }">
              <view class="scale-value first-scale-value" :style="{ width: single * 10 + 'px' }">{{ min }}</view>
              <view v-if="int" style="display: flex">
                <view class="scale-vaule" v-for="(item, index) in grid" :key="index"
                  :style="{ width: single * 10 + 'px' }">{{ min + 10 * (index + 1) }}
                </view>
              </view>
              <view v-else style="display: flex">
                <view class="scale-vaule" v-for="(it, index) in grid" :key="index"
                  :style="{ width: single * 10 + 'px' }">{{ min + (index + 1) }}
                </view>
              </view>
            </view>
          </view>

          <!-- 右补白 -->
          <view class="seat" :style="{ width: windowRightWidth / 2 + 'px' }" />
        </view>
      </scroll-view>
    </view>
  </div>
</template>

<script>
/**
 min[number] 默认值 0, // 最小值
 max[number] 默认值 100, // 最大值
 int[boolean] 默认值 true, // 是否开启整数模式 ，false为小数模式  true 整数模式
 single[number] 默认值 10, // 单个格子的实际长度（单位rpx）
 h[number] 默认值 0,// 自定义高度 初始值为80
 active[null] 默认值 center ，// 自定义选中位置  （三个值 min, max ,center , 范围内合法数值）
 styles[object]  // 自定义卡尺样式
 */

export default {
  name: '',
  components: {},
  props: {
    // 最小值
    min: {
      type: Number,
      default: 0
    },
    // 最大值
    max: {
      type: Number,
      default: 100
    },
    // 是否开启整数模式
    int: {
      type: Boolean,
      default: false
    },
    // 每个格子的实际行度 （单位px ，相对默认值）
    single: {
      type: Number,
      default: 10
    },
    // 高度
    h: {
      type: Number,
      default: 60
    },
    // 是否禁止滚动
    scroll: {
      type: Boolean,
      default: true
    },
    // 方向
    direction: {
      type: String,
      default: 'horizontal'
    },
    // 当前选中
    active: {
      type: null,
      default: '0'
    },
    styles: {
      type: Object,
      default: () => { }
    },
    pageOffset: {
      //组件缩小时 需要传入对应的宽度确保左右滑动最后的空白宽度正确 否则会滑不到底
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      defaultStyles: {
        line: '#dbdbdb', // 刻度颜色
        bginner: '#fbfbfb', // 前景色颜色
        bgoutside: '#dbdbdb', // 背景色颜色
        lineSelect: '#6643e7', // 选中线颜色
        fontColor: '#404040', // 刻度数字颜色
        fontSize: 16 // 字体大小
      },
      rul: {},
      windowHeight: 0,
      oldValue: null,
      oldValueFrequency: 1,
      windowWidth: '',
      windowRightWidth: '', //右边的空白宽度
      windowLeftWidth: '', //左边的空白宽度
      horizontalTime: null,
      verticalTime: null,
      timer: null,
      timeout: null,
      flag: null,
      grid: '',
      centerNum: '',
      stylesObj: {}
    }
  },
  computed: {},
  watch: {},
  onReady () {
    const min = parseInt(this.min, 10) || 0
    const max = parseInt(this.max, 10) || 100
    this.min = min
    this.max = max

    this.init()
  },
  created () { },
  mounted () { },
  methods: {

    // 初始化
    init () {
      this.oldValue = null
      console.log('初始化刻度组件')
      // 设置默认值
      const min = this.min || 0
      const max = this.max || 0
      /**
       * grid 外层的刻度尺，里面有10个小刻度尺(10个小刻度尺直接拿10遍历出来)
       * 整数：
       *  需要除以10，此时里面的一个小刻度尺代表1
       *  例如：30-80 此时需要5个外层刻度尺。
       * 小数：
       *  不需要除以10，此时里面的一个小刻度尺代表0.1
       *  例如：30-80 此时需要50个外层刻度尺。
       *
       */
      let grid
      if (this.int) {
        grid = (max - min) / 10
      } else {
        grid = max - min
      }
      this.stylesObj = Object.assign(this.defaultStyles, this.styles)
      this.grid = grid

      // 当前选中的 active
      let activeVal = this.selectActiveVal()
      if (activeVal < min || activeVal > max) {
        // 默认数字不合理
        activeVal = (min + max) / 2
      }
      if (this.int) {
        let diff = (activeVal - min) / 10 // 移动diff格
        /* eslint-disable-next-line */
        if (diff < 0 || isNaN(diff) || !diff) diff = 0
        // this.single 每个小格子长度
        const centerNum = diff * this.single * 10
        setTimeout(() => {
          this.centerNum = centerNum
        }, 200)
      } else {
        const diff1 = (activeVal - min) * 10 // 移动diff格
        const centerNum = diff1 * this.single
        setTimeout(() => {
          this.centerNum = centerNum
        }, 200)
      }
      //  获取节点信息，获取节点宽度
      const query = this.createSelectorQuery().in(this)
      query
        .select('#scale-wrapper')
        .boundingClientRect(() => {
          // res.top; // 这个组件内 #the-id 节点的上边界坐标
        })
        .exec((e) => {
          this.windowRightWidth = e[0].width + (this.pageOffset * 2)
          this.windowLeftWidth = e[0].width
          this.windowHeight = e[0].height
        })
    },
    // 给定的选中默认值
    selectActiveVal () {
      // 当前选中位置设置
      let activeVal
      if (this.active === 'min') {
        activeVal = this.min
      } else if (this.active === 'max') {
        activeVal = this.max
      } else if (this.active === 'center') {
        activeVal = (this.min + this.max) / 2
      } else {
        activeVal = this.active ? this.active : this.min
      }
      return activeVal
    },
    // 滚动
    bindscroll (e, e2) {
      // 移动的距离
      let offset = 0
      offset = e.detail.scrollLeft
      // 选中的值
      let value
      value = this.min + offset / this.single / 10
      value = value.toFixed(1)
      if (value > this.max) value = this.max
      this.$emit('value', value)
      console.log('[ value ]-249', value)
      this.debounce(this.accurateLeft, 400, false, { value })
    },
    scrollEnd (val, e) {
      console.log('[ (scrollEnd,e ]-264', val, e)
    },
    accurateLeft ({ value }) {
      console.log('[ bbbbvalue ]-255', value)
      //两次值相同则不触发emit
      if (this.oldValue === value) {
        return
      }
      this.oldValue = value
      const centerNum = (value - this.min) * this.single * 10 + Math.random() ** 10
      this.$emit('value', value, true)
      this.centerNum = centerNum
    }
    ,
    // 节流
    throttle (func, wait = 500, immediate = true, params) {
      if (immediate) {
        if (!this.flag) {
          this.flag = true;
          // 如果是立即执行，则在wait毫秒内开始时执行
          typeof func === 'function' && func(params);
          this.timer = setTimeout(() => {
            this.flag = false;
          }, wait);
        }
      } else {
        if (!this.flag) {
          this.flag = true
          // 如果是非立即执行，则在wait毫秒内的结束处执行
          this.timer = setTimeout(() => {
            this.flag = false
            typeof func === 'function' && func(params);
          }, wait);
        }

      }
    },
    //防抖
    debounce (func, wait = 500, immediate = false, params) {
      // 清除定时器
      if (this.timeout !== null) clearTimeout(this.timeout);
      // 立即执行，此类情况一般用不到
      if (immediate) {
        var callNow = !timeout;
        this.timeout = setTimeout(function () {
          this.timeout = null;
        }, wait);
        if (callNow) typeof func === 'function' && func();
      } else {
        // 设置定时器，当最后一次操作后，timeout不会再被清除，所以在延时wait毫秒后执行func回调方法
        this.timeout = setTimeout(function () {
          typeof func === 'function' && func(params);
        }, wait);
      }
    }
  }
}
</script>

<style lang="less" scoped>
view,
text {
  box-sizing: border-box;
}
.wrapper {
  position: relative;
}
.scale-mask {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
}
.horizontal-box {
  padding-top: 20rpx;
  .scroll-wrapper {
    position: relative;
    display: flex;
  }
  .zz {
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%);
    height: 70rpx;
    width: 30rpx;
    // background-color: #5b73f2;
    z-index: 10;
    // width: 0px;
    // height: 0px;
    // border: 10px solid transparent;
    // border-top-color: #00B8A2;
    border-radius: 6rpx;
    clip-path: polygon(0 0, 100% 0, 60% 30%, 60% 100%, 40% 100%, 40% 30%, 0 0);
  }
  .scale-wrapper {
    display: flex;
    border-top: 1px solid #dddddd;
  }
  .scale-grip {
    position: relative;
    height: 80rpx;
    display: flex;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      border-width: 1px;
      border-color: inherit;
      border-style: solid;
      height: 100%;
      transform: translateX(-50%);
      left: 0rpx;
    }
    &:last-child {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        border-width: 1px;
        border-color: inherit;
        border-style: solid;
        height: 100%;
      }
    }
  }
  .scale-grip-item {
    height: 60%;
    padding-top: 10rpx;
    &:not(:last-child) {
      border-right: 1px solid #000000;
    }
  }
  .scale-vaule-wrapper {
    position: relative;
    display: flex;
    text-align: center;
  }
  .scale-vaule {
    padding: 30rpx 0;
    transform: translateX(50%);
  }
  .first-scale-value {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 20rpx 0;
    transform: translateX(-50%);
  }
  .seat {
    flex-shrink: 0;
    box-sizing: border-box;
    border-top: 1px solid #ddd;
  }
}
</style>
