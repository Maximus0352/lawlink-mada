const notifRepo = require('../repositories/notificationRepository');

const getMesNotifications = async (destinataire_id, role_destinataire) => {
  return await notifRepo.findByDestinataire(destinataire_id, role_destinataire);
};

const marquerLue = async (id) => {
  await notifRepo.marquerLue(id);
};

const marquerToutesLues = async (destinataire_id, role_destinataire) => {
  await notifRepo.marquerToutesLues(destinataire_id, role_destinataire);
};

module.exports = { getMesNotifications, marquerLue, marquerToutesLues };