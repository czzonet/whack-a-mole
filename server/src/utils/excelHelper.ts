import * as ejsexcel from 'ejsexcel'
import * as util from 'util'
import * as fs from 'fs'
import * as path from 'path'
/** file */
const readFilleAsync = util.promisify(fs.readFile)
const writeFilleAsync = util.promisify(fs.writeFile)

/**
 * 把导出数据源输出到excel表格
 */
export async function excelHelper(s: any, dir: string, relativepath: string) {
  try {
    /* 载入template */
    let templateBuf = await readFilleAsync(path.resolve(dir, relativepath))
    /* 生成渲染模板数据块 */
    let exportBuf = await ejsexcel.renderExcel(templateBuf, s)
    /* 时间戳 */
    let timeSuffix = Date.now()
    /* 输出文件名，由前缀+时间戳组成 */
    let outputName = `output-${timeSuffix}.xlsx`
    /* 输出路径 */
    let outputPath = path.resolve(__dirname, `../../../public/`)
    /* 不存在就新建文件夹 */
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath)
    }
    /* 组合输出全名 */
    let outputFullPath = path.resolve(outputPath, outputName)
    /* 把渲染数据块写入输出文件 */
    await writeFilleAsync(outputFullPath, exportBuf)
    console.log(`[I] [excelHelper]: excel export at %s:`, outputName);

    return outputName
  } catch (error) {
    console.log('[E] [excelHelper]: ', error);
    return ''
  }
}
