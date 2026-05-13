import express from "express";
import dotenv from "dotenv";
import todoRoutes from "./routes/todo.routes.js";
import userRoutes from "./routes/use.routes.js";
import orderRoutes from "./routes/order.routes.js"
import adminRoutes from "./routes/admin.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cookieParser from 'cookie-parser';
import path from "path";
import { fileURLToPath } from "url";
import subTodoRouter from "./routes/subTodo.routes.js";
import morgan  from "morgan"; 



dotenv.config();

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // max 100 requests
  message: "Too many requests, try again later",
});
// app.use(morgan('dev'));
app.use(limiter);

app.use(
  cors({
    origin: process.env.CLIENT_URL, // change in production
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//console.log("Static path:", path.join(__dirname, "../uploads"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use("/api/todos", todoRoutes);

app.use("/api/users", userRoutes);

app.use("/api/todos", subTodoRouter);

app.use("/api/order",orderRoutes);

app.use("/api/admin",adminRoutes);


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});


app.use(errorMiddleware);

export default app;