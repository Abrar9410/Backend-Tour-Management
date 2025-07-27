/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport";
import { envVars } from "./app/config/env";


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
    res.status(200).send({
        message: "Welcome to Tour Management System Backend"
    })
});

app.use(globalErrorHandler);

// Not Found Route -- Must be below globalErrorHandler
app.use(notFound);

export default app;

// Workflow:
// route matching (3 layers: app.ts -> routes -> module route) -> controller -> service -> model -> DB
// Development is opposite of Workflow starting with interface & model