import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const LoginModal = () => {
  const { showLoginModal, setShowLoginModal, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!showLoginModal) return null;

  const handleSubmit = async () => {
    setError('');
    const res = await login(email, password);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h3>🔑 Iniciar Sesión</h3>
          <button className="modal-close" onClick={() => setShowLoginModal(false)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field full">
              <label>Correo electrónico</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.com" />
            </div>
            <div className="field full">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </div>
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setShowLoginModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>Entrar →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
