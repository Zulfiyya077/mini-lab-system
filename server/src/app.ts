import  express  from "express";
import patientRouter from "./routes/patient.routes.js";
import { errorHandler as errorMiddleware } from "./middleware/error.middleware.js";

const app = express();
 app.use(express.json());
    

 app.get("/", (req, res) => {
     res.send("Hello, World!");
 });


 console.log("Patient router:");
 app.use("/api/patients", patientRouter);
 app.use(errorMiddleware); 

 export default app;    