<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")

    .contract.scroll-content(:class="{ center: !stock }")
      div(v-if="stock" style="margin: .3rem;" v-bind:class=" ['ds-icon-stock-' + STATUS[stock.isDone].class ] ")

        h2.text-black(style="margin: .3rem 0; text-align: center") 分红详情
        p.item 用户名：&nbsp;&nbsp;&nbsp;{{ stock.userName }}
        p.item 分红状态：{{  STATUS[stock.isDone].title }}
        p.item 期号：{{ stock.issue }}
        p.item 发放方式：{{ STYPE[stock.sendType] }}
        p.item 分红比例：{{  stock.bonusRate }}%

        .item(style="display: inline-block; margin: 0") 累计盈亏： 
          span(:class=" {'text-green': stock.profitAmount && stock.profitAmount._o0(), 'text-danger': stock.profitAmount && stock.profitAmount._l0() } ")  {{ stock.profitAmount &&stock.profitAmount._nwc() }}

          | ，需发放： 
          span(:class=" {'text-green': stock.bonus && stock.bonus._o0(), 'text-danger': stock.bonus && stock.bonus._l0() } ")  {{ stock.bonus &&stock.bonus._nwc() }}
          |  元

        .item.buttons(style="margin: .3rem 0" v-if=" !self && stock.isDone === 0  ")
           button.ds-button.large.bold.primary(@click="paid") 内部账户发放
           button.ds-button.large.bold.cancel(@click="paidOut") 平台外发放

        .item.buttons(style="margin: .3rem 0" v-if=" self && stock.isDone === 2  ")
          button.ds-button.large.bold.primary(@click="subCheckBonus") 已收到分红



</template>

<script>
  import store from '../../store'
  import api from '../../http/api'
  import { numberWithCommas } from '../../util/Number'
  export default {
    props: ['id', 'myself'],
    data () {
      return {
        numberWithCommas: numberWithCommas,
        me: store.state.user,
        // 我的分红
        self: true,
        // 分红状态
        STATUS: [
          {id: 0, title: '未发放', class: 'waiting-pay'},
          {id: 1, title: '已发放', class: 'paid'},
          {id: 2, title: '待确认', class: 'wait'}
          // {id: 2, title: '已发放', class: 'paid'},
          // {id: 3, title: '平台外已发放', class: 'paid-out'}
        ],
        // 契约时间类型
        // TIME: ['月', '周', '日'],
        // TIME: ['月', '半月', '周'],
        TIME: ['', '月', '半月', '周'],
        STYPE: ['', '手动发放', '自动发放'],
        // 销售盈亏类型
        TYPE: [
          {id: 1, title: '销售'},
          {id: 2, title: '盈亏'}
        ],
        stock: null
      }
    },
    computed: {
      // apiBonusDetail () {
      //   return this.me.role <= 2 ? api.topBonuDetail + '&issue=' : api.qryBonusById + '&bonusId='
      // }
    },
    watch: {
      // 如果路由有变化，会再次执行该方法
      // '$route': 'openRoute'
    },
    mounted () {
      this.self = this.myself
      this.qryBonusById(this.id || '')
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
        if (id) this.qryBonusById(id)
      },
      qryBonusById (id) {
        let loading = this.$loading({
          text: '分红详情加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.qryBonusById, {
          bonusId: id
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.stock = data
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      paid () {
        let modal = this.$modal.redpocket({
          target: this.$el,
          content: '<h2 class="title">为 ' + this.stock.userName + ' 发放红包 </h2><p class="content"><span class="amount">' + this.stock.bonus + '</span> 元</p>',
          btn: ['下一步'],
          O: this,
          ok () {
            if (modal.btn[0] === '下一步') {
              modal.btn = ['确认发放']
              return false
            } else if (modal.btn[0] === '确认发放') {
              this.paraentCheckBonus(modal, 0)
              return false
            }
          },
          close () {
            if (modal.btn[0] === '已发放') {
              this.qryBonusById(this.id || '')
              this.__setCall({fn: '__bonus', callId: undefined})
            }
          }
        })
      },
      paidOut () {
        // 免责声明
        // let modal = this.$modal.redpocket({
        //   target: this.$el,
        //   content: '<h2 class="title">免责声明</h2><p class="content" style="text-align: left;">我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭我今天没有吃饭</p>',
        //   btn: ['我知道了，下一步'],
        //   O: this,
        //   ok () {
        //     if (modal.btn[0] === '我知道了，下一步') {
        //       modal.content = '<p style="min-height: 64px"></p><h2 class="title"> 已在平台外发放？</h2>'
        //       modal.btn = ['是的', '还没']
        //       return false
        //     } else {
        //       this.paraentCheckBonus(modal, 1)
        //     }
        //   }
        // })
        let modal = this.$modal.redpocket({
          target: this.$el,
          content: '<p style="min-height: 64px"></p><h2 class="title"> 已在平台外发放？</h2>',
          btn: ['是的', '还没'],
          O: this,
          ok () {
            this.paraentCheckBonus(modal, 1)
            return false
          },
          close () {
            if (modal.btn[0] === '已发放') {
              this.qryBonusById(this.id || '')
              this.__setCall({fn: '__bonus', callId: undefined})
            }
          }
        })
      },
      // 上级确认奖金
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=paraentCheckBonus&bonusId=1&sendType=1
      paraentCheckBonus (modal, type) {
        this.$http.get(api.paraentCheckBonus, {
          bonusId: this.stock.id,
          // sendType: type
          chanelType: type
        }).then(({data}) => {
          if (data.success === 1) {
            // if (type === 1) {
            modal.content = '<p class="ds-icon-success-large" style="min-height: 64px"></p><h2 class="title" style="margin-top: .1rem">发放成功！</h2> '
            modal.btn = ['已发放']
              // this.$modal.redpocket({
              //   target: this.$el,
              //   content: '<p class="ds-icon-success-large" style="min-height: 64px"></p><h2 class="title" style="margin-top: .1rem">发放成功！</h2> ',
              //   btn: ['确定']
              // })
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
      subCheckBonus () {
        this.$http.get(api.subCheckBonus, {
          bonusId: this.stock.id
        }).then(({data}) => {
          if (data.success === 1) {
            this.$modal.success({
              target: this.$el,
              content: '恭喜您，分红收到确认成功！',
              btn: ['确定']
            })
            this.qryBonusById(this.stock.id)
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
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=subCheckBonus&bonusId=1
    }
  }
</script>

<style lang="stylus" scoped>

  @import '../../var.stylus'

  .contract
    top TH
    radius()
    // background #fff
    // text-align left
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
