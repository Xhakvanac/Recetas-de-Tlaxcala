import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Recetas from './pages/Recetas';
import Admin from './pages/Admin';
import Historia from './pages/Historia';
import LoginModal from './components/LoginModal';
import RegisterModal from './components/RegisterModal';
import RecipeDetailModal from './components/RecipeDetailModal';
import CreateAdminModal from './components/CreateAdminModal';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="tlax-strip"></div>
        <Header />
        <div className="app">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route path="/historia" element={<Historia />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
        
        {/* Modals */}
        <LoginModal />
        <RegisterModal />
        <RecipeDetailModal />
        <CreateAdminModal />
      </Router>
    </AuthProvider>
  );
}

export default App;
