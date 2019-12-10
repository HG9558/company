<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")

    .contract.scroll-content(:class="{ center: !commissionDetail }")
      div(v-if="commissionDetail" style="margin: .3rem;" v-bind:class=" ['ds-icon-commissionDetail-' + STATUS[commissionDetail.isDone].class ] ")
        // p.title.text-black
        //   span.ds-button.text-button.blue(style="float: left" @click="  __setCall({fn: '__back', args: undefined}) ") {{ '<返回上一页' }}

        h2.text-black(style="margin: .3rem 0; text-align: center") 其它游戏分红详情
        p.item 用户名：&nbsp;&nbsp;&nbsp;{{ commissionDetail.userName }}
        p.item 分红状态：{{  STATUS[commissionDetail.isDone].title }}
        p.item 期号：{{ commissionDetail.issue }}
        p.item 体育总盈亏：{{ commissionDetail.sptProfit }}
        p.item 真人总盈亏：{{ commissionDetail.vidProfit }}
        p.item 电游总盈亏：{{ commissionDetail.egameProfit }}
        p.item 捕鱼总盈亏：{{ commissionDetail.fishProfit }}
        p.item 发放方式：{{ STYPE[commissionDetail.sendType] }}

        // .item.text-danger(style="display: inline-block; margin: 0") 累计{{ TYPE[commissionDetail.ruleType].title }} {{ commissionDetail.sales }} 万，需发放 {{ commissionDetail.bouns }} 元
        .item.text-danger(style="display: inline-block; margin: 0") 累计盈亏 {{ commissionDetail.totProfit }}，需发放 {{ commissionDetail.bonus }} 元
          // p.text-green(style="text-align: right; margin: .05rem 0") 分红已发放 100000 元
          // p.text-green(style=" margin: .05rem 0") 分红已全额发完

        .item.buttons(style="margin: .3rem 0" v-if=" !self && commissionDetail.isDone === 0  ")
           button.ds-button.large.bold.primary(@click="paid") 内部账户发放
           button.ds-button.large.bold.cancel(@click="paidOut") 平台外发放
          //button.ds-button.large.bold.primary(@click="paid") 发放分红

        .item.buttons(style="margin: .3rem 0" v-if=" !self && commissionDetail.isDone === 2  ")
          button.ds-button.large.bold.primary(@click="subCheckComm") 已收到分红



</template>

<script>
  import store from '../../store'
  import api from '../../http/api'
  export default {
    data () {
      return {
        me: store.state.user,
        // 我的其它游戏分红
        self: true,
        // 分红状态
        STATUS: [
          {id: 0, title: '未发放', class: 'waiting-pay'},
          {id: 1, title: '已发放', class: 'paid'},
          {id: 2, title: '待确认', class: 'wait'}
        ],
        STYPE: ['', '手动发放', '自动发放'],
        // 销售盈亏类型
        TYPE: [
          {id: 1, title: '销售'},
          {id: 2, title: '盈亏'}
        ]
        // commissionDetail: null
      }
    },
    computed: {
      commissionDetail () {
        return JSON.parse(window.localStorage.cdetail)
      }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      // '$route': 'openRoute'
    },
    mounted () {
      this.self = this.myself
    },
    methods: {
      back () {
        this.$modal.redpocket({
          target: this.$el,
          content: '<h2 class="title">为jerry发放红包</h2><p class="content"><span class="amount">2236.00</span> 元</p>',
          btn: ['下一步']
        })
        this.$modal.redpocket({
          target: this.$el,
          content: '<p class="ds-icon-success-large" style="min-height: 64px"></p><h2 class="title">发放成功！</h2> ',
          btn: ['下一步']
        })
        this.$modal.redpocket({
          target: this.$el,
          content: '<h2 class="title">免责声明</h2><p class="content" style="text-align: left;">我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭</p>',
          btn: ['我知道了，下一步']
        })
        this.$modal.redpocket({
          target: this.$el,
          content: '<pstyle="min-height: 64px"></p><h2 class="title">已在平台外发放？</h2> ',
          btn: ['是的', '还没']
        })
      },
      openRoute ({path, query: {id, self}}) {
        if (path !== '/group/3-3-2') return false
        this.self = self
      },
      paid () {
        let modal = this.$modal.redpocket({
          target: this.$el,
          content: '<h2 class="title">为 ' + this.commissionDetail.userName + ' 发放红包 </h2><p class="content"><span class="amount">' + this.commissionDetail.bonus + '</span> 元</p>',
          btn: ['下一步'],
          O: this,
          ok () {
            if (modal.btn[0] === '下一步') {
              modal.btn = ['确认发放']
              return false
            } else if (modal.btn[0] === '确认发放') {
              this.sendCtComm(modal, 0)
              return false
            }
          },
          close () {
            if (modal.btn[0] === '已发放') {
              // this.qryBonusById(this.id || '')
              this.__setCall({fn: '__bonus', callId: undefined})
            }
          }
        })
      },
      paidOut () {
        let modal = this.$modal.redpocket({
          target: this.$el,
          content: '<p style="min-height: 64px"></p><h2 class="title"> 已在平台外发放？</h2>',
          btn: ['是的', '还没'],
          O: this,
          ok () {
            this.sendCtComm(modal, 1)
            return false
          },
          close () {
            if (modal.btn[0] === '已发放') {
              this.__setCall({fn: '__bonus', callId: undefined})
            }
          }
        })
      },
      // 发放其它游戏分红
      // http://192.168.169.71:8080/cagamesclient/team/contractBonus.do?method=sendCtComm&userId=7&issue=2018-07-01&chanelType=0
      sendCtComm (modal, type) {
        this.$http.get(api.sendCtComm, {
          userId: this.commissionDetail.userId,
          issue: this.commissionDetail.issue,
          chanelType: type
        }).then(({data}) => {
          if (data.success === 1) {
            modal.content = '<p class="ds-icon-success-large" style="min-height: 64px"></p><h2 class="title" style="margin-top: .1rem">发放成功！</h2> '
            modal.btn = ['已发放']
          } else {
            modal.content = '<p class="ds-icon-notice-large" style="min-height: 64px"></p><h2 class="title" style="margin-top: .1rem">' + (data.msg || '发放失败！') + '</h2> '
            modal.btn = ['确定']
          }
          modal.ok = () => {
            return true
          }
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        })
      },
      subCheckComm () {
        this.$http.get(api.subCheckComm, {
          issue: this.commissionDetail.issue
        }).then(({data}) => {
          if (data.success === 1) {
            this.$modal.success({
              target: this.$el,
              content: '恭喜您，分红收到确认成功！',
              btn: ['确定']
            })
            this.__setCall({fn: '__bonus', callId: undefined})
          } else {
            this.$modal.warn({
              target: this.$el,
              content: data.msg || '收到分红确认失败！',
              btn: ['确定']
            })
          }
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../../var.stylus'

  .contract
    top TH
    radius()
    &.center:after
      content ''
      height 100%
      width 0
      vertical-align middle
      display inline-block
    .form
      padding PWX

  .item
    margin .24rem 0
    text-align left
    padding-left 20%



</style>
