import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import '../../styles/admin.css';

const AdminClients = () => {
  const { t } = useTranslation();
  const [clients, setClients] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    api.get('/admin/clients')
      .then(res => setClients(res.data.data || []))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const filtres = recherche
    ? clients.filter(c => `${c.nom} ${c.prenom} ${c.email}`.toLowerCase().includes(recherche.toLowerCase()))
    : clients;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('admin.clients_title')}</h1>
        <p className="page-sous">{clients.length} {t('admin.manage_clients_desc')}</p>

        <input className="recherche-admin" placeholder={t('admin.search_client')}
          value={recherche} onChange={e => setRecherche(e.target.value)} />

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : filtres.length === 0 ? (
          <div className="vide">{t('admin.no_clients')}</div>
        ) : (
          <div className="carte">
            <table className="tableau">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>{t('admin.registered_on')}</th>
                </tr>
              </thead>
              <tbody>
                {filtres.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div className="avocat-info-admin">
                        <div className="admin-av-avatar" style={{ background:'var(--vert-clair)', color:'var(--vert)' }}>
                          {c.prenom?.[0]}{c.nom?.[0]}
                        </div>
                        <strong>{c.prenom} {c.nom}</strong>
                      </div>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.telephone || '—'}</td>
                    <td>{c.adresse  || '—'}</td>
                    <td>{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClients;
