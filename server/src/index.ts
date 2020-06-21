import * as http from "http";
import app from "./app";
import models from "./models/index";

const NAME = `server`;
import Debug from "debug";
import { traffic2db } from "./components/helloworld/controller";
const debug = Debug(NAME);

const PORT = "6003";

let port =
  process.env.NODE_ENV == "test" ? 3003 : normalizePort(process.env.PORT);
let force = process.env.DB_DROP == "true" ? true : false;

app.set("port", port);

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = () => {
  let addr = server.address();
  if (addr) {
    let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    debug("[I] Listening on " + bind);
  }

  const dbinit = async () => {
    try {
      /** 测试连接 */
      await models.sequelize.authenticate();
      console.log(`[I] db connected successfully.`);
      let sync = process.env.SYNC;
      let force = process.env.FORCE;
      let reset = process.env.RESET;
      console.log("尝试创建模型：", sync ? "是" : "否");
      console.log("强制删除重建：", force ? "是" : "否");
      console.log("重置管理员：", reset ? "是" : "否");

      /** 是否更新模型和删除重建 并且调用数据库补丁 */
      sync ? await models.sequelize.sync({ force: !!force }) : null;

      console.log("[I] [dbinit] ok.");

      // /** 后台任务 */
      // const tasks = async () => {
      //   /** 由于脚本执行需要3秒 所以不会死循环 */
      //   while (true) {
      //     await traffic2db();
      //   }
      // };

      // /** 调用后台任务 并不需要等待结束回调 */
      // tasks();
    } catch (error) {
      console.log(`[E] [dbinit]`, error);
    }
  };

  dbinit().then();
};

const server = http.createServer(app);
debug("sync with force:", force);
server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
console.log(`[I] [index] server running on "http://localhost:${port}"`);

/**
 * 格式化端口
 * @param val 环境变量
 */
function normalizePort(val: string = PORT) {
  let t = parseInt(val);
  let defaultPort = parseInt(PORT);
  if (isNaN(t)) {
    /* 端口错误 */
    debug("端口错误：val ", val);
    return defaultPort;
  } else if (!(t > 0 && t < 65535)) {
    /* 超出范围 */
    debug("端口超出范围：val ", val);
    return defaultPort;
  } else {
    return t;
  }
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}
