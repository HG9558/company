<template lang="jade">  
  .game-page  
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    iframe(:src="ifsrc" v-if="ifsrc" v-show="show" @load=" load ")
    //- video(src="/static/media/football-goal.mp4" autoplay loop style="width: 100%" v-if="!show") 你的浏览器不支持播放，建议使用最新的chrome浏览器
    p(style="color: #fff; font-size: 16px;" v-if="!show") {{ waitmsg }}
      span(v-for=" n in Array(s) ") .

</template>

<script>
export default {
  data () {
    return {
      ifsrc: '',
      show: false,
      prebg: '',
      waitmsg: '请耐心等待，精彩内容正在加载中',
      t: 0,
      s: 1,
      tt: 0
    }
  },
  mounted () {
    this.prebg = document.body.style.backgroundImage
    document.body.setAttribute('nolefter', 'true')
    // document.body.style.background = 'url("/static/skins/sports.jpg")'
    document.body.style.backgroundImage = 'url("/static/skins/sports.jpg")'
    this.t = setInterval(() => {
      this.s++
      if (this.s === 7) {
        this.s = 1
      }
    }, 500)
  },
  beforeDestroy () {
    document.body.style.backgroundImage = this.prebg
    document.body.removeAttribute('nolefter')
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
      // src = 'https://mgs.uxgaming.com/?UUID=e1703bc5175b-37fd-4b6f-bfee-7240108b91e4'
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
<style lang="stylus" scoped>
  .game-page iframe
    width 100%
    height 8rem
    border none
    mragin 0
    padding 0
    @media screen and (max-height: 1400px)
        height 12rem
    @media screen and (max-height: 1200px)
        height 10rem
    @media screen and (max-height: 1080px)
        height 8.5rem
    @media screen and (max-height: 1000px)
        height 8rem
    @media screen and (max-height: 800px)
        height 7.5rem

</style>
<style lang="stylus">
    body[nolefter=true] #app .lefter
        display none
</style>