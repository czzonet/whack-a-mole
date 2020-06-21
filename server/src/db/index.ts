import { Sequelize, } from 'sequelize';

import * as fs from 'fs'
import * as path from 'path'

const connectDB = () => {
  const env = process.env.NODE_ENV || 'production';

  const configPath = path.resolve(__dirname, '../../env_config.json')
  let configstr = fs.readFileSync(configPath, { encoding: 'utf8' })
  let config = JSON.parse(configstr)[env]

  /** 建立连接 */
  let sequelize = new Sequelize(config.database, config.username, config.password, config);

  return sequelize
}

const sequelize = connectDB()

export default sequelize
