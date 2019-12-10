<template lang="jade">
.activity-report-detail.scroll-content
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .table-list(style="padding: .15rem .2rem 0 ")
        el-table.header-bold.nopadding(:data="data" ref="table" stripe v-bind:max-height="MH")
          //- userName  String  用户名
          //- chessAmount double  棋牌金额
          //- chessCount  double  棋牌人数
          //- egameAmount double  电游金额
          //- egameCount  double  电游人数
          //- fishingAmount double  捕鱼金额
          //- fishingCount  double  捕鱼人数
          //- ltrAmount double  彩票金额
          //- ltrCount  double  彩票人数
          //- sportAmount double  体育金额
          //- sportCount  double  体育人数
          //- totalAmount double  总金额
          //- totalCount  double  总人数
          //- videoAmount double  真人金额
          //- videoCount  double  真人人数
          el-table-column(class-name="" prop="userName" label="用户名" align="center" fixed)
            template(scope="scope")
              span(:class=" scope.row.userName === ME.account && 'text-danger' ") {{ scope.row.userName }}
              
          el-table-column(class-name="" prop="date" label="日期" align="center" fixed)
          el-table-column(class-name="br"  label="彩票" align="center" )

            el-table-column(class-name="row-2 " prop="ltrAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 br" prop="ltrCount" label="人数" align="center" )

          el-table-column(class-name="br" prop="ltrAmount" label="体育" align="center" )
            el-table-column(class-name="row-2 " prop="sportAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 br" prop="sportCount" label="人数" align="center" )
            
          el-table-column(class-name="br" label="真人" align="center" )
            el-table-column(class-name="row-2 " prop="videoAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 pr2 br" prop="videoCount" label="人数" align="center" )

          el-table-column(class-name="br" label="电游" align="center" )
            el-table-column(class-name="row-2 " prop="egameAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 br" prop="egameCount" label="人数" align="center" )

          el-table-column(class-name="br" label="捕鱼" align="center" )
            el-table-column(class-name="row-2 " prop="fishingAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 br" prop="fishingCount" label="人数" align="center" )

          el-table-column(class-name="br" label="棋牌" align="center" )
            el-table-column(class-name="row-2 " prop="chessAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 br" prop="chessCount" label="人数" align="center" )

          el-table-column(label="总计" align="center" )
            el-table-column(class-name="row-2 " prop="totalAmount" label="金额" align="center" )
            el-table-column(class-name="row-2 " prop="totalCount" label="人数" align="center" )

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


</template>

<script>
import setTableMaxHeight from 'components/setTableMaxHeight'
import page from 'components/page'
import api from '../../http/api'
import store from '../../store'
export default {
  mixins: [setTableMaxHeight, page],
  components: {
  },
  name: 'activity-report',
  props: ['stEt', 'id'],
  data () {
    return {
      TH: 80,
      ME: store.state.user,
      un: '',
      pageSize: 10
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
      let loading = this.$loading({
        text: '活动报表详情加载中...',
        target: this.$refs['table'].$el
      }, 10000, '加载超时...')
      this.$http.post(api.activityReportDetail, Object.assign({
        // beginDate String  起始日期
        // endDate String  结束日期
        // pageSize  int 一页大小
        // page  int 页码
        // username  String  用户名
        userId: this.id,
        beginDate: this.stEt[0] && this.stEt[0]._toDayString(),
        endDate: this.stEt[1] && this.stEt[1]._toDayString()

      }, option)).then(({data: {success, items, totalSize}}) => {
        if (success === 1) {
          this.data = items
          this.total = totalSize || this.data.length
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
// 建议不添加scoped， 所有样式最多嵌套2层
.activity-report-detail
  top TH
  .form-filters
    padding .2rem
    .item
      margin 0 .2rem .1rem 0
  
</style>

<style lang="stylus">

.activity-report-detail
  table th[rowspan="2"] .cell
      background none
  
  th.br
    border-right 2px solid #ccc !important
  th.row-2
  th.row-2 .cell
    background #eee
    
</style>