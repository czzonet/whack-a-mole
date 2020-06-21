/** name */
export const NAME = "helloworld";
export const MODEL = "traffic";
/** debug */
import Debug from "debug";
export const debug = Debug(NAME);
/** models */
export { default as models } from "../../models";
/** router */
import * as express from "express";
export const router = express.Router();
