<template lang="jade">
  .activity-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.gift-center
      div
        .ds-button-group
          .ds-button.text-button(v-bind:class="{selected: tabIndex === 1}" @click="tabIndex = 1") 礼品中心
          .ds-button.text-button(v-bind:class="{selected: tabIndex === 2}" @click="tabIndex = 2") 已领取的礼品

      .empty(v-if=" tabIndex === 1 && tickets.length === 0 " style="padding: .15rem") 暂无可领取的礼品

      .gift-list(v-if="tabIndex === 1")


        .ticket(:class=" [ ticketType[0] ] " v-for=" t in tickets ")
          h1
            span ￥
            | {{ Number(t.prizeAmount).toFixed(2) }}
          p {{ t.prizeAmount }}元{{ t.isFree ? '优惠券' : '礼金' }}
          p.describe {{ t.activityName }}

          div(v-if="t.activityType !== 3")
            .ds-button.primary(v-if="!t.get" @click="getNow(t)") 立即领取
            .ds-button.cancel.disabled(v-if="t.get") 已领取
          div(v-if="t.activityType === 3")
            .ds-button(@click="checkinNow(t)" v-if="!t.get" v-bind:class="{ primary: t.enable === '1', 'cancel disabled': t.enable !== '1' }") 签到
              p.error.text-ellipsis(v-if="t.msg") ({{ t.msg }})
              p.days(v-if="t.isContinue === '1' ") 已连续签到
                span {{ t.days }} 天
            .ds-button.cancel.disabled(v-if="t.get") 已签到

      .table-list(style="padding: .15rem .2rem; max-width: 8rem; margin: 0 auto; " v-if="tabIndex === 2")

        el-table.header-bold.margin(:data="data" stripe v-bind:row-class-name="tableRowClassName" )

          el-table-column(prop="cnname" label="礼品" align="left")
            template(scope="scope")
              div.ds-icon-activity-ticket.small(style="line-height: 2.5") {{ scope.row.amount + (scope.row.isFree ? '元优惠券' : '元礼金') }}
                br
                | {{ scope.row.activityName }}

          el-table-column(prop="date" label="发放日期" align="left")


          el-table-column(prop="prizeDate" label="领取时间" align="left")

          // el-table-column(prop="taskprice" label="数量" width="100" align="right")

          el-table-column(width="20")

          el-table-column(label="状态" width="80" align="left")
            template(scope="scope")
              span.text-green {{ '已领取' }}


</template>

<script>
// v-bind:class=" [ 'ds-icon-activity-' + (i + 1) ] "
// :src=" '/assets/activity/banner' + (i + 1) + '.jpg' "
import api from '../../http/api'
export default {
  data () {
    return {
      tabIndex: 1,
      ticketType: ['ds-icon-activity-ticket', 'ds-icon-activity-coin'],
      tickets: [],
      data: [],
      actions: [api.doRegist, api.doProfile, api.doCheckIn, api.doFirstSave, api.doFirstWithdraw, api.doSave, api.getSalary, '', '', api.getRewardSalary, api.getRewardSalary, api.getRewardSalary, api.getDayReward, api.doWorldCup]
    }
  },
  watch: {
    tabIndex () {
      if (this.tabIndex === 1) {
        this.getAllEnablePrize()
      } else {
        this.myGetPrize()
      }
    }
  },
  mounted () {
    this.getAllEnablePrize()
  },
  methods: {
    // 今日签到
    checkinNow (t) {
      if (t.enable !== '1') return
      // this.$http.get(api.getCheckToday).then(({data}) => {
      this.$http.get(t.isContinue === '1' ? api.getCheckInReward : api.doCheckIn, {entry: t.activityId}).then(({data}) => {
        if (data.success === 1) {
          // t.get = true
          this.$set(t, 'get', true)
          this.$message.success(data.msg || '连续签到成功' + (data.checkDays ? (data.checkDays || 1) + '天' : '') + '！')
        } else {
          this.$message.error(data.msg || ((t.isContinue === '1' ? '连续' : '') + '签到失败！'))
        }
      }).catch(rep => {
        this.$message.error('签到失败！')
      })
    },
    // // 注册
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doRegist&entry=1
    // doRegist: '/activity.do?method=doRegist',
    // // 完善资料
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doProfile
    // doProfile: '/activity.do?method=doProfile',
    // // 每日签到
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doCheckIn
    // doCheckIn: '/activity.do?method=doCheckIn',
    // // 连续签到奖励
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=getCheckInReward
    // getCheckInReward: '/activity.do?method=getCheckInReward',
    // // 首充
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doFirstSave
    // doFirstSave: '/activity.do?method=doFirstSave',
    // // 首提
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doFirstWithdraw
    // doFirstWithdraw: '/activity.do?method=doFirstWithdraw',
    // // 充值活动
    // // http://192.168.169.44:9901/cagamesclient/activity.do?method=doSave
    // doSave: '/activity.do?method=doSave',
    // // 助力世界杯
    // http://192.168.169.44:9901/cagamesclient/activity.do?method=doWorldCup
    // doWorldCup: '/activity.do?method=doWorldCup',
    getNow (t) {
      // if (!this.actions[t.activityType - 1]) return
      // this.$http.get(this.actions[t.activityType - 1], {entry: t.activityId}).then(({data}) => {
      this.$http.get(api.doRewardPrize, {prizeId: t.pirzeId, activityId: t.activityId}).then(({data}) => {
        // success
        if (data.success === 1) {
          this.$message.success(data.msg || '礼品领取成功！')
          this.$set(t, 'get', true)
          this.__setCall({fn: '__getUserFund', callId: undefined})
        } else this.$message.error(data.msg || '礼品领取失败！')
      }, (data) => {
        // error
        this.$message.error(data.msg || '礼品领取失败！')
      })
    },
    myGetPrize () {
      let loading = this.$loading({
        text: '已领取礼品加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      this.$http.get(api.myGetPrize).then(({data}) => {
        // success
        if (data.success === 1) {
          this.data = data.myGetPrize || []
          setTimeout(() => {
            loading.text = '加载成功!'
          }, 100)
        } else this.$message.error('已领取礼品加载失败！')
      }, (rep) => {
        // error
        this.$message.error('已领取礼品加载失败！')
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    getAllEnablePrize () {
      let loading = this.$loading({
        text: '礼品加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      this.$http.get(api.getAllEnablePrize).then(({data}) => {
        // success
        if (data.success === 1) {
          this.tickets = data.enablePrize || []
          setTimeout(() => {
            loading.text = '加载成功!'
          }, 100)
        } else this.$message.error('礼品加载失败！')
      }, (rep) => {
        // error
        this.$message.error('礼品加载失败！')
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'

  .gift-center
    top TH
    padding PWX .1rem
    text-align center
    .gift-list
      display inline-block
      max-width 12rem
    .ticket
      position relative
      radius()
      float left
      min-height 1.06rem
      width 3rem
      padding .05rem 0
      padding-left 1.16rem
      padding-right 1.16rem
      text-align left
      background-color #fff
      border 1px solid #ccc
      margin .1rem
      shadow(2px 2px 2px rgba(0,0,0, .1))
      h1
        font-weight normal
        color BLUE
        font-size .6rem
        span
          font-size .24rem
      p
        font-size .12rem
        color #333
        &.describe
          color #999
        &.error
          position absolute
          right 0
          bottom .1rem
          left 0
          color #fff
          padding 0 .05rem
        &.days
          position absolute
          right 0
          top .1rem
          left 0
          color #fff
          padding 0 .05rem
          span
            color YELLOW
      .ds-button
        position absolute
        right 0
        top 0
        bottom 0
        // padding 0 .3rem
        text-align center
        width 1.2rem
        // background-image url(../../assets/activity/line.png)
        // background-position left center
        // background-repeat no-repeat
        box-shadow none
        background-size 10px 10px
        background-repeat repeat-y
        background-position 0 0
        background-image linear-gradient(-45deg, transparent 75%, #fff 75%), linear-gradient(-135deg, transparent 75%, #fff 75%)
        &:before
          content ''
          position relative
          height 100%
          width 1px
          vertical-align middle
          display inline-block
        &.cancel
          background-color #cacaca
</style>
