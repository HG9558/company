<template lang="jade">
.activity-report
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .form.form-filters
        label.item 用户  
            input.ds-input.small(v-model="un" style="width: 1rem")

        label.item 时间 
          el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
        
        .ds-button.primary.large.bold(@click="list()") 搜索

      .table-list(style="padding: .15rem .2rem ")
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
          el-table-column(class-name="pl2" prop="userName" label="用户名" fixed)
            template(scope="scope")
              span(:class=" scope.row.userName === ME.account && 'text-danger' ") {{ scope.row.userName }}

          el-table-column(class-name="row-1 br"  label="彩票" align="center" )

            el-table-column(class-name="row-2" prop="ltrAmount" label="金额" align="center" )
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

          el-table-column(class-name="br" label="总计" align="center" )
            el-table-column(class-name=" row-2 " prop="totalAmount" label="金额" align="center" )
            el-table-column(class-name=" row-2 br" prop="totalCount" label="人数" align="center" )

          el-table-column(label="操作" align="center")
              template(scope="scope")
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop=" did = scope.row.userId ") 明细

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

    .modal.inner-modal(v-if="did" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon="close" @click.native=" did = '' ")
          ActivityReportDetail(:stEt="stEt" v-bind:id="did")

</template>

<script>
import setTableMaxHeight from 'components/setTableMaxHeight'
import page from 'components/page'
import api from '../../http/api'
import store from '../../store'
import ActivityReportDetail from './ActivityReportDetail'
export default {
  mixins: [setTableMaxHeight, page],
  components: {
    ActivityReportDetail
  },
  name: 'activity-report',
  props: [],
  data () {
    return {
      ME: store.state.user,
      un: '',
      stEt: [new Date()._setD(1)._setHMS('0:0:0'), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()._setHMS('23:59:59')
            const start = new Date()._setHMS('0:0:0')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()._setHMS('23:59:59')
            const start = new Date()._setHMS('0:0:0')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()._setHMS('23:59:59')
            const start = new Date()._setHMS('0:0:0')
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      did: ''
    }
  },
  mounted () {
    this.list()
  },
  methods: {
    list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
      let loading = this.$loading({
        text: '活动报表加载中...',
        target: this.$refs['table'].$el
      }, 10000, '加载超时...')
      this.$http.post(api.activityReport, Object.assign({
        // beginDate String  起始日期
        // endDate String  结束日期
        // pageSize  int 一页大小
        // page  int 页码
        // username  String  用户名
        username: this.un,
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
.activity-report
  .form-filters
    padding .2rem
    .item
      margin 0 .2rem .1rem 0
  
  
  
</style>

<style lang="stylus">
.activity-report
  // table th .cell
  // table th
    // background #eee
  table th[rowspan="2"] .cell
      background none
  th.br
    border-right 2px solid #ccc !important
  th.row-2
  th.row-2 .cell
    background #eee
</style>
