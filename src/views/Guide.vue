<template lang="jade">
  section.guide(:class="[ 'step-' + step ]")
    .modal(ref="modal")

      .mask
      .mask-extra
        .menu
        .menu(style="left: 1.44rem; width: 100rem; position: absolute")
        .menu(style="left: 0; top: 0; width: 100rem; position: absolute")
        
      .box-wrapper
        .action1(ref="gameNow")
        .box
          .teacher
            .voice
          .guide-wrap
            h1(@click="step++") {{ titles[step] }}
            span.ds-button.text-button.blue(v-if="bi > 0" style="float: right; position: absolute; top: .4rem; right: .2rem" @click="bi > 0 && bi--") {{ '<返回上一页' }}

            StepTabs.text-small(type="text" v-bind:steps = "bs" v-bind:stepIndex="bi" v-if="step === 3" style="text-align: left")

            .form(v-if="step === 0")
              p.item 设置昵称：
                input.ds-input.large(v-model="nickname")
                span.notice 由2至8个字符组成，可中文，数字不能超过4个
                  br
                  | 不能含有QQ字样
               

              .buttons
                .ds-button.primary.large(@click="changNickName") 提交
            
            .form(v-if="step === 1")

              p.item 设置密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(type="password" v-model="newPwd" )
                span.notice 由字母和数字组成6-20个字符;
                  br
                  | 必须包含数字和字母，不允许连续三位相同

              p.item 确认新密码：
                input.ds-input.large(type="password" v-model="newPwdAgain")


              .buttons
                .ds-button.primary.large(@click="changePwd") 提交
                .ds-button.cancel.large(@click="clearPwd") 清空

            .form(v-if="step === 2")

              p.item 设置密码：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(type="password" v-model="newCashPwd" )
                span.notice 由字母和数字组成6-20个字符;
                  br
                  | 必须包含数字和字母，不允许连续三位相同

              p.item 确认新密码：
                input.ds-input.large(type="password" v-model="newCashPwdAgain")


              .buttons
                .ds-button.primary.large(@click="changeCashPwd") 提交
                .ds-button.cancel.large(@click="clearPwd") 清空

            .form(v-if="step === 3 && bi === 0")
              p.item 开户银行：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                el-select.width1-5rem(v-model="bank")
                  el-option(v-for="(b, index) in avaibleBanks" v-bind:label="b.text" v-bind:value="b")

              p.item 开户银行省份：
                el-select.width1-5rem(v-model="province")
                  el-option(v-for="(p, index) in PROVINCES" v-bind:label="p.title" v-bind:value="p")
              
              p.item 开户银行城市：
                el-select.width1-5rem(v-model="city")
                  el-option(v-for="(c, index) in province.subRegionList" v-bind:label="c.title" v-bind:value="c")
              
              p.item 支行名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="branchName")
                span(style="font-size: .12rem")  （由1至20个字符或汉字组成，不能使用特殊字符）

              p.item 开户人姓名：&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="name")
                span(style="font-size: .12rem")  （由1至20个字符或汉字组成，不能使用特殊字符）

              p.item 银行帐号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="cardNo")
                span(style="font-size: .12rem")  （银行帐号由16位、18位或19位数字组成）

              p.item 确认银行帐号：
                input.ds-input.large(v-model="cardNoAgain")
                span(style="font-size: .12rem")  （银行帐号只能手动输入，不能粘贴）

              .buttons(style="margin-left: 1rem; padding-top: .05rem")
                .ds-button.primary.large(@click="checkbindBankCard") 添加
                .ds-button.cancel.large(@click="step++") 跳过

            .form(v-if="step === 3 && bi === 1")

              .item(style="line-height: .5rem") 开户银行：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                p.banks.text-black
                  span.ds-icon-bank-card.static(v-bind:class=" [ bank.class ] ")

              p.item 开户银行省份：{{ province.title }}
              p.item 开户银行城市：{{ city.title }}
              p.item 支行名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ branchName }}
              p.item 开户人姓名：&nbsp;&nbsp;&nbsp;{{ name }}
              p.item 银行帐号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-black {{ cardNo }}
             
              .buttons(style="margin-left: .95rem; padding-top: .05rem")
                .ds-button.primary.large(@click="bindBankCard") 立即绑定

</template>

<script>
import StepTabs from 'components/StepTabs'
import { BANKS } from '../util/static'
import api from '../http/api'
import store from '../store'
import Validate from '../util/Validate'
import { dateTimeFormat } from '../util/Date'
import util from '../util'
// import base from 'components/base'
// import store from '../store'
export default {
  // mixins: [base],
  components: {
    StepTabs
  },
  data () {
    return {
      // blank
      // blanks: Array(1000),
      step: 0,
      titles: ['第一步：设置昵称', '第二步：设置登录密码', '第三步：设置资金密码', '第四步：绑定银行卡'],
      // bstepIndex: 0,
      bs: ['01 添加新银行卡信息', '02 核对信息', '03 完成'],
      bi: 0,
      nickname: '',
      newPwd: '',
      newPwdAgain: '',
      newCashPwd: '',
      newCashPwdAgain: '',
      // xxx
      me: store.state.user,
      avaibleBanks: [],
      // BANKS: BANKS,
      myBanks: [],
      PROVINCES: [],
      // 开户银行：
      bank: {},
      // 开户银行省份：
      province: {},
      // 开户银行城市：
      city: {},
      // 开户人姓名：
      name: '',
      // 卡号
      cardNo: '',
      // 分行
      branchName: ''
    }
  },
  computed: {
    // BANKS () {
    //   return BANKS.filter(b => {
    //     return this.avaibleBanks.find(ab => ab.apiName === b.apiName)
    //   }).sort((a, b) => a.sortNum > b.sortNum)
    // }
  },
  watch: {
    cardNo () {
      this.cardNo = this.cardNo.trim()
    },
    cardNoAgain () {
      this.cardNoAgain = this.cardNoAgain.trim()
    },
    name () {
      this.name = this.name.trim()
    },
    branchName () {
      this.branchName = this.branchName.trim()
    },
    step () {
      if ((this.step === 0 && this.me.name) || (this.step === 1 && this.me.pwd) || (this.step === 2 && this.me.cashPwd) || (this.step === 3 && this.me.hasBankCard)) this.step++
      if (this.step === 4) this.getPos()
    }
  },
  mounted () {
    if ((this.step === 0 && this.me.name) || (this.step === 1 && this.me.pwd) || (this.step === 2 && this.me.cashPwd)) this.step++
    this.getBankList()
    this.getProvices()
    util.addEvent('resize', window, this.getPos)
    // this.getPos()
  },
  beforeDestroy () {
    util.removeEvent('resize', window, this.getPos)
  },
  methods: {
    getPos () {
      if (document.querySelector('footer .icon-button.ds-icon-game-middle').style.display !== 'none') {
        let H = document.querySelector('footer ').offsetHeight
        this.$refs.modal.style.bottom = H / 100 + 'rem'
      } else {
        // this.showGameNow = false
        if (this.step > 3) this.__closeGuide()
      }
    },
    __guideStep () {
      this.step = 5
    },
    __closeGuide () {
      store.actions.setUser({guide: false})
    },
    next () {
      this.step++
    },
    changNickName () {
      if (!Validate.nickName(this.nickname)) return this.$message.error({target: this.$el, message: '昵称由2至8个字符组成，可中文，数字不能超过4个，不能含有QQ字样！'})
      this.$http.post(api.changNickName, {nickName: this.nickname}).then(({data}) => {
        if (data.success === 1) {
          let message = '恭喜您， 昵称修改成功。'
          if (!this.me.name) message = '恭喜您， 昵称设置成功。'
          this.$message.success({target: this.$el, message: message})
          store.actions.setUser({name: this.nickname})
          this.step++
        } else {
          this.$message.error({target: this.$el, message: data.msg || '昵称修改或设置不成功！'})
        }
      }).catch(rep => {
      })
    },
    changePwd () {
      // 修改登录密码
      if (!this.newPwd) return this.$message.warning({target: this.$el, message: '请输入新密码！'})
      if (!Validate.pwd(this.newPwd)) return this.$message.error({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
      if (this.newPwdAgain !== this.newPwd) return this.$message.error({target: this.$el, message: '两次输入密码不一致！'})
      // changLoginPwd: api + 'person/accountSecur.do?method=changLoginPwd&password=123456&newPwd=000000',
      this.$http.post(api.changLoginPwd, {password: '123qwe', newPwd: this.newPwd, isFirst: 1}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 登录密码修改成功'})
          // this.$message.success({target: this.$el, message: '恭喜您， 登录密码修改成功，系统即将退出，请重新登录。'})
          // setTimeout(() => {
          //   this.__setCall({fn: '__logout'})
          // }, 3000)
          this.step++
        } else {
          this.$message.error({target: this.$el, message: data.msg || '旧密码错误！'})
          this.clearPwd()
        }
      }, (rep) => {
      })
    },
    clearPwd () {
      this.newPwd = ''
      this.newPwdAgain = ''
      this.newCashPwd = ''
      this.newCashPwdAgain = ''
    },
    changeCashPwd () {
      // 资金密码
      // 修改
      // 设置
      if (!this.newCashPwd) return this.$message.warning({target: this.$el, message: '请输入新密码！'})
      if (!Validate.pwd(this.newCashPwd)) return this.$message.error({target: this.$el, message: '您输入的密码不符合要求！1:由字母和数字组成6-20个字符;2:必须包含数字和字母，不允许连续三位相同！'})
      if (this.newCashPwdAgain !== this.newCashPwd) return this.$message.error({target: this.$el, message: '两次输入密码不一致！'})
      // changSecurePwd: api + 'person/accountSecur.do?method=changSecurePwd&password=123456&newPwd=000000',
      this.$http.post(api.changSecurePwd, {newPwd: this.newCashPwd}).then(({data}) => {
        if (data.success === 1) {
          let message = '恭喜您， 资金密码修改成功。'
          if (!this.me.cashPwd) message = '恭喜您， 资金密码设置成功。'
          this.$message.success({target: this.$el, message: message})
          if (!this.me.cashPwd) store.actions.setUser({cashPwd: true})
          this.step++
        } else {
          this.$message.error({target: this.$el, message: data.msg || '旧密码错误！'})
          this.clearPwd()
        }
      }, (rep) => {
      })
    },
    getUserBankCards () {
      this.$http.get(api.getUserBankCards).then(({data}) => {
        if (data.success === 1) {
          this.myBanks = data.userBankCards
          this.myBanks.forEach(c => {
            c.addtime = dateTimeFormat(c.addTime.time)
            c.cardNo = '*****' + c.cardNo.slice(-4)
            c.class = BANKS.find(b => b.apiName === c.apiName)['class']
          })
        }
      }).catch(rep => {
      })
    },
    getBankList (fn) {
      this.$http.get(api.getBankList).then(({data}) => {
        if (data.success === 1) {
          data.allBankData.forEach(b => {
            b.class = (BANKS.find(bb => {
              return b.apiName === bb.apiName
            }) || {}).class
            b.text = (BANKS.find(bb => {
              return b.apiName === bb.apiName
            }) || {}).text
            // (BANKS.find(bb => {
            //   return b.apiName === bb.apiName
            // }) || {}).sortNum = b.sortNum
          })
          this.avaibleBanks = data.allBankData
          fn()
        }
      }).catch(rpe => {
      })
    },
    getProvices () {
      this.$http.get(api.getProvices).then(({data}) => {
        if (data.success === 1) {
          this.PROVINCES = data.allProvinces
        }
      }).catch(rpe => {
      })
    },
    checkbindBankCard () {
      if (!this.bank.apiName || !this.province.id || !this.city.id) return this.$message.error({target: this.$el, message: '请选择相应的银行、省份及城市！'})
      if (this.branchName.length < 3 || !Validate.chinese(this.branchName)) return this.$message.error({target: this.$el, message: '请输入您的开户银行支行名！'})
      if (!Validate.chineseName(this.name)) return this.$message.error({target: this.$el, message: '请输入您的开户银行姓名！'})
      if (!Validate.bankcard(this.cardNo)) return this.$message.error({target: this.$el, message: '请输入您的银行卡号！'})
      if (this.cardNo !== this.cardNoAgain) return this.$message.error({target: this.$el, message: '两次输入卡号不一致！'})
      this.bi++
    },
    bindBankCard () {
      this.$http.post(api.bindBankCard, {realName: this.name, cardNo: this.cardNo, apiName: this.bank.apiName, provinceId: this.province.id, cityId: this.city.id, branch: this.branchName}).then(({data}) => {
        if (data.success === 1) {
          // this.$message.success({target: this.$el, message: '银行绑定成功！'})
          this.$modal.success({
            content: data.msg || '恭喜您，绑定成功！',
            target: this.$el,
            btn: ['继续绑定', '下一步'],
            ok () {
              this.bi = 0
            },
            cancel () {
              this.step++
              this.bi = 0
            },
            O: this
          })
          this.bi++
          this.clearBankCard()
        } else {
          this.$message.error({target: this.$el, message: data.msg || '银行绑定失败！'})
        }
      }).catch(({data}) => {
        this.$message.error({target: this.$el, message: data.msg || '银行绑定失败！'})
      })
    },
    clearBankCard () {
      this.bank = {}
      this.province = {}
      this.city = {}
      this.branchName = ''
      this.name = ''
      this.cardNo = ''
      this.cardNoAgain = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../../DSM/src/var.stylus'
  .item
    margin PW 0
  .box
    position relative
    margin-bottom 2rem
    .teacher
      position absolute
      width 3.35rem
      height 5.55rem
      background url($VASSETS/guide/teacher.png) left center no-repeat
      .voice
        position absolute
        left -1.7rem
        top -.7rem
        width 2.11rem
        height 2.05rem
        background url($VASSETS/guide/talk01.png) left center no-repeat
  
          
        
    .guide-wrap
      background-color #ededed
      radius(.3rem)
      shadow(.1rem .1rem .1rem rgba(0,0,0, .3))
      display inline-block
      padding-left 1.8rem
      margin-left 1.2rem
      margin-top .5rem
      min-height 4rem
      h1,
      .form
        margin .5rem
      h1
        font-size .3rem
        font-weight normal
        color #333
      .notice
          display inline-block
          vertical-align middle
          padding-left .1rem
          font-size .12rem
          color #999
  .buttons
    margin-left .7rem
    margin-top .2rem
  .banks
    display inline-block
    margin 0
    max-width 90%
    vertical-align top

  .step-1
  .step-2
    .buttons
      margin-left .9rem
  .step-3
    .guide-wrap
      margin-top .1rem
      h1
        margin-bottom .2rem
        margin-top .3rem
      .form
        margin-top .2rem
        margin-bottom .2rem
    
  .step-4
    .action1
      position absolute
      left 0
      bottom 0
      width 5rem
      height 5rem
      background url($VASSETS/guide/i1.png) .7rem 2.5rem no-repeat
      z-index -1
    .teacher .voice
      background url($VASSETS/guide/talk02.png) left center no-repeat
    .guide-wrap
      width 5rem
      opacity 0
    .modal
      bottom .68rem
      
  .step-5
    .guide-wrap
      width 5rem
      opacity 0
    .modal
      bottom .68rem
    .action1
      position absolute
      left 2%
      bottom 5.68rem
      width 5rem
      height 5rem
      background url($VASSETS/guide/i2.png) .7rem 2.5rem no-repeat
      z-index -1
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  s = .68rem
  .modal 
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    text-align center
    z-index 1000
    
    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .7
      background #000
      z-index 999
    .mask-extra
      text-align left
      position absolute
      left 0
      top "calc(100% + %s)" % s
      // top (100% + .7rem)
      .menu
        position relative
        top -.68rem
        opacity .7
        background #000
        height .68rem
        display inline-block
        &:first-child
          margin-right .65rem
          width .8rem
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 1000
      &:after
        content ''
        height 100%
        width 0
        vertical-align middle
        display inline-block
      .box
        position relative
        text-align left
        display inline-block
        vertical-align middle
        max-height initial
        overflow-y initial
      
</style>



