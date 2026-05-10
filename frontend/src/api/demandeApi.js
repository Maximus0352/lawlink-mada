import api from './axios';

export const envoyer = (data) => api.post('/demandes', data);
export const mesDemandes = () => api.get('/demandes');
export const changerStatut = (id, statut) => api.patch(`/demandes/${id}/statut`, { statut });