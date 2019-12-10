<template lang="jade">
  .me-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .me-topup.scroll-content

      .tab(style="text-align: center")
        .ds-button-group
          // 无多通道
          // .ds-button.text-button(:class="{ selected: type === 0 }" @click=" type = 0 " v-if=" bankList[0] ") 网银转帐
          // .ds-button.text-button(:class="{ selected: type === 1 }" @click=" type = 1 " v-if=" merBankList[0] ") 在线支付
          .ds-button.text-button(v-for=" (bb, i) in epay " v-bind:class="{ selected: type === (3 + i) }" @click=" (type = (3 + i)) && !(radioIndex = 0)  && (selectBank = bb.more[radioIndex].channelCodes[0]) " ) {{ bb.title }}
          .ds-button.text-button(:class="{ selected: type === 2 }" @click=" type = 2 ") 充值记录

        .radios(v-if="type > 2 && epay[type - 3].more && epay[type - 3].more.length > 1 " style="margin-bottom: .1rem")
          label.ds-radio-label(v-if="r" v-for="(r, index) in epay[type - 3].more"  @click="radioIndex = index" v-bind:class="{ active: radioIndex === index }")
            span.ds-radio.white
            | {{ r.tongdName }}

      // .cashpwd-form.form(v-if="stepIndex === 0" style="padding-top: .4rem")
      //   p 资金密码：
      //     input.ds-input.large(v-model="cpwd" type="password" @keyup.enter="checkSecurityPwd")
      //     .buttons(style="margin-left: .70rem; padding: .2rem 0")
      //       .ds-button.primary.large(@click="checkSecurityPwd") 确认


      .form(v-if=" type !== 2 ")

        .notice(style="margin: 0 0 .2rem 0" v-if="type > 2")
          span.title 温馨提示：
          p.content
            | 如果充值失败请多次尝试，或使用
            span.text-danger 在线支付
            | 的方式进行充值。手续费为：
            span.text-danger(style="font-size: 14px") {{ selectBank.custFee || '0' }}%
            br
            | 为了提高充值成功率，如果充值金额为整数，使用某些充值方式时，系统会自动将充值金额随机增加
            span.text-danger(style="font-size: 14px") 0.01-0.09
            br(v-if="moreTip")
            span.text-danger(v-if="moreTip") {{ moreTip }}   


        .item(style="line-height: .5rem") 支付方式：
            .banks
                label.ds-radio-label( v-if=" type > 2 && epay[type - 3].title !== '在线支付' && epay[type - 3].title !== '网银转帐' ")
                  // span.ds-radio.white(v-bind:class="{ active: selectBank.bankCode === bank.bankCode }")
                  span.ds-icon-bank-card.selected(v-bind:class=" [ selectBank.class ] ")

                div(v-if=" (type >= 3 && ( epay[type - 3].title === '网银转帐' || epay[type - 3].title === '在线支付' )) ")
                  label.ds-radio-label(v-for="bank in banksO " @click="selectBank = bank")
                    span.ds-radio.white(v-bind:class="{ active: selectBank.bankCode === bank.bankCode }")
                    span.ds-icon-bank-card(v-bind:class=" [ bank.class, { selected: selectBank.bankCode === bank.bankCode } ] ")

                  label.ds-radio-label
                    span.ds-radio.white(style="opacity: 0")
                    span.ds-icon-bank-card.el-icon-caret-bottom.more(v-if="!showAllBank && avaibleBanks.length > 3" @click="showAllBank = true")  更多银行

        .item(style="line-height: .5rem" v-if=" type >= 3 && epay[type - 3].title === '支付宝转帐' ") 支付姓名：&nbsp;&nbsp;&nbsp;&nbsp;
          input.ds-input(v-model="name" @keyup.enter.native="topUpNow" style="width: 1.8rem")
          span(style="padding: 0 .2rem") （请输入支付宝真实姓名）




        .item(style="line-height: .5rem") 充值金额：&nbsp;&nbsp;&nbsp;&nbsp;
          el-input-number(v-model="amount" type="number" @keyup.enter.native="topUpNow")
          span(style="padding: 0 .2rem") 充值限额：(单笔充值限额：最低：
              span.min.text-danger  {{ min }}
              | 元，
              | 最高：
              span.min.text-danger  {{ max }}
              | 元)


        .buttons(style="margin-left: .85rem; padding-top: .05rem")
            .ds-button.primary.large(@click="topUpNow") 确认


      .form(v-if="type === 2")

        // label.item 充值时间
        //   el-date-picker(v-model="st" type="datetime" placeholder="请选择日期时间")
        //   |  至
        //   el-date-picker(v-model="et" type="datetime" placeholder="请选择日期时间")

        // label.item(style="margin-left: .2rem") 状态
        //   el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .8rem" placeholder="全")
        //     el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")

        .notice(style="margin: 0 0 .2rem 0")
          span.title 温馨提示：
          p.content
            | 一般情况
            span.text-blue 充值
            | 为
            span.text-danger 1-2分钟
            | 之内到帐;
            br
            | 因为银行或第三方网络延迟，如果超过5分钟没有到帐，可以填写催到帐申请（每个记录只有一次机会可申请催到帐），或直接联系客服。

        el-table.header-bold.margin(:data="data" style="margin: .2rem 0" stripe)
          el-table-column(prop="payerTime" label="充值时间")

          el-table-column(prop="bankName" label="银行" )

          el-table-column(prop="payerRealAmount" label="金额"  align="right")

          el-table-column(prop="payerTransferFee" label="手续费"  align="right")

          el-table-column(label="" align="right" )

          el-table-column(label="状态" )
            template(scope="scope")
              span(:class="{ 'text-green': scope.row.isDone === '充值成功', 'text-danger': scope.row.isDone !== '充值成功' }") {{  scope.row.isDone}}

          el-table-column(label="操作")
            template(scope="scope")
              span.ds-button.text-button(:class="{ blue: scope.row.errorEntry === '0', 'light wg': scope.row.errorEntry !== '0' }" v-if="!scope.row.done" @click="showReq(scope.row)" style="padding: 0") 催到帐

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")


    .modal(v-show="show" )
      .mask
      .box-wrapper
        .box
          .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
            span.title(style="font-size: .18rem; color #666;") 支付 {{ amount }} 元
            el-button-group
              i.el-icon-close.ds-button.text-button(@click="show = false" )

          .content
            p.text-black {{ selectBank.text }}扫码支付
            .QR.ds-icon-QR(:style="myQR")
              p(style="padding-top: 1.5rem; position: relative")
                span.refresh.ds-button.small(v-show="pt_ === 0" @click="commit") 重新获取二维码
                span.loading(v-show="pt_ !== 0")
                  span.text-danger {{ this.pt_ }}
                  | 秒后二维码过期
                span.loading(v-show="pt_ === 0")
                  span.text-danger 二维码已过期，请重新获取


    Modal(title="" v-bind:Ptype="Ptype" v-show="dataXnow" v-bind:Pbtn="Pbtn " v-bind:Phref="Phref" v-bind:Pclose = "Pclose" v-bind:Pok = "Pok")
      .my-content.text-666(slot="my-content" style="text-align: left; font-size: .16rem; line-height: .3rem; user-select: text;")
        p(v-if=" type >= 3 && epay[type - 3].title === '支付宝转帐' ") 支付宝真实姓名：
          span.text-black {{ name }}
          span.ds-button.text-button.green(v-clipboard:copy=" name " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 充值总额：
          span.text-black {{ dataXamount }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXamount " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 银行信息：
          span.text-black {{ dataXbankName }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXbankName " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 户名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          span.text-black {{ dataXcardName }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXcardName " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 卡号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          span.text-black {{ dataXcardNum }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXcardNum " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 订单号：&nbsp;&nbsp;&nbsp;
          span.text-black {{ dataXorderId }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXorderId " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制
        p 附言：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          span.text-black {{ dataXappendix }}
          span.ds-button.text-button.green(v-clipboard:copy=" dataXappendix " v-clipboard:success="copySuccess" v-clipboard:error="copyError") 复制

    .modal(v-show="showRequest" )
      .mask
      .box-wrapper
        .box(style="width: 6rem")
          .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
            span.title.text-black(style="font-size: .18rem;") 催到帐
            el-button-group
              i.el-icon-close.ds-button.text-button(@click="showRequest = false" )

          .content
            .form(style="margin: .2rem .4rem" v-if="row.errorEntry === '0' ")

              p.item
                span.text-danger *
                | 银行名称：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                el-select(v-model="CbankIndex" style="width: 3rem")
                  el-option(v-for="(b, index) in ALLBANKS" v-bind:label="b.text" v-bind:value="index")

              p.item
                span.text-danger *
                | 付款人姓名：&nbsp;
                input.ds-input.large(v-model="Cname" style="width: 3rem")
                span(style="font-size: .12rem")

              p.item
                span.text-danger *
                | 付款卡号：&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="Ccardno" style="width: 3rem")
                span(style="font-size: .12rem")

               p.item
                span.text-danger *
                | 付款金额：&nbsp;&nbsp;&nbsp;&nbsp;
                el-input-number(type="number" v-model="Camount" style="width: 3rem")
                span(style="font-size: .12rem")

               p.item
                | 收款人姓名：&nbsp;
                input.ds-input.large(v-model="CRname" style="width: 3rem")
                span(style="font-size: .12rem")

              p.item 交易序列号：&nbsp;&nbsp;
                input.ds-input.large(v-model="Cid" style="width: 3rem")
                span(style="font-size: .12rem")

              p.item 付款时间：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                el-date-picker(type="datetime" v-model="Ctime"  style="width: 3rem")
                span(style="font-size: .12rem")

              p.item 附言：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                input.ds-input.large(v-model="Cmore" style="width: 3rem")
                span(style="font-size: .12rem")

              .buttons(style="margin-left: 1.35rem; padding-top: .05rem; text-align: left")
                .ds-button.primary.large(@click="sendReq") 提交

            .form(style="margin: .2rem .4rem; padding-bottom: .3rem " v-if="row.errorEntry !== '0' ")

              p.item
                span.text-danger *
                | 银行名称：&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.bankName || '空' }}


              p.item
                span.text-danger *
                | 付款人姓名：&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.payname || '空' }}

              p.item
                span.text-danger *
                | 付款卡号：&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.payCardNo || '空' }}

              p.item
                span.text-danger *
                | 付款金额：&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.payAmount || '空' }}

              p.item
               | 收款人姓名：&nbsp;
               span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.getname || '空' }}

              p.item 交易序列号：&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.serialNo || '空' }}

              p.item 付款时间：&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.payTime || '空' }}
              p.item 附言：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left") {{ detail.noteWord || '空' }}
              p.item 状态：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                span.text-999(style="width: 3rem; display: inline-block; text-align: left" v-if=" detail.isDone === 1") 处理成功
                span.text-green(style="width: 3rem; display: inline-block; text-align: left" v-if=" detail.isDone === 0") 待处理
                span.text-danger(style="width: 3rem; display: inline-block; text-align: left" v-if=" detail.isDone === 2") 失败，{{ detail.backReson }}



</template>

<script>
import api from '../../http/api'
import { BANKS } from '../../util/static'
import { dateTimeFormat } from '../../util/Date'
import {numberWithCommas} from '../../util/Number'
import Modal from 'components/Modal'
export default {
  data () {
    return {
      numberWithCommas: numberWithCommas,
      Ptype: 'success',
      Pbtn: ['进入网上银行'],
      Phref: [],
      cpwd: '',
      dataXamount: '',
      dataXbankName: '',
      dataXcardName: '',
      dataXcardNum: '',
      dataXorderId: '',
      dataXappendix: '',
      dataXnow: false,
      O: '',
      enableSaveType: '2',
      type: 0,
      // avaibleBanks: [],
      selectBank: {},
      showAllBank: false,
      amount: 0,
      min: 0,
      max: 0,
      data: [],
      show: false,
      time_: 60,
      pt_: 0,
      st: '',
      et: '',
      STATUS: ['正在充值', '充值成功', '充值失败'],
      status: '',
      pageSize: 20,
      total: 0,
      currentPage: 1,
      showRequest: false,
      ALLBANKS: BANKS,
      // 催帐
      row: {},
      CbankIndex: '',
      Cname: '',
      Ccardno: '',
      Camount: 0,
      CRname: '',
      Cid: '',
      Ctime: '',
      Cmore: '',
      detail: {},
      myAllBanks: [],
      myFastBanks: [],
      Qr: '',
      bankList: [],
      merBankList: [],
      merNoBankList: [],
      // 非银行转帐类
      epay: [],
      radioIndex: 0,
      name: ''
    }
  },
  computed: {
    moreTip () {
      return this.type > 2 ? this.epay[this.type - 3].more[this.radioIndex].tip : ''
    },
    Cbank () {
      return this.ALLBANKS[this.CbankIndex]
    },
    myQR () {
      return {
        margin: '0 auto',
        marginBottom: '.5rem',
        // width: '1.4rem',
        background: 'url(data:image/png;base64,' + this.Qr + ') center top no-repeat',
        height: '1.96rem',
        width: '1.4rem',
        textAlign: 'center'
      }
    },
    avaibleBanks () {
      return [this.bankList, (this.epay[this.type - 3] || {more: [{channelCodes: []}]}).more[this.radioIndex].channelCodes || []][Math.min(this.type, 1)]
    },
    // Cdata () {
    //   if (this.data.length <= this.pageSize) return this.data
    //   else {
    //     return util.groupArray(this.data.slice(this.pageSize * (this.currentPage - 1), this.pageSize * this.currentPage), this.pageSize, {_empty: true})[0]
    //   }
    // },
    // BANKS () {
    //   return BANKS.filter(b => {
    //     return this.avaibleBanks.find(ab => ab.bankCode === b.apiName)
    //   })
    // },
    // myBanks () {
    //   return this.avaibleBanks.filter(b => ['alipay', 'wepay'].indexOf(b.class) === -1)
    //   // return BANKS
    // },
    banksO () {
      return this.showAllBank ? this.avaibleBanks : this.avaibleBanks.slice(0, 3)
    }
    // ,
    // otherPay () {
      // return this.avaibleBanks.filter(b => ['alipay', 'wepay'].indexOf(b.class) !== -1)
    // }
  },
  watch: {
    amount () {
      if (typeof this.amount === 'number') {
        setTimeout(() => {
          typeof this.amount === 'number' && (this.amount + '') !== (this.amount.toFixed(2)) && (this.amount = (this.amount.toFixed(2)))
        }, 300)
        // setTimeout(() => {
        //   this.amount = parseFloat(this.amount) || 0
        // }, 300)
      }
    },
    pt_ () {
      if (this.pt_ === this.time_) {
        let t = setInterval(() => {
          if (this.pt_ > 0) this.pt_--
          else clearInterval(t)
        }, 1000)
      }
    },
    selectBank () {
      // this.saveAmountRange()
      if (!this.selectBank.bankCode) {
        this.max = 45000
        this.min = 0
      } else {
        this.max = this.selectBank.maxSave
        this.min = this.selectBank.minSave
      }
    },
    radioIndex () {
      if (this.type < 2 || (this.type > 2 && this.epay[this.type - 3].title === '在线支付') || (this.type > 2 && this.epay[this.type - 3].title === '网银转帐')) this.selectBank = {}
    },
    type () {
      // this.max = 0
      // this.min = 0
      this.amount = 0
      this.radioIndex = 0
      // if (this.type !== 2) this.TopUpGetBankList()
      if (this.type === 2) this.qryRecharge()
      if (this.type < 2 || (this.type > 2 && this.epay[this.type - 3].title === '在线支付') || (this.type > 2 && this.epay[this.type - 3].title === '网银转帐')) this.selectBank = {}
      // if (this.type > 2) this.selectBank = this.otherPay
    },
    Ctime () {
      // block8/3 console.log(this.Ctime)
    }
    // otherPay () {
    //   if (this.type > 2) {
    //     this.selectBank = (this.otherPay[4 - this.type] || {})
    //   }
    // }
  },
  mounted () {
    // this.getBankList()
    // this.showRecharge()
    this.O = this
    // this.TopUpGetBankList()
    // this.qryRecharge()
    // this.getEnableSaveType()
    // this.saveAmountRange()
    this.saveRanges()
  },
  methods: {
    // checkSecurityPwd () {
    //   this.$http.post(api.checkSecurityPwd, {password: this.cpwd}).then(({data}) => {
    //     if (data.success === 1) {
    //       this.stepIndex++
    //       this.$message.success({target: this.$el, message: data.msg || '资金密码密码验证成功！'})
    //       // this.__setCall({fn: '__getUserFund'})
    //       // this.getUserBankCards()
    //     } else {
    //       this.$message.error({target: this.$el, message: data.msg || '资金密码错误！'})
    //     }
    //   }).catch(rep => {
    //     this.$message.error({target: this.$el, message: '资金密码密码验证失败！'})
    //   })
    // },
    // 添加催到账
    // http://192.168.169.161:8080/cagamesclient/person/recharge.do?method=addPayError&apiName=icbc&getName=&payName=张三&payCardNo=1234&payAmount=123&noteWord=1213&serialNo=&payTime=2017-06-08 16:15:15
    // addPayError: 'person/recharge.do?method=addPayError',
    // // 查询催到账记录
    // // http://192.168.169.161:8080/cagamesclient/person/recharge.do?method=queryPayError&startDate=20170607192528&endDate=20170609192528&idDone=0
    // queryPayError: 'person/recharge.do?method=queryPayError'
    showReq (row) {
      this.showRequest = true
      this.row = row
      if (this.row.errorEntry !== '0') this.queryPayError(this.row)
    },
    sendReq () {
      if (this.row.errorEntry === '0') this.addPayError(this.row)
      else this.queryPayError(this.row)
    },
    addPayError (row) {
      if (!this.Cbank || !this.Cname || !this.Ccardno) return this.$message.warning('带星号的内容不能为空！')
      // if (!this.Cname) return this.$message.warning('带星号的内容不能为空！')
      // if (!this.Ccardno) return this.$message.warning('带星号的内容不能为空！')
      if (!this.Camount) return this.$message.warning('付款金额不能为0！')
      let loading = this.$loading({
        text: '催帐中...',
        target: this.$el
      }, 10000, '催帐超时...')
      this.$http.post(api.addPayError, {
        apiName: this.Cbank.apiName,
        payName: this.Cname,
        payCardNo: this.Ccardno,
        payAmount: this.Camount,
        noteWord: this.Cmore,
        serialNo: this.Cid,
        payTime: this.Ctime ? dateTimeFormat(this.Ctime.getTime()) : '',
        paymentId: this.row.billNo,
        getName: this.CRname
      }).then(({data}) => {
        if (data.success === 1) {
          loading.text = '恭喜您，催帐成功！'
          this.Cbank = {}
          this.Cname = ''
          this.Ccardno = ''
          this.Camount = 0
          this.CRname = ''
          this.Cid = ''
          this.Ctime = ''
          this.Cmore = ''
          this.showRequest = false
          this.qryRecharge()
          // this.row.errorEntry = data.errorEntry || '22050'
        } else loading.text = data.msg || '不好意思，催帐失败！'
      }).catch(rpe => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    queryPayError (page, fn) {
      let loading = this.$loading({
        text: '催帐详情获取中...',
        target: this.$el
      }, 10000, '催帐详情获取超时...')
      this.$http.get(api.queryPayError, {
        entry: this.row.errorEntry
      }).then(({data}) => {
        if (data.success === 1) {
          this.detail = data
        } else loading.text = data.msg || '催帐详情查询失败'
      }).catch(rpe => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    pageChanged (cp) {
      this.qryRecharge(cp, () => {
        this.currentPage = cp
      })
    },
    qryRecharge (page, fn) {
      let loading = this.$loading({
        text: '充值记录获取中...',
        target: this.$el
      }, 10000, '充值记录获取超时...')
      this.$http.get(api.qryRecharge, {
        page: page || 1,
        pageSize: this.pageSize
      }).then(({data}) => {
        if (data.success === 1) {
          this.data = data.payRecordData || []
          typeof fn === 'function' && fn()
          !fn && (this.currentPage = 1)
          this.total = data.totalSize || this.data.length
        }
      }).catch(rpe => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    copySuccess () {
      this.$message({
        message: '复制成功'
      })
    },
    copyError () {
      this.$message({
        message: '复制失败!'
      })
    },
    Pclose () {
      this.dataXnow = false
      setTimeout(() => {
        this.Ptype = 'success'
        this.Phref = []
        this.name = ''
        // this.Pbtn = ['进入网上银行']
      }, 1000)
      return false
    },
    Pok () {
      if (this.Pbtn[0] === '进入网上银行' || this.Pbtn[0] === '进入支付宝') {
        this.Ptype = 'question'
        this.Pbtn = ['充值成功', '充值失败']
        setTimeout(() => {
          this.Phref = []
        }, 1000)
        return false
      } else {
        this.type = 2
      }
    },
    // 充值记录查询
    // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=qryRecharge&startDate=20161120124327&&endDate=20161126124327&status=1
    // qryRecharge: '/person/recharge.do?method=qryRecharge&startDate=20161120124327&&endDate=20161126124327&status=1 ',
    // // 进入充值页
    // // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=showRecharge
    // showRecharge: '/person/recharge.do?method=showRecharge',
    // // 获取银行列表
    // // http://192.168.169.43:19012/finance/merSave.do?method=getBankList
    // httpGetBankList: 'http://192.168.169.43:19012/finance/merSave.do?method=getBankList',
    // // &userId=1&userName=jock&platId=101
    // // 校验充值金额范围
    // // http://192.168.169.43:19012/finance/merSave.do?method=saveAmountRange
    // httpSaveAmountRange: 'http://192.168.169.43:19012/finance/merSave.do?method=saveAmountRange',
    // // &userId=1&userName=jock&platId=101&bankCode=icbc
    // // 提交充值请求道第三方
    // // http://192.168.169.43:19012/finance/merSave.do?method=commit
    // httpCommit: 'http://192.168.169.43:19012/finance/merSave.do?method=commit'
    // // &userId=1&userName=jock&platId=101&bankCode=icbc&amount=100
    // TopUpGetBankList (fn) {
    //   if ([this.myAllBanks, this.myFastBanks, [], this.myFastBanks, this.myFastBanks][this.type][0]) return false
    //   let loading = this.$loading({
    //     text: '银行列表获取中...',
    //     target: this.$el
    //   }, 10000, '银行列表获取超时...')
    //   let nowType = this.type
    //   this.$http.get(api.TopUpGetBankList, {saveType: Math.min(this.type, 1)}).then(({data}) => {
    //     if (data.success === 1) {
    //       data.bankList.forEach(b => {
    //         b.class = (BANKS.find(bb => {
    //           return b.bankCode === bb.apiName
    //         }) || {}).class
    //         b.text = (BANKS.find(bb => {
    //           return b.bankCode === bb.apiName
    //         }) || {}).text
    //       })
    //       if (nowType) {
    //         this.myFastBanks = data.bankList || []
    //         if (!this.myFastBanks[0]) this.$message.info({message: data.msg || '无可用支付方式！'})
    //       } else {
    //         this.myAllBanks = data.bankList || []
    //         if (!this.myAllBanks[0]) this.$message.info({message: data.msg || '无可用支付方式！'})
    //       }
    //       // this.avaibleBanks = data.bankList || []
    //     } else this.$message.info({message: data.msg || '无可用支付方式！'})
    //   }).catch(rpe => {
    //     this.$message.error({message: '获取支付方式失败！'})
    //   }).finally(() => {
    //     setTimeout(() => {
    //       loading.close()
    //     }, 1000)
    //   })
    // },
    saveAmountRange (fn) {
      this.$http.get(api.saveAmountRange).then(({data}) => {
        if (data.success === 1) {
          data.bankList.forEach(b => {
            b.class = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).class
            b.text = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).text
          })
          this.bankList = data.bankList || []
          data.merBankList.forEach(b => {
            b.class = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).class
            b.text = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).text
          })
          this.merBankList = data.merBankList || []
          data.merNoBankList.forEach(b => {
            b.class = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).class
            b.text = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).text
          })
          this.merNoBankList = data.merNoBankList || []
          if (!this.bankList[0]) this.type = 1
          else return false
          if (!this.merBankList[0]) this.type = 3
          else return false
          if (!this.merNoBankList[0]) this.type = 2
          // this.max = data.max
          // this.min = data.min
        } else {
          this.type = 2
        }
      }).catch(rpe => {
        this.type = 2
      })
    },
    saveRanges (fn) {
      this.$http.get(api.saveRanges, {chanType: 'web'}).then(({data}) => {
        if (data.success === 1) {
          // 网银转帐
          data.bankList.forEach(b => {
            b.class = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).class
            b.text = (BANKS.find(bb => {
              return b.bankCode === bb.apiName
            }) || {}).text
          })
          this.bankList = data.bankList || []
          // data.merBankList.forEach(b => {
          //   b.class = (BANKS.find(bb => {
          //     return b.bankCode === bb.apiName
          //   }) || {}).class
          //   b.text = (BANKS.find(bb => {
          //     return b.bankCode === bb.apiName
          //   }) || {}).text
          // })
          // this.merBankList = data.merBankList || []
          this.epay = []
          // 在线支付 快捷支付 QQ 微信
          let epays = ['bankList:网银转帐', 'online:在线支付', 'unionpay:银联扫码', 'fast:快捷支付', 'qqwallet:QQ钱包', 'weixin:微信支付', 'zfb:支付宝', 'jd:京东支付', 'zfb2Bank:支付宝转帐', 'zfbwap:支付宝H5']
          epays.forEach(m => {
            data[m.split(':')[0]] && data[m.split(':')[0]].forEach(f => {
              f.channelCodes.forEach(b => {
                b.class = (BANKS.find(bb => {
                  return b.bankCode === bb.apiName
                }) || {}).class
                b.text = (BANKS.find(bb => {
                  return b.bankCode === bb.apiName
                }) || {}).text
              })
            })
            if (data[m.split(':')[0]] && data[m.split(':')[0]][0]) this.epay.push({title: m.split(':')[1], more: data[m.split(':')[0]]})
          })
          // 在线支付
          // data.online.forEach(f => {
          //   b.channelCodes.forEach(b => {
          //     b.class = (BANKS.find(bb => {
          //       return b.bankCode === bb.apiName
          //     }) || {}).class
          //     b.text = (BANKS.find(bb => {
          //       return b.bankCode === bb.apiName
          //     }) || {}).text
          //   })
          // })
          // this.online = data.online || []

          // // 在线支付
          // data.online.forEach(f => {
          //   b.channelCodes.forEach(b => {
          //     b.class = (BANKS.find(bb => {
          //       return b.bankCode === bb.apiName
          //     }) || {}).class
          //     b.text = (BANKS.find(bb => {
          //       return b.bankCode === bb.apiName
          //     }) || {}).text
          //   })
          // })
          // this.online = data.online || []

          // data.merNoBankList.forEach(b => {
          //   b.class = (BANKS.find(bb => {
          //     return b.bankCode === bb.apiName
          //   }) || {}).class
          //   b.text = (BANKS.find(bb => {
          //     return b.bankCode === bb.apiName
          //   }) || {}).text
          // })

          this.merNoBankList = data.merNoBankList || []
          // if (!this.bankList[0]) {
          this.type = 3
            // console.log
          if (this.epay[0]) this.selectBank = this.epay[0].more[this.radioIndex || 0].channelCodes[0]
          // } else return false
          if (!this.epay[0]) this.type = 2
          // this.max = data.max
          // this.min = data.min
        } else {
          this.type = 2
        }
      }).catch(rpe => {
        this.type = 2
      })
    },
    commit (fn) {
      this.Qr = ''
      // if (this.selectBank.class === 'wepay' && (this.amount + '').indexOf('.') === -1) {
      //   return this.$modal.warn({
      //     content: '为了提高微信充值成功率，充值金额需为小数！',
      //     btn: ['确定']
      //   })
      // }
      let loading = this.$loading({
        text: '充值申请中...',
        target: this.$el
      }, 10000, '充值申请超时...')
      this.$http.post(api.commit, {
        chanType: 'web',
        saveType: this.type > 2 ? this.epay[this.type - 3].more[this.radioIndex].saveType : '',
        merType: this.type > 2 ? this.epay[this.type - 3].more[this.radioIndex].tongdCode : '',
        bankCode: this.selectBank.bankCode,
        amount: this.amount,
        cardName: this.name
      }).then(({data}) => {
        if (data.success === 1) {
          // if (this.type === 0) {
          if (this.type >= 3 && (this.epay[this.type - 3].title === '网银转帐' || this.epay[this.type - 3].title === '支付宝转帐')) {
            data = data.data
            this.dataXamount = data.amount
            this.dataXbankName = data.bankName
            this.dataXcardName = data.cardName
            this.dataXcardNum = data.cardNum
            this.dataXorderId = data.orderId
            this.dataXappendix = data.appendix
            this.dataXnow = true
            this.Phref[0] = data.payUrl
            if (this.epay[this.type - 3].title === '支付宝转帐') {
              this.Pbtn = ['进入支付宝']
            } else this.Pbtn = ['进入网上银行']
            // 在线充值 附言
            // let contentString = '<div style="text-align: left; font-size: .16rem; line-height: .3rem; color: #666; user-select: text;"><p>充值总额：' + data.amount + '' + '</p>' +
            //  '<p>银行信息：' + data.bankName + '' + '</p>' +
            //  '<p>户名：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.cardName + '' + '</p>' +
            //  '<p>卡号：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.cardNum + '' + '</p>' +
            //  '<p>订单号：&nbsp;&nbsp;&nbsp;' + data.orderId + '' + '</p>' +
            //  '<p>附言：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + data.appendix + '<span class=" ds-button text-button green" v-clipboard="\'hello\'" @success="copySuccess" @error="copyError">复制</span>' + '</p></div>'
            // this.$modal.success({
            //   content: contentString,
            //   btn: ['充值成功', '遇到问题'],
            //   target: this.$el,
            //   ok () {
            //     this.type = 2
            //   },
            //   O: this
            // })
          } else if (data.payUrl || data.href) {
            // 第三方充值
            // 第三方充值 二维码支付
            if (data.payUrl) {
              this.Qr = data.payUrl
              this.show = true
              this.pt_ = this.time_
            // 第三方充值 链接跳转
            } else {
              this.$modal.warn({
                content: '立即跳转到第三方去充值？',
                btn: ['进入网上银行'],
                href: [data.href],
                target: this.$el,
                ok () {
                  this.$modal.question({
                    content: '是否已经充值成功？',
                    target: this.$el,
                    btn: ['充值成功', '遇到问题'],
                    ok () {
                      this.type = 2
                    },
                    O: this
                  })
                },
                O: this
              })
            }
          }
        } else {
          this.$message.error({message: data.msg || '充值请求提交失败， 请重试！'})
        }
      }).catch(rpe => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 500)
      })
    },
    topUpNow () {
      if (!this.amount) this.$el.querySelector('input').focus()
      if (this.amount <= 0) return this.$message.warning({message: '请输入充值金额!'})
      if (this.amount > this.max || this.amount < this.min) return this.$message.warning({message: '充值金额过小或过大，请检查!'})
      if (!this.selectBank.bankCode) return this.$message.warning({message: '请选择支付方式!'})
      if (this.type >= 3 && this.epay[this.type - 3].title === '支付宝转帐' && !this.name) return this.$message.warning({message: '请输入您支付宝真实姓名!'})
      this.commit()
    }
    // 在线充值*************
    // 获取银行列表
    // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=getBankList&saveType=1
    // getBankList: '/person/recharge.do?method=getBankList',
    // 校验充值金额范围
    // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=saveAmountRange&bankCode=icbc&saveType=1
    // saveAmountRange: '/person/recharge.do?method=saveAmountRange',

    // 提交充值请求道第三方
    // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=commit&bankCode=icbc&amount=0.01&saveType=1
    // commit: '/person/recharge.do?method=commit',
    // 系统支持充值方式
    // http://192.168.169.44:9901/cagamesclient/person/recharge.do?method=getEnableSaveType
    // getEnableSaveType: '/person/recharge.do?method=getEnableSaveType'
    // getEnableSaveType (fn) {
    //   this.$http.get(api.getEnableSaveType).then(({data}) => {
    //     if (data.success === 1) {
    //       this.enableSaveType = data.enableSaveType
    //     } else {
    //       this.$message.error({message: data.msg || '获取充值方式失败！'})
    //     }
    //   }).catch(rpe => {
    //     this.$message.error({message: '获取充值方式失败！'})
    //   })
    // }
  },
  components: {
    Modal
  }
}
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'

  .ds-radio-label
    color #999
  .ds-radio-label.active
    color BLUE

  .form
    font-size .14rem
  .item
    margin .1rem 0

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
      // line-height .25rem
      vertical-align top

  .scroll-content
    top TH
  .me-topup
    padding 0 PWX PWX PWX
    .ds-radio-label
      padding 0 .1rem
    .banks
      display inline-block
      margin 0
      max-width 90%
      vertical-align top
    .more
      text-align center
      font-weight bold
      color BLUE
      line-height .4rem
      border none
      background-color #ebf7ff
      border 1px solid rgba(0,0,0,0)
      &:hover
        border 1px solid BLUE
      &:active
        background-color #d2e8f6
        border 1px solid BLUE
        // border none

  .el-button-group
    float right

  .el-icon-close
    padding .05rem .1rem
    font-size .18rem
    color LIGHT
    &:hover
      color #fff
      background-color DANGER-HOVER
    &:active
      color #fff
      background-color DANGER-ACTIVE
  .refresh
    position absolute
    top .55rem
    left .13rem
    radius()
    background-color #f3f3f3
    shadow()
    font-size .12rem
    color #666
    text-shadow none
    &:hover
      background-color #fff
  .modal
    position absolute
    top 0
    bottom 0
    left 0
    right 0
    text-align center
    z-index 9999

    .mask
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      opacity .5
      background #000
      z-index 9998
    .box-wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      text-align center
      z-index 9999
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
      background-color #fff
      font-size .12rem
      width 4.5rem
      radius()
    .content
      text-align center
      margin 0 .2rem
      .el-row
        margin PW 0
      .textarea-label
        position relative
        margin .3rem .3rem .3rem 0
        .label
          position absolute
          left 0
          top .05rem
        .el-textarea
          display inline-bock
          vertical-align top
          padding-left .6rem
          .textarea
            font-size .12rem
</style>
