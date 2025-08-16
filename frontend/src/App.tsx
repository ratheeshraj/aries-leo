import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/shop/Shop";
import ProductDetail from "./pages/product/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Wishlist } from "./pages/Wishlist";
import About from "./pages/About";
import Blog from "./pages/blog/Blog";
import { BlogDetail } from "./pages/blog/BlogDetail";
import { FAQ } from "./pages/FAQ";
import { Login } from "./pages/Login";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { AppProvider } from "./context/AppContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { VerifyOtp } from "./pages/VerifyOtp";
import TermsAndConditions from "./pages/TermsAndConditions";
import CancellationRefundPolicy from "./pages/CancellationRefundPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ShippingPolicy from "./pages/ShippingPolicy";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/:id" element={<BlogDetail />} />
              <Route path="faq" element={<FAQ />} />
              <Route
                path="terms"
                element={<TermsAndConditions />}
              />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/shipping" element={<ShippingPolicy />} />
              <Route
                path="/refund"
                element={<CancellationRefundPolicy />}
              />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="verify-otp" element={<VerifyOtp />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
