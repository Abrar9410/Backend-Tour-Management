/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Users } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
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

    const { token, refreshToken } = createUserTokens(user);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password: pass,...rest} = user.toObject();

    return {
        token,
        refreshToken,
        user: rest
    };
};

const getNewTokenService = async (refreshToken: string) => {
    
    const newToken = await createNewTokenWithRefreshToken(refreshToken);

    return {
        token: newToken
    };
};

const resetPasswordService = async (decodedToken: JwtPayload, oldPassword: string, newPassword: string) => {
    
    const user = await Users.findById(decodedToken.userId);

    if (user!._id !== decodedToken.userId) {
        throw new AppError(httpStatus.FORBIDDEN, "You are Trying to Change Another User's Password!");
    };

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string);

    if (!isOldPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Old Password Does Not Match!");
    };

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.SALT));
    user!.save();
};

export const AuthServices = {
    credentialsLoginService,
    getNewTokenService,
    resetPasswordService
};