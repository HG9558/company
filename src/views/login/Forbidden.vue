<template lang="jade">
  .forbidden
    h1 Access Deny
    h1 访问受限制
    p(style="margin-top: .7rem") Dear customer
      br
      | due to your regional restrictions on the page, you can not open your page
      br
      | very sorry for the inconvenience

    p 尊敬的客户
      br
      | 由于您的地区限制，此网页无法打开，非常抱歉给您带来的不便！
      

   
</template>

<style lang="stylus">

  .forbidden + .download
    display none
    
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

  @import '../../var.stylus'
  .forbidden.part
    
    width 6rem
    height 6rem
    padding-left 7rem
    margin-top .8rem
    color #fff
    background url(../../assets/404/deny.png) 2.5rem .25rem no-repeat
    font-shadow()
    h1 
      font-size .36rem
      margin .2rem 0
      font-weight normal
    p
      line-height .24rem
    > * 
      margin .3rem 0
    
    
  
</style>



