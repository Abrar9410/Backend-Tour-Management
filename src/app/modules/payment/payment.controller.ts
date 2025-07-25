import { Request, Response } from "express";
import { envVars } from "../../config/env";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId;
    const result = await PaymentServices.initPaymentService(bookingId);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Payment done successfully",
        data: result,
    });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentServices.successPaymentService(query as Record<string, string>);

    if (result.success) {
        res.redirect(`${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentServices.failPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;
    const result = await PaymentServices.cancelPaymentService(query as Record<string, string>);

    if (!result.success) {
        res.redirect(`${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`);
    };
});

export const PaymentControllers = {
    initPayment,
    successPayment,
    failPayment,
    cancelPayment,
};