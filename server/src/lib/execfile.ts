/** lib */
import { execFile } from "child_process";
import * as util from "util";
import * as DEBUG from 'debug'
const NAME = 'execfile'
const debug = DEBUG(NAME)

/** 异步化 */
const exexFilePromisify = util.promisify(execFile);

/**
 * 执行文件 
 * 
 * 默认文件路径作为工作目录 
 * 
 * @param fullPath 绝对路径
 */
export const execfile = async (fullPath: string, cwd?: string) => {
  debug('called.')
  if (!cwd) {
    /** 提取文件路径作为工作目录 不传cwd会使用程序运行路径 */
    let pathArray = fullPath.split('/')
    pathArray.splice(-1, 1)
    cwd = pathArray.join('/')
  }
  return exexFilePromisify(fullPath, { cwd });
};
