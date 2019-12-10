<template lang="jade">
  dl.step-tabs(:class="type")
    dd.tab(v-for="(t, index) in steps" v-bind:class="{ active:  index === stepIndex, 'ds-icon-right-arrow': type }") {{ t }}

</template>

<script>
  export default {
    props: ['steps', 'stepIndex', 'type'],
    data () {
      return {
      }
    }
  }
</script>

<style lang="stylus">
  @import '../var.stylus'
  
  .step-tabs:not(.text)
    text-align center
    transform translateX(-.18rem)
    .tab
      position relative
      display inline-block
      padding 0.55*PW .5rem
      color WHITE
      background-color rgba(255, 255, 255, .2)
      border-color rgba(255, 255, 255, .2)
      margin-left .21rem
      &:first-child
        radius()
        border-top-right-radius 0
        border-bottom-right-radius 0
      &:not(:first-child):before
        position absolute
        top 0
        left -.180rem
        content ''
        width 0 
        height 0 
        border-top 0.37*BMH solid
        border-bottom 0.37*BMH solid
        border-color inherit
        border-left 0.37*BMH solid transparent
        z-index 1
      &:after
        position absolute
        top 0
        left 100%
        content ''
        width 0 
        height 0 
        border-top 0.37*BMH solid transparent
        border-bottom 0.37*BMH solid transparent
        border-left 0.37*BMH solid 
        border-left-color inherit
        z-index 1
        
      &.active
        background-color BLUE
        border-color BLUE
  
  .step-tabs.text
    text-align center
    transform translateX(-.15rem)
    .tab
      position relative
      display inline-block
      padding 0 .7rem 0 .5rem
      color #999
      font-size .24rem
      &.active
        color BLUE
      &:last-child
        background none
        
  .step-tabs.text-small
    .tab
      padding 0 .34rem 0 .2rem
      font-size .2rem
      
    .ds-icon-right-arrow
      background url($CASSETS/guide/right-arrow-small.png) right center no-repeat
      
</style>
