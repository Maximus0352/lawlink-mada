const notifService = require('../services/notificationService');

const mesDemandes = async (req, res) => {
  try {
    const data = await notifService.getMesNotifications(req.user.id, req.user.role);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const marquerLue = async (req, res) => {
  try {
    await notifService.marquerLue(req.params.id);
    res.json({ success: true, message: 'Notification marquée comme lue' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const marquerToutesLues = async (req, res) => {
  try {
    await notifService.marquerToutesLues(req.user.id, req.user.role);
    res.json({ success: true, message: 'Toutes les notifications marquées comme lues' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { mesDemandes, marquerLue, marquerToutesLues };