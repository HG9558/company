<template lang="jade">
  .dice(v-bind:class=" 'has-side-' + v_ ")
    // special with text
    .side.front(v-if="text") {{ v_ }}

    // 1
    .side.front(v-if="v_ === 1 || v_ === 'all' ")
      span.dot.center
    .side.front.inner(v-if="v_ === 'all' ")
    
    // 2
    .side.top(v-if="v_ === 2 || v_ === 'all' ")
      span.dot.dtop.dleft
      span.dot.dbottom.dright
    .side.top.inner(v-if="v_ === 'all' ")
    
    // 3
    .side.right(v-if="v_ === 3 || v_ === 'all' ")
      span.dot.dtop.dright
      span.dot.center
      span.dot.dbottom.dleft
    .side.right.inner(v-if="v_ === 'all' ")
    
    // 4
    .side.left(v-if="v_ === 4 || v_ === 'all' ")
      span.dot.dtop.dleft
      span.dot.dtop.dright
      span.dot.dbottom.dleft
      span.dot.dbottom.dright
    .side.left.inner(v-if="v_ === 'all' ")
    
    // 5
    .side.bottom(v-if="v_ === 5 || v_ === 'all' ")
      span.dot.center
      span.dot.dtop.dleft
      span.dot.dtop.dright
      span.dot.dbottom.dleft
      span.dot.dbottom.dright
    .side.bottom.inner(v-if="v_ === 'all' ")
    
    // 6
    .side.back(v-if="v_ === 6 || v_ === 'all' ")
      span.dot.dtop.dleft
      span.dot.dtop.dright
      span.dot.dbottom.dleft
      span.dot.dbottom.dright
      span.dot.center.dleft
      span.dot.center.dright
    .side.back.inner(v-if="v_ === 'all' ")

    .side.cover.x(v-if="v_ === 'all'")
    .side.cover.y(v-if="v_ === 'all'")
    .side.cover.z(v-if="v_ === 'all'")
    
</template>

<script>
  export default {
    props: ['value'],
    data () {
      return {
        vs: [1, 2, 3, 4, 5, 6, 'all']
      }
    },
    computed: {
      v_ () {
        return parseInt(this.value || 0) || 'all'
      },
      text () {
        return this.vs.indexOf(this.v_) === -1
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  
  @keyframes spin
    for i in 0..10
      {10% * i}
        transform perspective(100px) translateZ(-100px) rotateX(180deg * i) rotateY(180deg * 1) rotateZ(180deg * (i - 1))
    
  W = .52rem
  w-1 = .22rem
  w-2 = .1rem
  
  .dice  
    width  W 
    height  W 
    line-height W - 0.02rem
    text-align center
    float left
    radius(PW)
    transform-style  preserve-3d 
    &.all
      animation spin 50s infinite linear
    shadow()
    
    &:not(.dead)
      .side:hover
        background BLUE
        color #fff
        .dot
          background #fff
          outshadow()
        
      .side.selected
        background DANGER
        color #fff
        .dot
          background #fff
          outshadow()
      
  .dot  
    position absolute 
    width w-1 
    height w-1 
    radius(50%)
    top 0 
    left 0
    background-color #4121e0
    box-sizing border-box
    // transition background-color .5s linear
    
  .side:not(.front) .dot
    width w-2
    height w-2
      
  .side  
    position absolute
    width W
    height W
    radius(PW)
    bg-gradient(180deg, #f9f9f9, #e6e6e6)
    // transition background-color .5s linear
      
    // 1
    &.front
      .dot
        margin  PW 0 0 PW 
        background-color #db0000
    
    // 2
    &.top
      .dot.dtop.dleft
        margin .11rem 0 0 .21rem
      .dot.dbottom.dright
        margin .31rem 0 0 .21rem
    
    // 3
    &.right
      .dot.dtop.dright
        margin .1rem 0 0 .34rem
      .dot.center
        margin .21rem
      .dot.dbottom.dleft
        margin .32rem 0 0 .08rem
        
    // 4
    &.left
      .dot
        background-color #db0000
        
      .dot.dtop.dleft
        margin .11rem 0 0 .11rem
      .dot.dtop.dright
        margin .11rem 0 0 .31rem
      .dot.dbottom.dleft
        margin .31rem 0 0 .11rem
      .dot.dbottom.dright
        margin .31rem 0 0 .31rem
    
    // 5
    &.bottom
      .dot.center
        margin .21rem
      .dot.dtop.dleft
        margin .1rem 0 0 .1rem
      .dot.dtop.dright
        margin .1rem 0 0 .3rem
      .dot.dbottom.dleft
        margin .3rem 0 0 .1rem
      .dot.dbottom.dright
        margin .3rem 0 0 .3rem
    
    // 6
    &.back
      .dot.dtop.dleft
        margin .07rem 0 0 .12rem
      .dot.dtop.dright
        margin .07rem 0 0 .3rem
      .dot.dbottom.dleft
        margin .35rem 0 0 .12rem
      .dot.dbottom.dright
        margin .35rem 0 0 .3rem
      .dot.center.dleft
        margin .21rem 0 0 .12rem
      .dot.center.dright
        margin .21rem 0 0 .3rem 
      

  
  .dices:not(.dead)
    &:hover
      .dice:not(.dead) .side
        background BLUE 
        color #fff
        .dot
          background #fff
          outshadow()
    &.selected
      .dice:not(.dead) .side
        background DANGER
        color #fff
        .dot
          background #fff
          outshadow()
      
  
  .dice.has-side-all .cover, .dice.has-side-all .inner  
      radius(PW)
      // bg-gradient(180deg, #f9f9f9, #e6e6e6)
  .dice.has-side-all .cover  
      border-radius  0 
      transform  translateZ(0px) 
      radius(PW)
   
  .dice.has-side-all .cover.x  
      transform  rotateY(90deg) 
   
  .dice.has-side-all .cover.z  
      transform  rotateX(90deg) 
   
  .dice.has-side-all .front   
      transform  translateZ(0.5*W) 
   
  .dice.has-side-all .front.inner   
      transform  translateZ(0.49*W) 
   
  .dice.has-side-all .back  
      transform  rotateX(-180deg) translateZ(0.5*W) 
   
  .dice.has-side-all .back.inner  
      transform  rotateX(-180deg) translateZ(0.49*W) 
   
  .dice.has-side-all .right  
      transform  rotateY(90deg) translateZ(0.5*W) 
   
  .dice.has-side-all .right.inner  
      transform  rotateY(90deg) translateZ(0.49*W) 
   
  .dice.has-side-all .left  
      transform  rotateY(-90deg) translateZ(0.5*W) 
   
  .dice.has-side-all .left.inner  
      transform  rotateY(-90deg) translateZ(0.49*W) 
   
  .dice.has-side-all .top  
      transform  rotateX(90deg) translateZ(0.5*W) 
   
  .dice.has-side-all .top.inner  
      transform  rotateX(90deg) translateZ(0.49*W) 
   
  .dice.has-side-all .bottom  
      transform  rotateX(-90deg) translateZ(0.5*W) 
   
  .dice.has-side-all .bottom.inner  
      transform  rotateX(-90deg) translateZ(0.49*W) 
   
  
   
  
  

  
  

</style>
