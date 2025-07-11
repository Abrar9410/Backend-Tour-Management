import { IUser } from "./user.interface";
import { Users } from "./user.model";

const createUserService = async (payload: Partial<IUser>) => {
    const { name, email } = payload;

    const user = await Users.create({
        name,
        email
    });

    return user;
};

const getAllUsersService = async () => {
    const users = await Users.find();

    const totalUsers = await Users.countDocuments();

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    };
};

export const UserServices = {
    createUserService,
    getAllUsersService
};