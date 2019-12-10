<template lang="jade">
.my-report-record
  slot(name="cover")
  slot(name="movebar")
  slot(name="resize-x")
  slot(name="resize-y")
  slot(name="toolbar")
  .scroll-content
    .search-bar.pl20(v-show=" [0].indexOf(I) == -1 ")
        SearchConditions(v-bind:showBtnSearch="true" @choiced="choicedSearchCondition" @search="search")

    template(v-if=" I === 0 ")
      el-table.header-bold.nopadding(:data="profitAndLossSummaryData" style="margin: .2rem 0" stripe ref="table")  
        el-table-column(v-bind:prop="k" v-bind:label="v" v-for="(v, k, i) in profitAndLossSummaryTableColumn" v-bind:class-name="i === 0 ? 'pl2' : ''")
          template(scope="scope")
            span(:class="getCellClass(scope.row[k], profitAndLossSummaryAmountProp.indexOf(k) !== -1)") {{tableCellDataFormat(profitAndLossSummaryAmountProp, k, scope.row)}}

    template(v-if=" [1, 2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 ")
      el-table.header-bold.nopadding(:data="otherCommonReportData" style="margin: .2rem 0" stripe ref="table2")  
        el-table-column(prop="date" label="日期" class-name="pl2" )
          template(scope="scope")
            span {{scope.row.date}}

        el-table-column(prop="buy" label="投注" )
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp, "buy", scope.row)}}

        el-table-column(prop="prize" label="中奖" v-if="I === 1")
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp, "prize", scope.row)}}

        el-table-column(prop="point" label="返点" v-if="I === 1 && showUserPointColumn")
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp, "point", scope.row)}}

        el-table-column(prop="gameProfit" label="游戏盈亏" )
          template(scope="scope")
            span(:class="getCellClass(scope.row.gameProfit, true)") {{tableCellDataFormat(amountColumnProp, "gameProfit", scope.row)}}

        el-table-column(prop="salary" label="日工资" v-if="I === 1 && showSalary" )
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp,"salary", scope.row)}}    

        el-table-column(prop="point" label="返水" v-if="[2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 && showUserPointColumn")
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp, "point", scope.row)}}

        el-table-column(prop="reward" label="活动")
          template(scope="scope")
            span {{tableCellDataFormat(amountColumnProp, "reward", scope.row)}}

        el-table-column(prop="totalProfit" label="总盈亏" )
          template(scope="scope")
            span(:class="getCellClass(scope.row.totalProfit, true)") {{tableCellDataFormat(amountColumnProp, "totalProfit", scope.row)}}

    el-pagination(:total="totalSize" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="curPage" small v-if=" totalSize > 20 " v-on:current-change="pageChanged")

</template>

<script>
import api from 'src/http/api'
import { dateFormat } from '../../util/Date'
import SearchConditions from 'components/SearchConditions'
import { numberWithCommas } from '../../util/Number'
import store from '../../store'
export default {
  components: {
    SearchConditions
  },
  name: 'my-game-record',
  props: ['menus'],
  data () {
    return {
      me: store.state.user,
      I: 0,
      stEt: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date(new Date().getTime())],
      pageSize: 20,
      curPage: 0,
      totalSize: 0,
      profitAndLossSummaryAmountProp: ['ltrsettle', 'chesettle', 'litsettle', 'vidsettle', 'egamesettle', 'sptsettle', 'fishsettle', 'othltrsettle', 'settlement'],
      profitAndLossSummaryTableColumn: {
        date: '时间',
        ltrsettle: '彩票盈亏',
        chesettle: '棋牌盈亏',
        // litsettle: '微游盈亏',
        vidsettle: '真人盈亏',
        egamesettle: '老虎机盈亏',
        sptsettle: '体育盈亏',
        esptsettle: '电竞盈亏',
        fishsettle: '捕鱼盈亏',
        othltrsettle: '基诺彩盈亏',
        settlement: '总盈亏'
      },

      amountColumnProp: ['buy', 'prize', 'point', 'gameProfit', 'salary', 'reward', 'totalProfit'],

      profitAndLossSummaryData: [],
      personaLotteryData: [],
      otherCommonReportData: [],

      startDate: '',
      endDate: '',

      methodsMap: {
        tab0: 'getPersonalReportSummary',
        tab1: 'getOtherReportData',
        tab2: 'getOtherReportData',
        tab3: 'getOtherReportData',
        tab4: 'getOtherReportData',
        tab5: 'getOtherReportData',
        tab6: 'getOtherReportData',
        tab7: 'getOtherReportData',
        tab8: 'getOtherReportData'
      },

      gameTypeMap: {
        tab0: 0,
        tab1: 0,
        tab2: 6,
        tab3: 3,
        tab4: 2,
        tab5: 1,
        tab6: 5,
        tab7: 4,
        tab8: 7
      },
      curGameType: 0,

      // showSalaryColumn: false,
      showUserPointColumn: false
    }
  },
  computed: {
    showSalary () {
      return this.me.displayPermission.showSalary === 1
    }
  },
  created () {
  },
  mounted () {
    // this.acctSecureInfo((data) => {
    //   this.showSalaryColumn = data.showSalary > 0
    // })
    this.curGameType = this.gameTypeMap['tab' + this.I]
    this[this.methodsMap['tab' + this.I]]()
  },
  methods: {
    __setReportI (i) {
      this.I = i
      this.curGameType = this.gameTypeMap['tab' + this.I]
      this[this.methodsMap['tab' + i]]()
    },
    tableCellDataFormat (columns, prop, row) {
      return columns.indexOf(prop) !== -1 ? this.numberWithCommas(row[`${prop}`]) : row[`${prop}`]
    },
    getCellClass (cloumnV, needColor) {
      return needColor ? {'text-green': parseFloat(String(cloumnV).replace(/[,]/g, '')) > 0, 'text-danger': parseFloat(String(cloumnV).replace(/[,]/g, '')) < 0} : ''
    },
    /**
     * 盈亏汇总数据
     */
    getPersonalReportSummary () {
      let loading = this.$loading({
        text: '盈亏报表加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      this.$http.get(api.personalReport).then(({data: {success, items, totalSize}}) => {
        if (success === 1) {
          if (items.length > 0) {
            items[items.length - 1].date = '合计'
            this.profitAndLossSummaryData = items // items.slice(0, items.length - 1)
          }
        }
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 彩票报表
     */
    getLotteryReportData (params = {}) {
      let loading = this.$loading({
        text: '盈亏报表加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      let p = {
        userId: this.me.userId,
        pageSize: this.pageSize,
        startDay: dateFormat((window.newDate(this.stEt[0])).getTime()).replace(/[-]/g, ''),
        endDay: dateFormat((window.newDate(this.stEt[1])).getTime()).replace(/[-]/g, '')
      }
      Object.assign(p, params)
      this.$http.get(api.personList, p).then(({data: {allDate, success}}) => {
        if (success === 1) {
          this.personaLotteryData = allDate
          setTimeout(() => {
            loading.text = '加载成功!'
          }, 100)
        } else {
          loading.text = '加载失败!'
        }
      }, (rep) => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 第三方游戏（体育，真人....）报表
     */
    getOtherReportData (params = {}) {
      let loading = this.$loading({
        text: '盈亏报表加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      let p = {
        // scope: 0,
        userId: this.me.userId,
        pageSize: this.pageSize,
        gameType: this.curGameType,
        beginDate: dateFormat((window.newDate(this.stEt[0])).getTime()),
        endDate: dateFormat((window.newDate(this.stEt[1])).getTime())
        // startDay: dateFormat((window.newDate(this.stEt[0])).getTime()).replace(/[-]/g, ''),
        // endDay: dateFormat((window.newDate(this.stEt[1])).getTime()).replace(/[-]/g, '')
      }
      Object.assign(p, params)
      this.$http.myget(api.personalProfit, p).then(({data: {items, success, pointLevel}}) => {
        this.otherCommonReportData = []
        if (success === 1 && items.length > 0) {
          this.showUserPointColumn = pointLevel > 0
          items[items.length - 1].date = '合计'
          this.otherCommonReportData = items // items.slice(0, items.length - 1)
          setTimeout(() => {
            loading.text = '加载成功!'
          }, 100)
        } else {
          loading.text = '加载失败!'
        }
      }, (rep) => {
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    choicedSearchCondition (i, dates) {
      this.stEt = [dates.startDate, dates.endDate]
    },
    search () {
      this[this.methodsMap['tab' + this.I]]()
    },
    pageChanged () {
    },
    acctSecureInfo (cb) {
      this.$http.get(api.acctSecureInfo).then(({data}) => {
        if (data.success === 1) {
          this.showSalaryColumn = data.showSalary === '1'
          cb && cb()
        }
      })
    },
    numberWithCommas
  }
}
</script>

<style lang="stylus">
.my-report-record
  .scroll-content
    padding: 0 0.2rem;
  .search-bar
    line-height 0.7rem
  .tb-cell
    text-indent 0.2rem;
</style>
