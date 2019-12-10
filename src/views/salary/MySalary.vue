<template lang="jade">
  .my-salary
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .form.form-filters

          label.item 时间 
            el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime" v-on:change="dateChange")
          
          span.date-wp 
            SearchConditions(v-bind:showTimeTxt="false" v-bind:defaultDateIdx="defaultDateIdx" v-bind:searchConditions="searchConditions" v-bind:dateMappingConfig="dateMappingConfig" @choiced="choicedSearchCondition" v-show=" [0].indexOf(I) == -1 ")

          span.ml10 状态 
          span
            .ds-button.btn-item.mr10(v-for="(c, i) in statusButtons" v-bind:class="{selected: quickStatusIdx === i}" @click="choiceStatus(i)") {{c}}

          label.item( v-if=" type === 1 ") 用户名 
            input.ds-input.small(v-model="un" style="width: 1rem")

          .ds-button.primary.large.bold(@click=" !type ? mylist() : list()") 搜索
      
      .table-list(style="padding: .15rem .2rem ")
        p(style="margin: 0 0 .15rem 0" )
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" ) {{ B.title }}

        el-table.header-bold.nopadding(:data="myWageData" stripe ref="table" v-bind:max-height=" MH " v-on:sort-change="sortChange")

          el-table-column(class-name="pl2" prop="date" label="销售日期" sortable="custom")
          //- el-table-column(prop="totBuyAmount" label="团队销量"  align="right" sortable="custom")
          el-table-column(prop="totBuyAmount" label="有效销量"  align="right" sortable="custom")
          //- el-table-column(prop="buyAmount" label="有效销量"  align="right" sortable="custom")
          el-table-column(prop="activitUser" label="有效人数"  align="right" sortable="custom")
          el-table-column(prop="salaryLevel" label="工资级别"  align="right")
          el-table-column(prop="groupTotalAmount" label="团队工资总额"  align="right" sortable="custom")
          el-table-column(prop="subSalary" label="下级工资总额"  align="right" sortable="custom")
          el-table-column(class-name="pr2" prop="daySalary" label="我的工资"  align="right" sortable="custom")
            template(scope="scope")
              span(:class=" { 'text-green': scope.row.daySalary && scope.row.daySalary._o0() } ") {{ scope.row.daySalary && scope.row.daySalary._o0() ? '+' : ''}} {{ scope.row.daySalary }}
          el-table-column(class-name="pl2 pr2" prop="isDone" label="状态")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.isDone, 'text-danger': !scope.row.isDone} ") {{ scope.row.isDone ? '已领取' : '未领取' }}
              //- span.text-green.pointer(style=" padding: 0 .05rem" v-if=" scope.row.canGet " @click=" goToGift() ") 立即领取
          el-table-column(label="操作" )
            template(slot-scope="scope")
              span.pointer(style=" padding: 0 .05rem" class="fc-o" v-if=" canGet(scope.row) " @click=" goToGift() ") 立即领取

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

    
    .modal.inner-modal(v-if="did" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 每日明细
            el-button-group
              el-button.close(icon="close" @click=" did = ''")

          SalaryDetail(:stEt="stEt" v-bind:id="did")


</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import store from '../../store'
  import { listOrderByField } from '../../util'
  import { MMath, numberWithCommas } from '../../util/Number'
  import page from 'components/page'
  import SalaryDetail from './SalaryDetail'
  import SearchConditions from 'components/SearchConditions'
  export default {
    mixins: [setTableMaxHeight, page],
    components: {
      SalaryDetail,
      SearchConditions
    },
    data () {
      return {
        TH: 280,
        ME: store.state.user,
        type: 0,
        stEt: [new Date()._setD(1)._setHMS('0:0:0'), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
        un: '',
        BL: [
          {title: '自己'},
          {}
        ],
        did: '',
        fn: 'mylist',
        id: '',
        pageSize: 15,
        defaultDateIdx: -1,
        searchConditions: ['昨天', '前天', '最近7天'],
        dateMappingConfig: { d0: [1, 1], d1: [2, 2], d2: [6, 0] },
        quickStatusIdx: -1,
        statusButtons: ['全部', '未领取', '已领取'],
        myWageData: []
      }
    },
    mounted () {
      this.mylist()
    },
    methods: {
      dateChange (d) {
        let sdate = this.stEt[0]._toDayString().replace(/-/g, '')
        let edate = this.stEt[1]._toDayString().replace(/-/g, '')
        let diff = parseInt(edate, 10) - parseInt(sdate, 10)
        this.defaultDateIdx = -1
        if (parseInt(sdate, 10) >= parseInt(new Date()._bf(-this.dateMappingConfig['d2'][0])._toDayString().replace(/-/g, '')) &&
          parseInt(edate, 10) <= parseInt(new Date()._bf(-this.dateMappingConfig['d2'][1])._toDayString().replace(/-/g, ''))) {
          this.defaultDateIdx = 2
        }
        if (sdate === edate) {
          if (sdate === new Date()._bf(-this.dateMappingConfig['d0'][0])._toDayString().replace(/-/g, '')) {
            this.defaultDateIdx = 0
          }
          if (sdate === new Date()._bf(-this.dateMappingConfig['d1'][0])._toDayString().replace(/-/g, '')) {
            this.defaultDateIdx = 1
          }
        }
      },
      canGet (row) {
        let curDate = Date.now()
        let [y, m, d] = row.date.split('-').map(d => { d = parseInt(d, 10); return d })
        let salaryDateTime = new Date(y, m - 1, d).getTime()
        let FOUR_DAY_TIMES = 345600000
        return row.isDone === 0 && (salaryDateTime + FOUR_DAY_TIMES) >= curDate
      },
      goToGift () {
        setTimeout(() => {
          this.$router.push('/activity/5-1-2')
        }, 0)
      },
      link (B, i) {
        this.id = B.userId
        this.list(undefined, undefined, B.userId)
      },
      // 我的日工资
      mylist (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        let p = {
          // userId: this.ME.userId,
          // userId: '',
          startDate: this.stEt[0] && this.stEt[0]._toDayString().replace(/-/g, ''),
          endDate: this.stEt[1] && this.stEt[1]._toDayString().replace(/-/g, ''),
          userState: 1,
          port: 1
        }
        if (this.quickStatusIdx - 1 >= 0) {
          p.isdone = this.quickStatusIdx - 1
        }
        Object.assign(p, option)
        this.$http.post(api.getSalaryById, p).then(({data: {success, userBreads, totalSize, data}}) => {
          // success
          if (success === 1) {
            this.total = totalSize || data.length
            // 增加工资总额
            data = data.map((item) => {
              item.groupTotalAmount = MMath.add(item.subSalary.replace(/,/g, ''), item.daySalary.replace(/,/g, ''))
              item.groupTotalAmount = this.numberWithCommas(item.groupTotalAmount.toFixed(2))
              return item
            })
            this.myWageData = data
            cb()
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
      choicedSearchCondition (i, dates) {
        this.defaultDateIdx = i
        this.stEt = [dates.startDate, dates.endDate]
      },
      choiceStatus (i) {
        this.quickStatusIdx = i
      },
      sortChange (column, row) {
        if (!column) return
        this.myWageData = this.listOrderByField(this.myWageData, column.prop, {ascending: 'asc', descending: 'desc'}[column.order]).slice(0)
      },
      listOrderByField,
      numberWithCommas
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .my-salary
    .fc-o
      color #f37e0c
    .form-filters
      padding .15rem
    .item
      display inline-block
      margin 0 PW 0 0
    .date-wp
      display inline-block
</style>
