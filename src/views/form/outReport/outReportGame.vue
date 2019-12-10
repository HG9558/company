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

          label.item 用户&nbsp;
            input.ds-input.small(v-model="name" style="width: 1rem")


          label.item 时间&nbsp;
            el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")


          //- label.item 范围&nbsp;
            el-select(clearable v-bind:disabled=" !ZONES[0] "  v-model="zone" style="width: 1rem" placeholder="默认")
              el-option(v-for="(U, i) in ZONES" v-bind:label="U" v-bind:value="i")

          .ds-button.primary.large.bold(@click="profitList()") 搜索


        .table-list(style="padding: .15rem .2rem ")
          p(style="margin: 0 0 .15rem 0")
            el-breadcrumb(separator=">")
              el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '自己' : B.userName }}

          el-table.header-bold.nopadding(:data="data"  style="margin: 0"   ref="table" stripe v-bind:summary-method="getSummaries" @cell-click="cellClick" v-bind:row-class-name="tableRowClassName" v-bind:max-height=" MH " )

            el-table-column(class-name="pl2" prop="userName" label="用户名" )
              template(scope="scope")
                span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === me.account } ") {{ scope.row.userName }}


            el-table-column(align="right" prop="realBuy" label="销量" )
              template(scope="scope")
                span {{ numberWithCommas(scope.row.realBuy) }}


            el-table-column(align="right" prop="profit" label="游戏盈亏" )
              template(scope="scope")
                span {{ numberWithCommas(scope.row.profit) }}

            el-table-column(align="right" prop="getpoint" label="返水" )
              template(scope="scope")
                span {{ numberWithCommas(scope.row.getpoint) }}

            el-table-column(align="right" prop="rewards" label="活动" )
              template(scope="scope")
                span {{ numberWithCommas(scope.row.rewards) }}

            el-table-column(align="right" prop="platfee" label="平台费" )
              template(scope="scope")
                span {{ numberWithCommas(scope.row.platfee) }}

            el-table-column(align="right" prop="settle" label="总结算"  class-name="pr2")
              template(scope="scope")
                span(:class=" {'text-green': scope.row.settle && scope.row.settle._o0(), 'text-danger': scope.row.settle && scope.row.settle._l0() } ")  {{ scope.row.settle &&scope.row.settle._nwc() }}


            el-table-column(prop="userpoint" label="操作" align="center")
              template(scope="scope")
                .ds-button.text-button.blue(style="padding: 0 .05rem" @click.stop="(showDetail = true) && profitDetail(undefined, undefined, scope.row.userId)") 明细

          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

    .modal(v-show="showDetail" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon="close" @click="showDetail = ''")
          .table-list(style="padding: .15rem .2rem ")

            el-table.header-bold.nopadding(:data="cdata" stripe ref="itable"   max-height="500" v-bind:row-class-name="tableRowClassName" style="margin: .2rem 0 0 0")

              el-table-column(class-name="pl2" prop="userName" label="用户名" )
                template(scope="scope")
                  span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === me.account } ") {{ scope.row.userName }}


              el-table-column(prop="date" label="日期" )

              el-table-column(align="right" prop="realBuy" label="销量" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.realBuy) }}


              el-table-column(align="right" prop="profit" label="游戏盈亏" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.profit) }}

              el-table-column(align="right" prop="getpoint" label="返水" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.getpoint) }}

              el-table-column(align="right" prop="rewards" label="活动" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.rewards) }}

              el-table-column(align="right" prop="platfee" label="平台费" )
                template(scope="scope")
                  span {{ numberWithCommas(scope.row.platfee) }}

              el-table-column(align="right" prop="settle" label="总结算"  class-name="pr2")
                template(scope="scope")
                  span(:class=" {'text-green': scope.row.settle && scope.row.settle._o0(), 'text-danger': scope.row.settle && scope.row.settle._l0() } ")  {{ scope.row.settle &&scope.row.settle._nwc() }}

            
            el-pagination(:total="ctotal" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="ccurrentPage" small v-if=" ctotal > pageSize " v-on:current-change="cpageChanged")

</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import ProfitLossDetail from '../ProfitLossDetail'
  import { numberWithCommas } from '../../../util/Number'
  import api from '../../../http/api'
  import store from '../../../store'
  export default {
    mixins: [setTableMaxHeight],
    components: {
      ProfitLossDetail
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
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date()._setD(1)._setHMS('0:0:0'), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        BL: [
          {title: '自己'},
          {}
        ],
        // 平台
        PL: ['BG', '体育'],
        platid: '',
        ZONES: ['直接下级', '所有下级'],
        zone: '',
        name: '',
        SS: ['投注总额', '盈亏金额', '工资总额', '返点级别'],
        S: '',
        btos: '',
        cdata: [],
        ctotal: 0,
        ccurrentPage: 1,
        cpreOptions: {},
        showDetail: false,
        I: 0
      }
    },
    computed: {
    },
    mounted () {
      this.profitList()
    },
    methods: {
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
        if (column.property === 'username') {
          this.profitList(undefined, undefined, row.userId)
        }
      },
      link (B, i) {
        this.profitList(undefined, undefined, B.userId)
      },
      // 盈亏报表列表
      profitList (page, fn, id) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            gameType: 2,
            username: this.name,
            userId: id || this.BL[this.BL.length - 2].userId,
            scope: this.zone !== '' ? this.zone + 1 : '',
            page: 1,
            pageSize: this.pageSize,
            beginDate: this.stEt[0]._toDayString(),
            endDate: this.stEt[1]._toDayString()
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.myget(api.outerReport, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            this.data = data.items
            this.BL = (data.userBreads).concat([{}])
            this.total = data.totalSize || this.data.length
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
      // 盈亏详情列表（按用户和时间范围查询）
      profitDetail (page, fn, id) {
        this.cdata = []
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['itable'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.cpreOptions = {
            gameType: 2,
            username: this.name,
            userId: id,
            scope: this.zone !== '' ? this.zone + 1 : '',
            page: 1,
            pageSize: this.pageSize,
            beginDate: this.stEt[0]._toDayString(),
            endDate: this.stEt[1]._toDayString()
          }
        } else {
          this.cpreOptions.page = page
        }
        this.$http.get(api.outerReportDetail, this.cpreOptions).then(({data}) => {
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
      tableRowClassName (row) {
        // if (this.me.account === row.userName) return 'text-danger'
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../../var.stylus'
  .stock-list
    // top TH
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

  @import '../../../var.stylus'

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