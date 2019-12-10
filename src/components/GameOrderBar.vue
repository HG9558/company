<template lang="jade">
  el-row(v-bind:class="['game-' + gameType]" v-bind:style=" s " )



    //- el-popover(ref="ft" placement="top" v-bind:offset="0" trigger="click" v-model="ftshow" v-bind:visible-arrow="false" v-bind:popper-class="'popover-blue popover-times ' + (fts.length > 0 ? true : false)")
      dl.submenu
        dd(v-for="i in fts" @click="(ftshow = false) || (ft = i)") {{ i }}
    
    



    //- el-popover(ref="times" placement="top" v-bind:offset="0" trigger="click" v-model="show" v-bind:visible-arrow="false" v-bind:popper-class="'popover-blue popover-times ' + (ts.length > 0 ? true : false)")
      dl.submenu
        dd(v-for="i in tss" @click="(show = false) || (t = i)") {{ i }}
    

    // el-col.left(:span="4" v-show="HC6")
        


    

    el-col.left(:span="24" v-if=" !HC6 " style="padding: .18rem 0 .02rem 0; position: absolute; top: -.6rem; left: 0; background: #fff; border-bottom: 1px solid #d8d8d8 ")
      
      .ds-button-group(style="vertical-align: top; margin-left: .08rem; box-shadow: none")
        .ds-button.x-small.text-button.shadow-affect.yjfl(v-for=" (c, index) in currencies " @click="cIndex = index" v-bind:class="{selected: index === cIndex}" v-if="!HC6 || (HC6 && index < 2)") {{c.title}}
    
      .inlb(style="vertical-align: middle")
        .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .3rem;box-shadow: none" @click="t > 1 && t--" v-bind:class="{disabled: times === 1 }" v-show="!HC6") 一
        el-input-number.input.times.my-center(ref="t" style="width: .5rem; margin: 0; " v-model="t" v-bind:min="0"  v-show="!HC6" @click.native="focusInputInside($refs['t'])") 
        .ds-button.x-small.outline.plus.shadow-affect(style="margin: 0; height: .3rem;box-shadow: none" size="mini" @click="t++" v-show="!HC6") 十
        span.bei(v-show="!HC6") &nbsp;倍
      
      
      //- el-slider(v-model="p" v-bind:max="max" v-bind:min="min" v-if="P && !(P.maxpoint === P.minpoint)" v-show="!HC6")
      .inlb(style="margin-left: .08rem; margin-top: -.1rem; vertical-align: middle" v-if=" P && !(P.maxpoint === P.minpoint) ")
        .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .2rem; line-height: .2rem; vertical-align: middle; padding: 0; width: .2rem; margin-top: .15rem;box-shadow: none" @click="p > min && (p -= 10) "  v-show="!HC6") 一
        el-slider(v-model="p" v-bind:max="max" v-bind:min="min" v-bind:show-stops="true" v-bind:step="10" v-show="!HC6" style="vertical-align: middle; margin: 0 .1rem; width: .5rem")
        .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .2rem; line-height: .2rem; vertical-align: middle; padding: 0; width: .2rem; margin-top: .15rem;box-shadow: none" @click=" p < max && (p += 10) "  v-show="!HC6") 十
        span.p(v-if="P && !(P.maxpoint === P.minpoint) && maxWinAmount <= 400000" v-show="!HC6") 单注奖金：{{ lprize ? lprize + ' - ' : '' }} {{ prize }}   / 返点：{{ ps}} 
        span.p(v-if="P && !(P.maxpoint === P.minpoint) && maxWinAmount > 400000" v-show="!HC6") 
          span 单注奖金： 
          span.text-danger 超出奖金限制
          span  / 返点：{{ ps}} 

    
      
    el-col.left(:span="12" v-if=" !HC6 " style="padding: .18rem 0 .02rem 0; ")
      
      //- .ds-button-group(style="vertical-align: top; margin-left: .08rem; box-shadow: none")
      //-   .ds-button.x-small.text-button.shadow-affect.yjfl(v-for=" (c, index) in currencies " @click="cIndex = index" v-bind:class="{selected: index === cIndex}" v-if="!HC6 || (HC6 && index < 2)") {{c.title}}
    
      //- .inlb(style="vertical-align: middle")
      //-   .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .3rem;box-shadow: none" @click="t > 1 && t--" v-bind:class="{disabled: times === 1 }" v-show="!HC6") 一
      //-   el-input-number.input.times.my-center(ref="t" style="width: .5rem; margin: 0; " v-model="t" v-bind:min="0"  v-show="!HC6" @click.native="focusInputInside($refs['t'])") 
      //-   .ds-button.x-small.outline.plus.shadow-affect(style="margin: 0; height: .3rem;box-shadow: none" size="mini" @click="t++" v-show="!HC6") 十
      //-   span.bei(v-show="!HC6") &nbsp;倍
      
      
      //- //- el-slider(v-model="p" v-bind:max="max" v-bind:min="min" v-if="P && !(P.maxpoint === P.minpoint)" v-show="!HC6")
      //- .inlb(style="margin-left: .08rem; margin-top: -.1rem; vertical-align: middle" v-if=" P && !(P.maxpoint === P.minpoint) ")
      //-   .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .2rem; line-height: .2rem; vertical-align: middle; padding: 0; width: .2rem; margin-top: .15rem;box-shadow: none" @click="p > min && (p -= 10) "  v-show="!HC6") 一
      //-   el-slider(v-model="p" v-bind:max="max" v-bind:min="min" v-bind:show-stops="true" v-bind:step="10" v-show="!HC6" style="vertical-align: middle; margin: 0 .1rem; width: .5rem")
      //-   .ds-button.x-small.outline.minus.shadow-affect(style="margin: 0; height: .2rem; line-height: .2rem; vertical-align: middle; padding: 0; width: .2rem; margin-top: .15rem;box-shadow: none" @click=" p < max && (p += 10) "  v-show="!HC6") 十
      //-   span.p(v-if="P && !(P.maxpoint === P.minpoint) && maxWinAmount <= 400000" v-show="!HC6") 奖金：{{ lprize ? lprize + ' - ' : '' }} {{ prize }}   / 返点：{{ ps}} 
      //-   span.p(v-if="P && !(P.maxpoint === P.minpoint) && maxWinAmount > 400000" v-show="!HC6") 
      //-     span 奖金： 
      //-     span.text-danger 超出奖金限制
      //-     span  / 返点：{{ ps}} 
      div(style="margin-top: 0rem; vertical-align: bottom; line-height: 1.6")
        p
          | 已选 
          span.count {{ n }} 
          | 注&nbsp;&nbsp;共 
          span.pay {{ pay.toFixed(3) }}
          |  元
        p(v-show=" n && maxWinAmount <= dzMaxPrize ")
          | 最高可中奖
          span.text-blue.text-bold  {{ maxWinAmount.toFixed(2 + cIndex)._nwc() }} 
          | 元，最高可盈利
          span.text-blue.text-bold  {{ maxWinProfit.toFixed(2 + cIndex)._nwc() }} 
          | 元
        p(v-show=" n && maxWinAmount > dzMaxPrize ")
          span.text-danger 超出奖金限制



    el-col.right(:span=" 12 " v-if=" !HC6 " style="padding: .1rem 0 ")
      
      //- .ds-button.success.random.bold.large(@click="!tt && (tt = 750) && __setCall({fn: '__random', args: {}})" v-show="HC6") 机选
      //- .ds-button.danger.bold(v-bind:class="{disabled: !canOrder}" @click="canOrder && order(true)"  v-show="HC6") 一键下单
      .buttons(v-show="!HC6")
        .f_r(style="margin-top: .07rem; vertical-align: bottom")
          //- p
            | 已选 
            span.count {{ n }} 
            | 注&nbsp;&nbsp;共 
            span.pay {{ pay.toFixed(3) }}
            |  元

          p.ft12.t_l(style="line-height: 1.2; padding-bottom: 2px; padding-left: .1rem") 
            span.text-999 本期投注截止 
            span(style="color: #f11b1b") {{ showTime }}&nbsp;
          
          .ds-button.btn3(v-bind:class="{'disabled': !canOrder, btn2: canOrder}" @click="canOrder && order()") 添加选号
          .ds-button.btn2(v-bind:class="{disabled: !canOrder}" @click="canOrder && sh()") 全押

        .f_r
          
          .ds-button.btn1(v-bind:class="{'disabled': !canOrder}" @click="canOrder && order(true)" style="padding-top: .05rem; padding-left: .1rem; padding-right: .1rem; min-width: 1.5rem") 
            span.ft16 一键投注
            p.amoney(style="padding-bottom: .1rem;margin-top: -.05rem; line-height: 1" v-if=" Number(me.amoney) < 10000000 ") 余额： {{ ( Number(me.amoney).toFixed(3) || '0.000')._nwc() }}
            p.amoney(style="padding-bottom: .1rem;margin-top: -.05rem; line-height: 1" v-if=" Number(me.amoney) >= 10000000  ") 余额： ***{{ (Number(me.amoney).toFixed(3) || '0.000')._nwc().substr(-8) }}
            

        

    el-col.left(:span="12" v-if=" HC6 " style="line-height: .5rem")
      span(v-show="HC6") 快速金额
      el-input-number.input.times.my-center(ref="ft" style="width: .5rem;  " v-model="ft" v-bind:min="0"  v-show="HC6" @click.native="focusInputInside($refs['ft'])")
      .ds-button-group(style="vertical-align: middle")
        .ds-button.x-small.text-button(v-for=" (c, index) in currencies " @click="cIndex = index" v-bind:class="{selected: index === cIndex}" v-if="!HC6 || (HC6 && index < 3 && index !== 1)") {{ c.title.slice(1) }}

    el-col.right(:span=" 12 " v-if=" HC6 " style="line-height: .5rem")
      
      | 已选 
      span.count {{ n }} 
      | 注&nbsp;&nbsp;共 
      span.pay {{ pay.toFixed(3) }}
      |  元
      
      .ds-button.primary.bold(v-bind:class="{disabled: !canOrder}" @click="canOrder && order(true)"  v-show="HC6" style="vertical-align: middle") 一键投注

        




</template>

<script>
import util from '../util'
import store from '../store'
export default {
  props: ['model', 'times', 'currency', 'point', 'n', 'wn', 'pay', 'canOrder', 'P', 'gameType', 'type', 'ns', 'timeout', 'PA', 'dtMaxPrize', 'dzMaxPrize'],
  data () {
    return {
      me: store.state.user,
      XXX: 19,
      XM: 100,
      XMM: 0,
      S: 100,
      // MAXTIMES: 1000000000,
      cIndex: 0,
      currencies: [
        {title: '2元', value: 1, model: 1},
        {title: '1元', value: 0.5, model: 5},
        {title: '2角', value: 0.1, model: 2},
        {title: '2分', value: 0.01, model: 3},
        {title: '2厘', value: 0.001, model: 4}
      ],
      p: 0,
      ts: [1, 3, 5, 10, 20, 50],
      show: false,
      t: 1,
      // 快速金额
      ft: 2,
      fts: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 10000],
      ftshow: false,
      // for random
      tt: 0,
      time: 0,
      interval: 0
    }
  },
  computed: {
    P0 () {
      return this.PA[0]
    },
    P1 () {
      return this.PA[1]
    },
    P2 () {
      return this.PA[2]
    },
    P3 () {
      return this.PA[3]
    },
    P4 () {
      return this.PA[4]
    },
    LP () {
      return this.PA[Math.max(this.PA.length - 1, 1)]
    },
    maxWinAmount () {
      if (typeof this.wn === 'number') return this.prize * this.wn
      else if (typeof this.wn === 'object') {
        return this.wn.reduce((p, x, i) => {
          p += x * this['prize' + i]
          return p
        }, 0)
      }
    },
    maxWinProfit () {
      // console.log('wn', this.wn)
      // console.log('maxWinAmount', this.maxWinAmount)
      return this.maxWinAmount - this.pay
    },
    s () {
      return {
        overflow: 'visible',
        background: '#f4f4f4',
        lineHeight: 1,
        border: '1px solid #d8d8d8',
        'margin-top': this.HC6 ? '' : '.6rem !important',
        'border-top': !this.HC6 ? 'none' : '1px solid #d8d8d8'
      }
    },
    showTime () {
      return util.timeFormat(this.time)
    },
    HC6 () {
      return this.gameType === 'HC6'
    },
    tss () {
      return this.ts.reverse()
    },
    ftss () {
      return this.fts.reverse()
    },
    max () {
      return Math.floor(this.P.maxpoint * 10000) || 800
    },
    min () {
      return Math.floor(this.P.minpoint * 10000) || 0
    },
    // step () {
    //   return (this.P.maxpoint - this.P.minpoint) / 10
    // },
    // point string
    ps () {
      return (this.p / 100).toFixed(1) + '%'
    },
    prize () {
      return ((((this.MAX - (this.p - this.min) * (this.MAX - this.P.minprize) / (this.max - this.min)) || this.MAX) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
    },
    lprize () {
      if (this.LP) {
        let MAX = this.LP.maxprize - parseFloat((this.LP.scale * this.LP.minpoint * 100).toFixed(3))
        let max = Math.floor(this.LP.maxpoint * 10000) || 800
        let min = Math.floor(this.LP.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.LP.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    prize0 () {
      if (this.P0) {
        let MAX = this.P0.maxprize - parseFloat((this.P0.scale * this.P0.minpoint * 100).toFixed(3))
        let max = Math.floor(this.P0.maxpoint * 10000) || 800
        let min = Math.floor(this.P0.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.P0.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    prize1 () {
      if (this.P1) {
        let MAX = this.P1.maxprize - parseFloat((this.P1.scale * this.P1.minpoint * 100).toFixed(3))
        let max = Math.floor(this.P1.maxpoint * 10000) || 800
        let min = Math.floor(this.P1.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.P1.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    prize2 () {
      if (this.P2) {
        let MAX = this.P2.maxprize - parseFloat((this.P2.scale * this.P2.minpoint * 100).toFixed(3))
        let max = Math.floor(this.P2.maxpoint * 10000) || 800
        let min = Math.floor(this.P2.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.P2.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    prize3 () {
      if (this.P3) {
        let MAX = this.P3.maxprize - parseFloat((this.P3.scale * this.P3.minpoint * 100).toFixed(3))
        let max = Math.floor(this.P3.maxpoint * 10000) || 800
        let min = Math.floor(this.P3.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.P3.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    prize4 () {
      if (this.P4) {
        let MAX = this.P4.maxprize - parseFloat((this.P4.scale * this.P4.minpoint * 100).toFixed(3))
        let max = Math.floor(this.P4.maxpoint * 10000) || 800
        let min = Math.floor(this.P4.minpoint * 10000) || 0
        return (((MAX - (this.p - min) * (MAX - this.P4.minprize) / (max - min)) * this.currencies[this.cIndex].value) * this.t).toFixed(2 + this.cIndex)
      }
    },
    MAX () {
      return this.P.maxprize - parseFloat((this.P.scale * this.P.minpoint * 100).toFixed(3))
    }
  },
  watch: {
    timeout () {
      this.time = Math.floor(this.timeout)
    },
    point () {
      this.p = Math.min(Number(this.P.maxpoint), Math.max(this.point, Number(this.P.minpoint))) * 10000
    },
    tt () {
      if (this.tt !== 0) {
        setTimeout(() => {
          this.tt = 0
        }, this.tt)
      }
    },
    cIndex () {
      this.$emit('set-currency', this.currencies[this.cIndex])
      !this.HC6 && window.localStorage.setItem('model', this.cIndex)
    },
    p () {
      if (this.p < this.min) this.p = this.min
      else if (this.p > this.max) this.p = this.max
      this.$emit('set-point', (this.p / 10000).toFixed(4), this.prize)
    },
    t () {
      this.setTimes(parseInt(this.t))
    },
    // p changing or prize changing need update point and bonus in game/common.vue
    prize () {
      this.$emit('set-point', (this.p / 10000).toFixed(4), this.prize)
      // if (Number(this.prize) > 400000) {
      //   this.$modal.warn({
      //     content: '超出奖金限制',
      //     btn: ['确定']
      //   })
      // }
    },
    ft () {
      setTimeout(() => {
        this.ft = parseInt(this.ft)
      }, 0)
      this.t = this.ft
      if (this.ft >= 0) {
        this.__setCall({fn: '__setDefaultTimes', args: this.ft})
      }
    }
  },
  mounted () {
    // console.log('new orderbar, point:', this.point)
    this.t = this.times
    this.p = Math.min(this.P.maxpoint, Math.max(this.point, this.P.minpoint)) * 10000
    this.cIndex = parseInt(window.localStorage.getItem('model') || 0)
    if (this.HC6) {
      this.t = this.ft
      this.cIndex = 0
    }
    // setTimeout(() => {
    //   this.$emit('set-point', this.p / 10000, this.prize)
    // }, 0)
    this.time = this.timeout
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--
      }
    }, 1000)
    if (this.ft >= 0) {
      this.__setCall({fn: '__setDefaultTimes', args: this.ft})
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    focusInputInside (e) {
      if (e && e.$el.querySelector('input')) {
        e.$el.querySelector('input').select()
      }
    },
    // __setFt () {
    //   if (this.ft >= 0 && (!(this.$el.currentStyle ? this.$el.currentStyle : window.getComputedStyle(this.$el, null)).display) || ((this.$el.currentStyle ? this.$el.currentStyle : window.getComputedStyle(this.$el, null)).display !== 'none')) {
    //     this.__setCall({fn: '__setDefaultTimes', args: this.ft})
    //   }
    // },
    setTimes (t) {
      this.$emit('set-times', t)
    },
    quickbook () {
      this.$emit('quickbook')
    },
    sh (force) {
      // 提示是否真的要清空余额
      if (!force) {
        return this.$modal.question({
          content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">您确定要“<span class="text-danger">使用所有余额</span>”来购买此注单吗？</div>',
          target: this.$el.parentNode,
          O: this,
          ok () {
            this.sh(true)
          }
        })
      }
      // 如果是梭哈， 改变模式为厘， 全部余额投注到上面
      this.cIndex = 3
      let am = this.me.amoney
      this.__setCall({fn: '__getUserFund', callId: undefined})
      setTimeout(() => {
        if (this.me.amoney !== am) {
          this.t = Math.max(Math.floor(this.me.amoney / (this.pay / this.t)), 1)
          setTimeout(() => {
            this.order(true)
          }, 100)
        } else {
          setTimeout(() => {
            this.t = Math.max(Math.floor(this.me.amoney / (this.pay / this.t)), 1)
            setTimeout(() => {
              this.order(true)
            }, 100)
          }, 300)
        }
        // this.order(true)
      }, 0)
    },
    order (quick) {
      if (!this.type.mutilpOrderPerRow && !this.type.mutilRowPerOrder && this.P.maxCount && (this.n > this.P.maxCount)) {
        return this.$modal.warn({
          content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">该玩法一个方案最多投注量：<span class="text-danger">' + this.P.maxCount + '</span> 注',
          btn: ['确定'],
          target: this.$el.parentNode
        })
      } else if (!this.type.mutilpOrderPerRow && !this.type.mutilRowPerOrder && this.P.minCount && (this.n < this.P.minCount) && this.me.minOrderPop) {
        return this.$modal.question({
          content: '<div class="text-666" style="text-align: left; line-height: .3rem;text-indent: .15rem">该玩法一个方案投注量少于：<span class="text-danger">' + this.P.minCount + '</span> 注，视为单挑模式，奖金最高' + this.dtMaxPrize + '元',
          btn: ['继续购买', '再来几注', '不再提醒'],
          target: this.$el.parentNode,
          O: this,
          ok () {
            // store.actions.setUser({minOrderPop: false})
            this.$emit(quick ? 'quickbook' : 'order', {maxWinAmount: this.maxWinAmount.toFixed(3)._nwc()})
          },
          cancel (i) {
            if (i === 2) {
              store.actions.setUser({minOrderPop: false})
              this.$emit(quick ? 'quickbook' : 'order', {maxWinAmount: this.maxWinAmount.toFixed(3)._nwc()})
            }
          }
        })
      }
      this.$emit(quick ? 'quickbook' : 'order', {maxWinAmount: this.maxWinAmount.toFixed(3)._nwc()})
    }
  },
  components: {
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .el-popover.popover-times
    transform translateY(.07rem)
    .submenu
      padding .05rem 0
      dd
        padding 0 .25rem
        line-height .3rem
        cursor pointer
        &:hover
          color #fff
          background-color BLUE
  
  .times.my-center
    input
      text-align center
      padding 0 .05rem
  
  .inner-bar
    .el-slider__button-wrapper .el-tooltip
      vertical-align middle
  
</style>


<style lang="stylus" scoped>
  @import '../var.stylus'
  .inner-bar
    padding 0 .12rem
    
  .el-row
    transition height .5s linear
    overflow hidden
    &.opacity-0 
      height 0
    &.opacity-1
      height .65rem
      
    width 100%
    // color #666
    background #fff
    &.fixed
      position absolute
      bottom 0
      margin: 0 auto;
      max-width: 9.3rem;
      left: 0;
      right: 0;
      z-index: 1;
      border-bottom-right-radius .05rem
      border-bottom-left-radius .05rem
      .left
        padding: 0.08rem 0px 0.07rem;
      .right
        line-height: .4rem; padding: 0.08rem 0px 0.07rem;
        & > .primary:not(.random)
          display none
        .buttons
          position: relative; top: -.08rem
        
    .el-row
      width 100%
  .el-col
    min-height GOH

  .minus
  .times
  .plus
    vertical-align bottom
    position relative
    top -.09rem
      
  .times
    margin 0 .05rem
      
    
  .bei
    vertical-align bottom
    line-height .4rem  
    
  .ds-button-group
    height .3rem
    line-height .3rem
    display inline-block
    vertical-align middle
    margin 0 PW
    background-color #fff
    radius()
    overflow hidden
    border .01rem solid #ccc
    box-shadow .02rem .02rem .02rem rgba(0, 0, 0, .1)
    box-sizing border-box
    overflow visible
    .ds-button
      position relative
      top -.02rem
      // color #666
      text-shadow none
      box-shadow none
      
      radius(0)
      &:last-child
        border-top-right-radius .05rem
        border-bottom-right-radius .05rem
      &:first-child
        border-top-left-radius .05rem
        border-bottom-left-radius .05rem
      &.selected
        background-color BLUE
        color #fff
        
        
  .right
    line-height .3rem
    text-align right
    .ds-button
      vertical-align bottom
      margin-left 0.05rem
      box-shadow none
      
  
  .count
  .pay
    color DANGER
    font-weight bold
  .p
    padding 0 PW
    
  .btn1
  .btn2
  .btn3
    border 1px solid #d8d8d8
    background-color #fff
    color #666
    text-shadow none
    background-image: linear-gradient(#ffffff, #ffffff), linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
    &:hover
      box-shadow: 0px 3px 3px 0px #e3e3e3;
      color BLUE
      border 1px solid #d8d8d8
  
  .btn1:not(.disabled)
    color #fff
    bg-gradient(90deg, BLUE, BLUE-ACTIVE) 
    &:not(.disabled):hover
      // bg-gradient(90deg, #33b0ff, #24ddce) 
      bg-gradient(90deg, #ff8b1a, #ff643d) 
    &:not(.disabled):active
      background BLUE-ACTIVE 

  .btn3:not(.disabled)
    color #fff
    background #444 !important
    &:hover
      background #333 !important
      
  
  .amoney
    margin-top -.07rem
    padding-bottom .02rem
  
  .amoney
    padding-bottom .04rem
    opacity .6
  
  .shadow-affect
    &:hover
      color BLUE
      box-shadow: 0px 3px 3px 0px #e3e3e3 !important
      border-color #d8d8d8 !important
    &.yjfl.selected
      background #444 !important
      
      
</style>
