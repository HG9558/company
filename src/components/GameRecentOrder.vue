<template lang="jade">
  el-row.game-recent-order(style="background: #fff")
    //- br
    //- p
      span.p-a 投注记录&nbsp;&nbsp;
      span.p-b(:class="{active: pageSize === 5}" @click="  pageSize === 5  ? Orderlist() : (pageSize = 5) ") 5条
      span.p-b(:class="{active: pageSize === 10}" @click=" pageSize === 10 ? Orderlist() : (pageSize = 10) ") 10条
      span.p-b(:class="{active: pageSize === 15}" @click=" pageSize === 15 ? Orderlist() : (pageSize = 15) ") 15条
      span.p-b(:class="{active: pageSize === 20}" @click=" pageSize === 20 ? Orderlist() : (pageSize = 20) ") 20条

    el-table.header-bold.nopadding(:data="Cdata" stripe v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" style="margin: 0;border: 1px solid #d8d8d8" empty-text="投注记录当前为空！")

      el-table-column(class-name="pl2" prop="projectId" label="注单编号" )
         template(scope="scope")
          span.ds-button.text-button.blue(style="padding: 0" @click="OrderDetail(scope.row)") {{ scope.row.projectId }}

      el-table-column(prop="issue" label="期号" )

      el-table-column(prop="methodName" label="玩法" )

      el-table-column(prop="code" label="投注内容" show-overflow-tooltip=true)
        template(scope="scope")
          p {{ scope.row.code }}
            span(v-if="scope.row.position") [{{ scope.row.position }}]

      el-table-column(prop="multiple" label="倍数"  align="center")


      el-table-column(prop="totalPrice" label="总金额" align="right")
        template(scope="scope")
          span {{ scope.row.totalPrice }}

      el-table-column(class-name="pr2" prop="bonus" label="奖金"  align="right")
        template(scope="scope")
          span {{ scope.row.bonus }}

      el-table-column(label="状态" align="center")
        template(scope="scope")
          span(:class=" [STATUSCLASS[scope.row.stat]] ") {{ STATUS[scope.row.stat] }}
          //- span(:class="{ 'text-danger': scope.row.stat === 3,  'text-grey': scope.row.stat === 0, 'text-green': scope.row.stat === 2, 'text-black': scope.row.stat === 1}") {{ STATUS[scope.row.stat] }}
      
      el-table-column(label="操作" wdith="50")
        template(scope="scope")
          div
            .ds-button.text-button.blue(v-if=" scope.row.canCancel === 1 " style="padding: 0 .05rem" @click=" cancel(scope.row) ") 撤消
            .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop=" callPrint(scope.row) ") 打印

    
    .a.t_c.pt_10(v-if=" maxp > p || p > 1 ")
      .p-b.aa(:class="{ disabled: p ===  1 }" @click=" p > 1 && p-- ") 上一页
      .p-b.aa(:class="{ disabled: p >= maxp }" @click=" p < maxp && p++ ") 下一页
    
    el-dialog(title="订单详情" v-model="show" custom-class="dialog-collect" v-bind:modal="modal" size="auto")
      .box(ref="box")
          // .tool-bar
          //   span.title {{ 投注详情 }}
          //   el-button-group
          //     el-button.close(icon="close" @click="show = false")
          .content
            el-row
              el-col(:span="6") 游戏用户：
                span.text-black {{ row.userName }}
              el-col(:span="6") 游戏：
                span.text-black {{ row.lotteryName }}
              el-col(:span="6")
                span(v-if="!row.prizeCode || row.prizeCode.length <= 10") 开奖号码：
                    span.text-black {{ row.prizeCode  }}
                el-tooltip(v-if="row.prizeCode.length > 10" placement="top")
                  div(slot="content") {{ row.prizeCode }}
                  span 开奖号码：
                    span.text-black {{ row.prizeCode.slice(0, 8) + '...'  }}

              el-col(:span="6") 总金额：
                span.text-black {{ row.totalPrice }}

            el-row
              el-col(:span="6") 注单编号：
                span.text-black {{ row.projectId }}
              el-col(:span="6") 玩法：
                span.text-black {{ row.methodName }}（{{ row.codeType === '1' ? '复式' : '单式'}}）
              el-col(:span="6") 注单状态：
                //- span.text-black {{ STATUS[row.stat] }}
                span(:class=" [STATUSCLASS[row.stat]] ") {{ STATUS[row.stat] }}
                

              el-col(:span="6") 倍数模式：
                span.text-black {{ row.multiple }} 
                  span ({{ MODES[row.modes - 1] }})

            
            el-row
              el-col(:span="6") 投单时间：
                span.text-black {{ row.writeTime }}
              el-col(:span="6") 奖期：
                span.text-black {{ row.issue }}
              el-col(:span="6") 注单奖金：
                span.text-black {{ row.bonus }}

              el-col(:span="6" v-if="row.userPoint") 动态奖金返点：
                span.text-black {{ row.userPoint }}

            el-row(v-if="row.isJoinPool")

              el-col(:span="6") 奖池期号：
                span.text-black {{ row.poolIssue}}

              el-col(:span="6") 奖池状态：
                span.text-black {{ row.poolIsGetPrize ? '已开奖' :  '未开奖' }}

              el-col(:span="6") 奖池号码：
                span.text-black {{ row.poolCode }}
              
              el-col(:span="6") 奖池奖金：
                span.text-black {{ row.poolBonus  }}
              

            p.textarea-label
              span.label 投注内容：
              el-input.font-12(disabled v-model=" codePosition " type="textarea" autofocus  v-bind:autosize="{ minRows: 5, maxRows: 10 }" placeholder="每一注号码之间请用一个 空格[ ]、逗号[,] 或者 分号[;] 隔开")

            p 可能中奖的情况：
            
            el-table.header-bold.nopadding.vtop(:data="expandList" v-bind:row-class-name="tableRowClassName" style="margin: .15rem 0; vertical-align: top" max-height="200")

              el-table-column(class-name="pl2" prop="projectid" label="编号" )

              el-table-column(prop="expandcode" label="号码" )
                template(scope="scope")
                 p {{ scope.row.expandcode }}
                   span(v-if="scope.row.position") [{{ scope.row.position }}]
              

              el-table-column(prop="codetimes" label="倍数" )

              el-table-column(label="奖级" )
                template(scope="scope")
                  span {{ parseInt(scope.row.level) ? scope.row.level + '等奖' : scope.row.level}} 

              el-table-column(class-name="pr2" prop="prize" label="奖金" )

            .buttons(style="margin: .3rem; text-align: center")
              .ds-button.primary.large.bold(v-if="type === 1" @click="") 发起跟单
              .ds-button.primary.large.bold(v-if="type === 2 && row.userName === ACCOUNT" @click="cancel()") 确认撤单


        
</template>

<script>
// import util from '../util'
import api from '../http/api'
import store from '../store'
// import M from '../util/M'
export default {
  props: {
    type: Object,
    gameid: Number
    // gameType: String,
    // allLuckyNumbers: Array
    // title: String
  },
  data () {
    return {
      ME: store.state.user,
      STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
      STATUSCLASS: ['text-green', 'text-danger', 'text-grey', 'text-orange'],
      modal: false,
      Cdata: [],
      // STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
      show: false,
      row: {prizeCode: ''},
      expandList: [],
      MODES: ['2元', '2角', '2分', '2厘', '1元'],
      fullCode: '获取失败...',
      pageSize: 5 || Number(window.localStorage.getItem('gron')) || 5,
      p: 1,
      totalSize: 0
    }
  },
  computed: {
    maxp () {
      return Math.ceil(this.totalSize / this.pageSize)
    },
    callId () {
      return this.gameid + '|' + this.type.id
    },
    codePosition () {
      return this.row.position ? (this.fullCode || this.row.code + '[' + this.row.position + ']') : this.fullCode || this.row.code
    }
  },
  watch: {
    show () {
      if (!this.show) this.fullCode = '获取失败...'
    },
    'ME.login' () {
      if (this.ME.login) this.Orderlist()
    },
    p () {
      this.Orderlist()
    },
    pageSize () {
      if (this.p === 1) {
        this.Orderlist()
      } else {
        this.p = 1
      }
      window.localStorage.setItem('gron', this.pageSize)
    }
  },
  mounted () {
    this.Orderlist()
  },
  methods: {
    callPrint (row) {
      this.__setCall({
        fn: '__print',
        args: {
          // '注单编号': row.projectId,
          // '用户': row.userName,
          '投注时间': row.writeTime,
          '游戏': row.lotteryName,
          '玩法': row.methodName,
          '期号': row.issue,
          // '投注内容': row.code,
          // '投注位置': row.position,
          '投注内容': row.code + (row.position ? '[' + row.position + ']' : ''),
          // '倍数': row.multiple,
          // '模式': row.modes,
          '总金额': row.totalPrice + '元'
          // '奖金': row.bonus,
          // '开奖号码': row.prizeCode
        },
        callId: undefined
      })
    },
    ableRowClassName (row, index) {
      if (row.selected) return 'selected-row'
    },
    setSelected (row) {
      this.$set(row, 'selected', !row.selected)
      // row.selected = !row.selected
    },
    __orderlist () {
      this.Orderlist()
    },
    Orderlist () {
      if (!this.ME.login) return
      this.$http.mypost(api.Orderlist, {
        scope: 0,
        lotteryId: this.gameid,
        page: this.p,
        pageSize: this.pageSize
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.Cdata = data.recordList
          this.totalSize = data.totalSize
        }
      }, (rep) => {
        // error
      })
    },
    cancel (row, force) {
      // if (!force && parseInt(row.totalPrice) >= 5000) {
      //   return this.$modal.question({
      //     content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">投注注单金额超过 <span class="text-danger">5000</span> 会收取 <span class="text-danger">0.5%</span> 的手续费注，将扣除您<span class="text-danger"> ' + parseFloat(row.totalPrice) * 0.005 + ' </span>元手续费， 您确定要撤单吗？</div>',
      //     target: this.$el.parentNode,
      //     O: this,
      //     ok () {
      //       this.cancel(row, true)
      //     }
      //   })
      // }
      let loading = this.$loading({
        text: '撤单中...',
        target: this.$el
      }, 10000, '撤单超时...')
      this.$http.get(api.cancel, {id: row.projectId}).then(({data}) => {
        // success
        if (data.success === 1) {
          setTimeout(() => {
            loading.text = '撤单成功!'
            setTimeout(() => {
              this.Orderlist()
              this.__setCall({fn: '__getUserFund', callId: undefined})
            }, 500)
          }, 500)
        } else loading.text = '撤单失败!'
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 1000)
      })
    },
    // 根据投注号Id查询投注详情
    // http://192.168.169.44:9901/cagamesclient/report/buyReport.do?method=list&projectId=2290
    OrderDetail (row) {
      this.show = true
      // document.body.appendChild()
      this.row = row
      let loading = this.$loading({
        text: '详情加载中...',
        target: this.$refs.box
      }, 10000, '详情加载超时...')
      this.$http.get(api.OrderDetail, {projectId: this.row.projectId}).then(({data}) => {
        // success
        if (data.success === 1) {
          // this.show = false
          this.expandList = data.expandList
          row.userPoint = data.userPoint
          row.poolIssue = data.poolIssue
          row.poolCode = data.poolCode
          row.poolBonus = data.poolBonus
          row.poolIsGetPrize = data.poolIsGetPrize
          this.fullCode = data.code
          setTimeout(() => {
            loading.text = '详情加载成功!'
          }, 500)
        } else loading.text = '详情加载失败!'
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-recent-order
    .p-a
      color #000
      font-weight bold
      
    .p-b
      display inline-block
      color #666
      height .3rem
      line-height .3rem
      padding 0
      width .5rem
      text-align center
      margin 0 .02rem
      border 1px solid  rgba(0,0,0,0)
      cursor pointer
      &:hover
        color BLUE
        border 1px solid  #d8d8d8
        background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
        box-shadow: 0px 3px 3px 0px #e3e3e3;
      
      &.active
        color BLUE
        border 1px solid  #d8d8d8
        background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      
    .aa
      width .8rem
      border 1px solid  #d8d8d8
      background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      &.disabled
        cursor not-allowed
        color #bbbbbb
        background-image: linear-gradient(#f6f6f6, #f6f6f6), linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      

</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-recent-order
    overflow-y auto
    // padding 0 PW
    radius()
    background #f4f4f4
    display none
    position absolute
    left 0
    right 0
    top "calc(100% - %s)" % 1.85rem
    min-height 1rem
    // max-height 1.9rem
    max-height 10.9rem !important
    
  #app.nds.classic.night .game-page .game-recent-order
    .el-dialog
      .text-black
        color #333
     

</style>



<style lang="stylus" scoped>

  @import '../var.stylus'

  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
      
  .tool-bar
    height TH
    line-height TH 
    // background-color bg
    font-size .12rem
    border-top-right-radius .05rem
    border-top-left-radius .05rem
    overflow hidden
    background-position .2rem center

  .title
    color #333
    font-weight bold
    padding-left .2rem

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
      margin .3rem .3rem .3rem 0
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

</style>