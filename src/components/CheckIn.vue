<template lang="jade">
  .checkin-view
    .checkin-content
      .btn-close(@click="$emit('on-close')")
      .inner-content.flex.flex-wp-wp
        .activity-explain
          .header.flex.flex-ai-c
            span.ft24.color-green.ml20 每日
            span.ft24 签到
            span.ml15.icon-rect 
            span.ml15 {{curMonth}}月您已经累计签到：
            span.color-green {{checkinCount}}天
          .rules
            section.line
              div.color-yellow.ft14 活动时间： 
              p.ft12.mt05 2019-04-20 00:00:00——2031-04-30 23:59:59
            section.line.mt20
              div.color-yellow.ft14 活动内容： 
              p.ft12.mt05 每天登入平台，投注达到1000元，即可参与消费签到，签到成功可以领取各种好礼，连续签到还有额外好礼相赠
            section.mt20
              div.color-yellow.ft14 领取时间：
              p.ft12 每日09:00-24:00
              p.ft12.mt05 每日签到立刻领取：2 元礼金
        .checkin-calendar
          CheckInCalendar(@on-choice="checkInHandler" v-bind:checkinDateList="checkinDateList")
        .line-more-prize
        .checkin-days-explain.flex.flex-ai-c
          .day-3
          .day-5
          .day-12
          .day-20
          .day-28
        .contidion-tip
          | 1.每天达到投注要求点击签到，当天日期及会显示已签到标志；
          | 2.累计签到达到对应天数的点击领取即可获得对应奖励；
          | 3体验金点击领取后会以现金券的形式发放至【优惠券】中，只需1倍流水即可提款
    .dialog-result(v-show="showDialogResult")
      .btn-close-result(@click="closeDialogResult")
      .status-img
      .status-txt.ft24.ftb.txt-c.mt20 签到成功
      ul.prize-wp
        li.prize-row.flex.flex-ai-c(v-for="(p, i) in prizes" v-bind:key="i")
          div {{p}}
          .color-orange.cursor-p(@click="viewPrize") 查看礼品箱
</template>

<script>
import api from '../http/api'
import CheckInCalendar from './CheckInCalendar'
export default {
  name: 'checkin-view',
  components: {
    CheckInCalendar
  },
  data () {
    return {
      curMonth: 0,
      checkinCount: 0,
      showDialogResult: false,
      prizes: [],
      checkinDateList: []
    }
  },
  mounted() {
    this.curMonth = new Date().getMonth() + 1
    this.getCheckInfo();
  },
  methods: {
    checkInHandler() {
      this.checkIn()
    },
    closeDialogResult() {
      this.showDialogResult = false
    },
    viewPrize() {
      this.$emit('on-close')
      this.$router.push('/activity/5-1-2')
    },
    getCheckInfo() {
      this.$http.get(api.getCheckInfo).then(({data}) => {
        if (data.success > 0 && data.data.length > 0) {
          this.checkinCount = data.data.length
          this.checkinDateList = data.data.map((d) => new Date(parseInt(d, 10)).getDate())
        }
      })
    },
    checkIn() {
       this.$http.post(api.checkIn, {}).then(({data}) => {
        if (data.success > 0) {
          this.showDialogResult = true
          this.prizes = data.data
          this.getCheckInfo()
        }
      })
    }
  }
}
</script>

<style lang="stylus">
 .checkin-view
  position fixed
  width 100%
  height 100%
  z-index 9999
  text-align left
  $img-base-dir = "../assets/activity/checkin/"
  bgImage($name)
    background url($img-base-dir+$name+".png") center no-repeat
  ul, li
    list-style none 
    margin 0
    padding 0
  .btn-close
    width 0.42rem
    height 0.42rem
    bgImage("icon-close")
    cursor pointer
    position absolute
    right 1.80rem
    top 0.50rem
  .checkin-content
    width 13.72rem
    height 7.40rem
    bgImage("dialog-bg")
    margin 2.00rem auto 0
    position relative
  .inner-content
    height 100%
    padding .95rem 2.20rem 0.5rem 2.52rem
    box-sizing border-box
  .icon-rect
    width 0.22rem
    height 100%
    bgImage("00");
  .activity-explain
    width 4.52rem
    height 3.8rem
    color #fff
    .header
      height 0.70rem
  .checkin-calendar
    width 4.44rem
    height 3.8rem
  .rules
    padding 0.22rem 0.2rem 0 0.28rem
    &>section 
      padding-bottom 0.15rem
    .line
      border-bottom solid 1px #ffffff
  .line-more-prize
    width 100%
    height 0.18rem
    bgImage("line-more-prize")
  .checkin-days-explain
    width 100%
    padding 0 0.3rem
    justify-content space-between
    box-sizing border-box
    & > div
      width 1.5rem
      height 0.72rem
  for n in 3 5 12 20 28
    .day-{n}
      bgImage("day-"+n);
  .contidion-tip
    padding 0.1rem 0.5rem 0.2rem 0.5rem
    color #a595f0
  .color-green
    color #64bc1e 
  .color-yellow
    color #fedb1b
  .color-orange
    color #ff7c12
  .dialog-result
    width 4.45rem
    height 3.9rem
    background-color #fff
    top 50%
    left 50%
    transform translate(-50%, -50%)
    position absolute
    z-index 2
    border-radius 0.1rem
    .status-img
      width 1.4rem
      height 1.06rem
      bgImage("checkin-succ")
      margin 0.3rem auto 0
    .prize-wp
      padding 0.2rem 0.44rem 0
    .prize-row
      height 0.5rem
      justify-content space-between
  .btn-close-result
    width 0.28rem
    height 0.28rem
    bgImage("icon-close-1")
    cursor pointer
    position absolute
    right 0.10rem
    top 0.10rem
</style>
