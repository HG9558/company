<template lang="jade">
    .wrap.vertical-center-modal
      img(src="/static/pic/ggl/2.jpg" style="display: none" ref="img" @load="doi")
      .modal
        .close(@click=" __setCall({fn: '__setGGL'}) ")
        .box(ref="box")
          .a(v-if="w") 恭喜，中奖了
            .aa {{ userPrize }}
              span 元
          .b(v-if="!w") 很抱歉，什么都没有

          .c
            .ds-button.positive(@click="again") 再刮一张

          canvas.canvas(ref="canvas" @mousemove="mm" @mousedown="md" @mouseup="mu" @mouseleave="mu" width="400" height="230" v-if="!f")


</template>
<script>
import util from '../util'
import api from '../http/api'
export default {
  data () {
    return {
      w: 0,
      t: 0,
      ctx: null,
      offset: null,
      move: false,
      f: false,
      userPrize: 0,
      entry: 0
    }
  },
  mounted () {
    this.getScratchPrize(true)
  },
  methods: {
    again () {
      this.getScratchPrize()
    },
    doi () {
      this.ctx = this.$refs['canvas'].getContext('2d')
      this.ctx.drawImage(this.$refs['img'], 0, 0)
      // this.ctx.fillStyle = 'blue'
      this.ctx.globalCompositeOperation = 'destination-out'
      this.getPos()
    },
    getPos () {
      this.offset = util.getOffset(this.$refs['canvas'])
    },
    md () {
      this.move = true
    },
    mu () {
      this.move = false
    },
    mm (e) {
      e.preventDefault()
      if (this.move) {
        var x = (e.clientX || e.pageX) - this.offset.left || 0
        var y = (e.clientY || e.pageY) - this.offset.top || 0
        this.ctx.beginPath()
        this.ctx.arc(x, y, 20, 0, Math.PI * 2)
        this.ctx.fill()
        if (x > 140 && x < 180 && y > 130 && y < 180 && !this.f && !this.t) this.t = setTimeout(() => { this.f = true; this.finishScratchPrize(); clearTimeout(this.t); this.t = 0 }, 100)
      }
    },
    getScratchPrize (a) {
      this.$http.get(api.getScratchPrize).then(({data}) => {
        // success
        if (data.success === 1) {
          this.f = false
          this.move = false
          setTimeout(() => {
            !a && this.doi()
            if (data.userPrize !== 0) {
              this.w = 1
              this.userPrize = data.userPrize
              this.entry = data.scratchId
            } else {
              this.w = 0
              this.entry = data.scratchId
            }
          }, 0)
        }
      })
    },
    finishScratchPrize () {
      this.$http.get(api.finishScratchPrize, {entry: this.entry}).then(({data}) => {
        this.__setCall({fn: '__getUserScratch'})
      })
    }

  }
}
</script>
<style lang="stylus" scoped>
  @import '../var.stylus'
  .wrap
    canvas
      background-color transparent
      position absolute
      top 0
      left 0
      width 400px
      height 230px


  .wrap
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
    background-color rgba(0,0,0,.5)

    &.vertical-center-modal
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      -webkit-box-pack: center;
      -ms-flex-pack: center;
      justify-content: center;

    .modal
      position relative
      width 800px
      height 525px
      background url(../assets/ggl/1.png) no-repeat

      .close
        cursor pointer
        position absolute
        right -20px
        top -20px
        width 40px
        height 40px
        border-radius 50%
        background url(../assets/ggl/4.png) center no-repeat #fff
        &:hover
          background-color #ccc

      .box
        padding 50px 0
        text-align center
        position absolute
        top 215px
        left 205px
        width 400px
        height 230px
        background url(../assets/ggl/3.jpg) no-repeat
        cursor pointer
        .a
          font-weight bold
          color RED
          line-height 1.5
          user-select none
          -moz-user-select none
          -ms-user-select none
          -webkit-user-select none
          .aa
            font-size 48px
            font-weight normal
            span
              font-size 14px
        .b
          font-weight bold
          color #333
          padding 40px 0 10px 0
          -moz-user-select none
          -ms-user-select none
          -webkit-user-select none
        .c
          .ds-button
            border-radius 20px
            height 40px
            line-height 40px


</style>
