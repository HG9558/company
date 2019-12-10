<template lang="jade">
  section.order-types-modal.bg-w
    .quick-chooise-wp
      section.type-title 快捷
      ul(class="flex type-ls-wp" v-show="quickButtons.length > 0")
        li(v-for="(q, i) in quickButtons" class="flex flex-ai-c flex-jt-c type-item" v-bind:class="{selected: curQuickIdx === i}" @click="choicedQuick(q.type, i)") {{q.title}}
    .order-types-wp
      section.type-wp(v-for="(type, i) in types")
        section.type-title {{type.text}}
          <el-checkbox v-model="type.checked" v-on:change="typeChoice(i, $event)"></el-checkbox>
        ul(class="flex type-ls-wp" )
          li(v-for=" (orderType, j) in type.orderList" class="flex flex-ai-c flex-jt-c type-item" v-bind:class="{selected: orderType.checked}" @click="typeItemChoice(orderType, j, i)") {{orderType.cnTitle}}
    .buttons.txt-c.mt15(style="margin-left: .3rem")
      .ds-button.primary.large.bold(@click="sure") 确定
      .ds-button.cancel.large(@click="reset") 重置
</template>

<script>
import api from '../http/api'
import store from '../store'
import { Checkbox } from 'element-ui'
import _ from 'lodash'
export default {
  name: 'SearchConditionOrderTypes',
  data () {
    return {
      ME: store.state.user,
      types: [],
      curIdx: -1,
      curQuickIdx: -1,
      quickButtons: [{title: '支出', type: '0'}, {title: '收入', type: '1'}, {title: '全部', type: '3'}]
    }
  },
  components: {
    [Checkbox.name]: Checkbox
  },
  props: {
    typeData: {
      type: Array,
      default () {
        return []
      }
    }
  },
  watch: {
    typeData () {
      this.types = _.cloneDeep(this.typeData)
    }
  },
  mounted () {
    this.getOrderType()
  },
  methods: {
    choicedQuick (type, i) {
      this.curQuickIdx = i
      if (type === '3') {
        this.setChoicedAll()
      } else {
        this.setChoicedByType(type)
      }
    },
    setChoicedAll () {
      this.types = this.types.map((type) => {
        type.checked = true
        type.orderList = type.orderList.map((orderType) => {
          orderType.checked = true
          return orderType
        })
        return type
      })
    },
    setChoicedByType (t) {
      this.initTypes()
      this.types = this.types.map((type) => {
        let count = 0
        type.orderList = type.orderList.map((orderType) => {
          if (orderType.operations === t) {
            orderType.checked = true
            count++
          }
          return orderType
        })
        if (count === type.orderList.length) {
          type.checked = true
        }
        return type
      })
    },
    initTypes () {
      this.types = this.types.map((type) => {
        type.checked = false
        type.orderList = type.orderList.map((orderType) => {
          orderType.checked = false
          return orderType
        })
        return type
      })
    },
    getOrderType () {
      this.$http.get(api.getOrderType, {version: 1}).then(({data}) => {
        if (data.success === 1) {
          this.ME.showSalary && data.orderTypeList.push({
            text: '日工资',
            orderList: [
              {
                cnTitle: '日工资',
                ordertypeId: 37
              }
            ]
          })
          this.types = data.orderTypeList
          this.initTypes()
        }
      }, (rep) => {
        // error
      })
    },
    typeChoice (i, $event) {
      let type = this.types[i]
      type.orderList = type.orderList.map((types) => {
        types.checked = type.checked
        return types
      })
      this.$set(this.types, i, type)
    },
    typeItemChoice (orderType, j, i) {
      let type = this.types[i]
      let needCheckedParent = false
      type.orderList[j].checked = !type.orderList[j].checked
      needCheckedParent = type.orderList.every((typeItem) => {
        return typeItem.checked
      })
      if (!type.orderList[j].checked) needCheckedParent = false
      type.checked = needCheckedParent
      this.$set(this.types, i, type)
    },
    sure () {
      this.$emit('sure', this.types)
    },
    reset () {
      this.curQuickIdx = -1
      this.initTypes()
    }
  }
}
</script>

<style lang="stylus">
  .order-types-modal
    width 8.9rem
    min-height 5.8rem
    padding 0.3rem 0.2rem
    box-sizing border-box
    .type-title
      font-weight bold
      text-indent 0.05rem
    .order-types-wp
      overflow hidden
    .history-wp
      margin-bottom 0.2rem
    .type-wp
      width 4.1rem
      float left
      padding-top 0.25rem
      margin-right 0.1rem
    .type-ls-wp
      width 4.2rem
      display flex
      justify-content space-between
      flex-wrap wrap
      margin 0
      padding 0
      
      &::after
        content ''
        flex 1
    .type-item
      width 1.3rem
      height 0.3rem
      background-image linear-gradient(0deg, #f3f3f3 0%, #ffffff 100%), linear-gradient(#000000, #000000)
      margin 0.05rem
      box-sizing border-box
      border-radius  0.03rem
      border solid 1px #e8e8e8
    .type-item:hover
      border solid 1px #f37e0c
    .type-item.selected
      background-image linear-gradient(0deg, #fff3e9 0%, #fffaf6 100%), linear-gradient(#000000, #000000) !important
      border solid 1px #f37e0c !important
    .type-item.fixed-slted
      color #f37e0c
      background-image linear-gradient(0deg, #fff6c2 0%, #fff8d3 100%), linear-gradient(#000000, #000000)
      border solid 1px #dbd093

</style>
