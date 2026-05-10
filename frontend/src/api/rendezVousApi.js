import api from './axios';

export const creer = (data) => api.post('/rendez-vous', data);
export const agenda = () => api.get('/rendez-vous/agenda');
export const changerStatut = (id, statut) => api.patch(`/rendez-vous/${id}/statut`, { statut });