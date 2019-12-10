<template lang="jade">
  .daily-wage-set
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .form.form-filters
          label.item 用户
            input.ds-input.small(v-model="un" style="width: 1.2rem" placeholder="请输入用户名" maxLength="20")

          label.item 注册时间
            el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime" v-on:change="dateChange")

          span.date-wp
            SearchConditions(v-bind:showTimeTxt="false" v-bind:defaultDateIdx="defaultDateIdx" v-bind:searchConditions="searchConditions" v-bind:dateMappingConfig="dateMappingConfig" @choiced="choicedSearchCondition" v-show=" [0].indexOf(I) == -1 ")

          span.ml10 日工资
          span
            .ds-button.btn-item.mr10(v-for="(c, i) in statusButtons" v-bind:class="{selected: quickStatusIdx === i}" @click="choiceStatus(i)") {{c}}

          .ds-button.primary.large.bold(@click="mySubSalaryList") 搜索

      .table-list(style="padding: .15rem .2rem ")
        p(style="margin: 0 0 .15rem 0" )
          //- .ds-button.primary.large(@click="patchSetWage" v-bind:class="{'disabled': disableSetWage}") 设置日工资
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" ) {{ B.title }}

        el-table.header-bold.nopadding(:data="data" stripe ref="table" v-bind:max-height=" MH " @selection-change="handleSelectionChange" v-on:sort-change="sortChange")
          //- el-table-column(type="selection" width="100px" class-name="pl2")
          el-table-column(prop="userName" label="用户名" class-name="pl2")
          el-table-column(prop="registertime" label="注册日期" align="center" sortable="custom")
          el-table-column(prop="teamCount" label="团队人数"  align="center" sortable="custom")
          el-table-column(label="工资级别"  align="center")
            template(scope="scope")
              span 1w{{scope.row.salary}}
          el-table-column(prop="teamSales" label="团队销量"  align="center")
          el-table-column(prop="activityCount" label="有效人数"  align="center")
          el-table-column(class-name="pl2 pr2" label="状态")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.salary > 0, 'text-danger': scope.row.salary < 1} ") {{ scope.row.salary > 0 ? '已设置' : '未设置' }}
          el-table-column(label="操作" )
            template(slot-scope="scope")
              span.pointer(style=" padding: 0 .05rem" class="fc-o" v-if=" scope.row.salary >= 0 " @click="setWage(scope.row)") 设置日工资

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


      DialogSetDailyWage(v-if="showDialogSetWage" v-bind:showDialogSetWage="showDialogSetWage" v-bind:id="id" v-on:close="showDialogSetWage = false" v-on:set-wage="mySubSalaryList")



</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import store from '../../store'
  import { MMath } from '../../util/Number'
  import page from 'components/page'
  import SalaryDetail from './SalaryDetail'
  import SearchConditions from 'components/SearchConditions'
  import DialogSetDailyWage from './DialogSetDailyWage'
  import dayjs from 'dayjs'
  export default {
    mixins: [setTableMaxHeight, page],
    components: {
      SalaryDetail,
      SearchConditions,
      DialogSetDailyWage
    },
    data () {
      return {
        TH: 280,
        ME: store.state.user,
        type: 0,
        stEt: [dayjs('1999-01-01').toDate(), dayjs().toDate()],
        un: '',
        BL: [
          {title: '自己'},
          {}
        ],
        fn: 'mySubSalaryList',
        id: '',
        choicedRows: [],
        pageSize: 15,
        defaultDateIdx: -1,
        searchConditions: ['昨天', '前天', '最近7天'],
        dateMappingConfig: { d0: [1, 1], d1: [2, 2], d2: [6, 0] },
        quickStatusIdx: -1,
        statusButtons: ['全部', '已设置', '未设置'],
        showDialogSetWage: false,
        disableSetWage: true
      }
    },
    mounted () {
      this.mySubSalaryList()
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
      goToGift () {
        setTimeout(() => {
          this.$router.push('/activity/5-1-2')
        }, 0)
      },
      link (B, i) {
        this.id = B.userId
        this.mySubSalaryList(undefined, undefined, B.userId)
      },
      patchSetWage () {
        if (this.disableSetWage || this.choicedRows.length < 1) return
        let ids = []
        this.choicedRows.forEach(row => {
          ids.push(row.userId)
        })
        this.id = ids.join(',')
        this.showDialogSetWage = true
      },
      setWage (row) {
        this.id = String(row.userId)
        this.showDialogSetWage = true
      },
      handleSelectionChange (rows) {
        this.choicedRows = rows
        this.disableSetWage = this.choicedRows.length < 1
      },
      mySubSalaryList (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        let p = {
          userName: this.un,
          startDate: this.stEt[0] && this.stEt[0]._toDayString().replace(/-/g, ''),
          endDate: this.stEt[1] && this.stEt[1]._toDayString().replace(/-/g, '')
        }
        if (this.quickStatusIdx >= 0) {
          if (this.quickStatusIdx === 1) {
            p.salaryType = 1
          }
          if (this.quickStatusIdx === 2) {
            p.salaryType = 0
          }
        }
        Object.assign(p, option)
        this.$http.post(api.mySubSalaryList, p).then(({data: {success, userBreads, totalSize, salaryList}}) => {
          // success
          if (success === 1) {
            this.total = totalSize || salaryList.length
            // 增加工资总额
            salaryList = salaryList.map((item) => {
              item.groupTotalAmount = MMath.add(item.subSalary, item.daySalary)
              return item
            })
            this.data = salaryList
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
        this.data = this.listOrderByField(this.data, column.prop, {ascending: 'asc', descending: 'desc'}[column.order], column.prop === 'teamCount' ? 'registertime' : '').slice(0)
      },
      listOrderByField (list, fieldName, order, fieldName1) {
        let temp
        let current
        let next
        let currentOtherfield
        let nextOtherfield
        for (let i = 0; i < list.length; i++) {
          for (let j = 0; j < list.length - i; j++) {
            current = list[j][fieldName]
            next = list[j + 1] && list[j + 1][fieldName]
            current = parseFloat(String(current).replace(/[-\s:.,]/g, ''))
            next = parseFloat(String(next).replace(/[-\s:.,]/g, ''))
            if (current > next) {
              temp = list[j + 1]
              list[j + 1] = list[j]
              list[j] = temp
            } else {
              if (current === next && fieldName1) {
                currentOtherfield = list[j][fieldName1]
                nextOtherfield = list[j + 1] && list[j + 1][fieldName1]
                currentOtherfield = parseFloat(String(currentOtherfield).replace(/[-\s:.,]/g, ''))
                nextOtherfield = parseFloat(String(nextOtherfield).replace(/[-\s:.,]/g, ''))
                if (currentOtherfield > nextOtherfield) {
                  temp = list[j + 1]
                  list[j + 1] = list[j]
                  list[j] = temp
                }
              }
            }
          }
        }
        if (order === 'desc') {
          list = list.reverse()
        }
        return list
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .daily-wage-set
    .fc-o
      color #f37e0c
    .form-filters
      padding .15rem
    .el-breadcrumb
      display inline-block
      // margin-left 0.2rem
    .item
      display inline-block
      margin 0 PW 0 0
    .date-wp
      display inline-block
    .ds-button.disabled
      border solid 1px #dbdbdb
      color #999999
</style>
