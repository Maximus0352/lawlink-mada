import React, { useEffect, useState } from 'react';
import { agenda, changerStatut } from '../../api/rendezVousApi';
import { useTranslation } from 'react-i18next';
import '../../styles/avocat.css';

const AvocatAgenda = () => {
  const { t } = useTranslation();
  const [rdvs, setRdvs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState('upcoming');
  const [succes, setSucces] = useState('');

  const charger = async () => {
    try {
      const res = await agenda();
      setRdvs(res.data.data || []);
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  const handleStatut = async (id, statut) => {
    try {
      await changerStatut(id, statut);
      setSucces('Statut mis à jour !');
      setTimeout(() => setSucces(''), 3000);
      charger();
    } catch {}
  };

  const futurs = rdvs.filter(r => new Date(r.date_heure) >= new Date());
  const passes = rdvs.filter(r => new Date(r.date_heure) <  new Date());
  const liste  = onglet === 'upcoming' ? futurs : passes;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('avocat.agenda_title')}</h1>
        {succes && <div className="alerte alerte-succes">{succes}</div>}

        <div className="agenda-tabs">
          <button className={`agenda-tab ${onglet === 'upcoming' ? 'actif' : ''}`} onClick={() => setOnglet('upcoming')}>
            {t('avocat.upcoming')} ({futurs.length})
          </button>
          <button className={`agenda-tab ${onglet === 'past' ? 'actif' : ''}`} onClick={() => setOnglet('past')}>
            {t('avocat.past')} ({passes.length})
          </button>
        </div>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : liste.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">📅</div>
            {t('avocat.no_agenda')}
          </div>
        ) : (
          <div className="rdvs-liste">
            {liste.map(r => (
              <div key={r.id} className={`rdv-carte ${onglet === 'past' ? 'passe' : ''}`}>
                <div className="rdv-date-bloc">
                  <div className="rdv-jour">
                    {new Date(r.date_heure).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' })}
                  </div>
                  <div className="rdv-heure">
                    {new Date(r.date_heure).toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' })}
                  </div>
                </div>
                <div className="rdv-details">
                  <div className="rdv-client-nom">{r.client_prenom} {r.client_nom}</div>
                  <div className="rdv-objet">{r.objet}</div>
                  {r.lieu && <div className="rdv-lieu"><i className="fa-solid fa-location-dot"/> {r.lieu}</div>}
                  <div className="rdv-duree">⏱ {r.duree_minutes} min</div>
                </div>
                <div>
                  <span className={`badge badge-${r.statut === 'confirme' ? 'acceptee' : r.statut}`}>
                    {r.statut}
                  </span>
                  {r.statut === 'confirme' && onglet === 'upcoming' && (
                    <button className="btn btn-danger btn-sm" style={{ marginTop: 8, display: 'block' }}
                      onClick={() => handleStatut(r.id, 'annule')}>Annuler</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvocatAgenda;
