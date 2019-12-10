module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    "indent": 0,//缩进风格 
    'no-multi-spaces': 0,//规则旨在禁止在逻辑表达式，条件表达式，声明，数组元素，对象属性，序列和函数参数周围使用多个空格。
    'no-mixed-spaces-and-tabs': 0,//禁止混用tab和空格
    "camelcase": 0,// 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，
    "accessor-pairs": 0, // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格
    "spaced-comment": 0,//注释风格不要有空格什么的
    "no-unused-vars": 0,//不能有声明后未被使用的变量或参数
    'space-before-function-paren': 0,//函数定义时括号前面要不要有空格
    'quotes': 0,//引号类型 `` "" ''
    'semi': 0,//语句强制分号结尾
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
