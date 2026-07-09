import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { authRoutes } from "./modules/auth/auth.route";
import { categoryRoutes } from "./modules/category/category.route";
import { landlordRoutes } from "./modules/landlord/landlord.route";
import { propertyRoutes } from "./modules/property/property.routes";
import { reviewRoutes } from "./modules/review/review.routes";
import { rentalRoutes } from "./modules/rental/rental.routes";


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
// property routes
app.use("/api/properties", propertyRoutes);
// rental requests routes
app.use("/api/rentals", rentalRoutes);
// reviews routes
app.use("/api/reviews", reviewRoutes);


app.use(globalErrorHandler);

export default app;