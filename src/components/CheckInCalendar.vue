<template lang="jade">
  .checkin-calendar-view
    .calendar-header.flex.flex-ai-c.ft14
      .week(v-for="w in weeks") {{w}}
    .calendar-days.flex.ft18
      .day-item.flex.flex-ai-c.flex-jt-c(v-for="d in firstDay")
        .day
      .day-item.flex.flex-ai-c.flex-jt-c(v-for="d in daysOfMonth" @click="checkInHandler(d)" v-bind:class="[getCls(d)]")
        .day
          span {{getCls(d) === 'checkin' ? '签' : d}}
</template>

<script>
export default {
  name: 'checkin-calendar-view',
  data () {
    return {
      weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
      daysOfMonth: 0,
      firstDay: 0,
      curDay: 0,
      date: null
    }
  },
  props: {
    checkinDateList: Array
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.date = new Date()
      this.curDay = this.date.getDate()
      this.firstDay = this.getFirstDayOfMonth(this.date)
      this.daysOfMonth = this.getDaysOfMonth(this.date.getFullYear(), this.date.getMonth())
    },
    checkInHandler(date) {
      if (date !== this.date.getDate()) return
      this.$emit('on-choice', date)
    },
    getFirstDayOfMonth(date) {
      const temp = new Date(date.getTime())
      temp.setDate(1)
      return temp.getDay()
    },
    getDaysOfMonth(year, month) {
      if (month === 3 || month === 5 || month === 8 || month === 10) {
        return 30
      }
      if (month === 1) {
        return (year % 4 === 0 && year % 100 !== 0 || year % 400 === 0) ? 29 : 28
      }
      return 31
    },
    getCls(d) {
      if (d < this.curDay) {
        return this.checkinDateList.includes(d) ? 'checkined' : 'uncheckin'
      } else if (d === this.curDay) {
        return this.checkinDateList.includes(d) ? 'checkined' : 'checkin'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="stylus">
 .checkin-calendar-view
  width 100%
  $img-base-dir = "../assets/activity/checkin/"
  bgImage($name)
    background url($img-base-dir+$name+".png") center no-repeat
    background-size 100%
    color #fff
  .calendar-header
    height 0.60rem
    color #202020
    .week
      width .62rem
      text-align center
      font-weight bold
  .calendar-days
    flex-wrap wrap
    .day-item
      width .62rem
      margin 0.06rem 0 0.06rem 0
      cursor pointer
      iconDay() {
        width 0.3rem
        display inline-block
        box-sizing border-box
        margin-right 0.08rem
      }
      &.checkin .day
        bgImage("icon-circle-yellow")
      &.checkined .day
        bgImage("icon-circle-red")
        &>span 
          iconDay()
      &.uncheckin .day
        bgImage("icon-circle-black")
        &>span 
          iconDay()
    .day 
      width 0.4rem
      height 0.4rem
      line-height 0.4rem
      text-align center
      color #9b9b9b
      background url("../assets/activity/checkin/icon-circle-gray.png") center no-repeat
</style>
