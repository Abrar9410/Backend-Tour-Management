import { Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { validateMutationRequest } from "../../middlewares/validateMutationRequest";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "./user.interface";


const router = Router();

router.post("/register", validateMutationRequest(createUserZodSchema), UserControllers.createUser);
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers);
router.patch("/update-user/:id", checkAuth(...Object.values(Role)), validateMutationRequest(updateUserZodSchema), UserControllers.updateUser);

export const UserRoutes = router;