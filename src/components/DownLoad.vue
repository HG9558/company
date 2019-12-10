<template lang="jade">
  dl.download
    a.ds-button.text-button.light.icon-list.ds-icon-windows(target="_blank" v-bind:href="dls[0]") Windows        
    a.ds-button.text-button.light.icon-list.ds-icon-apple(target="_blank" v-bind:href="dls[1]") iPhone        
    a.ds-button.text-button.light.icon-list.ds-icon-android(target="_blank" v-bind:href="dls[2]") Android        
</template>

<script>
export default {
  data () {
    return {
      // dls: window.platform === 'ds' ? ['http://www.ds998.net/home/login/download.html', 'http://fir.im/5ent', 'https://fir.im/3005'] : ['http://www.changbo.net/#/download', 'https://fir.im/t6rk', 'https://fir.im/2819']
      dls: ['https://www.ds998.net/pages/download.html', 'https://app.ds998.net/', 'https://app.ds998.net/']
    }
  },
  computed: {

  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  @import '../path.stylus'
  .download
    text-align center
    .icon-list
      display inline-block
      width DLH
      height DLH
      padding 0
      line-height 1.5rem
      color rgba(255, 255, 255, .5)
      font-size .12rem
      cursor pointer
  .ds-icon-windows
    background url($CASSETS/windows.png) center 30% no-repeat
  .ds-icon-apple
    background url($CASSETS/apple.png) center 30% no-repeat
  .ds-icon-android
    background url($CASSETS/android.png) center 30% no-repeat
</style>
