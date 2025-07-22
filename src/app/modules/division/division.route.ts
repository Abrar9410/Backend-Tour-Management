import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateMutationRequest } from "../../middlewares/validateMutationRequest";
import { Role } from "../user/user.interface";
import { DivisionController } from "./division.controller";
import {
    createDivisionSchema,
    updateDivisionSchema,
} from "./division.validation";

const router = Router()

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateMutationRequest(createDivisionSchema),
    DivisionController.createDivision
);
router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    validateMutationRequest(updateDivisionSchema),
    DivisionController.updateDivision
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionController.deleteDivision);

export const DivisionRoutes = router;