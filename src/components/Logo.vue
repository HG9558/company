<template lang="jade">
  dl.logo
    dd.icon-list.ds-icon-logo         
</template>

<style lang="stylus">
  @import '../var.stylus'
  @import '../path.stylus'
  .logo
    text-align center
    .icon-list
      display inline-block
      width LGW + .5rem
      height LGH
  .ds-icon-logo
    // background url($CASSETS/logo.png) center center no-repea0t
    background url($CASSETS/cb_logo.png) center center no-repeat

  #app.cb.v2
    .ds-icon-logo
    // background url($CASSETS/logo.png) center center no-repea0t
      background url($CASSETS/v2/logo.png) center center no-repeat
</style>
