import CreateInvoice from "./pages/CreateInvoice";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import { Routes, Route, Navigate } from "react-router-dom";
import PreviewInvoice from "./pages/PreviewInvoice";
import NewSupplier from "./components/NewSuppllier";
import { UserProvider, useUser } from "./context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  return user.isLoggedIn ? children : <Navigate to="/" />;
};
const PublicRoute = ({ children }) => {
  const { user } = useUser();
  return !user.isLoggedIn ? children : <Navigate to="/home" />;
};


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/create" element={<ProtectedRoute><CreateInvoice /></ProtectedRoute>} />
      <Route path="/preview-invoice" element={<ProtectedRoute><PreviewInvoice /></ProtectedRoute>} />
      <Route path="/create-supplier" element={<ProtectedRoute><NewSupplier /></ProtectedRoute>} />
    </Routes>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
};

export default App;