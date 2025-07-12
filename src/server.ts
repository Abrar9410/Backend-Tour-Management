/* eslint-disable no-console */
import {Server} from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL);

        console.log("Connected to Database!");

        server = app.listen(envVars.PORT, () => {
            console.log("Server is running on port", envVars.PORT);
        })
    } catch (error) {
        console.log(error);
    }
};

(async () => {
    await startServer();
    await seedSuperAdmin();
})();

// SIGTERM Error
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received! Server shutting down...");

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});


// Unhandled Rejection Error
process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection detected! Server shutting down...", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});


// Uncaught Exception Error
process.on("uncaughtException", (error) => {
    console.log("Uncaught Exception detected! Server shutting down...", error);

    if (server) {
        server.close(() => {
            process.exit(1);
        });
    };

    process.exit(1);
});


// Example of Unhandled Rejection Error
// Promise.reject(new Error("I forgot to catch this promise"))

// Example of Unhandled Rejection Error
// throw new Error("I forgot to handle this local error")