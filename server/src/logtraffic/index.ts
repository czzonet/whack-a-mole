import * as path from 'path'
import { existsfile, readfile, writefile } from '../lib/asyncfile';
import * as Debug from 'debug'
import { logTraffic } from './components/networkTraffic';
/** define */
const NAME = 'index'
const debug = Debug(NAME)


console.log('Welcome!');



const main = async () => {
  const outFilePath = path.resolve(__dirname, '../target/network-traffic-log.txt')

  try {
    for (let index = 0; index < 5; index++) {
      await logTraffic(outFilePath)
    }

    let isExist = await existsfile(outFilePath)
    if (isExist) {
      let fileContent = await readfile(outFilePath)
      console.log('[I] fileContent: \n', fileContent);
    } else {
      console.log('File is not exist.');
    }
  } catch (error) {
    console.log('[E]', error);
  }
}

main().then(() => {
  debugger
})

