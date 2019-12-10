<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .stock-list.scroll-content

      .form(v-if="stepIndex === 0 ")
        .form-filters
          label.item(v-if="type === 1") 用户名&nbsp;
            input.ds-input.small(v-model="name" style="width: 1rem")


          label.item  &nbsp;状态&nbsp;
            el-select(clearable v-model="s"  placeholder="全" style="width: .8rem")
              el-option( v-for="S in STATUS.slice(0, 4)" v-bind:label="S.title" v-bind:value="S.id")

          | &nbsp;&nbsp;



          .ds-button.primary.large.bold(@click="contract") 搜索

        el-table.header-bold.nopadding(:data="data"  stripe v-bind:max-height=" MH "  v-bind:row-class-name="tableRowClassName")

          el-table-column(class-name="pl2" prop="userName" label="用户名" v-if="type === 1")

          el-table-column(class-name="pl2" prop="beginTm" label="开始时间" )

          el-table-column(class-name="pl2" prop="expireTm" label="截止时间" )


          el-table-column(prop="status" label="状态")
            template(scope="scope")
              span(:class=" { 'text-danger': scope.row.stat === '未签订',  'text-oblue': scope.row.stat === '待确认', 'text-green': scope.row.stat === '已签订'} ") {{ scope.row.stat }}

          el-table-column(label="操作")
            template(scope="scope")

              .ds-button.text-button.blue(v-if=" scope.row.stat !== '未签订' "  style="padding: 0 .05rem" @click.stop=" (showDetail = scope.row.id) ") 查看详情

              .ds-button.text-button.blue(v-if="  ruleCfg.length > 0 && type === 1 && scope.row.stat === '未签订' " style="padding: 0 .05rem" @click="++stepIndex && (user = scope.row)") 新建契约

              .ds-button.text-button.blue(v-if=" ruleCfg.length > 0 && type === 1 && (scope.row.stat === '已签订' || scope.row.stat === '已拒绝' || scope.row.stat === '待确认')" style="padding: 0 .05rem" @click="++stepIndex && (user = scope.row)") 重新发起

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")


      div(v-if="stepIndex === 1 ")

        .notice(style="margin-top: .2rem")
            span.title 温馨提示：
            p.content
              span.text-danger 在您和下级签订了签约以后，如果每期的下级契约分红没有完成发放，则您的提款和代充功能将暂时会被禁用
              br
              | 1.
              span.text-danger 销量
              | 和
              span.text-danger 亏损
              | 只要达到规则，都应按照规则的分红比例派发分红
              br
              | 2.
              span.text-danger [手动发放]
              | 即每次发分红的时候需要您进入{{ platform === 'ds' ? '用户管理' : 团队管理 }}的
              span.text-danger 分红列表-分红详情
              | 中进行点击确认发放
              br
              | 3.
              span.text-danger [自动发放]
              | 是在您资金足够的情况下，由系统根据您设置的规则自动发放下级分红，资金不足则交由您
              span.text-danger 手动执行
              br
              | 4. 契约执行周期为：[按月]
              span.text-danger 1号
              | ；[按半月]
              span.text-danger 1号
              | 和
              span.text-danger 16号
              //- |；[按周]
              //- span.text-danger 周一
              br
              | 5. 一天内投注额达到
              span.text-danger 500元
              | ，为一个有效用户


        p.title.text-black
          span.ds-button.text-button.blue(style="float: right" @click="stepIndex--") {{ '<返回上一页' }}


        div(style="margin: 0 10% 0 25%; margin-top: .3rem; min-width: 6rem" v-bind:class="[ user.state ]")



          p.item.block
            span.text-danger *
            | 用户名：&nbsp;&nbsp;&nbsp;&nbsp;
            span.text-black {{ user.userName }}

          .item.block
            span.text-danger *
            | 契约时间：
            el-date-picker(:picker-options="ApickerOptions" v-model="stEtA" type="datetimerange" placeholder="请选择日期时间范围" v-bind:clearable="clearableOnTime")

          p.item.block
             span.text-danger *
             | 发放周期：
             //- span 半月
             el-select(v-model=" SV " style="width: .7rem" placeholder="无")
                el-option(v-for="S in sendCycle" v-bind:label=" time[S - 1] " v-bind:value="S")

                span.text-black(style="padding: 0 .16rem") {{ time[me.shareCycle] }}

          p.item.block
            span.text-danger *
            | 发放方式：
            label.text-black(style="padding: 0; margin-left: -.05rem ").ds-radio-label(@click=" sendType = 0 " v-bind:class=" { active: sendType === 0 } ")
               span.ds-radio.white.
               | 手动发放
            label.text-black(style="padding: 0 .1rem").ds-radio-label(@click=" sendType = 1 " v-bind:class=" { active: sendType === 1 } ")
              span.ds-radio.white.
              | 自动发放
              span.text-green  ( 推荐 )

          p.item.block(v-for=" (CR, i) in CRULES ")
            span.text-danger {{ i===0? '*': '&nbsp;'}}
            | {{ CR.title }} ：&nbsp;&nbsp;&nbsp;
            span.text-black 累计
            el-select(v-model="CR.ruletype" style="width: .7rem" placeholder="全")
              el-option(v-for="R in TYPE" v-bind:label="R.title" v-bind:value="R.id")
            | &nbsp;&nbsp;
            el-input-number.text-danger.text-right(style="width: .8rem;" v-model="CR.sales"  v-bind:debounce="2000")
            span.text-black &nbsp;万，有效人数&nbsp;
            el-input-number.text-danger.text-right(style="width: .6rem;" v-model="CR.actUser" v-bind:min="1"  v-bind:debounce="2000")
            span.text-black  人，分红比例 
            el-select(v-model=" CR.bounsRate " style="width: .7rem" placeholder="全")
              el-option(v-for="R in ruleCfg.filter(x => x.ruletype === CR.ruletype) " v-bind:label="R.bounsRate + '%' " v-bind:value="R.bounsRate")
            span(v-if="CR.bounsRate") &nbsp;最低
              span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).sales }} 
              | 万，
              span.text-blue  {{ ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate).actUser }} 
              | 人


          .buttons.item.block(style="padding-left: .55rem")
            .ds-button.x-small.text-button.el-icon-plus.blue(@click=" ruleLength++ " v-if="ruleLength < 21")
              span.text-black &nbsp;再加一行

            .ds-button.x-small.text-button.el-icon-minus.blue(@click=" ruleLength-- " v-if="ruleLength > 3 ")
              span.text-black &nbsp;减最后一行

          .buttons.item.block(style="padding-left: .6rem")
            .ds-button.primary.bold(@click="createContract") 确认发送

    .modal(v-if="showDetail" )
      .mask
      .box-wrapper
        .box(ref="box" style="max-width: 5rem; max-height: 9rem; height: 6.06rem;")
          .tool-bar
            span.title 契约详情
            el-button-group
              el-button.close(icon="close" @click="showDetail = ''")
          ContractDetail(v-bind:id=" showDetail " v-bind:myself=" !this.type " v-bind:cType='cType' style="min-height: 5rem;")


</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import ContractDetail from './ContractDetail'
  import api from '../../http/api'
  import { dateTimeFormat } from '../../util/Date'
  import store from '../../store'
  export default {
    mixins: [setTableMaxHeight],
    components: {
      ContractDetail
    },
    data () {
      return {
        TH: 180,
        // 0 我的契约
        // 1 下级契约
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起一年',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          }]
          // disabledDate (time) {
          //   return time.getTime() > Date.now()
          // }
        },
        ApickerOptions: {
          shortcuts: [{
            text: '今起一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起六个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '今起一年',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          }],
          disabledDate (time) {
            return time.getTime() < Date.now()
          }
        },
        defaultStEt: ['', ''],
        stEt: ['', ''],
        stEtA: ['', ''],
        me: store.state.user,
        time: ['月'],
        sendCycle: [1],
        SV: '',
        type: 1,
        // st: '',
        // et: '',
        STATUS: [
          {id: '0', title: '待确认'},
          {id: 1, title: '已签订'},
          {id: 2, title: '未签订', reason: '已作废'},
          {id: 3, title: '已拒绝', reason: '已拒绝'},
          {id: 4, title: '待确认', reason: '重新发起'}
        ],
        s: '',
        data: [],
        pageSize: 20,
        // pageSize: 5,
        total: 0,
        currentPage: 1,
        preOptions: {},
        stepIndex: 0,
        user: {},
        // st1: '',
        // et1: '',
        sendType: 1,
        AT: 0,
        // 规则一：累计
        TYPE: [{id: 1, title: '亏损'}],
        r: {id: 1, title: '亏损'},
        RULES: [
          {title: '规则一', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则三', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则四', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则五', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则六', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则七', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则八', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则九', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十一', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十二', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十三', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十四', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十五', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十六', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十七', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十八', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则十九', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十一', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十二', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十三', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十四', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十五', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十六', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十七', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十八', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则二十九', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1},
          {title: '规则三十', ruletype: 1, sales: 0, bounsRate: 0, actUser: 1}
        ],
        ruleLength: 3,
        name: '',
        showDetail: false,
        I: 1,
        cType: 1,
        ruleCfg: []
      }
    },
    computed: {
      CRULES () {
        return this.RULES.slice(0, this.ruleLength)
      },
      dataRules () {
        return this.CRULES.filter(c => c.sales >= 0 && c.bounsRate > 0).map(n => {
          return {
            ruletype: n.ruletype,
            sales: n.sales,
            bounsRate: n.bounsRate,
            actUser: n.actUser
          }
        })
      },
      hasRepeat () {
        return this.dataRules.reduce((p, m, i) => {
          let M = Object.assign({}, m)
          delete M.bounsRate
          if (p[JSON.stringify(M)]) {
            p.flag = true
          } else {
            p[JSON.stringify(M)] = true
          }
          return p
        }, {}).flag
      }
    },
    watch: {
      type () {
        this.contract()
      },
      hasRepeat () {
        this.hasRepeat && this.$modal.warn({
          target: this.$el,
          content: '请不要输入相同相似的规则!',
          btn: ['好的']
        })
      },
      stEt: {
        deep: true,
        handler () {
          if (!this.stEt) this.stEt = this.defaultStEt
          if (this.stEt[0] && this.stEt[1] && (window.newDate(this.stEt[0])).getTime() === (window.newDate(this.stEt[1])).getTime()) {
            this.stEt[1] = dateTimeFormat((window.newDate(this.stEt[1])).getTime() + 3600 * 1000 * 24 - 1000)
          }
        }
      },
      CRULES: {
        deep: true,
        handler () {
          this.CRULES.forEach(CR => {
            let rule = this.ruleCfg.find(x => x.ruletype === CR.ruletype && CR.bounsRate === x.bounsRate)
            if (!rule) return
            let sales = rule.sales
            let actUser = rule.actUser
            setTimeout(() => {
              if (CR.actUser < actUser) CR.actUser = actUser
              if (CR.sales < sales) CR.sales = sales
            }, 0)
          })
        }
      }
    },
    mounted () {
      this.contract()
      // this.getSysContractRange()
      // if (this.platform === 'ds') {
      const end = new Date()
      const start = new Date()
      end.setTime(end.getTime() + 3600 * 1000 * 24 * 360 * 10)
      this.stEtA = [start, end]
      // }
    },
    methods: {
      pageChanged (cp) {
        this.contract(cp, () => {
          this.currentPage = cp
        })
      },
      // getSysContractRange () {
      //   this.$http.get(api.getSysContractRange).then(({data}) => {
      //     // success
      //     if (data.success === 1) {
      //       this.sendCycle = data.sendCycle.split(',')
      //     }
      //   }, (rep) => {
      //     // error
      //   })
      // },
      goContractDetail (id) {
        this.$router.push({
          path: '/group/3-3-4',
          query: {id: id, self: !this.type}
        })
      },
      contract (page, fn) {
        let loading = this.$loading({
          text: '契约列表加载中...',
          target: this.$el
        }, 10000, '加载超时...')

        if (!fn) {
          this.preOptions = {
            // beginDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            startDate: this.stEt[0] ? dateTimeFormat(this.stEt[0]).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            endDate: this.stEt[1] ? dateTimeFormat(this.stEt[1]).replace(/[\s:-]*/g, '') : '',
            // startDate: this.st ? dateTimeFormat(this.st.getTime()).replace(/[\s:-]*/g, '') : '',
            // endDate: this.et ? dateTimeFormat(this.et.getTime()).replace(/[\s:-]*/g, '') : '',
            status: this.s || '',
            page: 1,
            pageSize: this.pageSize,
            userName: this.type === 1 ? this.name : '',
            cType: this.cType
          }
        } else {
          this.preOptions.page = page
        }

        this.$http.get(this.type === 0 ? api.queryMyContract : api.mySubContract, this.preOptions).then(({data}) => {
          // success
          if (data.success === 1) {
            // data.mySubContract && data.mySubContract.forEach(c => {
            //   if (c.id <= 0) {
            //     c.stat = 2
            //     c.beginTm = '--'
            //     c.expireTm = '--'
            //   }
            // })
            // this.cType = data.cType
            this.ruleCfg = data.ruleCfg || []
            this.data = data.contractList || data.mySubContract
            this.total = data.totalSize || this.data.length
            typeof fn === 'function' && fn()
            !fn && (this.currentPage = 1)
            setTimeout(() => {
              loading.text = '加载成功!'
            }, 100)
          } else {
            this.data = []
            loading.text = '加载失败!'
          }
        }, (rep) => {
          // error
          this.$message.error('加载失败！')
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      createContract () {
        // let data = this.CRULES.slice()
        // data.forEach(c => {
        //   c.bounsRate /= 100
        //   delete c.title
        // })
        if (!this.stEtA[0] || !this.stEtA[1]) {
          return this.$message.warning({target: this.$el, message: '请选择契约时间！'})
        }
        if (!this.SV) {
          return this.$message.warning({target: this.$el, message: '请选择发放周期！'})
        }
        if (!this.dataRules[0]) {
          return this.$message.warning({target: this.$el, message: '请至少设置一条契约规则！'})
        }
        if (this.hasRepeat) {
          return this.$modal.warn({
            target: this.$el,
            content: '请不要输入完全相同的规则!',
            btn: ['好的']
          })
        }
        this.$http.post(api.createContract, {
          beginTm: dateTimeFormat((window.newDate(this.stEtA[0])).getTime()).replace(/[\s:-]*/g, ''),
          expireTm: dateTimeFormat((window.newDate(this.stEtA[1])).getTime()).replace(/[\s:-]*/g, ''),
          userId: this.user.userId,
          sendType: this.sendType,
          // sendCycle: parseInt(this.SV),
          cType: this.cType,
          // sendCycle: 2,
          // sharecycle: this.AT,
          // bonusRuleList: JSON.stringify(data)
          bonusRuleList: JSON.stringify(this.dataRules)
        }).then(({data}) => {
          // success
          if (data.success === 1) {
            this.$modal.success({
              content: '契约发送成功！',
              btn: ['确定'],
              target: this.$el,
              close () {
                this.stepIndex--
                this.contract()
              },
              O: this
            })
          } else this.$message.error(data.msg || '契约创建失败！')
        }, (rep) => {
          // error
          this.$message.error('契约创建失败！')
        })
      },
      qryContractById (contractId) {
        this.$http.post(api.qryContractById, {
        }).then(({data}) => {
          // success
          if (data.success === 1) {
          }
        }, (rep) => {
          // error
          this.$message.error('契约创建失败！')
        })
      },
      qryBonusById (contractId) {
        this.$http.post(api.qryBonusById, {
        }).then(({data}) => {
          // success
          if (data.success === 1) {
          }
        }, (rep) => {
          // error
          this.$message.error('契约创建失败！')
        })
      }
      // 按ID查询契约
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=qryContractById&contractId=12
      // qryContractById: api + 'team/contractBonus.do?method=qryContractById',
      // 按ID查询奖金
      // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=qryBonusById&bonusId=1
      // qryBonusById: api + 'team/contractBonus.do?method=qryBonusById'
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  .stock-list
    padding .1rem .2rem
  .form-filters
    padding .15rem
    margin 0 0 .2rem 0 !important

  .item
    display inline-block
    margin 0 PW .1rem 0
    &.block
      display block

  .el-select
  .el-input-number
    width 1rem

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