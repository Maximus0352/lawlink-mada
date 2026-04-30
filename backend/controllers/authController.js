const authService = require('../services/authService');

const inscrireClient = async (req, res) => {
  try {
    const data = await authService.inscrireClient(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const inscrireAvocat = async (req, res) => {
  try {
    const data = await authService.inscrireAvocat(req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const connecter = async (req, res) => {
  try {
    const data = await authService.connecter(req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const moi = (req, res) => {
  res.json({ success: true, data: req.user });
};

module.exports = { inscrireClient, inscrireAvocat, connecter, moi };