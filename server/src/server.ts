import app from "./app.js";
import authRoutes from "./routes/auth.routes.js";



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use("/api/auth", authRoutes);

