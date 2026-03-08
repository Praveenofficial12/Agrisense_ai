import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Farmer dashboard
import DashboardLayout from './pages/DashboardLayout';
import Overview from './pages/Overview';
import SoilSimulation from './pages/SoilSimulation';
import DiseaseDetection from './pages/DiseaseDetection';
import NdviMapping from './pages/NdviMapping';
import PestRisk from './pages/PestRisk';
import Alerts from './pages/Alerts';

function App() {
  return (
    <Router>
      <Routes>

        {/* ─── Public ─── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ─── Farmer Dashboard ─── */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="ndvi" element={<NdviMapping />} />
          <Route path="soil" element={<SoilSimulation />} />
          <Route path="pest" element={<PestRisk />} />
          <Route path="alerts" element={<Alerts />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
