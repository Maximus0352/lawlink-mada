import api from './axios';

export const rechercher = (params) => api.get('/avocats', { params });
export const getProfil = (id) => api.get(`/avocats/${id}`);
export const modifierProfil = (data) => api.put('/avocats/profil/modifier', data);
export const ajouterPortfolio = (data) => api.post('/avocats/portfolio', data);
export const supprimerPortfolio = (id) => api.delete(`/avocats/portfolio/${id}`);
export const ajouterDispo = (data) => api.post('/avocats/disponibilites', data);
export const supprimerDispo = (id) => api.delete(`/avocats/disponibilites/${id}`);