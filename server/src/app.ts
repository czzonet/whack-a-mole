/** express */
import * as express from "express";
/** morgan log */
import * as morgan from "morgan";
/** fs */
import * as fs from "fs";
import * as path from "path";
/** cookie */
import * as cookieParser from "cookie-parser";
/** login */
// import loginRouter from './components/login/route'
/** api */
import apiRouter from "./routers/api";
/** handler */
import { notFond, logErrors, errorHandler } from "./requsetHandler";
/** compression */
import * as compression from "compression";

const app = express();

/* 一些用到的中间件 */
app.use(morgan("short"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());

/**
 * 静态资源路由 存储图片等 不会被git追踪或受代码部署影响
 * 注意先新建文件夹路径
 */
/* 输出路径 在项目外 */
let publicPath = path.resolve(__dirname, "../../public");
/* 不存在就新建文件夹 */
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

/** 前端公共文件 */
let frontPath = path.resolve(__dirname, "../../dist");
/* 不存在就新建文件夹 */
if (!fs.existsSync(frontPath)) {
  fs.mkdirSync(frontPath);
}

/** 前端入口 */
app.use("/", express.static(frontPath));

/** 公共资源 */
app.use("/api/public", express.static(publicPath));

/* 登陆入口 */
// app.use('/api/login', loginRouter);

/** 权限守护 */
app.use("/api", apiRouter);

/** 未匹配路由 */
app.use(notFond);

/** 错误守护 */
app.use(logErrors);
app.use(errorHandler);

export default app;
