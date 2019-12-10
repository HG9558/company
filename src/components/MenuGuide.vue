<template lang="jade">
  .menu-guide
   
    img(src="/static/pic/menu_guide/1.png")
    img(src="/static/pic/menu_guide/2.png")
    img(src="/static/pic/menu_guide/3.png")
    .t_c
      img(src="/static/pic/menu_guide/4.png" @click=" $emit('hideMenuGuide') ")

     .close
      el-button.close(icon="close" @click=" $emit('hideMenuGuide') ")
</template>

<script>
  export default {
    data () {
      return {}
    }
  }
</script>
<style lang="stylus" scoped>
@import '../var.stylus'
.menu-guide
  position relative
.close
  position absolute
  top 1.55rem
  right .7rem
  .el-button
    background none
    border none
    color DANGER
    font-size .24rem
    &:hover
      color DANGER-HOVER 
    &:active
      color DANGER-ACTIVE 
      
</style>

<style lang="stylus">
.menu-guide-modal.modal
  .mask
    opacity .8
  .box
    vertical-align top
    background none
    max-height none
    text-align right
  
    
  img:nth-child(1)
    width 5.7rem
    margin 0 .2rem 0 0
    
  img:nth-child(2)
    width 6.03rem
    margin-bottom .35rem
    margin-right .35rem
    
  img:nth-child(3)
    width 10.7rem
    margin-right 1.8rem
    
  .t_c img
    width 2.11rem
    cursor pointer
    margin .2rem -.1rem 0 0
    &:hover
      opacity .95
      
  @media(max-height: 768px)
    img:nth-child(1)
      width 5.7rem
      margin 0 .2rem 0 0
      
    img:nth-child(2)
      width 6rem
      margin-bottom 0
      margin-right .35rem
      
    img:nth-child(3)
      width 10rem
      margin-right 1.8rem
      
    .t_c img
      width 1.8rem
      cursor pointer
      margin .1rem -.1rem 0 0
      &:hover
        opacity .95
  
        
</style>
