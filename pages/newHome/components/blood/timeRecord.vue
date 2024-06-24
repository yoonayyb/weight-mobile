<template>
  <view class="u-timeRecord">
    <view v-if="openDropdown" @click="closeDropdown" class="dropdown_mask"></view>
    <u-sticky offset-top="-36" >
      <view v-if="naviTitle!=='blood-pressure'" class="u-timeRecord-header">
        <view style="flex-grow: 2">日期</view>
        <view>时间点</view>
        <u-dropdown
          @open="openDropdown = true"
          ref="dropdown"
          style="flex-grow: 2"
          :length="options1.length"
          :height="dropdownHeight"
          class="u-timeRecord-dropdown"
          active-color="#00B8A2"
          inactive-color="#2a2a2a"
        >
		<!-- :options="options1" -->
          <u-dropdown-item
            
            class="u-timeRecord-dropdown-item"
            v-model="timeSlot"
            title="时间段"
          >
		  <view class="slot-content" >
				<view @click="itemChange(item.value,index)" :class="[{'active':active === index}]" v-for="(item,index) of options1" :key="index" >{{item.label}}</view>
			
		  					
		  </view>
          </u-dropdown-item>
        </u-dropdown>
        <view>血糖值</view>
      </view>
	  <view v-else class="u-timeRecord-header">
		  <view >日期</view>
		  <view>时间点</view>
		  <view>高压</view>
		  <view>低压</view>
		  <view>脉搏</view>
	  </view>
    </u-sticky>
    <!-- <scroll-view
      :scroll-into-view="scrollViewId"
      :scroll-top="0"
      :scroll-y="scrollY"
      class="scroll-Y"
      @scrolltoupper="upper"
    > -->
    <view v-if="table.length" class="u-timeRecord-content" style="text-align: center">
      <!-- <view style="margin-top: 20rpx">
        <u-loading :show="!requestType"></u-loading>
      </view> -->

      <view
		
        @click="edit(v)"
        @longpress="clickInfo(v)"
        class="u-timeRecord-content-info"
        :id="'record' + i"
        :class="['record' + i]"
        v-for="(v, i) in table"
        :key="i"
      >
	  <block v-if="naviTitle !=='blood-pressure'">
        <view style="flex-grow: 2">
          {{ v.date | formatDate1 }}
        </view>
        <view>
          {{ new Date(v.date.replace(/\-/g, '/')) | timeship }}
        </view>
        <view style="flex-grow: 2" >
          {{ setDateVal(v.time_enum) }}
        </view>
        <view :class="{ sizeColor: !v.status }">
          {{ v.sugar }}
        </view>
     
	  </block>
	  <block v-else>
		  <view >
		      {{ new Date(v.date.replace(/\-/g, '/')) | formatDate2 }}
		    </view>
		    <view>
		      {{ new Date(v.date.replace(/\-/g, '/')) | timeship }}
		    </view>
		    <view :style="{color:v.max_status?'':'#FFC76B'}">
		      {{ v.max && parseFloat(Number(v.max).toFixed(1)) }}
		    </view>
		    <view :style="{color:v.min_status?'':'#FFC76B'}">
		      {{ v.min && parseFloat(Number(v.min).toFixed(1)) }}
		    </view>
		  <view>
		    {{ v.pulse && parseFloat(Number(v.pulse)).toFixed() || '-'}}
		  </view>
	  </block>
    </view>
	</view>
    <view style="margin-top: 200rpx; text-align: center" v-else>
      <image style="height: 180rpx; width: 180rpx" :src="`${imgUrl}blood_norecord.png`" mode="aspectFit"></image>
      <view style="color: #c2c2c2; margin-top: 16rpx">暂无记录</view>
    </view>
    <!-- </scroll-view> -->
    <u-popup class="popup3" v-model="show" mode="center" width="590rpx" height="248rpx" border-radius="12">
      <view class="popup-text-view" v-if="naviTitle !== 'blood-pressure'" style="padding: 48rpx">确定删除此血糖记录？</view>
      <view class="popup-text-view" v-else style="padding: 48rpx">确定删除此血压记录？</view>
      <view class="popup-btn">
        <u-button
          @click="
            () => {
              show = false
            }
          "
          >取消</u-button
        >
        <u-button @click="confirmBtn" plain class="popup-btn-right">确认</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>

const time_enum = {
  空腹: 1,
  睡前: 2,
  凌晨3点: 3,
  早餐后2小时: 4,
  午餐前:7,
  午餐后2小时: 5,
  晚餐前: 8,
  晚餐后2小时: 6,
  未选: 0,
  全部: ''
}
export default {
  name: 'u-timeRecord',
  props: {
	  naviTitle: {
      type: String,
      default: ''
    },
	allowDel:{
		type:Boolean,
		default:false
	},
    backScrollTop: {
      type: String | Number,
      default: 0
    },
    calendarDate: {
      type: String,
      default: ''
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dropdownHeight: 80,
      openDropdown: false,
      scrollViewId: '',
      scrollY: false,
      itemId: 0,
      requestType: true,
      show: false,
      clickTableIndex: 0,
      timeSlot: '全部',
      beforeData: [],
      beforePage: 1,
      beforeLength: 0,
      afterData: [],
      afterPage: 1,
      afterLength: 0,
      table: [],
	  active:0,
      options1: [
        {
          label: '全部',
          value: '全部'
        },
        {
          label: '未选',
          value: '未选'
        },
		{
		  label: '空腹',
		  value: '空腹'
		},
        {
          label: '早餐后2小时',
          value: '早餐后2小时'
        },
		{
		  label: '午餐前',
		  value: '午餐前'
		},
        {
          label: '午餐后2小时',
          value: '午餐后2小时'
        },
		{
		  label: '晚餐前',
		  value: '晚餐前'
		},
        {
          label: '晚餐后2小时',
          value: '晚餐后2小时'
        },
		{
		  label: '睡前',
		  value: '睡前'
		},
        {
          label: '凌晨3点',
          value: '凌晨3点'
        }
       
       
      ]
    }
  },
  computed: {
    setDateVal() {
      return function (e) {
        let arrKey = Object.keys(time_enum)
        return arrKey.find((v) => {
          return time_enum[v] === e
        })
      }
    }
  },
  onShow() {},
  created() {
    this.getData()
  },
  mounted() {
	  if(this.naviTitle !=='blood-pressure'){
		  this.dropdownHeight = this.$refs.dropdown.height
		  console.log('this.$refs.dropdown.height', this.$refs.dropdown.height)
	  }
    
  },
  methods: {
    open() {
      this.openDropdown = true
      console.log(this.openDropdown)
    },
    closeDropdown() {
      this.openDropdown = false
      this.$refs.dropdown.close()
      console.log(this.openDropdown)
      console.log(this.$refs.dropdown)
    },

    
    itemChange(e,index) {
		this.active = index;
		this.$refs.dropdown.close();
      this.getData(this.calendarDate, e)
    },
    upper(e) {
      console.log(e)
    },
	//检查afterDate是否还有数据 第一次点进来如果afterLength还有 就全部展示
	 checkAfterDate(result = ''){
		return new Promise( async(resolve,reject)=>{
			if(this.afterLength >= 15){
				console.log('首次加载 全部展示afterData',this.afterLength)
				this.afterPage ++
				this.afterData.push(...await this.getAfterDate(result))
				this.checkAfterDate(result)
			}else{
				console.log('已经全部展示完afterData',this.afterLength)
				resolve()
			}
		})
		
	},
    async getData(result = '', timeSlot = '全部') {
      //重置
	  this.afterData = []
      this.timeSlot = timeSlot
      this.beforePage = 1
      this.afterPage = 1
      this.userId = uni.getStorageSync('userId')
      console.log('userId', this.userId)

      console.log('this.calendarDate', this.calendarDate)
      console.log('result', result)
      this.beforeData = await this.getBeforeDate(result)
	  
      this.afterData = await this.getAfterDate(result)
	  //检查是否还有afterData
	  // await this.checkAfterDate(result)
      console.log('beforeData', this.beforeData)
      console.log('afterData', this.afterData)
	 
      this.table = []
      

      this.table.push(...this.afterData.reverse())
      this.table.push(...this.beforeData)
      
      console.log('this.table', this.table)
      if (result) this.scroll(result)
    },

    getBeforeDate(result = '') {
      return new Promise((resole, reject) => {
		  if(this.naviTitle !== 'blood-pressure'){
			  this.$request({
			    url: '/ApiV2/Mobile/Diary/bloodSugarList',
			    method: 'get',
			    data: {
			      date: (result ? result : this.calendarDate) + ' 00:00:00',
			      direction: 'BEFORE',
			      time_enum: time_enum[this.timeSlot],
			      user_id: this.userId ? this.userId : 0,
			      page: this.beforePage,
			      lengthNum: 15
			    }
			  }).then((res) => {
			    this.beforeLength = res.data.data.length
			  
			    resole(res.data.data)
			  })
		  }else{
			  this.$request({
			    url: '/ApiV3/Mobile/Diary/list',
			    method: 'get',
			    data: {
			      start_date: (result ? result : this.calendarDate) + ' 00:00:00',
			      direction: 'BEFORE',
			      page: this.beforePage,
				  user_id: this.userId ? this.userId : 0,
			      type: 'BLOOD_PRESSURE'
			    }
			  }).then((res) => {
			    this.beforeLength = res.data.data.length
				res.data.data.forEach(v=>{
					v.date = v.of_date
				})
			    resole(res.data.data)
			  })
		  }
        
      })
    },
    getAfterDate(result = '') {
      return new Promise((resole, reject) => {
		   if(this.naviTitle !== 'blood-pressure'){
			   this.$request({
			     url: '/ApiV2/Mobile/Diary/bloodSugarList',
			     method: 'get',
			     data: {
			       date: (result ? result : this.calendarDate) + ' 00:00:00',
			       direction: 'AFTER',
			       time_enum: time_enum[this.timeSlot],
			       user_id: this.userId ? this.userId : 0,
			       page: this.afterPage,
			       lengthNum: 15
			     }
			   }).then((res) => {
			     this.afterLength = res.data.data.length
			     resole(res.data.data)
			   })
		   }else{
			  this.$request({
			    url: '/ApiV3/Mobile/Diary/list',
			    method: 'get',
			    data: {
			      start_date: (result ? result : this.calendarDate) + ' 00:00:00',
			      direction: 'AFTER',
			      page: this.afterPage,
				  user_id: this.userId ? this.userId : 0,
			      type: 'BLOOD_PRESSURE'
			    }
			  }).then((res) => {
			    this.afterLength = res.data.data.length
				res.data.data.forEach(v=>{
					v.date = v.of_date
				})
			    resole(res.data.data)
			  })
		  }
        
      })
    },
    tablePush() {
      console.log('往下滑', this.beforeLength)

      if (this.requestType && this.beforeLength >= 15) {
        console.log('可以请求了', this.requestType)
        this.beforePage++
        this.getTableDate('push')
        // this.requestType = false
      }
    },
    initScrollView(type) {
      this.scrollY = type
    },
    init() {
     
      if (this.afterLength >= 15) {
		   console.log('往上滑', this.afterLength)
        this.afterPage++
        this.getTableDate('unshift')
      }
    },
    edit(v) {
		if(!this.allowDel) return
      this.$emit('edit', v)
    },
    async getTableDate(arrFuction) {
      this.requestType = false
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      if (arrFuction === 'push') {
        this.beforeData = await this.getBeforeDate()
        this.table[arrFuction](...this.beforeData)
      } else {
        this.afterData = await this.getAfterDate()
        this.table[arrFuction](...this.afterData.reverse())
      }
      
      this.requestType = true
      wx.hideLoading()
    },
    scroll(val) {
      let className = '.record'
      let findData = this.table.find((v, index) => {
        if (this.$common.formatDate(new Date(v.date.replace(/\-/g, '/')), false) === val) {
          setTimeout(() => {
            this.scrollViewId = 'record' + index
          }, 500)
          return (className = '.record' + index)
        }
      })
      console.log('this.scrollViewId', this.scrollViewId)
      console.log('findData', findData)
      // return
      if (!findData) return
      console.log('className', className)
      let query = uni.createSelectorQuery().in(this)
      query
        .select(className)
        .boundingClientRect((data) => {
          //报错在执行一次（暂时不清楚为什么有时候元素为null
          if (!data) this.scroll(val)
          console.log('元素信息' + data)
          console.log('元素距离顶部的距离' + data.top)
          console.log('滚动条滚动距离' + this.backScrollTop)
          let scrollTop = this.backScrollTop + data.top - wx.getSystemInfoSync().windowHeight / 2
          console.log('定位到' + scrollTop)
          uni.pageScrollTo({
            scrollTop,
            duration: 100
          })
        })
        .exec()
    },
    sizeColor(v) {
      return v
    },
    clickInfo(v) {
		if(!this.allowDel) return
      this.show = true
      this.itemId = v
    },
    confirmBtn() {
      let data = {
        id: this.itemId.id,
        user_id: this.userId ? this.userId : 0
      }
	  if(this.naviTitle !== 'blood-pressure'){
		  this.$request({
		    url: '/ApiV2/Mobile/Diary/bloodSugarDel',
		    data
		  }).then((res) => {
		    this.$common.toast()
		    this.show = false
		    this.getData()
		  
		    // this.$emit('updataCalendar',this.itemId.date)
		  })
	  }else{
		  data.type = 'BLOOD_PRESSURE'
		  this.$request({
		    url: '/ApiV3/Mobile/Diary/del',
		    data
		  }).then((res) => {
		    this.$common.toast()
		    this.show = false
		    this.getData()
		  
		    // this.$emit('updataCalendar',this.itemId.date)
		  })
	  }
     
    }
  }
}
</script>
<style>
/* .u-timeRecord-dropdown .u-cell_title {
  color: #2a2a2a !important;
  background-color: #f5f7f9 !important;
} */

.u-sticky {
  top: -20rpx !important;
}
</style>
<style lang="scss" scoped>
	.slot-content{
		width: 320rpx;
		height: 386rpx;
		background: #F3F3F3;
		border-radius: 24rpx 24rpx 24rpx 24rpx;
		display: flex;
		flex-wrap: wrap;
		z-index: 99999;
		>view{
			width: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			flex:none !important;
			font-size: 22rpx;
		}
		.active{
			color: #00B8A2;
		}
	}
.dropdown_mask {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  // background: #fff;
  opacity: 0;
  z-index: 3;
}
.scroll-Y {
  height: 90vh;
}
.u-timeRecord {
  min-height: 730rpx;
  
}
.u-timeRecord-header {
  display: flex;
  // flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 72rpx;
  background: #f5f7f9;
  padding: 16rpx;

  border-radius: 36rpx 36rpx 36rpx 36rpx;
  margin: 36rpx 0rpx;
  margin-bottom: 0;
  opacity: 1;
  view {
    flex-grow: 1;
    flex: 1;
    text-align: center;
  }
  // .u-dropdown__content__mask {
  //   opacity: 0;
  // }
  // ::v-deep .u-dropdown__content__mask {
  //   opacity: 0;
  // }
  // .u-timeRecord-dropdown {
  //   ::v-deep .u-cell_title {
  //     color: #2a2a2a !important;
  //     background-color: #f5f7f9 !important;
  //   }
  // }
}

.u-timeRecord-content-info {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 16rpx;
  // margin: 36rpx;

  view {
    flex: 1;
    flex-grow: 1;
    text-align: center;
  }
}
.recordEven {
  background: #f5f7f9;
}
.sizeColor {
  color: #ffc76b;
}
.popup3 {
  .popup-text-view {
    text-align: center;
    color: #2a2a2a;
    font-size: 32rpx;
    font-weight: bold;
  }
  .popup-btn {
    display: flex;
    align-items: center;
    justify-content: center;

    ::v-deep button {
      width: 192rpx;
      height: 60rpx;
      border-radius: 30rpx 30rpx 30rpx 30rpx;
      border: 1px solid #00B8A2;
      color: #00B8A2;
      &::after {
        border: 0;
      }
    }
    &-right {
      margin-left: 46rpx;
      ::v-deep button {
        background: #00B8A2;
        color: #fff;
      }
    }
  }
}
</style>
