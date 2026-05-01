const rdvRepo     = require('../repositories/rendezVousRepository');
const demandeRepo = require('../repositories/demandeRepository');
const notifRepo   = require('../repositories/notificationRepository');

const creer = async ({ demande_id, date_heure, duree_minutes, lieu }, client_id) => {
  const demande = await demandeRepo.findById(demande_id);
  if (!demande) throw { status: 404, message: 'Demande introuvable' };
  if (demande.client_id !== client_id) throw { status: 403, message: 'Accès refusé' };
  if (demande.statut !== 'acceptee') throw { status: 400, message: 'La demande doit être acceptée pour créer un RDV' };

  const existant = await rdvRepo.findByDemandeId(demande_id);
  if (existant) throw { status: 409, message: 'Un rendez-vous existe déjà pour cette demande' };

  const id = await rdvRepo.create({ demande_id, date_heure, duree_minutes, lieu });

  // Notifier l'avocat
  await notifRepo.create({
    destinataire_id: demande.avocat_id,
    role_destinataire: 'avocat',
    demande_id,
    type: 'rdv_confirme',
    message:           `Un rendez-vous a été planifié pour le ${date_heure}.`,
  });

  // Notifier le client
  await notifRepo.create({
    destinataire_id:   client_id,
    role_destinataire: 'client',
    demande_id,
    type:              'rdv_confirme',
    message:           `Votre rendez-vous est confirmé pour le ${date_heure}.`,
  });

  return { id, demande_id, date_heure, duree_minutes, lieu, statut: 'en_attente' };
};

const getAgendaAvocat = async (avocat_id) => {
  return await rdvRepo.findByAvocatId(avocat_id);
};

const changerStatut = async (id, statut) => {
  await rdvRepo.changerStatut(id, statut);
  return { id, statut };
};

module.exports = { creer, getAgendaAvocat, changerStatut };