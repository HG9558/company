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

        el-table.header-bold.nopadding(:data="data"  style=""   ref="table" stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" )

          el-table-column(class-name="pl2" prop="username" label="用户名"  width="150" v-if="!noname")
          el-table-column(prop="betTime" label="时间" width="150" class-name="pl2")
          el-table-column(prop="oddstype" label="盘口" width="100")
          el-table-column(prop="odds" label="赔率"  align="center"  width="100")
          el-table-column(prop="betAmount" label="下注金额"  align="right" width="100")
            template(scope="scope")
              span.text-danger() -{{ scope.row.betAmount && scope.row.betAmount._nwc() }}

          el-table-column(prop="winAmount" label="奖金"  align="right" width="100")
            template(scope="scope")
              span.text-green(v-if=" scope.row.winAmount && scope.row.winAmount._o0() ") +{{ scope.row.winAmount && scope.row.winAmount._nwc() }}

          el-table-column(prop="betStatus" label="状态"  align="center" width="150")
            template(scope="scope")
                span(:class=" { 'text-green': scope.row.betStatus === '中奖', 'text-grey': scope.row.betStatus === '未中奖' } ") {{ scope.row.betStatus }}
          el-table-column(prop="eventName" label="赛事"  min-width="250")


        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import {dateTimeFormat} from '../../util/Date'
  export default {
    mixins: [setTableMaxHeight],
    components: {
    },
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
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        PL: ['沙巴:9'],
        platid: '',
        ZONES: ['自己', '直接下级', '所有下级'],
        zone: '',
        data: [{}],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        STATE: ['未结算', '结算赢', '结果和', '结算输', '取消', '过期', '系统取消'],
        name: '',
        I: 0
      }
    },
    computed: {
    },
    watch: {
      I () {
        if (this.I === 0) {
          setTimeout(this.getData)
        }
      }
    },
    mounted () {
      this.getData()
    },
    methods: {
      __setGRPTI (i) {
        this.I = i
      },
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
            startTime: this.stEt[0] ? dateTimeFormat(this.stEt[0]) : '',
            endTIme: this.stEt[1] ? dateTimeFormat(this.stEt[1]) : '',
            userName: this.name,
            platId: this.platid,
            scope: this.noname ? 0 : this.zone,
            pageIndex: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.tcgOrderList, this.preOptions).then(({data}) => {
          // success
          if (data && data.items) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.items
            this.total = data.total || this.data.length
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

