import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { StatsControllers } from "./stats.controller";

const router = express.Router();

router.get(
    "/booking",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsControllers.getBookingStats
);
router.get(
    "/payment",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsControllers.getPaymentStats
);
router.get(
    "/user",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsControllers.getUserStats
);
router.get(
    "/tour",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    StatsControllers.getTourStats
);

export const StatsRoutes = router;