var digitUppercase = function (n) {
    var fraction = ['角', '分']
    var digit = [
        '零', '壹', '贰', '叁', '肆',
        '伍', '陆', '柒', '捌', '玖'
    ]
    var unit = [
        ['元', '万', '亿'],
        ['', '拾', '佰', '仟']
    ]
    var head = n < 0 ? '欠' : ''
    n = Math.abs(n)
    var s = ''
    for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
    }
    s = s || '整'
    n = Math.floor(n)
    for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
            p = digit[n % 10] + unit[1][j] + p
            n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
    }
    return head + s.replace(/(零.)*零元/, '元')
        .replace(/(零.)+/g, '零')
        .replace(/^整$/, '零元整')
}
function numberWithCommas(x) {
    if (x === undefined) return ''
    let parts = x.toString().split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
    // return x.toString().split('.')x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let getAnimalOfNumber = (n, ii) => {
    let nn = ['无', '无', '无']
    n = parseInt(n)
    if (typeof n !== 'number') return nn
    // if ([10, 22, 34, 46].indexOf(n) !== -1) nn = ['鼠', '水']
    // if ([9, 21, 33, 45].indexOf(n) !== -1) nn = ['牛', '土']
    // if ([8, 20, 32, 44].indexOf(n) !== -1) nn = ['虎', '木']
    // if ([7, 19, 31, 43].indexOf(n) !== -1) nn = ['兔', '木']
    // if ([6, 18, 30, 42].indexOf(n) !== -1) nn = ['龙', '土']
    // if ([5, 17, 29, 41].indexOf(n) !== -1) nn = ['蛇', '火']
    // if ([4, 16, 28, 40].indexOf(n) !== -1) nn = ['马', '火']
    // if ([3, 15, 27, 39].indexOf(n) !== -1) nn = ['羊', '土']
    // if ([2, 14, 26, 38].indexOf(n) !== -1) nn = ['猴', '金']
    // if ([1, 13, 25, 37, 49].indexOf(n) !== -1) nn = ['鸡', '金']
    // if ([12, 24, 36, 48].indexOf(n) !== -1) nn = ['狗', '土']
    // if ([11, 23, 35, 47].indexOf(n) !== -1) nn = ['猪', '水']
    let index = 0
    let indexString = [['鼠', '水']].concat([['牛', '土']]).concat([['虎', '木']]).concat([['兔', '木']]).concat([['龙', '土']]).concat([['蛇', '火']]).concat([['马', '火']]).concat([['羊', '土']]).concat([['猴', '金']]).concat([['鸡', '金']]).concat([['狗', '土']]).concat([['猪', '水']])
    if ([10, 22, 34, 46].indexOf(n) !== -1) index = 0
    if ([9, 21, 33, 45].indexOf(n) !== -1) index = 1
    if ([8, 20, 32, 44].indexOf(n) !== -1) index = 2
    if ([7, 19, 31, 43].indexOf(n) !== -1) index = 3
    if ([6, 18, 30, 42].indexOf(n) !== -1) index = 4
    if ([5, 17, 29, 41].indexOf(n) !== -1) index = 5
    if ([4, 16, 28, 40].indexOf(n) !== -1) index = 6
    if ([3, 15, 27, 39].indexOf(n) !== -1) index = 7
    if ([2, 14, 26, 38].indexOf(n) !== -1) index = 8
    if ([1, 13, 25, 37, 49].indexOf(n) !== -1) index = 9
    if ([12, 24, 36, 48].indexOf(n) !== -1) index = 10
    if ([11, 23, 35, 47].indexOf(n) !== -1) index = 11
    if (window.newDate().getTime() >= 1518710400000) {
      if (index < 12) {
        index++
        if (index === 12) index = 0
       }
    }
    nn = indexString[index]
    if ((n % 2) === 0) nn.push('双')
    else nn.push('单')
    return nn
}

let getNumberOfAnimal = (s) => {
    let a = []
    let index = -1
    if (typeof n !== 'string' && (index = '鼠牛虎兔龙蛇马羊猴鸡狗猪金木水火土'.indexOf(s)) === -1 ) return a
    // if (window.newDate().getTime() >= 1518710400000) {
    //   if (index < 12) {
    //     index--
    //     if (index === -1) index = 11
    //    }
    // }
    // if (index === 0 ) a = [10, 22, 34, 46]
    // if (index === 1 ) a = [9, 21, 33, 45]
    // if (index === 2 ) a = [8, 20, 32, 44]
    // if (index === 3 ) a = [7, 19, 31, 43]
    // if (index === 4 ) a = [6, 18, 30, 42]
    // if (index === 5 ) a = [5, 17, 29, 41]
    // if (index === 6 ) a = [4, 16, 28, 40]
    // if (index === 7 ) a = [3, 15, 27, 39]
    // if (index === 8 ) a = [2, 14, 26, 38]
    // if (index === 9 ) a = [1, 13, 25, 37, 49]
    // if (index === 10 ) a = [12, 24, 36, 48]
    // if (index === 11 ) a = [11, 23, 35, 47]

    if (index === 0 ) a = [12, 24, 36, 48]
    if (index === 1 ) a = [11, 23, 35, 47]
    if (index === 2 ) a = [10, 22, 34, 46]
    if (index === 3 ) a = [9, 21, 33, 45]
    if (index === 4 ) a = [8, 20, 32, 44]
    if (index === 5 ) a = [7, 19, 31, 43]
    if (index === 6 ) a = [6, 18, 30, 42]
    if (index === 7 ) a = [5, 17, 29, 41]
    if (index === 8 ) a = [4, 16, 28, 40]
    if (index === 9 ) a = [3, 15, 27, 39]
    if (index === 10 ) a = [2, 14, 26, 38] 
    if (index === 11 ) a = [1, 13, 25, 37, 49]
    


    // ...
    if (index === 12 ) return getNumberOfAnimal('猴').concat(getNumberOfAnimal('鸡'))
    if (index === 13 ) return getNumberOfAnimal('虎').concat(getNumberOfAnimal('兔'))
    if (index === 14 ) return getNumberOfAnimal('鼠').concat(getNumberOfAnimal('猪'))
    if (index === 15 ) return getNumberOfAnimal('蛇').concat(getNumberOfAnimal('马'))
    if (index === 16 ) return getNumberOfAnimal('牛').concat(getNumberOfAnimal('龙')).concat(getNumberOfAnimal('羊')).concat(getNumberOfAnimal('狗'))

    // if (index === 12 ) a = [2, 14, 26, 38, 1, 13, 25, 37, 49]
    // if (index === 13 ) a = [8, 20, 32, 44, 7, 19, 31, 43]
    // if (index === 14 ) a = [10, 22, 34, 46, 11, 23, 35, 47]
    // if (index === 15 ) a = [5, 17, 29, 41, 4, 16, 28, 40]
    // if (index === 16 ) a = [9, 21, 33, 45, 6, 18, 30, 42, 3, 15, 27, 39, 12, 24, 36, 48]
    return a.sort()
}

let codeClass = ',1:danger,2:danger,7:danger,8:danger,12:danger,13:danger,15:oblue,18:danger,19:danger,23:danger,24:danger,29:danger,30:danger,34:danger,35:danger,40:danger,45:danger,46:danger,3:oblue,4:oblue,9:oblue,10:oblue,14:oblue,20:oblue,25:oblue,26:oblue,31:oblue,36:oblue,37:oblue,41:oblue,42:oblue,47:oblue,48:oblue,5:green,6:green,11:green,16:green,17:green,21:green,22:green,27:green,28:green,32:green,33:green,38:green,39:green,43:green,44:green,49:green,'
let getColorOfNumber = (n) => {
    n = Math.min(parseInt(n), 49)
    n = Math.max(n, 1)
    return codeClass.match(new RegExp(',' + (n) + '' + ':\\w+', 'g'))[0].split(':')[1]
}
let getColorsOfNumberArray = (a, s) => {
  if (!(typeof a === 'object' && a[0])) return s
  return [a[0] + ':' + getColorOfNumber(a.shift())].concat(getColorsOfNumberArray(a, s || (a.length === 4 ? [] : ['-1:o0'])))
}

/**
 * [get a times array base on profit rate.]
 * @param  {[type]} m [min times]
 * @param  {[type]} r [rate]
 * @param  {[type]} l [length of array to return]
 * @return {[type]}   [description]
 */
let getTimesArray = (min, rate, len, capital, reward) => {
  console.info(min, rate, len, capital, reward);
  let temp = new Array(len).fill(0)
  let result = []
  temp.every((n, i) => {
    let T = result.reduce((a, b) => a + b, 0)
    let N = Math.ceil((T * capital + T * capital * rate) / (reward - capital - rate * capital))
    // console.log(N, (T * capital + T * capital * rate) / (reward - capital - rate * capital))
    if (reward - capital - rate * capital < 0) {
      return false
    } else {
      result[i] = Math.max(N, min)
      return true
    }
  })
  return result
}

let MMath = {
  add(a, b) {
    a = String(a);
    b = String(b);
    let c = 0, d = 0, m = 0;
    if (a.indexOf('.') != -1) {
        c = a.split('.')[1].length;
    }
    if (b.indexOf('.') != -1) {
        d = b.split('.')[1].length;
    }
    m = Math.pow(10, Math.max(c, d));
    return (MMath.mul(a, m) + MMath.mul(b, m)) / m;
  },
  sub(a, b) {
    a = String(a);
    b = String(b);
    let c = 0, d = 0, m = 0;
    if (a.indexOf('.') != -1) {
        c = a.split('.')[1].length;
    }
    if (b.indexOf('.') != -1) {
        d = b.split('.')[1].length;
    }
    m = Math.pow(10, Math.max(c, d));
    return (MMath.mul(a, m) - MMath.mul(b, m)) / m;
  },
  mul(a, b) {
    a = String(a);
    b = String(b);
    let c = 0;
    if (a.indexOf('.') != -1) {
        c += a.split('.')[1].length;
        a = a.replace('.', '');
    }
    if (b.indexOf('.') != -1) {
        c += b.split('.')[1].length;
        b = b.replace('.', '');
    }
    return (Number(a) * Number(b)) / Math.pow(10, c);
  },
  div(a, b) {
    a = String(a);
    b = String(b);
    let c = 0, d = 0;
    if (a.indexOf('.') != -1) {
        c = a.split('.')[1].length;
        a = a.replace('.', '');
    }
    if (b.indexOf('.') != -1) {
        d = b.split('.')[1].length;
        b = b.replace('.', '');
    }
    return MMath.mul(Number(a) / Number(b), Math.pow(10, d - c));
  }
}

// console.log(getTimesArray(1, 1.5, 15, 128, 1920), '???')
module.exports = {
  digitUppercase,
  numberWithCommas,
  getAnimalOfNumber,
  getNumberOfAnimal,
  getColorOfNumber,
  getColorsOfNumberArray,
  getTimesArray,
  MMath
}
