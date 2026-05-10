import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';

// Pages publiques
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages client
import ClientAccueil from './pages/client/ClientAccueil';
import ClientRecherche from './pages/client/ClientRecherche';
import ClientSuiviDemandes from './pages/client/ClientSuiviDemandes';
import ClientHistorique from './pages/client/ClientHistorique';
import ClientNotifications from './pages/client/ClientNotifications';

// Pages avocat
import AvocatDashboard from './pages/avocat/AvocatDashboard';
import AvocatDemandes from './pages/avocat/AvocatDemandes';
import AvocatProfil from './pages/avocat/AvocatProfil';
import AvocatAgenda from './pages/avocat/AvocatAgenda';
import AvocatNotifications from './pages/avocat/AvocatNotifications';

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAvocats from './pages/admin/AdminAvocats';
import AdminClients from './pages/admin/AdminClients';
import AdminDemandes from './pages/admin/AdminDemandes';

// Route protégée
const RoutePrivee = ({ children, roles }) => {
  const { estConnecte, user, loading } = useAuth();
  if (loading) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!estConnecte) return <Navigate to="/connexion" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

const AppRoutes = () => {
  const { estConnecte, user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Publiques */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/connexion" element={<LoginPage />} />
        <Route path="/inscription" element={<RegisterPage />} />

        {/* Client */}
        <Route path="/accueil" element={<RoutePrivee roles={['client']}><ClientAccueil /></RoutePrivee>} />
        <Route path="/recherche" element={<RoutePrivee roles={['client']}><ClientRecherche /></RoutePrivee>} />
        <Route path="/mes-demandes" element={<RoutePrivee roles={['client']}><ClientSuiviDemandes /></RoutePrivee>} />
        <Route path="/historique" element={<RoutePrivee roles={['client']}><ClientHistorique /></RoutePrivee>} />
        <Route path="/notifications" element={<RoutePrivee roles={['client']}><ClientNotifications /></RoutePrivee>} />

        {/* Avocat */}
        <Route path="/tableau-de-bord" element={<RoutePrivee roles={['avocat']}><AvocatDashboard /></RoutePrivee>} />
        <Route path="/demandes" element={<RoutePrivee roles={['avocat']}><AvocatDemandes /></RoutePrivee>} />
        <Route path="/mon-profil" element={<RoutePrivee roles={['avocat']}><AvocatProfil /></RoutePrivee>} />
        <Route path="/agenda" element={<RoutePrivee roles={['avocat']}><AvocatAgenda /></RoutePrivee>} />
        <Route path="/mes-notifications" element={<RoutePrivee roles={['avocat']}><AvocatNotifications /></RoutePrivee>} />

        {/* Admin */}
        <Route path="/admin" element={<RoutePrivee roles={['administrateur']}><AdminDashboard /></RoutePrivee>} />
        <Route path="/admin/avocats" element={<RoutePrivee roles={['administrateur']}><AdminAvocats /></RoutePrivee>} />
        <Route path="/admin/clients" element={<RoutePrivee roles={['administrateur']}><AdminClients /></RoutePrivee>} />
        <Route path="/admin/demandes" element={<RoutePrivee roles={['administrateur']}><AdminDemandes /></RoutePrivee>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;