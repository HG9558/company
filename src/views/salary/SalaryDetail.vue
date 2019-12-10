<template lang="jade">
.daysalary-report-detail.scroll-content
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .table-list(style="padding: .15rem .2rem 0 ")
        .info-header 每日明细-{{userName}}(个人)
        el-table.header-bold.nopadding(:data="data" ref="table" stripe v-bind:max-height="MH")

          //- el-table-column(class-name="pl2" prop="userName" label="用户名" )
            template(scope="scope")
              span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === ME.account } ") {{ scope.row.userName }}
          
          el-table-column(class-name="pl2" prop="date" label="销售日期" )
          //- el-table-column(prop="totBuyAmount" label="团队销量"  align="right")
          //- el-table-column(prop="buyAmount" label="有效销量"  align="right")
          el-table-column(prop="totBuyAmount" label="有效销量"  align="right")
          el-table-column(prop="activitUser" label="有效人数"  align="right")
          el-table-column(prop="salaryLevel" label="工资级别"  align="right")
          el-table-column(prop="groupTotalAmount" label="团队工资总额"  align="right")
          el-table-column(prop="subSalary" label="下级工资总额"  align="right")
          el-table-column(class-name="pr2" prop="daySalary" label="个人工资"  align="right")
            //- template(scope="scope")
              span.text-green(v-if=" scope.row.daySalary && scope.row.daySalary._o0()") +{{ scope.row.daySalary }}
            
          //- el-table-column(class-name="pl2 pr2" prop="isDone" label="是否领取")

          //- el-table-column(prop="date" label="日期" )
          //- el-table-column(prop="totBuyAmount" label="团队销量"  align="right")
          //- el-table-column(prop="buyAmount" label="有效销量"  align="right")
          //- el-table-column(prop="subSalary" label="工资总额"  align="right")
          //- el-table-column(prop="daySalary" label="本人工资"  align="right")
          //- el-table-column(class-name="pr2" prop="daySalary" label="本人已领工资"  align="right")
          
        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


</template>

<script>
import setTableMaxHeight from 'components/setTableMaxHeight'
import page from 'components/page'
import api from '../../http/api'
import store from '../../store'
import { MMath, numberWithCommas } from '../../util/Number'
export default {
  mixins: [setTableMaxHeight, page],
  components: {
  },
  name: 'daysalary-report',
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
        text: '下级工资详情加载中...',
        target: this.$refs['table'].$el
      }, 10000, '加载超时...')
      this.$http.post(api.getSalaryById, Object.assign({
        // beginDate String  起始日期
        // endDate String  结束日期
        // pageSize  int 一页大小
        // page  int 页码
        // username  String  用户名
        userId: this.id,
        startDate: this.stEt[0] && this.stEt[0]._toDayString().replace(/-/g, ''),
        endDate: this.stEt[1] && this.stEt[1]._toDayString().replace(/-/g, '')
      }, option)).then(({data: {success, data, totalSize}}) => {
        if (success === 1) {
          // 增加工资总额
          data = data.map((item) => {
            item.groupTotalAmount = MMath.add(String(item.subSalary).replace(/,/g, ''), String(item.daySalary).replace(/,/g, ''))
            item.groupTotalAmount = this.numberWithCommas(item.groupTotalAmount.toFixed(2))
            return item
          })
          this.data = data
          this.total = totalSize || this.data.length
          cb()
        }
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    numberWithCommas
  }
}
</script>

<style lang="stylus" scoped>
@import '../../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.daysalary-report-detail
  top TH
  .form-filters
    padding .2rem
    .item
      margin 0 .2rem .1rem 0
  .info-header
    background-color #2d86ea
    color #fff
    line-height 0.36rem
    text-align center
  table th[rowspan="2"] .cell
    background none
  
</style>
