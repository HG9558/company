<template lang="jade">

.open-account
  slot(name="cover")
  slot(name="movebar")
  slot(name="resize-x")
  slot(name="resize-y")
  slot(name="toolbar")
  AddUser.scroll-content(v-if=" I === 0 ")
  //- AD.scroll-content(v-if=" I === 1 ")
  linkAdmin.scroll-content(v-if=" I === 1 ")

</template>

<script>
import AddUser from './AddUser'
// import AD from './AD'
export default {
  components: {
    // AD,
    linkAdmin: resolve => require(['./linkAdmin.vue'], resolve),
    AddUser
  },
  name: 'open-account',
  props: [],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setOpenAccountI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
