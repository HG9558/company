<template lang="jade">
  el-carousel(:interval="4000" height="3rem" style="width: 5rem")
    el-carousel-item(v-for="item in sources" v-bind:key="item")
      img(:src=" item.src " style="width: 100%; height: 2.5rem;")
</template>

<script>
export default {
  name: 'SlidePics',
  data () {
    return {
      sources: [
        {href: '/activity/5-2-1', src: '/static/activity/nds/activity1.jpg', title: '注册就送', describe: '全新的游戏体验，来玩就送'},
        {href: '/activity/5-2-2', src: '/static/activity/nds/activity2.jpg', title: '新用户有礼了', describe: '绑定手机、银行卡、邮箱，即可领取58元优惠券'},
        {href: '/activity/5-2-3', src: '/static/activity/nds/activity3.jpg', title: '每日签到', describe: '每日来我签到，好礼不断'}
      ]
    }
  }
}
</script>



