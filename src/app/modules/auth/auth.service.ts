import { Users } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";
import { createNewTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";


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

export const AuthServices = {
    credentialsLoginService,
    getNewTokenService,
};