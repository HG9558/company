

<template lang="jade">
  .help-page.vip-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")

    .scroll-content.vip-introduction
      img(src="/static/pic/bz_bg.jpg" style="width: 100%")
      .title  信游娱乐VIP制度
      .block
        h2.text-black.text-center VIP享受的特权
        .content
            .slot 高额存提通道
            .slot 专属VIP客服
            .slot 稳定游戏专线
            .slot 专属定制活动
            .slot 问题优先处理

      .block(style="background: none; padding: .05rem 0")
        .text-blue 信游VIP至尊特权
        .content(style="max-width: 25rem; margin: .1rem 0; padding: 0")
            el-row.t-header.text-black
              el-col(:span="4") 特权待遇
              el-col(:span="4") VIP1
              el-col(:span="4") VIP2
              el-col(:span="4") VIP3
              el-col(:span="4") VIP4
              el-col(:span="4") VIP5
            el-row
              el-col(:span="4") 专属客服
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
            el-row
              el-col(:span="4") 游戏专线
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
            el-row
              el-col(:span="4") 优先特权
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√
              el-col(:span="4") &nbsp;&nbsp;√

      .block(style="background: none;  padding: .05rem 0")
        .text-blue 充提特权（优先处理，充值次数不限，提款次数最多5次）
        .content(style="max-width: 25rem; margin: .1rem 0; padding: 0")
            el-row.t-header.text-black
              el-col(:span="4") 等级
              el-col(:span="10") 充值说明
              el-col(:span="10") 提款说明
            el-row
              el-col(:span="4") VIP1
              el-col(:span="10") 充值单笔最低
                span.text-blue  100元 
                |,单笔最高
                span.text-blue  5万元 
                |;
              el-col(:span="10") 提款单笔最低
                    span.text-blue  100元 
                    |, 单笔最高
                    span.text-blue  6万元 
            el-row
              el-col(:span="4") VIP2
              el-col(:span="10") 充值单笔最低
                span.text-blue  100元 
                |,单笔最高
                span.text-blue  10万元 
                |;
              el-col(:span="10") 提款单笔最低
                    span.text-blue  100元 
                    |, 单笔最高
                    span.text-blue  8万元 
            el-row
              el-col(:span="4") VIP3
              el-col(:span="10") 充值单笔最低
                span.text-blue  100元 
                |,单笔最高
                span.text-blue  15万元 
                |;
              el-col(:span="10") 提款单笔最低
                    span.text-blue  100元 
                    |, 单笔最高
                    span.text-blue  10万元 
            el-row
              el-col(:span="4") VIP4
              el-col(:span="10") 充值单笔最低
                span.text-blue  100元 
                |,单笔最高
                span.text-blue  20万元 
                |;
              el-col(:span="10") 提款单笔最低
                    span.text-blue  100元 
                    |, 单笔最高
                    span.text-blue  12万元 
            el-row
              el-col(:span="4") VIP5
              el-col(:span="10") 充值单笔最低
                span.text-blue  100元 
                |,单笔最高
                span.text-blue  30万元 
                |;
              el-col(:span="10") 提款单笔最低
                    span.text-blue  100元 
                    |, 单笔最高
                    span.text-blue  15万元 
      
      .block(style="background: none; padding: .05rem 0")
        .text-blue 信游VIP晋升途径一
        .content(style="max-width: 25rem; margin: .1rem 0; padding: 0")
            el-row.t-header.text-black
              el-col(:span="4") 等级
              el-col(:span="6") 提出VIP申请前7日内
              el-col(:span="6") 提出VIP申请前15日内
              el-col(:span="8") 提出VIP申请前30日内
            el-row
              el-col(:span="4") VIP1
              el-col(:span="6") 完成
                span.text-blue  10万 
                | 存款及
                span.text-blue  20万 
                | 投注额
              el-col(:span="6") 完成
                span.text-blue  15万 
                | 存款及
                span.text-blue  30万 
                | 投注额
              el-col(:span="8") 完成
                span.text-blue  20万 
                | 存款及
                span.text-blue  50万 
                | 投注额

            el-row
              el-col(:span="4") VIP2
              el-col(:span="6") 完成
                span.text-blue  15万 
                | 存款及
                span.text-blue  30万 
                | 投注额
              el-col(:span="6") 完成
                span.text-blue  25万 
                | 存款及
                span.text-blue  50万 
                | 投注额
              el-col(:span="8") 完成
                span.text-blue  30万 
                | 存款及
                span.text-blue  75万 
                | 投注额

            el-row
              el-col(:span="4") VIP3
              el-col(:span="6") 完成
                span.text-blue  20万 
                | 存款及
                span.text-blue  40万 
                | 投注额
              el-col(:span="6") 完成
                span.text-blue  35万 
                | 存款及
                span.text-blue  70万 
                | 投注额
              el-col(:span="8") 完成
                span.text-blue  40万 
                | 存款及
                span.text-blue  100万 
                | 投注额
            el-row
              el-col(:span="4") VIP4
              el-col(:span="6") 完成
                span.text-blue  25万 
                | 存款及
                span.text-blue  50万 
                | 投注额
              el-col(:span="6") 完成
                span.text-blue  45万 
                | 存款及
                span.text-blue  90万 
                | 投注额
              el-col(:span="8") 完成
                span.text-blue  50万 
                | 存款及
                span.text-blue  125万 
                | 投注额
            el-row
              el-col(:span="4") VIP5
              el-col(:span="6") 完成
                span.text-blue  30万 
                | 存款及
                span.text-blue  60万 
                | 投注额
              el-col(:span="6") 完成
                span.text-blue  55万 
                | 存款及
                span.text-blue  110万 
                | 投注额
              el-col(:span="8") 完成
                span.text-blue  60万 
                | 存款及
                span.text-blue  150万 
                | 投注额
             
 
      .block(style="background: none; padding: .05rem 0")
        .text-blue 信游VIP晋升途径二
        p.tttt(style="background-color: #fff; padding: .1rem .2rem; margin: .1rem 0") 由VIP会员或直属及以上直接推荐，推荐人与被推荐人不能共用同一账户、同一IP以及同一姓名银行卡信息。
      
      .block(style="background: none; padding: .05rem 0")
        .text-blue 保级条件
        .content(style="max-width: 25rem; margin: .1rem 0; padding: 0")
            el-row.t-header.text-black
              el-col(:span="4") 等级
              el-col(:span="18") 保级条件
            el-row
              el-col(:span="4") VIP1
              el-col(:span="18") 一个月内完成
                span.text-blue  40万 
                | 投注额
            el-row
              el-col(:span="4") VIP2
              el-col(:span="18") 一个月内完成
                span.text-blue  60万 
                | 投注额
            el-row
              el-col(:span="4") VIP3
              el-col(:span="18") 一个月内完成
                span.text-blue  80万 
                | 投注额
            el-row
              el-col(:span="4") VIP4
              el-col(:span="18") 一个月内完成
                span.text-blue  100万 
                | 投注额
            el-row
              el-col(:span="4") VIP5
              el-col(:span="18") 一个月内完成
                span.text-blue  120万 
                | 投注额

        p.text-grey
          | 注：所有VIP会员的保级考核从成为VIP所在月份的下一个月开始进行统计；每个月前两个工作日内完成VIP资格更新。
          br
          | 例：玩家在11月10日申请VIP并成功晋升，则11月10日 至 11月31日期间均可享受VIP特权；12月1日至12月31日开始针对该会员进行VIP保级考核；1月1日至1月2日完成所有VIP资格更新。

      .block(style="background: none; padding: .05rem 0")
        .text-blue 常见问题：
        .content.tall(style="max-width: 25rem; margin: .1rem 0; padding: 0")
            el-row.text-black(style="display: none")
            el-row.text-black
              el-col(:span="24") 1. 是否存在“直属及以上级别推荐”？
            el-row
              el-col(:span="24" style="padding-left: .5rem") 答： 是的，直属及以上推荐的名单可直接为VIP1。

            el-row.text-black
              el-col(:span="24") 2. 通过推荐方式晋级的账户是可否越级成为高等级VIP？比如 直属及以上或平台VIP推荐的账户直接晋级成为VIP5?
            el-row
              el-col(:span="24" style="padding-left: .5rem") 答： 通过“推荐方式”成为VIP的账户，首次晋级仅可成为VIP1。（但VIP1首次通过考核且达到VIP5标准，可申请越级，即VIP1可升级成为VIP5）

            el-row.text-black
              el-col(:span="24") 3. 如达到晋级标准，平台是否会直接升级该账户？
            el-row
              el-col(:span="24" style="padding-left: .5rem") 答： 对达到晋级标准的VIP账户，平台会以系统消息的形式通知至各位，玩家如有意愿进行升级可联系平台客服进行申请，方后平台将会予以升级。

            el-row.text-black
              el-col(:span="24") 4. 怎样的情况下，会予以降级或者取消VIP资格？
            el-row
              el-col(:span="24" style="padding-left: .5rem") 答： 怎样的情况下，会予以降级或者取消VIP资格？

            el-row.text-black
              el-col(:span="24") 5. 每月审核，是以个人充值量和投注量为标准，还是以团队充值量和投注量为审核标准
            el-row
              el-col(:span="24" style="padding-left: .5rem") 答：对于VIP账户，平台统一以个人的充值量和投注量为标准进行相关审核。


</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    // window.ifif = this.$refs.IF
    // this.$refs.IF.onload = () => {
    //   console.log(this.$refs.IF.querySelector('#header_wrap2'))
    //   setTimeout(() => {
    //     this.$refs.IF.querySelector('#header_wrap2').style.display = 'none'
    //   }, 3000)
    // }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .help-page
      min-width 9rem
  .vip-introduction
    top TH
    padding PWX
    font-size .14rem
    // background url(../../assets/v2/bz_bg.jpg) no-repeat
    // margin 0 auto
    // max-width 12rem
    .title
      position absolute
      top 1.2rem
      right 1rem
      color #fff
      font-size .36rem
      @media screen and (max-width: 1600px)
        top .5rem
        font-size .24rem

    .block
        &>.text-blue
            padding-left .2rem
        margin PW 0
        padding PWX PW
        background #fff
        h2
            font-size .24rem
        .content
            max-width 8rem
            padding .4rem 0 0 0
            margin auto
            .slot
                display inline-block
                width 1.6rem
                padding-top 1.1rem
                background url(../../assets/v2/bz_icon_01.png) no-repeat 
            .slot:nth-child(2)
                background url(../../assets/v2/bz_icon_02.png) no-repeat 
            .slot:nth-child(3)
                background url(../../assets/v2/bz_icon_03.png) no-repeat 
            .slot:nth-child(4)
                background url(../../assets/v2/bz_icon_04.png) no-repeat 
            .slot:nth-child(5)
                background url(../../assets/v2/bz_icon_05.png) no-repeat 

    .el-row
        font-size .12rem
        &:nth-child(odd)
            background-color rgba(255, 255, 255, .5)
        &:nth-child(even)
            background-color #fff
        padding .1rem 0
        line-height 1.2
        .el-col:first-child
            padding-left .2rem

    .content.tall .el-row
        padding PW 0
    .t-header
      // padding PW 0
      // line-height .4rem
      bg-gradient(180deg, #ddd, #eee)
      
  
</style>

<style lang="stylus">
  #app.night  .vip-introduction
    .block
      background-color #454545

    .el-row
        color #ccc
        &:nth-child(odd)
            background-color #777
        &:nth-child(even)
            background-color #555

    .t-header
    .tttt
      background #444 !important

</style>
