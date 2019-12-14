<template lang="jade">
  .sticky-checkin-view(@click="checkInHandler")
</template>

<script>
export default {
  name: 'sticky-checkin',
  methods: {
    checkInHandler() {
      this.$emit("on-open-checkin")
    }
  }
}
</script>

<style lang="stylus">
 .sticky-checkin-view
  position fixed
  right 0.80rem
  bottom 0.60rem
  width 1.10rem
  height 1.15rem
  background url("../assets/activity/checkin/daily-check-in.png") center no-repeat
  cursor pointer
</style>
