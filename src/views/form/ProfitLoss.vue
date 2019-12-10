<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content

      div(v-if=" I === 0 ")
        .form.form-filters

          label.item 用户 
            input.ds-input.small(v-model="name" style="width: 1rem")

          label.item 时间 
            el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
          
          label.item
            .ds-radio-label(:class="{active: ot === 0 }" @click=" ot = 0 " style="padding-right: 0")
              .ds-radio.white
              | 仅显示投注的
            .ds-radio-label(:class="{active: ot === 1 }" @click=" ot = 1 ")
              .ds-radio.white
              | 显示全部

          .ds-button.primary.large.bold(@click="profitList()") 搜索
          //- .buttons(style="margin-left: .3rem")
        .table-list(style="padding: .15rem .2rem ")
          p(style="margin: 0 0 .15rem 0")
            el-breadcrumb(separator=">")
              el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '自己' : B.userName }}

          el-table.header-bold.nopadding(:data="data"  style="; margin: 0"   ref="table" stripe  show-summary v-bind:summary-method="getSummaries" @cell-click="cellClick" v-bind:row-class-name="tableRowClassName"  v-bind:max-height=" MH " @sort-change="sortChange")

            el-table-column(class-name="pl2" prop="userName" label="用户名" )
              template(scope="scope")
                span(:class=" { 'text-danger': scope.row.userName === me.account, 'pointer text-blue': scope.row.hasSub } ") {{ scope.row.userName }}

            el-table-column(prop="userPoint" label="返点级别" align="center" )

            el-table-column(align="right" prop="betAmount" label="投注总额" sortable="custom")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.betAmount) }}

            el-table-column(align="right" prop="pointAmount" label="返点总额" sortable="custom")

            el-table-column(align="right" prop="prizeAmount" label="派奖总额" sortable="custom")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.prizeAmount) }}

            el-table-column(align="right" prop="vrBetAmount" label="VR投注" sortable="custom")
            el-table-column(align="right" prop="vrPointAmount" label="VR返点" sortable="custom")
            el-table-column(align="right" prop="vrPrizeAmount" label="VR派奖" sortable="custom")


            el-table-column(align="right" prop="activityAmount" label="彩票活动" sortable="custom")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.activityAmount) }}

            el-table-column(align="right" prop="salaryAmount" label="工资" sortable="custom")
              template(scope="scope")
                span {{ numberWithCommas(scope.row.salaryAmount) }}


            el-table-column(align="right" prop="settleAmount" label="总盈亏"  sortable="custom")
              template(scope="scope")
                span(:class=" {'text-green': scope.row.settleAmount && scope.row.settleAmount._o0(), 'text-danger': scope.row.settleAmount && scope.row.settleAmount._l0() } ")  {{ scope.row.settleAmount &&scope.row.settleAmount._nwc() }}
                

            el-table-column(prop="userpoint" label="操作" align="center")
              template(scope="scope")
                .ds-button.text-button.blue( style="padding: 0 .05rem" @click.stop="(showDetail = true) && profitDetail(undefined, undefined, scope.row.userId)") 明细

          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

      Stock(v-if=" I === 1 ")
      TStock(v-if=" I === 2 ")

    .modal(v-show="showDetail" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon="close" @click="showDetail = ''")
          .table-list(style="padding: .15rem .2rem ")

            el-table.header-bold.nopadding(:data="cdata" stripe  ref="itable" v-bind:summary-method="getSummaries"  max-height="500" v-bind:row-class-name="tableRowClassName" style="margin: .2rem 0 0 0;")

              el-table-column(class-name="pl2" prop="userName" label="用户名" )
                template(scope="scope")
                  span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === me.account } ") {{ scope.row.userName }}

              el-table-column(prop="date" label="日期" align="center")

              el-table-column(align="right" prop="betAmount" label="投注总额" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.betAmount) }}

              el-table-column(align="right" prop="pointAmount" label="返点总额")

              el-table-column(align="right" prop="prizeAmount" label="派奖总额" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.prizeAmount) }}

              el-table-column(align="right" prop="vrBetAmount" label="VR投注" )
              el-table-column(align="right" prop="vrPointAmount" label="VR返点" )
              el-table-column(align="right" prop="vrPrizeAmount" label="VR派奖" )


              el-table-column(align="right" prop="activityAmount" label="彩票活动")
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.activityAmount) }}

              el-table-column(align="right" prop="salaryAmount" label="工资" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.salaryAmount) }}


              el-table-column(align="right" class-name=" pr2 " prop="settleAmount" label="总盈亏"  min-width="120")
                template(scope="scope")
                  span(:class=" {'text-green': scope.row.settleAmount && scope.row.settleAmount._o0(), 'text-danger': scope.row.settleAmount && scope.row.settleAmount._l0() } ") {{ scope.row.settleAmount &&scope.row.settleAmount._nwc() }}

            el-pagination(:total="ctotal" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="ccurrentPage" small v-if=" ctotal > pageSize " v-on:current-change="cpageChanged")


</template>

<script>
  import Stock from '../group/Stock'
  import TStock from '../group/TStock'
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import ProfitLossDetail from './ProfitLossDetail'
  import { numberWithCommas } from '../../util/Number'
  // import { dateFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  export default {
    mixins: [setTableMaxHeight],
    components: {
      ProfitLossDetail,
      Stock,
      TStock
    },
    data () {
      return {
        TH: 270,
        numberWithCommas: numberWithCommas,
        me: store.state.user,
        clearableOnTime: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近二个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        // stEt: [new Date()._setD(new Date().getDate() > 15 ? 16 : 1)._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        BL: [
          {title: '自己'},
          {}
        ],
        name: '',
        I: 0,
        cdata: [],
        ctotal: 0,
        ccurrentPage: 1,
        cpreOptions: {},
        ot: 0,
        orderBy: 'betAmount',
        ascOrDesc: 1,
        totalJson: {},
        showDetail: ''
      }
    },
    computed: {
    },
    watch: {
      I () {
        if (this.I === 0) {
          setTimeout(this.profitList)
        }
      },
      ot () {
        this.profitList()
      }
    },
    mounted () {
      this.profitList()
    },
    methods: {
      sortChange ({ column, prop, order }) {
        this.ascOrDesc = order === 'ascending' ? 2 : 1
        this.orderBy = prop
        this.profitList()
      },
      sm (a, b) {
        console.log(a, b, '???')
        return a - b
      },
      __setProfitLossI (I) {
        this.I = I
      },
      getSummaries (param) {
        const { columns } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '团队总计'
            return
          } else {
            sums[index] = numberWithCommas(this.totalJson[column.property])
          }
        })
        return sums
      },
      pageChanged (cp) {
        this.profitList(cp, () => {
          this.currentPage = cp
        })
      },
      cpageChanged (cp) {
        this.profitDetail(cp, () => {
          this.ccurrentPage = cp
        })
      },
      cellClick (row, column, cell, event) {
        if (column.property === 'userName' && row.hasSub) {
          // this.BL.push({
          //   id: row.userId,
          //   title: row.userName
          // })
          this.name = row.userName
          this.profitList(undefined, undefined, row.userId)
        }
      },
      link (B, i) {
        // if (i !== B.length - 1) {
          // this.BL = this.BL.slice(0, i + 1)
          // this.profitList()
        // }
        this.name = i === 0 ? '' : B.userName || ''
        this.profitList(undefined, undefined, B.userId)
      },
      // 盈亏报表列表
      // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=list&startDay=20170101&endDay=20170301
      // profitList: api + 'report/profit.do?method=list',
      // api.getTeamProfit
      profitList (page, fn, id) {
        this.totalJson = {}
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            beginDate: new Date(this.stEt[0])._toDayString(),
            endDate: new Date(this.stEt[1])._toDayString(),
            userId: id || this.BL[this.BL.length - 2].userId,
            parentId: this.zone !== '' ? this.zone + 1 : '',
            username: this.name,
            // orderType: this.S === '' ? '' : this.S + 1,
            // sort: this.btos === '' ? 2 : this.btos + 1,
            page: 1,
            pageSize: this.pageSize,
            listAll: this.ot,
            orderBy: this.orderBy || '',
            ascOrDesc: this.ascOrDesc || ''
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.myget(api.profitList, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            if (data.items.filter(x => x.userName === '团队合计：')[0]) {
              this.totalJson = data.items.pop()
            }
            // data.items[1] && (data.items[data.items.length - 1].lst = true)
            this.data = data.items
            this.BL = (data.userBreads).concat([{}])
            this.total = data.totalSize || this.data.length
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            // this.data = data.subUserProfit
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            // this.summary()
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      // 盈亏详情列表（按用户和时间范围查询）
      // http://192.168.169.44:9901/cagamesclient/report/profit.do?method=detail&destUserId=2&startDay=20170101&endDay=20170301
      // profitDetail: api + 'report/profit.do?method=detail',
      profitDetail (page, fn, id) {
        this.cdata = []
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['itable'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.cpreOptions = {
            userId: id,
            page: 1,
            pageSize: this.pageSize,
            beginDate: new Date(this.stEt[0])._toDayString(),
            endDate: new Date(this.stEt[1])._toDayString()
          }
        } else {
          this.cpreOptions.page = page
        }
        this.$http.myget(api.profitDetail, this.cpreOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            this.cdata = data.items
            this.ctotal = data.totalSize || this.data.length
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      tableRowClassName (row, index) {
        // if (this.me.account === row.userName) return 'text-danger'
        if (row.lst) return 'lst-row lst-row-greybg'
      }
    }
  }
</script>



<style lang="stylus" scoped>
  @import '../../var.stylus'
  .stock-list
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0


  .el-select
  .el-input-number
    width 1rem

</style>


<style lang="stylus" scoped>

  @import '../../var.stylus'

  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
  .tool-bar
    height TH
    line-height TH
    background-color bg
    font-size .12rem
    border-top-right-radius .05rem
    border-top-left-radius .05rem
    overflow hidden
    background-position .2rem center

  .title
    color #333
    font-weight bold
    padding-left .2rem

  .el-button-group
    float right
    height 100%
    .el-button
      font-size .12rem
      color GREY
      border none
      height 100%
      width TH
      padding 0
      background-color transparent
      &:hover
        background-color bg-hover
      &:active
        background-color bg-active
      &:first-child
        font-size .16rem
      &.close
        &:hover
          background-color #f34
          color #fff
        &:active
          color #fff
          background-color #d40c1d

  .modal
    position absolute
    top TH
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
      background-color #ededed
      font-size .12rem
      width 9rem
      radius()
    .content
      margin 0 .2rem
      .el-row
        margin PW 0
        word-wrap break-word
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