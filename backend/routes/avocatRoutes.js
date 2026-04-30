const router = require('express').Router();
const controller = require('../controllers/avocatController');
const { verifierToken, autoriser } = require('../config/auth');

// Publiques
router.get('/', controller.rechercher);
router.get('/:id', controller.getProfil);

// Protégées : avocat seulement
router.put('/profil/modifier', verifierToken, autoriser('avocat'), controller.modifierProfil);
router.post('/portfolio', verifierToken, autoriser('avocat'), controller.ajouterPortfolio);
router.delete('/portfolio/:id', verifierToken, autoriser('avocat'), controller.supprimerPortfolio);
router.post('/disponibilites', verifierToken, autoriser('avocat'), controller.ajouterDisponibilite);
router.delete('/disponibilites/:id', verifierToken, autoriser('avocat'), controller.supprimerDisponibilite);

module.exports = router;