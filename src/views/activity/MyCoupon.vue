<template lang="jade">
  .mycoupon-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content
      .table-list(style="padding: .15rem .2rem ")
        el-table.header-bold.nopadding(:data="data" ref="table" stripe v-bind:max-height="MH")
         
          el-table-column(class-name="" prop="createTime" label="领取时间" align="center" )
          el-table-column(class-name="" prop="getTime" label="使用时间" align="center" )
          el-table-column(class-name="" prop="goodsName" label="优惠券名称" align="center" min-width="180")
          el-table-column(class-name="" prop="desc" label="优惠说明" align="center" )
            //- template(scope="scope")
              span {{ scope.row.isUsed ? scope.row.prizeAmount : scope.row.desc }}

          el-table-column(class-name="" prop="activityName" label="所属优惠活动" align="center" )
          el-table-column(class-name="" prop="expireTime" label="有效期至" align="center" )
          el-table-column(class-name="" prop="isUsed" label="状态" align="center" )
            template(scope="scope")
              span(:class=" {'text-grey': scope.row.isUsed, 'text-green': !scope.row.isUsed, } ") {{ stateText[scope.row.isUsed] }}

          el-table-column(label="操作" align="center")
            template(scope="scope")
              span.ds-button.text-button(:class=" {blue: !scope.row.isUsed} " @click=" current = scope.row ") {{ stateActionText[scope.row.isUsed] }}

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > pageSize " v-on:current-change="pageChanged")
      
    Modal.in-mycoupon(v-if=" current " v-bind:Pbtn="Pbtn " v-bind:PboxStyle="PboxStyle" v-bind:Pclose="Pclose")
      .my-content.text-666(slot="my-content" style="text-align: left; font-size: .16rem; line-height: .36rem; user-select: text; position: relative; top: -.36rem")
        p.text-center.text-bold.text-333.ft18 {{ current.goodsName }}
        p 优惠说明： {{ current.desc }}
        div 使用说明： 
          .inlb(style="width: 80% ;vertical-align: top") {{ current.goodsdesc }}
        p(v-if="current.gameGroupPlatArr") 选择游戏： 
          //- span(v-if=" current.gameGroupId !== '0' ") {{ current.gameGroupName }}
          el-select(clearable v-model=" groupId " style="width: 1.6rem" placeholder=" --选择游戏-- ")
            el-option(v-for="(g, i) in current.gameGroupPlatArr" v-bind:label=" g.groupName " v-bind:value=" i ")

        p(v-if="current.gameGroupPlatArr") 选择平台： 
          //- template(v-if=" current.gameGroupId !== '0' ")
            span(v-if=" current.platList.length === 1 ") {{ current.platList[0].platName }}
            el-select(v-else clearable v-model=" platId " style="width: 1.6rem" placeholder=" --选择平台-- ")
              el-option(v-for="(g, i) in current.platList" v-bind:label=" g.platName " v-bind:value=" g.platId ")

          el-select(clearable v-model=" platId " style="width: 1.6rem" placeholder=" --选择平台-- ")
              el-option(v-for="(g, i) in (current.gameGroupPlatArr[groupId] || {}).platList  " v-bind:label=" g.platName " v-bind:value=" i ")

        p(v-if=" current.withAmt ") 存入本金： 
          input.ds-input(v-model="m" style="width: 1.6rem" @keyup.enter="use")

        .text-center(style="position: relative; top: .1rem")
          .ds-button.cancel.a(@click=" Pclose ") 关闭
          .ds-button.primary.a(@click="use") {{  current.goodsType === 5 ? '立即激活' : '立即使用' }}

</template>

<script>
  import setTableMaxHeight from 'components/setTableMaxHeight'
  import api from '../../http/api'
  import page from 'components/page'
  import Modal from 'components/Modal'
  export default {
    mixins: [setTableMaxHeight, page],
    components: {Modal},
    data () {
      return {
        stateText: ['未使用', '已使用', '已失效'],
        stateActionText: ['立即使用', ''],
        TH: 125,
        Pbtn: [],
        PboxStyle: {
          width: '6rem'
        },
        m: '',
        groupId: 0,
        platId: 0
      }
    },
    watch: {
      groupId () {
        this.platId = 0
      }
    },
    mounted () {
      this.list()
    },
    methods: {
      list (option = {page: 1, pageSize: this.pageSize}, cb = () => { this.currentPage = 1 }) {
        let loading = this.$loading({
          text: '加载中...',
          target: this.$refs['table'].$el
        }, 10000, '加载超时...')
        this.$http.post(api.queryMygoods, Object.assign({
        }, option)).then(({data: {success, myGoods, totalSize}}) => {
          if (success === 1) {
            this.data = myGoods
            this.total = totalSize || this.data.length
            cb()
          }
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 100)
        })
      },
      use () {
        return this.useCoupon()
        // if (this.current.goodsType === 5) this.activeCoupon()
        // else if (this.current.gameGroupPlatArr[this.groupId].groupId === '0' || this.current.gameGroupPlatArr[this.groupId].groupId === '99') this.getLotteryGoodPrize()
        // else this.transferToBG(this.current.goodsType === 3 && Number(this.current.prizeAmount) <= 0)
      },
      // &gameGroupId=0&platId=1&entry=1279
      getLotteryGoodPrize () {
        this.$http.get(api.getLotteryGoodPrize, {
          gameGroupId: this.current.gameGroupPlatArr[this.groupId].groupId,
          platId: this.platId,
          entry: this.current.entry
        }).then(this.then)
      },
      transferToBG (hasMoney) {
        if (hasMoney && !Number(this.m) && Number(this.m) !== 0) return this.$message.warning({target: this.$el, message: '请输入转帐金额！'})
        let args = {
          gameGroupId: this.current.gameGroupPlatArr[this.groupId].groupId,
          platid: this.platId,
          entry: this.current.entry
        }
        if (hasMoney) args.amount = this.m

        this.$http.get(api.transferToBG, args).then(this.then)
      },
      activeCoupon () {
        this.$http.get(api.getNoActivatePrize, {entry: this.current.entry}).then(this.then)
      },
      // &gameGroupId=0&platid=1&amount=100&entry=优惠券ID
      useCoupon () {
        let hasMoney = !!this.current.withAmt
        if (hasMoney && !Number(this.m) && Number(this.m) !== 0) return this.$message.warning({target: this.$el, message: '请输入转帐金额！'})
        let args = {
          gameGroupId: this.current.gameGroupPlatArr ? this.current.gameGroupPlatArr[this.groupId].groupId : '',
          platid: this.current.gameGroupPlatArr ? this.current.gameGroupPlatArr[this.groupId].platList[this.platId].platId : '',
          entry: this.current.entry
        }
        if (hasMoney) args.amount = this.m
        this.$http.get(api.useCoupon, args).then(this.then)
      },
      then ({data}) {
        if (data.success === 1) {
          this.$message.success({target: this.$el, message: data.msg || '优惠券已使用'})
          this.list()
          this.Pclose()
          this.__setCall({fn: '__getUserFund', args: undefined})
        }
      },
      Pclose () {
        this.current = null
        this.groupId = 0
        this.platid = 0
        return false
      }
    }
  }
</script>

<style lang="stylus">
  .in-mycoupon
    .a
      margin .1rem .1rem 0 0
  
</style>

<style lang="stylus" scoped>
  @import '../../var.stylus'
  // .mycoupon-center

</style>
