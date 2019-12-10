<template lang="jade">
.gj-lefter
  
  .item(:class="[ game.class, game.class + '' ]" style="background-position: 0 center; padding: .5rem 1rem;") 
    el-select(v-model="game" style="width: 1.5rem")
      el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U")
  
  .timezone
    span.title.amout {{ CNPER }}
    | &nbsp;&nbsp;期开奖倒计时
    .ds-icon-clock(style="background-size: .4rem; background-position: 0 center; padding: .0rem .5rem;") {{ showTime }}


  .luckynumberzone
    span.NPER 第 {{ NPER }} 
    | 期开奖号码 &nbsp;
    .realnumbers
      .number(v-if="isNumber" v-for=" (n, i) in lucknumbers " v-bind:class="'ds-icon-' + gameType + '-' +  (i + 1) " style="overflow: hidden;") 
        //.the-number {{ n }}
        //.the-number(v-if="String(n).length > 1" v-for=" (xx, nn ) in Array(50) " v-bind:style=" {transform: 'translateY(' + (-100 * n)  + '%)' , transition: 'transform ' + (1 + (1 * i))  + 's ease' } ") {{ n | padStart(2, 0)  }}
        //.the-number(v-if="String(n).length === 1" v-for=" (xx, nn ) in Array(50) " v-bind:style=" {transform: 'translateY(' + (-100 * n)  + '%)' , transition: 'transform ' + (1 + (1 * i))  + 's ease' } ") {{ n }}
        .the-number(:class=" 'HC6-' + getColorOfNumber(nn) " v-for=" (xx, nn ) in Array(50) " v-bind:style=" {transform: 'translateY(' + (-100 * n)  + '%)' , transition: 'transform ' + (1 + (1 * i))  + 's ease' } ") {{ nn === parseInt(n) ? displayLuckNumbers[i] : nn }}

      span.number-array(v-if = " isArray " v-for=" ns in lucknumbers " )
        span.number(v-for=" (n, i) in ns " v-bind:class="'ds-icon-' + gameType + '-' +  (i + 1) " style="overflow: hidden;") 
          // span.the-number {{ n | padStart(2, 0) }}
          .the-number(v-for=" (xx, nn ) in Array(81) " v-bind:style=" {transform: 'translateY(' + (-100 * n)  + '%)' , transition: 'transform ' + (1 + (1 * i))  + 's ease' } ") {{ nn | padStart(2, 0) }}

        
      // Dice.dead(v-if="isDice" v-for=" n in lucknumbers " v-bind:value=" n ")

      .number(v-if="isDice" v-for=" (n, i) in lucknumbers " style="background: none; overflow: hidden; border-radius: 0; vertical-align: middle; top: 0; box-shadow: none;" )
        Dice.dead(style="display: block; position: relative; left: -.05rem; top: -.05rem; " v-for=" (xx, nn ) in Array(6) " v-bind:value=" nn + 1 " v-bind:style=" {transform: 'translateY(' + (-100 * (n - 1))  + '%) scaleX(0.8076923076923077) scaleY(0.8076923076923077)' , transition: 'transform ' + (1 + (1 * i)) + 's ease' } ")

  el-popover(placement="bottom-start"   v-bind:popper-class="'popover-orderlist popover-luckynumber'" ref="MO" v-if="!nopopper")
    span(slot="reference")
      div(style="display: inline-block; cursor: pointer" title="点击查看最近开奖号码" @click=" __setCall({fn: '__setLuckNumberType', args: type}) ")
        h4(style="text-decoration: underline; padding: .3rem 0;") 点击查看最近的已开奖期号
    slot
      GameLuckyNumberHistory(v-bind:game-type="gameType" v-bind:gameid="gameid" v-bind:allLuckyNumbers="allLuckyNumbers" )

  .bottom.scroll-content
    .name.ds-icon-m.text-light {{ name || 'test' }}
    .money.ds-icon-money.text-gold {{ money || '0.000' }}
    .buttons
      .ds-button.primary.full(@click="logout") 退出

</template>

<script>
  import api from 'src/http/api'
  import store from 'src/store'
  import util from 'src/util'
  import Dice from 'components/Dice'
  import GameLuckyNumberHistory from 'components/GameLuckyNumberHistory'
  import { getAnimalOfNumber, getColorOfNumber } from 'src/util/Number'
  export default {
    props: ['menus', 'name', 'money', 'smoney', 'free', 'vip'],
    components: {
      Dice,
      GameLuckyNumberHistory
    },
    data () {
      return {
        gameList: [],
        game: {lotteryId: 1},
        // 开奖倒计时
        NPER: '100000000',
        CNPER: '100000000',
        // 用户选择投注的起始期数
        // usernper: '100000000',
        // 最近的已开奖期号码
        lucknumbers: [0, 0, 0, 0, 0],
        // 即将开奖的期数
        // CNPER: 150730053 + 1,
        // 即将开奖倒计时
        // 秒
        timeout: (100 * 3600) - 1,
        time: 0,
        interval: 0,
        t: 0,
        overtime: false,
        lucknumbersTimeout: 0,
        getColorOfNumber: getColorOfNumber,
        allLuckyNumbers: []
      }
    },
    computed: {
      gameType () {
        return this.game.url
      },
      gameid () {
        return this.game.lotteryId
      },
      showTime () {
        return util.timeFormat(this.time)
      },
      isDice () {
        return this.gameType === 'K3'
      },
      isNumber () {
        return !this.isDice && typeof this.lucknumbers[0] !== 'object'
      },
      isArray () {
        // return !this.isDice && typeof this.lucknumbers[0] === 'object'
      },
      longNumbers () {
        return !this.isDice && this.isArray
      },
      displayLuckNumbers () {
        return this.lucknumbers.map(n => {
          if (typeof n === 'object' && n[0] !== undefined) {
            return n.map(nn => {
              return getAnimalOfNumber(nn)[this.type - 2] || nn
            })
          } else {
            return getAnimalOfNumber(n)[this.type - 2] || n
          }
        })
      }
    },
    watch: {
      gameid () {
        // 获得当前奖期
        this.__getIssue()
        // 获得游戏所有奖期的开奖时间
        this.__getTraceIssueList()
        // 获得游戏所有玩法对应的返点信息
        this.__recentlyCode()
      },
      // time count
      t () {
        if (this.t !== 0) {
          setTimeout(() => {
            this.t = 0
          }, this.t)
        }
      },
      timeout () {
        this.time = Math.floor(this.timeout)
      },
      time () {
        // ...
        if (this.time === 0) {
          this.__getIssue()
          this.__recentlyCode()
          this.__getTraceIssueList()
        } else if (this.time < 1) {
          setTimeout(this.__getIssue, 1000)
        }
      }
    },
    mounted () {
      this.getLotterys()
      this.$route.query.gameid && (this.game.lotteryId = this.$route.query.gameid)

      // 开始倒计时
      this.time = this.timeout
      this.interval = setInterval(() => {
        if (this.time > 0) {
          this.time--
        }
      }, 1000)
      // 获得当前奖期
      this.__getIssue()
      // 获得游戏所有奖期的开奖时间
      this.__getTraceIssueList()
      // 获得游戏所有玩法对应的返点信息
      this.__recentlyCode()
    },
    methods: {
      logout () {
        this.$emit('logout')
      },
      getLotterys () {
        this.$http.get(api.getLotterys).then(({data}) => {
          // success
          if (data.success === 1) {
            data.lotteryList.forEach(d => {
              // d.class = (store.state.pages.find(p => p.gameid === d.lotteryId) || {}).class
              d = Object.assign(d, (store.state.pages.find(p => p.gameid === d.lotteryId) || {}))
              if (this.gameid && (this.gameid + '') === (d.lotteryId + '')) {
                this.game = d
              }
            })
            this.gameList = data.lotteryList
            if (!this.game.lotteryId) {
              this.game = this.gameList[0]
            }
          }
        }, (rep) => {
          // error
        })
      },
      // 获得当前正在进行的奖期信息
      __getIssue () {
        this.$http.mypost(api.getIssue, {gameid: this.gameid}).then(({data}) => {
          // success
          if (data.success > 0) {
            // 当前期
            // this.NPER = (parseInt(data.issue) || 1) - 1
            this.CNPER = data.issue
            this.PNPER = data.openedCount
            this.FNPER = data.dailyCount
            this.timeout = Math.floor((data.saleend - data.current) / 1000) || (this.timeout + 0.05)
          } else {
            // this.$message.error({message: '当前奖期获取失败！'})
            this.$modal.warn({
              // target: this.$el,
              content: '当前奖期已停止销售！',
              btn: ['好的']
            })
            // this.timeout += 0.05
          }
        }, (rep) => {
          // error
          this.$message.error({message: '当前奖期获取失败！'})
          this.timeout += 0.05
        })
      },
      __getTraceIssueList () {
        this.$http.mypost(api.getTraceIssueList, {gameid: this.gameid}).then(({data}) => {
          // success
          if (data.success > 0) {
            // data.items.forEach(d => (d.selected = false))
            this.issues = data.items
          }
        }, (rep) => {
          // error
        })
      },
      // 获得当前已开奖信息
      __recentlyCode (noloop) {
        if (!noloop && this.lucknumbersTimeout) clearTimeout(this.lucknumbersTimeout)
        this.$http.mypost(api.recentlyCodeNew, {gameid: this.gameid, pageNum: 1, size: 30}).then(({data}) => {
          // success
          if (data.success > 0 && data.items.length > 0) {
            data.items.forEach(d => {
              d.lucknumbers = d.code.split(',')
              if (this.gameType === 'KL8') {
                d.lucknumbers = util.groupArray(d.lucknumbers, 5)
              }
            })
            let lst = data.items[0] || {}
            if (this.NPER === lst.issue + '' && !noloop) {
              this.overtime = true
              this.lucknumbersTimeout = setTimeout(() => {
                this.__recentlyCode()
              }, 3000)
            } else {
              this.overtime = false
              this.NPER = lst.issue + ''
              this.lucknumbers = lst.lucknumbers
              // this.page.volume && this.__setCall({fn: '__music', callId: undefined})
            }
            this.allLuckyNumbers = data.items || []
          } else if (data.success >= 0) {
            this.overtime = true
            this.lucknumbersTimeout = setTimeout(() => {
              this.__recentlyCode()
            }, 3000)
          }
        }, (rep) => {
          // error
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .gj-lefter
    right auto
    width GJLW
    background-color rgba(255, 255, 255, 1)
    border-right 5px solid rgba(0, 0, 0, .2)
    padding PW
    box-sizing border-box
    
    .bottom
      top auto
      padding .2rem
      box-sizing border-box
      background-color rgba(0, 0, 0, .2)
      .name
      .money
        color #666
        line-height .35rem
        padding-left .4rem

    
    .timezone
      .title
        font-size .30rem
        font-family Roboto
        // font-weight bold
      .ds-icon-clock
        font-size .5rem
        font-family Roboto
        color DANGER
        // font-weight bold
        
    W = .42rem
    w = .26rem
    .luckynumberzone
      line-height .5*LH
      margin 0
      // padding 0 .1rem 0 .2rem
      // font-size .12rem
      font-weight normal
      // color #ddd
      // background-color #666
      cursor default
      .number
        position relative
        top .03rem
        display inline-block
        width W
        height W
        line-height W
        margin 0 .04rem
        font-size .2rem
        text-align center
        color WHITE
        background-color DANGER
        radius(50%)
        box-shadow .02rem .02rem .02rem rgba(0,0,0,.2)
        
        
          
      .number-array 
        & + .number-array 
          margin-left PWX - .03rem
        .number
          position relative
          top -.01rem
          width w
          height w
          line-height w
          margin 0 0.015rem
          font-size .15rem
      .timeout
        color GOLD
        cursor pointer
        &:hover
          color GOLD-HOVER
        &:active
          color GOLD-ACTIVE
      // 115
      &.game-G115
        .number
          // color #333
          // background-color rgba(0,0,0,0)
          
      
      // PK10
      &.game-PK10
        // .number
        //   width 1rem
        //   font-size .18rem
        //   background-position center (.36rem - .27rem)
        //   background-color transparent
        //   line-height .36rem
        //   box-shadow none
        //   .the-number
        //     position relative
        //     display inline-block
        //     width .35rem
        //     height .35rem
        //     background-color #fff
        //     radius(50%)
        //     shadow(0 0 0 2px #666)
        //     border 1px solid #bd0615
        //     color #fff
        //     background-color DANGER
        //     font-shadow()
      
      // K3
      &.game-K3
        .left
          // perspective 100px
        .dice
          display inline-block
          float none
          vertical-align middle
          // transform-style  preserve-3d 
          // transform translateZ(-10px)
          transform scaleX(42/52) scaleY(42/52)
</style>
