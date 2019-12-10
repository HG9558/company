<template lang="jade">
  el-dialog(
    v-bind:visible.sync="visible" 
    v-bind:modal="false" 
    v-bind:append-to-body="!0" 
    v-bind:close-on-click-modal="!1"  
    @close="$emit('callback')"
    center 
    custom-class="addEditLink")
    span(slot="title") {{$props.type=='add' ? '新增' : '修改'}}推广链接
    .ad
      .t_c
        //- .pd_25
        //-   p.ft18(style="padding: 0rem 1rem") 您的推广码：
        //-     span.text-blue {{ promotionCode }}
        //- hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: 0 .2rem 0 .2rem ")
        template(v-if="data.length")
          .pd_25
            p.ft18.pb_25 推广链接设置
            .mh_500.mg_0a.t_l(style="width:5rem")
              template(v-for=" (v, i) in  data")
                .mb_20.v_t(v-bind:key="i")
                  span.text-danger.pd_5 *
                  span.label(v-if=" !v.groupId") 彩票返点
                  span.label(v-else) {{ v.groupName  }}返水
                  el-select(v-model="v.$" clearable style="width: 1.7rem")
                    el-option(v-bind:label=" '0.0' " v-bind:value=" 0 ")
                    el-option(v-for=" (x, j) in v.$s " v-bind:label=" (x * 0.1).toFixed(1) " v-bind:value=" (x * 0.1).toFixed(1) ")

                  span(v-if=" !v.groupId ")
                    span.text-blue  %
                    span.c_03（百分符）
                  span(v-else)
                    span.text-blue  ‰
                    span.text-999（千分符）
                  //- 彩票奖金
                  //- 奖金计算公式 20 * 返点 + 1800
                  div(v-if=" !v.groupId ")
                    span.label(style="width:0.92rem;")
                    el-slider.slidername(
                      v-model="v.$"
                      v-bind:max="userPoint" 
                      v-bind:step="0.1" 
                      v-bind:show-tooltip="false" 
                      v-bind:disabled="!userPoint"
                      show-input
                      style="width: 1.7rem"
                    )
                    span.tips 奖金：{{20 * v.$ + 1800}}
                    span.tips 返点：{{v.$}}%

        hr(style="height: 0; border: 0; border-top: 1px solid #d4d4d4; margin: 0 .2rem 0 .2rem ")

        .pd_25
          p.ft18.pb_25 选择线路

          div(style="user-select: text;")
            .text-blue.t_l.mg_0a(style="width:4.6rem")
              //- 添加
              template(v-if="$props.type=='add'")
                el-radio-group(v-model="url")
                  el-radio(v-for=" (v, i) in urls " v-bind:label="v")
                    .inlb.linkname(:title="v") {{v}}
                    //- .inlb.linktip(@click="CalculateLine(v, i)") 测速
                    //- .inlb.linkms(v-bind:class="{'fast':urlSpeed[i]<=30,'slow':urlSpeed[i]>30}") {{urlSpeed[i]}}{{typeof(urlSpeed[i])=='number' ? 'ms' : '' }}
              //- 修改
              template(v-if="$props.type=='edit'")
                div(v-for=" (v, i) in urls " v-bind:label="v")
                  .inlb.linkname(:title="v") {{v}}
                  //- .inlb.linktip(@click="CalculateLine(v, i)") 测速
                  //- .inlb.linkms(v-bind:class="{'fast':urlSpeed[i]<=30,'slow':urlSpeed[i]>30}") {{urlSpeed[i]}}{{typeof(urlSpeed[i])=='number' ? 'ms' : '' }}
                  //- input.ds-input(v-bind:value="v" readonly)
                //- span.ds-button.text-button.blue(v-clipboard:copy=" v " v-clipboard:success="copySuccess"  v-clipboard:error="copyError" style="position: absolute;padding: 0 10px") 复制
                //- br
                //- .QR.ds-icon-QR(:style="QRS[i]")
                //-   p.text-black(style="font-weight: bold; padding-top: 1.5rem;") 扫码注册
        .pd_25
          .mh_500.mg_0a.t_l(style="width:4.6rem")
            .mb_20.v_t
              span.label 链接备注
              input.ds-input.large(v-model="form.remarks" maxlength="10" placeholder="（10个字以内）")
              span.tips 例：百度贴吧彩票1900
            .mb_20.v_t
              span.label 手机号码
              input.ds-input.large(v-model="form.tel" @keyup="form.tel=form.tel.replace(/[^0-9]/ig,'')" maxlength="11" placeholder="选填")
            .mb_20.v_t
              span.label QQ号码
              input.ds-input.large(v-model="form.qq" @keyup="form.tel=form.tel.replace(/[^0-9]/ig,'')" maxlength="11" placeholder="选填")
            .mb_20.v_t
              span.label 微信号码
              input.ds-input.large(v-model="form.wechat" placeholder="选填")
            .mb_20.v_t
              span 注：您所填写的联系方式将会展示在本链接对应的注册页面，以方便下级用户在新注册时遇到问题联系您。

          .buttons(style="padding: .1rem 2.03rem")
            .ds-button.primary.large.bold.w_140.hlh_40(@click="setKeepPoint") 提交





</template>

<script>
import api from "../../http/api";
// import $ from "jquery";
export default {
  // type 取值 add  edit
  props: ["show", "type", "row"],
  data() {
    return {
      visible: this.$props.show,
      userPoint: 0, //最大彩票返点
      url: "",
      urlSpeed: {},
      urls: [],
      qrs: [],
      promotionCode: "",
      data: [],
      form: {
        remarks: "",
        tel: "",
        qq: "",
        wechat: ""
      }
    };
  },
  computed: {
    // myQR () {
    //   return {
    //     background: 'url(' + api.createQr + ') left top no-repeat',
    //     height: '1.96rem',
    //     width: '1.4rem',
    //     textAlign: 'center'
    //   }
    // },
    // QRS () {
    //   return this.qrs.map(q => {
    //     return (q = {
    //       background: 'url(' + 'data:image/png;base64,' + q + ') left top no-repeat',
    //       height: '1.96rem',
    //       width: '1.4rem',
    //       marginTop: '.15rem',
    //       textAlign: 'center',
    //       display: 'inline-block'
    //     })
    //   })
    // }
  },
  mounted() {
    // this.showSpreadLinks();
    // this.getQR()
    this.Init();
  },
  methods: {
    Init () {
      this.$props.type === "edit" && (this.getRegistLines())
      this.$props.type === "add" && (this.showSpreadLinks())
    },
    //计算线路速度
    CalculateLine(host, urlSpeedInx) {
      let n = document.createElement('img')
      let t = Date.now()
      n.setAttribute('src', host)
      n.onload = () => {
        this.urlSpeed[urlSpeedInx] = Date.now() - t
      }
      n.onerror = () => {
        this.urlSpeed[urlSpeedInx] = 10000
      }
      this.$el.appendChild(n)
      // let curTime = new Date().getTime();
      // this.urlSpeed[urlSpeedInx] = "计算中...";
      // this.urls.splice(0, 0);
      // $.ajax({
      //   url: host,
      //   dataType: "jsonp",
      //   timeout: 9999,
      //   complete: (XMLHttpRequest, textStatus) => {
      //     let time = new Date().getTime() - curTime;
      //     if (textStatus === "parsererror") {
      //       //OK
      //       // console.log(v.host, time);
      //       this.urlSpeed[urlSpeedInx] = time;
      //     } else if (textStatus === "timeout") {
      //       //超时
      //       this.urlSpeed[urlSpeedInx] = "timeout";
      //     } else {
      //       //域名异常
      //       this.urlSpeed[urlSpeedInx] = "DNS error";
      //     }
      //     this.urls.splice(0, 0);
      //   }
      // });
    },
    copySuccess() {
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    copyError() {
      this.$message({
        message: "复制失败!"
      });
    },
    // getQR () {
    //   this.$http.get(api.createQr).then(({data}) => {
    //     // success
    //     if (data.success === 1) {
    //       this.qrs = data.qrStr
    //     } else this.$message.error(data.msg || '二维码获取失败！')
    //   }, (rep) => {
    //     // error
    //     this.$message.error('二维码获取失败！')
    //   })
    // },
    //edit
    getRegistLines() {
      this.$http
        .get(api.getRegistLines, {
          entry: this.$props.row.entry
        })
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.userPoint = data.userPoint;
              this.form.remarks = data.lineRemards;
              this.form.tel = data.phone;
              this.form.qq = data.qq;
              this.form.wechat = data.weChant;
              this.urls = [data.line];
              this.url = data.line;
              data.back.unshift({
                groupId: 0
              });
              data.back.forEach((x, i) => {
                if (i) {
                  x.$ = (x.value * 1000).toFixed(1) * 1;
                  x.$s = Math.ceil(x.backWater * 10000);
                } else {
                  x.$ = (data.userPointValue * 100).toFixed(1) * 1;
                  x.$s = Math.ceil(data.userPoint * 10);
                }
              });
              // console.log(JSON.stringify(data.back));
              this.data = data.back;
            } else this.$message.error(data.msg);
          },
          rep => {
            // error
          }
        );
    },
    //add
    showSpreadLinks() {
      this.$http.get(api.showSpreadLinksNew).then(
        ({ data }) => {
          // success
          if (data.success === 1) {
            this.userPoint = data.userPoint;
            this.promotionCode = data.promotionCode;
            this.urls = data.url;
            data.url.length && (this.url = data.url[0]); //默认勾选第一个
            data.back.unshift({
              groupId: 0
            });
            data.back.forEach((x, i) => {
              if (i) {
                x.$ =
                  ((x.backWater - x.value).toFixed(4) * 1000).toFixed(1) * 1;
                x.$s = Math.ceil(x.backWater * 10000);
              } else {
                x.$ = (data.userPoint - data.autoPoint).toFixed(1) * 1;
                x.$s = Math.ceil(data.userPoint * 10);
              }
            });
            // console.log(JSON.stringify(data.back));
            this.data = data.back;
          } else this.$message.error(data.msg || "自动注册链接获取失败！");
        },
        rep => {
          // error
          this.$message.error("自动注册链接获取失败！");
        }
      );
    },
    setKeepPoint() {
      let param = {
        lineRemards: this.form.remarks,
        phone: this.form.tel,
        qq: this.form.qq,
        weChant: this.form.wechat,
        linesArr: this.url,
        keepPoint: this.data[0].$,
        pointArr: JSON.stringify({
          myBack: this.data.slice(1).map(x => {
            return {
              groupid: x.groupId,
              groupname: x.groupName,
              backwater: (x.$ / 1000).toFixed(4)
            };
          })
        })
      };
      this.$props.type === "edit" && (param['entry'] = this.$props.row.entry)
      this.$http
        .post(api.setKeepPoint, param)
        .then(
          ({ data }) => {
            // success
            if (data.success === 1) {
              this.$message.success(data.msg || "保留返点设置成功！");
              this.visible = !1;
              this.$emit('callback');
              // this.showSpreadLinks()
            } else this.$message.error(data.msg || "保留返点设置失败！");
          },
          rep => {
            // error
            this.$message.error("保留返点设置失败！");
          }
        );
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../var.stylus';

.ad {
  .form {
    padding: PWX;
  }
}

.el-select, .el-input-number {
  width: 1rem;
}

.el-select {
  position: relative;
  top: 0.01rem;
}

.amount {
  font-family: Roboto;
  font-size: 0.72rem;
  color: #333;
}

.notice {
  font-size: 0.12rem;
  line-height: 0.22rem;
  margin: 0 0.2rem;
  padding: PWX;
  background-color: #fffde8;
  border: 1px solid #d5d09b;
  radius();

  .content {
    display: inline-block;
    margin: 0;
    line-height: 0.25rem;
    vertical-align: top;
  }
}

.hlh_40 {
  line-height: 0.4rem;
}

ul {
  list-style: none;
}

.c_03 {
  color: #033333;
}
</style>
<style lang="less">
.ad {
  .label {
    width: 0.75rem;
    display: inline-block;
  }

  .tips {
    margin-left: 0.2rem;
  }

  .el-slider__button-wrapper {
    top: -8px;
  }
  .slidername {
    width: 2rem;
    position: relative;
    .el-slider__runway.show-input {
      margin-right: 40px;
      margin-left: 40px;
    }
    .el-input-number .el-icon-minus,
    .el-input-number .el-icon-plus {
      display: inline-block;
    }
    .el-input-number .el-input {
      display: none;
    }
    .el-input-number__increase,
    .el-input-number__decrease {
      border: 0 none;
      position: absolute;
      top: 5px;
    }
    .el-slider__input {
      position: unset;
    }
    .el-input-number__decrease {
      left: 0;
    }
    .el-input-number__increase {
      right: 0;
    }
  }
}
</style>
<style lang="less">
.addEditLink {
  background: #fff;
  .el-radio {
    display: block;
    margin-left: 0;
    margin-top: 1em;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #f17d0b;
    background: #f17d0b;
  }
  .linkname {
    margin-left: 0.4em;
    width: 160px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .linktip {
    margin-left: 1.6em;
    cursor: pointer;
    color: #13ce66;
    &:hover {
      color: #f17d0b;
    }
  }
  .linkms {
    margin-left: 1.6em;
    &.fast {
      color: #13ce66;
    }
    &.slow {
      color: #ff4949;
    }
  }
}
</style>