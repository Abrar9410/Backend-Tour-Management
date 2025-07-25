import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateMutationRequest } from "../../middlewares/validateMutationRequest";
import { Role } from "../user/user.interface";
import { BookingControllers } from "./booking.controller";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";

const router = express.Router();

// api/v1/booking
router.post("/",
    checkAuth(...Object.values(Role)),
    validateMutationRequest(createBookingZodSchema),
    BookingControllers.createBooking
);

// api/v1/booking
router.get("/",
    checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
    BookingControllers.getAllBookings
);

// api/v1/booking/my-bookings
router.get("/my-bookings",
    checkAuth(...Object.values(Role)),
    BookingControllers.getUserBookings
);

// api/v1/booking/bookingId
router.get("/:bookingId",
    checkAuth(...Object.values(Role)),
    BookingControllers.getSingleBooking
);

// api/v1/booking/bookingId/status
router.patch("/:bookingId/status",
    checkAuth(...Object.values(Role)),
    validateMutationRequest(updateBookingStatusZodSchema),
    BookingControllers.updateBookingStatus
);

export const BookingRoutes = router;