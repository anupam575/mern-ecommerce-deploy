import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Panel from "./components/Header/Panel";

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
import UpdateProduct from "./pages/UpdateProduct"; // Path check kar lena

import ProductDetails from "./pages/ProductDetails";
import ProductDeletePanel from "./components/Dashboard/ProductDeletePanel.js";
import Cartpage from "./order/Cartpage";
import ShippingPage from "./order/components/ShippingPage";
import OrderDetailPage from "./order/components/OrderDetailPage";
import MyOrdersPage from "./order/components/MyOrdersPage";
import AllOrdersPage from "./components/Dashboard/AllOrdersPage";
import PaymentPage from "./order/components/paymentPage"; // ✅ Import your paymentPage component

function App() {
  return (
    <BrowserRouter>
      {/* Components that should appear on all pages */}
      <Header />
      <Panel />

      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<AdminDashboard />} />{" "}
        {/* ✅ Main admin dashboard */}
        <Route path="/admin-panel" element={<AdminUsersPanel />} />
        <Route path="/admin-products" element={<AdminProductsPanel />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profiles" element={<MyProfile />} />
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin/create-product" element={<CreateProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin/product/:id/update" element={<UpdateProduct />} />
        <Route path="/admin/product/delete" element={<ProductDeletePanel />} />
        <Route path="/cart" element={<Cartpage />} />
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/order/:id" element={<OrderDetailPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />
        <Route path="/admin/orders" element={<AllOrdersPage />} />
        <Route path="/payment" element={<PaymentPage />} />
       

 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
