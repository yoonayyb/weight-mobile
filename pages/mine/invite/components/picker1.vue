<template>
  <view class="view">
    <picker-view :indicator-style="indicatorStyle" :value="value" @change="bindChange" class="picker-view">
      <picker-view-column class="picker-view-column">
        <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
      </picker-view-column>
      <picker-view-column class="picker-view-column">
        <view class="item" v-for="(item,index) in months" :key="index">{{formatNumber(item)}}月</view>
      </picker-view-column>
      <picker-view-column class="picker-view-column">
        <view class="item" v-for="(item,index) in days" :key="index">{{formatNumber(item)}}日</view>
      </picker-view-column>
    </picker-view>
  </view>
</template>

<script>
export default {
  data: function () {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = 1950; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return {
      title: 'picker-view',
      years,
      year,
      months,
      month,
      days,
      day,
      value: [9999, month - 1, day - 1],
      visible: true,
      indicatorStyle: `height: 50px;`
    }
  },
  methods: {
    formatNumber (num) {
      return +num < 10 ? '0' + num : String(num);
    },
    bindChange: function (e) {
      const val = e.detail.value
      this.year = this.years[val[0]]
      this.month = this.months[val[1]]
      this.day = this.days[val[2]]
      let obj = { year: this.year, month: this.month, day: this.day }
      console.log('[ obj ]-56', obj, this.value)
      this.$emit('change', obj)
    }
  }
}
</script>
<style lang="scss" scoped>
.picker-view {
  height: 282rpx !important;
  margin-top: 20rpx;
}
.item {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .u-picker__title {
  font-size: 32rpx;
  font-weight: bold;
  color: #2a2a2a;
}
// .picker-view-column {
//   &:nth-child(1) {
//     .item {
//       justify-content: flex-end;
//     }
//   }
//   // &:nth-child(2) {
//   // }
//   &:nth-child(3) {
//     .item {
//       justify-content: flex-start;
//     }
//   }
// }

// ::v-deep .u-column-item {
//   height: 80rpx !important;
// }
</style>