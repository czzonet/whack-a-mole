import { execfile } from "../../lib/execfile";
import * as path from "path";
import * as Debug from "debug";
import * as moment from "moment";
import { writefile } from "../../lib/asyncfile";
/** define */
const NAME = "networkTraffic";
const debug = Debug(NAME);
const NETWORK_TRAFFIC_SHELL = path.resolve(
  __dirname,
  "../../../source/sh/network-traffic.sh"
);
export const trafficFormated = async () => {
  let raw = await getTrafficFromShell(NETWORK_TRAFFIC_SHELL);
  let formated = await formatTrafficData(raw);

  return formated;
};

export const logTraffic = async (logFilePath: string) => {
  await writeTrafficDataToFile(logFilePath, await trafficFormated());
};

/** 获取脚本数据 */
const getTrafficFromShell = async (shellPath: string) => {
  let res = await execfile(shellPath);

  return res.stdout;
};

/** 格式化脚本数据 */
const formatTrafficData = async (stdout: string) => {
  let dataWrite =
    moment().toISOString() + "|" + getTraffic(getLastLine(stdout)) + "\n";

  return dataWrite;
};

/** 追加数据到文件 */
const writeTrafficDataToFile = async (filePath: string, buffer: string) => {
  await writefile(filePath, buffer, true);
};

/** 格式化 */

/** 格式化获取最后第二行 */
const getLastLine = (source: string): string => {
  let lines = source.split("\n");

  // debug('[I] [getLastLine]', lines)

  let t = lines.length ? lines[lines.length - 1 - 1] : "";

  debug("[I] [getLastLine]");
  // debug('[I] [getLastLine] t', t)

  return t;
};

/** 格式化获取接口、接收和发送速率 */
const getTraffic = (source: string): string => {
  /** 分离单词 */
  let lines = source.split(/\s+/);

  // debug('[I] [getTraffic]', lines)

  let t = lines.length ? lines[4] + "|" + lines[5] : "";

  debug("[I] [getTraffic] t:", t);

  return t;
};
