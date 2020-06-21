import { DataTypes, Model } from "sequelize"
import sequelize from '../../../db/index'

class mylog extends Model { }

mylog.init(
  {
    a: DataTypes.TEXT,
  },
  { sequelize }
)

export default mylog
