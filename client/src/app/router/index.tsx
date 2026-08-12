import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../../features/auth/pages/LoginPage";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import DashboardLayout from "../../layouts/DashboardLayout";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<div>HOME</div>} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;