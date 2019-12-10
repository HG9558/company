<script>
import common from './common'
export default {
  mixins: [common],
  data () {
    return {
      gameType: 'K3',
      menus: [
        // {id: '-1-1-1-K3', title: '和值', description: '从3-18中任意选择1个或1个以上号码，所选号码与开奖号和值相同即中奖. ', example: ''},
        {
          title: '二同号',
          groups: [
            {
              items: [
                {id: '2-1-1-K3', title: '二同复选', description: '对三个号码中两个指定的相同号码进行投注。(选择范围11-66)', example: '投注方案：66； 开奖号码出现：2个6，即中二同复选。'},
                {id: '2-1-2-K3', title: '二同单选', description: '对三个号码中两个指定的相同号码和一个指定的不同号码进行投注。（分别选择同号和不同号）', example: '投注方案：同号11、不同号2； 开奖号码为112（顺序不限），即中二同单选。'}
              ]
            }
          ]
        },
        {
          title: '二不同号',
          groups: [
            {
              items: [
                {id: '-2-1-1-K3', title: '二不同标准', description: '对三个号码中两个指定的不同号码进行投注。', example: '投注方案：12； 开奖号码出现: 1个1，1个2(顺序不限)，即中二不同标准。'},
                {id: '-2-1-2-K3', title: '二不同胆拖', description: '从1-6中，选取2个及以上的号码进行投注，每注需至少包括1个胆码及1个拖码。', example: '投注方案：12； 开奖号码: 123，即中二不同胆拖。'}
              ]
            }
          ]
        },
        {
          title: '三同号',
          groups: [
            {
              items: [
                {id: '3-1-1-K3', title: '三同单选', description: '从所有相同的三个号码（111、222、…、666）中任意选择一组号码进行投注', example: '投注方案：111； 开奖号码: 111，即中三同单选。'},
                {id: '3-1-2-K3', title: '三同通选', description: '对所有相同的三个号码（111、222、…、666）进行投注。', example: '投注方案：全； 开奖号码: 111,222,333,444,555,666，即中三同通选。'}
              ]
            }
          ]
        },
        {
          title: '三不同号',
          groups: [
            {
              items: [
                {id: '-3-1-1-K3', title: '三不同标准', description: '从1-6中任选3个或者3个以上的号码，所选号码与开奖号码相同即中奖。', example: '投注方案：123； 开奖号码: 123(顺序不限)，即三中不同标准。'},
                {id: '-3-1-2-K3', title: '三不同胆拖', description: '从1-6中，选取胆码最多为2个号码，且与拖码组成个数大于或者等于3的投注号码进行投注，选择的胆码必须全部与开奖号码相符才算中奖。', example: '投注方案：2,45或24,5或4,265； 开奖号码: 245(顺序不限)，即中三不同胆拖。'}
              ]
            }
          ]
        },
        {
          title: '三连号',
          groups: [
            {
              items: [
                {id: '+3-1-1-K3', title: '三连单选', description: '对三连号选择一个或多个投注', example: '投注方案：123； 开奖号码: 123(顺序不限)，即中三连单选。'},
                {id: '+3-1-2-K3', title: '三连通选', description: '对所有三个相连的号码（仅限：123、234、345、456）进行投注。', example: '投注方案：全； 开奖号码: 123, 234, 345, 456(顺序不限)，即中三连通选。'}
              ]
            }
          ]
        },
        {
          title: '趣味',
          groups: [
            {
              items: [
                {id: '0-1-1-K3', title: '和值', description: '从3-18中任意选择1个或1个以上号码，所选号码与开奖号和值相同即中奖. ', example: '投注方案：6； 开奖号码: 231(加起来等于6)，即中和值。'},
                {id: '0-1-2-K3', title: '猜1个号就中奖', description: '选择1个您认为一定会开出的号码，系统将智能为您筛选出包含该号码的单选号码组合。', example: '投注方案：6； 开奖号码出现：1个6，即中猜1个号就中奖'}
              ]
            }
          ]
        }
        // {id: '-4-1-1-K3', title: '猜1个号就中奖', description: '', example: ''}
      ],
      // 玩法信息
      type: {
        id: '2-1-1-K3',
        // 玩法名
        title: '二同复选',
        // 玩法描述
        description: '对三个号码中两个指定的相同号码进行投注。(选择范围11-66)'
      },
      lucknumbers: [1, 1, 1],
      getTitle () {
        switch (this.type.id.slice(0, 2)) {
          case '2-':
            return '二同号'
          case '-2':
            return '二不同号'
          case '+3':
            return '三连号'
          case '3-':
            return '三同号'
          case '-3':
            return '三不同号'
          case '-4':
            return '二同号'
          case '0-':
            return '趣味'
        }
      }
    }
  },
  methods: {
    getUpTitle () {
      switch (this.type.id.slice(0, 2)) {
        case '2-':
          return '二同号'
        case '-2':
          return '二不同号'
        case '+3':
          return '三连号'
        case '3-':
          return '三同号'
        case '-3':
          return '三不同号'
        case '-4':
          return '二同号'
        case '0-':
          return '趣味'
      }
    }
  }
}
</script>
