const rendezVousService = require('../services/rendezVousService');

const creer = async (req, res) => {
  try {
    const data = await rendezVousService.creer(req.body, req.user.id);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const agenda = async (req, res) => {
  try {
    const data = await rendezVousService.getAgendaAvocat(req.user.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const changerStatut = async (req, res) => {
  try {
    const data = await rendezVousService.changerStatut(req.params.id, req.body.statut);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { creer, agenda, changerStatut };