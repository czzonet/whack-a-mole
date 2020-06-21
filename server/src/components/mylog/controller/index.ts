/** express */
import * as express from 'express'
/** define */
import { debug, models, MODEL } from "../define";
import * as moment from 'moment'
import { queryRaw } from '../../../utils/rawquerypure';


export const total: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here

  } catch (error) {
    next(error)
  }
};


export const add: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here

  } catch (error) {
    next(error)
  }
};


export const change: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here

  } catch (error) {
    next(error)
  }
};



export const remove: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here

  } catch (error) {
    next(error)
  }
};

/**
 * 下拉补全 最大条数20个
 */
export const suggest: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here

  } catch (error) {
    next(error)
  }
};

export const rawquery: express.RequestHandler = async (req, res, next) => {
  const DATASQL = "../../../../sql/itemc/totalpagem/query.sql"
  const COUNTSQL = "../../../../sql/itemc/totalpagem/count.sql"
  debug(`body: %O`, req.body);

  try {
    // Add logic here
    let { page, limit, } = req.body;

    /** 条件 */
    let rawReplacements = {} as any
    page = typeof page === "number" ? page : 1
    limit = typeof limit === 'number' ? limit : 5
    rawReplacements.offset = (page - 1) * limit
    rawReplacements.limit = limit

    /** rawquery */
    let rawData = await queryRaw(__dirname, DATASQL, rawReplacements) as any[]
    let rawCount = await queryRaw(__dirname, COUNTSQL, rawReplacements) as any[]

    /** 符合条件的r.id列表 */
    let ids = rawData.map(d => d.id) as number[];
    /** 重载完整模型 */
    let v = await reloadModels(ids);
    let c = parseInt(rawCount[0].count)

    debug("c: %O", c);
    res.json({ v, c });
  } catch (error) {
    next(error)
  }
};

const reloadModels = async (ids: number[]) => {
  debug('[I] [reloadModels] [ids]: ', ids)

  return ids.length === 0
    ? []
    : await models[MODEL].findAll({
      where: {
        id: {
          [models.Op.in]: ids
        }
      },
      order: [["id", "desc"]],
      include: [
        {
          model: models["Itemj"]
        },
        {
          model: models["pagef"]
        },
        {
          model: models["Itemd"],
          include: [
            {
              model: models["Itemb"]
            },
            {
              /** 采购入库 */
              model: models["Itemo"]
            },
            {
              model: models["pagem"],

            }
          ]
        }
      ]
    });
}