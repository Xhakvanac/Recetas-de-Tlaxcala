const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialty: { type: String, required: true }, // Municipio o especialidad
  role: { 
    type: String, 
    enum: ['visitante', 'usuario', 'admin'], 
    default: 'usuario' 
  },
  isMainAdmin: { type: Boolean, default: false }
}, {
  timestamps: true // createdAt, updatedAt
});

const User = mongoose.model('User', userSchema);
module.exports = User;
