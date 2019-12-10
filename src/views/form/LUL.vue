<template lang="jade">
  .lul
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
        .form.form-filters

          label.item 日期 
            el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime" size="small")

          .ds-button.primary.large.bold(@click="list" style="margin-left: .0rem") 搜索
          //- .buttons(style="margin-left: .3rem")
            .ds-button.cancel.large(@click="clear(true)") 清空
        
        .table-list(style="padding: .15rem .2rem ")

          el-table.header-bold.nopadding(:data="data"   style=""   ref="table" show-summary v-bind:summary-method="getSummaries"  stripe v-bind:max-height=" MH ")

            el-table-column(class-name="pl2" prop="date" label="日期" )
            el-table-column(class-name="pl2" prop="depositPersonCount" label="充值人数" )
            el-table-column(class-name="pl2" prop="depositTimes" label="充值笔数" )
            el-table-column(class-name="pl2" prop="depositAmount" label="充值金额" )
            el-table-column(class-name="pl2" prop="firstCount" label="首充人数" )
            el-table-column(class-name="pl2" prop="secondCount" label="二充人数" )
            el-table-column(class-name="pl2" prop="withdrawPersonCount" label="提款人数" )
            el-table-column(class-name="pl2" prop="withdrawTimes" label="提款笔数" )
            el-table-column(class-name="pl2" prop="withdrawAmount" label="提款金额" )
            

          el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  // import { digitUppercase, numberWithCommas } from '../../util/Number'
  import api from '../../http/api'
  export default {
    mixins: [setTableMaxHeight],
    data () {
      return {
        TH: 300,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }
          ],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date()._setD(1)._setHMS('0:0:0'), new Date()._setD(1)._setHMS('0:0:0')._bfM(1)._setS(-1)],
        pageSize: 15,
        total: 0,
        currentPage: 1,
        preOptions: {},
        data: []
      }
    },
    watch: {
    },
    mounted () {
      this.list()
    },
    methods: {
      pageChanged (cp) {
        this.list(cp, () => {
          this.currentPage = cp
        })
      },
      list (page, fn) {
        let loading = this.$loading({
          text: '投注记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            beginDate: this.stEt[0] ? this.stEt[0]._toDayString() : '',
            endDate: this.stEt[1] ? this.stEt[1]._toDayString() : '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.lul, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.items
            this.total = data.totalSize || this.data.length
            // this.summary()
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
<style lang="stylus">
  .vtop table td
    vertical-align top
    padding-top .1rem

</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .lul
    top TH
    .form
      padding PWX

  .item
    display inline-block
    margin 0 PW .1rem 0

</style>



