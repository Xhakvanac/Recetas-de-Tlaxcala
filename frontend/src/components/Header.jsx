import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logout, setShowLoginModal, setShowRegisterModal } = useContext(AuthContext);

  return (
    <header>
      <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
        <span className="logo-icon">🫔</span>
        Sabores de <span>Tlaxcala</span>
      </Link>
      <nav id="mainNav">
        <Link to="/" className="nav-btn">Inicio</Link>
        <Link to="/recetas" className="nav-btn">Platillos</Link>
        <button className="nav-btn">Historia</button>
        
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="nav-btn" style={{ color: 'var(--gold)' }}>Admin</Link>
            )}
            <div className="user-chip">
              <div className={`avatar ${user.role}`}>{user.name.charAt(0)}</div>
              {user.name}
            </div>
            <button className="nav-btn" onClick={logout}>Salir</button>
          </>
        ) : (
          <span id="authButtons">
            <button className="nav-btn" onClick={() => setShowLoginModal(true)}>Iniciar Sesión</button>
            <button className="nav-btn cta" onClick={() => setShowRegisterModal(true)}>Registrarse</button>
          </span>
        )}
      </nav>
    </header>
  );
};

export default Header;
