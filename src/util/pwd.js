/**
 * @desc 密码强弱评分
 * 
 * @param {String} pwd 密码
 */
function checkPwdScore (pwd) {
  pwd = String(pwd)
  if (!pwd) return 0

  let len = pwd.length
  let totalScore = 0
  let upperCaseLen = 0
  let lowerCaseLen = 0
  let nums = 0
  let signLen = 0
  let lowestCondiCount = 0

  // 加分规则一：密码长度, +(n*4)
  totalScore += len * 4

  // 加分规则二：大写字母, +((len-n)*2)
  upperCaseLen =  (pwd.match(/[A-Z]/g) || []).length
  totalScore += upperCaseLen * 2

  // 加分规则三：小写字母, +((len-n)*2)
  lowerCaseLen = (pwd.match(/[a-z]/g) || []).length
  totalScore += lowerCaseLen * 2

  // 加分规则四：数字, +(n*4)
  nums = (pwd.match(/\d/g) || []).length
  if (nums < len) {
    totalScore += nums * 4
  }

  // 加分规则五：符号, +(n*6)
  signLen = (pwd.match(/[~\!@#\$%\^&\*\(\)\-_=\+]/g) || []).length
  totalScore += signLen * 6

  // 加分规则六：位于中间的数字或符号
  if (len > 2 && (!/^\d.+$/g.test(pwd) && !/^.+\d$/g.test(pwd))) {
    let midStr = pwd.substring(1, len - 1)
    let numAndSignLen = (midStr.match(/[\d~\!@#\$%\^&\*\(\)\-_=\+]/g) || []).length
    totalScore += numAndSignLen * 2
  }

  // 最低条件得分, +(n*2)
  // 包含大写字母
  if (upperCaseLen > 0) {
    lowestCondiCount++
  }
  // 包含小写字母
  if (lowerCaseLen > 0) {
    lowestCondiCount++
  }
  // 包含数字
  if (nums > 0) {
    lowestCondiCount++
  }
  // 包含符号
  if (signLen > 0) {
    lowestCondiCount++
  }

  // 加分规则七：最低条件要求满足条目1并至少满足条目2-5中的任意三条
  if (len >= 8 && lowestCondiCount >= 3) {
    lowestCondiCount++
    totalScore += lowestCondiCount * 2
  }

  // 减分规则一: 只有字母,-n
  if (/^[a-zA-Z]+$/gi.test(pwd)) {
    totalScore -= len
  }

  // 减分规则二: 只有数字,-n
  if (/^\d+$/gi.test(pwd)) {
    totalScore -= len
  }

  // 减分规则三: 重复字符数（大小写敏感）
  totalScore -= calcRepeatScore(pwd)

  // 减分规则四: 连续大写字母, -(n*2)
  let upperCaseSeries = pwd.match(/[A-Z]+/g)
  if (upperCaseSeries) {
    upperCaseSeries.forEach(function(s) {
      if (s.length > 2) {
        totalScore -= (s.length - 1) * 2
      }
    })
  }

  // 减分规则五: 连续小写字母, -(n*2)
  let lowerCaseSeries = pwd.match(/[a-z]+/g)
  if (lowerCaseSeries) {
    lowerCaseSeries.forEach(function(s) {
      if (s.length > 2) {
        totalScore -= (s.length - 1) * 2
      }
    })
  }

  // 减分规则六: 连续数字, -(n*2)
  let numRepeat = pwd.match(/\d+/g)
  if (numRepeat) {
    numRepeat.forEach(function(s) {
      if (s.length > 2) {
        totalScore -= (s.length - 1) * 2
      }
    })
  }

  // 减分规则七: 正序或逆序字母, -(n*3)
  let alphabetSeries = pwd.match(/((?:a(?=b)|b(?=c)|c(?=d)|d(?=e)|e(?=f)|f(?=g)|g(?=h)|h(?=i)|i(?=j)|j(?=k)|k(?=l)|l(?=m)|m(?=n)|n(?=o)|o(?=p)|p(?=q)|q(?=r)|r(?=s)|s(?=t)|t(?=u)|u(?=v)|v(?=w)|w(?=x)|x(?=y)|y(?=z)){2,}\w)/gi);
  let alphabetSeriesReverse = pwd.match(/((?:z(?=y)|y(?=x)|x(?=w)|w(?=v)|v(?=u)|u(?=t)|t(?=s)|s(?=r)|r(?=q)|q(?=p)|p(?=o)|o(?=n)|n(?=m)|m(?=l)|l(?=k)|k(?=j)|j(?=i)|i(?=h)|h(?=g)|g(?=f)|f(?=e)|e(?=d)|d(?=c)|c(?=b)|b(?=a)){2,}\w)/gi);
  // 正序
  if (alphabetSeries) {
    alphabetSeries.forEach(function(s) {
      // 连续3个才扣分
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3 // 例1：如输入ABC，则n=1，例2：如输入dcBA，则n=2
      }
    })
  }
  // 逆序
  if (alphabetSeriesReverse) {
    alphabetSeriesReverse.forEach(function(s) {
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3 // 例1：如输入ABC，则n=1，例2：如输入dcBA，则n=2
      }
    })
  }

  // 减分规则八: 正序或逆序数字, -(n*3)
  let numSeries = pwd.match(/((?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)|9(?=0)){2,}\d)/g)
  let numSeriesReverse = pwd.match(/((?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){2,}\d)/g)
  // 正序
  if (numSeries) {
    numSeries.forEach(function(s) {
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3
      }
    })
  }
  // 逆序
  if (numSeriesReverse) {
    numSeriesReverse.forEach(function(s) {
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3
      }
    })
  }

  // 减分规则九: 正序或逆序符号(~!@#$%^&*()-_=+), -(n*3)
  let signSeries = pwd.match(/((?:~(?=!)|!(?=@)|@(?=#)|#(?=$)|$(?=%)|%(?=\^)|\^(?=&)|&(?=\*)|\*(?=\()|\((?=\))|\)(?=-)|-(?=_)|_(?==)|=(?=\+)){2,}.)/g)
  let signSeriesReverse = pwd.match(/((?:\+(?==)|=(?=_)|_(?=-)|-(?=\))|\)(?=\()|\((?=\*)|\*(?=&)|&(?=\^)|\^(?=%)|%(?=$)|$(?=#)|#(?=@)|@(?=!)|!(?=~)){2,}.)/g)
  // 正序
  if (signSeries) {
    signSeries.forEach(function(s) {
      // 只有连续3个符号或以上
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3
      }
    })
  }
  // 逆序
  if (signSeriesReverse) {
    signSeriesReverse.forEach(function(s) {
      if (s.length >= 3) {
        totalScore -= (s.length - 2) * 3
      }
    })
  }

  return totalScore
}

function calcRepeatScore (pass) {
  let repChar = 0
  let repCharBonus = 0  //得分
  let len = pass.length
  for(let i = 0; i < len; i++) {
    let exists = false
    for (let j = 0; j < len; j++) {
      if (pass[i] === pass[j] && i !== j) {
        exists = true
        repCharBonus += Math.abs(len / (j - i))
      }
    }
    if (exists) {
      repChar++
      let unqChar = len - repChar
      repCharBonus = (unqChar) ? Math.ceil(repCharBonus / unqChar) : Math.ceil(repCharBonus)
    }
  }
  return repCharBonus
}

/**
 * 获取密码强度级别
 * 4 : 非常安全
 * 3 : 安全
 * 2 : 一般
 * 1 : 弱
 * @param {String} pwd 
 */
function getPwdSafeLevel (pwd) {
  let score = checkPwdScore(pwd)
  let level = 1
  if (score >= 80) {
    level = 4
  } else if (score >= 60) {
    level = 3
  } else if (score >= 40) {
    level = 2
  } else {
    level = 1
  }
  return level
}

export {
  checkPwdScore,
  getPwdSafeLevel
}