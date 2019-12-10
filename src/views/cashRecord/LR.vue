<template lang="jade">
  .cash-record-LR

    .search-bar.pl20
      SearchConditions(v-bind:showBtnSearch="true" @choiced="choicedSearchCondition" @search="search")

    .notice(style="margin: 0.2rem 0 .2rem 0")
      span.title 温馨提示：
      p.content
        | 一般情况
        span.text-blue 充值
        | 为
        span.text-danger 1-2分钟
        | 之内到账;
        br
        | 因为银行或第三方网络延迟，如果超过5分钟没有到账，可以填写催到账申请（每个记录只有一次机会可申请催到账），或直接联系客服。

    el-table.header-bold.nopadding(:data="data" style="margin: .2rem 0" stripe ref="table")
      el-table-column(prop="payerTime" label="充值时间" class-name="pl2")

      el-table-column(prop="bankName" label="银行" )

      el-table-column(prop="payerRealAmount" label="金额"  align="right")

      el-table-column(prop="payerTransferFee" label="手续费"  align="right")

      el-table-column(label="状态" align="center")
        template(scope="scope")
          span(:class="{ 'text-green': scope.row.isDone === '充值成功', 'text-danger': scope.row.isDone !== '充值成功' }") {{  scope.row.isDone}}

      el-table-column(label="操作" align="center")
        template(scope="scope")
          span.ds-button.text-button(:class="{ blue: scope.row.errorEntry === '0', 'light wg': scope.row.errorEntry !== '0' }" v-if="scope.row.isDone !== '充值成功'" @click="showReq(scope.row)" style="padding: 0") 催到账

    el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")


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

</template>

<script>
  import api from 'src/http/api'
  import page from 'components/page'
  import { BANKS } from 'src/util/static'
  import SearchConditions from 'components/SearchConditions'
  export default {
    mixins: [page],
    name: 'cash-record-LR',
    data () {
      return {
        data: [],
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

        startDate: '',
        endDate: ''
      }
    },
    computed: {
      Cbank () {
        return this.ALLBANKS[this.CbankIndex]
      }
    },
    components: {
      SearchConditions
    },
    mounted () {
      this.list()
    },
    methods: {
      list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        this.$http.post(api.qryRecharge, Object.assign({
        }, option)).then(({data: {success, payRecordData, totalSize}}) => {
          if (success === 1) {
            this.data = payRecordData
            this.total = totalSize || this.data.length
            cb()
          }
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
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
          payTime: this.Ctime,
          paymentId: this.row.billNo,
          getName: this.CRname
        }).then(({data}) => {
          if (data.success === 1) {
            loading.text = '恭喜您，催账成功！'
            this.CbankIndex = undefined
            this.Cname = ''
            this.Ccardno = ''
            this.Camount = 0
            this.CRname = ''
            this.Cid = ''
            this.Ctime = ''
            this.Cmore = ''
            this.showRequest = false
            this.list()
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
      choicedSearchCondition (i, dates) {
        this.startDate = dates.startDateStr
        this.endDate = dates.endDateStr
      },
      search () {
        this.list({page: 1, pageSize: this.pageSize, startDate: this.startDate, endDate: this.endDate})
      }
    }
  }
</script>

<style lang="stylus">

.cash-record-LR
  padding .1rem .2rem
  .item
    margin .1rem 0
  .modal .content
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
  .search-bar
    line-height 0.7rem

</style>