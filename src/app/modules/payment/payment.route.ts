import express from "express";
import { PaymentControllers } from "./payment.controller";


const router = express.Router();


router.post("/init-payment/:bookingId", PaymentControllers.initPayment);
router.post("/success", PaymentControllers.successPayment);
router.post("/fail", PaymentControllers.failPayment);
router.post("/cancel", PaymentControllers.cancelPayment);
export const PaymentRoutes = router;