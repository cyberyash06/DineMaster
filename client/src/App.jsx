import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/Approutes";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function Layout() {
  const location = useLocation();
  const hideLayoutRoutes = ["/login", "/register"];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen overflow-hidden">
      {!shouldHideLayout && <Sidebar />}

      <div className="flex-1 flex flex-col">
        {!shouldHideLayout && <Navbar />}
        <main className="flex-1 bg-gray-50 p-4 overflow-y-auto">
          <AppRoutes />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Direct routes for login/register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* For all other routes, use Layout */}
        <Route path="*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
