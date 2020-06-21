/** components */
import template from "../components/template/route";
import helloworld from "../components/helloworld/route";

// router
import * as express from "express";
const router = express.Router();

router.use("/template", template);
router.use("/helloworld", helloworld);

export default router;
