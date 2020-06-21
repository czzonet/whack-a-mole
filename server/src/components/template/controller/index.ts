/** express */
import * as express from "express";
/** define */
import { debug, models, MODEL } from "../define";
import * as moment from "moment";
import { queryRaw } from "../../../utils/rawquerypure";
import { excelHelper } from "../../../utils/excelHelper";
import { saferead } from "../../../utils/saferead";

export const total: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here
    res.json({
      code: 200,
      message: "ok",
    });
  } catch (error) {
    next(error);
  }
};

export const add: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here
  } catch (error) {
    next(error);
  }
};

export const change: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here
  } catch (error) {
    next(error);
  }
};

export const remove: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here
  } catch (error) {
    next(error);
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
    next(error);
  }
};

export const rawquery: express.RequestHandler = async (req, res, next) => {
  const DATASQL = "../../../../sql/itemc/totalpagem/query.sql";
  const COUNTSQL = "../../../../sql/itemc/totalpagem/count.sql";
  debug(`body: %O`, req.body);

  try {
    // Add logic here
    let { page, limit } = req.body;

    /** 条件 */
    let rawReplacements = {} as any;
    page = typeof page === "number" ? page : 1;
    limit = typeof limit === "number" ? limit : 5;
    rawReplacements.offset = (page - 1) * limit;
    rawReplacements.limit = limit;

    /** rawquery */
    let rawData = (await queryRaw(
      __dirname,
      DATASQL,
      rawReplacements
    )) as any[];
    let rawCount = (await queryRaw(
      __dirname,
      COUNTSQL,
      rawReplacements
    )) as any[];

    /** 符合条件的r.id列表 */
    let ids = rawData.map((d) => d.id) as number[];
    /** 重载完整模型 */
    let v = await reloadModels(ids);
    /** 恢复顺序 */
    let vOrdered = ids.map((id) => v.find((val) => val.id == id));
    let c = parseInt(rawCount[0].count);

    debug("c: %O", c);
    res.json({ v: vOrdered, c });
  } catch (error) {
    next(error);
  }
};

const reloadModels = async (ids: number[]) => {
  debug("[I] [reloadModels] [ids]: ", ids);

  return ids.length === 0
    ? []
    : await models[MODEL].findAll({
        where: {
          id: {
            [models.Op.in]: ids,
          },
        },
        include: [
          {
            model: models["Itemj"],
          },
          {
            model: models["pagef"],
          },
          {
            model: models["Itemd"],
            include: [
              {
                model: models["Itemb"],
              },
              {
                /** 采购入库 */
                model: models["Itemo"],
              },
              {
                model: models["pagem"],
              },
            ],
          },
        ],
      });
};

export const exportexcel: express.RequestHandler = async (req, res, next) => {
  debug(`body: %O`, req.body);

  try {
    // Add logic here
    let { id } = req.body;
    /** stockpricepagen 获取报表条件 */
    let stockpricepagen = await models[MODEL].findOne({
      where: {
        id,
      },
    });
    /** 子条目 内容 */
    let stockpricepagenId = id;
    let whereClause: any = {};
    typeof stockpricepagenId === "number"
      ? (whereClause.stockpricepagenId = { [models.Op.eq]: stockpricepagenId })
      : null;
    /** sql */
    let v = (await models["stockpricepagencontent"].findAll({
      where: whereClause,
      include: [
        {
          model: models["pagen"],
        },
      ],
      order: [["id", "asc"]],
    })) as any[];
    /** 转化格式输出 */
    type Output = {
      pagen_a: string;
      pagen_b: string;
      // pagen_itema_a: string
      unit: string;

      amount_beginning: number;
      price_beginning: number;
      amount_in: number;
      price_in: number;
      amount_out: number;
      price_out: number;
      amount_ending: number;
      price_ending: number;
      perprice: number;
    };
    const roundNumber = (s: number) => {
      return parseFloat((saferead(() => s) || 0).toFixed(3));
    };

    let dataOutput: Output[] = v.map((d) => {
      let perprice = saferead(() => d.pagen.d)
        ? saferead(() => d.pagen.d)
        : d.g;
      return {
        pagen_a: saferead(() => d.pagen.a),
        pagen_b: saferead(() => d.pagen.b),
        // pagen_itema_a: saferead(() => d.pagen.Itema.a),
        unit: "kg",

        amount_beginning: roundNumber(d.a + d.b),
        price_beginning: roundNumber((d.a + d.b) * perprice),
        amount_in: roundNumber(d.c + d.d),
        price_in: roundNumber((d.c + d.d) * perprice),
        amount_out: roundNumber(-(d.e + d.f)),
        price_out: roundNumber(-(d.e + d.f) * perprice),
        amount_ending: roundNumber(d.a + d.b + d.c + d.d + d.e + d.f),
        price_ending: roundNumber(
          (d.a + d.b + d.c + d.d + d.e + d.f) * perprice
        ),
        perprice,
      } as Output;
    });
    let pl = {
      title: {
        /** 有日期条件再初始化时间 */
        datestart: stockpricepagen.a
          ? moment(stockpricepagen.a).format("YYYY/MM/DD")
          : stockpricepagen.a,
        dateend: stockpricepagen.b
          ? moment(stockpricepagen.b).format("YYYY/MM/DD")
          : stockpricepagen.b,
      },
      body: dataOutput,
    };
    // let c = await models[model].count({ where: whereClause });
    let name = await excelHelper(
      pl,
      __dirname,
      "../../../../source/货品库存余额报表.xlsx"
    );
    // debug("v: %O", JSON.parse(JSON.stringify(v)));
    // debug("c: %O", c);
    debug("name: ", name);
    res.json({ v: name });
  } catch (error) {
    next(error);
  }
};
