import { Users } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../utils/jwt";
import { envVars } from "../../config/env";


const credentialsLoginService = async (payload: Partial<IUser>) => {
    const {email, password} = payload;

    const user = await Users.findOne({ email });

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Does Not Exist!");
    };

    const isPasswordMatched = await bcryptjs.compare(password as string, user.password as string);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password!")
    };

    const jwtPayload = {userId: user._id, email: user.email, role: user.role};

    const token = generateToken(jwtPayload, envVars.JWT_SECRET, envVars.JWT_EXPIRESIN);

    return {
        token
    };
};

export const AuthServices = {
    credentialsLoginService
};