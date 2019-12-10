<template lang="jade">
  section.home
    Logo
    p.amount
      欢迎登入畅博娱乐主管系统
    // DownLoad
    // AllRights
     

</template>
<script>
import base from 'components/base'
import AllRights from 'components/AllRights'
import DownLoad from 'components/DownLoad'
import Logo from 'components/Logo'
export default {
  name: 'Login',
  mixins: [base],
  data () {
    return {
      hasHeader: true,
      hasFooter: true
    }
  },
  computed: {
  },
  mounted () {
  },
  beforeDestroy () {
  },
  methods: {
  },
  components: {
    Logo,
    DownLoad,
    AllRights
  }
}
</script>
<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../../../src/var.stylus'
  .home
    padding .5rem
  .amount
    text-align center
    font-size .5rem
    color #999
    line-height 3rem
    font-shadow()
    font-family 'FangSong'
</style>