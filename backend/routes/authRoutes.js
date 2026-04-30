const router = require('express').Router();
const controller = require('../controllers/authController');
const { verifierToken } = require('../config/auth');

// POST /api/auth/inscription-client
router.post('/inscription-client', controller.inscrireClient);

// POST /api/auth/inscription-avocat
router.post('/inscription-avocat', controller.inscrireAvocat);

// POST /api/auth/connexion
router.post('/connexion', controller.connecter);

// GET /api/auth/moi
router.get('/moi', verifierToken, controller.moi);

module.exports = router;