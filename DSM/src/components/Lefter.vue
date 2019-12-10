<template lang="jade">
  .lefter.ds-gm-icon-logo(:class= "[ menus[0] && menus[0].url ]")
    Meinfo(:name="name" v-bind:money="money" v-bind:free="free" v-on:logout="logout" v-if="!hideme" v-bind:smoney="smoney")
    Menus.scroll-content(v-bind:menus="menus")
</template>

<script>
import Menus from 'mycomponents/Menus'
import Meinfo from 'mycomponents/Meinfo'
export default {
  props: ['menus', 'name', 'money', 'smoney', 'free', 'hideme'],
  data () {
    return {
    }
  },
  watch: {
    menus () {
      this.$el.style.transform = ''
    }
  },
  methods: {
    logout () {
      this.$emit('logout')
    }
  },
  components: {
    Menus,
    Meinfo
  }
}
</script>

<style lang="stylus" scoped>
  @import '../var.stylus'
  @import '../../../src/var.stylus'
  TH = 1rem
  .lefter
    right auto
    width LW
    z-index 1
    // background-color rgba(104,104,200, .15)
    background #302b2a
    .scroll-content
      top TH
      bottom BH
    
    
    
</style>
