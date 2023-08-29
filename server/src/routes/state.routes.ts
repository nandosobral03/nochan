import { Elysia, t } from "elysia";
import { getAllElements, getAppHash } from "../services/state.service";
const router = new Elysia()

router.get("/hash", () => getAppHash())
router.get("/all", () => getAllElements())

export default router;