/** models */
import models from "../models";
/** debug */
import Debug from "debug";
/** fs,path */
import { readFileSync } from "fs";
import { resolve } from "path";
/** define */
const NAME = "rawquery";
const debug = Debug(NAME);

export const queryRaw = async (dir: string, relativepath: string, replacements: any, ): Promise<any> => {
  try {
    debug('replace:', replacements)
    /** sql */
    let text = readFileSync(resolve(dir, relativepath), "utf-8");
    /** 优先自定义替换 */
    let sql = rawReplace(text, replacements)
    /** 查询原始结果 */
    let raw = await models.sequelize.query(sql, { type: models.QueryTypes.SELECT, }) as any;
    debug("raw: ", raw);

    return raw;
  } catch (error) {
    console.log("[E] [queryRaw]", error);
    return;
  }
};

/**
 * 自定义sql语句的替换  用自定义标记:包围标识符并用对象的对应属性替换
 * 会覆盖sequelize的原始替换
 */
const rawReplace = (s: string, replacements: any) => {
  /** 匹配包含的标识符 用来对应替换 */
  let re = /:(\w*)/g
  let t = s.replace(re, (m) => {
    debug('[match]: ', m);
    /** 匹配后去除包围 */
    let key = m.slice(1)
    /** 取对应属性的替换 没有也清空 */
    if (Object.keys(replacements).indexOf(key) + 1) {
      debug('[replace] successfully');
      return replacements[key]
    } else {
      debug('[remove] default');
      return ''
    }
  })

  return t
}
