// classify 账户分类
// key 对应 store.actions.setUser() 的值
// authority 权限 1 转入
// authority 权限 2 转出
// alias 别名
export default {
    classifyMap: [
        // { n: '常用账户', classifyID: 99 },
        { n: '真人账户', classifyID: 1 },
        { n: '棋牌账户', classifyID: 2 },
        { n: '老虎机账户', classifyID: 3 }, // 老虎电游
        { n: '体育账户', classifyID: 4 },
        { n: '电竞账户', classifyID: 5 },
        { n: '捕鱼账户', classifyID: 6 },
        { n: '其他账户', classifyID: 0 }
    ],
    list: [
        { id: 0, n: '主', key: 'amoney', classname: '', classifys: [], authority: [1, 2] },
        { id: 1, key: 'smoney', n: '特殊', classname: 'acc-bg-oriange', classifys: [0], authority: [2] },
        { id: 2, key: 'bgmoney', n: 'BG', classname: 'acc-bg-red', classifys: [1, 3, 6], authority: [1, 2] },
        // { id: 3, key: 'tcgmoney', n: 'IBC', classname: 'acc-bg-blue', classifys: [], authority: [1, 2] },
        { id: 7, key: 'kymoney', n: '开元', classname: 'acc-bg-green', classifys: [2], authority: [1, 2] },
        { id: 5, key: 'ptmoney', n: 'PT', classname: 'acc-bg-oriange', classifys: [1, 3, 6], authority: [1, 2] },
        { id: 4, key: 'agmoney', n: 'AG', classname: 'acc-bg-red', classifys: [1, 3, 6], authority: [1, 2] },
        { id: 9, key: 'sbmoney', n: '沙巴', classname: 'acc-bg-blue', classifys: [4], authority: [1, 2] },
        { id: 15, key: 'lymoney', n: '乐游', classname: 'acc-bg-green', classifys: [2], authority: [1, 2] },
        { id: 17, key: 'uwinmoney', n: 'U赢', classname: 'acc-bg-oriange', classifys: [5], authority: [1, 2] },
        { id: 18, key: 'kgmoney', n: 'KG', classname: 'acc-bg-red', classifys: [0], authority: [1, 2] },
        { id: 25, key: 'litAmount', n: '微游', classname: 'acc-bg-blue', classifys: [], authority: [1, 2] },
        { id: 19, key: 'pbAmount', n: '平博', classname: 'acc-bg-green', classifys: [4], authority: [1, 2] },
        { id: 21, key: 'lgAmount', n: 'LG', classname: 'acc-bg-oriange', classifys: [3], authority: [1, 2] },
        { id: 22, key: 'xyqpAmount', n: '幸运', classname: 'acc-bg-red', classifys: [2], authority: [1, 2] },
        { id: 26, key: 'gdAmount', n: 'GD', classname: 'acc-bg-blue', classifys: [1], authority: [1, 2] },
        // { id: 27, key: 'vgAmount', n: '财神', classname: 'acc-bg-green', classifys: [2], authority: [1, 2] },
        { id: 28, key: 'dsAmount', n: '德胜', classname: 'acc-bg-oriange', classifys: [2], authority: [1, 2] },
        { id: 29, key: 'jjbAmount', n: '小艾', classname: 'acc-bg-red', classifys: [5], authority: [1, 2] },
        { id: 31, key: 'saAmount', n: 'SA真人', classname: 'acc-bg-blue', classifys: [1], authority: [1, 2] },
        { id: 32, key: 'saEgameAmount', n: 'SA电游', classname: 'acc-bg-green', classifys: [3], authority: [1, 2] },
        { id: 34, key: 'dfAmount', n: 'OG', classname: 'acc-bg-oriange', classifys: [1], authority: [1, 2] },
        { id: 44, key: 'hlAmount', n: '欢乐', classname: 'acc-bg-red', classifys: [2], authority: [1, 2] },
        { id: 32, key: 'saEgameAmount', n: 'SA捕鱼', classname: 'acc-bg-green', classifys: [6], authority: [1, 2] },
        { id: '', key: 'free', n: '优惠券', alias: '优惠券', classname: 'acc-bg-blue', classifys: [0], authority: [] }
    ]
}
