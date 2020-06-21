const NAME = `saferead`
// debug
import Debug from "debug";
import moment = require("moment");
const debug = Debug(NAME);
/**
 * 链式读取属性不会undefinded报错  
 * 原理：传函数 并捕获错误即可 还可以传错误默认返回值
 */
export const saferead = (fn: () => any, errorDefault?: any) => {
  try {
    return fn()
  } catch (error) {
    debug('[I] %o at %O', error.toString(), fn ? fn.toString() : '');
    return errorDefault
  }
}

/**
 * 安全读取日期
 */
export const safereaddate = (payload: any) => {
  try {
    let s = saferead(payload)
    return s ? moment(s).locale('zh-cn').format('YYYY-MM-DD') : ''
  } catch (error) {
    console.log('[I] [safereaddate]', error);
    return ''
  }
}

/**
 * 安全读取数字 两位小数
 */
export const safereadnumber = (payload: any) => {
  try {
    let s = saferead(payload)
    return s
      ? typeof s === "number"
        ? s.toFixed(2)
        : s
      : ''
  } catch (error) {
    console.log('[I] [safereadnumber]', error);
    return ''
  }
}