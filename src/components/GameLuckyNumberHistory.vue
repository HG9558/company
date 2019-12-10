<template lang="jade">
div.game-luck-number-history-box
  pre.c_f.t-head(v-if=" ccs ")    期号         号码        {{ ccs.title.join(' ') }}
  p.c_f.t-head(v-if=" !ccs ") 近期开奖号码
  .game-luck-number-history(:class=" {empty: allLuckyNumbers.length === 0} ")
    <!-- 开奖信息 -->
    
    GameLuckyNumber(v-for="l in allLuckyNumbers.slice(1)" v-bind:game-type="gameType" v-bind:gameid = "gameid" v-bind:lucknumbers="l.lucknumbers" v-bind:NPER="l.issue.substr(-5) " v-bind:onlyNumber="true" v-bind:methodid = "methodid" v-bind:codeStyle = "l.codeStyle") 

</template>

<script>
import GameLuckyNumber from './GameLuckyNumber'
// import api from '../http/api'
export default {
  props: {
    gameid: Number,
    gameType: String,
    allLuckyNumbers: Array,
    methodid: String
  },
  data () {
    return {
      // data: []
      t: 0
    }
  },
  computed: {
    codeStyle () {
      return this.allLuckyNumbers[0] && this.allLuckyNumbers[0].codeStyle ? this.allLuckyNumbers[0].codeStyle : this.allLuckyNumbers[1] ? this.allLuckyNumbers[1].codeStyle : ''
    },
    cs () {
      return this.codeStyle ? JSON.parse(this.codeStyle) : []
    },
    ccs () {
      return this.cs.filter(x => (x.methodId || []).indexOf(this.methodid) !== -1)[0]
    }
  },
  mounted () {
    // this.t = setInterval(() => {
    //   this.$el.style.clear = 'both'
    //   setTimeout(() => {
    //     this.$el.style.clear = ''
    //   }, 3000)
    // }, 1000)
    // this.__recentlyCode()
  },
  beforeDestroy () {
    // clearInterval(this.t)
  },
  methods: {
    // 获得所有分页奖期信息
    // __recentlyCode () {
    //   this.$http.post(api.recentlyCode, {gameid: this.gameid, pageNum: 1, size: 30}).then(({data}) => {
    //     // success
    //     if (data.success > 0) {
    //       this.data = (data.items || []).slice(1)
    //     }
    //   }, (rep) => {
    //     // error
    //   })
    // }
  },
  components: {
    GameLuckyNumber
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  s = TH + LH
  .game-luck-number-history
    user-select none
    // top TH + LH
    // height 0
    max-height 4rem
    transition all linear .2s
    max-width 9.3rem
    margin 0 auto
    // padding 0 PW
    overflow auto
    z-index 1999
    // background-color #666
    border-bottom-left-radius .05rem
    border-bottom-right-radius .05rem
    &.show
      height "calc(100% - %s)" % s
      overflow auto
    &.empty
      display none
    .lucky-numbers
      background-color #fff
      color #aaa
      & > .left
        min-width 3rem
        height .7rem
        line-height .7rem
      .NPER
        color #999
        font-family Roboto
        font-size .2rem
        font-weight bold
        vertical-align middle
    .lucky-numbers:nth-of-type(odd)
      // bg-gradient(180deg, #111, #333)
      
    .lucky-numbers:nth-of-type(even)
      // bg-gradient(180deg, #444, #222)
      
  .t-head
    margin 0
  
</style>
