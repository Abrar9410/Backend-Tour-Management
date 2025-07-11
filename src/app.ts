/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";


const app = express();

app.use(express.json());
app.use(cors());

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