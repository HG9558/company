<template lang="jade">

.dices(v-bind:class=" 'has-' + value.length ")
  Dice(v-for="dice in value" v-bind:value="dice")
    
</template>

<script>
import Dice from './Dice'
export default {
  props: {
    value: Array
  },
  data () {
    return {
    }
  },
  computed: {
  },
  components: {
    Dice
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .dices
    &.has-3
      .dice:nth-child(1)
        margin 0 auto
        float none
      .dice:nth-child(2)
        clear both      
</style>
