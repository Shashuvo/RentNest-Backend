import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";


const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
});

// authentication routes
app.use("/api/auth", authRoutes);
// categories routes
app.use("/api/categories", categoryRoutes);
// landlord routes
app.use("/api/landlord", landlordRoutes);


app.use(globalErrorHandler);

export default app;