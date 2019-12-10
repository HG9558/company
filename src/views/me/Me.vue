<template lang="jade">
  .my-wallet-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content

      .s(style="padding: PWX 0")
        .c
          br
          p 主账户
          p.amount.text-black {{ numberWithCommas(ME.amoney) }}
            // span.text-666 元
        .c
          br
          p 特殊账户
          p.amount.text-black {{ numberWithCommas(ME.smoney) }}
            // span.text-666 元
        .c
          br
          p BG账户
          p.amount.text-black {{ numberWithCommas(ME.bgmoney) }}
            // span.text-666 元
        .c
          br
          p 体育账户
          p.amount.text-black {{ numberWithCommas(ME.tcgmoney.toFixed(4)) }}
            // span.text-666 元

        .c
          br
          p 棋牌账户
          p.amount.text-black {{ numberWithCommas(ME.kymoney.toFixed(4)) }}
            // span.text-666 元

        .c
          br
          p PT账户
          p.amount.text-black {{ numberWithCommas(ME.ptmoney.toFixed(4)) }}
            // span.text-666 元

        .c
          br
          p AG账户
          p.amount.text-black {{ numberWithCommas(ME.agmoney.toFixed(4)) }}
            // span.text-666 元

        .c
          br
          p 一本账户
          p.amount.text-black {{ numberWithCommas(ME.sbmoney.toFixed(4)) }}
            // span.text-666 元

        .c
          br
          p 信游币
          p.amount.text-black {{ numberWithCommas(ME.free) }}
            // span.text-666 元
      
      .s
        .cc
          p.title.text-black 账户互转 
          label.item 转出账户 
            el-select(v-model="f" style="width: 2.5rem" placeholder="无")
              el-option(v-for="(n, i) in froms" v-bind:label=" n.split(':')[0] " v-bind:value="i")
          p 可用余额：
            span.text-blue {{ numberWithCommas(fm) }}
            | 元
            span.switch-box
              span.switch(v-if="showSwitch" @click=" switchs ")
              span.refresh(@click=" refresh ")
        
          label.item 转入到&nbsp;&nbsp;&nbsp;&nbsp;
            el-select(v-model="t" style="width: 2.5rem" placeholder="无")
              el-option(v-for="(n, i) in ctos" v-bind:label=" n.split(':')[0] " v-bind:value="i")

          p 现有余额：
            span.text-blue {{ numberWithCommas(tm) }}
            | 元

          label.item 交易金额 
            input.ds-input(v-model="m" style="width: 2.5rem")

          p &nbsp;&nbsp;
            span {{ cm }}

          //- label.item 资金密码  
            input.ds-input(v-model="cpwd" type="password" style="width: 2.5rem" @keydown.enter="ok")

          .buttons(style="margin-left: .6rem; margin-top: .2rem")
            button.ds-button.primary.full(@click="ok" v-bind:disabled="btn" v-bind:class="{ cancel: btn }") 确认
            button.ds-button.primary.full(@click="ok") 一键转回








</template>

<script>
import { numberWithCommas, digitUppercase } from '../../util/Number'
import store from '../../store'
import api from '../../http/api'
export default {
  data () {
    return {
      ME: store.state.user,
      numberWithCommas: numberWithCommas,
      digitUppercase: digitUppercase,
      f: '',
      froms: ['主账户', '特殊账户', 'BG账户:2', '体育账户:3', '棋牌账户:7', 'PT账户:5', 'AG账户:4', '一本账户:9'],
      t: '',
      m: '',
      cpwd: '',
      btn: false
    }
  },
  computed: {
    fm () {
      switch (this.f) {
        case 0:
          return this.ME.amoney
        case 1:
          return this.ME.smoney
        case 2:
          return this.ME.bgmoney
        case 3:
          return this.ME.tcgmoney
        case 4:
          return this.ME.kymoney
        case 5:
          return this.ME.ptmoney
        case 6:
          return this.ME.agmoney
        case 7:
          return this.ME.sbmoney
      }
    },
    tm () {
      switch (this.f) {
        case 0:
          return [this.ME.bgmoney, this.ME.tcgmoney, this.ME.kymoney, this.ME.ptmoney, this.ME.agmoney, this.ME.sbmoney][this.t]
        case 1:
          return this.ME.amoney
        case 2:
          return this.ME.amoney
        case 3:
          return this.ME.amoney
        case 4:
          return this.ME.amoney
        case 5:
          return this.ME.amoney
        case 6:
          return this.ME.amoney
        case 7:
          return this.ME.amoney
      }
    },
    ctos () {
      switch (this.f) {
        case 0:
          return this.froms.slice(2)
        case 1:
          return this.froms.slice(0, 1)
        case 2:
          return this.froms.slice(0, 1)
        case 3:
          return this.froms.slice(0, 1)
        case 4:
          return this.froms.slice(0, 1)
        case 5:
          return this.froms.slice(0, 1)
        case 6:
          return this.froms.slice(0, 1)
        case 7:
          return this.froms.slice(0, 1)
      }
    },
    cm () {
      return digitUppercase(this.m.replace(/[^0-9.]/g, '') || 0)
    },
    showSwitch () {
      return (this.f === 0 && this.t === 0) || (this.f === 2 && this.t === 0) || (this.f === 0 && this.t === 1) || (this.f === 3 && this.t === 0) || (this.f === 4 && this.t === 0) || (this.f === 0 && this.t === 2) || (this.f === 0 && this.t === 3) || (this.f === 0 && this.t === 4) || (this.f === 5 && this.t === 0) || (this.f === 6 && this.t === 0) || (this.f === 7 && this.t === 0)
    },
    ccm () {
      return parseFloat(this.m.replace(/[^0-9.]/g, '') || 0)
    },
    bgAPI () {
      return [api.withdrawFromBG, api.transferToBG][this.f === 0 ? 1 : 0]
    },
    fi () {
      return parseInt((this.froms[this.f] || '').split(':')[1] || this.f)
    },
    ti () {
      return parseInt((this.ctos[this.t] || '').split(':')[1] || this.t)
    }
  },
  watch: {
    f () {
      if (this.f !== '') this.t = 0
    },
    m () {
      this.m = this.m.trim()
      this.m = this.m.replace(/[^0-9,.]/g, '').replace(/[,.]{2,}/g, ',')
      let [l, r, t] = this.m.split('.')
      if (r) this.m = l + '.' + r.slice(0, 3)
      if ((r && r.split(/[,]/)[1]) || t) this.m = l + '.' + r.split(/[.,]/)[0].slice(0, 3)
    }
  },
  mounted () {
    this.getBalance()
    // this.__setCall({fn: '__getUserFund', args: undefined})
  },
  methods: {
    refresh () {
      this.__setCall({fn: '__getUserFund', args: undefined})
      this.getBalance()
    },
    switchs () {
      if (this.f === 0 && this.t === 0) this.f = 2
      else if (this.f === 0 && this.t === 1) (this.f = 3) && (this.t = 0)
      else if (this.f === 0 && this.t === 2) (this.f = 4) && (this.t = 0)
      else if (this.f === 0 && this.t === 3) (this.f = 5) && (this.t = 0)
      else if (this.f === 0 && this.t === 4) (this.f = 6) && (this.t = 0)
      else if (this.f === 2) (this.t = 0) || (this.f = 0)
      else if (this.f === 3) {
        this.f = 0
        setTimeout(() => {
          this.t = 1
        })
      } else if (this.f === 4) {
        this.f = 0
        setTimeout(() => {
          this.t = 2
        })
      } else if (this.f === 5) {
        this.f = 0
        setTimeout(() => {
          this.t = 3
        })
      } else if (this.f === 6) {
        this.f = 0
        setTimeout(() => {
          this.t = 4
        })
      } else if (this.f === 7) {
        this.f = 0
        setTimeout(() => {
          this.t = 5
        })
      }
    },
    ok () {
      if (this.f === 1) this.transferNow()
      else this.transferNowBG()
    },
    getBalance () {
      this.$http.get(api.getBalance).then(({data}) => {
        if (data.success === 1) {
          store.actions.setUser({bgmoney: data.bgAmount || 0, tcgmoney: data.sportsAmount || 0, kymoney: data.kyAmount || 0, ptmoney: data.ptAmount || 0, agmoney: data.agAmount || 0, sbmoney: data.sbAmount || 0})
        }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: '特殊金额转换失败！'})
      })
    },
    transferNow () {
      if (this.f === '') return this.$message.warning({target: this.$el, message: '请选择转出账户！'})
      if (!this.ccm) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      // if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.ccm > this.fm) return this.$message.warning({target: this.$el, message: '转出账户余额不足！'})
      this.$http.post(api.transAmount, {amount: this.m, securityPwd: this.cpwd}).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.m = ''
          this.$message.success({target: this.$el, message: data.msg || '金额转换成功！'})
          this.__setCall({fn: '__getUserFund', args: undefined})
        } else {
          this.$message.error({target: this.$el, message: data.msg || '金额转换失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '金额转换失败！'})
      })
    },
    transferNowBG () {
      if (this.f === '') return this.$message.warning({target: this.$el, message: '请选择转出账户！'})
      if (!this.cm) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      // if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.ccm > this.fm) return this.$message.warning({target: this.$el, message: '转出账户余额不足！'})
      this.btn = true
      let t = setTimeout(() => {
        if (this.btn) this.btn = false
      }, 10000)
      this.$message.success({target: this.$el, message: (['', '', 'BG', '体育', '棋牌', 'PT', 'AG'][Math.max(this.f, this.t + 2)] + '余额转帐已提交！')})
      this.$http.get(this.bgAPI, {amount: this.m, platid: Math.max(this.fi, this.ti)}).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.m = ''
          setTimeout(this.getBalance, 1000)
          this.__setCall({fn: '__getUserFund', args: undefined})
          // this.getBalance()
        } else {
          // this.$message.error({target: this.$el, message: data.msg || (['', '', 'BG', '体育'][Math.max(this.f, this.t + 2)] + '余额转换失败！')})
        }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: (['', '', 'BG', '体育'][Math.max(this.f, this.t + 2)] + '余额转换失败！')})
      }).finally(() => {
        this.btn = false
        clearTimeout(t)
        t = 0
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .scroll-content
    // top .3rem
    padding 0 PW PW PW
    .s
      text-align center
      background-image: linear-gradient(0deg, #ffffff 0%, #ffffff 60%, #fffae5 100%)

    .c
      display inline-block
      width 1.2rem
      max-width 4rem
      padding 1.2rem  .2rem .3rem .2rem
      font-size .16rem
      vertical-align top
      .amount
        color BLUE
        font-size .2rem
        // font-family Roboto
        margin-top .2rem
        span
          font-size .14rem
      @media screen and (max-width: 2000px)
        width 1.5rem
      @media screen and (max-width: 1600px)
        width 1.3rem
      @media screen and (max-width: 1200px)
        width .8rem
        font-size .14rem
        .amount
          font-size .14rem
          
      
      &:nth-child(1)
        background url(../../assets/v2/td_icon_01.png) center .25rem no-repeat

      &:nth-child(2)
        background url(../../assets/v2/bz_icon_01.png) center .25rem no-repeat

      &:nth-child(3)
        background url(../../assets/v2/qb_icon_02.png) center .25rem no-repeat

      &:nth-child(4)
        background url(../../assets/v2/qb_icon_04.png) center .25rem no-repeat

      &:nth-child(5)
        background url(../../assets/v2/qb_icon_05.png) center .25rem no-repeat

      &:nth-child(6)
        background url(../../assets/v2/qb_icon_07.png) center .25rem no-repeat
      &:nth-child(7)
        background url(../../assets/v2/qb_icon_08.png) center .25rem no-repeat
      &:nth-child(8)
        background url(../../assets/v2/qb_icon_03.png) center .25rem no-repeat
    
    .cc
      max-width 3.1rem
      margin 0 auto
      padding .3rem
      text-align right
      .title
        font-size .24rem
        text-align center
        margin-bottom .3rem
      .item
        display block
        line-height .3rem
      p:not(.title)
        line-height .3rem
        position relative
        margin-bottom .1rem

      .switch-box
        position absolute
        left 100%
        top -.03rem
        width 1rem
        text-align left
      .switch
        display inline-block
        width .4rem
        height .4rem
        background url(../../assets/v2/qb_icon_01.png) center center no-repeat #f3f3f3
        border 1px solid rgba(0,0,0,0)
        cursor pointer
        margin-right .1rem
        &:hover
          border 1px solid BLUE

      .refresh
        display inline-block
        width .4rem
        height .4rem
        background url(../../assets/v2/refresh.png) center center no-repeat #f3f3f3
        border 1px solid rgba(0,0,0,0)
        cursor pointer
        &:hover
          border 1px solid BLUE




</style>

