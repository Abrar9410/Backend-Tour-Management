/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const user = await UserServices.createUserService(req.body);

//         res.status(httpStatus.CREATED).send({
//             success: true,
//             message: "User Created Successfully",
//             user
//         })
//     } catch (error: any) {
//         console.log(error);
//         next(error);
//     }
// };

const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUserService(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Created Successfully!",
        data: user
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsersService();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Retrieved All Users Successfully!",
        data: result.data,
        meta: result.meta
    });
});

export const UserControllers = {
    createUser,
    getAllUsers
};