import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import Admin from "./component/admin/Admin";
import ShopOwner from "./component/shopOwner/ShopOwnerDashboard";
import Staff from "./component/staff/StaffDashboard";
import OtpVerify from "./component/auth/OtpVerify";
import UserDetails from "./component/admin/UserDetails";
import ProductDetails from "./component/admin/ProductDetails";
import ProductDetailsShop from "./component/shopOwner/ProductDetailsShop";
import StaffDetails from "./component/shopOwner/StaffDetails";
import Sales from "./component/shopOwner/SalesDetails";
import Invoice from "./component/shopOwner/InvoiceDetails";
import AddProduct from "./component/shopOwner/AddProduct";
import AddUser from "./component/admin/AddUser";
import AddStaff from "./component/shopOwner/addStaff";
import AddShop from "./component/admin/AddShop";
import CategoryDetails from "./component/shopOwner/category/CategoryDetail";
import ProductDetailsStaff from "./component/staff/ProductDetailsStaff";
import CategoryDetailsStaff from "./component/staff/CategoryDetailsStaff";
import SalesDetails from "./component/staff/SalesDetails";

// Helper Component for Protected Routes
const PrivateRoute = ({ isAuthenticated, children, redirectTo = "/login" }) => {
  return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // User role (admin, shopOwner, staff)
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    // Simulate authentication check (e.g., fetch token and role)
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // Save user role in localStorage

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole); // Set role based on saved data
    }
    setLoading(false);
  }, []);

  const handleLogin = (userRole) => {
    localStorage.setItem("role", userRole);
    setIsAuthenticated(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading screen while checking authentication
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Authentication Routes */}
          <Route path="/verification" element={<OtpVerify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

          {/* Role-Based Dashboard Routing */}
          <Route
            path="/admin"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated && role === "ADMIN"}
              >
                <Admin onLogout={handleLogout} />
              </PrivateRoute>
            }
          />
          <Route path="/admin/products" element={<ProductDetails />} />
          <Route
            path="/admin/users"
            element={<UserDetails setSelectedUserId={setSelectedUserId} />}
          />
          <Route path="/admin/users/add" element={<AddUser />} />
          <Route
            path="/admin/users/add-shop"
            element={<AddShop userId={selectedUserId} />}
          />

          <Route
            path="/shop-owner"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated && role === "SHOPOWNER"}
              >
                <ShopOwner onLogout={handleLogout} />
              </PrivateRoute>
            }
          />
          <Route path="/shop-owner/products" element={<ProductDetailsShop />} />
          <Route path="/shop-owner/staff" element={<StaffDetails />} />
          <Route path="/shop-owner/sales" element={<Sales />} />
          <Route path="/shop-owner/invoices" element={<Invoice />} />
          <Route path="/shop-owner/products/add" element={<AddProduct />} />
          <Route path="/shop-owner/products/staff" element={<AddStaff />} />
          <Route path="/shop-owner/category" element={<CategoryDetails />} />

          <Route
            path="/staff"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated && role === "STAFF"}
              >
                <Staff onLogout={handleLogout} />
              </PrivateRoute>
            }
          />
          <Route path="/staff/products" element={<ProductDetailsStaff />} />
          <Route path="/staff/products/add" element={<AddProduct />} />
          <Route path="/staff/category" element={<CategoryDetailsStaff />} />
          <Route path="/staff/sales" element={<SalesDetails />} />

          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to={`/${role}`} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
