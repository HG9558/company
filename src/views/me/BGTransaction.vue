<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content

      .form.form-filters

        label.item 时间范围  
          el-date-picker( :picker-options="pickerOptions" v-model="stEt" type="daterange" placeholder="选择日期范围" v-bind:clearable="clearableOnTime")
        | &nbsp;&nbsp;
        
        label.item 转出账户 
          el-select(clearable v-model="f" style="width: 1.2rem" placeholder="无")
            el-option(v-for="(n, i) in froms" v-bind:label=" n.split(':')[0] " v-bind:value="i" v-if="n")
        
        | &nbsp;&nbsp;
        
        label.item 转入账户  
          el-select(clearable v-model="t" style="width: 1.2rem" placeholder="无")
            el-option(v-for="(n, i) in froms" v-bind:label=" n.split(':')[0] " v-bind:value="i" v-if="n")
        
        | &nbsp;&nbsp;


        label.item 状态  
          el-select(clearable v-model="s" style="width: .8rem" placeholder="无")
            el-option(v-for="(n, i) in S" v-bind:label="n" v-bind:value="i" v-if="n")

        .ds-button.primary.large.bold(@click="getData" style="margin-left: .15rem") 搜索
        //- .buttons(style="margin-left: .6rem; margin-top: .1rem")
        
      .table-list(style="padding: .15rem .2rem " stripe)
      
        el-table.header-bold.nopadding(:data="data"  style=""   ref="table" stripe v-bind:max-height=" MH ")

          el-table-column(class-name="pl2" prop="from" label="从...转出" )

          el-table-column(prop="to" label="转入到" )

          el-table-column(prop="time" label="时间" )
          
          el-table-column(prop="amount" label="金额" )

          el-table-column(prop="state" label="状态" )
            template(scope="scope")
              span(:class=" SC[scope.row.stateIndex] ") {{ S[scope.row.stateIndex] }}
  


        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")


</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import {dateTimeFormat} from '../../util/Date'
  export default {
    name: 'BGTransaction',
    compontents: {
    },
    mixins: [setTableMaxHeight],
    data () {
      return {
        stEt: [(new Date().getTime() - 1000 * 3600 * 24 * 7), new Date()],
        // defaultStEt: [new Date(new Date().getTime() - 3600 * 1000 * 24), new Date(new Date().getTime())],
        // stEt: [new Date((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + ' 00:00:00'), new Date((new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1) + '-' + (new Date()).getDate() + ' 23:59:59')],
        // defaultStEt: ['', ''],
        // stEt: ['', ''],
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {},
        froms: ['主账户', '特殊账户', 'BG账户', '体育账户', '棋牌账户:7', 'PT账户:5'],
        f: '',
        t: '',
        S: ['失败', '成功', '处理中'],
        SC: ['text-danger', 'text-green', 'text-blue'],
        s: ''
      }
    },
    watch: {
      // stEt: {
      //   deep: true,
      //   handler () {
      //     if (!this.stEt[0] && !this.stEt[1]) this.stEt = this.defaultStEt
      //     if ((window.newDate(this.stEt[0])).getTime() === (window.newDate(this.stEt[1])).getTime()) {
      //       this.stEt[1] = new Date((window.newDate(this.stEt[1])).getTime() + 3600 * 1000 * 24)
      //     }
      //   }
      // }
    },
    mounted () {
      this.getData()
    },
    methods: {
      pageChanged (cp) {
        this.getData(cp, () => {
          this.currentPage = cp
        })
      },
      getData (page, fn) {
        let loading = this.$loading({
          text: 'BG转帐记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            from: (this.froms[this.f] || '').split(':')[1] || this.f,
            to: (this.froms[this.t] || '').split(':')[1] || this.t,
            state: this.s,
            bgTm: this.stEt[0] ? dateTimeFormat(this.stEt[0]) : '',
            endTm: this.stEt[1] ? dateTimeFormat(this.stEt[1]) : '',
            pageIndex: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.pageIndex = page
        }
        this.$http.get(api.queryBalanceTransfer, this.preOptions).then(({data}) => {
          if (data && data.recordList) {
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.recordList
            this.total = data.totalSize || this.data.length
          }
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
  .form
    padding PWX
    .item
      display inline-block
      margin-top .1rem
</style>
