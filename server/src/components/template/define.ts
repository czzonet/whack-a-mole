/** name */
export const NAME = 'template'
export const MODEL = 'template'
/** debug */
import Debug from 'debug'
export const debug = Debug(NAME)
/** models */
export { default as models } from "../../models";
/** router */
import * as express from "express";
export const router = express.Router();
