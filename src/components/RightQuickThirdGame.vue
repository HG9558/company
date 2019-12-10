<template lang="jade">
  .right-quick-third-game
    ul
      li.game-item(v-for="(item, i) in navs" v-bind:class="[item.class, {checked: i === checkedIndex, retract: retract}]" @click="active(i, item)") 
</template>

<script>
import store from '../store'
export default {
  name: 'RightQuickThirdGame',
  data () {
    return {
      me: store.state.user,
      navs: [
        {name: '棋牌', title: '棋牌', class: 'item-chess', type: 'chess', login: true}
      ],
      checkedIndex: -1,
      retract: false
    }
  },
  watch: {
    '$root.miniIframeGameRetract' () {
      if (this.me.login) {
        this.retract = this.$root.miniIframeGameRetract
        this.retract && (this.checkedIndex = -1)
      }
    },
    'me.login' () {
      if (!this.me.login) {
        this.checkedIndex = -1
        setTimeout(() => {
          this.retract = false
        }, 100)
      }
    }
  },
  methods: {
    active (i, data) {
      if (data.login && !this.me.login) {
        this.__setCall({fn: '__popLogin', args: true})
        return
      }
      this.checkedIndex = i
      this.$emit('click', data.type, data)
    }
  }
}
</script>

<style lang="stylus">
.right-quick-third-game
  // position fixed
  // right 0.1rem
  // bottom 2rem
  // z-index 102
  ul, li
    list-style none
    margin 0
    padding 0
  .game-item
    width 0.7rem
    height 0.7rem
  .item-chess
    background url('../assets/outer/chess/icon_notactive.png') no-repeat center
    background-size 0.43rem 0.62rem
    &.checked
      background url('../assets/outer/chess/icon_activated.png') no-repeat center
    &.retract
      background url('../assets/outer/chess/icon_open.png') no-repeat center
</style>
