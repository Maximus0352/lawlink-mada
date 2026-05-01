const adminService = require('../services/adminService');

const getStats = async (req, res) => {
  try {
    const data = await adminService.getStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getAvocatsAVerifier = async (req, res) => {
  try {
    const data = await adminService.getAvocatsAVerifier();
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const validerAvocat = async (req, res) => {
  try {
    const data = await adminService.validerAvocat(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const rejeterAvocat = async (req, res) => {
  try {
    const data = await adminService.rejeterAvocat(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats, getAvocatsAVerifier, validerAvocat, rejeterAvocat };