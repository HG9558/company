<template lang="jade">
   .modal.bet-detail-modal(v-show="show" )
      .mask
      .box-wrapper
        .box(ref="box")
          .tool-bar
            span.title {{ '投注详情' }}
            el-button-group
              el-button.close(icon="close" @click="$emit('close', false)")
          .content.bet-detail-modal-c
            .top-info.bgc-w.pb20
              p.txt-c {{ row.lotteryName }}--{{ row.issue }}期
              .issue-nums.txt-c.mt10
                span.op-num.ft24(v-for="(n, i) in row.prizeCode ? (row.prizeCode.split(',')) : defaultPrizeCode" v-bind:class="{red: row.stat == 1 || row.stat == 1}") {{n}}
              el-row
                el-col(:span="12") 注单编号：
                  span.text-black {{ row.projectId }}
                  span.order-status.c_f(:class=" [STATUSCLASS[row.stat]] ") {{ STATUS[row.stat] }}
                el-col(:span="12") 投单时间：
                  span.text-black {{ row.writeTime }}
              el-row
                el-col(:span="12") 是否追号：
                  span {{row.taskId ? '是' : '否'}}
                  span.c-o(v-if="!!row.taskId" @click.stop="$emit('show-follow', row.taskId)" v-show="showFollowBtn") &nbsp;&nbsp;查看追号单>

            .middle-info
              el-row
                el-col(:span="12") 玩法：
                  span.text-black {{ row.methodName }}（{{ row.codeType === '1' ? '复式' : '单式'}}）
                el-col(:span="12")
                  是否单挑：
                  span.text-black {{ row.isLimitBonus === 1 ? '是' : '否'}}
              el-row
                el-col(:span="12")
                  投注金额：
                  span.text-black {{ numberWithCommas(row.TotalPrice) }} &nbsp; ({{row.countDesc}})
                el-col(:span="12")
                  投注返点：
                  span.text-black {{ row.userPoint }}
              el-row
                el-col(:span="12")
                  中奖金额：
                  span.text-black(v-if=" row.bonus && row.bonus._o0() ") {{ numberWithCommas(row.bonus && row.bonus._nwc()) }}
                //- el-col(:span="12")
                  中奖注数：
                  span.text-black {{ row.prize }}
                  



              //- el-row
                el-col(:span="6")
                  游戏用户：
                  span.text-black {{ row.userName }}
                el-col(:span="6")
                  游戏：
                  span.text-black {{ row.lotteryName }}
                el-col(:span="6")
                  span(v-if="!row.prizeCode || row.prizeCode.length <= 10") 开奖号码：
                      span.text-black {{ row.prizeCode  }}
                  el-tooltip(v-if="row.prizeCode.length > 10" placement="top")
                    div(slot="content") {{ row.prizeCode }}
                    span 开奖号码：
                      span.text-black {{ row.prizeCode.slice(0, 8) + '...'  }}

                el-col(:span="6")
                  总金额：
                  span.text-black {{ row.TotalPrice }}

              //- el-row
                el-col(:span="6")
                  注单编号：
                  span.text-black {{ row.projectId }}
                el-col(:span="6")
                  玩法：
                  span.text-black {{ row.methodName }}（{{ row.codeType === '1' ? '复式' : '单式'}}）

                el-col(:span="6")
                  注单状态：
                  span(:class=" [STATUSCLASS[row.stat]] ") {{ STATUS[row.stat] }}

                el-col(:span="6")
                  倍数模式：
                  span.text-black {{ row.multiple }} 
                    span ({{ MODES[row.modes - 1] }})

            
              //- el-row
                el-col(:span="6")
                  投单时间：
                  span.text-black {{ row.writeTime }}
                el-col(:span="6")
                  奖期：
                  span.text-black {{ row.issue }}
                el-col(:span="6")
                  注单奖金：
                  span.text-green(v-if=" row.bonus && row.bonus._o0() ") {{ row.bonus && row.bonus._nwc() }}

                el-col(:span="6" v-if="row.userPoint")
                  动态奖金返点：
                  span.text-black {{ row.userPoint }}

              //- el-row(v-if="row.isJoinPool")

              //-   el-col(:span="6")
              //-     奖池期号：
              //-     span.text-black {{ row.poolIssue}}

              //-   el-col(:span="6")
              //-     奖池状态：
              //-     span.text-black {{ row.poolIsGetPrize ? '已开奖' :  '未开奖' }}

              //-   el-col(:span="6")
              //-     奖池号码：
              //-     span.text-black {{ row.poolCode }}
                
              //-   el-col(:span="6")
              //-     奖池奖金：
              //-     span.text-black {{ row.poolBonus  }}


              .textarea-label
                span.label 投注内容：
                el-input.font-12(disabled v-model=" codePosition " type="textarea" autofocus  v-bind:autosize="{ minRows: 5, maxRows: 10 }" placeholder="每一注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开")
                .ds-button.btn-view-all(@click="visible = true" v-show="codePosition.length > 200") 查看全部

              p 可能中奖的情况：
            
              el-table.header-bold.nopadding.vtop(:data="row.expandList" stripe v-bind:row-class-name="tableRowClassName" style="margin: .15rem 0; vertical-align: top" max-height="200")

                el-table-column(class-name="pl2" prop="projectid" label="编号" width="160" )

                el-table-column(prop="codetimes" label="号码")
                  template(scope="scope")
                    p {{ scope.row.expandcode }}
                      span(v-if="scope.row.position") [{{ scope.row.position }}]
                

                el-table-column(prop="codetimes" label="倍数" )

                el-table-column(label="奖级")
                  template(scope="scope")
                    span {{ parseInt(scope.row.level) ? scope.row.level + '等奖' : scope.row.level}} 

                el-table-column(label="奖金")
                  template(scope="scope")
                    span {{numberWithCommas(scope.row.prize)}}

            .buttons(style="margin: .3rem; text-align: center")
              // .ds-button.primary.large.bold(v-if="type === 1" @click="") 发起跟单
              .ds-button.primary.large.bold(v-if="row.canCancel && row.userName === ACCOUNT && showCancelOrder" @click="cancel()") 撤单
  
        el-dialog(title=" " v-bind:modal="false" v-model:visible="visible" custom-class="bet-data-dialog" v-bind:center="true" v-bind:show-close="true")
          .bets-data 
            p.dialog-title.txt-c 投注内容
            p.txt-l {{codePosition}}
          .footer-btn.txt-c(slot="footer")
            .ds-button.primary.large.bold(@click="visible = false") 确认
</template>

<script>
import api from '../../http/api'
import store from '../../store'
import { numberWithCommas } from '../../util/Number'
export default {
  data () {
    return {
      ACCOUNT: store.state.user.account,
      STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
        // STATUSCLASS: ['text-green', 'text-danger', 'text-grey', 'text-orange'],
      STATUSCLASS: ['bgc-yellow', 'bgc-red', 'bgc-gray', 'bgc-green'],
      defaultPrizeCode: ['?', '?', '?', '?', '?'],
      visible: false
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default () {
        return { prizeCode: '?,?,?,?,?' }
      }
    },
    expandList: {
      type: Array,
      default () {
        return []
      }
    },
    showFollowBtn: {
      type: Boolean,
      default: true
    },
    showCancelOrder: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    codePosition () {
      return this.row.position ? (this.fullCode || this.row.code + '[' + this.row.position + ']') : this.fullCode || this.row.code || ''
    }
  },
  methods: {
    cancel (force) {
      // if (!force && parseInt(this.row.totalPrice) >= 5000) {
      //   return this.$modal.question({
      //     content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">投注注单金额超过 <span class="text-danger">5000</span> 会收取 <span class="text-danger">0.5%</span> 的手续费注，将扣除您<span class="text-danger"> ' + parseFloat(this.row.totalPrice) * 0.005 + ' </span>元手续费， 您确定要撤单吗？</div>',
      //     target: this.$el.parentNode,
      //     O: this,
      //     ok () {
      //       this.cancel(true)
      //     }
      //   })
      // }
      let loading = this.$loading({
        text: '撤单中...',
        target: this.$el
      }, 10000, '撤单超时...')
      this.$http.get(api.cancel, {id: this.row.projectId}).then(({data}) => {
        // success
        if (data.success === 1) {
          this.show = false
          setTimeout(() => {
            loading.text = '撤单成功!'
            setTimeout(() => {
              // this.Orderlist()
              this.__setCall({fn: '__getUserFund', callId: undefined})
              this.$emit('cancel-order', true)
            }, 500)
          }, 500)
        } else {
          loading.text = '撤单失败!'
        }
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    numberWithCommas
  }
}
</script>

<style lang="stylus">
  @import '../../var.stylus'
  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
  i
    font-style normal
  .c-o
    color #f37e0c
  .dis-ib
    display inline-block

  

  .bet-detail-modal.modal 
    position absolute
    top TH
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999
    .bet-data-dialog
      background #fff
      width 4.5rem
      .el-dialog__header
        background #fff
        font-size 0.18rem
      .bets-data
        padding 0 0.3rem 0.3rem 0.3rem
        word-break break-all
        min-height 2rem
        .dialog-title
          padding-bottom 0.2rem
      .footer-btn
        .ds-button
          width 1.7rem
    .el-textarea.is-disabled .el-textarea__inner
      background #fff
    .btn-view-all
      position absolute
      right 0.1rem
      bottom 0.1rem
      background-image linear-gradient(#ffffff, #ffffff), linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%), linear-gradient(#d1d1d1, #d1d1d1)
      border-radius 0.02rem
      border solid 1px #d8dee8
      color #666666
      box-shadow none
      text-shadow none
    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .5
      background #000
      z-index 9998
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 9999
      &:after
        content ''
        height 100%
        width 0
        vertical-align middle
        display inline-block
    .box
      position relative
      text-align left
      display inline-block
      vertical-align middle
      background-color #ededed
      font-size .12rem
      width 9rem
      radius()
    .content
      margin 0 .2rem
      .el-row
        margin PW 0
        word-wrap break-word
      .textarea-label
        position relative
        margin .1rem .3rem .2rem 0
        .label
          position absolute
          left 0
          top .05rem
        .el-textarea
          display inline-bock
          vertical-align top
          padding-left .6rem 
          .textarea
            font-size .12rem

    .title
      color #333
      font-weight bold
      padding-left .2rem
    .box-wrapper 
      .box
        width 6.7rem
        max-height 6.7rem
    .el-table__header
      background-image linear-gradient(0deg, #e7e7e7 0%, #cccccc 100%)
    .content
      margin 0
    .top-info
      padding 0.3rem 0.2rem 0.1rem 0.2rem
    .middle-info
      margin 0 0.2rem
    .tool-bar
      height TH
      line-height TH 
      background-color bg
      font-size .12rem
      border-top-right-radius .05rem
      border-top-left-radius .05rem
      overflow hidden
      background-position .2rem center
    .el-button-group
      float right
      height 100%
      .el-button
        font-size .12rem
        color GREY
        border none
        height 100%
        width TH
        padding 0
        background-color transparent
        &:hover
          background-color bg-hover
        &:active
          background-color bg-active
        &:first-child
          font-size .16rem
        &.close
          &:hover
            background-color #f34
            color #fff
          &:active
            color #fff
            background-color #d40c1d  

  .bet-detail-modal-c
    .bgc-red
      background #fc3220
    .bgc-yellow 
      background #ffaa01
    .bgc-green
      background #0faf0f
    .bgc-gray
      background #444444
    .el-row
      margin PW 0
      word-wrap break-word
    .title
      color #333
      font-weight bold
      padding-left .2rem
  .op-num
    display inline-block
    width 0.4rem
    height 0.4rem
    line-height 0.4rem
    text-align center
    background-image linear-gradient(0deg, #e3e6ea 0%, #ffffff 100%)
    border-image-source linear-gradient(0deg,  #d8d8d8 0%, #e5e5e5 100%)
    border solid 1px #dfdfdf
    border-radius 50%
    margin 0 0.04rem
    &.red
      background-image linear-gradient(#fc3220, #fc3220), linear-gradient(0deg, #e3e6ea 0%, #ffffff 100%)
      color #fff
      border none
  .order-status
    width 0.6rem
    line-height 0.24rem
    display inline-block
    text-align center
    margin-left 0.12rem

</style>
