<template lang="jade">
.outer-egame(:style=" bgStyle ")
  .cw
    .bg-egame.tab(v-for=" (t, i) in tabs " v-bind:class=" {active: $route.params.tabIndex == (i + 1) } " @click=" $router.push('/egame/' + (i + 1)) ") {{t}}
  .cw(v-if=" href ")
    iframe( :src="href"  @load="load" ref="iframe" v-bind:class=" 'plat-' + key ")

    
</template>

<script>
export default {
  name: 'outer-egame',
  props: [],
  data () {
    return {
      prebg: '',
      bgStyle: {
        backgroundImage: 'url(/static/skins/01.jpg)'
      },
      title: '',
      href: '',
      key: '',
      tabs: ['BG电子游戏', 'PT游戏', 'LG游戏'],
      fns: ['2:203:iframe:/egame/1', '5:203:iframe:/egame/2', ''],
      hrefs: ['', '', '/lg_egame/index.html']
    }
  },
  computed: {
    tabIndex () {
      return this.$route.params.tabIndex
    }
  },
  watch: {
    tabIndex () {
      this.init()
    }
  },
  created () {
    this.init()
  },
  mounted () {
    // this.prebg = document.body.style.background
    // document.body.setAttribute('nolefter', 'true')
    // document.body.style.background = '#27262b'
  },
  beforeDestroy () {
    // document.body.style.background = this.prebg
    // document.body.removeAttribute('nolefter')
    this.clearIframe()
  },
  methods: {
    init () {
      if (!this.tabIndex) return
      this.key = this.tabIndex
      let fn = this.fns[this.tabIndex - 1]
      let href = this.hrefs[this.tabIndex - 1]
      if (href) this.__setIframeSrc(href)
      else if (fn) this.__setCall({fn: '__openThirdPart', args: {id: 1, fn: fn}})
    },
    __setIframeSrcKey (key) {
      // this.key = (key || '').split(':')[0]
    },
    __setIframeSrc (src) {
      if (src.startsWith('?un=')) src = '/pt_egame/index.html' + src
      // if (src.startsWith('?un=')) src = 'http://cb510.net/pt_egame/index.html' + src
      this.href = src
    },
    load () {
      if (this.$refs['iframe'].contentWindow.document) {
        setTimeout(() => {
          this.__setIframeWH()
          this.listenIframe()
        }, 300)
      }
    },
    listenIframe () {
      !this.t && (this.t = setInterval(() => {
        this.__setIframeWH()
      }, 1000))
    },
    clearIframe () {
      clearInterval(this.t)
      this.t = 0
      this.href = ''
    },
    __setIframeWH () {
      this.$refs['iframe'].style.height = this.$refs['iframe'].contentWindow.document.body.clientHeight + 'px'
      // this.$refs['iframe'].style.width = this.$refs['iframe'].contentWindow.document.body.clientWidth + 'px'
    }
  }
}
</script>

<style lang="stylus">
@import '../../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.outer-egame 
  & ~ .el-carousel.ad
  & ~ .our-game
    display none
    
.outer-egame
  position relative !important
  background-repeat no-repeat
  background-size 100%
  background-color #fff
  padding-top 2rem
  padding-bottom .2rem
  .cw
    width 1260px
    margin 0 auto
  .tab
    width 1.8rem
    height .6rem
    line-height .6rem
    display inline-block
    background-color #fff
    margin .1rem 0
    text-align center
    cursor pointer
    &:hover
      color BLUE
    &.active
      color #fff
      background-color BLUE
  
  iframe
    background-color #fff
    width 100%
    min-height 8rem
    margin-right .2rem
    border none
    &.plat-1
      width 1280px
      min-height 1100px
    &.plat-2
      width 1280px
      min-height 850px
    &.plat-3
      width 1280px
      min-height 400px
    
  
</style>
