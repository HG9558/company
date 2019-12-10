<template lang="jade">
  .group-page
    slot(name="cover")
    slot(name="movebar")
    slot(name="resize-x")
    slot(name="resize-y")
    slot(name="toolbar")
    .contract.scroll-content(:class="{ center: contracts.length === 0 }")

      div(v-if="contracts.length === 0" style="height: 100%;") 当前无可用契约
        div(style="width: 0; height: 100%; vertical-align: middle; display: inline-block")

      div.c(v-for=" (c, ci) in contracts "  v-bind:class=" ['ds-icon-stock-' + STATUS[c.stat].class ] ")
        p.title.text-black(v-if=" platform === 'ds' ")
          span.ds-button.text-button.blue(style="float: left" @click="  __setCall({fn: '__back', args: undefined}) ") {{ '<返回上一页' }}

        h2.text-black(style="margin: .3rem 0") {{ contracts.length > 1 ?  ci === 0 ? '新契约' : '现有契约' : '契约详情'  }}
        p.item 用户名：&nbsp;&nbsp;&nbsp;{{ c.userName }}
        p.item 契约状态：{{ STATUS[c.stat].title }}
        p.item 契约时间：{{ c.beginTm }} 至  {{ c.expireTm }}
        p.item 发放周期：按{{ TIME[c.sendCycle] }}
        p.item 发放方式：{{ STYPE[c.sendType] }}

        p.item(v-for="(l, i) in  (c.bonusRules || c.topRuleList)") {{ RULES[i] }}： &nbsp;&nbsp;&nbsp;累计{{ TYPE[ l.ruletype || l.ruleType || 0 ].title }}
          span.text-danger  {{ l.sales }}万，
          有效人数
          span.text-danger {{ l.actUser }}人
          | ，分红比例
          span.text-danger  {{ l.bounsRate }}%

        .item.buttons(style="margin: .3rem 0" v-if=" self && STATUS[c.stat].title === '待确认' ")
          .ds-button.primary.large.bold(@click="checkContract(c.id, 1)") 接受
          .ds-button.cancel.large.bold(@click="checkContract(c.id, 0)") 拒绝

</template>

<script>
import store from "../../store";
import api from "../../http/api";
export default {
  props: ["id", "myself", "cType"],
  data() {
    return {
      me: store.state.user,
      // 我的契约
      self: true,
      STATUS: {
        待确认: { id: 0, title: "待确认", class: "wait" },
        已签订: { id: 1, title: "已签订", class: "done" },
        未签订: { id: 2, title: "未签订", reason: "已作废/已拒绝" },
        已拒绝: { id: 3, title: "已拒绝", class: "refused", reason: "已拒绝" }
        // '待确认': {id: 4, title: '待确认', reason: '重新发起'}
      },
      contracts: [],
      // 契约时间类型
      // TIME: ['月', '周', '日'],
      // TIME: ['月', '半月', '周'],
      TIME: ["", "月", "半月", "周"],
      STYPE: ["手动发放", "自动发放"],
      // 销售盈亏类型
      TYPE: [
        { id: 1, title: "销售" },
        { id: 2, title: "亏损" },
        { id: 2, title: "亏损" }
      ],
      RULES: [
        "规则一",
        "规则二",
        "规则三",
        "规则四",
        "规则五",
        "规则六",
        "规则七",
        "规则八",
        "规则九",
        "规则十",
        "规则十一",
        "规则十二",
        "规则十三",
        "规则十四",
        "规则十五",
        "规则十六",
        "规则十七",
        "规则十八",
        "规则十九",
        "规则二十",
        "规则二十一",
        "规则二十二",
        "规则二十三",
        "规则二十四",
        "规则二十五",
        "规则二十六",
        "规则二十七",
        "规则二十八",
        "规则二十九",
        "规则三十"
      ]
    };
  },
  computed: {
    apiContractDetail() {
      return this.me.role <= 2 && this.self
        ? api.topContract
        : api.qryContractById;
    }
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    // '$route': 'openRoute'
  },
  mounted() {
    // console.log(this.$route.query.self, '????????????????!!!!!!!!!!!!')
    this.self = this.myself;
    this.qryContractById(this.id || "");
  },
  methods: {
    openRoute({ path, query: { id, self } }) {
      if (path !== "/group/3-3-4") return false;
      if (id) {
        this.self = self;
        this.qryContractById(id);
      }
    },
    contract() {
      let loading = this.$loading(
        {
          text: "我的契约加载中...",
          target: this.$el
        },
        10000,
        "加载超时..."
      );
      this.$http
        .get(api.queryMyContract, {
          cType: this.cType
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.contracts = data.contractList.reverse();
              setTimeout(() => {
                loading.text = "加载成功!";
              }, 100);
            } else loading.text = "加载失败!";
          },
          rep => {
            // error
            this.$message.error("加载失败！");
          }
        )
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 100);
        });
    },
    // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=qryContractById&contractId=12
    qryContractById(id) {
      // 如果没有ID， 查询我的契约
      if (!id || this.self) {
        this.self = true;
        return this.contract();
      }
      this.$http
        .get(this.apiContractDetail, {
          contractId: id
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.contracts = data.contractList ? data.contractList : [data];
            } else this.$message(data.msg || "契约详情查询失败!");
          },
          rep => {
            // error
            this.$message.error("契约详情查询失败！");
          }
        );
    },
    // http://192.168.169.44:9901/cagamesclient/team/contractBonus.do?method=checkContract&contractId=11&status=1
    checkContract(id, i) {
      this.$http
        .get(api.checkContract, {
          contractId: id,
          status: i
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.qryContractById();
            } else this.$message(data.msg || "契约接收/拒绝失败!");
          },
          rep => {
            // error
            this.$message.error("契约接收/拒绝失败！");
          }
        );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../var.stylus';

.contract {
  top: TH;
  // background #fff
  text-align: center;
  radius();

  // &.center:after
  // content ''
  // height 100%
  // width 0
  // vertical-align middle
  // display inline-block
  .form {
    padding: PWX;
  }

  .c {
    margin: 0.3rem;

    &:not(:first-child) {
      margin-top: 0.6rem;
      opacity: 0.7;
    }
  }
}

.item {
  margin: 0.24rem 0;
  text-align: left;
  padding-left: 20%;
}
</style>
