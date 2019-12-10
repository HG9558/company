<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .user-list.scroll-content
      
      // 用户列表
      .form(v-if="stepIndex === 0")
        label.item(style="margin-right: .05rem") 用户名 
          input.ds-input.small(v-model="name")

        .ds-button.primary.large.bold(@click="searNow") 搜索


        // label.item 账户余额 
        //   el-input-number(v-model="minMoney")
        //   |  至 
        //   el-input-number(v-model="maxMoney")

        // el-select(v-model="o" placeholder="默认排序")
        //   el-option(v-for="O in OL" v-bind:label="O.title" v-bind:value="O")
        // | &nbsp;&nbsp;
        // label.ds-checkbox-label(@click="btos = !btos" v-bind:class="{active: btos}")
        //   .ds-checkbox
        //   | 从大到小
 
        // label.item
        //   el-select(v-model="u")
        //     el-option(v-for="U in UL" v-bind:label="U.title" v-bind:value="U")

        // label.item 返点级别 
        //   el-input-number(v-model="minPoint")
        //   |  至 
        //   el-input-number(v-model="maxPoint")

        // .buttons
        //   .ds-button.primary.large.bold(@click="searNow") 搜索
        //   // .ds-button.primary.large.bold(style="float: right" @click.stop="addUserNow") 增加用户
        //   .ds-button.cancel.large(@click="clear") 清空

        p(style="margin: .3rem 0 .15rem 0")
          el-breadcrumb(separator=">")
            el-breadcrumb-item(v-for="(B, i) in BL" @click.native=" link(B, i) " ) {{ B.title }}

        el-table.header-bold.nopadding(:data="data"  @cell-click="cellClick")

          el-table-column(prop="userName"  label="用户名" width="100")
            template(scope="scope")
              span(:class=" { 'pointer text-blue': !scope.row.static } ") {{ scope.row.userName }}

          el-table-column(prop="salary"  label="日工资" width="100" align="right")

          el-table-column(prop="teamSales"  label="团队销量" width="100" align="right")

          el-table-column(prop="activityCount"  label="活跃用户" width="100" align="right")

          el-table-column(label="操作" align="center")
            template(scope="scope")
              .ds-button.text-button.blue(style="padding: 0 .05rem" v-if=" scope.row.canWrite !== '0' " @click.stop=" (stepType = 'salary') && ++stepIndex && (user = scope.row) && (((o = scope.row.salary) && false) || ((teamSales = scope.row.teamSales / 10000) && false) || ( activityCount = scope.row.activityCount ))   ") 设置日工资
        
        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")

        
      // 充值
      transition-group(name="slide" appear=true tag="div")
        div(key="2" v-if="stepIndex === 1 && stepType === 'salary' ")
          p.title.text-black(style="margin: .2rem 0 .2rem .2rem") 您正在给下级用户 
            span.text-blue {{ user.userName }}
            |  设置日工资
            span.ds-button.text-button.blue(style="float: right" @click="stepIndex--") {{ '<返回上一页' }} 
          
          .notice(style="margin: .2rem; margin-bottom: .1rem" v-if=" platform === 'ds' ")
            span.title 工资说明：
            p.content
              | 1：工资分为基础工资和考核工资。
              br
              | 2：【基础工资】：由上级设置，为固定值，比如1万20，结合销量和活跃人数的设置为标准。
              br
              | 3：【考核工资】：平台统一工资考核标准，根据团队日量和团队活跃用户综合考核工资标准。考核标准查看活动页面
              br
              | 4：&nbsp;实际工资标准为：按照考核工资和基础工资的最大值发放。
              br
              | 5：&nbsp;例，您的基础工资为1万20，当日你的考核工资为1万30，那当日工资=团队日量*1万30。例，您的基础工资为1万30，当日你的考核工资为1万10，那当日工资=团队日量*1万30。

          p(style="padding-left: 30%; margin-top: .7rem")
            span.text-danger * 日工资：&nbsp;&nbsp;
            el-select(v-model="o" style="width: 2.2rem; position: relative; top: -.01rem")
              el-option(v-for="O in OL" v-bind:label="O.name" v-bind:value="O.value")

          // p(style="padding-left: 30%; margin-top: .7rem") 
          //   span.text-danger *
          //   | 用户名：&nbsp;&nbsp;&nbsp;

          p(style="padding-left: 30%; margin-top: .15rem") 
            | 团队销量：
            el-input-number(v-model="teamSales")
            |  万

          p(style="padding-left: 30%; margin-top: .15rem") 
            | 活跃用户：
            el-input-number(v-model="activityCount")
            |  人
            br
            span.ds-button.primary.large.bold(style="margin-left: .7rem; margin-top: .15rem" @click="setSalary") 确认






      
</template>

<script>
  // import { digitUppercase } from '../../util/Number'
  // import store from '../../store'
  import xhr from 'components/xhr'
  import api from '../../http/api'
  export default {
    mixins: [xhr],
    data () {
      return {
        // me: store.state.user,
        stepIndex: 0,
        stepType: 'salary',
        name: '',
        // 日工资
        OL: [],
        o: '',
        // 中奖工资
        OOL: [],
        oo: '',
        // 默认排序
        // OL: [
        //   {id: 1, title: '用户名'},
        //   {id: 2, title: '账户余额'},
        //   {id: 3, title: '返点级别'}
        // ],
        // o: {},
        // // 用户级别
        // UL: [
        //   {id: 1, title: '代理用户'},
        //   {id: 2, title: '会员用户'}
        // ],
        // u: {},
        // 从大到小
        // btos: false,
        // 面包
        BL: [
          {title: '自己'}
        ],
        data: [{}],
        pageSize: 20,
        // pageSize: 5,
        total: 0,
        currentPage: 1,
        preOptions: {},
        // 下级
        user: { account: 'xxxx', name: 'xxxxx', point: 7.5 },
        teamSales: 0,
        activityCount: 0
      }
    },
    computed: {
      // textMoney () {
      //   return digitUppercase(this.money)
      // }
    },
    mounted () {
      this.subSalaryList()
    },
    methods: {
      pageChanged (cp) {
        this.subSalaryList(cp, () => {
          this.currentPage = cp
        })
      },
      // &salary=20&teamSale=200&actvityCount=0&userId=7
      // 设置日工资：
      setSalary () {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=recharge&destId=5&amount=100.5
        let loading = this.$loading({
          text: '工资调整中...',
          target: this.$el
        }, 10000, '工资调整超时...')
        this.$http.post(api.setSalary, {
          userId: this.user.userId,
          salary: this.o,
          activityCount: this.activityCount,
          teamSale: this.teamSales
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '工资调整成功!'
              this.stepIndex = 0
              this.subSalaryList()
            }, 100)
          } else loading.text = data.msg || '工资调整失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      clear () {
        this.name = ''
        // this.minMoney = ''
        // this.maxMoney = ''
        // this.minPoint = ''
        // this.maxPoint = ''
      },
      // sortByteamBalance (a, b) {
      //   console.log(a, b)
      //   return a > b
      // },
      cellClick (row, column, cell, event) {
        if (column.property === 'userName' && !row.static) {
          this.BL.push({
            id: row.userId,
            title: row.userName
          })
          this.subSalaryList()
        }
      },
      link (B, i) {
        if (i !== B.length - 1) {
          this.BL = this.BL.slice(0, i + 1)
          this.subSalaryList()
        }
      },
      searNow () {
        this.subSalaryList()
      },
      // addUserNow () {
      //   this.$router.push('/group/3-2-1')
      // },
      subSalaryList (page, fn) {
        // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=subSalaryList&userName=dd&minPoint=0&maxPoint=8&maxBalance=100000&minBalance=0&startRegistTime=20161101000000&endRegistTime=20161231000000
        let loading = this.$loading({
          text: '用户列表加载中...',
          target: this.$el
        }, 10000, '加载超时...')

        if (!fn) {
          this.preOptions = {
            userId: this.BL[this.BL.length - 1].id,
            userName: this.name,
            page: 1,
            pageSize: this.pageSize
          }
        } else {
          this.preOptions.page = page
        }

        this.$http.post(api.subSalaryList, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
            data.salaryList[0] && (data.salaryList[0].static = true)
            data.salaryList[0] && (this.BL.length === 1) && (data.salaryList[0].self = true)
            this.data = data.salaryList || []
            this.OL = data.salaryComb || []
            this.total = data.totalSize || this.data.length
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            // this.OOL = data.winSlaryData
          } else loading.text = '加载失败!'
        }, (rep) => {
          // error
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      }
      // goBonus () {
      //   if (this.user.userId) {
      //     this.$router.push({
      //       path: '/me/2-3-1',
      //       query: {
      //         userId: this.user.userId
      //       }
      //     })
      //   }
      // }
      // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=distriUserAddCount&destUserId=5&levelVip=1&levelOne=1&levelTwo=1&levelThree1
      // 用配额点
      // http://192.168.169.44:9901/cagamesclient/team/useList.do?method=adjustPoint&destUserId=5&adjustType=0&increaseType=1&point=0.1
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .user-list
    top TH
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
  .amount
    font-family Roboto
    font-size 0.72rem
    color #333
  .text-money
    color #999
  
  .notice
    font-size .12rem
    line-height .22rem
    margin 0 .2rem
    padding PWX
    background-color #fffde8
    border 1px solid #d5d09b
    radius()
    .content
      display inline-block
      margin 0
      line-height .25rem
      vertical-align top
</style>
