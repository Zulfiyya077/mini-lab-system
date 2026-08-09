import  express  from "express";
import patientRouter from "./routes/patient.routes.js";

const app = express();
 app.use(express.json());
    

 app.get("/", (req, res) => {
     res.send("Hello, World!");
 });


 console.log("Patient router:"); // Debugging line to check if patientRouter is imported correctly
 app.use("/api/patients", patientRouter);

 export default app;    