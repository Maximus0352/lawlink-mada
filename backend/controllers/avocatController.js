const avocatService = require('../services/avocatService');

const rechercher = async (req, res) => {
  try {
    const data = await avocatService.rechercher(req.query);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const getProfil = async (req, res) => {
  try {
    const data = await avocatService.getProfil(req.params.id);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const modifierProfil = async (req, res) => {
  try {
    const data = await avocatService.modifierProfil(req.user.id, req.body);
    res.json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const ajouterPortfolio = async (req, res) => {
  try {
    const data = await avocatService.ajouterPortfolio(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const supprimerPortfolio = async (req, res) => {
  try {
    await avocatService.supprimerPortfolio(req.params.id, req.user.id);
    res.json({ success: true, message: 'Portfolio supprimé' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const ajouterDisponibilite = async (req, res) => {
  try {
    const data = await avocatService.ajouterDisponibilite(req.user.id, req.body);
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

const supprimerDisponibilite = async (req, res) => {
  try {
    await avocatService.supprimerDisponibilite(req.params.id, req.user.id);
    res.json({ success: true, message: 'Disponibilité supprimée' });
  } catch (err) {
    res.status(err.status || 500).json({ success: false, message: err.message });
  }
};

module.exports = {
  rechercher,
  getProfil,
  modifierProfil,
  ajouterPortfolio,
  supprimerPortfolio,
  ajouterDisponibilite,
  supprimerDisponibilite,
};