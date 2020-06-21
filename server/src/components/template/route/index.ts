/** define */
import { router } from "../define";
import { total, add, change, remove, suggest } from "../controller";

router.post("/add", add);
router.post("/change", change);
router.post("/total", total);
router.post("/remove", remove);
router.post("/suggest", suggest);

export default router
