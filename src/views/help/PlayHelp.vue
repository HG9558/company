<template lang="jade">
  .help-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .scroll-content.play-help

      img(src="/static/pic/bz_bg.jpg" style="width: 100%")
      .ds-button-group
        .ds-button.text-button(:class="{ selected: index === i }" @click=" index = i " v-for=" (g, i) in games ") {{ g.tagname }}
      //- 彩种玩法说明
      .content(v-if=" gcontent && gid!=9999")
        p.title &nbsp;&nbsp;&nbsp;&nbsp;{{ gcontent.content }}

        el-row.row-title.text-black
          el-col(:span="4" style="padding-left: .2rem;" ) 玩法组
          el-col(:span="4") 玩法
          el-col(:span="16") 玩法说明

        el-row.row-content(v-for="g in items")
          el-col.text-blue(:span="4" style="padding-left: .2rem;" v-bind:class="{ o: !g.ptitle }")  {{ g.ptitle || 'xxx ' }}
          el-col(:span="4"  style="padding-right: .2rem") {{ g.title }}
          el-col(:span="16" style="padding-right: .2rem") {{ g.content }}
      //- 彩种开奖时间
      .content(v-if=" gid==9999 ")
        p.title &nbsp;&nbsp;&nbsp;&nbsp;彩种开奖时间

        el-row.row-title.text-black
          el-col(:span="4" style="padding-left: .2rem;" ) 彩种
          el-col(:span="4") 销售周期
          el-col(:span="4") 第一期截止时间
          el-col(:span="4") 最后一期截止时间
          el-col(:span="4") 期数间隔
          el-col(:span="4") 总期数

        el-row.row-content(v-for="g in PlayHelp_LotteryTime")
          el-col.text-blue(:span="4" style="padding-left: .2rem;" v-bind:class="{ o: !g.lottery }")  {{ g.lottery || 'xxx ' }}
          el-col(:span="4"  style="padding-right: .2rem") {{ g.SalesTime }}
          el-col(:span="4" style="padding-right: .2rem") {{ g.FirstDeadline }}
          el-col(:span="4" style="padding-right: .2rem") {{ g.FinalDeadline }}
          el-col(:span="4" style="padding-right: .2rem") {{ g.IntervalInterval }}
          el-col(:span="4" style="padding-right: .2rem") {{ g.TotalNumberPeriods }}
        

    
</template>

<script>
import api from "../../http/api";
import PlayHelp_LotteryTime from "./PlayHelp_LotteryTime.js";
export default {
  data() {
    return {
      PlayHelp_LotteryTime: PlayHelp_LotteryTime,
      games: [{}],
      index: 0,
      content: []
    };
  },
  computed: {
    gid() {
      return this.games[this.index].id;
    },
    gcontent() {
      return (
        this.content.filter(c => c.key === this.gid)[0] || { value: [{}] }
      ).value[0];
    },
    groups() {
      return (this.gcontent.subList || []).filter(g => g.level === 2);
    },
    items() {
      return this.groups.reduce((p, na) => {
        na && na.subList && na.subList[0] && (na.subList[0].ptitle = na.title);
        p = p.concat(na.subList || []);
        return p;
      }, []);
    }
  },
  mounted() {
    this.getHelpTag();
  },
  methods: {
    getHelpInfo() {
      this.$http.myget(api.getHelpInfo, { subject: "game" }).then(
        ({ data }) => {
          if (data.success === 1) {
            // this.games = data.items.filter(g => g.level === 0)
            this.content = data.content;
          } else {
            this.$message.warning({
              target: this.$el,
              message: "玩法帮助信息获取失败！"
            });
          }
        },
        rep => {
          this.$message.warning({
            target: this.$el,
            message: "玩法帮助信息获取失败！"
          });
        }
      );
    },
    getHelpTag() {
      this.$http.myget(api.getHelpTag, { subject: "game" }).then(
        ({ data }) => {
          if (data.success === 1) {
            this.games = data.tagList.concat({
              id: 9999,
              tagname: "彩种开奖时间"
            });
            this.getHelpInfo();
          } else {
            this.$message.warning({
              target: this.$el,
              message: "玩法帮助信息获取失败！"
            });
          }
        },
        rep => {
          this.$message.warning({
            target: this.$el,
            message: "玩法帮助信息获取失败！"
          });
        }
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../var.stylus';

.play-help {
  top: TH;
  text-align: center;
  padding: PWX;

  .ds-button-group {
    position: absolute;
    top: 1.2rem;
    right: 1rem;
    color: #fff;
    font-size: 0.36rem;
    line-height: 0.2rem;

    @media screen and (max-width: 1600px) {
      top: 0.5rem;
      font-size: 0.24rem;
    }

    text-align: left;
    // height auto
  }

  .content {
    // margin 0 PWX PWX PWX
    text-align: left;
    font-size: 0.12rem;

    .title {
      margin: PWX 0;
      color: #999;
    }

    .text-blue.o {
      opacity: 0;
    }

    .row-title {
      font-weight: bold;
      bg-gradient(180deg, #ddd, #eee);
      line-height: 0.4rem;
    }

    .row-content {
      // border-bottom 1px solid #d4d4d4
      // &:last-child
      // border-bottom none
      line-height: 1.2;
      padding: PW 0;

      &:nth-child(odd) {
        background-color: #fff;
      }

      &:nth-child(even) {
        background-color: rgba(255, 255, 255, 0.5);
      }
    }
  }
}
</style>

<style lang="stylus">
#app.night {
  .play-help {
    .content {
      color: #aaa;

      .row-title {
        background: #444;
      }

      .row-content {
        &:nth-child(odd) {
          background-color: #555;
        }

        &:nth-child(even) {
          background-color: #444;
        }
      }
    }
  }
}
</style>