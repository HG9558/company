<template lang="jade">
  el-row.game-recent-order(style="background: #fff")
    //- br
    //- p
      span.p-a 投注记录&nbsp;&nbsp;
      span.p-b(:class="{active: pageSize === 5}" @click="  pageSize === 5  ? Orderlist() : (pageSize = 5) ") 5条
      span.p-b(:class="{active: pageSize === 10}" @click=" pageSize === 10 ? Orderlist() : (pageSize = 10) ") 10条
      span.p-b(:class="{active: pageSize === 15}" @click=" pageSize === 15 ? Orderlist() : (pageSize = 15) ") 15条
      span.p-b(:class="{active: pageSize === 20}" @click=" pageSize === 20 ? Orderlist() : (pageSize = 20) ") 20条

    el-table.header-bold.nopadding(:data="Cdata" stripe v-bind:row-class-name="tableRowClassName" v-on:row-click="setSelected" style="margin: 0;border: 1px solid #d8d8d8" empty-text="追号记录当前为空！")

      el-table-column(label="追号编号" class-name="pl2")
        template(scope="scope")
          div
            span( style="padding: 0") {{ scope.row.taskId }}

      el-table-column(prop="userName" label="用户" v-if="!noname")
      
      el-table-column(prop="beginTime" label="追号时间"  min-width="120")
        template(scope="scope")
          span() {{ scope.row.beginTime }}

      el-table-column(prop="lotteryName" label="游戏" )

      el-table-column(prop="methodName" label="玩法"  min-width="120")
        template(scope="scope")
          div() {{ scope.row.methodName }}（{{ scope.row.codeType === 1 ? '复式' : '单式'}}）

      el-table-column(prop="beginIssue" label="开始期数" )

      el-table-column(class-name="pl2" prop="issuecount" label="总期数")

      el-table-column(prop="finishedcount" label="完成期数")

      el-table-column(class-name="pl1" prop="modes" label="模式" )
        template(scope="scope")
          span {{ MODES[scope.row.modes - 1] }}            

      el-table-column(prop="taskprice" label="总金额" align="right")
        template(scope="scope")
          span.text-danger() -{{ numberWithCommas(scope.row.taskprice) }}


      el-table-column(class-name="pl2"   label="状态" align="center")
        template(scope="scope")
          span(:class=" STATUSCLASS[scope.row.status] ") {{ STATUS[scope.row.status] }}

      //- el-table-column(label="操作")
        template(scope="scope")

          div()

            .ds-button.text-button.blue(v-if="scope.row.taskId !== '0' " style="padding: 0 .05rem" @click.stop=" showFollow = scope.row.taskId") 追号详情
    
    .a.t_c.pt_10(v-if=" maxp > p || p > 1 ")
      .p-b.aa(:class="{ disabled: p ===  1 }" @click=" p > 1 && p-- ") 上一页
      .p-b.aa(:class="{ disabled: p >= maxp }" @click=" p < maxp && p++ ") 下一页
    


        
</template>

<script>
// import util from '../util'
import api from '../http/api'
import store from '../store'
import { digitUppercase, numberWithCommas } from '../util/Number'
// import M from '../util/M'
export default {
  props: {
    type: Object,
    gameid: Number
    // gameType: String,
    // allLuckyNumbers: Array
    // title: String
  },
  data () {
    return {
      numberWithCommas: numberWithCommas,
      ME: store.state.user,
      STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
      STATUSCLASS: ['text-green', 'text-danger', 'text-grey', 'text-orange'],
      modal: false,
      Cdata: [],
      // STATUS: ['未开奖', '已中奖', '未中奖', '已撤单'],
      show: false,
      row: {prizeCode: ''},
      expandList: [],
      MODES: ['2元', '2角', '2分', '2厘', '1元'],
      fullCode: '获取失败...',
      pageSize: 5 || Number(window.localStorage.getItem('gron')) || 5,
      p: 1,
      totalSize: 0
    }
  },
  computed: {
    maxp () {
      return Math.ceil(this.totalSize / this.pageSize)
    },
    callId () {
      return this.gameid + '|' + this.type.id
    },
    codePosition () {
      return this.row.position ? (this.fullCode || this.row.code + '[' + this.row.position + ']') : this.fullCode || this.row.code
    }
  },
  watch: {
    show () {
      if (!this.show) this.fullCode = '获取失败...'
    },
    'ME.login' () {
      if (this.ME.login) this.Orderlist()
    },
    p () {
      this.Orderlist()
    },
    pageSize () {
      if (this.p === 1) {
        this.Orderlist()
      } else {
        this.p = 1
      }
      window.localStorage.setItem('gron', this.pageSize)
    }
  },
  mounted () {
    this.Orderlist()
  },
  methods: {
    ableRowClassName (row, index) {
      if (row.selected) return 'selected-row'
    },
    setSelected (row) {
      this.$set(row, 'selected', !row.selected)
      // row.selected = !row.selected
    },
    __orderlist () {
      this.Orderlist()
    },
    Orderlist () {
      if (!this.ME.login) return
      this.$http.mypost(api.followList, {
        scope: 0,
        lotteryId: this.gameid,
        page: this.p,
        pageSize: this.pageSize
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          this.Cdata = data.taskList
          this.totalSize = data.totalSize
        }
      }, (rep) => {
        // error
      })
    }
  },
  components: {
  }
}
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-recent-order
    .p-a
      color #000
      font-weight bold
      
    .p-b
      display inline-block
      color #666
      height .3rem
      line-height .3rem
      padding 0
      width .5rem
      text-align center
      margin 0 .02rem
      border 1px solid  rgba(0,0,0,0)
      cursor pointer
      &:hover
        color BLUE
        border 1px solid  #d8d8d8
        background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
        box-shadow: 0px 3px 3px 0px #e3e3e3;
      
      &.active
        color BLUE
        border 1px solid  #d8d8d8
        background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      
    .aa
      width .8rem
      border 1px solid  #d8d8d8
      background-image: linear-gradient(#ffffff, #ffffff),  linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      &.disabled
        cursor not-allowed
        color #bbbbbb
        background-image: linear-gradient(#f6f6f6, #f6f6f6), linear-gradient(0deg, #f2f2f2 0%, #ffffff 100%);
      

</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .game-recent-order
    overflow-y auto
    // padding 0 PW
    radius()
    background #f4f4f4
    display none
    position absolute
    left 0
    right 0
    top "calc(100% - %s)" % 1.85rem
    min-height 1rem
    // max-height 1.9rem
    max-height 10.9rem !important
    
  #app.nds.classic.night .game-page .game-recent-order
    .el-dialog
      .text-black
        color #333
     

</style>



<style lang="stylus" scoped>

  @import '../var.stylus'

  bg = #d8d8d8
  bg-hover = #ececec
  bg-active = #e2e2e2
      
  .tool-bar
    height TH
    line-height TH 
    // background-color bg
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