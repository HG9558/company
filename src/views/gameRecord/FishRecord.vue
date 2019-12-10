<template lang="jade">
  .group-page.tool-bar-page-content
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content

      .form.form-filters
        
        label.item(v-if="!noname") 用户 
          input.ds-input.small(v-model="name" style="width: 1rem")
        
        label.item 时间 
          el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")
        
        label.item 平台&nbsp;
            el-select(clearable v-model="platid" style="width: 1rem" placeholder="全")
              el-option(v-for="(p, i) in PL" v-bind:label="p.split(':')[0]" v-bind:value=" p.split(':')[1] ")

        
        //- label.item 范围 
          el-select(clearable v-bind:disabled=" !ZONES[0] "  v-model="zone" style="width: 1rem" placeholder="全")
            el-option(v-for="(U, i) in ZONES" v-bind:label="U" v-bind:value="i")


        .ds-button.primary.large.bold(@click="getData") 搜索
        //- .buttons(style="margin-left: .6rem")
      
      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="data"  style="" ref="table" stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected")
          el-table-column(class-name="pl2 pr2" prop="orderId" label="订单号" show-overflow-tooltip=true)
          el-table-column(class-name="pl2" prop="userName" label="用户名"  v-if="!noname")
          el-table-column(prop="platName" label="平台"  )
          el-table-column(prop="betTime" label="投注时间（北京）"  width="150" show-overflow-tooltip=true)
          el-table-column(prop="gameName" label="游戏"  )
          el-table-column(prop="betAmount" label="投注额"  )
            template(scope="scope")
              span.text-danger(v-if=" scope.row.betAmount && scope.row.betAmount._o0() ") -{{ scope.row.betAmount && scope.row.betAmount._nwc() }}

          el-table-column(prop="prize" label="奖金"  )
            template(scope="scope")
              span(v-if=" scope.row.prize && scope.row.prize._o0() ") {{ scope.row.prize && scope.row.prize._nwc() }}

          el-table-column(prop="profit" label="盈亏"  )
            template(scope="scope")
              span(:class=" {'text-green': scope.row.profit._o0(), 'text-danger': scope.row.profit._l0()} ") {{ scope.row.profit && scope.row.profit._o0() ? '+' : '' }}{{ scope.row.profit._nwc() }}

          el-table-column(prop="stat" label="状态"  )
            template(scope="scope")
              span(:class=" STATECLASS[scope.row.stat] ") {{ STATE[scope.row.stat] }}


         

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import {dateTimeFormat} from '../../util/Date'
  export default {
    mixins: [setTableMaxHeight],
    data () {
      return {
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 89)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        PL: ['AG:4', 'BG:2', 'PT:5'],
        platid: '',
        ZONES: ['自己', '直接下级', '所有下级'],
        zone: '',
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        STATE: ['未结算', '已结算'],
        STATECLASS: ['text-grey', 'text-green'],
        name: ''
      }
    },
    computed: {
    },
    mounted () {
      this.getData()
    },
    methods: {
      tableRowClassName (row, index) {
        if (row.selected) return 'selected-row'
      },
      setSelected (row) {
        this.$set(row, 'selected', !row.selected)
      },
      pageChanged (cp) {
        this.getData(cp, () => {
          this.currentPage = cp
        })
      },
      getData (page, fn) {
        let loading = this.$loading({
          text: '其它游戏记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            beginTime: this.stEt[0] ? dateTimeFormat(this.stEt[0]) : '',
            endTime: this.stEt[1] ? dateTimeFormat(this.stEt[1]) : '',
            username: this.name,
            platId: this.platid,
            scope: this.noname ? 0 : this.zone,
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.outerOrderRecord + 'fishing', this.preOptions).then(({data}) => {
          // success
          if (data.items) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.items
            this.total = data.totalSize || this.data.length
          } else loading.text = data.msg || '加载失败!'
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
  .user-list
    // top TH
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0

    
  .el-select
  .el-input-number
    width 1.2rem
  .el-select
    position relative
    top .01rem

</style>

