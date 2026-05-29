import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const RegisterModal = () => {
  const { showRegisterModal, setShowRegisterModal, register } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '', lastName: '', email: '', password: '', specialty: ''
  });
  const [error, setError] = useState('');

  const [num1] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [num2] = useState(() => Math.floor(Math.random() * 9) + 1);
  const [captchaInput, setCaptchaInput] = useState('');

  if (!showRegisterModal) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    
    // CAPTCHA verification
    const answer = parseInt(captchaInput, 10);
    if (isNaN(answer) || answer !== num1 + num2) {
      setError('Respuesta de verificación incorrecta');
      return;
    }

    const res = await register(formData);
    if (!res.success) {
      setError(res.message);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal">
        <div className="modal-header">
          <h3>✨ Crear Cuenta</h3>
          <button className="modal-close" onClick={() => setShowRegisterModal(false)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-grid">
            <div className="field"><label>Nombre</label><input name="name" onChange={handleChange} placeholder="Tu nombre"/></div>
            <div className="field"><label>Apellido</label><input name="lastName" onChange={handleChange} placeholder="Tu apellido"/></div>
            <div className="field full"><label>Correo electrónico</label><input type="email" name="email" onChange={handleChange} placeholder="tu@correo.com"/></div>
            <div className="field full"><label>Contraseña</label><input type="password" name="password" onChange={handleChange} placeholder="Mínimo 6 caracteres"/></div>
            <div className="field full"><label>Municipio de origen</label><input name="specialty" onChange={handleChange} placeholder="Ej: Tlaxcala, Huamantla, Apizaco..."/></div>
            <div className="field full">
              <label>Verificación de seguridad: ¿Cuánto es {num1} + {num2}?</label>
              <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Escribe el resultado aquí..." />
            </div>
          </div>
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          <div className="form-actions">
            <button className="btn-cancel" onClick={() => setShowRegisterModal(false)}>Cancelar</button>
            <button className="btn-primary" onClick={handleSubmit}>Crear cuenta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
