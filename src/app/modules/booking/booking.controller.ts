import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const decodedToken = req.user as JwtPayload;
    const booking = await BookingServices.createBookingService(req.body, decodedToken.userId);
    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Booking created successfully",
        data: booking,
    });
});

const getUserBookings = catchAsync(
    async (req: Request, res: Response) => {
        const bookings = await BookingServices.getUserBookingsService();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
    }
);

const getSingleBooking = catchAsync(
    async (req: Request, res: Response) => {
        const bookingId = req.params.bookingId;
        const booking = await BookingServices.getBookingByIdService(bookingId);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    }
);

const getAllBookings = catchAsync(
    async (req: Request, res: Response) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const bookings = await BookingServices.getAllBookingsService();
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Bookings retrieved successfully",
            data: {},
            // meta: {},
        });
    }
);

const updateBookingStatus = catchAsync(
    async (req: Request, res: Response) => {

        const updated = await BookingServices.updateBookingStatusService(
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Booking Status Updated Successfully!",
            data: updated,
        });
    }
);


export const BookingControllers = {
    createBooking,
    getAllBookings,
    getSingleBooking,
    getUserBookings,
    updateBookingStatus,
}