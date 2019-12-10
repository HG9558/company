<template lang="jade">
  .game-header.relative
    .wrap
      .game-logo
      .volume.ds-icon-volume.pointer(:class="{ on: !volume }" @click=" setVolume() ")
      .game-countdow.inlb.text-666
        .vm.inlb.t_r.ft12
          span.title {{ CNPER }}
          span &nbsp;&nbsp;期
          p 截止时间
        .vm.inlb.time-box.text-black.ft36
          span {{ showTime.split(':')[0] }}
          span.text-999.time-dot :
          span {{ showTime.split(':')[1] }}
          span.text-999.time-dot :
          span {{ showTime.split(':')[2] }}

      .game-win.inlb.text-666
        .vm.inlb.t_r.ft12
          span.title {{ NPER }}
          span &nbsp;&nbsp;期
          //- p.text-danger.pointer(@click="__setCall({fn: '__recentlyCode'})" v-if="overtime") 开奖超时，请刷新
          el-popover(ref="popover4" placement="bottom"  trigger="hover" v-bind:popper-class=" 'wb-intro' + ' g_' + gameid " v-bind:visible-arrow=" va ") 
            p.text-blue(slot="reference" v-if=" gameid === 150 || gameid === 151 ||gameid === 162 || gameid === 161 || gameid === 29 " style="cursor: pointer;") 开奖号码说明
            slot
              div(style="width: 8.5rem" v-if=" gameid === 150 ")
                div
                  p 微博5分彩，开奖数据源于每5分钟微博热搜榜前20名关键词的搜索次数。
                  br
                  p 取排名第1、第6、第11、第16名的各个关键词的搜索次数的尾数相加，再取这个数的尾数 作为【万位】的开奖号码；
                  p 取排名第2、第7、第12、第17名的各个关键词的搜索次数的尾数相加，再取这个数的尾数 作为【千位】的开奖号码；
                  p 取排名第3、第8、第13、第18名的各个关键词的搜索次数的尾数相加，再取这个数的尾数 作为【百位】的开奖号码；
                  p 取排名第4、第9、第14、第19名的各个关键词的搜索次数的尾数相加，再取这个数的尾数 作为【十位】的开奖号码；
                  p 取排名第5、第10、第15、第20名的各个关键词的搜索次数的尾数相加，再取这个数的尾数 作为【个位】的开奖号码。
                  br
                  p 以开奖号码的【万位】为例：
                  p 00:05分第1名关键词的搜索次数为 80000 次（尾数为0），
                  p 00:05分第6名关键词的搜索次数为 56789 次（尾数为9）， 
                  p 00:05分第11名关键词的搜索次数为 36748次（尾数为8），
                  p 00:05分第16名关键词的搜索次数为 17890 次（尾数为0），
                  p 则：0+9+8+0=17，17的尾数为7 ，所以01期开奖号码的【万位】就是7。
                  br
                  p 微博热搜的排名数据可参见微博官网：<a class="default" target="_blank" href="https://s.weibo.com/top/summary?cate=realtimehot">https://s.weibo.com/top/summary?cate=realtimehot</a>  或 齐聚数据网：<a class="default" target="_blank" href="https://www.qiju.info/#/qijuData/1">https://www.qiju.info/#/qijuData/1</a>
              
              div(style="width: 8.5rem" v-if=" gameid === 151 ")
                div
                  p 腾讯赛车，每期开奖号码以【腾讯在线人数】、【统计时间】与【在线人数数字之和】为基础，使用哈希算法（SHA512）得到对应的哈希值，再以哈希值中每个数字（0到9） 第一次出现的先后顺序作为赛车比赛的结果，数字【0】代表【10号赛车】。
                  br
                  p 例如：统计时间为： 2019-03-06 21:58:00，当时的腾讯在线人数为：322446581，在线人数数字之和为：3+2+2+4+4+6+5+8+1=35。
                  p 用【腾讯在线人数】+【统计时间】+【在线人数数字之和】，即： 3224465812019-03-06 21:58:0035 来执行SHA512哈希算法，并得到哈希值：
                  p(style="word-break: break-all") <span class="text-danger">6354</span>6e<span class="text-danger">9</span>46<span class="text-danger">1</span>136bb5e1<span class="text-danger">0</span>e3cf1bc<span class="text-danger">8</span>1a03<span class="text-danger">2</span>4cbe36e231360<span class="text-danger">7</span>bcf2b1cb5da1f121e3f4e4a7c7b699251922483c5f63d5fed714f4a2387ad6282eced6386e9c3551c6
                  p 在这个哈希值中，数字6最先出现，数字3次之，再是数字5，之后分别是数字4、数字9、数字1、数字0、数字8、数字2、数字7。
                  p 因此当期的赛车结果为：6,3,5,4,9,1,10,8,2,7。
                  br
                  p 腾讯赛车的在线人数与统计时间及对应的赛车结果，请参见齐聚数据网：<a class="default" target="_blank" href="https://www.qiju.info/#/qijuData/3">https://www.qiju.info/#/qijuData/3</a>
              div(style="width: 8.5rem" v-if=" gameid === 161 ")
                div(v-html="game161info")
              div(style="width: 8.5rem" v-if=" gameid === 162 ")
                div(v-html="game162info" style="word-wrap: break-word;word-break: normal;")
              div(style="width: 6rem" v-if=" gameid === 29 ")
                div
                  p 腾讯分分彩，开奖数据源于每分钟腾讯QQ的在线用户人数数字生成一个五位数字。
                  br
                  p 计算公式如下：
                  p 【万位】：依照官方公布当时的在线人数数字之总和，再取尾数；
                  p 例如：线上人数227415242人，则为2+2+7+4+1+5+2+4+2=29，取尾数9，因此万位数为9）
                  p 【后四位】：依照官方公布当时的在线人数，取末四位为千百十个这四个号码；
                  p 例如：线上人数227415242人，则末4码为5242
                  br
                  p 腾讯QQ的线用户人数数据可参见齐聚数据网：
                  p 
                    <a class="default" target="_blank" href="https://www.qiju.info/#/qijuData/2">https://www.qiju.info/#/qijuData/2</a>

        .vm.inlb
          span.WaitingDraw.text-oblue(v-if="!lucknumbers.join('').length") 等待开奖
          RollingNumbers(v-if="lucknumbers.join('').length" v-bind:numbers=" $props.lucknumbers " v-bind:game-type="gameType" v-bind:hl=" ccs ? ccs.pos : '' ")
          p.pl20.ft12(v-if=" fromold && preissue ")
            | 取自 
            span.text-blue {{ gameid === 155 ? '重庆欢乐生肖' : gameid === 156 ? '新疆时时彩' : gameid === 157 ? '重庆欢乐生肖' : '' }} 
            | 第
            span {{ preissue }}
            | 期开奖 

        el-popover(ref="popover5" placement="bottom"  trigger="hover" v-bind:popper-class=" 'hot-rank' " v-bind:visible-arrow=" va ") 
          span(slot="reference" v-if=" gameid === 150 " @mouseover=" getWeiBoHot ") 热搜排名 >
          slot
            div(style="width: 5rem")
              .text-blue.t_c.text-bold.bg.hlh45(v-if=" lstt " style="background: #fff") 统计时间：{{ lstt }}
              dl
                dt.text-black.text-bold
                  .th.inlb 排名
                  .th.inlb 搜索关键词
                  .th.inlb.t_r 搜索次数
                dd.text-center.text-999(v-if=" !ranks[0] ") 暂无数据...
                dd(v-for=" r in ranks ")
                  .th.inlb {{ r.rank }}
                  .th.inlb {{ r.title }}
                  .th.inlb.t_r {{ r.num }}
        
        .WinningReminder.absolute(@click="ClickWinningReminder")
          .ds-checkbox(:class=" {'active': WinningReminder} ") 
          | 中奖提醒
      
        
</template>

<script>
import util from '../util'
import RollingNumbers from './RollingNumbers'
import api from 'src/http/api'
export default {
  props: {
    NPER: String, //下一期
    CNPER: String, //当前期号
    timeout: Number,
    gameType: String,
    allLuckyNumbers: Array,
    lucknumbers: Array, // 开奖号码
    methodid: String,
    overtime: Boolean,
    gameid: Number
  },
  components: {
    RollingNumbers
  },
  data () {
    return {
      WinningReminder: window.localStorage.getItem('WinningReminder') ? window.localStorage.getItem('WinningReminder') * 1 : 1, // 中将提醒默认提醒
      va: false,
      time: 0,
      interval: 0,
      t: 0,
      volume: false,
      ranks: [],
      preissue: '',
      lstt: '',
      //阿里云分分彩 开奖号码说明
      game161info: `《阿里云分分彩》每期开奖号码根据阿里云官网主页（<a class="default" target="_blank" href="https:/cn.aliyun.com/">https:/cn.aliyun.com/</a>）“防御攻击次数”计算而成。<br/>
阿里云分分彩规则介绍：<br/>
1、以每分钟阿里云的防御攻击次数数字生成一个五位数字作为阿里云分分彩当期的开奖号码；<br/>
2、开奖号码的第一位（即万位）数字为阿里云官网当前防御攻击次数总和的尾数；<br/>
&nbsp;（如：当期采集数据为14,530,580,511，即开奖号码万位为1+4+5+3+0+5+8+0+5+1+1=33 取尾数3）<br/>
3、开奖号码的后四位（即千百十位）数字对应防御攻击次数的后四位数字 ；<br/>
&nbsp;（如：当期采集数据为14,530,580,511，即后四位开奖号码为,0511，结合第二点，完整开奖号即为3 0511）<br/>
&nbsp;4、阿里云分分彩种每分钟一期，全天24小时不间断开放。<br/>
&nbsp;5、阿里云分分彩开奖结果数据源来源请参考：<a class="default" target="_blank" href="https://www.qiju.info/#/qijuData/5">https://www.qiju.info/#/qijuData/5</a><br/>
<br/>
此彩种注数限制75%，单期限额30万，单挑限额2万。<br/>
如当期开奖号码官网未开奖且三分钟内未进行补开，或开奖号码与上期相同，则进行撤单处理。`,
      //阿里云赛车 开奖号码说明
      game162info: `阿里云赛车（PK10）开奖号码是使用当期「阿里云实时防御攻击次数」加上「统计时间」以及【防御次数数字之和】， 使用SHA512哈希算法执行哈希取得哈希值后，依据最先出现的数字做为赛车结果，0代表10号车。<br/>
<br/>
<br/>
以统计时间2019-06-21 14:47:00为范例，当期的阿里云实时防御攻击次数为4193188428， 系统会利用阿里云实时防御攻击次数+统计时间+防御攻击次数数字总和=> 41931884282019-06-21 14:47:0048执行SHA512哈希算法取得赛车结果。<br/>
<br/>
bbb423f614b61460fc24de045fac2b02085d2b30f316b22c774794cf642d6b88a8e23ed602021b78b55de027ddca3108c72215ded704ba005dbf92eb83f7d96b
<br/>
在这个哈希值中，数字4最先出现，数字2次之，再是数字3，之后分别是数字6、数字1、数字10、数字5、数字8、数字7、数字9。
<br/>
因此当期的赛车结果为：4,2,3,6,1,10,5,8,7,9。
<br/>
<br/>
阿里云赛车的在线人数与统计时间及对应的赛车结果，请参见齐聚数据网：<a class="default" target="_blank" href="https://www.qiju.info/#/qijuData/6">https://www.qiju.info/#/qijuData/6</a>`
    }
  },
  computed: {
    // numbers () {
    //   return (this.allLuckyNumbers[0] || {lucknumbers: this.lucknumbers}).lucknumbers
    // },
    showTime () {
      return util.timeFormat(this.time)
    },
    codeStyle () {
      return this.allLuckyNumbers[0] && this.allLuckyNumbers[0].codeStyle ? this.allLuckyNumbers[0].codeStyle : this.allLuckyNumbers[1] ? this.allLuckyNumbers[1].codeStyle : ''
    },
    cs () {
      return this.codeStyle ? JSON.parse(this.codeStyle) : []
    },
    ccs () {
      return this.cs.filter(x => (x.methodId || []).indexOf(this.methodid) !== -1)[0]
    },
    fromold () {
      return this.gameid === 155 || this.gameid === 156 || this.gameid === 157
    }
  },
  mounted () {
    this.time = this.timeout
    this.interval = setInterval(() => {
      if (this.time > 0) {
        this.time--
      }
    }, 1000)
    this.volume = !!parseInt(window.localStorage.getItem('volume')) || false
    // setTimeout(this.getHisIssue, 1000)
  },
  watch: {
    NPER () {
      if (this.fromold) {
        this.getHisIssue()
      }
    },
    overtime () {
      if (!this.overtime) this.openpk10Game()
    },
    t () {
      if (this.t !== 0) {
        setTimeout(() => {
          this.t = 0
        }, this.t)
      }
    },
    timeout () {
      this.time = Math.floor(this.timeout)
    },
    time () {
      if (this.time <= 0) {
        this.$emit('set-timeout', 0)
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    // 点击中奖提醒
    ClickWinningReminder () {
      this.WinningReminder = !this.WinningReminder;
      window.localStorage.setItem('WinningReminder', this.WinningReminder ? 1 : 0);
    },
    getHisIssue () {
      this.preissue = ''
      if (!this.fromold) return
      this.$http.get(api.getHisIssue, {gameid: this.gameid, issue: this.NPER}).then(({data: {issue, success}}) => {
        if (success) this.preissue = issue
      })
    },
    __startpk10Game () {
      let e = document.querySelector('#pk10df')
      if (!e) return
      let w = e.contentWindow
      w.createGame(this.CNPER, this.time, (e) => {
        switch (e.action) {
          case 'finish_game':
            this.__startpk10Game()
            break
        }
      })
    },
    openpk10Game () {
      let e = document.querySelector('#pk10df')
      if (!e) return
      let w = e.contentWindow
      // if (this.allLuckyNumbers[0] && this.allLuckyNumbers[0].code)
      w.endGame(this.lucknumbers.map(e => {
        return parseInt(e)
      }))
    },
    setVolume () {
      this.volume = !this.volume
      window.localStorage.setItem('volume', this.volume ? 1 : 0)
    },
    getWeiBoHot () {
      this.$http.get(api.getWeiBoHot + this.NPER).then(({data: {items}}) => {
        this.ranks = items.reverse()
        if (items[0]) {
          this.lstt = items[0].tm
        }
      })
    }
  }
}
</script>

<style lang="stylus">
  @import '../var.stylus'
  .game-header
    for n, i in chq xj tj hlj hlffc cb120 ffctx ffc_aly '11ydj' jx115 gd hb115 js115 sh115 ah115 kt115 kt115 ahK3 jsK3 jlK3 bjK3 xfK3 bjpk10 pk10sc pk10ft kl8 fc hl3d shssl pl35 lhc lhc pcdd wbwfc hnwfc hnyfc txsc alysc tx2fcjs tx2fcos cqhjssc hlsx_cq xjhjssc cqhjffc fj115 fjK3 sx115 qqtxffc ln115 qqtxwfc qqtxsfc 
      &.game-header-ds-icon-game-{n}
        .wrap
          background-image url('../assets/gameheader/ng/' + n '.png')
      &.game-header-ds-icon-game-wbwfc .wrap
          background-size 1.85rem
          

    .wrap
      height .8rem
      background-color #fff
      background-repeat no-repeat
      background-position left .2rem center      
      background-size 2.3rem
      padding-left 2.5rem
    
    .volume
      position absolute
      left 2.3rem
      top .05rem
      width .2rem
      height .2rem
      padding .05rem
      background url(../assets/gameheader/off.png) center no-repeat
      &.on
          background url(../assets/gameheader/on.png) center no-repeat
      
      &:hover
        border: solid 1px #d8dee8;
        background-color #fefefe
        box-shadow: 0px 3px 3px 0px #e3e3e3;

    .vm
      vertical-align middle
    
    .game-countdow
      padding .12rem .25rem
      height .56rem
      
    .time-box
      height 100%
      line-height .56rem
      margin-left .1rem
      // font-family Arial-BoldMT
      border-radius 5px
      box-shadow 0 0 10px rgba(0,0,0, .4) inset
      padding 0 .2rem
      font-weight bold
      letter-spacing: 0px;
    .time-dot
      padding 0 .04rem
      
    .game-win
      // padding .12rem 0
      
  .wb-intro.el-popover
    margin-top 25px
    background-color #fffde8   
    &.g_29
      transform translateX(17%)
    
  .hot-rank.el-popover
    margin-top 35px
    transform translateX(-1.86rem)
    background-color #fffde8
    padding 0 0 10px 0
    dd
    dt
      height .36rem
      line-height .36rem
      
    dd:nth-child(even)
      background-color #f7f1da
    .th
      &:nth-child(1)
        width 20%
        text-align center
      &:nth-child(2)
        width 50%
        padding-left 5%
      &:nth-child(3)
        box-sizing border-box
        width 25%
        padding-right .5rem

</style>
<style lang="stylus">
.game-header.relative
  // 等待开奖
  .WaitingDraw
    font-size 0.3rem
    margin-left 1em
    letter-spacing 0.5em
  // 开奖提醒
  .WinningReminder
    top 0
    right 0
    margin-top 0.3em
    margin-right 0.3em
</style>
