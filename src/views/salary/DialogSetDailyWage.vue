<template lang="jade">
  .modal.inner-modal.dialog-set-daily-wage(v-show="showDialogSetWage" )
    .mask
    .box-wrapper
      .box(ref="box")
        .tool-bar
          span.title 日工资设置
          el-button-group
            el-button.close(icon="close" @click="$emit('close')")

        p(class="form-row")
          span 日工资&nbsp;&nbsp;&nbsp;&nbsp;
          el-select(v-model="salary" style="width: 2.2rem; position: relative; top: -.01rem")
            el-option(v-for="O in OL" v-bind:label="O.name" v-bind:value="O.value")
            //- el-option(v-for="O in OL.filter(x => x.value >= user.daySalary) " v-bind:label="O.name" v-bind:value="O.value")

        p(class="form-row" style="margin-top: .15rem") 
          | 团队销量 
          el-input-number(v-model="teamSales")
          |  万

        p(class="form-row" style="margin-top: .15rem") 
          | 有效用户 
          el-input-number(v-model="activityCount")
          |  人
          span.text-999 （投注达到500为有效用户）
          br
          span.ds-button.primary.large.bold(@click="setSalary") 确认

</template>

<script>
import api from '../../http/api'
export default {
  name: '',
  data () {
    return {
      salary: '',
      OL: [],
      userId: '',
      activityCount: '',
      teamSales: '',
      minPoint: '',
      maxPoint: ''
    }
  },
  props: {
    showDialogSetWage: {
      type: Boolean,
      default: false
    },
    id: String
  },
  mounted () {
    this.getUserList(this.id, 1)
  },
  methods: {
    getUserList (id, page, fn) {
      let loading = this.$loading({
        text: '加载中...',
        target: this.$el
      }, 10000, '加载超时...')
      if (!fn) {
        this.preOptions = {
          userId: id,
          // userName: this.name,
          minPoint: this.minPoint,
          maxPoint: this.maxPoint,
          cType: this.rg,
          sortType: this.f,
          // sort: !this.btos ? 1 : 2,
          page: 1,
          pageSize: this.pageSize
        }
      } else {
        this.preOptions.page = page
      }
      this.$http.post(api.getUserList, this.preOptions).then(({data}) => {
        // success
        if (data.success === 1) {
          this.BL = (data.userBreads).concat([{}])

          this.showSalary = data.showSalary
          let user = data.subUserInfo.filter((u) => { return u.userId === parseInt(id) })[0] || {}
          this.salary = user.daySalary
          this.activityCount = user.actUser
          this.teamSales = user.teamSales
          data.salaryComb = data.salaryComb.filter((item) => { return item.value >= user.daySalary && item.value > 0 })
          if (!this.salary) {
            this.salary = data.salaryComb[0].value
          }
          this.OL = data.salaryComb

          typeof fn === 'function' && fn()
          !fn && (this.currentPage = 1)
        }
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    },
    // 设置日工资：
    setSalary () {
      let loading = this.$loading({
        text: '工资调整中...',
        target: this.$el
      }, 10000, '工资调整超时...')
      this.$http.post(api.setSalary, {
        userId: this.id,
        salary: this.salary,
        activityCount: this.activityCount,
        teamSale: this.teamSales
      }).then(({data}) => {
        // success
        if (data.success === 1) {
          setTimeout(() => {
            loading.text = '工资调整成功!'
          }, 100)
          this.$emit('close')
          this.$emit('set-wage', true)
        } else loading.text = data.msg || '工资调整失败!'
      }, (rep) => {
        // error
      }).finally(() => {
        setTimeout(() => {
          loading.close()
        }, 100)
      })
    }
  }
}
</script>

<style lang="stylus">
.modal.dialog-set-daily-wage
  .box-wrapper .box
    width: 6rem 
    height 3.82rem
  .form-row
    padding-left 20%
    margin-top .7rem
  .ds-button.primary
    margin-left .54rem
    margin-top .15rem
</style>
