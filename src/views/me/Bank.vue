<template lang="jade">
  .me-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .width-draw-info.scroll-content
      
      .cashpwd-form.form(v-if="stepIndex === -1" style="padding-top: .4rem")
        p 资金密码： &nbsp;&nbsp;
          input.ds-input.large(v-model="cpwd" type="password" @keyup.enter="!me.safeCheck && checkNow()" maxLength="20")

        p(v-if=" me.safeCheck && me.safeCheck !== 3" style="margin-top: .2rem") 安全验证码：
            input.ds-input.large(v-model="safeCheckCode" @keyup.enter="checkNow")
            button.ds-button.secondary.outline(style="margin-left: .1rem;" @click="me.safeCheck === 1 ? sendSms() :  sendMail()"  v-bind:class="{ disabled: me.safeCheck === 1 ? pt_: et_ }" v-bind:disabled="(me.safeCheck === 1 ? pt_ : et_) > 0") 
              span(v-if="!(me.safeCheck === 1 ? pt_ : et_ )") 发送验证码
              span.text-black(v-if="(me.safeCheck === 1 ? pt_ : et_  )") {{ (me.safeCheck === 1 ? pt_ : et_ ) }} 
                span.text-999 秒后可重新发送
        p(v-if="me.safeCheck === 3 " style="margin-top: .2rem") 信游安全码：
            input.ds-input.large(v-model="safeCheckCode" @keyup.enter="checkNow")



        .buttons(style="margin-left: .85rem; padding: .2rem 0")
          .ds-button.primary.large(@click="checkNow") 确认

      .bank-form(v-if="stepIndex === 0")
        .notice(style="margin-top: .2rem")
          span.title 温馨提示：
          p.content
            | 每个游戏账户最多绑定 
            span.text-danger 5
            |  张银行卡，您已成功绑定 
            span.text-danger {{ myBanks.length }}
            |  张。
            br
            span.text-danger 银行卡锁定后，不能增加新的银行卡，同时也不能解绑已绑定的银行卡！
            br
            | 新绑定的提款银行卡需要绑定时间超过 
            span.text-danger 6
            |  小时才能正常提款

        .form
          .buttons(style="float: right; padding: .2rem 0")
            button.ds-button.primary.large(@click="(type = 'bind') &&  stepIndex++" v-bind:disabled="!!locked" v-bind:class="{ disabled: !!locked }") 增加银行卡
            button.ds-button.cancel.large(@click=" (type = 'lock') &&  stepIndex++" v-bind:disabled="!!locked || !myBanks[0]" v-bind:class="{ disabled: !!locked || !myBanks[0] }") {{ locked ? '已锁定' : '锁定全部银行卡' }}
        div( style="margin: .2rem")
          el-table.header-bold.margin(:data="myBanks" stripe)
            el-table-column(label="银行名称")
              template(scope="scope")
                .ds-icon-bank-card.static(v-bind:class=" [ scope.row.class ] " style="margin: 0")

            el-table-column(prop="cardNo" label="卡号")

            el-table-column(label="绑定时间")
              template(scope="scope")
                span {{ scope.row.addTime }}

            el-table-column(label="操作" min-width="60"  align="center")
              template(scope="scope")
                button.ds-button.text-button.blue(@click="unbindCard(scope.row)" v-bind:disabled="!!locked" v-bind:class="{ disabled: !!locked }") 解绑


      
      


      .bank-form(v-if="stepIndex === 1 && type === 'bind' ")
        
        .notice(style="margin-top: .2rem")
          span.title 温馨提示：
          p.content
            | 1. 银行卡绑定成功后，平台任何区域都
            span.text-danger  不会 
            | 出现您的完整银行帐号、开户姓名等信息。
            br
            | 2. 银行绑定成功后，相关信息将无法查看与修改，只能进行
            span.text-danger  解除绑定 
            | 操作，请仔细填写下表。
            br
            | 3. 每个游戏账户最多绑定
            span.text-danger  5 
            | 张银行卡，您已成功绑定
            span.text-danger {{ myBanks.length }} 
            | 张。
            br
            | 4. 一个游戏账户只能绑定同一个开户人姓名的银行卡。


        p.title.text-black(style="padding: 0 .18rem 0 .4rem; margin: .2rem 0;") 您正在增加 
          span.text-blue {{ me.name }}
          |  帐号的银行卡
          span.ds-button.text-button.blue(style="float: right" @click="bi > 0 ? bi-- : stepIndex--") {{ '<返回上一页' }}
        StepTabs(type="text" v-bind:steps = "bs" v-bind:stepIndex="bi")
        
        hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: .2rem .4rem 0 .4rem")

        .form(style="margin: .2rem .4rem" v-if="bi === 0")
         
          p.item 开户银行：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            el-select.width1-5rem(v-model="bankIndex")
              el-option(v-for="(b, index) in avaibleBanks" v-bind:label="b.text" v-bind:value="index")

          p.item 开户银行省份：
            el-select.width1-5rem(v-model="provinceIndex")
              el-option(v-for="(p, index) in PROVINCES" v-bind:label="p.title" v-bind:value="index")
          
          p.item 开户银行城市：
            el-select.width1-5rem(v-model="cityIndex")
              el-option(v-for="(c, index) in province.subRegionList" v-bind:label="c.title" v-bind:value="index")
          
          p.item 支行名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input.large(v-model="branchName")
            span(style="font-size: .12rem")  （由3至20个汉字组成，不能使用数字、字符）

          p.item 开户人姓名：&nbsp;&nbsp;&nbsp;
            input.ds-input.large(v-model="name")
            span(style="font-size: .12rem")  （由2至8个汉字组成，不能使用数字、字符）

          p.item 银行帐号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input.large(v-model="cardNo")
            span(style="font-size: .12rem")  （银行帐号由16位、18位或19位数字组成）

          p.item 确认银行帐号：
            input.ds-input.large(v-model="cardNoAgain" @paste="noPaste")
            span(style="font-size: .12rem")  （银行帐号只能手动输入，不能粘贴）

          .buttons(style="margin-left: 1rem; padding-top: .05rem")
            .ds-button.primary.large(@click="checkbindBankCard") 添加


        .form(style="margin: .2rem .4rem" v-if="bi === 1")

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



      .bank-form(v-if="stepIndex === 1 && type === 'unbind' ")
        p.title.text-black(style="margin: .2rem  .2rem .2rem .4rem") 您正在解绑 
          span.text-blue {{ me.name }} 
          | 的银行卡
          span.ds-button.text-button.blue(style="float: right" @click="(i = 0) || stepIndex-- ") {{ '<返回上一页' }}
        StepTabs(type="text" v-bind:steps = "s" v-bind:stepIndex="i")
        
        hr(style="height: 0; border: 0; border-top: 1px solid #ccc; margin: .2rem .4rem 0 .4rem")

        .form(style="margin: .2rem .4rem" v-if="i === 0")
          .item(style="line-height: .5rem") 已绑定的银行卡：
            p.banks.text-black
              span.ds-icon-bank-card.static(v-bind:class=" [ ubank.class ] ")
              | {{ ubank.cardNo }}
          
          p.item 银行帐号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input.large(v-model="cardNo")
            span(style="font-size: .12rem")  （请输入对应绑定卡的银行卡号）
          
          p.item 开户人姓名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input.large(v-model="name")
            span(style="font-size: .12rem")  （请输入对应绑定卡的开户名）

          .buttons(style="margin-left: 1.15rem; padding-top: .05rem")
            .ds-button.primary.large(@click="unbindBankCardCheck") 下一步

        .form(style="margin: .2rem" v-if="i === 1")
          .item(style="line-height: .5rem") 开户银行：
            p.banks.text-black
              span.ds-icon-bank-card.static(v-bind:class=" [ ubank.class ] ")
          
          p.item 银行帐号：&nbsp;{{ ubank.cardNo }}
          p.item(style="margin: .2rem 0") 绑定时间：&nbsp;{{ ubank.addTime }}
          p.item 资金密码：&nbsp;
            input.ds-input.large(v-model="cpwd" type="password")
        
          .buttons(style="margin-left: 0.75rem; padding-top: .05rem")
            .ds-button.primary.large(@click="checkSecurityPwd") 解绑


      .bank-form(v-if="stepIndex === 1 && type === 'lock' ")
        .notice(style="margin-top: .2rem")
          span.title 温馨提示：
          p.content
            | 1. 
            span.text-danger 银行卡锁定后，不能增加新的银行卡，同时也不能解绑已绑定的银行卡；
            br
            | 2. 银行卡锁定，可以一定程度增强您的账户安全。
            br
            | 例：账户被他人盗用后，由于此功能的限制，您账户的资金不会被他人提现。
            br
            | 与此同时，客服不提供账户银行卡解除锁定功能，所以：
            span.text-danger 锁定前请自行斟酌。



        p.title.text-black(style="margin: .2rem  .2rem .2rem .4rem") 您正在锁定 
          span.text-blue {{ me.name }}
          |   帐号的银行卡
          span.ds-button.text-button.blue(style="float: right" @click="stepIndex--") {{ '<返回上一页' }}

        hr(style="height: 0; border: 0; border-top: 1px solid #ccc; margin: .2rem .4rem 0 .4rem")

        .form(style="margin: .2rem .4rem" v-if="i === 0")

          .item(style="line-height: .5rem") 银行卡：&nbsp;&nbsp;&nbsp;
            div.banks.text-black(style="display: inline-block")
              div(v-for=" bank in myBanks ")
                .ds-icon-bank-card.static(v-bind:class=" [ bank.class ] ") 
                span.text-black  {{ bank.cardNo}}
          
          
          p.item 资金密码： 
            input.ds-input.large(v-model="cpwd" type="password")

          .buttons(style="margin-left: .75rem; padding-top: .05rem")
            .ds-button.primary.large(@click="checkSecurityPwd") 立即锁定


</template>

<script>
import StepTabs from 'components/StepTabs'
import { BANKS } from '../../util/static'
import api from '../../http/api'
// import store from '../../store'
// import xhr from 'components/xhr'
import Validate from '../../util/Validate'
// import { dateTimeFormat } from '../../util/Date'
export default {
  // mixins: [xhr],
  data () {
    return {
      // me: store.state.user,
      me: {safeCheck: 0},
      avaibleBanks: [],
      cpwd: '',
      // BANKS: BANKS,
      myBanks: [],
      PROVINCES: [],
      // 开户银行：
      // 开户银行省份：
      provinceIndex: 0,
      // 开户银行城市：
      cityIndex: '',
      // 开户人姓名：
      name: '',
      // 卡号
      cardNo: '',
      // 分行
      branchName: '',
      locked: false,
      type: 'bind',
      stepIndex: -1,
      s: ['01 资料验证', '02 安全验证', '03 完成'],
      i: 0,

      bs: ['01 添加新银行卡信息', '02 核对信息', '03 完成'],
      bi: 0,
      // checkSafeCodeUrl: ['', api.checkMailVerifyCode, api.checkSmsVerifyCode, api.checkGoogleAuth]
      checkSafeCodeUrl: ['', api.person_checkSmsVerifyCode, api.person_checkMailVerifyCode, api.checkGoogleAuth],
      bankIndex: '',
      // unbind bank
      ubank: null
    }
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
    stepIndex () {
      if (this.stepIndex === 0) {
        this.clearBankCard()
      }
    }
  },
  computed: {
    bank () {
      return this.avaibleBanks[this.bankIndex]
    },
    province () {
      return this.PROVINCES[this.provinceIndex]
    },
    city () {
      return this.province.subRegionList[this.cityIndex]
    },
    // BANKS () {
    //   return BANKS.filter(b => {
    //     return this.avaibleBanks.find(ab => ab.apiName === b.apiName)
    //   })
    // },
    textMoney () {
      return this.money
    }
  },
  mounted () {
    // this.myBanks = [
    //   {id: 1, class: 'zggsh', cardNo: 112132484244, bindTime: '1990-02-02 12:56:05', text: '中国工商银行'},
    //   {id: 1, class: 'zggsh', cardNo: 112132484244, bindTime: '1990-02-02 12:56:05', text: '中国工商银行'}
    // ]
    // this.getBankList(this.getUserBankCards)
    // this.getProvices()
  },
  methods: {
    sendSms () {
      this.$http.post(api.person_sendSms, {}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 手机验证码发送成功，请注意查收。'})
          this.pt_ = this.time_
        } else {
          this.$message.error({target: this.$el, message: data.msg || '手机验证码发送失败！'})
        }
      }).catch(rep => {
      })
    },
    sendMail () {
      this.$http.post(api.person_sendMail, {}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '恭喜您， 邮箱验证码发送成功，请注意查收。'})
          this.et_ = this.time_
        } else {
          this.$message.error({target: this.$el, message: data.msg || '邮箱验证码发送失败！'})
        }
      }).catch(rep => {
      })
    },
    checkNow () {
      if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.me.safeCheck && !this.safeCheckCode) return this.$message.warning({target: this.$el, message: '请输入安全验证码！'})
      this.checkSecurityPwd()
    },
    checkSafeCode () {
      this.$http.post(this.checkSafeCodeUrl[this.me.safeCheck], {verifyCode: this.safeCheckCode}).then(({data}) => {
        if (data.success === 1) {
          this.stepIndex++
          this.$message.success({target: this.$el, message: data.msg || '安全码验证成功！'})
          this.__setCall({fn: '__getUserFund'})
          this.getUserBankCards()
        } else {
          this.$message.error({target: this.$el, message: data.msg || '安全码错误！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '安全验证失败！'})
      })
    },
    noPaste (evt) {
      evt.preventDefault()
      this.$modal.warn({
        content: '为了您的安全，请重新手动输入您的卡号以确保无误。',
        target: this.$el,
        btn: ['好的']
      })
    },
    unbindCard (row) {
      this.$modal.warn({
        content: '该银行卡解绑后，不能再绑定到其它帐号上！',
        target: this.$el,
        btn: ['确定', '我再想想'],
        ok () {
          this.type = 'unbind'
          this.stepIndex++
          this.ubank = row
        },
        O: this
      })
    },
    // unbindNow () {
    //   this.__loading({
    //     text: '解绑中...',
    //     target: this.$el
    //   }, 10000)
    //   setTimeout(() => {
    //     this.$modal.success({
    //       target: this.$el,
    //       content: '恭喜您，解绑成功！',
    //       close () {
    //         this.stepIndex = -1
    //         this.i = 0
    //       },
    //       O: this
    //     })
    //   }, 10000)
    // },
    lockNow () {
      let modal = this.$modal.warn({
        content: '银行卡锁定后，将无法再增加、删除银行卡！',
        target: this.$el,
        btn: ['立即锁定', '我再想想'],
        ok () {
          this.lockBankCard(modal)
          return false
        },
        O: this
      })
    },
    getUserBankCards () {
      this.$http.get(api.getUserBankCards).then(({data}) => {
        if (data.success === 1) {
          this.locked = data.lockCard
          this.myBanks = data.userBankCards
          this.myBanks.forEach(c => {
            c.addTime = c.addTime
            c.cardNo = '*****' + c.cardNo.slice(-4)
            c.class = BANKS.find(b => b.apiName === c.apiName)['class']
          })
          // if (this.locked) {
          //   this.$modal.warn({
          //     content: '您的银行卡已经被锁定，请联系客服!',
          //     target: this.$el,
          //     btn: [],
          //     O: this
          //   })
          // }
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
        } else {
          this.$message.error({target: this.$el, message: data.msg || '省份及城市信息获取失败！'})
        }
      }).catch(rpe => {
      })
    },
    checkbindBankCard () {
      if (!this.bank.apiName || !this.province.id || !this.city.id) return this.$message.error({target: this.$el, message: '请选择相应的银行、省份及城市！'})
      if (this.branchName.length > 20 || this.branchName.length < 3 || !Validate.chinese(this.branchName)) return this.$message.error({target: this.$el, message: '请您输入正确的支行名！'})
      if (!Validate.chineseName(this.name)) return this.$message.error({target: this.$el, message: '请输入正确的开户人姓名！'})
      if (!Validate.bankcard(this.cardNo)) return this.$message.error({target: this.$el, message: '请输入正确的银行卡号！'})
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
            btn: ['确定'],
            close () {
              this.stepIndex = -1
              this.bi = 0
              this.i = 0
            },
            O: this
          })
          this.bi++
          this.getUserBankCards()
          this.clearBankCard()
        } else {
          this.$message.error({target: this.$el, message: data.msg || '银行卡绑定失败！'})
        }
      }).catch(({data}) => {
        this.$message.error({target: this.$el, message: data.msg || '银行卡绑定失败！'})
      })
    },
    clearBankCard () {
      this.ubank = {}
      this.province = {}
      this.city = {}
      this.branchName = ''
      this.name = ''
      this.cardNo = ''
      this.cardNoAgain = ''
      this.cpwd = ''
    },
    unbindBankCardCheck () {
      // block8/3 console.log(this.cardNo)
      if (!Validate.bankcard(this.cardNo)) return this.$message.error({target: this.$el, message: '请输入正确的银行卡号！'})
      if (!Validate.chineseName(this.name)) return this.$message.error({target: this.$el, message: '请输入正确的开户人姓名！'})
      this.$http.post(api.unbindBankCardCheck, {realName: this.name, cardNo: this.cardNo, entry: this.ubank.entry}).then(({data}) => {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: '基本信息校验成功！'})
          this.i++
        } else {
          this.$message.error({target: this.$el, message: data.msg || '基本信息校验失败！'})
        }
      }).catch(({data}) => {
        this.$message.error({target: this.$el, message: data.msg || '基本信息校验失败！'})
      })
    },
    unbindBankCard () {
      let loading = this.$loading({
        text: '解绑中...',
        target: this.$el
      }, 10000)
      this.$http.post(api.unbindBankCard, {cardId: this.ubank.entry, secuityPwd: this.cpwd}).then(({data}) => {
        if (data.success === 1) {
          loading && loading.close()
          this.$modal.success({
            target: this.$el,
            content: '恭喜您，解绑成功！',
            close () {
              this.stepIndex = -1
              this.bi = 0
              this.i = 0
            },
            O: this
          })
          this.getUserBankCards()
          this.clearBankCard()
          this.cpwd = ''
        } else {
          this.$message.error({target: this.$el, message: data.msg || '银行卡解绑失败！'})
        }
      }).catch(({data}) => {
        this.$message.error({target: this.$el, message: data.msg || '银行卡解绑失败！'})
      }).finally(rep => {
        setTimeout(() => {
          loading && loading.close()
        }, 1000)
      })
    },
    checkSecurityPwd (type) {
      this.$http.post(api.checkSecurityPwd, {password: this.cpwd}).then(({data}) => {
        if (data.success === 1) {
          if (this.stepIndex === -1) {
            this.getBankList(this.getUserBankCards)
            this.getProvices()
            // if (this.me.safeCheck) {
              // return this.checkSafeCode()
            // } else this.stepIndex++
            this.stepIndex++
          } else {
            if (this.type === 'unbind') this.unbindBankCard()
            else if (this.type === 'lock') this.lockNow()
          }
        } else {
          this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
        }
      })
    },
    lockBankCard (modal) {
      this.$http.get(api.lockBankCard).then(({data}) => {
        if (data.success === 1) {
          this.cpwd = ''
          this.stepIndex = 0
          modal.type = 'success'
          modal.btn = []
          modal.content = '恭喜您，锁定成功！'
          modal.ok = null
          this.locked = true
        } else {
          this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '资金密码验证失败！'})
      })
    }
    // 获取银行列表
    // // http://192.168.169.44:9901/cagamesclient/person/bankcard.do?method=getBankList
    // getBankList: api + 'person/bankcard.do?method=getBankList',
    // // 我的银行
    // // http://192.168.169.44:9901/cagamesclient/person/bankcard.do?method=getUserBankCards
    // getUserBankCards: api + 'person/bankcard.do?method=getUserBankCards',
    // // 绑定银行
    // // http://192.168.169.44:9901/cagamesclient/person/bankcard.do?method=bindBankCard&provinceId=11&cityId=535&branch=新街口&realName=张三&cardNo=62123456789012345&aliasName=abc&bankId=1
    // bindBankCard: api + 'person/bankcard.do?method=bindBankCard&provinceId=11&cityId=535&branch=新街口&realName=张三&cardNo=62123456789012345&aliasName=abc&bankId=1',
    // // 解绑银行
    // // http://192.168.169.44:9901/cagamesclient/person/bankcard.do?method=unbindBankCard&cardId=2
    // unbindBankCard: api + 'person/bankcard.do?method=unbindBankCard& =2',
    // // 锁定银行
    // // http://192.168.169.44:9901/cagamesclient/person/bankcard.do?method=lockBankCard
    // lockBankCard: api + 'person/bankcard.do?method=lockBankCard',
  },
  components: {
    StepTabs
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  
  table-row-heigh(.4rem)
    
  .scroll-content
    top TH
  .width-draw-info
    .cashpwd-form
      padding-top .1rem
  
  .notice
    font-size .12rem
    line-height .22rem
    margin 0 .2rem
    padding PWX
    background-color #fffde8
    border 1px solid #d5d09b
    radius()
    .content
      display inline-block
      margin 0
      line-height .25rem
      vertical-align top
  .form
    margin 0 .4rem
    .amount
      font-family Roboto
      font-size 0.5rem
  .item
    margin .1rem 0
  .banks
    display inline-block
    margin 0
    max-width 90%
    vertical-align top
  .ds-radio-label
    padding 0 .1rem
  // .ds-icon-bank-card
  //   width 167px
  //   height 40px
  //   margin .05rem 
  //   radius()
  //   display inline-block

  //   vertical-align middle
  .buttons
    .ds-button:not(:first-child)
      margin-left .1rem
</style>
