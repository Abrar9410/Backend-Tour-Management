import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateMutationRequest } from "../../middlewares/validateMutationRequest";
import { Role } from "../user/user.interface";
import { DivisionControllers } from "./division.controller";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { multerUpload } from "../../config/multer.config";

const router = Router();

router.post(
    "/create",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateMutationRequest(createDivisionSchema),
    DivisionControllers.createDivision
);
router.get("/", DivisionControllers.getAllDivisions);
router.get("/:slug", DivisionControllers.getSingleDivision)
router.patch(
    "/:id",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    multerUpload.single("file"),
    validateMutationRequest(updateDivisionSchema),
    DivisionControllers.updateDivision
);
router.delete("/:id", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), DivisionControllers.deleteDivision);

export const DivisionRoutes = router;