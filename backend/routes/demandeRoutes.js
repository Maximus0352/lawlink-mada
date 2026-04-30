const router = require('express').Router();
const controller = require('../controllers/demandeController');
const { verifierToken, autoriser } = require('../config/auth');

router.post('/', verifierToken, autoriser('client'), controller.envoyer);
router.get('/', verifierToken, controller.mesDemandes);
router.patch('/:id/statut', verifierToken, autoriser('avocat'), controller.changerStatut);

module.exports = router;