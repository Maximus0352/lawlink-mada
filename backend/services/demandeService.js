const demandeRepo      = require('../repositories/demandeRepository');
const notifRepo        = require('../repositories/notificationRepository');
const avocatRepo       = require('../repositories/avocatRepository');

const envoyer = async ({ client_id, avocat_id, objet, message }) => {
  const avocat = await avocatRepo.findById(avocat_id);
  if (!avocat) throw { status: 404, message: 'Avocat introuvable' };

  const id = await demandeRepo.create({ client_id, avocat_id, objet, message });

  // Notifier l'avocat
  await notifRepo.create({
    destinataire_id: avocat_id,
    role_destinataire: 'avocat',
    demande_id: id,
    type: 'nouvelle_demande',
    message: `Vous avez reçu une nouvelle demande de contact.`,
  });

  return { id, statut: 'envoyee' };
};

const getMesDemandesClient = async (client_id) => {
  return await demandeRepo.findByClientId(client_id);
};

const getMesDemandesAvocat = async (avocat_id) => {
  return await demandeRepo.findByAvocatId(avocat_id);
};

const getToutesDemandes = async () => {
  return await demandeRepo.findAll();
};

const changerStatut = async (id, statut, avocat_id) => {
  const demande = await demandeRepo.findById(id);
  if (!demande) throw { status: 404, message: 'Demande introuvable' };
  if (demande.avocat_id !== avocat_id) throw { status: 403, message: 'Accès refusé' };

  await demandeRepo.changerStatut(id, statut);

  // Notifier le client
  const type = statut === 'acceptee' ? 'demande_acceptee' : 'demande_refusee';
  const msg  = statut === 'acceptee'
    ? 'Votre demande a été acceptée par l\'avocat.'
    : 'Votre demande a été refusée par l\'avocat.';

  await notifRepo.create({
    destinataire_id: demande.client_id,
    role_destinataire: 'client',
    demande_id: id,
    type,
    message: msg,
  });

  return { id, statut };
};

module.exports = {
  envoyer,
  getMesDemandesClient,
  getMesDemandesAvocat,
  getToutesDemandes,
  changerStatut,
};