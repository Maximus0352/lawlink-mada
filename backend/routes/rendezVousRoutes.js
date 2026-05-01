const router     = require('express').Router();
const controller = require('../controllers/rendezVousController');
const { verifierToken, autoriser } = require('../config/auth');

router.post('/', verifierToken, autoriser('client'), controller.creer);
router.get('/agenda', verifierToken, autoriser('avocat'), controller.agenda);
router.patch('/:id/statut', verifierToken, autoriser('avocat'), controller.changerStatut);

module.exports = router;