<template lang="jade">
  ._404
    h1 404
    p 您访问的页面不存在！
    .buttons
      router-link.ds-button.primary(:to=" '/' " @click.native.stop="") 返回首页

   
</template>

<style lang="stylus">

  ._404 + .download
    display none
    
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

  @import '../../var.stylus'
  ._404.part
    
    width 2.5rem
    height 3rem
    padding-left 4rem
    margin-top .8rem
    padding-top .5rem
    color #fff
    background url(../../assets/404/404.png) left top no-repeat
    font-shadow()
    h1 
      font-size .72rem
      height .72rem
      margin 0 0
      font-weight normal
    > * 
      margin .4rem 0
    
    
  
</style>



