<template lang="jade">
  .total-report-detail.scroll-content
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content

      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="data"  ref="table" stripe  v-bind:max-height=" MH " )

          el-table-column(class-name="pl2" prop="userName" label="用户名" fixed)
            template(scope="scope")
              span.pointer.text-blue(:class=" { 'text-danger': userName === ME.account } ") {{ userName }}
          //- 用户
            返点级别
            充值
            提款
            彩票投注
            彩票盈亏
            其他投注
            其他盈亏
            总盈亏
            返水
            工资
            活动
            平台费
            总结算
          el-table-column(class-name="" prop="date" label="日期" align="center" fixed)
          //- el-table-column(class-name="" prop="userPoint" label="返点级别" width="60"  align="center")
          el-table-column(class-name="" prop="saveAmount" label="充值总额" align="right")
          el-table-column(class-name="" prop="drawAmount" label="提款总额" align="right")
          el-table-column(class-name="" prop="ltrBet" label="彩票投注" align="right")
          el-table-column(class-name="" prop="ltrProfit" label="彩票盈亏" align="right")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.ltrProfit._l0(), 'text-green': scope.row.ltrProfit._o0() } ") {{ scope.row.ltrProfit }}
              
          el-table-column(class-name="" prop="otherBet" label="其他投注" align="right")
          el-table-column(class-name="" prop="otherProfit" label="其他盈亏" align="right")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.otherProfit._l0(), 'text-green': scope.row.otherProfit._o0() } ") {{ scope.row.otherProfit }}

          el-table-column(class-name="" prop="totProfit" label="总盈亏" align="right")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.totProfit._l0(), 'text-green': scope.row.totProfit._o0() } ") {{ scope.row.totProfit }}

          el-table-column(class-name="" prop="otherPoint" label="返水" align="right" v-if=" ME.showBackWater ")
          el-table-column(class-name="" prop="salaryAmount" label="工资" align="right" v-if=" ME.showSalary ")
            //- template(scope="scope")
              span.text-green(v-if=" scope.row.totSettle._o0 ") +{{ scope.row.totSettle }}

          el-table-column(class-name="" prop="activityAmount" label="活动" align="right")
          el-table-column(class-name="" prop="platfee" label="平台费" align="right")
          el-table-column(class-name="pr2" prop="totSettle" label="总结算" align="right")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.totSettle._l0(), 'text-green': scope.row.totSettle._o0() } ") {{ scope.row.totSettle }}


      
      el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import store from '../../store'
  import page from 'components/page'
  export default {
    mixins: [setTableMaxHeight, page],
    props: ['stEt', 'id', 'userName'],
    data () {
      return {
        TH: 80,
        ME: store.state.user,
        un: ''
      }
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
        this.$http.post(api.totalReportDetail, Object.assign({
          beginDate: this.stEt[0] ? this.stEt[0]._toDayString() : '',
          endDate: this.stEt[1] ? this.stEt[1]._toDayString() : '',
          userId: this.id,
          username: this.un
        }, option)).then(({data: {success, items, totalSize, userBreads}}) => {
          if (success === 1) {
            this.data = items
            this.total = totalSize || this.data.length
            this.BL = userBreads.concat([{}])
            cb()
          }
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .total-report-detail
    top TH
    .form
      padding PWX
    .item
      display inline-block
      margin 0 PW .1rem 0


</style>
