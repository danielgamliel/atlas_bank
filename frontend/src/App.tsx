
import LandingPage from './screens/LandingPage';
import LoginPage from './screens/LoginPage';
import SignupPage from './screens/SignUpPage';
import DashboardPage from './screens/DashboardPage';
import TransferPage from './screens/TransferPage';
import TransactionsPage from './screens/TransactionsPage';

import { ProtectedRoute } from '../auth/ProtectedRoute';
import { Routes, Route } from "react-router-dom";


function App() {
 
  return (
    <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
     <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
      </Route>
    <Route path="/transactions" element={<TransactionsPage />} />
    <Route path="/transfer" element={<TransferPage />} />
  </Routes>
  )
}

export default App
