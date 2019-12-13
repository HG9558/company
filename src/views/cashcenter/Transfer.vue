<template lang="jade">
  .my-wallet-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.bg-w.transfer(v-show="tabIdx === 0")
      .info
        i.ds-icon-me-avatar
        p.txt-c.mt15 主账户
        p.txt-c.fc-oriange.ft24.mt15.amount {{ numberWithCommas(ME.amoney) }}
          i.ft12.yuan 元
        .cc
          p.title.text-black 账户互转
          label.item 转出账户
            el-select(v-model="ToutKey" @change="changeTouKey" style="width: 2.5rem" placeholder="无" )
              //- el-option(label="主账户" value="amoney")
              el-option(v-for="v in ToutList" v-bind:label="v.n+'账户' " v-bind:value="v.key")
          p 可用余额：
            span.text-blue {{ numberWithCommas(ME[ToutKey]) }}
            | 元
            span.switch-box
              span.switch(v-if="showSwap" @click=" ClickSwap ")

          label.item 转入账户
            el-select(v-model="TinKey" style="width: 2.5rem" placeholder="无")
              el-option(v-for="v in TinList" v-bind:label="v.n+'账户' " v-bind:value="v.key")

          p 可用余额：
            span.text-blue {{ numberWithCommas(ME[TinKey]) }}
            | 元

          label.item 交易金额
            input.ds-input(v-model="m" style="width: 2.5rem" maxlength="12")

          p &nbsp;&nbsp;
            span {{ cm }}

          .quick-amounts
            button.ml10.c_b.ds-button.btn-amout(@click="quickAmountHandler(amount)" v-for="(amount, i) in quickAmounts") {{amount}}



          .buttons(style="margin-left: .6rem; margin-top: .2rem")
            button.ds-button.danger(style="float: left" @click="refund") 一键转回
            button.ds-button.primary(style="" @click="ok" v-bind:disabled="btn" v-bind:class="{ cancel: btn }") 确认

      .wallet-ls

        .s(style="padding: PWX 0")
          .classifys(v-for="v in Tdata.classifyMap")
            .classifyTit.c(
              v-if="Tdata.list.filter(x=>{return x.classifys.includes(v.classifyID)}).length"
            ) {{v.n}}
            div(
              v-if="Tdata.list.filter(x=>{return x.classifys.includes(v.classifyID)}).length"
              style="padding-left:1.5rem"
            )
              .c(v-for="r in Tdata.list.filter(x=>{return x.classifys.includes(v.classifyID)})")
                p.acc-shot-name(v-bind:class="r.classname")
                  span.txt-c {{ r.n }}
                br
                p(v-if="!r.alias") {{ r.n }}账户
                p(v-if="r.alias") {{ r.alias }}
                p.fz20.text-black.flex.flex-ai-c.flex-jt-c {{numberWithCommas(ME[r.key])}}
                  i.ft12.yuan 元
                  span.icon-refresh(v-on:click="refreshBalance(r)")
                .mt10.quick-btns
                  button.ds-button.btn-transfer(v-if="r.authority.includes(2)" @click="quickTransfer(r, 'o')") 转出
                  button.ml10.ds-button.btn-transfer(v-if="r.authority.includes(1)" @click="quickTransfer(r, 'i')") 转入
    TR.scroll-content(v-if=" tabIdx === 1 ")

</template>

<script>
import TR from '../myCashRecord/TR'
import { numberWithCommas, digitUppercase } from '../../util/Number'
import store from '../../store'
import api from '../../http/api'
import Tdata from './Transfer.data.js'
export default {
  data () {
    return {
      Tdata: Tdata, // 列表数据
      ToutKey: 'amoney', //当前转出账户  amoney 默认 主账户
      TinKey: Tdata.list.find(x => { return x.authority.includes(1) && x.key !== 'amoney' }).key, //当前转入账户 默认 第一个 非 主账户的可以转入的账户
      m: '', // 交易金额
      ME: store.state.user,
      numberWithCommas: numberWithCommas,
      digitUppercase: digitUppercase,
      cpwd: "",
      btn: false,
      quickAmounts: ["50", "100", "500", "全部"],
      tabIdx: 0
    };
  },
  computed: {
    //转出账户列表
    ToutList () {
      return this.Tdata.list.filter(x => { return x.authority.includes(2) })
    },
    //转入账户列表
    TinList () {
      if (this.ToutKey === 'amoney') {
        //-当转出账户 是 主账户时
        return this.Tdata.list.filter(x => { return x.authority.includes(1) && x.key !== 'amoney' })
      } else {
        //-当转出账户 非 主账户时
        return this.Tdata.list.filter(x => { return x.key === 'amoney' })
      }
    },
    // 显示隐藏 转入和转出账户互换
    // 同时拥有转入 转出 权限的 转出账户 即 显示
    showSwap () {
      return this.Tdata.list.filter(x => { return x.key === this.ToutKey && x.authority.includes(1) && x.authority.includes(2) }).length
    },
    // 转出账户余额
    fm () {
      return this.ME[this.ToutKey]
    },
    ccm () {
      return parseFloat(this.m.replace(/[^0-9.]/g, '') || 0)
    },
    cm () {
      return this.m === '' ? '' : digitUppercase(this.m.replace(/[^0-9.]/g, '') || 0)
    },
    // 转出 转入接口
    bgAPI () {
      return [api.withdrawFromBG, api.transferToBG][this.ToutKey === 'amoney' ? 1 : 0]
    },
    // 当前转账的 平台id
    platRow () {
      let name = this.ToutKey === 'amoney' ? this.TinKey : this.ToutKey
      return this.Tdata.list.find(x => { return x.key === name })
    }
  },
  watch: {
    // //转出 账户 改变时 转入账户初始化
    // ToutKey () {
    //   this.TinList.length && (this.TinKey = this.TinList[0].key);
    // },
    // 监听交易金额
    m () {
      this.m = this.m.trim()
      this.m = this.m.replace(/[^0-9,.]/g, '').replace(/[,.]{2,}/g, ',')
      let [l, r, t] = this.m.split('.')
      if (r) this.m = l + '.' + r.slice(0, 3)
      if ((r && r.split(/[,]/)[1]) || t) this.m = l + '.' + r.split(/[.,]/)[0].slice(0, 3)
    }
  },
  mounted () {
    this.getBalances();
    this.getRecentlyPlat();
  },
  methods: {
    //选择转出账户事件
    changeTouKey () {
      this.TinList.length && (this.TinKey = this.TinList[0].key);
    },
    // 常用账户
    getRecentlyPlat () {
      this.$http.get(api.getRecentlyPlat).then(({data: {success, msg, platList}}) => {
        if (success === 1) {
          this.Tdata.list.forEach(v => {
            if (platList.includes(v.id)) {
              // { n: '常用账户', classifyID: 99 },
              v.classifys.push(99); //追加分类
            }
          });
        }
      })
    },
    // 一件取回
    refund () {
      this.$http.get(api.withdrawAll).then(({data: {success, msg}}) => {
        if (success === 1) {
          this.$message.success({target: this.$el, message: msg || '一键转回成功'})
          setTimeout(() => {
            this.getBalanceById(this.platRow.id, this.platRow.key)
            // this.getBalance([this.a[Math.max(this.f, this.t + 2) - 2]])
          }, 1000)
          this.__setCall({fn: '__getUserFund', args: undefined})
        } else {
          this.$message.error({target: this.$el, message: msg || '一键转回失败'})
        }
      })
    },
    transferNowBG () {
      if (this.ToutKey === '') return this.$message.warning({target: this.$el, message: '请选择转出账户！'})
      if (!this.cm) return this.$message.warning({target: this.$el, message: '请输入转换金额！'})
      // if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.ccm > this.fm) return this.$message.warning({target: this.$el, message: '转出账户余额不足！'})
      this.btn = true
      let t = setTimeout(() => {
        if (this.btn) this.btn = false
      }, 10000)
      this.$message.success({
        target: this.$el,
        message: "转账已提交！"
      });
      this.$http.get(this.bgAPI, {'amount': this.m, 'platid': this.platRow.id}).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.m = ''
          setTimeout(() => {
            this.getBalanceById(this.platRow.id, this.platRow.key)
            // this.getBalance([this.a[Math.max(this.f, this.t + 2) - 2]])
          }, 1000)
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
    },
    transferNow () {
      if (this.ToutKey === '') return this.$message.warning({target: this.$el, message: '请选择转出账户！'})
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
    ok () {
      //特殊账户转出
      if (this.ToutKey === 'smoney') this.transferNow()
      //三方账户 转入 转出
      else this.transferNowBG()
    },
    //刷新余额
    refreshBalance (row) {
      if (row.key === 'smoney') { // 特殊账户
        this.__setCall({fn: '__getUserFund', args: undefined})
      } else {
        this.getBalanceById(row.id, row.key)
      }
    },
    getBalanceById (platId, name) {
      this.$http.get(api.getBalanceByPID, {platId}).then(({data: {bal, success}}) => {
        if (success) {
          let b = {}
          b[name] = Number(bal)
          store.actions.setUser(b)
        }
      })
    },
    // 点击转入传出
    quickTransfer (row, type) {
      if (type === 'i') {
        this.ToutKey = 'amoney';//设置为 主账户
        setTimeout(() => {
          this.TinKey = row.key;
        }, 50)
        return
      }
      if (type === 'o') {
        this.ToutKey = row.key;
      }
    },
    // 点击 转入和转出账户互换
    ClickSwap () {
      // this.ToutKey = this.TinKey;
      if (this.ToutKey === 'amoney') { // amoney 主账户
        this.ToutKey = this.TinKey;
      } else {
        let r = this.ToutKey;
        this.ToutKey = 'amoney';
        setTimeout(() => {
          this.TinKey = r;
        }, 50)
      }
    },
    getBalances () {
      this.$http.myget(api.getBalance).then(({data}) => {
        if (data.success === 1) {
          store.actions.setUser(data);
        }
      }).catch(rep => {
        // this.$message.error({target: this.$el, message: '特殊金额转换失败！'})
      })
    },
    __setTransferI (i) {
      this.tabIdx = i
    },
    // 快速输入金额
    quickAmountHandler (amount) {
      if (!amount) return
      this.m = amount === '全部' ? String(this.fm) : amount
    }
  },
  components: {
    TR
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .scroll-content
    // top .3rem
    padding 0 PW PW PW
    .fz22
      font-size 0.22rem
    .fz20
      font-size 0.20rem
    i
      font-style normal
    .yuan
      color #999999
      margin-left 0.02rem
    .fc-oriange
      color #f37e0c
    .info
      width 5.30rem
      float left
      position relative
      &::after
        content ''
        display block
        height 7.5rem
        border-right solid 1px #f0f0f0
        position absolute
        right 0
        top .7rem
        clear both
    .ds-icon-me-avatar
      display block
      height 1.1rem
      margin .3rem 0 .1rem 0
    .btn-amout
      width 0.54rem
      height 0.3rem
      border-radius 0.03rem
      border solid 1px #e2daa9
      color #666
      padding inherit
      text-shadow none
      background-image linear-gradient(0deg, #fff8d0 0%, #fffbe1 100%), linear-gradient(#f37e0c, #f37e0c)
      background-blend-mode normal, normal
    .buttons
      .danger
        width 1.2rem
        background-color #444444
      .danger:hover
        background-color #666666
    .icon-refresh
      display inline-block
      width .24rem
      height .24rem
      background url(../../assets/v2/icon_refresh.png) center center no-repeat #f3f3f3
      border 1px solid rgba(0,0,0,0)
      cursor pointer
      margin-left 0.04rem
      &:hover
        border 1px solid BLUE
    .primary
      width 1.2rem
    .wallet-ls
      padding-left 5rem
      // width 10.34rem
      // float left
      .s
        padding 0 0 0 0.5rem
        .c
          // float left
          text-align center
    .btn-transfer
      width 0.7rem
      background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%), linear-gradient(#dbdbdb, #dbdbdb)
      background-blend-mode normal, normal
      border-style solid
      border-width 1px
      border-image-source linear-gradient(0deg, #dadada 0%, #e8e8e8 100%)
      border-image-slice 1
      color #666
      padding inherit
      text-shadow none
    .acc-shot-name
      width 1rem
      margin 0 auto
      background-size 100% 100%
      height 0.65rem
      overflow hidden
      span
        width 0.7rem
        line-height 0.42rem
        display block
        margin 0.2rem 0 0 0.06rem
    .s
      // text-align center
      // background-image: linear-gradient(0deg, #ffffff 0%, #ffffff 60%, #fffae5 100%)
     accountBg($img, $color)
      background url('../../assets/v2/'$img) center no-repeat
      color $color
    .acc-bg-red
      accountBg('icon_account_bg_red.png', #f1574f)
    .acc-bg-oriange
      accountBg('icon_account_bg_orange.png', #f38d0e)
    .acc-bg-green
      accountBg('icon_account_bg_green.png', #29ab91)
    .acc-bg-blue
      accountBg('icon_account_bg_blue.png', #1691ee)
    .c
      display inline-block
      width 1.6rem
      max-width 4rem
      // padding 1.2rem  .2rem .3rem .2rem
      padding 0.1rem 0rem
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
        width 1.9rem
      @media screen and (max-width: 1600px)
        width 1.3rem
      @media screen and (max-width: 1200px)
        width .8rem
        font-size .14rem
        .amount
          font-size .14rem


      // &:nth-child(1)
      //   background url(../../assets/v2/td_icon_01.png) center .25rem no-repeat

      // &:nth-child(2)
      //   background url(../../assets/v2/bz_icon_01.png) center .25rem no-repeat

      // &:nth-child(3)
      //   background url(../../assets/v2/qb_icon_02.png) center .25rem no-repeat

      // &:nth-child(4)
      //   background url(../../assets/v2/qb_icon_11.png) center .25rem no-repeat

      // &:nth-child(5)
      //   background url(../../assets/v2/qb_icon_05.png) center .25rem no-repeat

      // &:nth-child(6)
      //   background url(../../assets/v2/qb_icon_07.png) center .25rem no-repeat
      // &:nth-child(7)
      //   background url(../../assets/v2/qb_icon_08.png) center .25rem no-repeat
      // &:nth-child(8)
      //   background url(../../assets/v2/qb_icon_09.png) center .25rem no-repeat

      // &:nth-child(15)
      //   background url(../../assets/v2/qb_icon_03.png) center .25rem no-repeat

      // &:nth-child(9)
      //   background url(../../assets/v2/qb_icon_12.png) center .25rem no-repeat

      // &:nth-child(10)
      //   background url(../../assets/v2/qb_icon_13.png) center .25rem no-repeat

      // &:nth-child(11)
      //   background url(../../assets/v2/qb_icon_14.png) center .25rem no-repeat
      // &:nth-child(12)
      //   background url(../../assets/v2/qb_icon_15.png) center .25rem no-repeat
      // &:nth-child(13)
      //   background url(../../assets/v2/qb_icon_16.png) center .25rem no-repeat
      // &:nth-child(14)
      //   background url(../../assets/v2/qb_icon_17.png) center .25rem no-repeat
      // &:nth-child(15)
      //   background url(../../assets/v2/qb_icon_18.png) center .25rem no-repeat
      // &:nth-child(16)
      //   background url(../../assets/v2/qb_icon_03.png) center .25rem no-repeat

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


  // .my-wallet-page
  //   .scroll-content
  //     min-width 16rem
</style>
<style lang="stylus">
.transfer
  .classifys
    border-bottom dashed 1px #ccc
    .classifyTit
      line-height 1.7rem
      position relative
      text-align left !important
      text-indent 0.6rem
      box-sizing border-box
      float left
      width 1.5rem
      &:before
        content ''
        position absolute
        left 0.4rem
        top 0.866rem
        width 12px
        height 12px
        border solid 2px #ff8713
        border-radius 50%
</style>