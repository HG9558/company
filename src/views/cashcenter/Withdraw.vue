<template lang="jade">
  .me-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .width-draw-info.scroll-content
      //- .tabs(style="text-align: center" v-if="stepIndex !== 0")
         .ds-button-group
           .ds-button.text-button.large(v-bind:class="{selected: tabIndex === 1}" @click="tabIndex = 1") 提现申请
           .ds-button.text-button.large(v-bind:class="{selected: tabIndex === 2}" @click="tabIndex = 2") 提现记录

      .cashpwd-form.form(v-if="tabIndex === 0 && stepIndex === 0" style="padding-top: .4rem")
        p 资金密码： &nbsp;&nbsp;
          input.ds-input.large(v-model="cpwd" type="password" @keyup.enter="checkNow" maxLength="20")
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
      

      .bank-form(v-if="tabIndex === 0 && stepIndex === 1")
        //- .notice
          span.title 温馨提示：
          p.content
            | 每天可成功提款 
            span.text-danger {{ maxTimes }}
            |  次，今天您已经发起了 
            span.text-danger {{ times }}
            |  次提现申请。
            br
            | 每日最大提款金额 
            span.text-danger {{ maxAmount._nwc() }}
            | ，今天您已提款金额 
            span.text-danger {{ amount._nwc() }}
            | 。
            br
            | 新绑定的提款银行卡需要绑定时间超过 
            span.text-danger 6
            |  小时才能正常提款。
            br
            | 特殊余额提款不收取手续费。
        .form

          .item.mt20(style="line-height: .5rem") 
            span.left-label 收款银行卡：
            p.banks
              label.ds-radio-label(v-for="bank in banksO" @click="choiceBank(bank)" v-bind:class="{disable: !bank.canUse}")
                  span.ds-radio.white(v-bind:class="{ active: selectBank.entry === bank.entry }")
                  span.ds-icon-bank-card(v-bind:class=" [ bank.class, { selected: selectBank.entry === bank.entry } ] ")
                    span.bank-last-no {{ bank.cardNo}}
                    span.text-danger.target-time-use(v-if="!bank.canUse") {{bank.remainTimeText}}
                      i 可用

              span.ds-button.text-button.blue.el-icon-caret-bottom(v-if="!showAllBank && myBanks.length > 3" @click="showAllBank = true")  更多银行

              // span.ds-icon-bank-card.el-icon-caret-bottom.more(v-if="!showAllBank && myBanks.length > 3" @click="showAllBank = true")  更多银行

          p.item.ptb10 
            span.left-label 提现限额：
            span (单笔提现限额：最低：
            span.min.text-danger  {{ min }} 
            | 元，
            | 最高：
            span.min.text-danger  {{ max }} 
            | 元)

          p.item.ptb10 
            span.left-label 今日可提次数：
            span.text-danger {{ times }}/{{ maxTimes }}

          p.item.ptb10 
            span.left-label 今日可提金额：
            span.text-danger {{ amount._nwc() }}/{{ maxAmount._nwc() }}

          p.item.ptb10 
            span.left-label 出款账户
            span
              el-radio( v-model="mtype" v-for=" (m, i) in moneyTypes " v-bind:label="i") {{m}}

            //- span.ds-radio.white( v-model="mtype" v-for=" (m, i) in moneyTypes " v-bind:label="i") {{m}}

          //- .item(style="line-height: .5rem") 提现来源：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            el-select(v-model=" mtype " style="width: 1.8rem; position: relative; top: -.01rem")
                el-option(v-for=" (m, i) in moneyTypes " v-bind:label=" m " v-bind:value="i ")

          p.item 
            span.left-label 可提金额：
            span.amount(style="vertical-align: middle, color: '#ddd'") {{ numberWithCommas(mtype ? me.smoney : me.amoney) }}
              span.ft14 元
          
          p.item(style="padding: .1rem 0") 
            span.left-label 提现金额：
            //- el-input-number(v-model="money" v-bind:debounce="1000" v-bind:max="max" v-bind:min="min" controls=false placeholder="请输入整数金额")
            InputNumber(v-bind:defaultValue="money" v-on:enter="showWithDraw" v-on:change="money = $event" placeholder="请输入整数金额")
            span(style="color: #999; padding-left: .1rem") {{ textMoney }} 


          .buttons(style="margin-left: 1.1rem; padding: .2rem 0")
            .ds-button.primary.large(@click="showWithDraw") 确认

      
      .bank-form(v-if="tabIndex === 0 && stepIndex === 2")
        p.title.text-black(style="padding: 0 .18rem 0 .4rem; margin: .2rem 0;") 
          // |您正在增加 
          // span.text-blue {{ me.name }}
          // |  账号的银行卡
          span.ds-button.text-button.blue(style="float: right" @click="stepIndex--") {{ '<返回上一页' }}
        .form
          p.item 实扣金额：&nbsp;&nbsp;&nbsp;
            span.amount {{ money }}

          p.item 到账金额：&nbsp;&nbsp;&nbsp;&nbsp;
            span.amount {{ get }}

          .item(style="line-height: .5rem; padding-top: .15rem ") 开户银行：&nbsp;&nbsp;&nbsp;
            p.banks
              span.ds-icon-bank-card.static(v-bind:class=" [ selectBank.class ] ")

          p.item(style="padding: .2rem 0 0 0") 银行卡账号：&nbsp;&nbsp;{{ selectBank.cardNo }}

          .buttons(style="margin-left: .85rem; padding: .2rem 0")
            .ds-button.primary.large(@click="doWithDraw") 提交


      form(v-if="tabIndex === 1")

        // label.item 充值时间 
        //   el-date-picker(v-model="st" type="datetime" placeholder="请选择日期时间")
        //   |  至 
        //   el-date-picker(v-model="et" type="datetime" placeholder="请选择日期时间")

        // label.item(style="margin-left: .2rem") 状态 
        //   el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .8rem" placeholder="全")
        //     el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")

        .search-bar.pl20
          SearchConditions(v-bind:showBtnSearch="true" @choiced="choicedSearchCondition" @search="search")

        el-table.header-bold.margin(:data="data" style="margin: .2rem"  v-bind:row-key="getRowKeys"
        v-bind:expand-row-keys="expands")
          
          el-table-column(type="expand")
            // template(slot-scope="props")
            template(scope="scope")
              el-steps(:active="scope.row.step" finish-status="success" align-center space="2.15rem" style="margin-left: .3rem")

                el-step(v-bind:icon=" (scope.row.step === 1 && scope.row.result === 2) ? 'el-icon-circle-close' : '' " v-bind:status=" scope.row.step === 1 ? SSS[scope.row.result] : ( scope.row.step > 1 ? 'success' : 'wait') " v-bind:title=" '提现申请' + (scope.row.step === 1 ? SS[scope.row.result] : '')  " description="  "  )
                el-step(v-bind:el-icon=" (scope.row.step === 2 && scope.row.result === 2) ? 'el-icon-circle-close' : '' " v-bind:status=" scope.row.step === 2 ? SSS[scope.row.result] : ( scope.row.step > 2 ? 'success' : 'wait') " v-bind:title=" '风控审核' + (scope.row.step === 2 ? SS[scope.row.result] : '')  " v-bind:description=" scope.row.step >= 2 ? scope.row.step2Time : '' ")
                el-step(v-bind:el-icon=" (scope.row.step === 3 && scope.row.result === 2) ? 'el-icon-circle-close' : '' " v-bind:status=" scope.row.step === 3 ? SSS[scope.row.result] : ( scope.row.step > 3 ? 'success' : 'wait') " v-bind:title=" '出款' + (scope.row.step === 3 ? SS[scope.row.result] : '')  " v-bind:description=" scope.row.step >= 3 ? scope.row.step3Time : '' ")
                el-step(v-bind:el-icon=" (scope.row.step === 4 && scope.row.result === 2) ? 'el-icon-circle-close' : '' " v-bind:status=" scope.row.step === 4 ? SSS[scope.row.result] : ( scope.row.step >= 4 ? 'success' : 'wait') " v-bind:title=" '完成' + (scope.row.step === 4 ? SS[scope.row.result] : '')  " description="")
              

          el-table-column(prop="acceptTime" label="提现时间" )

          el-table-column(prop="bankName" label="银行" )
            template(scope="scope")
              .ds-icon-bank-card.static(v-bind:class=" [ scope.row.class ] " style="margin: 0")

          el-table-column(prop="realMoney" label="金额"  align="right")

          el-table-column(prop="transferFee" label="手续费"  align="right")

          el-table-column(label="" align="right" )

          el-table-column(label="状态" )
            template(scope="scope")
              span(:class=" scope.row.statusV.indexOf('失败') !== -1 ? 'text-danger' : 'text-green' " v-if="scope.row.statusV") {{ scope.row.statusV }}

          el-table-column(label="失败原因" prop="description" show-overflow-tooltip=true)
          
          

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

</template>

<script>
import api from '../../http/api'
import store from '../../store'
import { BANKS } from '../../util/static'
import { timeFormat } from '../../util/Date'
import {numberWithCommas, digitUppercase, MMath} from '../../util/Number'
import xhr from 'components/xhr'
import { Radio, RadioGroup, RadioButton } from 'element-ui'
import SearchConditions from 'components/SearchConditions'
import InputNumber from 'components/InputNumber'
import Timer from '../../util/timer'
import md5 from 'md5'
// import util from '../../util'
export default {
  mixins: [xhr],
  data () {
    return {
      MMath,
      numberWithCommas: numberWithCommas,
      me: store.state.user,
      cpwd: '',
      myBanks: [],
      showAllBank: false,
      selectBank: {},
      maxmins: [],
      max: 45000,
      min: 0,
      money: 0,
      get: 0,
      // xxx
      stepIndex: 0,
      tabIndex: 0,
      pageSize: 20,
      total: 0,
      currentPage: 1,
      data: [{}],
      SSS: ['process', 'success', 'error'],
      SS: ['中...', '成功', '失败'],
      S: ['出款中', '出款失败', '成功'],
      // V: ['审核中', '审核通过', '审核失败'],
      V: ['', '审核中', '审核失败', '审核通过', '出款成功', '出款失败'],
      checkSafeCodeUrl: ['', api.person_checkSmsVerifyCode, api.person_checkMailVerifyCode, api.checkGoogleAuth],
      times: 0,
      moneyTypes: ['主账户', '特殊金额'],
      mtype: 0,
      // 获取row的key值
      getRowKeys (row) {
        return row.index
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      amount: 0,
      maxAmount: 0,
      // HOURS_24: 24 * 60 * 60 * 1000,
      HOURS_6: 6 * 60 * 60 * 1000,

      startDate: '',
      endDate: '',
      remaingTime: 0
    }
  },
  computed: {
    // Cdata () {
    //   if (this.data.length <= this.pageSize) return this.data
    //   else {
    //     return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
    //   }
    // },
    banksO () {
      return this.showAllBank ? this.myBanks : this.myBanks.slice(0, 3)
    },
    textMoney () {
      return this.money > 0 ? digitUppercase(this.money) : ''
    },
    remaingTimeTxt () {
    }
  },
  watch: {
    money () {
      if (typeof this.money === 'number') {
        setTimeout(() => {
          typeof this.money === 'number' && (this.money + '') !== (this.money.toFixed(2)) && (this.money = (this.money.toFixed(2)))
        }, 300)
        // setTimeout(() => {
        //   this.amount = parseFloat(this.amount) || 0
        // }, 300)
      }
    },
    selectBank () {
      // this.selectBank.apiName && this.getWithdrawByApi()
      if (!this.selectBank.apiName) {
        this.max = 45000
        this.min = 0
      } else {
        let x = this.maxmins.find(m => m.bankCode === this.selectBank.apiName) || {maxDraw: 10000, minDraw: 0}
        this.max = x.maxDraw
        this.min = x.minDraw
      }
    },
    tabIndex () {
      if (this.tabIndex === 1) {
        this.queryWithdraw()
      } else {
        this.__setCall({fn: '__getUserFund'})
        // this.getUserBankCards()
      }
    }
  },
  mounted () {
  },
  methods: {
    __setWithdrawI (i) {
      this.tabIndex = i
      this.money = ''
    },
    // ec (row, expandedRows) {
    //   console.log(row, expandedRows, '???')
    //   expandedRows.splice(0, expandedRows.length)
    //   expandedRows.push(row)
    // },
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
    pageChanged (cp) {
      this.queryWithdraw(cp, () => {
        this.currentPage = cp
      })
    },
    queryWithdraw (page, fn) {
      let params = {
        page: page || 1,
        pageSize: this.pageSize
      }
      if (this.startDate) {
        params.startDate = this.startDate
      }
      if (this.endDate) {
        params.endDate = this.endDate
      }
      this.$http.get(api.queryWithdraw, params).then(({data}) => {
        if (data.success === 1) {
          this.data = data.withdrawData || []
          this.data.forEach((c, i) => {
            c.index = i
            c.cardNo = '*****' + c.cardNo.slice(-4)
            // c.statusV = c.isverify === 1 ? this.S[c.status] : this.V[c.isverify]
            c.statusV = this.V[c.isverify]
            c.class = (BANKS.find(b => b.apiName === c.apiName) || {})['class']
          })
          typeof fn === 'function' && fn()
          this.total = data.totalSize || this.data.length
          !fn && (this.currentPage = 1)
          // 在这里你想初始化的时候展开哪一行都可以了
          this.expands.push(0)
        }
      }).catch(rpe => {
      })
    },
    checkNow () {
      if (!this.cpwd) return this.$message.warning({target: this.$el, message: '请输入资金密码！'})
      if (this.me.safeCheck && !this.safeCheckCode) return this.$message.warning({target: this.$el, message: '请输入安全验证码！'})
      this.checkSecurityPwd()
    },
    checkSecurityPwd () {
      this.$http.post(api.checkSecurityPwd, {password: md5(this.cpwd)}).then(({data}) => {
        if (data.success === 1) {
          if (this.me.safeCheck) {
            return this.checkSafeCode()
          }
          this.stepIndex++
          this.$message.success({target: this.$el, message: data.msg || '资金密码验证成功！'})
          this.__setCall({fn: '__getUserFund'})
          this.getUserBankCards()
          this.withdrawTimes()
          this.getWithdrawByApi()
        } else {
          this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '资金密码验证失败！'})
      })
    },
    checkSafeCode () {
      this.$http.post(this.checkSafeCodeUrl[this.me.safeCheck], {verifyCode: this.safeCheckCode}).then(({data}) => {
        if (data.success === 1) {
          this.stepIndex++
          this.$message.success({target: this.$el, message: data.msg || '安全码验证成功！'})
          this.__setCall({fn: '__getUserFund'})
          this.getUserBankCards()
          this.withdrawTimes()
          this.getWithdrawByApi()
        } else {
          this.$message.error({target: this.$el, message: data.msg || '安全码错误！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '安全验证失败！'})
      })
    },
    withdrawTimes () {
      this.$http.get(api.withdrawTimes).then(({data}) => {
        if (data.success === 1) {
          this.times = data.times
          this.maxTimes = data.maxTimes
          this.amount = data.amount
          this.maxAmount = data.maxAmount
        }
      }).catch(rep => {
      })
    },
    getUserBankCards () {
      this.$http.get(api.getUserBankCards).then(({data}) => {
        if (data.success === 1) {
          this.myBanks = data.userBankCards
          if (this.myBanks.length === 0) {
            return this.$modal.warn({
              content: '您还未曾绑定过银行卡，请绑定银行卡后再进行提现！',
              target: this.$el,
              close () {
                this.$emit('close', '2-1-2', '2-2-4')
                // this.$router.push('/me/2-6-1')
              },
              O: this
            })
          }
          this.myBanks.forEach(c => {
            c.class = BANKS.find(b => b.apiName === c.apiName)['class']
            c.cardNo = '*****' + c.cardNo.slice(-4)
          })
          this.fmtData()
        }
      }).catch(rep => {
      })
    },
    fmtData () {
      this.myBanks = this.myBanks.map((bank, i) => {
        bank.canUse = this.canSelectBank(bank.addTime)
        bank.remainTime = Math.floor(this.calcRemainTime(bank.addTime) / 1000)
        bank.remainTimeText = ''
        /* eslint-disable no-new */
        new Timer(bank.remainTime, (time, finish) => {
          if (!finish) {
            bank.remainTime = time
          }
          bank.remainTimeText = this.timeFormat(bank.remainTime)
          this.$set(this.myBanks, i, bank)
        })
        return bank
      })
    },
    getWithdrawByApi () {
      // this.$http.post(api.getWithdrawByApi, {apiName: this.selectBank.apiName}).then(({data}) => {
      this.$http.get(api.getWithdrawByApi).then(({data}) => {
        if (data.success === 1) {
          // this.max = data.max
          // this.min = data.min
          this.maxmins = data.data
        } else {
          this.$message.error({target: this.$el, message: data.msg || '限额信息获取失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '限额信息获取失败！'})
      })
    },
    showWithDraw () {
      if (this.times >= this.maxTimes) return this.$message.warning({target: this.$el, message: '您的今日可提现次数已用完。'})
      if (this.amount >= this.maxAmount) return this.$message.warning({target: this.$el, message: '您的今日可提现金额已用完。'})
      if (this.selectBank.entry === undefined) return this.$message.warning({target: this.$el, message: '您还未选择银行卡。'})
      if (this.money === 0 || this.money === '0' || this.money === '') return this.$message.warning({target: this.$el, message: '您还未输入提现金额。'})
      if ((this.money % 1) !== 0) return this.$message.warning({target: this.$el, message: '您输入的提现金额不是整数。'})
      if (parseInt(this.money, 10) > this.max) return this.$message.warning({target: this.$el, message: '您输入的金额超过最高提现金额。'})
      if (parseInt(this.money, 10) < this.min) return this.$message.warning({target: this.$el, message: '您输入的金额小于最低提现金额。'})
      if (parseInt(this.money, 10) + this.amount > this.maxAmount) return this.$message.warning({target: this.$el, message: '您输入的金额超过当日可提现金额。'})
      this.$http.post(api.showWithDraw, {userBankId: this.selectBank.entry, amount: this.money, isSpe: this.mtype}).then(({data}) => {
        if (data.success === 1) {
          this.get = data.realmoney
          this.stepIndex++
        } else {
          this.$message.error({target: this.$el, message: data.msg || '提现申请提交失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '提现申请提交失败！'})
      })
    },
    doWithDraw () {
      this.$http.post(api.doWithDraw, {userBankId: this.selectBank.entry, amount: this.money, isSpe: this.mtype}).then(({data}) => {
        this.withdrawTimes()
        if (data.success === 1) {
          this.$modal.success({
            content: '恭喜您，提交成功！',
            target: this.$el,
            btn: ['确定'],
            close () {
              this.stepIndex--
              this.tabIndex++
              this.cpwd = ''
              this.$emit('tab-idx-change', 1)
            },
            O: this
          })
        } else {
          this.$message.error({target: this.$el, message: data.msg || '提现申请提交失败！'})
        }
      }).catch(rep => {
        this.$message.error({target: this.$el, message: '提现申请提交失败！'})
      })
    },
    stringToDate (d) {
      let dt = d.split(' ')
      let date = dt[0].split('-')
      let time = dt[1].split(':')
      return new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2])
    },
    canSelectBank (dt) {
      let date = this.stringToDate(dt)
      return this.MMath.sub(new Date().getTime(), date.getTime()) > this.HOURS_6
    },
    calcRemainTime (dt) {
      let date = this.stringToDate(dt)
      if (this.MMath.sub(new Date().getTime(), date.getTime()) < this.HOURS_6) {
        return Math.abs(this.MMath.sub(new Date().getTime(), date.getTime()) - this.HOURS_6)
      }
      return 0
    },
    choiceBank (bank) {
      if (this.canSelectBank(bank.addTime)) this.selectBank = bank
    },
    fmtTime (dt) {
      return this.timeFormat(Math.floor(this.calcRemainTime(dt) / 1000))
    },
    choicedSearchCondition (i, dates) {
      this.startDate = dates.startDateStr
      this.endDate = dates.endDateStr
    },
    search () {
      this.queryWithdraw()
    },
    timeFormat
  },
  // doWithDraw: api + 'person/withDraw.do?method=doWithDraw&apiName=ico&amount=123&userBankId=2',
  components: {
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    SearchConditions,
    InputNumber
  }
}
</script>
<style lang="stylus">
  .width-draw-info 
    .el-radio__input
      &.is-checked
        .el-radio__inner
          border-color #ccc
          background-color #ffffff
      .el-radio__inner:hover
        border-color #f17d0b
    .el-radio__inner::after
      width 0.07rem
      height 0.07rem
      border-color #f17d0b
      background-color #f17d0b
</style>
<style lang="stylus" scoped>
  @import '../../var.stylus'
  .scroll-content
    top TH
  i
    font-style normal
  .width-draw-info
    .cashpwd-form
      padding-top .1rem
  .left-label
    display inline-block
    width 1.1rem  
  .notice
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
  .banks
    display inline-block
    margin 0
    max-width 90%
    vertical-align top
  .ds-radio-label
    padding 0 .1rem
    position relative
    &.disable
      .ds-icon-bank-card::before
        content ''
        width 100%
        height 100%
        display inline-block
        background-color rgba(53, 53, 53, 0.2)
      .ds-radio
        background-color #e9e9e9
        border-color #d2d2d2
  .ds-icon-bank-card
    width 2.02rem
    height 0.4rem
    margin .05rem 
    radius()
    display inline-block
    position relative
    vertical-align middle
    background-position left !important
    background-color #fff !important
    // &.more
    //   text-align center
    //   font-weight bold
    //   color BLUE
    //   line-height .4rem
    //   border none
    //   background-color #ebf7ff
    //   border 1px solid rgba(0,0,0,0)
    //   &:hover
    //     border 1px solid BLUE
    //   &:active
    //     background-color #d2e8f6
    //     border 1px solid BLUE
        // border none
  .bank-last-no
    line-height 0.4rem
    position absolute
    right 0.1rem
    top 0
    z-index 2
    color #666
.target-time-use
  width 1.1rem
  line-height 0.27rem
  border solid 1px #cccccc  
  position absolute
  text-align center
  top -0.20rem
  left 0.47rem
  box-shadow 1px 2px 2px 0px rgba(0, 0, 0, 0.1)
  background #fff
  border-radius 0.03rem
  z-index 12
  i
    color #666666

.search-bar
  background-color #fff
  line-height 0.7rem
  margin 0 0.2rem
</style>