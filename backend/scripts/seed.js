const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require('../src/infrastructure/db/connection');
const User = require('../src/domain/models/User');
const Recipe = require('../src/domain/models/Recipe');

const seedDB = async () => {
  await connectDB();

  console.log("⚠️ Limpiando base de datos...");
  await User.deleteMany({});
  await Recipe.deleteMany({});

  console.log("👤 Creando usuarios...");
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('admin123', salt);
  const userPassword = await bcrypt.hash('cocinera123', salt);

  const admin = await User.create({
    name: 'Administrador',
    lastName: 'Principal',
    email: 'admin@tlaxcala.com',
    password: adminPassword,
    specialty: 'Gastronomía Tlaxcalteca',
    role: 'admin',
    isMainAdmin: true
  });

  const cocinera = await User.create({
    name: 'Doña Esperanza',
    lastName: 'Sánchez',
    email: 'cocinera@tlaxcala.com',
    password: userPassword,
    specialty: 'Huamantla',
    role: 'usuario'
  });

  console.log("🍲 Creando recetas...");
  await Recipe.create({
    name: 'Mole Prieto Tlaxcalteca',
    category: 'Moles y Salsas',
    origin: 'Tlaxcala Centro',
    time: 180,
    portions: 10,
    calories: 850,
    difficulty: 'Difícil',
    emoji: '🫕',
    color: '#3a1a08',
    desc: 'El mole más representativo de Tlaxcala, de color oscuro e intenso sabor a chile mulato y chocolate de metate.',
    ingredients: [
      '10 chiles mulatos secos',
      '5 chiles anchos',
      '3 chiles pasilla',
      '100g chocolate de metate tlaxcalteca'
    ],
    steps: [
      'Desvenar y tostar ligeramente los chiles en comal',
      'Remojar los chiles en agua caliente 30 minutos',
      'Moler todos los ingredientes en molino o licuadora con caldo',
      'Cocer a fuego lento 1 hora moviendo para que no se pegue'
    ],
    history: 'Su origen se remonta a la época prehispánica, cuando los señoríos tlaxcaltecas usaban el maíz y cacao en ceremonias dedicadas a sus deidades.',
    curiosidades: [
      'En la Feria de Santa Ana Chiautempan se sirven toneladas de este mole en cazuelas gigantes.'
    ],
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Mole_poblano.jpg/640px-Mole_poblano.jpg'
    ],
    authorId: cocinera._id,
    authorName: 'Doña Esperanza Sánchez',
    status: 'aprobada',
    featured: true
  });

  console.log("✅ Datos iniciales exportados a MongoDB correctamente.");
  process.exit();
};

seedDB();
