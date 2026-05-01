// backend/services/adminService.js
const adminRepo  = require('../repositories/adminRepository');
const avocatRepo = require('../repositories/avocatRepository');
const notifRepo  = require('../repositories/notificationRepository');

const getStats = async () => {
  return await adminRepo.getStats();
};

const getAvocatsAVerifier = async () => {
  return await avocatRepo.findNonVerifies();
};

const validerAvocat = async (id) => {
  const avocat = await avocatRepo.findById(id);
  if (!avocat) throw { status: 404, message: 'Avocat introuvable' };

  await avocatRepo.valider(id);

  await notifRepo.create({
    destinataire_id: id,
    role_destinataire: 'avocat',
    demande_id: null,
    type: 'profil_verifie',
    message: 'Votre profil a été vérifié. Le badge "Vérifié" est maintenant affiché.',
  });

  return { message: 'Profil validé avec succès' };
};

const rejeterAvocat = async (id) => {
  const avocat = await avocatRepo.findById(id);
  if (!avocat) throw { status: 404, message: 'Avocat introuvable' };

  await avocatRepo.rejeter(id);

  await notifRepo.create({
    destinataire_id: id,
    role_destinataire: 'avocat',
    demande_id: null,
    type: 'message',
    message: 'Votre profil n\'a pas pu être vérifié. Veuillez corriger vos informations.',
  });

  return { message: 'Profil rejeté' };
};

module.exports = { getStats, getAvocatsAVerifier, validerAvocat, rejeterAvocat };