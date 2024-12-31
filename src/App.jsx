import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "./component/cards/NotificationProvider";
import Notification from "./component/cards/Notification";
import Login from "./component/auth/Login";
import Register from "./component/auth/Register";
import Admin from "./component/admin/Admin";
import ShopOwner from "./component/shopOwner/ShopOwnerDashboard";
import Staff from "./component/staff/StaffDashboard";
import OtpVerify from "./component/auth/OtpVerify";
import UserDetails from "./component/admin/users/UserDetails";
import ProductDetails from "./component/admin/products/ProductDetails";
import ProductDetailsShop from "./component/shopOwner/products/ProductDetailsShop";
import StaffDetails from "./component/shopOwner/staff/StaffDetails";
import Sales from "./component/shopOwner/sales/SalesDetails";
import Invoice from "./component/shopOwner/invoice/InvoiceDetails";
import AddProduct from "./component/shopOwner/products/AddProduct";
import AddUser from "./component/admin/users/AddUser";
import AddStaff from "./component/shopOwner/staff/AddStaff";
import AddShop from "./component/admin/users/AddShop";
import CategoryDetails from "./component/shopOwner/category/CategoryDetail";
import ProductDetailsStaff from "./component/staff/products/ProductDetailsStaff";
import CategoryDetailsStaff from "./component/staff/category/CategoryDetailsStaff";
import SalesDetails from "./component/staff/sales/SalesDetails";
import PrivateRoute from "./utils/PrivateRoutes";
import NotFound from "./utils/NotFound";
import Checkout from "./component/checkout/Checkout";
import AdminSalesDetails from "./component/admin/sales/AdminSalesDetails";
import AdminInvoiceDetails from "./component/admin/invoice/AdminInvoiceDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null); // User role (admin, shopOwner, staff)
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const ROLES = {
    ADMIN: "ADMIN",
    SHOPOWNER: "SHOPOWNER",
    STAFF: "STAFF",
  };

  useEffect(() => {
    // Simulate authentication check (e.g., fetch token and role)
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (token) {
      setIsAuthenticated(true);
      setRole(userRole);
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
      <NotificationProvider>
      <Notification />
        <Routes>
          {/* Authentication Routes */}
          <Route path="/verification" element={<OtpVerify onLogin={handleLogin}/>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login  />} />

          {/* Common Routes */}
          {/* Checkout Route */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/products/add"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
              >
                <AddProduct />
              </PrivateRoute>
            }
          />













          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <Admin onLogout={handleLogout} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <ProductDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <UserDetails setSelectedUserId={setSelectedUserId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/add"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <AddUser />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/users/add-shop"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <AddShop userId={selectedUserId} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/sales"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <AdminSalesDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/invoices"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.ADMIN]}
                role={role}
              >
                <AdminInvoiceDetails />
              </PrivateRoute>
            }
          />











          {/* ShopOwner Routes */}
          <Route
            path="/shop-owner"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <ShopOwner />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-owner/products"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <ProductDetailsShop />
              </PrivateRoute>
            }
          />{" "}
          <Route
            path="/shop-owner/staff"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <StaffDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-owner/sales"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <Sales />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-owner/invoices"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <Invoice />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-owner/products/staff"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <AddStaff />
              </PrivateRoute>
            }
          />
          <Route
            path="/shop-owner/category"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <CategoryDetails />
              </PrivateRoute>
            }
          />




          {/* Staff Routes */}
          <Route
            path="/staff"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <Staff onLogout={handleLogout} />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff/products"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <ProductDetailsStaff />
              </PrivateRoute>
            }
          />
         
          <Route
            path="/staff/category"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <CategoryDetailsStaff />
              </PrivateRoute>
            }
          />
          <Route
            path="/staff/sales"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <SalesDetails />
              </PrivateRoute>
            }
          />
          {/* Not found Routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </NotificationProvider>
      </div>
    </Router>

  );
}

export default App;
