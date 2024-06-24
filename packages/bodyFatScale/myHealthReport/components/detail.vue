<template>
  <view class="heal-detail">
   
   
    <view class="heal-detail-con">
    
      
      <view class="heal-line-wrap u-flex">
     
        <block v-for="(item, i) in info[`${field}_info`].range" :key="i">
          <view
            class="heal-line u-flex-1 u-rela"
            :style="{ background: info[`${field}_info`].levels[i].color }"
            v-if="info[`${field}_info`].levels[i].color"
          >
           
            <p
              v-if="info[`${field}_info`].levels[i].active"
              :style="{
                background: info[`${field}_info`].levels[i].color,
                left: info[`${field}_info`].scale + '% !important;'
              }"
              class="u-abso lookImg point"
              :class="[`lookImg${tabCurrent}`]"
            ></p>
			 <view class="top-text" v-if="item"><text>{{ item }}</text></view>
            <view class="bot-text u-abso">{{ info[`${field}_info`].levels[i].title }}</view>
			
          </view>
        </block>
		
      </view>
	
    </view>
      <view class="_desc">{{ info[`${field}_info`].desc }}</view>
  </view>
</template>

<script>
import { bodyFatClass, colorArr } from '@/utils/consts'
export default {
	name:'healthReportDetail',
	props:{
		info:{
			type:Object,
			default:()=>{}
		},
		field:{
			type:String,
			default:()=> bodyFatClass[0].title
		},
		detailId:{
			type:String,
			default:()=>''
		},
		userId:{
			type:String,
			default:()=>''
		},
	},
  data() {
    return {
      // id: '',
      // userId: '',
      bodyFatClass,
      colorArr,
      // tabCurrent: 0,
      iconLeft: 0,
      // field: bodyFatClass[0].title, // 默认获取体重数据
      // info: '',
      primaryColor: '#00b8a2'
    }
  },

  onLoad(e) {
    // if (e.index) this.tabCurrent = e.index
    // if (e.field) this.field = e.field
    // if (e.id) this.detailId = e.id
    // if (e.userId && e.userId !== 'undefined') this.userId = e.userId
    // this.getDetail()
  },
  mounted() {
    // setTimeout(() => {
    //   this.$nextTick(() => {
    //     this.getRect()
    //   })
    // }, 500)
  },
  methods: {
    getDetail() {
      const data = {
        id: this.detailId
      }
      if (this.userId) data.user_id = this.userId
      this.$request({
        url: `/ApiV3/Mobile/BodyFatScaleWolai/detail`,
        data,
        method: 'get',
        loading: true,
        errMsg: true
      }).then((res) => {
        this.info = res.data
        // let info = res.data
        // this.primaryColor = info.levels[info[`${this.field}_level`][0] - 1].color
        // info[`range`] = info[`${this.field}_range`] && info[`${this.field}_range`].filter(item => item)
        // info[`level`] = info[`${this.field}_level`] && info[`${this.field}_level`].filter(item => item)
      })
    },
    // getRect() {
    //   this.$nextTick(() => {
    //     setTimeout(() => {
    //       this.$u.getRect(`.lookImg${this.tabCurrent}`).then((res) => {
    //         this.iconLeft = res.left + 11 - 4
    //       })
    //     }, 500)
    //   })
    // }
  },
  watch: {
    tabCurrent(val) {
      // this.getRect()
    }
  }
}
</script>

<style lang="scss" scoped>
.heal-detail {
  color: #4a4a4a;
  .point {
    border-radius: 50%;
    width: 36rpx;
    height: 36rpx;
    background: rgb(111, 190, 215);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .wrap-tab {
    height: 60rpx;
    margin-bottom: 44rpx;
    white-space: nowrap;
    .tab-list {
      margin-left: 60rpx;
      display: inline-block;
      color: #888;
      &:last-child {
        margin-right: 30rpx;
      }
    }
    .listActive {
      color: #4a4a4a;
      font-weight: bold;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -18rpx;
        transform: translateX(-50%);
        width: 54rpx;
        height: 6rpx;
        background-color: #00b8a2;
      }
    }
  }
  ._desc {
    // line-height: 44rpx;
    text-align: justify;
	margin-top: 32rpx;
  }
  .heal-detail-con {
    // padding: 0 48rpx;
    ._img-top {
      width: 158rpx;
      height: 158rpx;
      display: block;
      margin: 100rpx auto 34rpx;
    }
    
    ._weight {
      width: fit-content;
      margin: 60rpx auto 46rpx;
      padding: 20rpx 24rpx;
      border: 2rpx solid #00b8a2;
      color: #00b8a2;
    }
    .heal-line-wrap {
      // height: 240rpx;
      // padding: 90rpx 18rpx 0;
      padding: 32rpx 0;
      align-items: flex-start;
      .heal-line {
        width: 100%;
        height: 16rpx;
        margin-right: 4rpx;
        position: relative;
        &:nth-child(1) {
          border-radius: 16rpx 0 0 16rpx;
        }
        &:last-child {
          border-radius: 0 16rpx 16rpx 0;
          margin-right: 0;
        }
        .top-text {
          position: absolute;
          bottom: -20rpx;
          left: 0;
          text {
            position: absolute;
            width: max-content;
            left: -50%;
            transform: translateX(-50%);
          }
        }
        image {
          width: 44rpx;
          height: auto;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .bot-text {
          position: absolute;
          top: -44rpx;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
		  color:#C2C2C2;
		  font-size: 24rpx;
          text-align: center;
        }
      }
    }
  }
  .h-b {
    width: 100%;
    ._icon {
      top: -28rpx;
      width: 0;
      height: 0;
      border-top: 12rpx solid transparent;
      border-right: 12rpx solid transparent;
      border-bottom: 16rpx solid #00b8a2;
      border-left: 12rpx solid transparent;
    }
    ._text {
      width: 654rpx;
      margin: 0 auto;
      padding: 26rpx 40rpx 26rpx 26rpx;
      color: #fff;
      line-height: 44rpx;
      text-align: justify;
      background: #00b8a2;
    }
  }
}
</style>
