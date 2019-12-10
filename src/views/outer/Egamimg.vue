<template lang="jade">
.outer-egaming(:style=" bgStyle ")
  .cw
    iframe(:src="ifsrc" v-if="ifsrc" v-show="show" @load=" load ")
    p(style="color: #fff; font-size: 16px; text-align: left; padding: 15px" v-if="!show") {{ waitmsg }}
      span(v-for=" n in Array(s) ") .
    
</template>

<script>
export default {
  name: 'outer-egaming',
  props: [],
  data () {
    return {
      bgStyle: {
        backgroundImage: 'url(/static/skins/egaming.png)'
      },
      ifsrc: '',
      waitmsg: '请耐心等待，精彩内容正在加载中',
      t: 0,
      s: 1,
      tt: 0,
      show: false
    }
  },
  watch: {
  },
  created () {
    this.__setCall({fn: '__openThirdPart', args: {id: 1, fn: '17:301:iframe:/egaming'}})
  },
  mounted () {
    // this.prebg = document.body.style.background
    // document.body.setAttribute('nolefter', 'true')
    this.t = setInterval(() => {
      this.s++
      if (this.s === 7) {
        this.s = 1
      }
    }, 500)
  },
  beforeDestroy () {
    // document.body.style.background = this.prebg
    // document.body.removeAttribute('nolefter')
    clearTimeout(this.tt)
    this.tt = 0
  },
  methods: {
    load () {
      setTimeout(() => {
        this.show = true
        clearInterval(this.t)
        this.t = 0
      }, 3000)
    },
    __setIframeSrc (src) {
      if (!src) {
        this.waitmsg = '服务器异常'
        this.tt = setTimeout(() => {
          window.history.back()
        }, 2000)
      }
      this.ifsrc = src
    }
  }
}
</script>

<style lang="stylus">
@import '../../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.outer-egaming 
  & ~ .el-carousel.ad
  & ~ .our-game
    display none
    
.outer-egaming
  position relative !important
  background-repeat no-repeat
  background-size cover
  background-position center
  padding-top .2rem
  padding-bottom .2rem
  .cw
    width 1260px
    margin 0 auto
    min-height 8rem
    text-align center
    background-color rgba(0, 0, 0, .5)
  iframe
    background-color #fff
    width 1034px
    // width 100%
    min-height 963px
    margin-right .2rem
    border none
    &.plat-2
      width 1280px
      min-height 1100px
    &.plat-5
      width 1280px
      min-height 850px
    
  
</style>
