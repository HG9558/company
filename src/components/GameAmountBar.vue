<template lang="jade">
  el-row.amout-bar
    el-col.left(:span="8")
      .ds-button.primary.bold(@click="showFollow" v-if="!show && !followButton") 追号
      span.follow(v-if="show")
        | 追号总期数 
        span.NPER {{ NPER }} 
        |  期&nbsp;&nbsp;&nbsp;追号总金额 
        span.PAY {{ ( PAY || 0).toFixed(3) }}



    el-col.right(:span="16" style="line-height: .4rem; padding: .05rem 0 .1rem 0 ")
      | 总计 
      span.count {{ n }} 
      | 注&nbsp;&nbsp;&nbsp;总计&nbsp;&nbsp;
      span.pay {{ pay.toFixed(3) }}
      |  元&nbsp;&nbsp;
      // el-checkbox(v-model="checked" checked) 使用优惠券
      
      

      
      // .ds-checkbox-label(style="margin-right: 0" v-bind:class="{active: pot}" @click=" togglePot " v-if=" pot !== 0 ")
      //   .ds-checkbox
      //   | 奖池抽奖
      el-popover(placement="top" trigger="click" v-bind:popper-class="'popover-instruction font-white popover-pot'")
        span(slot="reference")
          // span.ds-icon-text-question(style="margin-right: .1rem; cursor: pointer" v-if=" pot !== 0 ")
        slot
          p(style="line-height: .25rem")
              span.label.text-blue.text-bold 奖池说明：
              | 每周一期，每一次抽奖机会金额为1元，抽奖编码为随注单生成的4位随机数，每周六晚8:30开奖，开奖结果以周六晚的体彩排列五开奖结果的后四位为准，四号全中且顺序一致为一等奖，
              | 四号全中顺序不一致为二等奖。
              | 中后3个号顺序不限，为特别奖，奖金888元，
              | 中后2个号顺序不限，为好运奖，奖金18元，
              | 中后一个号为贡献奖，奖金5元
          p(style="line-height: .25rem")
              span.label.text-blue.text-bold 奖金分配：
              | 一等奖中奖金额占奖池总金额的70%，二等奖占奖池总金额30%。
              | 同一个奖级如多人中奖，平均分配该奖级所有奖金，特别奖，好运奖，贡献奖，
              | 为单独所有不会与其他人共享，当期剩余的未派发的奖金自动滚入下一期。

      
      .ds-checkbox-label(v-bind:class="{active: checked}" @click="toggle" style="margin-right: 0")
        .ds-checkbox
        | 使用信游币&nbsp;&nbsp;

      //- label.text-666(style="display: inline-block" v-if="!show") &nbsp;&nbsp;起始期：
        el-select(v-model="nper" style="position: relative; top: -0.01rem; width: 2rem")
          el-option(v-for="(i, index) in issues.slice(0, length)" v-bind:label="i.issue + (i.issue === CNPER? '（当前期）' : '期') " v-bind:value="i.issue")
      br(v-if=" followButton ")
      .ds-button.success.bold(@click="showFollow" v-if=" followButton " style="margin-right: .05rem") 追号
      .ds-button.positive.bold.large(@click.self="book") 立即投注
        // span(v-if="!show")
        //   |  起始期：
        //   el-select(v-model="nper" style="position: relative; top: -0.01rem")
        //     el-option(v-for="(i, index) in issues.slice(0, length)" v-bind:label="i.issue + (i.issue === CNPER? '（当前期）' : '期') " v-bind:value="i.issue")




</template>

<script>
export default {
  props: {
    followButton: Boolean,
    show: Boolean,
    NPER: Number,
    PAY: Number,
    n: Number,
    pay: Number,
    // 优惠券
    checked: Boolean,
    pot: [Boolean, Number],
    issues: Array,
    CNPER: String
  },
  data () {
    return {
      nper: ''
    }
  },
  computed: {
  },
  mounted () {
    this.nper = (this.issues[0] || {}).issue
  },
  watch: {
    issues () {
      this.nper = (this.issues[0] || {}).issue
    }
  },
  methods: {
    showFollow () {
      this.$emit('showFollow')
    },
    toggle () {
      this.$emit('toggle-checked')
    },
    togglePot () {
      this.$emit('toggle-pot')
    },
    book () {
      this.$emit('book', this.pot, this.nper)
    }
  },
  components: {
  }
}
</script>
<style lang="stylus">
  @import '../var.stylus'
  .popover-pot
    radius()

</style>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .amout-bar
    margin: 0 auto;
    max-width: 9.3rem;
    left: 0;
    right: 0;
    z-index 1999
    position absolute
    bottom 0
    border-bottom-right-radius .05rem
    border-bottom-left-radius .05rem
  .el-row
    padding 0 PWX
    width 100%
    color #333
    background-color #fff
    .el-row
      width 100%
  .el-col
    min-height GAH
  
  .el-button
    vertical-align middle
  .right
    text-align right
    .el-button
      margin-left PW
  
  .count
  .pay
  .NPER
  .PAY
    color DANGER
    font-weight bold
  
  .danger
    margin-left PW
  .width0
    width 0
    height 0
    opacity 0
    padding-left 0
    padding-right 0
  
  .ds-button.success
    background #444
    &:hover
      background #333 !important
  
</style>
