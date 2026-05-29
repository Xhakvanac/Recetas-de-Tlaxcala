const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/infrastructure/db/connection');

const authRoutes = require('./src/interfaces/routes/authRoutes');
const recipeRoutes = require('./src/interfaces/routes/recipeRoutes');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexión a Base de Datos
connectDB();

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

// Manejo básico de errores de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
