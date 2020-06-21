import { Sequelize, Model, QueryTypes, DataTypes, BuildOptions, Op } from 'sequelize';

import * as fs from 'fs'
import * as path from 'path'

const env = process.env.NODE_ENV || 'production';
const basename = path.basename(__filename);

const configPath = path.resolve(__dirname, '../../env_config.json')
let configstr = fs.readFileSync(configPath, { encoding: 'utf8' })
let config = JSON.parse(configstr)[env]

let sequelize: Sequelize;
sequelize = new Sequelize(config.database, config.username, config.password, config);

let db = {
  sequelize, Sequelize, DataTypes, QueryTypes, Op
}

const addModel = () => {
  try {
    fs
      .readdirSync(__dirname)
      .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
      })
      .forEach(file => {
        const model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
      });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      }
    });
  } catch (error) {
    console.log('[E] [models index]', error);
  }
}

addModel()

export default db
