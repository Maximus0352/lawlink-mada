import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import '../../styles/admin.css';

const AdminDemandes = () => {
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('tout');
  const [recherche, setRecherche] = useState('');

  useEffect(() => {
    api.get('/demandes')
      .then(res => setDemandes(res.data.data || []))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const filtrees = demandes
    .filter(d => filtre === 'tout' || d.statut === filtre)
    .filter(d => recherche === '' ||
      `${d.client_nom} ${d.client_prenom} ${d.avocat_nom} ${d.avocat_prenom} ${d.objet}`
        .toLowerCase().includes(recherche.toLowerCase())
    );

  const STATUTS = ['tout','envoyee','recue','acceptee','refusee','en_cours','terminee'];

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('admin.demands_title')}</h1>
        <p className="page-sous">{demandes.length} {t('admin.all_requests_desc')}</p>

        <input className="recherche-admin" placeholder="Rechercher par client, avocat ou objet..."
          value={recherche} onChange={e => setRecherche(e.target.value)} />

        <div className="filtres-barre">
          {STATUTS.map(s => (
            <button key={s} className={`filtre-btn ${filtre === s ? 'actif' : ''}`}
              onClick={() => setFiltre(s)}>
              {s === 'tout' ? t('admin.all') : s.replace('_',' ')}
            </button>
          ))}
        </div>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : filtrees.length === 0 ? (
          <div className="vide">{t('admin.no_demands')}</div>
        ) : (
          <div className="carte">
            <table className="tableau">
              <thead>
                <tr>
                  <th>{t('admin.from')}</th>
                  <th>{t('admin.to')}</th>
                  <th>{t('admin.object')}</th>
                  <th>{t('admin.date')}</th>
                  <th>{t('admin.status')}</th>
                </tr>
              </thead>
              <tbody>
                {filtrees.map(d => (
                  <tr key={d.id}>
                    <td><strong>{d.client_prenom} {d.client_nom}</strong></td>
                    <td>Me {d.avocat_prenom} {d.avocat_nom}</td>
                    <td>{d.objet}</td>
                    <td>{new Date(d.date_envoi).toLocaleDateString('fr-FR')}</td>
                    <td><span className={`badge badge-${d.statut}`}>{d.statut.replace('_',' ')}</span></td>
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

export default AdminDemandes;
