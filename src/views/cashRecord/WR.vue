<template lang="jade">
  .cash-record-WR
    .search-bar.pl20
      SearchConditions(v-bind:showBtnSearch="true" @choiced="choicedSearchCondition" @search="search")

    el-table.header-bold.nopadding(:data="data" ref="table"  v-bind:row-key="getRowKeys"
        v-bind:expand-row-keys="expands")
          
      el-table-column(type="expand")
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

      el-table-column(label="状态" align="center")
        template(scope="scope")
          span(:class=" scope.row.statusV.indexOf('失败') !== -1 ? 'text-danger' : 'text-green' " v-if="scope.row.statusV") {{ scope.row.statusV }}

      el-table-column(label="失败原因" prop="description" show-overflow-tooltip=true align="center")
      
      

    el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

</template>

<script>
  import api from 'src/http/api'
  import { BANKS } from 'src/util/static'
  import SearchConditions from 'components/SearchConditions'
  export default {
    name: 'cash-record-WR',
    data () {
      return {
        stepIndex: 0,
        tabIndex: 1,
        SSS: ['process', 'success', 'error'],
        SS: ['中...', '成功', '失败'],
        S: ['出款中', '出款失败', '成功'],
        V: ['审核中', '审核通过', '审核失败'],
        // 要展开的行，数值的元素是row的key值
        expands: [],
        // pageSize: 20,
        startDate: '',
        endDate: ''
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
        this.$http.post(api.queryWithdraw, Object.assign({
        }, option)).then(({data: {success, withdrawData, totalSize}}) => {
          if (success === 1) {
            this.data = withdrawData
            this.total = totalSize || this.data.length
            cb()
            this.data.forEach((c, i) => {
              c.index = i
              c.cardNo = '*****' + c.cardNo.slice(-4)
              c.statusV = c.isverify === 1 ? this.S[c.status] : this.V[c.isverify]
              c.class = (BANKS.find(b => b.apiName === c.apiName) || {})['class']
            })
            // 在这里你想初始化的时候展开哪一行都可以了
            this.expands.push(0)
          }
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      getRowKeys (row) {
        return row.index
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

.cash-record-WR
  padding .1rem .2rem
  .search-bar
    background-color #fff
    line-height 0.7rem
</style>