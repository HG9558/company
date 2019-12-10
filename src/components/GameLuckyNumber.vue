<template lang="jade">
  el-row.lucky-numbers(v-bind:class="['game-' + gameType, {long: Numbers10, doublelong: Numbers20}]")
    el-col.left(:span="onlyNumber ? 24: 20")
      span.NPER(style="letter-spacing: 1px") {{ NPER }} 
      | 期 &nbsp;
      span.number(v-if="isNumber" v-for=" (n, i) in lucknumbers " v-bind:class=" ['ds-icon-' + gameType + '-' +  (i + 1), gameType === 'HC6' ? getColorOfNumber(n) : '', setPosColor(i) ]") 
        span.the-number(:class="") {{ displayLuckNumbers[i] }}

      span.number-array(v-if = " isArray " v-for=" ns in lucknumbers ")
        span.number(v-for=" (n, i) in ns " v-bind:class="'ds-icon-' + gameType + '-' +  (i + 1) ") 
          span.the-number {{ n | padStart(2, 0) }}
        
      Dice.dead(v-if="isDice" v-for=" n in lucknumbers " v-bind:value="n")

      span.number(style="opacity: 0" v-if="onlyNumber")
        span.the-number 100
      
      pre(style="display: inline" v-if="ccs") {{ ccs && ccs.value.join ? ccs.value.map((x, i) => ccs.title && x.length < ccs.title[i].length ? (x = padStart(x, ccs.title[i].length, ' ')) : x ).join(' ') : '' }}

      // span.timeout(v-if="!longNumbers && !onlyNumber && overtime" @click="fresh") &nbsp;开奖中，点击刷新
    el-col.right(:span="4" v-bind:class="{ 'line-2': longNumbers }" v-if="!onlyNumber")
      span.timeout(v-if="longNumbers" @click="fresh") &nbsp;开奖中，点击刷新
        br
      | 已开
      span.PNPER {{ PNPER }}
      | 期，总共
      span.FNPER {{ FNPER }}
      | 期
</template>

<script>
import Dice from './Dice'
import { padStart } from '../util/base'
import { getAnimalOfNumber, getColorOfNumber } from '../util/Number'
// import GameLuckyNumberHistory from './GameLuckyNumberHistory'
export default {
  props: {
    NPER: String,
    FNPER: Number,
    PNPER: Number,
    lucknumbers: Array,
    gameType: String,
    overtime: Boolean,
    onlyNumber: {
      type: Boolean,
      default: false
    },
    gameid: Number,
    methodid: String,
    codeStyle: String
  },
  data () {
    return {
      type: 1,
      getColorOfNumber: getColorOfNumber,
      padStart: padStart
    }
  },
  computed: {
    cs () {
      return this.codeStyle ? JSON.parse(this.codeStyle) : []
    },
    ccs () {
      return this.cs.filter(x => (x.methodId || []).indexOf(this.methodid) !== -1)[0]
    },
    callId () {
      return this.gameid
    },
    isDice () {
      return this.gameType === 'K3'
    },
    isNumber () {
      return !this.isDice && typeof this.lucknumbers[0] !== 'object'
    },
    isArray () {
      return !this.isDice && typeof this.lucknumbers[0] === 'object'
    },
    Numbers10 () {
      return !this.isDice && this.lucknumbers.length > 5
    },
    Numbers20 () {
      return !this.isDice && this.lucknumbers.length > 10
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
  methods: {
    fresh () {
      this.__setCall({fn: '__recentlyCode'})
    },
    __setLuckNumberType (type) {
      this.type = type
    },
    setPosColor (i) {
      if (this.ccs) {
        switch (this.ccs.pos) {
          case 'q2':
            if (i < 2) return 'text-danger'
            break
          case 'q3':
            if (i < 3) return 'text-danger'
            break
          case 'z3':
            if (i < 4 && i > 0) return 'text-danger'
            break
          case 'h2':
            if (i > 2) return 'text-danger'
            break
          case 'h3':
            if (i > 1) return 'text-danger'
            break
        }
      } else {
        return ''
      }
    }
  },
  components: {
    Dice
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .lucky-numbers.game-HC6
    .number.danger
      background-color DANGER
    .number.green
      background-color GREEN
    .number.blue
      background-color BLUE
</style>


<style lang="stylus" scoped>
  @import '../var.stylus'
  W = .42rem
  w = .26rem

  .lucky-numbers:not(.game-HC6) 
    .number
      box-shadow none
      &:nth-child(2)
        background-color #ff7c7c
      &:nth-child(3)
        background-color #ff9844
      &:nth-child(4)
        background-color #eac600
      &:nth-child(5)
        background-color #abe300
      &:nth-child(6)
        background-color #4dc4ff
      
      &:nth-child(7)
        background-color #ff7c7c
      &:nth-child(8)
        background-color #ff9844
      &:nth-child(9)
        background-color #eac600
      &:nth-child(10)
        background-color #abe300
      &:nth-child(11)
        background-color #4dc4ff
    
    .number-array .number
      &:nth-child(1)
        background-color #ff7c7c
      &:nth-child(2)
        background-color #ff9844
      &:nth-child(3)
        background-color #eac600
      &:nth-child(4)
        background-color #abe300
      &:nth-child(5)
        background-color #4dc4ff
    
  .lucky-numbers
    
      
    line-height LH
    margin 0
    padding 0 .1rem 0 .2rem
    font-size .12rem
    font-weight normal
    color #ddd
    background-color #666
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
      &.text-danger
        color DANGER !important
      
      
        
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
          
  .left
    min-width 4.5rem
  .right
    text-align right
    &.line-2
      padding .1rem 0
      line-height .2rem

  
</style>
