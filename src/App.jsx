import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
import PrivateRoute from "./utils/PrivateRoutes";
import NotFound from "./utils/NotFound";

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
        <Routes>
          {/* Authentication Routes */}

          <Route path="/verification" element={<OtpVerify />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />

        

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

          {/* ShopOwner Routes */}
          
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
          <Route path="/shop-owner/invoices" element={<Invoice />} />
          <Route
            path="/shop-owner/products/add"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.SHOPOWNER]}
                role={role}
              >
                <AddProduct />
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
            path="/staff/products/add"
            element={
              <PrivateRoute
                isAuthenticated={isAuthenticated}
                allowedRoles={[ROLES.STAFF]}
                role={role}
              >
                <AddProduct />
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
      </div>
    </Router>
  );
}

export default App;
