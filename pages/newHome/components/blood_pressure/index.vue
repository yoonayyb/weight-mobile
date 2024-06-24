<template>
  <view style="padding-bottom: 200rpx;display: flex;flex-direction: column;align-items: center;">
	  <u-gap height="24"></u-gap>
    <view id="calendar" class="blood">
      <calendar :userId="userId" naviTitle="blood-pressure" ref="calendar" mode="date" @change="changeDate">
        <view slot="tooltip">
          <view class="title"></view>
        </view>
      </calendar>
    </view>
    <view class="record">
      <!-- <view class="record_time">{{ calendarDate.slice(0, 4) }}</view> -->
      <view class="blood">
        <timeRecord
			naviTitle="blood-pressure"
          :backScrollTop="backScrollTop"
          @updataCalendar="updataCalendar"
          :calendarDate="calendarDate"
          @edit="edit"
          ref="timeRecord"
        ></timeRecord>
      </view>
    </view>

    <view
      style="
        position: fixed;
        z-index: 12;
        bottom: 100rpx;
        left: 50%;
        transform: translateY(-50%);
        transform: translateX(-50%);
      "
    >
      <my-button v-if="allowDel" @click="recordBlood" width="420" margin="0 auto" height="80">记录血压 </my-button>
    </view>
	<recordPopup1 :userId="userId" @success="submit"   ref="recordPopup1"></recordPopup1>
    <!-- <u-popup safe-area-inset-bottom v-model="show" mode="bottom" :closeable="true" border-radius="24">
     
		<view class="popup_blood" >
		 <view @click="editTime" class="popup_blood_time"> {{ date }} </view>
      	<view @click="active = 'sbp'" class="popPupTime u-p-b-20 u-m-b-20">
      		<text class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;">收缩压/高压</text>
      		<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
      			:class="{fade_out:active === 'sbp',disabled:active !== 'sbp'}">{{ sbp }} </text>
      		<text class="u-font-40" style="color:#2A2A2A">mmHg</text>
      	</view>
      	<view @click="active = 'dp'" class="popPupTime u-p-b-20 u-m-b-20">
      		<text class="u-font-28 u-m-r-20" style="color:#4B4B4B;font-weight: normal;">舒张压/低压</text>
      		<text style="border-bottom:1px solid #F3F3F3;padding: 0 24rpx;min-width: 184rpx;"
      			:class="{fade_out:active === 'dp',disabled:active !== 'dp'}">{{ dp }} </text>
      		<text class="u-font-40" style="color:#2A2A2A">mmHg</text>
      	</view>
      	<view style="width: 100%;">
      		<number-keyboard :padding="0" v-if="active === 'sbp'" ref="numberKeyboard" title="''" v-model="sbp"
      			rightBtnText="''" @confirm="sumbit"></number-keyboard>
      		<number-keyboard :padding="0" v-else ref="numberKeyboard" title="''" v-model="dp" rightBtnText="''"
      			@confirm="sumbit"></number-keyboard>
      	</view>
     
      
	  </view>
    </u-popup> -->
    <u-picker
      @confirm="confirm"
      :default-time="date"
      :title="date"
      confirm-color="#00B8A2"
      :params="params"
      v-model="timeShow"
      mode="time"
    ></u-picker>
    <u-back-top :right="20" bottom="100" :scroll-top="backScrollTop"></u-back-top>
  </view>
</template>

<script>
import timeRecord from '../blood/timeRecord.vue'
import calendar from '../blood/calendar.vue'
import myButton from '@/components/myButton.vue'
import recordPopup1 from '@/components/recordPopup1.vue'
import numberKeyboard from '@/components/numberKeyboard2.vue' //键盘
export default {
  name: 'blood',
	props:{
		userId:{
			type:Number | String,
			default:''
		},
		allowDel:{
			type:Boolean,
			default:false
		},
	},
  data() {
    return {
     sbp: 0, //收缩压
     dp: 0, //舒张压
	 active: 'sbp', //默认高压
      
      backScrollTop: 0,
      editItem: {}, //修改的数据
      calendarData: {},
      calendarBottom: 0,
      scrollTop: 0,
      scrollDirection: '',
      recordList: [
        {
          created_at: '2022-8-12'
        }
      ],
      calendarDate: this.$common.formatDate(new Date(), false),
      date: this.$common.formatDate(new Date(), true),
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: true
      },
      timeShow: false,
      horizontaPointVal: 7,
      styles: {
        line: '#C2C2C2',
        bginner: '#00B8A2',
        bgoutside: '#ffffff',
        lineSelect: '#00B8A2', // 选中线颜色
        font: '#404040',
        fontColor: '#C2C2C2',
        fontSize: 16
      },
      activeData: 1,
      show: false,
      
    }
  },
  components: {
    calendar,
    myButton,
    recordPopup1,
    timeRecord,
	numberKeyboard
  },
  mounted() {
    
    console.log('this.userId',this.userId)
	  let query = uni.createSelectorQuery().in(this)
	  console.log('query',query)
	  query
	.select('#calendar')
	.boundingClientRect((res) => {
	  console.log('calendarcalendar', res)
	  this.calendarBottom = res.bottom
	})
	.exec()
  },
  computed: {
    filterDate() {
      return function (index) {
        let lastItem = this.recordList[index - 1]
        let currentItem = this.recordList[index]

        if (index === 0 || (lastItem && lastItem.created_at.slice(0, 4) !== currentItem.created_at.slice(0, 4))) {
          return currentItem.created_at.slice(0, 4)
        } else if (lastItem && lastItem.created_at.slice(0, 4) === currentItem.created_at.slice(0, 4)) {
          return ''
        }
      }
    }
  },
  onPageScroll(e) {
    

    // if (e.scrollTop < this.scrollTop) {
    //   console.log('向上')
    //   this.scrollTop = e.scrollTop

    // } else {
    //   console.log('向下')
    //   this.scrollTop = e.scrollTop

    // }

    
    this.scrollDirection = e.scrollTop < this.scrollTop ? 'up' : 'down'
    this.scrollTop = e.scrollTop < this.scrollTop ? e.scrollTop : e.scrollTop
    // console.log(this.scrollDirection)
    if (
      this.scrollDirection === 'up' &&
      e.scrollTop - this.calendarBottom < 300 &&
      e.scrollTop > this.calendarBottom + 100
    ) {
      this.$refs.timeRecord.init()
    }
    
    
  },
  onReachBottom() {
    this.$refs.timeRecord.tablePush()
    console.log('触底了')
    this.$refs.timeRecord.initScrollView(true)
  },
  methods: {
	  reachBottom(val){
		  
	  	this.$refs.timeRecord.tablePush()
	  	console.log('触底了')
	  	this.$refs.timeRecord.initScrollView(true)
	  },
	  setScroll(val){
		  this.backScrollTop = val
	  },
	  pageScroll(val){
		  this.backScrollTop = val
		  this.$refs.timeRecord.init()
	  },
	submit(defaultTime){
		console.log('defaultTime',defaultTime)
		 let date = this.$common.formatDate(new Date(defaultTime.replace(/\-/g, '/')), false)
		 this.$refs.calendar.init(date)
		this.$refs.calendar.getCalendarData(date)
		 
		 this.$refs.timeRecord.getData(date)
		// if (this.active === 'sbp') {
		// 	console.log('收缩压', this.sbp)
		// } else {
		// 	console.log('舒张压', this.dp)
		// }
		// console.log(this.date)
		// this.addWeight({max:this.sbp,min:this.dp},'BLOOD_PRESSURE')
	},
	// addWeight(value,type){
	// 	const{max,min} = value
	// 		let data = {
	// 			max,
	// 			min,
	// 			date:this.date,
	// 			type
	// 		}
		
		
	// 	if(this.editItem.id) data.id = this.editItem.id
	// 	if (this.userId) data.user_id = this.userId
	// 	this.$request({
	// 		url:'/ApiV3/Mobile/Diary/save',
	// 		data
	// 	}).then(res=>{
	// 		this.$common.toast()
	// 		let date = this.$common.formatDate(new Date(this.date.replace(/\-/g, '/')), false)
	// 		this.$refs.calendar.init(date)
	// 		this.$refs.calendar.getCalendarData(date)
	// 		this.$refs.timeRecord.getData(date)
	// 		this.show = false
			
			
	// 	})
	// },
    updataCalendar(date) {
      // this.$refs.calendar.getCalendarData(this.$common.formatDate(new Date(date), false))
    },
    
    edit(item) {
      // this.editItem = item
      console.log('item', item)
      this.date = this.$common.formatDate(new Date(item.date.replace(/\-/g, '/')))
      this.sbp = this.editItem.max
      this.dp = this.editItem.min

      this.show = true
	  this.$refs.recordPopup1.edit({
	  		...item,
	  		name:'血压',
	  		of_date:this.date,
			sbp:item.max,
			dp:item.min,
	  })
    },
    changeDate(date) {
      console.log('date', date)
      const { result } = date
      this.calendarDate = result
      console.log(this.$refs.timeRecord)
      this.$refs.timeRecord.getData(result)
      // this.$refs.timeRecord.scroll(result)
    },
    recordBlood() {
   //    this.show = true
	  // this.sbp = 0
	  // this.dp = 0
	  let now = new Date()
	  let hhmmss = now.getHours().toString().padStart(2, "0")  + ':' + now.getMinutes().toString().padStart(2, "0") + ':' +now.getSeconds().toString().padStart(2, "0")
	  this.date = this.$common.formatDate(new Date(this.calendarDate.replace(/\-/g, '/')), false) +  ' ' +hhmmss
	  
      // this.editItem = {}
	  this.$refs.recordPopup1.open({
			name:'血压',
	  		defaultTime:this.date
	  })
    },
    chooseItem(item) {
      this.activeData = this.activeData === item ? 0 : item
      console.log(this.activeData)
    },
    horizontaPointMethods(msg) {
      this.horizontaPointVal = msg
      console.log('msg', msg)
    },
    editTime() {
      this.timeShow = true
    },
    confirm(date) {
      console.log(date)
      const { year, month, day, hour, minute, second} = date
      this.date = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
      console.log(this.date)
    }
  }
}
</script>
<style lang="scss">
page {
  background: #f7f7f7;
  // padding: 10rpx 30rpx;
  // width: calc(100vw - 60rpx);
}
.popPupTime {
		display: flex;
		align-items: baseline;
		font-size: 72rpx;
		font-weight: bold;
		color: #00B8A2;

		text {
			text-align: center;
		}

	}
.disabled {
		color: #C2C2C2;
	}
.active {
		background: #00B8A2 !important;
		color: white !important;
	}
.fade_out {
		animation: point 0.5s;
		animation-iteration-count: infinite;
		animation-direction: alternate
	}

	@keyframes point {
		from {
			border-bottom-color: #00B8A2;
		}

		to {
			border-bottom-color: #F3F3F3;

		}
	}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInOut {
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.fadeInDown {
  animation-name: fadeInDown;
  animation-duration: 1s; // 动画完成时间
}
.fadeInOut {
  animation: fadenum;
  animation-duration: 1s; // 动画完成时间
}
</style>
<style lang="scss" scoped>
.blood {
  background: #ffffff;
  width: 92vw;
  border-radius: 20rpx;
}
.record {
  margin-top: 30rpx;
  &_time {
    padding: 16rpx;
    font-size: 32rpx;
    font-weight: bold;
  }
  .blood {
    padding: 20rpx;
  }
}
.popup_blood {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24rpx 24rpx 0 24rpx;
  &_time {
    font-size: 28rpx;
    background-color: #fafafa;
    border-radius: 20rpx;
    padding: 14rpx;
    width: 316rpx;
    text-align: center;
  }
  &_title {
    font-size: 32rpx;
    font-weight: bold;
    margin: 32rpx 0;
    width: 100%;
    text-align: start;
  }
  &_redio {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    padding: 0 96rpx;
    width: 100%;
    .active {
      background-color: #00B8A2;
      color: #ffffff;
    }
    &_item {
      font-size: 28rpx;
      text-align: center;
      padding: 10rpx 0;
      width: 216rpx;
      margin: 16rpx 0;
      border-radius: 30rpx;
      background-color: #f5f7f9;
      color: #c2c2c2;
    }
  }
  &_mmol {
    margin: 32rpx 0;
    width: 100%;
    text-align: center;
    font-size: 40rpx;
    font-weight: bold;
    color: #00B8A2;
  }
}
</style>
