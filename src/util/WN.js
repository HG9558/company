import { C } from './base'
// 空值判断
let empty = value => value.match(/^[\s\t\r]*$/)

/*
value: 输入值
N: 一注的长度
r: 最大相同数字的长度
l: 一个号码的长度 如12345有5个号码, 010203有3个号码, 号码长度为2
 */
let N = (value, N, r, l, max, min) => empty(value) ? [] : value.split(' ').filter(n => n.length === N).filter(n => {
  return (typeof r !== 'number') || r === Object.values(n.match(new RegExp('\\d{' + (l || 1) + '}', 'g')).reduce((p, na) => {
    if (p[na] !== undefined) p[na] += 1
    else p[na] = 1
    if ((max !== undefined && parseInt(na) > max) || (min !== undefined && parseInt(na) < min)) p[na] = r + 1
    return p
  }, {})).sort((a, b) => b - a)[0]
})
// 最大重复号码为r 或小于 r
let ON = (value, N, r, l, max, min) => empty(value) ? [] : value.split(' ').filter(n => n.length === N).filter(n => {
  return (typeof r !== 'number') || r >= Object.values(n.match(new RegExp('\\d{' + (l || 1) + '}', 'g')).reduce((p, na) => {
    if (p[na] !== undefined) p[na] += 1
    else p[na] = 1
    if ((max !== undefined && parseInt(na) > max) || (min !== undefined && parseInt(na) < min)) p[na] = r + 1
    return p
  }, {})).sort((a, b) => b - a)[0]
})

// 数组内各长度相乘
let P = (nsl) => {
  let n = 1
  nsl.forEach(nl => {
    n *= nl
  })
  return n
}
// 数组内各长度相加
let A = (nsl) => {
  let n = 0
  nsl.forEach(nl => {
    n += nl
  })
  return n
}

// win n
let SSC = {
   /* *************************************一星*********************************** */
  /* ..............定位胆............... */
  /*
  定位胆
  C(n1, 1)+C(n2, 1)+C(n3, 1)+C(n4, 1)+C(n5, 1)
  */
  '1-1-1' ({nsl}) {
    return Math.min(nsl[0], 1) + Math.min(nsl[1], 1) + Math.min(nsl[2], 1) + Math.min(nsl[3], 1) + Math.min(nsl[4], 1)
  },
  /* *************************************不定位*********************************** */
  /* ..............三星............... */
  /*
  前三一码
  C(n, 1)
  */
  '0-1-1' ({nsl}) {
    return Math.min(nsl[0], 3)
  },

  /*
  前三二码
  n>=2
  C(n, 2)
  */
  '0-1-2' ({nsl}) {
    return Math.min(C(nsl[0], 2), 3)
  },

  /*
  中三一码
  C(n, 1)
  */
  '0-1-3' ({nsl}) {
    return Math.min(nsl[0], 3)
  },

  /*
  中三二码
  n>=2
  C(n, 2)
  */
  '0-1-4' ({nsl}) {
    return Math.min(C(nsl[0], 2), 3)
  },

  /*
  后三一码
  C(n, 1)
  */
  '0-1-5' ({nsl}) {
    return Math.min(nsl[0], 3)
  },

  /*
  后三二码
  n>=2
  C(n, 2)
  */
  '0-1-6' ({nsl}) {
    return Math.min(C(nsl[0], 2), 3)
  },

  /* ..............四星............... */
  /*
  前四一码
  C(n, 1)
  */
  '0-2-1' ({nsl}) {
    return Math.min(nsl[0], 4)
  },

  /*
  前四二码
  n>=2
  C(n, 2)
  */
  '0-2-2' ({nsl}) {
    return Math.min(C(nsl[0], 2), 6)
  },

  /*
  后四一码
  C(n, 1)
  */
  '0-2-3' ({nsl}) {
    return Math.min(nsl[0], 4)
  },

  /*
  后四二码
  n>=2
  C(n, 2)
  */
  '0-2-4' ({nsl}) {
    return Math.min(C(nsl[0], 2), 6)
  },

  /* ..............五星............... */
  /*
  五星二码
  n>=2
  C(n, 2)
  */
  '0-3-1' ({nsl}) {
    return Math.min(C(nsl[0], 2), 10)
  },

  /*
  五星三码
  n>=3
  C(n, 3)
  */
  '0-3-2' ({nsl}) {
    return Math.min(C(nsl[0], 3), 10)
  },
  /* *************************************任选*********************************** */
  /* ..............任二............... */
  /*
  直选复式
  N1万，N2千，N3百，N4十，N5个 n>=1
  "N1 * N2 + N1 * N3 + N1 * N4 + N1 * N5 + N2 * N3 + N2 * N4 + N2 * N5 + N3 * N4 + N3 * N5 + N4 * N5h或者
  C(选择有号码的位置, 2), 再对这些位置上的号码个数相乘"
  */
  '-1-1-1' ({nsl}) {
    let N1 = nsl[0] ? 1 : 0
    let N2 = nsl[1] ? 1 : 0
    let N3 = nsl[2] ? 1 : 0
    let N4 = nsl[3] ? 1 : 0
    let N5 = nsl[4] ? 1 : 0
    return C(A([N1, N2, N3, N4, N5]), 2)
  },

  /*
  直选单式
  N录入的号码个数，p位置选择的个数 C(p, 2) * N
  */
  '-1-1-2' ({value, psl}) {
    return C(psl, 2) * (N(value, 2).length ? 1 : 0)
  },

  /*
  组选复式
  p位置选择的个数，n选择的号码个数 C(p, 2) * C(n, 2)
  */
  '-1-1-3' ({nsl, psl}) {
    return C(psl, 2) * (C(nsl[0], 2) ? 1 : 0)
  },

  /*
  组选单式
  N录入的号码个数，p位置选择的个数 C(p, 2) * N
  */
  '-1-1-4' ({psl, value}) {
    return C(psl, 2) * (N(value, 2).length ? 1 : 0)
  },

  /* ..............任三............... */
  /*
  直选复式
  N1万，N2千，N3百，N4十，N5个 n>=1
  "N1 * N2 * N3+N1 * N2 * N4+N1 * N2 * N5+N1 * N3 * N4+N1 * N3 * N5+N1 * N4 * N5+N2 * N3 * N4, +N2 * N3 * N5+N2 * N4 * N5+N3 * N4 * N5或者
  C(选择有号码的位置, 3), 再对这些位置上的号码个数相乘"
  */
  '-1-2-1' ({nsl}) {
    let N1 = nsl[0] ? 1 : 0
    let N2 = nsl[1] ? 1 : 0
    let N3 = nsl[2] ? 1 : 0
    let N4 = nsl[3] ? 1 : 0
    let N5 = nsl[4] ? 1 : 0
    return C(A([N1, N2, N3, N4, N5]), 3)
  },

  /*
  直选单式
  N录入的号码个数，p位置选择的个数 C(p, 3) * N
  */
  '-1-2-2' ({psl, value}) {
    return C(psl, 3) * (N(value, 3).length ? 1 : 0)
  },

  /*
  组三复式
  p位置选择的个数，n选择的号码个数 "C(p, 3) * C(n, 2)错误
  C(p, 3) * C(n, 2) * 2"
  */
  '-1-2-3' ({nsl, psl}) {
    return C(psl, 3) * (C(nsl[0], 2) ? 1 : 0)
  },

  /*
  组三单式
  N录入的号码个数，p位置选择的个数 C(p, 3) * N
  */
  '-1-2-4' ({psl, value}) {
    return C(psl, 3) * (N(value, 3, 2) ? 1 : 0)
  },

  /*
  组六复式
  p位置选择的个数，n选择的号码个数 C(p, 3) * C(n, 3)
  */
  '-1-2-5' ({nsl, psl}) {
    return C(psl, 3) * (C(nsl[0], 3) ? 1 : 0)
  },
  /*
  组六单式
  N录入的号码个数，p位置选择的个数 C(p, 3) * N
  */
  '-1-2-6' ({psl, value}) {
    return C(psl, 3) * (N(value, 3, 1) ? 1 : 0)
  },
  /*
  混合组选
  N录入的号码个数，p位置选择的个数 C(p, 3) * N
  */
  '-1-2-7' ({psl, value}) {
    let wn = [0, C(psl, 3) * (ON(value, 3, 2).length ? 1 : 0)]
    if (N(value, 3, 2).length) {
      wn[0] = wn[1]
      wn[1] = 0
    }
    return wn
  },

  /* ..............任四............... */
  /*
  直选复式
  N1万，N2千，N3百，N4十，N5个 n>=1
  "N1 * N2 * N3 * N4+N1 * N2 * N3 * N5+N1 * N2 * N4 * N5+N1 * N3 * N4 * N5+N2 * N3 * N4 * N5或者
  C(选择有号码的位置, 4), 再对这些位置上的号码个数相乘"
  */
  '-1-3-1' ({nsl}) {
    let N1 = nsl[0] ? 1 : 0
    let N2 = nsl[1] ? 1 : 0
    let N3 = nsl[2] ? 1 : 0
    let N4 = nsl[3] ? 1 : 0
    let N5 = nsl[4] ? 1 : 0
    return C(A([N1, N2, N3, N4, N5]), 4)
  },

  /*
  直选单式
  N录入的号码个数，p位置选择的个数 C(p, 4) * N
  */
  '-1-3-2' ({psl, value}) {
    return C(psl, 4) * (N(value, 4).length ? 1 : 0)
  },

  /*
  组选24
  p位置选择的个数，n选择的号码个数 C(psl, 4) * C(n, 4)
  */
  '-1-3-3' ({nsl, psl}) {
    return C(psl, 4) * (C(nsl[0], 4) ? 1 : 0)
  },

  /*
  组选12
  p位置选择的个数，m选择的二重号号码个数，n选择的单号号码个数，h重复的号码个数
  C(psl, 4) * (C(m, 1) * C(nsl[0], 2) - C(h, 1) * C(nsl[0]-1, 1))
  */
  '-1-3-4' ({nsl, psl, r}) {
    return C(psl, 4) * (C(nsl[0], 1) * C(nsl[1], 2) - C(r, 1) * C(nsl[1] - 1, 1) ? 1 : 0)
  },

  /*
  组选6 p位置选择的个数，n选择的号码个数 C(psl, 4) * C(nsl[0], 2)
  */
  '-1-3-5' ({nsl, psl}) {
    return C(psl, 4) * (C(nsl[0], 2) ? 1 : 0)
  },

  /*
  组选4 p位置选择的个数，n选择的号码个数，h重复的号码个数
  C(psl, 4) * (C(m, 1) * C(nsl[0], 1) - C(h, 1))
  */
  '-1-3-6' ({nsl, psl, r}) {
    return C(psl, 4) * (C(nsl[0], 1) * C(nsl[1], 1) - C(r, 1) ? 1 : 0)
  },
  /* *************************************趣味*********************************** */
  /* ..............大小单双............... */
  /*
  前二大小单双
  N1 * N2
  */
  '-2-1-1' ({nsl, ns}) {
    return Math.min(P(nsl), 4)
  },
  /*
  后二大小单双
  N1 * N2
  */
  '-2-1-2' ({nsl}) {
    return Math.min(P(nsl), 4)
  },
  /* ..............猜遗漏............... */
  /*
  猜一
  n>=1
  C(n, 1)
  */
  '-2-2-1' ({nsl}) {
    return Math.min(C(nsl[0], 1), 9)
  },

  /*
  猜二
  n>=2
  C(nsl[0], 2)
  */
  '-2-2-2' ({nsl}) {
    return Math.min(C(nsl[0], 2), 36)
  },

  /*
  猜三
  n>=3
  C(nsl[0], 3)
  */
  '-2-2-3' ({nsl}) {
    return Math.min(C(nsl[0], 3), 84)
  },

  /*
  猜四
  n>=4
  C(nsl[0], 4)
  */
  '-2-2-4' ({nsl}) {
    return Math.min(C(nsl[0], 4), 126)
  },

  /*
  猜五
  n>=5
  C(nsl[0], 5)
  */
  '-2-2-5' ({nsl}) {
    return Math.min(C(nsl[0], 5), 126)
  },
  /* ..............五星特殊............... */

  /*
  五星特殊  一帆风顺  C(n,1)  n选择的号码个数 n>=1
  好事成双  C(n,1)  n选择的号码个数n>=1
  三星报喜  C(n,1)  n选择的号码个数n>=1
  四季发财  C(n,1)  n选择的号码个数n>=1
   */
  '5-3-1' ({nsl}) {
    return Math.min(C(nsl[0], 1), 5)
  },
  /*
  好事成双  C(n,1)  n选择的号码个数n>=1
   */
  '5-3-2' ({nsl}) {
    return Math.min(C(nsl[0], 1), 2)
  },
  /* *************************************五星*********************************** */
  /* ..............五星直选............... */
  /*
  直选组合
  5*N1*N2*N3*N4*N5
   */
  '5-1-3' ({nsl, PA}) {
    return 5 * P(nsl) ? [1, nsl[0], nsl[0] * nsl[1], nsl[0] * nsl[1] * nsl[2], nsl[0] * nsl[1] * nsl[2] * nsl[3]] : 1
  },
  /*
  混合组选
  N=输入的号码个数 N
  */
  '+3-2-5' ({value}) {
    let wn = [0, 1]
    if (N(value, 3, 2).length) {
      wn[0] = wn[1]
      wn[1] = 0
    }
    return wn
  },
  '3-2-5' ({value}) {
    return this['+3-2-5']({value})
  },
  '-3-2-5' ({value}) {
    return this['+3-2-5']({value})
  },
  /*
  特殊号
  C(n, 1)
  */
  '+3-3-4' ({ns}) {
    let wn = [0, 0, 0]
    let m = Math.min.apply(Math, ns[0])
    if (m === 1) {
      wn[0] = 1
    } else if (m === 2) {
      wn[1] = 1
    } else {
      wn[2] = 1
    }
    return wn
  },
  /*
  特殊号
  C(n, 1)
  */
  '3-3-4' ({ns}) {
    return this['+3-3-4']({ns})
  },
  /*
  特殊号
  C(n, 1)
  */
  '-3-3-4' ({ns}) {
    return this['+3-3-4']({ns})
  },
  '-4-1-1' ({ns}) {
    let wn = [0, 0]
    if (ns[0][0] === '3') {
      wn[0] = 1
    } else {
      wn[1] = 1
    }
    return wn
  },
  '-4-1-2' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-3' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-4' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-5' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-6' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-7' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-8' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-9' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-10' ({ns}) {
    return this['-4-1-1']({ns})
  },
  '-4-1-11' ({ns}) {
    return this['-4-1-1']({ns})
  },
  /*
    斗牛
  */
  '-5-1-1' ({ns}) {
    let wn = [0, 0]
    if (ns[0][0] === '11') {
      wn[1] = 1
    } else {
      wn[0] = 1
    }
    return wn
  },
  /*
  直选组合
  (N1*N2*N3*N4)*4 N1千，N2百，N3十，N4个n>=1
  */
  '4-1-3' ({nsl}) {
    return 4 * P(nsl) ? [1, nsl[0], nsl[0] * nsl[1], nsl[0] * nsl[1] * nsl[2]] : 1
  },
  '4-3-3' ({nsl}) {
    return 4 * P(nsl) ? [1, nsl[0], nsl[0] * nsl[1], nsl[0] * nsl[1] * nsl[2]] : 1
  }
}
let SSL = {
}
let G115 = {
  // '定位胆',
  '1-1-1-115' ({nsl}) {
    return Math.min(nsl[0], 1) + Math.min(nsl[1], 1) + Math.min(nsl[2], 1)
  },
  // '前三不定位'
  '0-1-1-115' ({nsl}) {
    return Math.min(A(nsl), 3)
  },
   // '一中一',
  '-1-1-1-115' ({nsl}) {
    return Math.min(C(nsl[0], 1), 5)
  },
   // '二中二',
  '-1-1-2-115' ({nsl}) {
    return Math.min(C(nsl[0], 2), 10)
  },
   // '三中三',
  '-1-1-3-115' ({nsl}) {
    return Math.min(C(nsl[0], 3), 10)
  },
   // '四中四',
  '-1-1-4-115' ({nsl}) {
    return Math.min(C(nsl[0], 4), 5)
  },
   // '五中五',
  // '-1-1-5-115' ({nsl}) {
  //   return C(nsl[0], 5)
  // },
   // '六中五',
  '-1-1-6-115' ({nsl}) {
    // return C(nsl[0], 6)
    return C(nsl[0] - 5, 1)
  },
   // '七中五',
  '-1-1-7-115' ({nsl}) {
    // return C(nsl[0], 7)
    return C(nsl[0] - 5, 2)
  },
   // '八中五',
  '-1-1-8-115' ({nsl}) {
    // return C(nsl[0], 8)
    return C(nsl[0] - 5, 3)
  },
   // '一中一',
  '-1-2-1-115' ({value}) {
    return Math.min(N(value, 2, 1, 2, 11, 1).length, 5)
  },
   // '二中二',
  '-1-2-2-115' ({value}) {
    return Math.min(N(value, 4, 1, 2, 11, 1).length, 10)
  },
   // '三中三',
  '-1-2-3-115' ({value}) {
    return Math.min(N(value, 6, 1, 2, 11, 1).length, 10)
  },
   // '四中四',
  '-1-2-4-115' ({value}) {
    return Math.min(N(value, 8, 1, 2, 11, 1).length, 5)
  },
   // '五中五',
  // '-1-2-5-115' ({value}) {
  //   return [N(value, 10, 1, 2, 11, 1).length, N(value, 10, 1, 2, 11, 1)]
  // },
   // '六中五',
  '-1-2-6-115' ({value}) {
    return Math.min(N(value, 12, 1, 2, 11, 1).length, 6)
  },
   // '七中五',
  '-1-2-7-115' ({value}) {
    return Math.min(N(value, 14, 1, 2, 11, 1).length, 15)
  },
   // '八中五',
  '-1-2-8-115' ({value}) {
    return Math.min(N(value, 16, 1, 2, 11, 1).length, 20)
  },
   // '二中二',
  '-1-3-1-115' ({nsl}) {
    return Math.min(C(nsl[1], 1), 4)
  },
   // '三中三',
  '-1-3-2-115' ({nsl}) {
    if (C(nsl[1], (3 - nsl[0])) >= C(5 - nsl[0], (3 - nsl[0]))) {
      return C(5 - nsl[0], (3 - nsl[0]))
    } else {
      return C(nsl[1], (3 - nsl[0]))
    }
  },
   // '四中四',
  '-1-3-3-115' ({nsl}) {
    if (C(nsl[1], (4 - nsl[0])) >= C(5 - nsl[0], (4 - nsl[0]))) {
      return C(5 - nsl[0], (4 - nsl[0]))
    } else {
      return C(nsl[1], (4 - nsl[0]))
    }
  },
  // '五中五',
  // '-1-3-4-115' ({nsl}) {
  //   return C(nsl[0], nsl[0]) * C(nsl[1], (5 - nsl[0]))
  // },
   // '六中五',
  '-1-3-5-115' ({nsl}) {
    return C(nsl[0] + nsl[1] - 5, 1)
  },
   // '七中五',
  '-1-3-6-115' ({nsl}) {
    return C(nsl[0] + nsl[1] - 5, 2)
  },
   // '八中五',
  '-1-3-7-115' ({nsl}) {
    return C(nsl[0] + nsl[1] - 5, 3)
  }
}
let KL8 = {
}
let PK10 = {
  '-1-9-2-PK10' ({ns}) {
    // odd: 0,1 big, 2,3 small
    // num: 1,4 big  2,3 small
    let wn = [0, 0, 0, 0];
    if (ns[0].includes('1')) wn[0] = 1
    if (ns[0].includes('2')) wn[2] = 1
    if (ns[0].includes('3')) wn[3] = 1
    if (ns[0].includes('4')) wn[1] = 1
    if (ns[0].includes('1') && ns[0].includes('2')) wn[2] = 0
    if (ns[0].includes('3') && ns[0].includes('4')) wn[3] = 0
    return wn
  }
}
let K3 = {
}
let HC6 = {
}

module.exports = Object.assign(SSC, SSL, G115, KL8, PK10, K3, HC6)
