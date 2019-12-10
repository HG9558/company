<template lang="jade">
  el-row.game-info.new-game-info(style="background-position: .2rem .2rem")
    .inherit
    el-col.left(:span="24" style="line-height: .5rem; padding-left: 1.3rem; margin: 0 0 0.1rem 0")
      div(style="float: left")
        span(style="color: #fff; font-size: .14rem") {{ CNPER }} 期截止时间
        br
        span(v-for=" n in showTime.split(':') " style="margin-left: 0; font-size: .4rem; color: #fff; background-color: #fff; color: #ff7e00; margin: 0 .05rem; border-radius: .05rem; padding: .05rem;  ") {{ n }}

       div(style="float: left; padding-left: .2rem;")
        span(style="color: #fff; font-size: .14rem") {{ NPER }} 期
        span.ds-icon-volume(:class="{ on: volume }" @click=" setVolume() ") {{ !volume ? '开启声音' : '关闭声音' }}
        span.timeout(v-if="overtime" @click="") &nbsp;开奖中，点击刷新
        br
        
        // GameLuckyNumber(v-for="l in allLuckyNumbers.slice(1)" v-bind:game-type="gameType" v-bind:gameid = "gameid" v-bind:lucknumbers="l.lucknumbers" v-bind:NPER="l.issue" v-bind:onlyNumber="true")

      div.static(style="float: right; padding-left: .2rem; width: 2.7rem; line-height: .3rem; font-size: .12rem" @click="expand = !expand")
        //- span(style="color: #fff; font-size: .12rem; float: left") 近期开奖号码
       


        br
        GameLuckyNumberHistory(v-bind:game-type="gameType" v-bind:gameid="gameid" v-bind:allLuckyNumbers="allLuckyNumbers" v-bind:class="{ expand: expand }" @mouseleave.native="expand = false" v-bind:methodid="methodid")

      router-link.ds-button.small.fix-right(:to=" {path: '/form/4-5-3', query: { gameid:  gameid}}  " @click.native.stop="" v-if=" !HC6 " style="padding: .05rem .1rem;position: absolute; right: -.4rem; width: .4rem; top: 0; line-height: 1.5; z-index: 9999") 遗漏分析
      
      .ds-button.fix-right(v-if="methodidtype === '1' " style="padding: .05rem .1rem; position: absolute; right: -.4rem; width: .4rem; top: 2rem; line-height: 1.5; z-index: 9999; margin-left: .05rem;" @click="!t && (t = 750) && __setCall({fn: '__random', args: {}})") 机选
      
      .ds-button(style="padding: .05rem .1rem;position: absolute; right: -.4rem; width: .4rem; top: 2rem; line-height: 1.5; z-index: 9999; margin-left: .05rem;padding: 0 .15rem") 
      
        el-popover(width="500" placement="right-end" trigger="click" v-model="more" v-bind:popper-class="'popover-instruction font-white'" )
          span(slot="reference")
            // span.ds-button.instruction.primary(ref="instruction") ? {{ type.title }}
            .ds-button.recent-codes.fix-right(ref="instruction" style="padding: .05rem .1rem; display: none; position: absolute; left: 0; width: .4rem; top: -1rem; line-height: 1.5; z-index: 9999") 玩法说明
          slot
              p(style="line-height: .25rem")
                span.label.text-blue.text-bold 玩法说明： {{ type.description || '暂无' }}
              p(style="line-height: .25rem")
                span.label.text-blue.text-bold 中奖举例： {{ type.example || '暂无' }}

      

      
      // el-popover(placement="bottom-start"   v-bind:popper-class="'popover-orderlist m popover-luckynumber'" ref="MO" v-if="!nopopper")
        span(slot="reference")
          .ds-button.outline.recent-codes(style="margin-left: .05rem;padding: 0 .15rem; display: none" v-bind:class="{ show: HC6 }") 近期开奖
          
        slot
          GameLuckyNumberHistory(v-bind:game-type="gameType" v-bind:gameid="gameid" v-bind:allLuckyNumbers="allLuckyNumbers" v-if="allLuckyNumbers")


    // el-col.right(:span="5")
      el-button-group.right
        router-link.ds-button.text-button(:to=" {path: '/form/4-2-1', query: { gameid:  gameid}} " @click.native.stop="") 追号记录

        el-popover(placement="bottom-start" trigger="hover"  v-bind:popper-class="'popover-orderlist'" ref="MO")
          span(slot="reference")
            router-link.ds-button.text-button(:to=" {path: '/form/4-1-1', query: { gameid:  gameid}} " @click.native.stop="" @mouseover.native="Orderlist") 投注记录
          slot
            el-table.header-bold.nopadding(:data="Cdata" v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" style="margin-top: .1rem")

              el-table-column(prop="issue" label="期号" width="100")

              el-table-column(prop="methodName" label="玩法" width="100")

              el-table-column(prop="code" label="投注内容" min-width="120" show-overflow-tooltip=true)
                template(scope="scope")
                  p {{ scope.row.code }}
                    span(v-if="scope.row.position") [{{ scope.row.position }}]  

              el-table-column(prop="totalPrice" label="总金额" width="80")
                template(scope="scope")
                  span {{ scope.row.totalPrice }}

              el-table-column(class-name="pr2" prop="bonus" label="奖金" width="60" align="right")
                template(scope="scope")
                  span {{ scope.row.bonus }}

              el-table-column(label="状态" width="70")
                template(scope="scope")
                  span(:class="{ 'text-danger': scope.row.stat === 3,  'text-grey': scope.row.stat === 0, 'text-green': scope.row.stat === 2, 'text-black': scope.row.stat === 1}") {{ STATUS[scope.row.stat] }}
              
              el-table-column(label="操作" wdith="50")
                template(scope="scope")
                  div
                    .ds-button.text-button.blue(v-if=" scope.row.canCancel === 1 " style="padding: 0 .05rem" @click=" cancel(scope.row) ") 撤消
                    .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop=" callPrint(scope.row) ") 打印


        
</template>

<script>
import util from '../util'
import api from '../http/api'
import M from '../util/M'
import GameLuckyNumberHistory from './GameLuckyNumberHistory'
import GameLuckyNumber from './GameLuckyNumber'
export default {
  props: {
    // volume: Boolean,
    NPER: String,
    FNPER: Number,
    PNPER: Number,
    lucknumbers: Array,
    overtime: Boolean,
    // NPER: Number,
    CNPER: String,
    timeout: Number,
    type: Object,
    gameid: Number,
    gameType: String,
    allLuckyNumbers: Array,
    methodid: String
    // title: String
  },
  data () {
    return {
      expand: false,
      // 默认倒计时
      time: 0,
      interval: 0,
      Cdata: [],
      STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
      t: 0,
      volume: false
    }
  },
  computed: {
    HC6 () {
      return this.gameType === 'HC6'
    },
    idType () {
      return this.gameType === 'SSL' ? '-' + this.gameType : ''
    },
    methodidtype () {
      return M[this.type.id + this.idType].split(':')[1]
    },
    showTime () {
      return util.timeFormat(this.time)
    },
    callId () {
      return this.gameid + '|' + this.type.id
    }
  },
  mounted () {
    this.time = this.timeout
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--
      }
    }, 1000)
    // this.Orderlist()
    this.volume = !!parseInt(window.localStorage.getItem('volume')) || false
  },
  watch: {
    t () {
      if (this.t !== 0) {
        setTimeout(() => {
          this.t = 0
        }, this.t)
      }
    },
    // type () {
    //   if (!this.$refs.instruction.style.transform) {
    //     this.$refs.instruction.style.transform = 'perspective(100px) translateZ(30px)'
    //     setTimeout(() => {
    //       this.$refs.instruction.style.transform = ''
    //     }, 200)
    //   }
    // },
    timeout () {
      this.time = Math.floor(this.timeout)
    },
    time () {
      if (this.time <= 0) {
        //  this.__setCall({
        //   fn: '__getIssue'
        // })
        // this.__setCall({
        //   fn: '__getTraceIssueList'
        // })
        // this.__setCall({
        //   fn: '__recentlyCode'
        // })
        this.$emit('set-timeout', 0)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    setVolume () {
      this.volume = !this.volume
      window.localStorage.setItem('volume', this.volume ? 1 : 0)
    },
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
    Orderlist () {
      this.$http.mypost(api.Orderlist, {
        scope: 0,
        lotteryId: this.gameid,
        page: 1,
        pageSize: 5
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.Cdata = data.recordList
        }
      }, (rep) => {
        // error
      })
    },
    cancel (row, force) {
      // if (!force && parseInt(row.totalPrice) >= 5000) {
      //   return this.$modal.question({
      //     content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">投注注单金额超过 <span class="text-danger">5000</span> 会收取 <span class="text-danger">0.5%</span> 的手续费注，将扣除您<span class="text-danger"> ' + parseFloat(row.totalPrice) * 0.005 + ' </span>元手续费， 您确定要撤单吗？</div>',
      //     target: this.$refs.MO.$refs.popper,
      //     O: this,
      //     ok () {
      //       this.cancel(row, true)
      //     }
      //   })
      // }
      let loading = this.$loading({
        text: '撤单中...',
        target: this.$refs.MO.$refs.popper
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
    }
  },
  components: {
    GameLuckyNumberHistory,
    GameLuckyNumber
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  // .popover-orderlist
  //   width 6.1rem
  //   background-color #ff
  //   border 1px solid #ccc
  //   shadow(0 0 10px rgba(0,0,0,.3))
  //   &.m
  //     transform translateY(0rem) translateX(.05rem)
    
  // .popover-instruction.popover-instruction
  //   transition none
  //   transform translateX(0rem) translateY(.1rem)
  //   padding PW .2rem 0 .2rem
  //   text-align left
  //   box-shadow .02rem .02rem .02rem rgba(0,0,0,.2)
    
  //   background-color #ff
  //   border 1px solid #ccc
  //   shadow(0 0 10px rgba(0,0,0,.3))
  //   color #666
  //   text-shadow none
  //   border-top-left-radius 0
  //   z-index 1
  //   cursor text
  //   user-select text
  //   radius()
  //   p
  //     // min-width 3.6rem
  //     padding-left .75rem
  //     margin 0 0 PW 0
  //     .label
  //       &::selection
  //         background-color GOLD
  //       position absolute
  //       left .2rem


</style>

<style lang="stylus" scoped>
  @import '../var.stylus'

  .ds-icon-volume
    position relative
    top -.01rem
    vertical-align middle
    display inline-block
    width .6rem
    height .3rem
    line-height .3rem
    padding-left .3rem
    color #fff
    margin 0 .1rem
    cursor pointer
    background url(../assets/v2/icon01_02.png) .1rem center no-repeat

    &.on
      background url(../assets/v2/icon01.png) .1rem center no-repeat

    &:hover
        background-color rgba(0,0,0,.5)

  .recent-codes.show
    display inline-block !important
  
  .game-info.new-game-info
    background-position .2rem .2rem !important
  .inherit
    position absolute
    top 0
    left 0
    width 1.4rem
    height 100%
    background inherit
    background-position .2rem .2rem

  F = .3rem
  .game-info
    &.new-game-info
      display none
    &.fixed
      box-shadow 0 2px 20px rgba(0,0,0,.2)
      z-index 1
      overflow-x hidden
    &.my-hide
      opacity 0
      
    background-color: #ededed;
    // height GH
    line-height GH
    margin 0
    padding 0 .1rem 0 .2rem
    font-size .12rem
    font-weight normal
    color #666
    background-position .2rem .2rem
    

  .ds-icon-clock
    margin-left .2rem
    padding-left .32rem
    font-size F
    color DANGER
    font-family Roboto
    font-weight bold
      
  .left
    min-width 6rem
    // width 80%
    .fix-right
      &:hover
        background #4b545d !important
    .title
      padding-left .8rem
      font-size F
      font-family Roboto
      font-weight bold
      color #666
    .outline
      vertical-align super
      margin-left .2rem
      padding-left .08rem
      padding-right .1rem
    .ds-icon-polyline
      padding 0 .1rem 0 .36rem
      margin-left .1rem
    .instruction
      transition transform .2s linear
      position relative
      vertical-align super
      margin-left .2rem
      padding-left .08rem
      padding-right .1rem
      font-size .12rem
      height .32rem
      line-height .32rem

      &:hover
        color WHITE
        background-color rgba(22, 113, 188, .9)
        border-bottom-left-radius 0
        border-bottom-right-radius 0
        border-color BLUE
        .popover-instruction
          display block
        
    
  .right
    width 20%
    min-width 1.5rem
    text-align right
    .text-button
      font-size .12rem
      color #666
      text-shadow none
      padding PW .1rem
      &:hover
        color BLUE
      &:active
        color #087ad8
  
  
</style>

<style lang="stylus" scoped>
  .timeout
    color GOLD
    cursor pointer
    &:hover
      color GOLD-HOVER
    &:active
      color GOLD-ACTIVE
</style>