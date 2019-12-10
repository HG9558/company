<template lang="jade">

  el-row.kqorderbar(v-bind:class="['game-' + gameType]")

    el-col(:span="24")

      el-popover(ref="ft" placement="top" v-bind:offset="0" trigger="click" v-model="ftshow"  v-bind:visible-arrow="false" v-bind:popper-class="'popover-blue popover-times kq ' + (fts.length > 0 ? true : false)")
        dl.submenu
          dd(v-for="i in fts" @click="(ftshow = false) || (ft = i)") {{ i }}
      


      el-col.left(:span="11")
        span 快速金额&nbsp;
        el-input-number.input.times.my-center(style="width: .5rem;" v-model="ft" v-bind:min="0" v-popover:ft="ft")
        span.kq_icon.a50(@click=" ft = 50 ")
        span.kq_icon.a100(@click=" ft = 100 ")
        span.kq_icon.a500(@click=" ft = 500 ")
        span.kq_icon.a1000(@click=" ft = 1000 ")
        span.kq_icon.a5000(@click=" ft = 5000 ")
        span.kq_icon.a10000(@click=" ft = 10000 ")



      el-col.right(:span=" 13 ")
        | 已选 
        span.count {{ n }} 
        | 注&nbsp;&nbsp;共 
        span.pay {{ PAY.toFixed(3) }}
        |  元
        .ds-button.danger.bold(v-bind:class="{disabled: !canOrder}" @click="canOrder && quickbook()") 一键下单
        .ds-button.cancel.random.bold.large(@click="__setCall({fn: '__clearSelectedNumbers'})") 重置




</template>

<script>
import store from '../store'
export default {
  props: ['times', 'n', 'pay', 'canOrder', 'currency'],
  data () {
    return {
      me: store.state.user,
      t: 1,
      // 快速金额
      ft: 2,
      fts: [50, 100, 200, 500, 1000, 10000],
      ftshow: false
    }
  },
  computed: {
    PAY () {
      return this.pay / this.currency.value
    }
  },
  watch: {
    ft () {
      setTimeout(() => {
        this.ft = parseInt(this.ft)
        this.t = this.ft
        if (this.ft >= 0) {
          this.__setCall({fn: '__setDefaultTimes', args: this.ft})
          this.__setCall({fn: '__updateFT', args: this.ft})
        }
      }, 0)
    },
    t () {
      this.setTimes(parseInt(this.t))
    }
  },
  mounted () {
    if (this.times > 1) this.ft = this.times
    this.t = this.ft
    this.__setCall({fn: '__updateFT', args: this.ft})
    this.__setCall({fn: '__setDefaultTimes', args: this.ft})
  },
  methods: {
    quickbook () {
      this.$emit('quickbook')
    },
    setTimes (t) {
      this.$emit('set-times', t)
    },
    __updateFT (ft) {
      this.ft = ft
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
.popover-times.kq
  transform none
.kqorderbar + .game-selection
  padding-top 0
  & > .row:first-child
    margin-top 0
    .innertitle 
      margin-top 0

</style>


<style lang="stylus" scoped>
  @import '../var.stylus'
  .kqorderbar
    padding .2rem .2rem 0 .2rem
    &.onafter
      padding-top 0

  .el-col
    min-height GOH
      
    
  .right
    text-align right
    .ds-button
      vertical-align middle
      margin-left 0.05rem
  
  .count
  .pay
    color DANGER
    font-weight bold
  
  .kq_icon
    cursor pointer
    vertical-align middle
    display inline-block
    width .35rem
    height .35rem
    margin 0 .02rem
    background-image url(../assets/kqorderbar/icon_kq_qian_50.png)
    background-repeat no-repeat
    background-position center
    transition transform linear .3s
    &:hover
      transform rotateX(40deg)
    &.a100
       background-image url(../assets/kqorderbar/icon_kq_qian_100.png)
    &.a500
       background-image url(../assets/kqorderbar/icon_kq_qian_500.png)
    &.a1000
       background-image url(../assets/kqorderbar/icon_kq_qian_1000.png)
    &.a5000
       background-image url(../assets/kqorderbar/icon_kq_qian_5000.png)
    &.a10000
       background-image url(../assets/kqorderbar/icon_kq_qian_10000.png)
</style>
