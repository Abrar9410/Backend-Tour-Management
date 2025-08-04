import crypto from "crypto";
import { redisClient } from "../../config/redis.config";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { Users } from "../user/user.model";


const OTP_EXPIRATION = 5 * 60 // 5 minutes

const generateOtp = (length = 6) => {
    //6 digit otp
    const otp = crypto.randomInt(10 ** (length - 1), 10 ** length).toString();

    return otp;
};

const sendOTPService = async (email: string, name: string) => {

    const user = await Users.findOne({ email });

    if (!user) {
        throw new AppError(404, "User not found!");
    };

    if (user.isVerified) {
        throw new AppError(401, "You are already verified!");
    };

    const otp = generateOtp();

    const redisKey = `otp:${email}`;

    await redisClient.set(redisKey, otp, {
        expiration: {
            type: "EX",
            value: OTP_EXPIRATION
        }
    });

    await sendEmail({
        to: email,
        subject: "Your OTP Code",
        templateName: "otp",
        templateData: {
            name: name,
            otp: otp
        }
    });
};

const verifyOTPService = async (email: string, otp: string) => {
    const user = await Users.findOne({ email });

    if (!user) {
        throw new AppError(404, "User not found!");
    };

    if (user.isVerified) {
        throw new AppError(401, "You are already verified!");
    };

    const redisKey = `otp:${email}`;

    const savedOtp = await redisClient.get(redisKey);

    if (!savedOtp) {
        throw new AppError(401, "Invalid OTP");
    };

    if (savedOtp !== otp) {
        throw new AppError(401, "Invalid OTP");
    };

    await Promise.all([
        Users.updateOne({ email }, { isVerified: true }, { runValidators: true }),
        redisClient.del([redisKey])
    ]);
};

export const OTPServices = {
    sendOTPService,
    verifyOTPService
};