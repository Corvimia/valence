import * as express from "express";
import * as asyncHandler from "express-async-handler";
import controller from "./controller";

const router = express.Router();

router.get("/", asyncHandler(controller.list));
router.post("/", asyncHandler(controller.create));
router.put("/:characterId", asyncHandler(controller.replace));
router.delete("/:characterId", asyncHandler(controller.remove));

export default router;
