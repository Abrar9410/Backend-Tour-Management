/* eslint-disable @typescript-eslint/no-explicit-any */
import { Bookings } from "../booking/booking.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { Payments } from "../payment/payment.model";
import { Tours } from "../tour/tour.model";
import { IsActive } from "../user/user.interface";
import { Users } from "../user/user.model";

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStatsService = async () => {
    const totalUsersPromise = Users.countDocuments();

    const totalActiveUsersPromise = Users.countDocuments({ isActive: IsActive.ACTIVE });
    const totalInActiveUsersPromise = Users.countDocuments({ isActive: IsActive.INACTIVE });
    const totalBlockedUsersPromise = Users.countDocuments({ isActive: IsActive.BLOCKED });

    const newUsersInLast7DaysPromise = Users.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const newUsersInLast30DaysPromise = Users.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const usersByRolePromise = Users.aggregate([
        //stage -1 : Grouping users by role and count total users in each role

        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ]);


    const [totalUsers, totalActiveUsers, totalInActiveUsers, totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
        totalUsersPromise,
        totalActiveUsersPromise,
        totalInActiveUsersPromise,
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ]);
    
    return {
        totalUsers,
        totalActiveUsers,
        totalInActiveUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    };
};

const getTourStatsService = async () => {
    const totalToursPromise = Tours.countDocuments();

    const totalToursByTourTypePromise = Tours.aggregate([
        // stage-1 : connect Tour Type model - lookup stage
        {
            $lookup: {
                from: "tourtypes",
                localField: "tourType",
                foreignField: "_id",
                as: "type"
            }
        },
        //stage - 2 : unwind the array to object

        {
            $unwind: "$type"
        },

        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$type.name",
                count: { $sum: 1 }
            }
        }
    ]);

    const avgTourCostPromise = Tours.aggregate([
        //Stage-1 : group the cost from, do sum, and average the sum
        {
            $group: {
                _id: null,
                avgCostFrom: { $avg: "$costFrom" }
            }
        }
    ]);

    const totalToursByDivisionPromise = Tours.aggregate([
        // stage-1 : connect Division model - lookup stage
        {
            $lookup: {
                from: "divisions",
                localField: "division",
                foreignField: "_id",
                as: "division"
            }
        },
        //stage - 2 : unwind the array to object

        {
            $unwind: "$division"
        },

        //stage - 3 : grouping tour type
        {
            $group: {
                _id: "$division.name",
                count: { $sum: 1 }
            }
        }
    ]);

    const highestBookedToursPromise = Bookings.aggregate([
        // stage-1 : Group the tour
        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },

        //stage-2 : sort the tour

        {
            $sort: { bookingCount: -1 }
        },

        //stage-3 : sort
        {
            $limit: 5
        },

        //stage-4 lookup stage
        {
            $lookup: {
                from: "tours",
                let: { tourId: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$tourId"] }
                        }
                    }
                ],
                as: "tour"
            }
        },
        //stage-5 unwind stage
        { $unwind: "$tour" },

        //stage-6 Project stage

        {
            $project: {
                bookingCount: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);

    
    const [totalTours, totalToursByTourType, avgTourCost, totalToursByDivision, highestBookedTours] = await Promise.all([
        totalToursPromise,
        totalToursByTourTypePromise,
        avgTourCostPromise,
        totalToursByDivisionPromise,
        highestBookedToursPromise
    ]);

    return {
        totalTours,
        totalToursByTourType,
        avgTourCost,
        totalToursByDivision,
        highestBookedTours
    };
};

const getBookingStatsService = async () => {
    const totalBookingsPromise = Bookings.countDocuments();

    const totalBookingsByStatusPromise = Bookings.aggregate([
        //stage-1 group stage
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const bookingsPerTourPromise = Bookings.aggregate([
        //stage1 group stage

        {
            $group: {
                _id: "$tour",
                bookingCount: { $sum: 1 }
            }
        },

        //stage-2 sort stage
        {
            $sort: { bookingCount: -1 }
        },

        //stage-3 limit stage
        {
            $limit: 10
        },

        //stage-4 lookup stage
        {
            $lookup: {
                from: "tours",
                localField: "_id",
                foreignField: "_id",
                as: "tour"
            }
        },

        // stage5 - unwind stage
        {
            $unwind: "$tour"
        },

        // stage6 project stage

        {
            $project: {
                bookingCount: 1,
                _id: 1,
                "tour.title": 1,
                "tour.slug": 1
            }
        }
    ]);

    const avgGuestCountPerBookingPromise = Bookings.aggregate([
        // stage 1  - group stage
        {
            $group: {
                _id: null,
                avgGuestCount: { $avg: "$guestCount" }
            }
        }
    ]);

    const bookingsInLast7DaysPromise = Bookings.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    });
    const bookingsInLast30DaysPromise = Bookings.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    });

    const totalBookingByUniqueUsersPromise = Bookings.distinct("user").then((user: any) => user.length);

    
    const [totalBookings, totalBookingsByStatus, bookingsPerTour, avgGuestCountPerBooking, bookingsInLast7Days, bookingsInLast30Days, totalBookingByUniqueUsers] = await Promise.all([
        totalBookingsPromise,
        totalBookingsByStatusPromise,
        bookingsPerTourPromise,
        avgGuestCountPerBookingPromise,
        bookingsInLast7DaysPromise,
        bookingsInLast30DaysPromise,
        totalBookingsByStatusPromise,
        totalBookingByUniqueUsersPromise
    ]);

    return {
        totalBookings,
        totalBookingsByStatus,
        bookingsPerTour,
        avgGuestCountPerBooking: avgGuestCountPerBooking[0].avgGuestCount,
        bookingsInLast7Days,
        bookingsInLast30Days,
        totalBookingByUniqueUsers
    };
};

const getPaymentStatsService = async () => {

    const totalPaymentsPromise = Payments.countDocuments();

    const totalPaymentsByStatusPromise = Payments.aggregate([
        //stage 1 group
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const totalRevenuePromise = Payments.aggregate([
        //stage1 match stage
        {
            $match: { status: PAYMENT_STATUS.PAID }
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$amount" }
            }
        }
    ]);

    const avgPaymentAmountPromise = Payments.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: null,
                avgPaymentAMount: { $avg: "$amount" }
            }
        }
    ]);

    const paymentGatewayDataPromise = Payments.aggregate([
        //stage 1 group stage
        {
            $group: {
                _id: { $ifNull: ["$paymentGatewayData.status", "UNKNOWN"] },
                count: { $sum: 1 }
            }
        }
    ]);


    const [totalPayments, totalPaymentsByStatus, totalRevenue, avgPaymentAmount, paymentGatewayData] = await Promise.all([
        totalPaymentsPromise,
        totalPaymentsByStatusPromise,
        totalRevenuePromise,
        avgPaymentAmountPromise,
        paymentGatewayDataPromise
    ]);

    return {
        totalPayments,
        totalPaymentsByStatus,
        totalRevenue,
        avgPaymentAmount,
        paymentGatewayData
    };
};


/**
 * await Tour.updateMany(
        {
            // Only update where tourType or division is stored as a string
            $or: [
                { tourType: { $type: "string" } },
                { division: { $type: "string" } }
            ]
        },
        [
            {
                $set: {
                    tourType: { $toObjectId: "$tourType" },
                    division: { $toObjectId: "$division" }
                }
            }
        ]
    );
 */



export const StatsServices = {
    getBookingStatsService,
    getPaymentStatsService,
    getTourStatsService,
    getUserStatsService
};