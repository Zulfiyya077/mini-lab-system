import express from "express";
import patientRouter from "./routes/patient.routes.js";
import authRouter from "./routes/auth.routes.js";
import { errorMidddleware } from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import analysisRouter from "./routes/analyses.routes.js"
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger/swagger.js";



const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/patients", patientRouter);
app.use("/api/auth", authRouter);
app.use("/api/analyses", analysisRouter );
app.use(errorMidddleware);

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      withCredentials: true,
    },
  })
);

export default app;