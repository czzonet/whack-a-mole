/** lib */
import { copyFile, unlink, exists, readFile, writeFile } from 'fs'
import * as util from "util";
import * as Debug from 'debug'
/** define */
const NAME = 'asyncfile'
const debug = Debug(NAME)

export const writefile = async (disFullPath: string, data: any, append?: boolean) => {
  try {
    await util.promisify(writeFile)(disFullPath, data, {
      encoding: 'utf8',
      flag: append ? 'a' : undefined
    })
    debug('[I] [writefile]')
  } catch (error) {
    console.log('[E] [writefile] error', error);
  }
}

export const readfile = async (disFullPath: string) => {
  try {
    let res = await util.promisify(readFile)(disFullPath, { encoding: 'utf8' })
    debug('[I] [readfile] ')
    // debug('[I] [readfile] ', res)

    return res
  } catch (error) {
    console.log('[E] [readfile] error', error);
  }
}

export const copyfile = async (srcFullPath: string, disFullPath: string) => {
  try {
    await util.promisify(copyFile)(srcFullPath, disFullPath)
    debug('[I] [copyfile]')
  } catch (error) {
    console.log('[E] [copyfile] error', error);
  }
}

export const deletefile = async (disFullPath: string) => {
  try {
    await existsfile(disFullPath)
      ? util.promisify(unlink)(disFullPath)
      : console.log('[E] [deletefile] file not exist.');
    debug('[I] [deletefile]')
  } catch (error) {
    console.log('[E] [deletefile] error', error);
  }
}

export const existsfile = async (disFullPath: string) => {
  try {
    let t = await util.promisify(exists)(disFullPath)
    debug('[I] [existsfile]', t)
    return t
  } catch (error) {
    console.log('[E] [existsfile] error', error);
    return false
  }
}
