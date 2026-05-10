import React, { useEffect, useState } from 'react';
import { mesDemandes } from '../../api/demandeApi';
import { useTranslation } from 'react-i18next';
import '../../styles/client.css';

const STATUTS_TERMINES = ['terminee', 'refusee'];

const ClientHistorique = () => {
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('tout');

  useEffect(() => {
    mesDemandes()
      .then(res => {
        const toutes = res.data.data || [];
        setDemandes(toutes.filter(d => STATUTS_TERMINES.includes(d.statut)));
      })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const filtrees = filtre === 'tout' ? demandes : demandes.filter(d => d.statut === filtre);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('client.history_title')}</h1>

        <div className="filtres-barre">
          {[
            { val: 'tout',     label: t('client.all') },
            { val: 'terminee', label: 'Terminées' },
            { val: 'refusee',  label: 'Refusées' },
          ].map(f => (
            <button key={f.val} className={`filtre-btn ${filtre === f.val ? 'actif' : ''}`}
              onClick={() => setFiltre(f.val)}>{f.label}</button>
          ))}
        </div>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : filtrees.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">📂</div>
            {t('client.no_history')}
          </div>
        ) : (
          <div className="carte">
            <table className="tableau">
              <thead>
                <tr>
                  <th>Avocat</th>
                  <th>Spécialité</th>
                  <th>Objet</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtrees.map(d => (
                  <tr key={d.id}>
                    <td><strong>Me {d.avocat_prenom} {d.avocat_nom}</strong></td>
                    <td>{d.specialite}</td>
                    <td>{d.objet}</td>
                    <td>{new Date(d.date_envoi).toLocaleDateString('fr-FR')}</td>
                    <td><span className={`badge badge-${d.statut}`}>{d.statut}</span></td>
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

export default ClientHistorique;
