import api from './axios';

export const inscrireClient = (data) => api.post('/auth/inscription-client', data);
export const inscrireAvocat = (data) => api.post('/auth/inscription-avocat', data);
export const connecter = (data) => api.post('/auth/connexion', data);
export const moi = () => api.get('/auth/moi');