import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { Users } from "../modules/user/user.model";
import bcryptjs from "bcryptjs"


export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExists = await Users.findOne({email: envVars.SUPER_ADMIN_EMAIL});

        if (isSuperAdminExists) {
            if (envVars.NODE_ENV === "development") {
                console.log("Super Admin exists");
            };
            return;
        };
        if (envVars.NODE_ENV === "development") {
            console.log("Creating Super Admin...");
        };

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.SALT));
        const authProvider: IAuthProvider = {
            provider: "credentials",
            providerId: envVars.SUPER_ADMIN_EMAIL
        };

        const payload: IUser = {
            name: "Super Admin",
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            isVerified: true,
            auths: [authProvider]
        };

        const superAdmin = await Users.create(payload);

        if (envVars.NODE_ENV === "development") {
            console.log("Super Admin created successfully! \n");
            console.log(superAdmin);
        };
    } catch (error) {
        if (envVars.NODE_ENV === "development") {
            console.log(error);
        };
    }
};