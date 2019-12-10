<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content

      .form.form-filters
        
        label.item 用户 
          input.ds-input.small(v-model="name" style="width: 1rem")

        label.item 时间 
          el-date-picker(:picker-options="pickerOptions" v-model="stEt" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")
        
        label.item 游戏 
          el-select(clearable v-bind:disabled=" !gameList[0] "  v-model="gameid" style="width: 1.5rem" placeholder="全")
            el-option(v-for="U in gameList" v-bind:label="U.cnName" v-bind:value="U.lotteryId")
        
        label.item 状态 
          el-select(clearable v-bind:disabled=" !STATUS[0] "  v-model="status" style="width: .9rem" placeholder="全")
            el-option(v-for="(S, i) in STATUS" v-bind:label="S" v-bind:value="i")

        
        
        //- label.item 范围 
          el-select(clearable v-bind:disabled=" !ZONES[0] "  v-model="zone" style="width: 1rem" placeholder="全")
            el-option(v-for="(U, i) in ZONES" v-bind:label="U" v-bind:value="i")


        .ds-button.primary.large.bold(@click="Orderlist") 搜索
        //- .buttons(style="margin-left: .3rem")
          .ds-button.cancel.large(@click="clear(true)") 清空
      
      .table-list(style="padding: .15rem .2rem ")
      
        el-table.header-bold.nopadding(:data="data" ref="table" stripe v-bind:max-height=" MH ")

          el-table-column(class-name="pl2" prop="serialNumber" label="注单编号"  show-overflow-tooltip=true)
            template(scope="scope")
              div
                .text-blue( style="padding: 0") {{ scope.row.serialNumber }}

          el-table-column(class-name="pl2" prop="playerName" label="用户" )
            template(scope="scope")
              span() {{ scope.row.playerName }}
          
          el-table-column(prop="createTime" label="投注时间" min-width="150")

          el-table-column(prop="channelName" label="游戏" )

          el-table-column(prop="betTypeName" label="玩法" )

          el-table-column(prop="issueNumber" label="期号" )


          el-table-column(prop="multiple" label="倍数" width="40")


          el-table-column(prop="totalPrice" label="总金额" align="right")
             template(scope="scope")
               span.text-danger -{{ scope.row.cost }}


          el-table-column(class-name="pr2" prop="playerPrize" label="奖金" align="right")
            template(scope="scope")
              span.text-green(v-if="scope.row.playerPrize !== '0.0000' ") +{{ scope.row.playerPrize }}


          el-table-column( prop="winningNumber" label="开奖号码" show-overflow-tooltip=true align="center")

          el-table-column(label="状态" width="60")
            template(scope="scope")
              span(:class=" STATUSCLASS[scope.row.state] ") {{ STATUS[scope.row.state] }}

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")
      
</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import { dateTimeFormat } from '../../util/Date'
  import api from '../../http/api'
  import store from '../../store'
  // import { digitUppercase } from '../../util/Number'
  // import util from '../../util'
  export default {
    mixins: [setTableMaxHeight],
    data () {
      return {
        ACCOUNT: store.state.user.account,
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        stEt: [new Date()._setHMS('0:0:0'), new Date()._setHMS('23:59:59')],
        STATUS: ['未派奖', '已撤单', '未中奖', '已中奖'],
        STATUSCLASS: ['text-green', 'text-orange', 'text-grey', 'text-danger'],
        status: '',
        gameList: [{lotteryId: 1, cnName: 'VR 1.5分彩'}, {lotteryId: 2, cnName: 'VR 赛车'}, {lotteryId: 11, cnName: 'VR 3分彩'}, {lotteryId: 12, cnName: 'VR火星5分彩'}, {lotteryId: 13, cnName: 'VR 快艇'}, {lotteryId: 15, cnName: 'VR 百家乐'}, {lotteryId: 16, cnName: 'VR 六合彩'}],
        gameid: '',
        name: '',
        ZONES: ['自己', '直接下级', '所有下级'],
        zone: '',
        data: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        preOptions: {}
      }
    },
    computed: {
    },
    mounted () {
      this.Orderlist()
    },
    methods: {
      pageChanged (cp) {
        // cp--
        this.Orderlist(cp, () => {
          this.currentPage = cp
        })
      },
      Orderlist (page, fn) {
        let loading = this.$loading({
          text: '投注记录加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        if (!fn) {
          this.preOptions = {
            beginTime: this.stEt[0] ? dateTimeFormat(this.stEt[0]) : '',
            endTIme: this.stEt[1] ? dateTimeFormat(this.stEt[1]) : '',
            username: this.name,
            state: this.status,
            scope: this.zone,
            channelid: this.gameid || '',
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }
        this.$http.post(api.VROrderlist, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 500)
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            this.data = data.items
            this.total = data.totalSize || this.data.length
          } else loading.text = data.msg || '加载失败!'
        }, (rep) => {
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
