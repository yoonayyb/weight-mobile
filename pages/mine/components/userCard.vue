<template>
  <view class="user_card_container shadow u-flex" @click="handleJump">
    <view class="user_card_left u-flex">
      <image class="avatar" :src="item.avatar" mode="aspectFill"></image>
      <text class="username">{{ item.realname || item.nickname }}</text>
      <text class="u-font-24">{{
        item.plan_level === 0
          ? '未开始'
          : item.plan_level === 1
          ? '启动期'
          : item.plan_level === 2
          ? '过渡期'
          : item.plan_level === 3
          ? '维持期'
          : ''
      }}</text>
      <text class="u-font-24" v-if="item.plan_level !== 0">{{
        item.plan_level_now + '/' + item.plan_level_count
      }}</text>
    </view>
    <view class="user_card_right u-flex">
      <text v-if="type === 'diary'" class="date u-font-24">{{ item.create_time | formatDate }}</text>
      <view v-if="type === 'notUpdated'" class="u-flex" @click="jumpMessage">
        <image style="width: 40rpx; height: 40rpx" :src="`${imgUrl}warning.png`" mode="aspectFit"></image>
        <text class="u-m-l-10">提醒</text>
      </view>
    </view>
    <text v-if="type === 'diary'" class="label" :style="{ background: item.is_read === 1 ? '#27be64' : '' }">{{
      item.is_read === 1 ? '已读' : '未读'
    }}</text>
  </view>
</template>

<script>
export default {
  props: {
    type: {
      default: 'user', //user:从用户管理点击进入 diary:从日记管理点击进入 notUpdated:从日记管理未更新进入
      type: String
    },
    item: {
      //当前数据项
      default: {},
      type: Object
    },
    date: {
      //日期
      default: '',
      type: String
    },
    index: {
      //该项在列表中的索引值
      default: 0,
      type: Number
    }
  },
  methods: {
    // 跳转到日记页
    handleJump() {
      if (this.type === 'diary') {
        this.jump({
          url: 'mine/healthDiary/healthDiary',
          data: {
            date: this.date,
            type: 'admin',
            diaryId: this.item.diary_id,
            userId: this.item.user_id,
            prePageIndex: this.index
          },
          type: 'fileInfo'
        })
      }
    },
    // 公共跳转
    jump({ url = '', data = {}, item = {} } = {}) {
      this.$common.jump({
        url,
        data,
        that: this
      })
    },
    // 去聊天
    jumpMessage() {
      uni.navigateTo({
        url: `/pages/message/messageChat?avatar=${encodeURIComponent(this.item.avatar)}&nick=${
          this.item.nickname
        }&userID=${this.item.id + ''}`
      })
    },
    // 打电话
    handleCallPhone() {
      uni.makePhoneCall({
        phoneNumber: this.item.mobile
      })
    }
  }
}
</script>

<style lang="scss">
.user_card_container {
  margin-bottom: 30upx;
  position: relative;
  padding: 0 40upx;
  width: 690upx;
  height: 180upx;
  border-radius: 20upx;
  justify-content: space-between;

  .label {
    position: absolute;
    top: 0;
    right: 0;
    width: 94upx;
    height: 46upx;
    border-radius: 0 18upx 0 0;
    background: #f74831;
    font-size: 22upx;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .user_card_left {
    .avatar {
      width: 90upx;
      height: 90upx;
      border-radius: 50%;
    }

    .username {
      margin: 0 20upx;
    }
  }

  .user_card_right {
  }
}
</style>
