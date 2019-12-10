<template lang="jade">
.my-report-record
  slot(name="cover")
  slot(name="movebar")
  slot(name="resize-x")
  slot(name="resize-y")
  slot(name="toolbar")
  .scroll-content
    .search-bar.pl20
        span.date-wp
          SearchConditions(@choiced="choicedSearchCondition")
        
        label.item.ml10 查询范围 
          el-select(clearable v-model="range" style="width: 1.2rem" popper-class="search-range-slt")
            el-option(v-for="(o, i) in searchRange" v-bind:label="o" v-bind:value="i")

        label.item.ml10 用户&nbsp;
          //- input.ds-input.small(v-model="subUserName" style="width: 1rem")
          el-autocomplete(
            class="inline-input uname-ipt"
            popper-class="username-auto-ipt"
            v-model="subUserName"
            v-bind:fetch-suggestions="querySearchName"
            placeholder="请输入用户名"
            v-bind:maxlength="12"
            v-bind:clearable="true"
            v-on:select="nameHandleSelect"
          )

        .ds-button.primary.large.bold.ml10(@click="search()") 搜索

    template(v-if=" I === 0 ")
      keep-alive
        el-table.header-bold.nopadding(:data="profitAndLossSummaryData" style="margin: .2rem 0" stripe ref="table" v-show="!showThirdGameDetal" v-on:sort-change="sortChange" )  
          el-table-column(v-bind:prop="o.prop" v-bind:label="o.name" v-for="(o, i) in profitAndLossSummaryTableColumn" v-bind:class-name="i === 0 ? 'pl2' : ''" v-bind:sortable="o.sortable" v-bind:width="o.width" align="center" )
            template(slot-scope="scope")
              span(v-bind:class="getCellClass(scope.row[o.prop], o.mcolor)") {{scope.row[o.prop]}}
          el-table-column(label="操作" align="center" )
            template(slot-scope="scope")
              el-button(type="text" size="small" class="fc-o" @click="viewHighterLevel(scope.row)" v-show="scope.row.userName != '合计'") 查看上级
              el-button(type="text" size="small" class="fc-o" @click="viewDetail(scope.row)" v-show="scope.row.userName != '合计'") 明细

      p(v-show="!showThirdGameDetal") 温馨提示：仅保留最近7天的数据
      el-pagination(:total="totalSize" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="curPage" small v-if=" totalSize > pageSize " v-on:current-change="pageChanged" v-show="!showThirdGameDetal")
      keep-alive
        el-table.header-bold.nopadding(:data="thirdGamesDetailData" style="margin: .2rem 0" stripe ref="table" v-show="showThirdGameDetal" v-on:sort-change="thirdGameDetailSortChange")  
          el-table-column(v-bind:prop="o.prop" v-bind:label="o.name" v-for="(o, i) in thirdGamesColumn" v-bind:class-name="i === 0 ? 'pl2' : ''" v-bind:sortable="o.sortable" align="center" )
            template(slot-scope="scope")
              span(v-bind:class="getCellClass(scope.row[o.prop], o.mcolor)") {{scope.row[o.prop]}}
          el-table-column(label="操作" align="center" )
            template(slot-scope="scope")
              el-button(type="text" size="small" class="fc-o" @click="showThirdGameDetal = false" v-show="scope.row.userName != '合计'") 返回上一步
              el-button(type="text" size="small" class="fc-o" @click="viewThirdGameDailyProfitDetail(scope.row)" v-show="scope.row.userName != '合计'") 每日明细

      p(v-show="showThirdGameDetal") 温馨提示：仅保留最近7天的数据

    template(v-if=" [1, 2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 ")
      el-table.header-bold.nopadding(:data="otherCommonReportData" style="margin: .2rem 0" stripe ref="table" v-on:sort-change="sortChange")  
        el-table-column(prop="userName" label="用户名" class-name="pl2")

        el-table-column(prop="buy" label="投注" sortable="custom")

        el-table-column(prop="prize" label="中奖" )

        el-table-column(prop="point" label="彩票返点" v-if="I === 1 && showpoint && showThirdPointColumn")
        el-table-column(prop="point" v-bind:label="otherGamesName[I] + '返水'" v-if="[2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 && showback && showThirdPointColumn")

        el-table-column(prop="gameProfit" label="游戏盈亏" sortable="custom")
          template(scope="scope")
            span(v-bind:class="getCellClass(scope.row.gameProfit, true)") {{scope.row.gameProfit}}

        el-table-column(prop="reward" label="活动" )

        el-table-column(prop="totalProfit" label="总盈亏" sortable="custom")
          template(scope="scope")
            span(v-bind:class="getCellClass(scope.row.totalProfit, true)") {{scope.row.totalProfit}}

        el-table-column(prop="subType" label="下级类型" )

        //- el-table-column(v-bind:prop="o.prop" v-bind:label="o.name" v-for="(o, i) in otherCommonTableColumn" v-bind:class-name="i === 0 ? 'pl2' : ''" v-bind:sortable="o.sortable")
        //-   template(slot-scope="scope")
        //-     span(v-bind:class="getCellClass(scope.row[o.prop], o.mcolor)") {{scope.row[o.prop]}}

        el-table-column(label="操作" )
          template(slot-scope="scope")
            el-button(type="text" size="small" class="fc-o" @click="viewHighterLevel(scope.row)"  v-show="scope.row.userName != '合计'") 查看上级
            el-button(type="text" size="small" class="fc-o" @click="viewDailyProfitDetail(scope.row)"  v-show="scope.row.userName != '合计'") 每日明细
      p 温馨提示：仅保留最近7天的数据
      el-pagination(:total="totalSize" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="curPage" small v-if=" totalSize > pageSize " v-on:current-change="pageChanged")
    
    el-dialog(custom-class="higher-level-breaks-dialog" v-bind:visible.sync="isShowHigherLevelDialog" center v-bind:modal="false" )
      .higher-level-breaks
        el-breadcrumb(separator-class="el-icon-arrow-right" separator=">")
          el-breadcrumb-item(v-for="(info, i) in higherLevelUserBreads") {{info.userName}}
        .ds-button.primary.large.bold.ml10(@click="isShowHigherLevelDialog = false") 确定
    
    el-dialog(custom-class="daily-profit-dialog" v-bind:visible.sync="isShowDailyProfitDialog" center v-bind:modal="false" )
      span(slot="title") 每日明细
      .daily-profit-dialog-ctx
        .info-header 每日明细-{{curSubUserName}}(个人)
        el-table.header-bold.nopadding(:data="dailyReportData" style="margin: .2rem 0" stripe ref="table-daily-profit" v-on:sort-change="dailyReportSortChange") 
          el-table-column(prop="date" label="时间" class-name="pl2" )
            template(scope="scope")
              span {{scope.row.date}}

          el-table-column(prop="buy" label="投注" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "buy", scope.row)}}

          el-table-column(prop="prize" label="中奖" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "prize", scope.row)}}

          el-table-column(prop="pointLevel" label="彩票返点" v-if="I === 1 && showUserPointColumn" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "pointLevel", scope.row)}}

          el-table-column(prop="point" label="返点金额" v-if="I === 1 && showUserPointColumn" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "point", scope.row)}}

          el-table-column(prop="gameProfit" label="游戏盈亏" sortable="custom")
            template(scope="scope")
              span(:class="getCellClass(scope.row.gameProfit, true)") {{tableCellDataFormat(amountColumnProp, "gameProfit", scope.row)}}
          el-table-column(prop="salary" label="日工资" v-if="I === 1 && showSalaryColumn" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp,"salary", scope.row)}}    

          el-table-column(prop="point" v-bind:label="otherGamesName[I] + '返水'" v-if="[2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 && showUserPointColumn" sortable="custom")
            template(scope="scope")
              span {{parseFloat(scope.row.pointLevel) * 1000}}‰

          el-table-column(prop="point" label="返水金额" v-if="[2, 3, 4, 5, 6, 7, 8].indexOf(I) !== -1 && showUserPointColumn" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "point", scope.row)}}

          el-table-column(prop="reward" label="活动" sortable="custom")
            template(scope="scope")
              span {{tableCellDataFormat(amountColumnProp, "reward", scope.row)}}

          el-table-column(prop="totalProfit" label="总盈亏" sortable="custom")
            template(scope="scope")
              span(:class="getCellClass(scope.row.totalProfit, true)") {{tableCellDataFormat(amountColumnProp, "totalProfit", scope.row)}}  
</template>

<script>
import api from 'src/http/api'
import { dateFormat, dateTimeFormat } from '../../util/Date'
import SearchConditions from 'components/SearchConditions'
import store from '../../store'
import { numberWithCommas } from '../../util/Number'
import { listOrderByField } from '../../util'
export default {
  components: {
    SearchConditions
  },
  name: 'my-game-record',
  props: ['menus'],
  data () {
    return {
      me: store.state.user,
      // userId: '',
      I: 0,
      stEt: [new Date(new Date().getTime() - 3600 * 1000 * 24 * 7), new Date(new Date().getTime())],
      pageSize: 20,
      curPage: 1,
      totalSize: 0,
      showThirdGameDetal: false, // 是否盈亏总表 -明细-第三方游戏表格
      range: 0,
      searchRange: ['所有下级', '直接下级', '间接下级'],
      profitAndLossSummaryTableColumn: [
        { prop: 'userName', name: '用户名', sortable: false, width: 150 },
        { prop: 'date', name: '时间', sortable: false, width: 350 },
        { prop: 'buy', name: '投注', sortable: 'custom' },
        { prop: 'gameProfit', name: '游戏盈亏', mcolor: true, sortable: 'custom' },
        { prop: 'totalProfit', name: '总盈亏', mcolor: true, sortable: 'custom' },
        { prop: 'subType', name: '下级类型', sortable: false }
      ],
      thirdGamesColumn: [
        { prop: 'userName', name: '游戏类别', sortable: false },
        { prop: 'buy', name: '投注', sortable: 'custom' },
        { prop: 'gameProfit', name: '游戏盈亏', mcolor: true, sortable: 'custom' },
        { prop: 'totalProfit', name: '总盈亏', mcolor: true, sortable: 'custom' }
      ],
      otherCommonTableColumn: [
        { prop: 'userName', name: '用户名', sortable: false },
        { prop: 'buy', name: '投注', sortable: 'custom' },
        { prop: 'prize', name: '中奖', sortable: false },
        { prop: 'point', name: '返点', sortable: false },
        { prop: 'gameProfit', name: '游戏盈亏', mcolor: true, sortable: 'custom' },
        { prop: 'reward', name: '活动', sortable: false },
        { prop: 'totalProfit', name: '总盈亏', mcolor: true, sortable: 'custom' },
        { prop: 'subType', name: '下级类型' }
      ],
      otherGamesName: ['', '彩票', '体育', '真人', '老虎机', '电竟', '捕鱼', '棋牌', '基诺彩'],
      profitAndLossSummaryData: [],
      thirdGamesDetailData: [],
      otherCommonReportData: [],
      otherCommonReportSummaryCoummonData: [],
      dailyReportData: [],

      startDate: '',
      endDate: '',
      subUserName: '',
      gameTypeMap: {
        tab0: -1,
        tab1: 0,
        tab2: 6,
        tab3: 3,
        tab4: 2,
        tab5: 1,
        tab6: 5,
        tab7: 4,
        tab8: 7
      },
      curGameType: -1,

      names: [],
      higherLevelUserBreads: [],
      isShowHigherLevelDialog: false,
      isShowDailyProfitDialog: false,
      showUserPointColumn: false,
      showThirdPointColumn: false,
      amountColumnProp: ['buy', 'prize', 'point', 'gameProfit', 'salary', 'reward', 'totalProfit'],

      subUserId: '',
      curSubUserName: ''

    }
  },
  computed: {
    userId () {
      return this.me.userId
    },
    showback () {
      return this.me.displayPermission.showback === 1
    },
    showpoint () {
      return this.me.displayPermission.showpoint === 1
    },
    backWaters () {
      return this.me.backWaters
    }
  },
  mounted () {
    let sDate = new Date()
    sDate.setDate(sDate.getDate() - 6)
    this.$set(this.stEt, 0, sDate)
    this.curGameType = this.gameTypeMap['tab' + this.I]
    this.getPersonalReport({
      ascOrDesc: 1,
      orderBy: 'totalProfit'
    })
    this.names = JSON.parse(window.sessionStorage.getItem('SUB_PROFIT_LOSS_NAMES_HISTORY') || '[]')
    // console.log('this.me.backWaters=', this.me.backWaters)
  },
  methods: {
    __setReportI (i) {
      this.I = i
      this.curPage = 1
      this.curGameType = this.gameTypeMap['tab' + this.I]
      let params = {}
      if (i === 0) {
        params = {
          ascOrDesc: 1,
          orderBy: 'totalProfit'
        }
      }
      this.getPersonalReport(params)
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
    getPersonalReport (params = {}, source) {
      let loading = this.$loading({
        text: '盈亏报表加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      let p = {
        gameType: this.curGameType,
        userId: this.userId,
        page: this.curPage,
        pageSize: this.pageSize,
        scope: this.range === '' ? 0 : this.range,
        beginDate: dateTimeFormat(this.stEt[0]).split(' ')[0],
        endDate: dateTimeFormat(this.stEt[1]).split(' ')[0]
      }
      if (this.subUserName) {
        p.username = this.subUserName
        delete p.userId
      }
      this.showThirdPointColumn = this.backWaters['groupId_' + this.curGameType]
      Object.assign(p, params)
      this.$http.get(api.subPersonalProfit, p).then(({data: {success, items, totalSize}}) => {
        if (success === 1) {
          if (items.length > 0) {
            // items[items.length - 1].date = '总计'
            // items[items.length - 1].userName = '总计'
            items = items.map((item, i) => {
              if (i < items.length - 1) {
                item.subType = String(item.parentid) === String(this.me.userId) ? '直接下级' : '间接下级'
              }
              return item
            })
            if (this.I === 0) {
              items = items.map((item, i) => {
                item.date = i < items.length - 1 ? (`${dateTimeFormat(this.stEt[0]).split(' ')[0]} 00:00:00 ~ ${dateTimeFormat(this.stEt[1]).split(' ')[0]} 23:59:59`) : ''
                return item
              })
              this.profitAndLossSummaryData = items // items.slice(items.length - 1)
            } else {
              this.otherCommonReportData = items
            }
            this.totalSize = totalSize
            this.setNameHistory(p.username)
          } else {
            this.profitAndLossSummaryData = []
            this.otherCommonReportData = []
            this.totalSize = 0
          }
        }
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    /**
     * 逐日报表
     */
    getDailyPersonalProfit (params = {}, from) {
      let loading = this.$loading({
        text: '盈亏报表加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      let p = {
        // scope: 0,
        userId: this.subUserId,
        pageSize: this.pageSize,
        gameType: this.curGameType,
        beginDate: dateFormat((window.newDate(this.stEt[0])).getTime()),
        endDate: dateFormat((window.newDate(this.stEt[1])).getTime())
      }
      Object.assign(p, params)
      this.$http.get(api.personalProfit, p).then(({data: {items, success, pointLevel}}) => {
        this.dailyReportData = []
        if (success === 1 && items.length > 0) {
          items[items.length - 1].date = '合计'
          items = items.map((item) => {
            item.pointLevel = pointLevel
            return item
          })
          this.showUserPointColumn = false
          if (this.showThirdGameDetal && this.curGameType === -1) {
            this.thirdGamesDetailData = items
          } else {
            // this.showUserPointColumn = (this.curGameType === 0 ? this.showpoint : this.showback) && parseFloat(pointLevel) > 0
            this.showUserPointColumn = (this.curGameType === 0 ? this.showpoint : this.showback) && this.backWaters['groupId_' + this.curGameType]
            this.dailyReportData = items
          }
          // this.showUserPointColumn = parseFloat(pointLevel) > 0

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
    getUserBread (userId) {
      let loading = this.$loading({
        text: '加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      this.$http.get(api.getUserBread, {userId}).then(({data: {userBreads, success}}) => {
        if (success === 1) {
          // let msg = ``
          this.higherLevelUserBreads = userBreads
          this.isShowHigherLevelDialog = true
          // this.$modal.confirm({
          //   title: '',
          //   boxStyle: {
          //     width: '580px'
          //   },
          //   content: '<pre class="text-666" style="text-align: left;">' + userBreads + '</pre>',
          //   btn: ['知道了'],
          //   ok () {
          //   },
          //   close () {
          //   },
          //   O: this
          // })
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
      this.curPage = 1
      this.getPersonalReport({}, 'search')
      if (this.I === 0) {
        this.showThirdGameDetal = false
      }
    },
    pageChanged (p) {
      this.curPage = p
      this.getPersonalReport()
    },
    querySearchName (name, cb) {
      let rs = name ? this.names.filter((n) => {
        return n.value.indexOf(name) === 0
      }) : this.names
      cb(rs)
    },
    setNameHistory (name) {
      if (!name || this.names.filter((n) => n.value.indexOf(name) === 0).length > 0) return
      let tipItem = this.names.length > 0 && this.names[0].value === '近期搜索' ? this.names.shift() : {value: '近期搜索', address: ''}
      this.names.unshift({value: name, address: name})
      if (this.names.length > 5) this.names.pop()
      this.names.unshift(tipItem)
      window.sessionStorage.setItem('SUB_PROFIT_LOSS_NAMES_HISTORY', JSON.stringify(this.names || '[]'))
    },
    nameHandleSelect (e) {
      if (e.value === '近期搜索') this.subUserName = ''
    },
    viewHighterLevel (row) {
      this.getUserBread(row.userId)
    },
    viewDetail (row) {
      this.subUserId = row.userId
      this.curGameType = -1
      this.showThirdGameDetal = true
      this.curSubUserName = row.userName
      this.getDailyPersonalProfit()
    },
    viewThirdGameDailyProfitDetail (row) {
      this.subUserId = row.userId
      this.curGameType = row.gameType
      this.getDailyPersonalProfit()
      this.isShowDailyProfitDialog = true
    },
    viewDailyProfitDetail (row) {
      this.subUserId = row.userId
      this.curSubUserName = row.userName
      this.getDailyPersonalProfit()
      this.isShowDailyProfitDialog = true
    },
    sortChange (column) {
      if (!column) return
      this.getPersonalReport({
        orderBy: column.prop,
        ascOrDesc: {ascending: 2, descending: 1}[column.order]
      })
    },
    thirdGameDetailSortChange (column) {
      if (!column) return
      let summaryRow = this.thirdGamesDetailData.pop()
      this.thirdGamesDetailData = this.listOrderByField(this.thirdGamesDetailData, column.prop, {ascending: 'asc', descending: 'desc'}[column.order]).slice(0)
      this.thirdGamesDetailData.push(summaryRow)
    },
    dailyReportSortChange (column) {
      if (!column) return
      let summaryRow = this.dailyReportData.pop()
      this.dailyReportData = this.listOrderByField(this.dailyReportData, column.prop, {ascending: 'asc', descending: 'desc'}[column.order]).slice(0)
      this.dailyReportData.push(summaryRow)
    },
    listOrderByField,
    numberWithCommas
  }
}
</script>

<style lang="stylus">
.my-report-record
  .fc-o
    color #f37e0c
  .scroll-content
    padding: 0 0.2rem;
  .search-bar
    line-height 0.7rem
  .tb-cell
    text-indent 0.2rem;
  .date-wp
    display inline-block
  .uname-ipt
    width 1.3rem
  .higher-level-breaks
    text-align center
    background #fff
    padding 0.5rem 0.2rem
    .el-breadcrumb
      margin-bottom 0.2rem
      text-align center
      word-break break-all
      word-wrap break-word
    .el-breadcrumb__item
      float none
  .higher-level-breaks-dialog
    width 4.5rem
    .el-dialog__header
      background #fff

  .daily-profit-dialog
    background #fff
    .daily-profit-dialog-ctx
      padding 0.2rem
    .info-header
      background-color #2d86ea
      color #fff
      line-height 0.36rem
      text-align center
</style>
<style lang="stylus">
.username-auto-ipt
  .el-scrollbar__wrap
    overflow auto
</style>
<style lang="stylus">
.el-scrollbar__wrap
  // overflow auto
.el-autocomplete-suggestion__wrap
  padding 0 0 8px 0
.search-range-slt
  &.el-select-dropdown
    background-color #fff
    .el-select-dropdown__item.selected, 
    .el-select-dropdown__item.hover
      color #48576a
      background-color #e4e8f1
    .el-select-dropdown__item
      color #48576a
</style>