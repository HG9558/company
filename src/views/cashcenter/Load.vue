<template lang="jade">
  .me-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .bgc-w.me-topup.scroll-content
      .tab-recharge(v-show="tabIdx === TAB_RECHARGE")
        .notice(style="margin: 0 0 .2rem 0")
          span.title 温馨提示：
          p.content
            | 1.请
            span.text-danger 切勿重复
            | 扫描收款二维码进行付款！
            br
            | 2.请确保发起充值
            span.text-danger 申请金额和付款金额一致！
            | 不要修改付款金额！
            br
            | 3.请实时发起充值申请
            span.text-danger 获取最新
            | 收款方信息！
            br
            | 4.网银转账渠道需要
            span.text-danger 正确填写附言信息！
            | 请你仔细阅读注意事项按照流程进行充值！如您重复扫码/修改充值金额/付款到过期收款方造成资金损失！平台不予处理！感谢您的配合和支持！
            br
            | 5.网银转账和银联扫码赠送的礼金将直接发放到优惠券中，点击使用优惠券，即可活动对应礼金，更多详情请查看优惠活动

        p.fc-o.mb20 友情提示：请优先选择Google谷歌,Firefox火狐,IE浏览器
        p 用户名：
          span.u-name {{me.account}}
        p.mt20 主账户余额：
          span.fc-o.u-balance {{numberWithCommas(me.amoney)}}
          span 元
        nav.pay-type-wp.mt20.tb
          span.tb-cell 支付方式：
          div.btns.tb-cell
            span.ds-icon-bank-card.mr15(v-for=" (pt, i) in payTypes " v-bind:class="{ selected: curPayTypeIdx === i, [getBankConfig(pt.saveWay)]: true }" @click="choicePayType(pt, i)" v-bind:ref="'pay-type-'+pt.saveWay" ) {{ '' }}
        
        .icon-pointer-wp(v-show="canShowPayTypeDetail")
          .icon-pointer.fc-o.el-icon-caret-top(ref="iconPointer")
        
        .pay-type-detail(v-show="canShowPayTypeDetail")
          .tip 提示：充值金额范围 
            i.fc-o(v-html="rechargeRange")
            | ，充值手续费：
            i.fc-o {{perRate}}%
          .bank-ls(v-show="quotaList.length < 1")
            span.ds-icon-bank-card(v-bind:class="{[getBankConfig(bank.bankCode)]: true, selected: curBankIdx === i}" v-for="(bank, i) in bankList" v-bind:key="i" @click="choiceBank(bank, i)")
          .quota-ls(v-show="quotaList.length > 0")
            .btns
              .ds-button.text-button.quota-item.mr15(v-for=" (v, i) in quotaList " v-bind:class="{ selected: quotaIdx === i }" @click="choiceQuota(v, i)" ) {{ v }}
            i.mr20 &nbsp;元
            i 实际到账：
            i.fc-o {{actualAmount}}
            i &nbsp;元

        .tip.ml90.mt20(v-show="!canShowPayTypeDetail") 提示：
          template(v-if="['zfb', 'zfb_base'].indexOf(curPayType.saveWay) !== -1") 付款时请尽量选择支付宝绑定的银行卡付款，使用支付宝余额或余额宝付款可能导致付款失败．<br/>
          | 充值金额范围 
          i.fc-o(v-html="rechargeRange")
          | ，充值手续费：
          i.fc-o {{perRate}}%

        .form
          .item(style="line-height: .5rem" v-if=" canShowTruthName && curPayType.saveWay!='offline'") 支付姓名：&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input(v-model="name" style="width: 1.8rem" v-bind:placeholder="namePlaceHolder")

          .item(v-show="showAmountInput") 充值金额：&nbsp;&nbsp;&nbsp;&nbsp;
            //- el-input-number(v-model="amount" type="number" @keyup.enter.native="topUpNow" v-bind:maxlength="6" v-bind:min="0" v-bind:clearable="true" size="small" @change="amountChange")
            input(class="i-num-input" v-model="amount" type="text" @keyup.enter="topUpNow" v-bind:maxlength="9" @keyup="amountChange" placeholder="请勿输入小数")
            i.mr20 &nbsp;元
            span(v-show="actualAmount > 0")
              i 实际到账：
              i.fc-o {{actualAmount}}
              i &nbsp;元
          .item(style="line-height: .5rem" v-if=" canShowTruthName && curPayType.saveWay=='offline'") 充值姓名：&nbsp;&nbsp;&nbsp;&nbsp;
            input.ds-input(v-model="name" style="width: 2.5rem" placeholder="转账银行卡/支付宝/微信的真实姓名")
          .buttons.mt20(style="margin-left: .85rem;")
            .ds-button.primary.large(@click="topUpNow" v-bind:class="{disable: btnConfirmDisable}") 确认
          //-线下充值
          .item(v-show="curPayType.saveWay=='offline'") 温馨提示：&nbsp;&nbsp;&nbsp;&nbsp;
            .ml90 1.专员代充方式支持银行卡转账、支付宝转银行卡、微信转银行卡。
            .ml90 2.充值填写的姓名和转账银行卡/支付宝/微信的姓名必须一致，否则不能到账。
            .ml90 3.请每次充值时以专员新发银行卡进行充值，不允许私自保留账号进行转账，私自保留账号进行转账造成的损失平台不予负责。
            .ml90 4.线下支付有一定延时，请耐心等待，如果超过 10 分钟还没有到帐，请与客服联系。


      
      .tab-recharge-records(v-if="tabIdx === TAB_RECHARGE_RECORDS")
        .form

          //-label.item 充值时间
            el-date-picker(v-model="st" type="datetime" placeholder="请选择日期时间")
            |  至
            el-date-picker(v-model="et" type="datetime" placeholder="请选择日期时间")

          //-label.item(style="margin-left: .2rem") 状态
            el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .8rem" placeholder="全")
            el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")
          
          .search-wp
            SearchConditions(v-bind:showBtnSearch="true" @choiced="choicedSearchCondition" @search="search")
            //- span.mr10 时间
            //- el-button(v-for="(c, i) in searchConditions" v-bind:class="{selected: curConditionIdx === i}" @click="curConditionIdx = i") {{c}}
            //- .ds-button.primary.large.ml15(@click="search") 搜索

          .notice(style="margin: .2rem 0 .2rem 0")
            span.title 温馨提示：
            p.content
              | 一般情况
              span.text-blue 充值
              | 为
              span.text-danger 1-2分钟
              | 之内到账;
              br
              | 因为银行或第三方网络延迟，如果超过5分钟没有到账，可以填写催到账申请（每个记录只有一次机会可申请催到账），或直接联系客服。

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
                span.ds-button.text-button(:class="{ blue: scope.row.errorEntry === '0', 'light wg': scope.row.errorEntry !== '0' }" v-if="scope.row.isDone !== '充值成功'" @click="showReq(scope.row)" style="padding: 0") 催到账

          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")


    
    .modal(v-show="show" )
      .mask
      .box-wrapper
        .box
          .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
            span.title(style="font-size: .18rem; color #666;") 支付 {{ amount }} 元
            el-button-group
              i.el-icon-close.ds-button.text-button(@click="showResponseConfirmModal" )

          .content
            p.text-black {{ selectBank.text }}扫码支付
            .QR.ds-icon-QR(:style="myQR")
              p(style="padding-top: 1.5rem; position: relative")
                span.refresh.ds-button.small(v-show="pt_ === 0" @click="commit") 重新获取二维码
                span.loading(v-show="pt_ !== 0")
                  span.text-danger {{ this.pt_ }}
                  | 秒后二维码过期
                span.loading(v-show="pt_ === 0")
                  span.text-danger 二维码已过期，请重新获


    Modal(title="" v-bind:Ptype="Ptype" v-show="dataXnow" v-bind:Pbtn="Pbtn " v-bind:Phref="Phref" v-bind:Pclose = "Pclose" v-bind:Pok = "Pok")
      .my-content.text-666(slot="my-content" style="text-align: left; font-size: .16rem; line-height: .3rem; user-select: text;")
        p(v-if="canShowTruthName && curPayType.saveWay === 'zfb2bank'") 支付宝真实姓名：
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
        p(v-if="this.canShowTruthName") 
          span 支付宝
          span 
            .QR.ds-icon-QR.bank-qr-wp(:style="myQR")
        p.rs-modal-btns-wp(v-show="dataXnowStep2")
          el-button(type="success" @click="btnResponseConfirm(1)") 已完成付款
          el-button(type="warning" @click="btnResponseConfirm(2)") 付款失败
          el-button(type="info" @click="btnResponseConfirm(3)") 已取消付款 


    .modal(v-show="showRequest" )
      .mask
      .box-wrapper
        .box(style="width: 6rem")
          .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
            span.title.text-black(style="font-size: .18rem;") 催到账
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

    
    
    
    .modal.res-c-modal.res-confirm-modal(v-show="isShowResponseConfirm" )
      .mask
      .box-wrapper
        .box
          .content
            p.txt 请确认付款结果
            p.finish-wp
              el-button(type="success" @click="btnResponseConfirm(1)") 已完成付款
            p.mt15.faild-wp
              el-button(type="warning" @click="btnResponseConfirm(2)") 付款失败
            p.mt15.cancel-wp
              el-button(type="info" @click="btnResponseConfirm(3)") 已取消付款 

    .modal.res-c-modal.res-confirm-rs-modal(v-show="isShowResponseConfirmRs" )
      .mask
      .box-wrapper
        .box(v-bind:class="{'succ': responseSucc, wait: responseWait, failed: responseFailed}")
          .tool-bar(style="padding: .03rem .08rem 0 .15rem; line-height: .5rem")
            el-button-group
              i.el-icon-close.ds-button.text-button(@click="isShowResponseConfirmRs = false")
          .content
            .status-icon(:class="{'icon-green': responseSucc || responseWait, 'icon-red': responseFailed}")
            .status-succ(v-show="responseSucc")
              p.txt 充值成功
            .status-wait(v-show="responseWait")
              p.txt.t_l 一般情况下，充值到账时间为1-2分钟，有时会因为银行、第三方、网络等原因延迟。如果超过5分钟没有到账，可到充值记录--充值详情中，提交“催到账”申请单，或直接联系客服。
            .status-faild(v-show="responseFailed")
              p.txt.t_l 如果付款失败，请多尝试几次，若仍不成功，请减少充值金额后再次尝试（例如：500 改为 300），或更换其他充值方式进行充值。
            p.finish-wp(v-show="responseSucc || responseWait")
              el-button(type="success" @click="isShowResponseConfirmRs = false") 确定
            p.faild-wp(v-show="responseFailed")
              el-button(type="warning" @click="isShowResponseConfirmRs = false") 确定
            
</template>

<script>
import api from '../../http/api'
import { BANKS } from '../../util/static'
import { dateTimeFormat } from '../../util/Date'
import {numberWithCommas, MMath} from '../../util/Number'
import Modal from 'components/Modal'
import store from '../../store'
import SearchConditions from 'components/SearchConditions'
export default {
  data () {
    return {
      MMath: MMath,
      me: store.state.user,

      tabIdx: 0,
      TAB_RECHARGE: 0,
      TAB_RECHARGE_RECORDS: 1,

      Ptype: 'success',
      Pbtn: ['我知道了,继续充值'],
      Phref: [],
      dataXamount: '',
      dataXbankName: '',
      dataXcardName: '',
      dataXcardNum: '',
      dataXorderId: '',
      dataXappendix: '',
      dataXnow: false,
      O: '',
      dataXnowStep2: false,
      type: 0,

      selectBank: {},
      showAllBank: false,
      amount: '',
      tempOldAmount: '',
      min: 0,
      max: 0,

      /* 充值记录 */
      // 查询条件
      searchConditions: ['今天', '昨天', '前天', '最近一周'],
      curConditionIdx: -1,
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

      // 催账
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

      // 非银行转账类
      epay: [],
      radioIndex: 0,
      name: '',
      curChannelNumCode: '',
      zfbQrCode: '',

      /* 充值 */
      curPayTypeIdx: 0,
      payTypes: [],
      quotaList: [], // 定额
      curPayType: {},
      curBank: null,
      curBankIdx: 0,
      showBankList: false,
      perRate: 0,
      rechargeRange: '',
      canShowPayTypeDetail: false,
      actualAmount: '', // 实际到账
      quotaIdx: 0,
      showAmountInput: true,        // 金额输入
      namePlaceHolder: '请输入您的支付宝真名',

      isShowResponseConfirm: false,   // 支付结果状态确认
      isShowResponseConfirmRs: false,  // 支付结果状态确认完成提示
      responseSucc: false,          // 支付结果-成功
      responseWait: false,           // 支付结果-暂未到账
      responseFailed: false,        // 支付结果-失败

      billNo: ''
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
    banksO () {
      return this.showAllBank ? this.avaibleBanks : this.avaibleBanks.slice(0, 3)
    },
    canShowTruthName () {
      return ['zfb2bank', 'offline'].includes(this.curPayType.saveWay)
    },
    btnConfirmDisable () {
      return !this.amount || this.amount === '0'
    }
  },
  watch: {
    amount () {
      if (this.amount.length > 1 && String(this.amount).indexOf('.') === this.amount.length - 1) return
      if (/^\d+\.?\d{0,2}$/g.test(this.amount)) {
        this.amount = parseFloat(this.amount, 10)
        this.actualAmount = this.MMath.sub(this.amount, this.MMath.mul(this.amount, this.MMath.div(this.perRate, 100))).toFixed(2)
        // setTimeout(() => {
        //   typeof this.amount === 'number' && (this.amount + '') !== (this.amount.toFixed(2)) && (this.amount = (this.amount.toFixed(2)))
        // }, 300)
      } else {
        this.actualAmount = 0
      }
    },
    pt_ () {
      if (this.pt_ === this.time_) {
        let t = setInterval(() => {
          if (this.pt_ > 0) {
            this.pt_--
          } else {
            clearInterval(t)
            this.show && this.showResponseConfirmModal()
          }
        }, 1000)
      }
    },
    selectBank () {
      if (!this.selectBank.bankCode) {
        this.max = 45000
        this.min = 0
      } else {
        this.max = this.selectBank.maxSave
        this.min = this.selectBank.minSave
      }
    },
    radioIndex () {
      // if (this.type < 2 || (this.type > 2 && this.epay[this.type - 3].title === '在线支付') || (this.type > 2 && this.epay[this.type - 3].title === '网银转账') || (this.type > 2 && this.epay[this.type - 3].title === '大额网银')) this.selectBank = {}
    },
    type () {
      // this.amount = 0
      // this.radioIndex = 0
      // if (this.type === 2) this.qryRecharge()
    },
    Ctime () {
      // block8/3 console.log(this.Ctime)
    }
  },
  mounted () {
    this.O = this
    this.saveRanges()
  },
  methods: {
    replaceToNum (v) {
      return String(v).replace(/^0|\D/g, '')
    },
    amountChange (e) {
      if (/^\d+\.?\d{0,2}$/g.test(this.amount) || !this.amount) {
        this.tempOldAmount = this.amount
      } else {
        this.amount = this.tempOldAmount
      }
    },
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
        text: '催账中...',
        target: this.$el
      }, 10000, '催账超时...')
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
          loading.text = '恭喜您，催账成功！'
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
        } else loading.text = data.msg || '不好意思，催账失败！'
      }).catch(rpe => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    queryPayError (page, fn) {
      let loading = this.$loading({
        text: '催账详情获取中...',
        target: this.$el
      }, 10000, '催账详情获取超时...')
      this.$http.get(api.queryPayError, {
        entry: this.row.errorEntry
      }).then(({data}) => {
        if (data.success === 1) {
          this.detail = data
        } else loading.text = data.msg || '催账详情查询失败'
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
      let params = {
        page: page || 1,
        pageSize: this.pageSize
      }
      if (this.st) {
        params.startDate = this.st
      }
      if (this.et) {
        params.endDate = this.et
      }
      this.$http.get(api.qryRecharge, params).then(({data}) => {
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
        // this.Ptype = 'success'
        // this.Phref = []
        // this.name = ''
        !this.dataXnowStep2 && this.showResponseConfirmModal()
      }, 1000)
      return false
    },
    Pok () {
      if (this.Pbtn[0] === '我知道了,继续充值' || this.Pbtn[0] === '进入支付宝') {
        this.Ptype = 'question'
        // this.Pbtn = ['充值成功', '充值失败']
        this.Pbtn = []
        this.dataXnowStep2 = true
        setTimeout(() => {
          this.Phref = []
        }, 1000)
        return false
        // this.showResponseConfirmModal()
      }
      // else {
      //   this.type = 2
      // }
    },
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
      this.$http.get(api.saveRanges, {chanType: 'web'}).then(({data: { success, saveRange }}) => {
        if (success === 1) {
          this.payTypes = saveRange
          if (this.payTypes.length > 0) {
            this.choicePayType(this.payTypes[0], 0)
          }
        }
      }).catch(rpe => {
        // this.$message.error({message: '获取支付方式异常，请刷新重试！'})
      })
    },
    commit (fn) {
      this.Qr = ''
      let bankCode = this.curBank.bankCode
      let loading = this.$loading({
        text: '充值申请中...',
        target: this.$el
      }, 10000, '充值申请超时...')
      let params = {
        chanType: 'web',
        saveWay: this.curPayType.saveWay,
        bankCode: bankCode,
        amount: this.amount
      }
      if (this.canShowTruthName) {
        params.cardName = this.name
      }
      this.$http.post(api.commit, params).then(({data}) => {
        if (data.success === 1) {
          this.billNo = data.billNo
          if (data.data) {
            data = data.data
            this.dataXamount = data.amount
            this.dataXbankName = data.bankName
            this.dataXcardName = data.cardName
            this.dataXcardNum = data.cardNum
            this.dataXorderId = data.orderId
            this.dataXappendix = data.appendix
            this.dataXnowStep2 = false
            this.dataXnow = true
            this.Phref[0] = data.payUrl
            if (this.curBank.bankCode === 'zfb2bank') {
              this.Pbtn = ['进入支付宝']
            } else {
              this.Pbtn = ['我知道了,继续充值']
            }
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
                btn: ['我知道了,继续充值'],
                href: [data.href],
                target: this.$el,
                ok () {
                  this.showResponseConfirmModal()
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
    checkAmoutRange (amount) {
    },
    topUpNow () {
      if (this.btnConfirmDisable) return
      if (this.canShowTruthName && !this.name) return this.$message.warning({message: '请输入您的真实姓名!'})
      if (!this.amount) this.$el.querySelector('input').focus()
      if (this.amount <= 0) return this.$message.warning({message: '请输入充值金额!'})
      if (!this.curPayType.saveWay) return this.$message.warning({message: '请选择支付方式!'})
      // if (this.amount > this.max || this.amount < this.min) return this.$message.warning({message: '充值金额过小或过大，请检查!'})
      // if (!this.selectBank.bankCode) return this.$message.warning({message: '请选择支付方式!'})
      // if (this.type >= 3 && this.epay[this.type - 3].title === '支付宝转账' && !this.name) return this.$message.warning({message: '请输入您支付宝真实姓名!'})
      if (this.curBank.hasOwnProperty('commitAdd') && this.curBank.commitAdd) {
        this.$modal.confirm({
          content: `为了提高充值成功率，有时充值金额需要包含小数，因此系统可能会将您的充值金额随机增加或减少0.01~${this.curBank.commitAdd}元。`,
          btn: ['继续', '取消'],
          ok () {
            this.commit()
          },
          cancel () {
          },
          O: this
        })
      } else {
        this.commit()
      }
    },
    __setLoadI (i) {
      this.tabIdx = i
      if (this.tabIdx === this.TAB_RECHARGE_RECORDS) {
        this.qryRecharge()
      }
    },
    choicePayType (ptype, i) {
      this.curPayTypeIdx = i
      this.curPayType = ptype
      this.bankList = this.curPayType.range
      this.canShowPayTypeDetail = this.checkCanShowPayTypeDetail(this.bankList, this.curPayType.saveWay)
      if (this.curPayType.saveWay === 'weixinquota' || this.curPayType.saveWay === 'zfbquota') {
        let item = this.bankList[0]
        this.quotaList = item.range
        this.amount = this.quotaList[0]
        this.showAmountInput = false
      } else {
        this.amount = ''
        this.showAmountInput = true
        this.quotaList = []
      }
      this.choiceBank(this.bankList[0], 0)
      this.$nextTick(() => {
        let curPayTypeEl = this.$refs[`pay-type-${this.curPayType.saveWay}`][0]
        this.iconPointerPosition(curPayTypeEl.offsetLeft + (curPayTypeEl.offsetWidth / 2))
      })
    },
    checkCanShowPayTypeDetail (bankList = [], payType) {
      // 银行列表人大于1并且列表元素为对象类型, 微信定额
      if (payType === 'weixinquota' || this.curPayType.saveWay === 'zfbquota') return true
      if (bankList.length > 1) {
        return toString.call(bankList[0]) === '[object Object]'
      }
      return false
    },
    choiceBank (bank, i) {
      this.curBankIdx = i
      this.curBank = bank
      this.rechargeRange = this.curBank.range.map((item) => {
        item = item.split('~')
        return `${this.numberWithCommas(item[0])}${item.length > 1 ? ('~' + this.numberWithCommas(item[1])) : ''}`
      }).join(';  &nbsp;')
      this.perRate = this.curBank.fee
    },
    choiceQuota (v, i) {
      this.amount = v
      this.quotaIdx = i
    },
    btnResponseConfirm (type) {
      this.dataXnow = false
      this.queryLoadStatus(this.billNo, type)
    },
    // 查询最终充值结果状态
    queryLoadStatus (billNo, userStat) {
      this.$http.post(api.queryLoadStatus, { method: 'updateBillNew', billNo, userStat }).then(({data: {success, stat}}) => {
        this.isShowResponseConfirm = false
        if (success === 1) {
          this.responseSucc = false
          this.responseWait = false
          this.responseFailed = false
          if (userStat === 1) {
            this.__setCall({fn: '__getUserFund'})
            this.responseSucc = stat === 1
            this.responseWait = stat === 0
            this.responseFailed = stat === 2
            this.isShowResponseConfirmRs = true
          } else if (userStat === 2) {
            this.responseFailed = true
            this.isShowResponseConfirmRs = true
          } else {
            this.isShowResponseConfirmRs = false
          }
        }
      })
    },
    showResponseConfirmModal () {
      this.show = false
      this.dataXnow = false
      this.isShowResponseConfirm = true
    },
    getBankConfig (bankCode) {
      let rs = BANKS.filter((item) => {
        return item.apiName === bankCode
      })
      return (rs && rs[0].class) || ''
    },
    search () {
      this.qryRecharge()
    },
    iconPointerPosition (left) {
      let icon = this.$refs.iconPointer
      icon.style.left = (left - (icon.offsetWidth / 2) - icon.parentElement.offsetLeft) + 'px'
    },
    choicedSearchCondition (i, dates) {
      this.st = dates.startDateStr
      this.et = dates.endDateStr
    },
    numberWithCommas
  },
  components: {
    Modal,
    SearchConditions
  }
}
</script>
<style lang="stylus" scoped>
  @import '../../var.stylus'
  .tb
    display table
  .tb-cell
    display table-cell
  i
    font-style normal
  .ml90
    margin-left 0.9rem
  .flex
    display flex
  .flex-v-c
    align-items center
  .fc-o
    color #f37e0c
  .tab-recharge
    padding 0.2rem 0.36rem
    .text-button:hover
      text-decoration none !important
  .u-name
    padding-left 0.42rem
  .u-balance
    padding 0 0.02rem 0 0.1rem
  .icon-pointer-wp
    position relative
    height 0.14rem
    margin-top -0.1rem
  .icon-pointer
    position absolute
    top 0.04rem
    display none
  textButton() {
    border solid 1px #cccccc
    border-radius 0.05rem
    color #4a4a4a
    background-color #fff
  }
  .ds-icon-bank-card
    width 1.52rem
    margin 0.0745rem
    background-color #fff !important
    background-position 0.1rem center
    border-radius 0.03rem
  .ds-icon-bank-card:not(.static).selected:before
    background-color rgba(243,126,12,0.1)
  .pay-type-wp
    &>span
      width 0.85rem
      float left
      line-height 0.3rem
      vertical-align middle
  .bank-ls
    .ds-icon-bank-card
      background-position left center
  .quota-ls
    .text-button.selected
      border solid 1px #f37e0c
      background-color rgba(243, 126, 12, 0.1)
      color #f37e0c
    .btns
      display inline-block
    .text-button
      &:last-child
        margin-right 0.12rem

  .pay-type-detail
    width 11.86rem
    padding 20px
    min-height 0.6rem
    background-color #f8f8f8
    border solid 1px #e4e4e4
    border-radius 0.05rem
    margin 0rem 0 0.2rem 0.90rem
    .tip
      margin 0 0 0.0745rem 0.0745rem
    .text-button
      textButton()
 
  .bank-qr-wp
    margin-bottom 0 !important
    height 1.5rem !important
  .ds-radio-label
    color #999
  .ds-radio-label.active
    color BLUE

  .form
    font-size .14rem
    .item.mt20
      margin-top 0.2rem
    .primary
      width 1.52rem
      background-color #f37e0c
    .primary
      &.disable,
      &.disable:hover
        background-color #d2d2d2
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

  elButtonSuccess()
    background-color #65c014
    border-color #65c014 
  elButtonWarning()
    background-color #e71c1c
    border-color #e71c1c
  elButtonInfo()
    background-color #444444
    border-color #444444

  .res-c-modal
    .box
        width 4.5rem
        height 2.8rem
        .txt
          margin 0.22rem 0 0.32rem
          font-size 0.18rem
        .el-button
          width 1.7rem
          height 0.3rem
          padding 0
        .el-button--success
          elButtonSuccess()
        .el-button--warning
          elButtonWarning()
        .el-button--info
          elButtonInfo()
  
  .rs-modal-btns-wp
    text-align center
    padding 0.2rem 0 0.3rem 0
    .el-button--success
      elButtonSuccess()
    .el-button--warning
      elButtonWarning()
    .el-button--info
      elButtonInfo()

  .res-confirm-modal
    .box
      width 4.5rem
      height 2.8rem
      .txt
        margin 0.58rem 0 0.32rem
        font-size 0.18rem

  
  .res-confirm-rs-modal
    .box
      // &.wait
      //   height 3.18rem
      // &.failed
      //   height 3.08rem
      .txt
        margin 0.22rem 0 0.32rem
        font-size 0.14rem
    statusIcon($img)
      background url('../../assets/v2/'+$img) center no-repeat
      background-size 0.64rem
    .status-icon
      height 0.64rem
      margin-top 0.4rem
    .icon-green
      statusIcon('icon_successful.png')
    .icon-red
      statusIcon('icon_failing.png')

  .search-wp
    height 0.7rem
    display flex
    align-items center
    .el-button
      min-width 0.8rem
      height 0.3rem
      padding 0
    .el-button:focus,
    .el-button:hover
      border solid 1px #f37e0c
      color #666
    .el-button.selected
      background-image linear-gradient(0deg, #fff3e9 0%, #fffaf6 100%), linear-gradient(#f37e0c, #f37e0c)
      border solid 1px #f37e0c
    .ds-button
      border-radius 0.03rem

  .i-num-input
    line-height .3rem
    color #333
    padding 0 .12rem
    font-size .14rem
    background-color #fff
    border .01rem solid #ccc
    border-radius .02rem
    box-sizing border-box
    &:focus
      border-color #f17d0b
      box-shadow 0 0 0.05rem #f17d0b
    &:hover
      border-color #f17d0b
  .tb-cell
    .ds-icon-bank-card.mr15
      position relative
      &.bank
      &.unionpay
        &:after
          content '送0.7%-1%'
          position absolute
          top -.15rem
          left 20%
          border 1px solid #ccc
          background-color rgba(255,255,255, .8)
          font-size .12rem
          padding 0 .1rem
          color #f37e0c
          
      &.unionpay
        &:after
          content '送0.2%-0.5%'

</style>
