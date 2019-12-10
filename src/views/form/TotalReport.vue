<template lang="jade">
  .total-report
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content

      .form.form-filters

        label.item 用户 
          input.ds-input.small(v-model="un" style="width: 1rem")
        
        label.item 时间&nbsp;
          el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")

        
        .ds-button.primary.large.bold(@click="list()") 搜索
        //- .buttons(style="margin-left: .3rem")
        
      
      .table-list(style="padding: .15rem .2rem ")
        p(style="margin: 0 0  .15rem 0")
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '自己' : B.userName }}
      
        el-table.header-bold.nopadding(:data="data"  ref="table" stripe  v-bind:max-height=" MH " @cell-click="cellClick" )

          el-table-column(class-name="pl2" prop="userName" label="用户名" fixed)
            template(scope="scope")
              span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === ME.account } ") {{ scope.row.userName }}
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
          el-table-column(class-name="" prop="userPoint" label="返点级别" width="60" align="center")
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
          el-table-column(class-name="" prop="activityAmount" label="活动" align="right")
          el-table-column(class-name="" prop="platfee" label="平台费" align="right")
          el-table-column(class-name="" prop="totSettle" label="总结算" align="right")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.totSettle._l0(), 'text-green': scope.row.totSettle._o0() } ") {{ scope.row.totSettle }}
              
          el-table-column(label="操作" align="center")
              template(scope="scope")
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop=" (userName = scope.row.userName) && (did = scope.row.userId) ") 明细


      
      el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

    
    .modal.inner-modal(v-if="did" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon="close" @click.native=" did = '' ")
          TotalReportDetail(:stEt="stEt" v-bind:id="did" v-bind:userName="userName")

      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import TotalReportDetail from './TotalReportDetail'
  import api from '../../http/api'
  import store from '../../store'
  import page from 'components/page'
  export default {
    mixins: [setTableMaxHeight, page],
    components: {TotalReportDetail},
    data () {
      return {
        TH: 270,
        ME: store.state.user,
        BL: [
          {title: '自己'},
          {}
        ],
        un: '',
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
            text: '最近二个月',
            onClick (picker) {
              const end = new Date()._setHMS('23:59:59')
              const start = new Date()._setHMS('0:0:0')
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now() || (time.getTime() + 3600 * 1000 * 24 * 60) < Date.now()
          }
        },
        stEt: [new Date()._setD(1)._setHMS('0:0:0'), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
        did: '',
        userName: ''
      }
    },
    computed: {
    },
    mounted () {
      this.list()
    },
    methods: {
      cellClick (row, column, cell, event) {
        if (column.property === 'userName') {
          this.list(undefined, undefined, row.userId)
        }
      },
      link (B, i) {
        this.list(undefined, undefined, B.userId)
      },
      list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }, id) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        this.$http.post(api.totalReport, Object.assign({
          beginDate: this.stEt[0] ? this.stEt[0]._toDayString() : '',
          endDate: this.stEt[1] ? this.stEt[1]._toDayString() : '',
          userId: id || this.BL[this.BL.length - 2].userId,
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
  .total-report
    top TH
    .form
      padding PWX
    .item
      display inline-block
      margin 0 PW .1rem 0


</style>
