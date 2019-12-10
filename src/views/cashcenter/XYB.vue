<template lang="jade">

  .xyb
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .a
        .b.inlb
          .c

        .b.inlb
          .d
            p.e
              span {{ xyb.rate }}
              span %
            p.f 年化收益率
            p 每{{ xyb.time }}小时结算一次收益
            p 随存随取

        .b.inlb
          .g.t_c
            .h.inlb
            p.f 当前余额(元)
            p.k {{ Number(xyb.balance).toFixed(3) }}


        .b.inlb
          .i.t_c
            .h.inlb
            p.f 累计收入(元)
            p.k {{ Number(xyb.income).toFixed(3) }}

        .b.inlb
          .j
            .full.ds-button.positive(@click=" t = 1 ") 转入
            .full.ds-button.outline.blue(@click=" (t = 2) && (s = 0) ") 转出
      
      .l.t_c
        .ds-button-group
          .ds-button(v-bind:class=" {selected: i === 0} " @click=" (i = 0) || list() ") 资金明细
          .ds-button(v-bind:class=" {selected: i === 1} " @click=" (i = 1) && list() ") 结算记录
        
        el-table.header-bold.nopadding(:data="data0" ref="table" stripe v-bind:max-height=" MH " v-show=" !i " class="r-tb")

          el-table-column(class-name="pl2" prop="createdateBack" align="center" label="交易时间" )
          el-table-column(class-name="pl2" prop="action" align="center" label="交易类型" )
            template(scope="scope")
              span {{ type[scope.row.action] }}


          el-table-column(class-name="pl2" prop="changemoney" align="center" label="交易金额" )
            template(scope="scope")
              span(v-if=" !Number(scope.row.changemoney) ") 0.000
              span.text-green(v-if=" scope.row.changemoney && scope.row.changemoney._o0() " ) +{{ scope.row.changemoney && Number(scope.row.changemoney).toFixed(3)._nwc() }}
              span.text-danger(v-if=" scope.row.changemoney && scope.row.changemoney._l0() " ) {{ scope.row.changemoney && Number(scope.row.changemoney).toFixed(3)._nwc() }}

          el-table-column(class-name="pl2" prop="amount" align="center" label="交易后账户金额" )
            template(scope="scope")
              span {{ Number(scope.row.amount).toFixed(3)._nwc() }}

          el-table-column(class-name="pl2" prop="remark" align="center" label="备注" )

        el-table.header-bold.nopadding(:data="data1" ref="table" stripe v-bind:max-height=" MH " v-show=" i " class="r-tb")

          el-table-column(class-name="pl2" prop="createdateBack" align="center" label="结算时间" )
          el-table-column(class-name="pl2" prop="unit" align="center" label="结算周期" width="300")
          el-table-column(class-name="pl2" prop="base" align="center" label="有效资金" )
          el-table-column(class-name="pl2" prop="changemoney" align="center" label="收益" )

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")


    
    Modal.xyb-modal(v-if=" t " v-bind:Pbtn="Pbtn " v-bind:PboxStyle="PboxStyle" v-bind:Pclose="Pclose")
      .my-content.text-333(slot="my-content" style="text-align: left; font-size: .14rem; line-height: .36rem; user-select: text; position: relative; top: -.36rem")
        p.text-center.text-bold.text-333.ft16 {{ ['', '转入', '转出'][t] }}信游宝

        label.item.inlb {{ ['', '奖金来源：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;', '转出至：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'][t] }}
          el-select(v-model="s" style="width: 1.7rem" placeholder="无")
            el-option(v-for=" (n, i) in source "  v-bind:value=" i " v-bind:label=" n ")

        p {{ ['', '可转入金额', '信游宝余额'][t] }}：&nbsp;&nbsp;&nbsp;&nbsp;
          span.text-blue.text-bold {{ Number([[], [ME.amoney, ME.smoney], [xyb.balance]][t][s]).toFixed(3) }}
      
        label.item.inlb 转{{ ['', '入', '出'][t]}}金额：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          input.ds-input(v-model=" m " maxlength="12")


        .text-center(style="position: relative; top: .1rem")
          .ds-button.positive.full(@click="p2pBuyProduct") 确定

        p.text-center.pt15(v-if=" t === 1 && xyb.profitTime ") 预计收益到账时间 
          span.text-blue {{ new Date(xyb.profitTime)._toMonthDayStringCN() }}({{ new Date(xyb.profitTime)._toWeek() }})

</template>

<script>
import Modal from 'components/Modal'
import api from 'src/http/api'
import setTableMaxHeight from 'components/setTableMaxHeight'
import page from 'components/page'
import store from 'src/store'
export default {
  mixins: [setTableMaxHeight, page],
  components: {
    Modal
  },
  name: 'xyb',
  props: [],
  data () {
    return {
      TH: 350,
      ME: store.state.user,
      i: 0,
      data0: [],
      data1: [],
      t: 0,
      Pbtn: [],
      PboxStyle: {
        width: '3.4rem',
        padding: '.1rem .2rem'
      },
      products: [],
      xyb: {
        rate: '',
        balance: 0,
        income: 0
      },
      m: '',
      s: 0,
      type: {
        settlement: '结算收益',
        transfer: '转入',
        transferOut: '转出'
      }
    }
  },
  computed: {
    source () {
      return [[], ['主账户', '特殊账户'], ['主账户']][this.t]
    }
  },
  watch: {
    t (n, o) {
      if (n === 1) this.getTimeByProductId(this.xyb.id)
    }
  },
  mounted () {
    this.p2pList()
    this.list()
  },
  // selectAccountChange: '/p2p/product.do?method=selectAccountChange',
  // p2pBuyProduct: '/p2p/product.do?method=buyProduct',
  // p2pAccount: '/p2p/product.do?method=productAccount',
  // p2pList: '/p2p/product.do?method=list',
  methods: {
    getTimeByProductId (id = 1) {
      this.$http.get(api.getTimeByProductId, {productId: id}).then(({data: {dataTime, success}}) => {
        if (success) this.$set(this.xyb, 'profitTime', dataTime)
      })
    },
    p2pList () {
      this.$http.get(api.p2pList).then(({data: {data}}) => {
        this.products = data
        this.p2pAccount(data[0])
      })
    },
    p2pAccount (p) {
      this.$http.get(api.p2pAccount, {productId: p.id}).then(({data}) => {
        this.xyb = Object.assign(p, {balance: data.balance, income: data.income})
      })
    },
    resetBuyModalParams () {
      this.s = 0
    },
    p2pBuyProduct () {
      if (!Number(this.m)) return this.$message.error({message: '请输入金额'})
      this.$http.get(api.p2pBuyProduct, {productId: this.xyb.id, action: ['', 'buy', 'withdraw'][this.t], amount: this.m, accountType: this.s}).then(({data: {success, status, msg, t1, t}}) => {
        if (success === 1 || status === 1) {
          store.actions.setUser({amoney: t1.availablebalance + '', smoney: t1.specialBalance + ''})
          this.xyb.balance = t.balance
          this.ok()
          this.resetBuyModalParams()
        } else {
          // this.$modal.warn({
          //   content: msg || '转入/转出失败',
          //   PPboxStyle: {width: '3.6rem'},
          //   btn: ['确定']
          // })
        }
      })
    },
    list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
      let loading = this.$loading({
        text: '加载中...',
        target: this.$refs['table'].$el
      }, 10000, '加载超时...')
      this.$http.post(api.selectAccountChange, Object.assign({
        action: !this.i ? '' : '1',
        productId: this.xyb.id
      }, option)).then(({data: {data, totalSize, success}}) => {
        if (success) {
          /* eslint-disable */
          // data = [{'action': 'transfer', 'amount': '2679.544', 'base': '2500.544', 'changemoney': '15.000', 'createdate': '2019-03-16 11:30:13.0', 'createdateBack': '2019-03-16 11:30:13', 'id':14696,'productid': '1', 'remark': '从【主账户】转入', 'serviceCode': '100', 'userid':166},{'action': 'transfer', 'amount': '2664.544', 'base': '2500.544', 'changemoney': '15.000', 'createdate': '2019-03-16 11:29:56.0', 'createdateBack': '2019-03-16 11:29:56', 'id':14695,'productid': '1', 'remark': '从【主账户】转入', 'serviceCode': '100', 'userid':166},{'action': 'transferOut', 'amount': '2649.544', 'base': '2500.544', 'changemoney': '-1.000', 'createdate': '2019-03-16 11:26:57.0', 'createdateBack': '2019-03-16 11:26:57', 'id':14694,'productid': '1', 'remark': '转出至【主账户】', 'serviceCode': '100', 'userid':166},{'action': 'transfer', 'amount': '2650.544', 'base': '2500.544', 'changemoney': '150.000', 'createdate': '2019-03-16 11:26:10.0', 'createdateBack': '2019-03-16 11:26:10', 'id':14693,'productid': '1', 'remark': '从【主账户】转入', 'serviceCode': '100', 'userid':166},{'action': 'settlement', 'amount': '2500.544', 'base': '2500.441', 'changemoney': '0.103', 'createdate': '2019-03-16 00:00:00.0', 'createdateBack': '2019-03-16 00:00:00', 'id':14681,'productid': '1', 'rate': '3.000', 'remark': '结算收益', 'serviceCode': '100', 'unit': '2019-03-15 12:00至2019-03-16 00:00', 'userid':166},{'action': 'settlement', 'amount': '2500.235', 'base': '2500.132', 'changemoney': '0.103', 'createdate': '2019-03-15 12:00:00.0', 'createdateBack': '2019-03-15 12:00:00', 'id':14656,'productid': '1', 'rate': '3.000', 'remark': '结算收益', 'serviceCode': '100', 'unit': '2019-03-15 00:00至2019-03-15 12:00', 'userid':166},{'action': 'settlement', 'amount': '2500.338', 'base': '2500.235', 'changemoney': '0.103', 'createdate': '2019-03-15 12:00:00.0', 'createdateBack': '2019-03-15 12:00:00', 'id':14657,'productid': '1', 'rate': '3.000', 'remark': '结算收益', 'serviceCode': '100', 'unit': '2019-03-15 00:00至2019-03-15 12:00', 'userid':166},{'action': 'settlement', 'amount': '2500.441', 'base': '2500.338', 'changemoney': '0.103', 'createdate': '2019-03-15 00:00:00.0', 'createdateBack': '2019-03-15 00:00:00', 'id':14673,'productid': '1', 'rate': '3.000', 'remark': '结算收益', 'serviceCode': '100', 'unit': '2019-03-14 12:00至2019-03-15 00:00', 'userid':166}]
          this['data' + this.i] = data
          this.total = totalSize || this['data' + this.i].length
          /* eslint-enable */
          cb()
        }
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    Pclose () {
      this.t = 0
      return false
    },
    isTransferIn () {
      return this.t === 1
    },
    ok () {
      this.$modal.success({
        content: '<p class="text-333 ">操作成功！</p><p class="text-999 ft14">资金已转' + [[], ['入信游宝'], ['出至主账户', '出至特殊账户']][this.t][this.isTransferIn() ? 0 : this.s] + '</p>',
        PPboxStyle: {width: '3.6rem'},
        btn: ['确定']
      })
      this.t = 0
      this.list()
    }
  }
}
</script>

<style lang="stylus">
@import '../../var.stylus'
// 建议不添加scoped， 所有样式最多嵌套2层
.xyb
  .scroll-content
    padding 0 .2rem
  .a
    margin 0 -.05rem
    display flex
    flex-wrap wrap
    // justify-content center
  
  .b

    display flex
    justify-content center
    align-items center
    
    height 1.8rem
    min-width 2.5rem
    margin .05rem 
    vertical-align top
    background-color #fff
    background-repeat no-repeat
    
    
    &:nth-child(1)
      color #fff
      background-image url(../../assets/xyb/1.png)
      background-size 100% 100%
      margin-right 0
    &:nth-child(2)
      margin-left 0
      width 2.59rem
      
  .c
    width 2.08rem
    height .89rem
    background-image url(../../assets/xyb/2.png)
    background-size 100% 100%
  
  .d
    color #333
  .e
    color #f63030
  .e span:nth-child(1)
    font-size .6rem
  .f
    color #666
  .h
    width .72rem
    height .54rem
    background-image url(../../assets/xyb/3.png)
    background-size 100% 100%
    background-position center
  .i .h
    height .52rem
    background-image url(../../assets/xyb/4.png)
    background-size 100% 100%
  .j
    width 100%
    padding 0 .2rem
    .ds-button
      margin .05rem 0
      box-shadow none
      &.outline
        border-color BLUE
  .k
    font-size .36rem
    color #333
    
  
    
</style>
