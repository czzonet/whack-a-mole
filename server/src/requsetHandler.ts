/** express */
import * as express from 'express'
/** models */
import models from "./models";
/** debug */
import Debug from "debug";
/** saferead */
import { saferead } from './utils/saferead'
/** mylog */
import mylog from './components/mylog/model'
/** define */
const NAME = 'requestHandler'
const MODEL = "Itemn";
const debug = Debug(NAME)

export const ensureAuthenticated: express.RequestHandler = async (req, res, next) => {
  debug('headers: ', req.headers)

  try {
    let token = saferead(() => req.headers['x-token'])
    let condition = {
      [models.Op.and]: {
        token: {
          [models.Op.eq]: token,
        },
        valid: {
          [models.Op.eq]: true,
        }
      }
    };
    let v = await models[MODEL].findOne({
      where: condition,
    })
    let valid = !!v
    debug('vaild: ', valid)
    valid ? next() : (console.log('[I] [auth]: ', valid), res.json({ code: 50008 }))

  } catch (error) {
    console.log('[E] [ensureAuthenticated]: ', error);
    res.json({ code: 50008 })
  }
}


/**
 * catch 404 and forward to error handler  
 */
export const notFond: express.RequestHandler = (req, res, next) => {
  /* 传递一个http error */
  next({ status: 404 });
}

/**
 * 打印错误  
 */
export const logErrors: express.ErrorRequestHandler = async (err, req, res, next) => {
  debug(err)
  console.log('[E] ', err);
  try {
    await mylog.sync()
    let newdata = { a: err.toString() }
    let v = await mylog.create(newdata)
    debug('[logErrors]:%O', JSON.parse(JSON.stringify(v)))
  } catch (error) {
    console.log('[E] [mylog]:', error);
  }
  next(err)
}

/**
 * error handler
 */
export const errorHandler: express.ErrorRequestHandler = function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  let code = err.status || 500
  res.status(code).send(`Error Code: ${code}`);
}
