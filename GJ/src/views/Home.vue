<template lang="jade">
.home
  .tabs(style="text-align: center")
    .ds-button-group
      .ds-button(:class="{ selected: type === 1 }" @click="type = 1") 自动投注
      .ds-button(:class="{ selected: type === 2 }" @click="type = 2") 方案设定
      .ds-button(:class="{ selected: type === 3 }" @click="type = 3") 倍投计算器

  .scroll-content(style="top: 1rem; padding: .15rem")
    .part1(v-show="type === 1")
      div(style="width: 7rem")
        .ds-checkbox-label(style="" v-bind:class="{active: rdw}" @click=" rdw = !rdw ")
          .ds-checkbox
          | 真实投注赢 &nbsp;&nbsp;
          el-input-number(v-model="realDepositWin" style="width: .85rem" @click.native.stop="")

        .ds-checkbox-label(style="" v-bind:class="{active: rdl}" @click=" rdl = !rdl ")
          .ds-checkbox
          | 真实投注输 &nbsp;&nbsp;
          el-input-number(v-model="realDepositLose" style="width: .85rem"  @click.native.stop="")

        .ds-checkbox-label(style="" v-bind:class="{active: failStop}" @click=" failStop = !failStop ")
          .ds-checkbox
          | 失败停投 

        .ds-checkbox-label(style="" v-bind:class="{active: breakStop}" @click=" breakStop = !breakStop ")
          .ds-checkbox
          | 断期停投

        .ds-checkbox-label(style="" v-bind:class="{active: autoStart}" @click=" autoStart = !autoStart ")
          .ds-checkbox
          | 自动开始 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          el-input-number(v-model="as" style="width: .85rem" @click.native.stop="")

        .ds-checkbox-label(style="" v-bind:class="{active: autoStop}" @click=" autoStop = !autoStop ")
          .ds-checkbox
          | 自动停止 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          el-input-number(v-model="ass" style="width: .85rem" @click.native.stop="")
        
        div(style="display: inline-block")
          | 延迟投注&nbsp;&nbsp;
          el-input-number(v-model="depositDelay" style="width: .85rem")
          | &nbsp;&nbsp;秒后
      .ds-button.tall(:class="{ primary: progress, 'blue outline': !progress }") 开启自动投注

      p.text-999.text-center *注意!挂机软件没有撤单功能,分分彩延迟投注时间不能超过12秒
      
      .result 真实盈亏:0  真实下注:0  准确率:0%  投注状态:投注失败,当前没有可投注的方案!
        
        .ds-button.cancel(style="float: right") 清空投注记录

        el-table.header-bold.nopadding(:data="Cdata"  style="margin-top: .2rem")

          el-table-column(prop="projectId" label="投注时间" width="80" )
          el-table-column(prop="projectId" label="投注彩种" width="80" )
          el-table-column(prop="projectId" label="期数" width="80" )
          el-table-column(prop="projectId" label="方案" width="80" )
          el-table-column(prop="projectId" label="玩法" width="80" )
          el-table-column(prop="projectId" label="注数" width="80" )
          el-table-column(prop="projectId" label="倍数" width="80" )
          el-table-column(prop="projectId" label="轮次" width="80" )
          el-table-column(prop="projectId" label="金额" width="80" )
          el-table-column(prop="projectId" label="盈亏" width="80" )
          el-table-column(prop="projectId" label="方案盈亏" width="80" )
          el-table-column(prop="projectId" label="内容" width="80" )
          el-table-column(prop="projectId" label="开奖号码" width="80" )
          el-table-column(prop="projectId" label="中挂" width="80" )
            

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

    .part2(v-show="type === 2")
      .result.scroll-content

        .ds-button.outline 添加
        .ds-button.outline 复制
        .ds-button.outline 删除
        .ds-button.outline 编辑

        el-table.header-bold.nopadding(:data="Cdata"  style="margin-top: .2rem")
          
          el-table-column(type="selection")
          el-table-column(prop="projectId" label="方案" width="120" )
          el-table-column(prop="projectId" label="类别" width="120" )
          el-table-column(prop="projectId" label="玩法" width="120" )
            

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

      .edit.scroll-content
        h3(style="border-bottom: 1px solid #bbb; padding-bottom: .1rem; margin") 编辑设置
        br
        label.item 名称 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          input.ds-input(v-model=" planName ")
     
        label.item 类别 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          el-select(clearable v-bind:disabled=" !planTypes[0] "  v-model="pt" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in planTypes" v-bind:label="S" v-bind:value="i")

        label.item &nbsp;&nbsp;&nbsp;玩法类型 
          el-select(clearable v-bind:disabled=" !mainMethods[0] "  v-model="mm" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in mainMethods" v-bind:label="S" v-bind:value="i")
        
        label.item 玩法名称 
          el-select(clearable v-bind:disabled=" !methodNames[0] "  v-model="mn" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in methodNames" v-bind:label="S" v-bind:value="i")

        label.item &nbsp;&nbsp;&nbsp;金额模式 
          el-select(clearable v-bind:disabled=" !units[0] "  v-model="unit" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in units" v-bind:label="S" v-bind:value="i")

        h3(style="border-bottom: 1px solid #bbb; padding-bottom: .1rem; margin") 

        .input-area(style="margin: .15rem 0")
          p 输入号码 {{ n }} 注
          br
          el-input(v-model="V" type="textarea" autofocus  v-bind:autosize="{ minRows: 10, maxRows: 15 }" placeholder="")
          br
          br
          br
          p 直线倍投
          br
          el-input(v-model="lineTimes" style="width: 100%")

    .part3(v-show="type === 3")
      div(style="width: 7rem")
        .ds-radio-label(style="" v-bind:class="{active: line === 0}" @click=" line = 0 ")
          .ds-radio.white
          | 固定利润 &nbsp;&nbsp;
          el-input-number(v-model="staticProfit" style="width: .85rem")

        .ds-checkbox-label
          | 单注成本 2&nbsp;&nbsp;
          el-select(clearable v-bind:disabled=" !units[0] "  v-model="singleUnit" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in units" v-bind:label="S" v-bind:value="i")

        .ds-checkbox-label
          | 计划周期 &nbsp;&nbsp;
          el-select(clearable v-bind:disabled=" !planCircles[0] "  v-model="pc" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in planCircles" v-bind:label="S" v-bind:value="i")

        br

        .ds-radio-label(style="" v-bind:class="{active: line === 1}" @click=" line = 1 ")
          .ds-radio.white
          | 收益利率 &nbsp;&nbsp;
          el-select(clearable v-bind:disabled=" !rates[0] "  v-model="rate" style="width: 1.2rem" placeholder="全")
            el-option(v-for="(S, i) in rates" v-bind:label="S" v-bind:value="i")

        .ds-checkbox-label
          | 平台奖金 &nbsp;&nbsp;
          el-input-number(v-model="prize" style="width: .85rem")
          

        .ds-checkbox-label
          | 号码注数 &nbsp;&nbsp;
          el-input-number(v-model="n" style="width: .85rem")

         br

        .ds-radio-label(style="" v-bind:class="{active: line === 2}" @click=" line = 2 ")
          .ds-radio.white
          | 自由倍数 &nbsp;&nbsp;
          el-input(v-model="lineTimes" style="width: 5rem")

        
      .ds-button.tall.outline(style="font-size: .3rem") 计算倍投

      p
        
        el-table.header-bold.nopadding(:data="Cdata"  style="margin-top: .2rem")

          el-table-column(prop="projectId" label="期号" width="120" )
          el-table-column(prop="projectId" label="倍数" width="120" )
          el-table-column(prop="projectId" label="当期投入" width="120" )
          el-table-column(prop="projectId" label="累计收入" width="120" )
          el-table-column(prop="projectId" label="收益" width="120" )
          el-table-column(prop="projectId" label="利润" width="120" )
          el-table-column(prop="projectId" label="收益率%" width="120" )
            

        el-pagination(:total="total" v-bind:page-size="pageSize" layout="prev, pager, next, total" v-bind:page-sizes="[5, 10, 15, 20]" v-bind:current-page="currentPage" small v-if=" total > 20 " v-on:current-change="pageChanged")

</template>

<script>
  // import api from 'src/http/api'
  import base from 'components/base'
  export default {
    mixins: [base],
    data () {
      return {
        hasHeader: true,
        hasFooter: true,
        type: 1,
        progress: true,
        // Cdata: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        ISFREE: ['现金', '优惠券'],

        // part1
        rdw: true,
        realDepositWin: 0,
        rdl: true,
        realDepositLose: 0,
        failStop: true,
        breakStop: true,
        as: true,
        autoStart: 0,
        ass: true,
        autoStop: 0,
        depositDelay: 0,
        Cdata: [],
        // part2
        planName: '',
        pt: '',
        planTypes: ['固定取码'],
        mm: '',
        mainMethods: ['五星', '四星'],
        mn: '',
        methodNames: ['直选复式'],
        unit: '',
        units: ['元', '角', '分', '厘'],
        V: '',
        lineTimes: '2, 4, 5, 6, 7',
        // part3
        line: 0,
        staticProfit: 0,
        singleUnit: '',
        pc: 1,
        planCircles: [1, 10, 100],
        rate: 10,
        rates: [10, 20],
        prize: 0,
        n: 100

      }
    },
    computed: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .home
    left GJLW
    background-color rgba(255, 255, 255, 1)
    padding PW
    *
      box-shadow none
    
    .part1
    .part3
      .ds-checkbox-label
        margin-bottom .15rem
      .ds-button.tall
        position absolute
        right PWX
        top PW
      
      .result
        background-color #f1f1f1
        padding PW
        radius()
        
    .part2
      .result
        width 4rem
        top PW
        left PW
        bottom PW
        background-color #f1f1f1
        padding PW
        radius()
        .ds-button
          margin-right PW  
      .edit
        top PW
        left 4.7rem
        right PW
        bottom PW
        background-color #ddd
        padding PW
        radius()
        .item
          display inline-block
          margin-bottom PW
</style>
