const demandeService = require('../services/demandeService');

const envoyer = async (req, res) => {
  try {
    const data = await demandeService.envoyer({
      client_id: req.user.id,
      ...req.body,
    });
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const mesDemandes = async (req, res) => {
  try {
    let data;
    if (req.user.role === 'client') {
      data = await demandeService.getMesDemandesClient(req.user.id);
    } else if (req.user.role === 'avocat') {
      data = await demandeService.getMesDemandesAvocat(req.user.id);
    } else {
      data = await demandeService.getToutesDemandes();
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const changerStatut = async (req, res) => {
  try {
    const data = await demandeService.changerStatut(
      req.params.id,
      req.body.statut,
      req.user.id
    );
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = { envoyer, mesDemandes, changerStatut };