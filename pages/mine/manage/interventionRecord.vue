<template>
  <view class="page">
	<block v-if="arr.length">
    <view class="content" v-for="(v,index) of arr" :key="index" :class="{'disable':v.plan_status === 2}"
      @click='contentClickFn({user_id:v.user_id,id:v.id})'>
      <view class="content_title">
        <text>{{typeObj[v.plan_level]}} {{v.plan_start_date | formatTime2}}</text>
        <text class="content_title_r color_00B8A2"
          :class="{'color_ff7569':v.plan_status === 0}">{{statusObj[v.plan_status]}}</text>
      </view>
      <view class="content_info">
        <view class="content_info_item">
          <text>初始体重</text>
          <view>{{v.start_weight}}</view>
        </view>
        <view class="content_info_item phase_change">
          <text>阶段变化</text>
          <view class="phase_change_below">
            <u-icon v-show="v.change_weight !== 0" class="color_00B8A2 " :class="{'color_ff7569':v.change_weight>0}"
              :name="v.change_weight > 0 ? 'arrow-up-fill':'arrow-down-fill'"></u-icon>
            <view> {{Math.abs(v.change_weight)}}</view>
          </view>
        </view>
        <view class="content_info_item ">
          <text>持续天数</text>
          <view>{{v.day}}/{{v.total_day}}</view>
        </view>
      </view>
    </view>
	</block>
	<view class="v3_empty" v-if="!arr.length&& afterLoading">
		<image  style="width: 200rpx;height: 200rpx;"
		  :src="`${imgUrl}v3_ganyu_empty.png`"></image>
		<view class="u-m-t-16">
			暂无干预记录
		</view>  
	</view>
    <image @click="addJump"  :src="`${imgUrl}record_icon_add@2x.png`" class="fixed_box" mode=""></image>
  </view>
</template>

<script>
export default {
  name: '',

  data () {
    return {
	page:1,
	afterLoading:false,
	length:null,
      typeObj: {
        0: '未开始',
        1: '启动期',
        2: '过渡期',
        3: '维持期'
      },
      statusObj: {
        0: '已暂停',
        1: '进行中',
        2: '已结束',
      },
      arr: [],
      user_id: ''
    }
  },
  onLoad (option) {
    if (option) {
      this.user_id = option.id
    }
  },
  onShow () {
    if (this.user_id) {//有userid就进行请求
      this.getWeightCycle(this.user_id)
    }
  },
	onReachBottom() {
		if (this.length) {
			this.page++
			this.getWeightCycle()
		}
	},
  methods: {
    setInfo (id) {
      this.user_id = id
      this.getWeightCycle(id)
    },
    getWeightCycle (id) {
		this.afterLoading = false
      this.$request({
        url: '/ApiV2/Mobile/WeightCycle/index',
        method: 'GET',
		data:{
			page: this.page,
			user_id:id
		}
      })
        .then((res) => {
          console.log('[ res ]-157', res)
          
          if (this.page === 1) {
          	this.arr = res.data.data
          } else {
          	this.arr = [...this.arr, ...res.data.data]
          }
          this.afterLoading = true
          this.length = res.data.next_page_url
        })
        .catch(async (err) => { })
    },
    contentClickFn (params) {
      uni.navigateTo({
        url: `/pages/changePlanInfo/index?item=${JSON.stringify(params)}`
      })
    },

    addJump () {
      this.contentClickFn({ user_id: this.user_id,type:'add' })
    },
    jump ({
      url = '',
      data = {}
    } = {}) {
      console.log(111);
      this.$common.jump({
        url,
        data,
        that: this
      })
    },

  }
}
</script>

<style lang='scss' scoped>
.page {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 24rpx 32rpx;
  .content {
    background-color: #fff;
    padding: 24rpx 32rpx;
    border-radius: 24rpx;
    margin-top: 24rpx;
    .content_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      color: #2a2a2a;
      &_r {
        font-weight: bold;
        // color: #00b8a2;
      }
    }
    .content_info {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 16rpx;

      &_item {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: column;
        text {
          color: #c2c2c2;
        }
        view {
          margin-top: 10rpx;
          color: #2a2a2a;
          font-size: 28rpx;
          height: 40rpx;
        }
      }
    }
  }
}
.color_00B8A2 {
  color: #00b8a2;
}
.color_ff7569 {
  color: #ff7569;
}

.disable {
  view {
    color: #c2c2c2 !important;
  }
  text {
    color: #c2c2c2 !important;
  }
}
.fixed_box {
  height: 124rpx;
  width: 124rpx;
  position: fixed;
  right: 44rpx;
  bottom: 150rpx;
}
.phase_change_below {
  display: flex;
  view {
    margin-left: 10rpx;
    margin-top: 0 !important;
  }
}
</style>
