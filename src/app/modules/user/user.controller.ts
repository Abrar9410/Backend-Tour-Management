/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { Users } from "./user.model";
import httpStatus from "http-status-codes"

const createUser = async (req: Request, res: Response) => {
    try {
        const {name, email} = req.body;

        const user = await Users.create({
            name,
            email
        });

        res.status(httpStatus.CREATED).send({
            success: true,
            message: "User Created Successfully",
            user
        })
    } catch (error: any) {
        console.log(error);
        res.status(httpStatus.BAD_REQUEST).send({
            message: `Something went wrong!! ${error.message}`,
            error
        })
    }
};

export const UserControllers = {
    createUser
};