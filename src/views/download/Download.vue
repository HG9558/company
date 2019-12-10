<template lang="jade">
  .activity-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.download-center(style="padding-bottom: 1.5rem")
      .notice(style="margin: 0 0 .2rem 0")
        span.title 温馨提示：
        p.content
          | 如果遇到扫码失败或者被QQ、微信或支付宝屏蔽的情况，
          | 请复制下载链接
          span.text-blue(style="font-size: 14px")  http://x.xybets.com
          |  或者 
          span.text-blue(style="font-size: 14px")  http://d.xybets.com 
          | 至手机自带的浏览器中进行下载，给您带来的不便我们深感抱歉
      el-row(v-for="d in downloads" v-bind:class=" [ d.class ] ")
        el-col(:span="6" style="padding: .1rem .1rem 0 0")
          p.title.text-black {{ d.title }}
          p.intro.text-999 {{ d.intro }}
        el-col.title(:span="18")
          .buttons
            a(v-for="b in d.buttons" v-bind:href="b.download" download="xy")
              .ds-button.tall.wide(:class="[ b.class ]") {{ b.title }}
                .before
                .after {{ b.title }}
                .qr(v-if="b.id")
                  div( v-bind:id=" b.id ")





    
</template>
<script>
  import api from '../../http/api'
export default {
    data () {
      return {
        downloads: [
          {
            title: '信游娱乐',
            intro: '专注彩票游戏平台',
            class: 'ds-icon-download-logo',
            buttons: [
              {title: 'IOS稳定版本', class: 'ds-icon-download-ios', id: 'plat_super_ios'},
              {title: 'IOS下载1', class: 'ds-icon-download-ios', id: 'plat_ios'},
              {title: 'IOS下载2', class: 'ds-icon-download-ios', id: 'plat_ios2'},

              {title: 'Android下载1', class: 'ds-icon-download-android', id: 'plat_andr'},
              {title: 'Android下载2', class: 'ds-icon-download-android', id: 'plat_andr2'},
              {title: 'PC下载', class: 'ds-icon-download-windows primary', download: 'http://52.175.9.139:2018/xyClient.7z'}
            ]
          },
          {
            title: '博盾验证器',
            intro: '保障用户账户安全的神器',
            class: 'ds-icon-download-cbsafe',
            buttons: [
              {title: 'IOS下载', class: 'ds-icon-download-ios', id: 'code_ios'},
              {title: 'Android下载', class: 'ds-icon-download-android', id: 'code_andr'}
              // {title: 'PC下载', class: 'ds-icon-download-windows'}
            ]
          },
          {
            title: '客服系统',
            intro: '功能完善的客服聊天系统',
            class: 'ds-icon-download-chat',
            buttons: [
              {title: 'IOS下载', class: 'ds-icon-download-ios', id: 'chat_ios'}
            ]
          },
          {
            title: '挂机软件',
            intro: '专注彩票游戏平台',
            class: 'ds-icon-download-onhook',
            buttons: [
              {title: 'IOS下载', class: 'ds-icon-download-ios ', id: 'plat_ios_gj', download: 'http://g.xybets.com'},
              {title: 'Android下载', class: 'ds-icon-download-android ', id: 'plat_andr_gj', download: 'http://g.xybets.com'},
              {title: 'PC下载', class: 'ds-icon-download-windows primary', download: 'http://52.175.9.139:2019/xybet_product.rar'}
            ]
          }
        ]
      }
    },
    mounted () {
      if (this.platform === 'ds') {
        this.downloads[0].intro = '信誉品牌，值得您的拥有！'
        this.downloads[2].title = '易迅通'
        this.downloads[2].title = '最安全的客服聊天系统'
      }
      this.getWinClient()
      this.generateQR({plat_ios_gj: 'http://g.xybets.com', plat_andr_gj: 'http://g.xybets.com', plat_ios3: 'http://h.xybets.com/'})
    },
    methods: {
      generateQR (data) {
        Object.entries(data).forEach(([k, v]) => {
          this.qr = new window.QRCode(k, {
            text: v,
            width: 168,
            height: 168,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: window.QRCode.CorrectLevel.H
          })
        })
      },
      getWinClient () {
        this.$http.get(api.getWinClient).then(({data}) => {
          // success
          if (data.success === 1) {
            // this.downloads[0].buttons[4].download = data.cbClient
            // this.downloads[3].buttons[0].download = data.cbClient
            // this.downloads[0].buttons[2].download = data.cbClient
            delete data.success
            delete data.cbClient
            this.generateQR(data)
          } else {
          }
        }, (rep) => {
          // error
        })
      }
    }
  }
</script>


<style lang="stylus">
  
  #app.night
    .dialog-page
      .download-center
        .el-row:hover
          background-color #444
        
          

</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .qr
    position absolute
    top 100%
    left 0 
    width 100%
    height 1rem
    display none
    z-index 10
    padding .05rem 0
    background-color #fff
  .download-center
    top TH
    padding .1rem .3rem
    .el-row
      margin .15rem 0
      padding .3rem  1.15rem 
      padding-right .6rem
      radius()
      &:hover
        background-color #fff
        shadow(0 0 10px rgba(0, 0, 0, .2))
      .title
        font-size .18rem
      .ds-button
        position relative
        margin .1rem
        height .5rem
        width 1.68rem
        padding 0 0 0 .6rem
        text-align left
        line-height .5rem
        font-size .14rem
        .after
        .before
          padding-left .6rem
        &:hover
          .qr
            display block
    .notice
      font-size .12rem
      line-height .22rem
      margin 0 .2rem
      padding PWX
      background-color #fffde8
      border 1px solid #d5d09b
      radius()
      .content
        display inline-block
        margin 0
        // line-height .25rem
        vertical-align top
  
</style>

<style lang="stylus">
  @import '../../var.stylus'
  @import '../../path.stylus'
  #app.v2.cb
    .ds-icon-download-logo
      background url(../../assets/download/logo04.png) .3rem .3rem no-repeat
      &:hover
        background-color #fff
    .ds-icon-download-onhook
      background url(../../assets/download/logo05.png) .3rem .3rem no-repeat
      &:hover
        background-color #fff
    


      
</style>
