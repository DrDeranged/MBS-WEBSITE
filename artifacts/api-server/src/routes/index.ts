import { Router, type IRouter } from "express";
import healthRouter from "./health";
import assistRouter from "./assist";

const router: IRouter = Router();

router.use(healthRouter);
router.use(assistRouter);

export default router;
