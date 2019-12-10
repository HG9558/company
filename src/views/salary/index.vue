<template lang="jade">

.salary
  slot(name="toolbar")
  MySalary.scroll-content(v-if=" I === 0 ")
  SubSalary.scroll-content(v-if=" I === 1 ")
  DailyWageSet.scroll-content(v-if=" I === 2 ")
</template>

<script>
import MySalary from './MySalary'
import SubSalary from './SubSalary'
import DailyWageSet from './DailyWageSet'
export default {
  components: {
    MySalary,
    SubSalary,
    DailyWageSet
  },
  name: 'salary',
  props: [],
  data () {
    return {
      I: 0
    }
  },
  methods: {
    __setSalaryI (i) {
      this.I = i
    }
  }
}
</script>

<style lang="stylus">
// 建议不添加scoped， 所有样式最多嵌套2层
</style>
