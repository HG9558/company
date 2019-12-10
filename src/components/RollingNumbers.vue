<template lang="jade">
  .rolling-numbers.relative(:class=" gameType ")
    .number-box(v-if=" gameType !== 'K3' " v-for=" (n, i) in numbers " )
      .number(v-bind:class=" {hl: setPosColor(i)} ") 
       
        .the-number-box(v-bind:style=" {transform: 'translateY(' + (-n / (numbers.length > 10 ? 0.81 : 0.5))  + '%)' , transition: 'transform ' + (1 + (1 * i))  + 's ease '} ")
          .the-number(v-for=" (xx, nn ) in Array(numbers.length > 10 ? 81 : 50) " ) {{ nn === parseInt(n) ? displayNumbers[i] : nn }}

      .decorations(:class=" 'n_' + n ")
    
    .number-gaps(v-if=" gameType === 'PCDD' ")
      .number-gap +
      .number-gap +
      .number-gap =
      .number.number-gap
        .the-number-box
          .the-number {{ numbers[0] * 1 + numbers[1] * 1 + numbers[2] * 1 }}

    .dice-box.inlb(v-if=" gameType === 'K3' " v-for=" (n, i) in numbers.slice(0, 3) ")
      Dice.dead(v-for=" (xx, nn ) in Array(6) " v-bind:value=" nn + 1 " v-bind:style=" {transform: 'translateY(' + (-100 * (n - 1))  + '%)' , transition: 'transform ' + (1 + (1 * i)) + 's ease' } ")


</template>

<script>
import Dice from './Dice'
import { getAnimalOfNumber, getColorOfNumber } from '../util/Number'
export default {
  props: {
    numbers: Array,
    gameType: String,
    hl: String
  },
  data () {
    return {
      type: 1,
      getColorOfNumber: getColorOfNumber
    }
  },
  computed: {
    displayNumbers () {
      return this.numbers.map(n => {
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
  },
  methods: {
    fresh () {
      this.__setCall({fn: '__recentlyCode'})
    },
    setPosColor (i) {
      switch (this.hl) {
        case 'q5':
          if (i < 5) return 'hl'
          break
        case 'q4':
          if (i < 4) return 'hl'
          break
        case 'q2':
          if (i < 2) return 'hl'
          break
        case 'q3':
          if (i < 3) return 'hl'
          break
        case 'z3':
          if (i < 4 && i > 0) return 'hl'
          break
        case 'h2':
          if (i > 2) return 'hl'
          break
        case 'h3':
          if (i > 1) return 'hl'
          break
        case 'h4':
          if (i > 0) return 'hl'
          break
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
  W1 = .5rem
  F1 = .27rem
  
  W2 = .35rem
  F2 = .2rem
  
  W3 = .25rem
  F3 = .16rem
  
  W4 = .52rem

  .rolling-numbers
    padding 0 .1rem
    .number-box
      width W1
      height W1
      line-height W1
      font-size F1
      position relative
      display inline-block
      margin 0 .04rem
      
    .number
      width W1
      height W1
      line-height W1
      font-size F1
      position relative
      display inline-block
      // margin 0 .04rem
      text-align center
      color #000
      font-weight bold
      background-image linear-gradient(0deg, #dadde2 0%, #ffffff 100%);
      // background url(../assets/gameheader/gameball_l__bg.png)
      
      border 1px solid #ccc
      overflow hidden
      radius(50%)
      
      &.hl
        background-image linear-gradient(#f17d0b, #f17d0b), linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%)
        color #fff
        border none
  
  .rolling-numbers.PK10
    .number
    .number-box
      width W3
      height W3
      line-height W3
      font-size F3
  
  .rolling-numbers.HC6
    .number
    .number-box
      width W2
      height W2
      line-height W2
      font-size F2
  
  .rolling-numbers.KL8
    max-width 3.6rem
    .number
    .number-box
      
      width W3
      height W3
      line-height W3
      font-size F3

  .rolling-numbers.K3
    
    .dice-box
      position relative
      width W4
      height W4
      overflow hidden
      margin 0 .04rem
      vertical-align middle
      
    .dice
      position relative
      box-shadow none
  
  .rolling-numbers.PCDD
    position relative
    .number-gap
      position absolute
      top 0
      width .3rem
      line-height .5rem
      font-size .3rem
      display inline-block
      text-align center
      // border 1px solid
      &:nth-child(1)
        left .67rem
      &:nth-child(2)
        left 1.53rem
      &:nth-child(3)
        left 2.39rem
      &:nth-child(4)
        width .5rem
        left 2.69rem
      
    .number-box:nth-child(1)
    .number-box:nth-child(2)
    .number-box:nth-child(3)
      margin-right .3rem
        
      
  
  .page-1-1-1
    .number-box
      position relative
    .number
      width .28rem
      height .28rem
      line-height .28rem
      border-radius 50%
      z-index 1
      position relative
      top  -.14rem
      left .07rem
    .decorations
      position absolute
      top 0
      left 0
      width 100%
      height 100%
      background-position center
      background-size 100%
      background-repeat no-repeat
      for v, k in  mouse tiger rabbit lonng snake horse sheep monkey chicken pig
        &.n_{k}
          background-image url('../assets/hlsx/icon_' + v + '.png')
          
        
        
            
    
      
        
</style>
