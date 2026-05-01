const router = require('express').Router();
const controller = require('../controllers/adminController');
const { verifierToken, autoriser } = require('../config/auth');

const admin = [verifierToken, autoriser('administrateur')];

router.get('/stats', ...admin, controller.getStats);
router.get('/avocats/a-verifier', ...admin, controller.getAvocatsAVerifier);
router.patch('/avocats/:id/valider', ...admin, controller.validerAvocat);
router.patch('/avocats/:id/rejeter', ...admin, controller.rejeterAvocat);

module.exports = router;