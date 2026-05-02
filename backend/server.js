// backend/server.js
require('dotenv').config();
require('./config/db');

const express = require('express');
const cors    = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/avocats',       require('./routes/avocatRoutes'));
app.use('/api/demandes',      require('./routes/demandeRoutes'));
app.use('/api/rendez-vous',   require('./routes/rendezVousRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin',         require('./routes/adminRoutes'));

// Route de santé
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Route inconnue
app.use((req, res) => res.status(404).json({ message: 'Route introuvable' }));

// Erreur globale
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Erreur serveur' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
