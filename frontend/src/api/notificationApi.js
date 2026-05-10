import api from './axios';

export const mesNotifications = () => api.get('/notifications');
export const marquerLue = (id) => api.patch(`/notifications/${id}/lue`);
export const marquerToutesLues = () => api.patch('/notifications/toutes/lues');