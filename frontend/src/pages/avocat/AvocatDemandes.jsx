import React, { useEffect, useState } from 'react';
import { mesDemandes, changerStatut } from '../../api/demandeApi';
import { useTranslation } from 'react-i18next';
import '../../styles/avocat.css';

const AvocatDemandes = () => {
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('tout');
  const [succes, setSucces] = useState('');

  const charger = async () => {
    try {
      const res = await mesDemandes();
      setDemandes(res.data.data || []);
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  const handleStatut = async (id, statut) => {
    try {
      await changerStatut(id, statut);
      setSucces(statut === 'acceptee' ? t('avocat.accepted_msg') : t('avocat.rejected_msg'));
      setTimeout(() => setSucces(''), 3000);
      charger();
    } catch {}
  };

  const filtrees = filtre === 'tout'
    ? demandes
    : filtre === 'attente'
    ? demandes.filter(d => ['envoyee','recue'].includes(d.statut))
    : demandes.filter(d => d.statut === filtre);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('avocat.requests_title')}</h1>

        {succes && <div className="alerte alerte-succes">{succes}</div>}

        <div className="filtres-barre">
          {[
            { val: 'tout',    label: t('avocat.all') },
            { val: 'attente', label: t('avocat.pending_filter') },
            { val: 'acceptee',label: t('avocat.accepted_filter') },
            { val: 'refusee', label: t('avocat.rejected_filter') },
          ].map(f => (
            <button key={f.val} className={`filtre-btn ${filtre === f.val ? 'actif' : ''}`}
              onClick={() => setFiltre(f.val)}>{f.label}</button>
          ))}
        </div>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : filtrees.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">📭</div>
            {t('avocat.no_demands')}
          </div>
        ) : (
          <div className="demandes-liste">
            {filtrees.map(d => (
              <div key={d.id} className="demande-carte">
                <div className="demande-entete">
                  <div>
                    <div className="demande-client">{d.client_prenom} {d.client_nom}</div>
                    <div className="demande-date-small">{new Date(d.date_envoi).toLocaleDateString('fr-FR')}</div>
                  </div>
                  <span className={`badge badge-${d.statut}`}>{d.statut.replace('_',' ')}</span>
                </div>
                <div className="demande-objet">{d.objet}</div>
                <div className="demande-message">{d.message}</div>
                {['envoyee','recue'].includes(d.statut) && (
                  <div className="demande-actions">
                    <button className="btn btn-succes btn-sm" onClick={() => handleStatut(d.id, 'acceptee')}>
                      <i className="fa-solid fa-check"/> {t('avocat.accept')}
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleStatut(d.id, 'refusee')}>
                      <i className="fa-solid fa-xmark"/> {t('avocat.reject')}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvocatDemandes;
