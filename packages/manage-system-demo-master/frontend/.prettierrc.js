module.exports = {
  printWidth: 100, // 每行最多显示100个字符
  tabWidth: 2, // 缩进2个字符
  semi: true, // 是否加分号
  vueIndentScriptAndStyle: true, // 缩进Vue文件中的脚本和样式标签
  singleQuote: true, // js中使用单引号
  quoteProps: "as-needed", // 仅在需要时在对象属性周围添加引号
  bracketSpacing: true, // 花括号空格
  trailingComma: "es5", // none - 无尾逗号 es5 - 添加es5中被支持的尾逗号 all - 所有可能的地方都被添加尾逗号
  jsxBracketSameLine: false, // 使html 标签的末尾> 单独一行
  jsxSingleQuote: false, // JSX中使用双引号
  arrowParens: "always", // 为单行箭头函数的参数添加圆括号 (x) => x
  insertPragma: false, // 不在顶部插入 @format
  proseWrap: "never",
  htmlWhitespaceSensitivity: "strict", // html中空格被认为是敏感的
  endOfLine: "auto", // 保持现有的行尾
  rangeStart: 0,
};
