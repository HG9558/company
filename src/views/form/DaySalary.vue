<template lang="jade">
  .daysalary-report
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .form.form-filters
        .form-filters(style="padding: .15rem; margin: 0;")
          div(style="text-align: center; min-height: .2rem" )
            .ds-button-group
              .ds-button.x-small.text-button(:class=" { selected: type === 0 } " @click=" type = 0 " ) 我的工资
              .ds-button.x-small.text-button(:class=" { selected: type === 1 } " @click=" type = 1 " ) 下级工资

          label.item 时间 
            el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
          
          label.item( v-if=" type === 1 ") 用户名 
            input.ds-input.small(v-model="un" style="width: 1rem")

          .ds-button.primary.large.bold(@click=" !type ? mylist() : list()") 搜索
      
      .table-list(style="padding: .15rem .2rem ")

        p(style="margin: 0 0 .15rem 0" v-if="type")
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ i === 0 ? '自己' : B.userName }}

        el-table.header-bold.nopadding(:data="data" stripe ref="table" v-bind:max-height=" MH " v-show="!type")

          el-table-column(class-name="pl2" prop="date" label="日期" )
          el-table-column(prop="totBuyAmount" label="团队销量"  align="right")
          el-table-column(prop="buyAmount" label="有效销量"  align="right")
          el-table-column(prop="activitUser" label="有效人数"  align="right")
          el-table-column(prop="salaryLevel" label="工资级别"  align="right")
          el-table-column(prop="subSalary" label="下级工资总额"  align="right")
          el-table-column(class-name="pr2" prop="daySalary" label="我的工资"  align="right")
            template(scope="scope")
              span(:class=" { 'text-green': scope.row.daySalary && scope.row.daySalary._o0() } ") {{ scope.row.daySalary && scope.row.daySalary._o0() ? '+' : ''}} {{ scope.row.daySalary }}
              
          el-table-column(class-name="pl2 pr2" prop="isDone" label="是否领取")
            template(scope="scope")
              span(:class=" {'text-green': scope.row.isDone, 'text-danger': !scope.row.isDone} ") {{ scope.row.isDone ? '已领取' : '未领取' }}
              span.text-green.pointer(style=" padding: 0 .05rem" v-if=" scope.row.canGet " @click=" goToGift() ") 去领取

          

        el-table.header-bold.nopadding(:data="data" stripe ref="itable" v-bind:max-height=" MH " @cell-click="cellClick" v-show="type")

          el-table-column(class-name="pl2" prop="userName" label="用户名" )
            template(scope="scope")
              span.pointer.text-blue(:class=" { 'text-danger': scope.row.userName === ME.account } ") {{ scope.row.userName }}
          
          el-table-column(prop="totBuyAmount" label="团队销量"  align="right")
          el-table-column(prop="buyAmount" label="有效销量"  align="right")
          el-table-column(prop="subSalary" label="下级工资总额"  align="right")
          el-table-column(prop="daySalary" label="本人工资"  align="right")
          el-table-column(prop="getDaySalary" label="本人已领工资"  align="right")
            template(scope="scope")
              span(:class=" { 'text-green': scope.row.getDaySalary && scope.row.getDaySalary._o0() } ") {{ scope.row.getDaySalary && scope.row.getDaySalary._o0() ? '+' : ''}} {{ scope.row.getDaySalary }}

          el-table-column(prop="" label="操作" align="center")
            template(scope="scope")
              .ds-button.text-button.blue(style=" padding: 0 .05rem" @click=" did = scope.row.userId ") 明细

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

    
    .modal.inner-modal(v-if="did" )
      .mask
      .box-wrapper
        .box(ref="box" style="width: 10rem; max-height: 9rem; height: 6.2rem;")
          .tool-bar
            span.title 明细
            el-button-group
              el-button.close(icon="close" @click=" did = ''")

          DaySalaryDetail(:stEt="stEt" v-bind:id="did")


</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import store from '../../store'
  import page from 'components/page'
  import DaySalaryDetail from './DaySalaryDetail'
  export default {
    mixins: [setTableMaxHeight, page],
    components: {DaySalaryDetail},
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
        id: ''
      }
    },
    watch: {
      type (n) {
        if (!n) this.mylist()
        else this.list()
        if (!n) this.fn = 'mylist'
        else (this.fn = 'list') && (this.id = '')
      }
    },
    mounted () {
      this.mylist()
    },
    methods: {
      goToGift () {
        setTimeout(() => {
          this.$router.push('/activity/5-1-2')
        }, 0)
      },
      cellClick (row, column, cell, event) {
        if (column.property === 'userName' && this.type) {
          this.list(undefined, undefined, row.userId)
        }
      },
      link (B, i) {
        this.id = B.userId
        this.list(undefined, undefined, B.userId)
      },
      // 下级日工资
      list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }, id) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['itable'].$el
        }, 10000, '加载超时...')
        this.$http.post(api.daySalaryRepor, Object.assign({
          userId: id || this.id,
          userName: this.un,
          startDate: this.stEt[0] && this.stEt[0]._toDayString().replace(/-/g, ''),
          endDate: this.stEt[1] && this.stEt[1]._toDayString().replace(/-/g, '')

        }, option)).then(({data: {success, userBreads, totalSize, recordList}}) => {
          // success
          if (success === 1 || !success) {
            this.BL = userBreads.concat([{}])
            this.total = totalSize || recordList.length
            this.data = recordList
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
      // 我的日工资
      mylist (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        this.$http.post(api.getSalaryById, Object.assign({
          userId: '',
          startDate: this.stEt[0] && this.stEt[0]._toDayString().replace(/-/g, ''),
          endDate: this.stEt[1] && this.stEt[1]._toDayString().replace(/-/g, '')
        }, option)).then(({data: {success, userBreads, totalSize, data}}) => {
          // success
          if (success === 1) {
            this.total = totalSize || data.length
            this.data = data
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
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .daysalary-report
    top 0

  .item
    display inline-block
    margin 0 PW .1rem 0

</style>
