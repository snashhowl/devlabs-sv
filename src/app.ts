import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./swagger.json";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(errorHandler);

export default app;
