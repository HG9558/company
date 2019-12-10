<template lang="jade">
  .game-side-buttons
    .ds-button.small.fix-right( @click=" ME.login ? $router.push('/form/4-5-3?gameid=' + gameid) : __setCall({fn: '__popLogin', args: 'Login'}) " v-if=" !HC6 " style="padding: .05rem .1rem;position: absolute; right: -.4rem; width: .4rem; top: .25rem; line-height: 1.5; z-index: 9999" ) 遗漏分析
    
    // .ds-button.fix-right(v-if="methodidtype === '1' " style="padding: .05rem .1rem; position: absolute; right: -.4rem; width: .4rem; top: 2.25rem; line-height: 1.5; z-index: 9999; margin-left: .05rem;" @click="!t && (t = 750) && __setCall({fn: '__random', args: {}})") 机选
    
    .ds-button.recent-codes.fix-right(ref="instruction" style="padding: .05rem .1rem; position: absolute; left: 0; width: .4rem; top: 1.25rem; line-height: 1.5; z-index: 9999") 

      el-popover(width="500" placement="right-end" trigger="click" v-model="more" v-bind:popper-class="'popover-instruction font-white'" )
        span(slot="reference")
          // span.ds-button.instruction.primary(ref="instruction") ? {{ type.title }}
          .ds-button.recent-codes.fix-right(ref="instruction" style="padding: .05rem .1rem; position: absolute; left: 0; width: .4rem; top: 0; line-height: 1.5; z-index: 9999") 玩法说明
        slot
            p(style="line-height: .25rem")
              span.label.text-blue.text-bold 玩法说明： {{ type.description || '暂无' }}
            p(style="line-height: .25rem")
              span.label.text-blue.text-bold 中奖举例： {{ type.example || '暂无' }}
      
     
        
</template>

<script>
import M from '../util/M'
import store from '../store'
export default {
  props: {
    type: Object,
    gameid: Number,
    gameType: String
  },
  data () {
    return {
      ME: store.state.user,
      t: 0
    }
  },
  computed: {
    idType () {
      return this.gameType === 'SSL' ? '-' + this.gameType : ''
    },
    methodidtype () {
      return M[this.type.id + this.idType].split(':')[1]
    }
  },
  mounted () {
  },
  watch: {
    t () {
      if (this.t !== 0) {
        setTimeout(() => {
          this.t = 0
        }, this.t)
      }
    }
  },
  beforeDestroy () {
  },
  methods: {
  },
  components: {
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .popover-orderlist
    width 6.1rem
    background-color #ff
    border 1px solid #ccc
    shadow(0 0 10px rgba(0,0,0,.3))
    &.m
      transform translateY(0rem) translateX(.05rem)
    
  .popover-instruction.el-popover
    transition none
    transform translateX(.4rem) translateY(0) !important
    @media screen and (max-width: 2280px)
      transform translateX(0) translateY(0) !important

    padding PW .2rem 0 .2rem
    text-align left
    box-shadow .02rem .02rem .02rem rgba(0,0,0,.2)
    
    background-color #ff
    border 1px solid #ccc
    shadow(0 0 10px rgba(0,0,0,.3))
    color #666
    text-shadow none
    border-top-left-radius 0
    z-index 1
    cursor text
    user-select text
    radius()
    p
      padding-left .75rem
      margin 0 0 PW 0
      .label
        &::selection
          background-color GOLD
        position absolute
        left .2rem


</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-side-buttons
    position absolute
    right 0
    .fix-right
      background #5b646d;
      &:hover
        background #4b545d !important
    

    
</style>
