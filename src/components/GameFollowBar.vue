<template lang="jade">
  el-row.follow-bar
    el-col(:span="4")
      .ds-button.primary.bold(@click="closeFollow") 追号

    el-col.right(:span="20")
      // el-checkbox(v-model="checked" checked) 中奖后停止追号
      .ds-checkbox-label(v-bind:class="{active: checked}" @click="checked = !checked")
        .ds-checkbox
        | 中奖后停止追号
      | 起始期：
      el-select(v-model="nper")
        // el-option(v-for="(i, index) in issues.slice(0, length)" v-bind:label="i.issue + (i.issue === CNPER? '（当前期）' : '期') " v-bind:value="i.issue")
        el-option(v-for="(i, index) in issues" v-bind:label="i.issue + (i.issue === CNPER? '（当前期）' : '期') " v-bind:value="i.issue")
</template>

<script>
  // import util from '../util'
  export default {
    // props: ['CNPER'],
    props: ['issues', 'CNPER', 'stop'],
    data () {
      return {
        // 产生10期
        length: 100,
        checked: true,
        nper: ''
      }
    },
    computed: {
      // NPERS () {
      //   return util.repeat(this.CNPER + ' ', this.length).split(' ').map((nper, index) => {
      //     return (nper = this.CNPER + index)
      //   })
      // }
    },
    watch: {
      checked (stop) {
        this.$emit('set-follow', {stop})
      },
      nper (CNPER) {
        this.$emit('set-follow', {CNPER})
      },
      issues () {
        this.nper = (this.issues[0] || {}).issue
      }
      // CNPER () {
      //   if ((this.nper || 0) < this.CNPER) this.nper = this.CNPER
      // }
    },
    mounted () {
      // this.nper = this.NPERS[0]
      this.nper = (this.issues[0] || {}).issue
      this.checked = this.stop
    },
    methods: {
      closeFollow () {
        this.$emit('close-follow')
      }
    }
  }
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  .follow-bar
    padding 0 PW
    width 100%
    color #666
    background-color #fff
    .el-col
      min-height GFH
    .right
      text-align right
  .el-button
  .el-select
    vertical-align middle
  .el-select
    display inline-block
    width 2rem
    
  .primary
    background #444 !important
    &:hover
      background #333 !important
</style>
