<template>
  <view
    class="topic_item border_b u-flex"
    @click="jump({ url: 'trophosphere/topicDetails', data: { id: item.id, currentClickIndex: index } })"
  >
    <view class="topic_left">
      <view class="topic_title u-line-1"
        ><text>{{ item.title }}</text></view
      >
      <view class="topic_subheading u-line-1">{{ item.content }}</view>
      <view class="topic_footer u-flex u-row-right">
        <text class="read_total">{{ item.total_reading | totalFormat }}次阅读</text>
        <view class="operation u-flex">
          <image src="@/static/images/zan.png" mode="aspectFit"></image>
          <text>{{ item.total_likes | totalFormat }}</text>
        </view>
        <view class="operation u-flex">
          <image :src="`${imgUrl}comment.png`" mode="aspectFit"></image>
          <text>{{ item.total_comment | totalFormat }}</text>
        </view>
      </view>
    </view>
    <image class="topic_img" :src="item.thumb" mode="aspectFill"></image>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    index: {
      //该项在列表中的索引值
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: {}
    },
    currentClassifyId: {
      type: [Number, Boolean]
    }
  },
  methods: {
    jump({ url = '', data = {} } = {}) {
      this.$store.commit('saveTabNum', this.currentClassifyId)
      console.log('this.currentClassifyId: ', this.currentClassifyId)
      this.$common.jump({
        url,
        data,
        that: this
      })
    }
  }
}
</script>

<style lang="scss">
.topic_item {
  padding: 30upx 0;

  .topic_left {
    .topic_title {
      width: 450upx;
      font-size: 32upx;
    }

    .topic_subheading {
      width: 450upx;
      margin-top: 10upx;
      color: #888888;
    }

    .topic_footer {
      margin-top: 20upx;
      position: relative;

      .read_total {
        position: absolute;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        color: #888888;
        font-size: 24upx;
      }

      .operation {
        margin-left: 25upx;
        font-size: 24upx;

        image {
          margin-right: 10upx;
          width: 35upx;
          height: 35upx;
        }
      }
    }
  }

  .topic_img {
    margin-left: 50upx;
    width: 210upx;
    height: 148upx;
    border-radius: 10upx;
  }
}
</style>
