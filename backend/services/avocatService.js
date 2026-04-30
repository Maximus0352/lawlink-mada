const avocatRepo = require('../repositories/avocatRepository');
const portfolioRepo = require('../repositories/portfolioRepository');
const disponibiliteRepo = require('../repositories/disponibiliteRepository');

const rechercher = async (filtres) => {
  return await avocatRepo.findAll(filtres);
};

const getProfil = async (id) => {
  const avocat = await avocatRepo.findById(id);
  if (!avocat) throw { status: 404, message: 'Avocat introuvable' };

  const portfolio      = await portfolioRepo.findByAvocatId(id);
  const disponibilites = await disponibiliteRepo.findByAvocatId(id);

  return { ...avocat, portfolio, disponibilites };
};

const modifierProfil = async (id, données) => {
  await avocatRepo.update(id, données);
  return await avocatRepo.findById(id);
};

const ajouterPortfolio = async (avocat_id, { titre, description, domaine }) => {
  const insertId = await portfolioRepo.create({ avocat_id, titre, description, domaine });
  return { id: insertId, avocat_id, titre, description, domaine };
};

const supprimerPortfolio = async (id, avocat_id) => {
  await portfolioRepo.remove(id, avocat_id);
};

const ajouterDisponibilite = async (avocat_id, { date, heure_debut, heure_fin }) => {
  const insertId = await disponibiliteRepo.create({ avocat_id, date, heure_debut, heure_fin });
  return { id: insertId, avocat_id, date, heure_debut, heure_fin };
};

const supprimerDisponibilite = async (id, avocat_id) => {
  await disponibiliteRepo.remove(id, avocat_id);
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