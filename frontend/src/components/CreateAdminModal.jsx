import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CreateAdminModal = () => {
  const { showCreateAdminModal, setShowCreateAdminModal, user } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [formData, setFormData] = useState({
    name: '', lastName: '', email: '', password: '', specialty: ''
  });
  const [error, setError] = useState('');

  if (!showCreateAdminModal) return null;

  const handleVerifyPin = () => {
    if (pin === '1234') {
      setStep(2);
      setError('');
    } else {
      setError('PIN Maestro incorrecto');
    }
  };

  const handleCreateAdmin = async () => {
    try {
      setError('');
      await axios.post('http://localhost:5000/api/auth/create-admin', {
        ...formData,
        masterPin: pin
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert('Administrador creado con éxito!');
      setShowCreateAdminModal(false);
      setStep(1);
      setPin('');
      setFormData({ name: '', lastName: '', email: '', password: '', specialty: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal-overlay open">
      <div className="modal" style={{ maxWidth: '560px' }}>
        <div className="modal-header">
          <h3>👑 Crear Administrador</h3>
          <button className="modal-close" onClick={() => setShowCreateAdminModal(false)}>✕</button>
        </div>
        <div className="modal-body">
          <div className="step-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-line ${step >= 2 ? 'done' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-line ${step >= 3 ? 'done' : ''}`}></div>
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
          </div>

          {step === 1 && (
            <div>
              <div className="superadmin-banner">
                <div className="crown">👑</div>
                <div>
                  <h4>Verificación de Cuenta Principal</h4>
                  <p>Solo la cuenta principal puede crear nuevos administradores. Ingresa tu PIN maestro.</p>
                </div>
              </div>
              <div className="field">
                <label>PIN Maestro (4 dígitos)</label>
                <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} maxLength="4" placeholder="••••" style={{ letterSpacing: '6px', fontSize: '1.2rem', textAlign: 'center' }} />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '4px' }}>PIN por defecto: <strong>1234</strong></span>
              </div>
              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setShowCreateAdminModal(false)}>Cancelar</button>
                <button className="btn-primary" onClick={handleVerifyPin}>Verificar PIN →</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="confirm-box">
                <strong>✅ Identidad verificada</strong>
                Estás creando una cuenta con privilegios de administrador.
              </div>
              <div className="form-grid">
                <div className="field"><label>Nombre</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nombre" /></div>
                <div className="field"><label>Apellido</label><input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Apellido" /></div>
                <div className="field full"><label>Correo electrónico</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="admin@ejemplo.com" /></div>
                <div className="field full"><label>Contraseña temporal</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Mínimo 6 caracteres" /></div>
                <div className="field full"><label>Área de gestión</label><input value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} placeholder="Ej: Recetas del altiplano" /></div>
              </div>
              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setStep(1)}>← Atrás</button>
                <button className="btn-primary" onClick={() => setStep(3)}>Siguiente →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="superadmin-banner" style={{ marginBottom: '20px' }}>
                <div className="crown">⚠️</div>
                <div>
                  <h4>Confirma la creación</h4>
                  <p>Estás a punto de crear un administrador con acceso total al sistema.</p>
                </div>
              </div>
              <div style={{ background: 'var(--cream)', borderRadius: '12px', padding: '18px', marginBottom: '20px', fontSize: '0.88rem', lineHeight: '1.9' }}>
                <strong>Resumen de Cuenta:</strong><br />
                Nombre: {formData.name} {formData.lastName}<br />
                Correo: {formData.email}<br />
                Rol: Administrador<br />
                Especialidad: {formData.specialty || 'General'}
              </div>
              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              <div className="form-actions">
                <button className="btn-cancel" onClick={() => setStep(2)}>← Atrás</button>
                <button className="btn-primary" style={{ background: 'var(--bark)' }} onClick={handleCreateAdmin}>👑 Crear Administrador</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAdminModal;
