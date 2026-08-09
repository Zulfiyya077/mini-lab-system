import express from "express";

import patientRouter from "./routes/patient.routes.js";
import authRouter from "./routes/auth.routes.js";

import { errorMidddleware } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/patients", patientRouter);
app.use("/api/auth", authRouter);

app.use(errorMidddleware);

export default app;