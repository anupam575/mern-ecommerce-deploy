import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Panel from "./components/Header/Panel";
import CategoryManager from "./pages/CategoryManager";

import AdminDashboard from "./components/Dashboard/AdminDashboard";
import AdminProductsPanel from "./components/Dashboard/AdminProductsPanel.js";
import AdminUsersPanel from "./components/Dashboard/AdminUsersPanel.js";

import AuthPage from "./components/Signup/AuthPage";
import Profile from "./components/Profile/Profile";
import ForgotPassword from "./User/ForgotPassword";
import ResetPassword from "./User/ResetPassword";
import MyProfile from "./components/MyProfile";
import Home from "./pages/Home";
import Product from "./pages/Product";
import About from "./pages/About";
import CreateProduct from "./pages/CreateProduct.js";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDetails from "./pages/ProductDetails";
import ProductDeletePanel from "./components/Dashboard/ProductDeletePanel.js";
import Cartpage from "./order/Cartpage";
import UpdateCategory from "./pages/UpdateCategory.js";
import CreateCategory from "./pages/CreateCategory.js";
import Contact from "./pages/Contact";

import ShippingPage from "./order/components/ShippingPage";
import OrderDetailPage from "./order/components/OrderDetailPage";
import MyOrdersPage from "./order/components/MyOrdersPage";
import AllOrdersPage from "./components/Dashboard/AllOrdersPage";
import PaymentPage from "./order/components/paymentPage";

import ProtectedRoute from "./components/Protectedroute";

// ✅ Toastify imports
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      {/* Components that should appear on all pages */}
      <Header />
      <Panel />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ Admin-only protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsersPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-products"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminProductsPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-product"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/category"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CategoryManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/crete/category"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateCategory />
            </ProtectedRoute>
          }
        />

        {/* ✅ Fixed UpdateCategory Route */}
        <Route
          path="/update/category/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateCategory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/product/:id/update"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <UpdateProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/product/delete"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ProductDeletePanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AllOrdersPage />
            </ProtectedRoute>
          }
        />

        {/* ✅ Public / user-access routes */}
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profiles" element={<MyProfile />} />
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
                <Route path="/contact" element={<Contact />} />

        <Route path="/about" element={<About />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>

      {/* ✅ Global Toastify container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </BrowserRouter>
  );
}

export default App;
