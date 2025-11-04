import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Panel from "./components/Header/Panel";

import DashboardLayout from "./pages/modal/DashboardLayout"; // ✅ Admin layout
import AdminProductsPanel from "./components/Dashboard/AdminProductsPanel";
import AdminUsersPanel from "./components/Dashboard/AdminUsersPanel";
import CreateProduct from "./pages/CreateProduct";
import AllOrdersPage from "./components/Dashboard/AllOrdersPage";
import CategoryManager from "./pages/CategoryManager";
import CreateCategory from "./pages/CreateCategory";
import UpdateCategory from "./pages/UpdateCategory";
import UpdateProduct from "./pages/UpdateProduct";
import ProductDeletePanel from "./components/Dashboard/ProductDeletePanel";
import AuthPage from "./components/Signup/AuthPage";
import WelcomeAdmin from "./components/Dashboard/WelcomeAdmin";

import Profile from "./components/Profile/Profile";
import MyProfile from "./components/MyProfile";
// import ForgotPassword from "./User/ForgotPassword";
// import ResetPassword from "./User/ResetPassword";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Cartpage from "./order/Cartpage";
import ShippingPage from "./order/components/ShippingPage";
import OrderDetailPage from "./order/components/OrderDetailPage";
import MyOrdersPage from "./order/components/MyOrdersPage";
import PaymentPage from "./order/components/paymentPage";

import ProtectedRoute from "./components/Protectedroute";

// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProducts from "./components/Dashboard/AdminProducts";

function App() {
  return (
    <BrowserRouter>
      {/* Header / Panel always visible */}
      <Header />
      <Panel />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
                <Route path="/admin-product" element={<AdminProducts />} />

        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profiles" element={<MyProfile />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
           <Route index element={<WelcomeAdmin />} />

          <Route path="admin-panel" element={<AdminUsersPanel />} />
          <Route path="admin-products" element={<AdminProductsPanel />} />
          <Route path="create-product" element={<CreateProduct />} />
          <Route path="category" element={<CategoryManager />} />
          <Route path="create-category" element={<CreateCategory />} />
          <Route path="update-category/:id" element={<UpdateCategory />} />
          <Route path="product/:id/update" element={<UpdateProduct />} />
          <Route path="product/delete" element={<ProductDeletePanel />} />
          <Route path="all-orders" element={<AllOrdersPage />} />
        </Route>
      </Routes>

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
