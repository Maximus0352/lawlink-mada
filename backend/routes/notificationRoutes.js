const router = require('express').Router();
const controller = require('../controllers/notificationController');
const { verifierToken } = require('../config/auth');

router.get('/', verifierToken, controller.mesDemandes);
router.patch('/:id/lue', verifierToken, controller.marquerLue);
router.patch('/toutes/lues', verifierToken, controller.marquerToutesLues);

module.exports = router;