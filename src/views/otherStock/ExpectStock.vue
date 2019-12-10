<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content


      .form
        .form-filters(style="padding: .15rem; margin: .1rem 0 .2rem 0; ")
          div(style="text-align: center; min-height: .2rem" )
            .ds-button-group(v-if="me.role >= 2" style="margin: 0")
              .ds-button.x-small.text-button(:class=" { selected: type === 0 } " @click=" type = 0 " ) 我的预期其它游戏分红
              .ds-button.x-small.text-button(:class=" { selected: type === 1 } " @click=" type = 1 " ) 下级预期其它游戏分红

          //- label.item 发放日期&nbsp;
            el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")


          //- label.item  &nbsp;状态&nbsp;
            el-select(v-model="s" clearable style="width: .9rem")
              el-option(v-for="S in STATUS" v-bind:label="S.title" v-bind:value="S.id")

          label.item(v-if="type === 1") 用户名&nbsp;
            input.ds-input.small(v-model="name" style="width: 1rem")

          .ds-button.primary.large.bold(@click="bonus" v-if="type === 1") 搜索

        el-table.header-bold.nopadding(:data="bonusList" ref="table"  stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName")

          el-table-column(align="center" prop="userName" label="用户名"  v-if="type === 1")

          el-table-column(align="center" prop="issue" label="其它游戏分红期号"  )

          el-table-column(align="center" prop="sptProfit" label="体育盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.sptProfit && scope.row.sptProfit._o0(), 'text-danger': scope.row.sptProfit && scope.row.sptProfit._l0() } ")  {{ scope.row.sptProfit &&scope.row.sptProfit._nwc() }}

          el-table-column(align="center" prop="vidProfit" label="真人盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.vidProfit && scope.row.vidProfit._o0(), 'text-danger': scope.row.vidProfit && scope.row.vidProfit._l0() } ")  {{ scope.row.vidProfit &&scope.row.vidProfit._nwc() }}


          el-table-column(align="center" prop="egameProfit" label="电游盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.egameProfit && scope.row.egameProfit._o0(), 'text-danger': scope.row.egameProfit && scope.row.egameProfit._l0() } ")  {{ scope.row.egameProfit &&scope.row.egameProfit._nwc() }}


          el-table-column(align="center" prop="fishProfit" label="捕鱼盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.fishProfit && scope.row.fishProfit._o0(), 'text-danger': scope.row.fishProfit && scope.row.fishProfit._l0() } ")  {{ scope.row.fishProfit &&scope.row.fishProfit._nwc() }}

          //- el-table-column(align="center" prop="cheProfit" label="棋牌盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.cheProfit && scope.row.cheProfit._o0(), 'text-danger': scope.row.cheProfit && scope.row.cheProfit._l0() } ")  {{ scope.row.cheProfit &&scope.row.cheProfit._nwc() }}


          el-table-column(align="center" label="总盈亏")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.totProfit && scope.row.totProfit._o0(), 'text-danger': scope.row.totProfit && scope.row.totProfit._l0() } ")  {{ scope.row.totProfit &&scope.row.totProfit._nwc() }}


          el-table-column(align="center" prop="lastProft" label="上期结余")
            template(scope="scope")
              span  {{ scope.row.lastProft &&scope.row.lastProft._nwc() }}

          el-table-column(align="center" prop="actUser" label="有效人数")

          el-table-column(align="center" prop="bonusRate" label="其它游戏分红比例")
            template(scope="scope")
              span {{ scope.row.bonusRate }}%

          el-table-column(align="center" prop="bonus" label="其它游戏分红金额")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.bonus && scope.row.bonus._o0(), 'text-danger': scope.row.bonus && scope.row.bonus._l0() } ")  {{ scope.row.bonus && scope.row.bonus._o0() ? '+' : '' }}{{ scope.row.bonus &&scope.row.bonus._nwc() }}




        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


    //- .modal(v-if="showDetail" )
      .mask
      .box-wrapper
        .box(ref="box" style="max-width: 5rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 分红详情
            el-button-group
              el-button.close(icon="close" @click="showDetail = ''")
          StockDetail(v-bind:id=" showDetail " v-bind:myself=" !this.type " v-bind:type="'qryBonusById'" style="min-height: 5.7rem;")

</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import store from '../../store'
  // import { dateFormat } from '../../util/Date'
  import { numberWithCommas } from '../../util/Number'
  export default {
    mixins: [setTableMaxHeight],
    components: {
    },
    data () {
      return {
        numberWithCommas: numberWithCommas,
        TH: 250,
        pickerOptions: {
          shortcuts: [{
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        stEt: [new Date()._setHMS('0:0:0')._bfM(-2)._setD(1), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
        me: store.state.user,
        // 0 我的分红
        // 1 下级分红
        type: 0,
        STATUS: [
          {css: 'text-danger', id: '0', title: '未发放', class: 'waiting-pay'},
          {css: 'text-green', id: 1, title: '已发放', class: 'paid'},
          {css: 'text-oblue', id: 2, title: '待确认', class: 'wait'}
          // {id: 2, title: '已发放', class: 'paid'},
          // {id: 3, title: '平台外已发放', class: 'paid-out'}
        ],
        s: '',
        bonusList: [],
        topBonuList: [],
        topDetailList: [],
        pageSize: 20,
        // pageSize: 5,
        total: 0,
        currentPage: 1,
        preOptions: {},
        showDetail: false,
        name: '',
        groupId: 1
      }
    },
    computed: {
      apiBonus () {
        return this.me.role <= 2 ? [api.myExpectedBonus, api.mySubExpectedBouns][this.type] : [api.myExpectedBonus, api.mySubExpectedBouns][this.type]
      }
    },
    watch: {
      type (n) {
        if (n) {
          this.stEt = [new Date()._setD(new Date().getDate() > 15 ? 16 : 1)._setHMS('0:0:0'), new Date()._setHMS('23:59:59')]
        } else {
          this.stEt = [new Date()._setHMS('0:0:0')._bfM(-2)._setD(1), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)]
        }
        this.bonus()
      }
    },
    mounted () {
      this.bonus()
    },
    methods: {
      pageChanged (cp) {
        this.bonus(cp, () => {
          this.currentPage = cp
        })
      },
      expand (row, expanded) {
        if (expanded && !row.topDetailList) {
          this.topBonuDetail(row)
        }
      },
      topBonuDetail (row) {
        let loading = this.$loading({
          text: '分红详情加载中...',
          target: this.$el
        }, 10000, '加载超时...')
        this.$http.get(api.topBonuDetail, {
          issue: row.issue
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.topDetailList = data.topDetailList
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      goContractDetail (id) {
        this.$router.push({
          path: '/group/3-3-4',
          query: {id: id}
        })
      },
      goStockDetail (id) {
        this.$router.push({
          path: '/group/3-3-2',
          query: {id: id, self: !this.type}
        })
      },
      __bonus () {
        this.bonus()
      },
      bonus (page, fn) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')

        if (!fn) {
          this.preOptions = {
            // startDate: this.stEt[0] ? dateFormat((window.newDate(this.stEt[0])).getTime()).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            // endDate: this.stEt[1] ? dateFormat((window.newDate(this.stEt[1])).getTime()).replace(/[\s:-]*/g, '') : '',
            // startDate: this.st ? dateFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            // status: this.s,
            page: 1,
            pageSize: this.pageSize,
            userName: this.type === 1 ? this.name : '',
            groupId: this.groupId
          }
        } else {
          this.preOptions.page = page
        }

        this.$http.get(this.apiBonus, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            let bonus = data.myExpectedBonus || data.mySubExpectedBonus
            this.bonusList = bonus
            // data.topBonuList && (this.topBonuList = data.topBonuList)

            this.total = data.totalSize
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          }
          // else loading.text = '加载失败...!'
        }, (rep) => {
          // error
          // this.$message.error('加载失败...！')
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }
      // myExpectedBonus
      // mySubExpectedBouns
      // 查询我的奖金
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=myBonus&startDate=20170101200000&endDate=20170115200000
      // 查询下级奖金
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=mySubContract&issue=20170301&sendType=1

    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .stock-list
    // top TH
    .form
      padding 0 PWX

  .item
    display inline-block
    margin 0 PW .1rem 0
    vertical-align top
    


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