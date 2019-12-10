export default (arr, len, o) => {
  let a = arr.map((e, i) => {
    return i % len === 0 ? arr.slice(i, i + len) : null
  }).filter(e => e)

  if (a[0]) {
    if (a[ a.length - 1 ].length < len) a[ a.length - 1 ] = a[ a.length - 1 ].concat(Array(len - a[ a.length - 1 ].length).fill(o))
  }
  return a
}

