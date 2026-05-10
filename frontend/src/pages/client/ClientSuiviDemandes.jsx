import React, { useEffect, useState } from 'react';
import { mesDemandes } from '../../api/demandeApi';
import { creer as creerRDV } from '../../api/rendezVousApi';
import { useTranslation } from 'react-i18next';
import '../../styles/client.css';

const STATUTS_ENCOURS = ['envoyee', 'recue', 'acceptee', 'en_cours'];

const ModalRDV = ({ demande, onFermer, onSuccess }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ date_heure: '', duree_minutes: 60, lieu: '' });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true); setErreur('');
    try {
      await creerRDV({ demande_id: demande.id, ...form });
      onSuccess();
      onFermer();
    } catch (err) {
      setErreur(err.response?.data?.message || t('common.error'));
    } finally { setEnvoi(false); }
  };

  return (
    <div className="modal-fond" onClick={onFermer}>
      <div className="modal-boite" onClick={e => e.stopPropagation()}>
        <button className="modal-fermer" onClick={onFermer}>✕</button>
        <h2 style={{ marginBottom: 8, fontSize: '1.15rem', fontWeight: 800 }}>{t('client.rdv_title')}</h2>
        <p style={{ color: 'var(--gris)', marginBottom: 18, fontSize: '0.88rem' }}>
          avec Me {demande.avocat_prenom} {demande.avocat_nom}
        </p>
        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}
        <form onSubmit={handleSubmit}>
          <div className="champ">
            <label>{t('client.rdv_date')} *</label>
            <input type="datetime-local" value={form.date_heure}
              onChange={e => setForm(f => ({ ...f, date_heure: e.target.value }))} required />
          </div>
          <div className="champ">
            <label>{t('client.rdv_duration')}</label>
            <select value={form.duree_minutes} onChange={e => setForm(f => ({ ...f, duree_minutes: e.target.value }))}>
              <option value={30}>30 min</option>
              <option value={60}>1h</option>
              <option value={90}>1h30</option>
              <option value={120}>2h</option>
            </select>
          </div>
          <div className="champ">
            <label>{t('client.rdv_place')}</label>
            <input value={form.lieu} onChange={e => setForm(f => ({ ...f, lieu: e.target.value }))}
              placeholder="Cabinet, visio..." />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onFermer}>{t('client.cancel')}</button>
            <button type="submit" className="btn btn-primaire" style={{ flex: 1 }} disabled={envoi}>
              {envoi ? '...' : t('client.rdv_confirm')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientSuiviDemandes = () => {
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [rdvDemande, setRdvDemande] = useState(null);
  const [succes, setSucces] = useState('');

  const charger = async () => {
    try {
      const res = await mesDemandes();
      const toutes = res.data.data || [];
      setDemandes(toutes.filter(d => STATUTS_ENCOURS.includes(d.statut)));
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('client.my_requests_title')}</h1>
        {succes && <div className="alerte alerte-succes">{succes}</div>}

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : demandes.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">📋</div>
            {t('client.no_requests')}
          </div>
        ) : (
          <div className="demandes-liste">
            {demandes.map(d => (
              <div key={d.id} className="demande-carte">
                <div className="demande-entete">
                  <div>
                    <div className="demande-avocat">Me {d.avocat_prenom} {d.avocat_nom}</div>
                    <div className="demande-specialite">{d.specialite}</div>
                  </div>
                  <span className={`badge badge-${d.statut}`}>{d.statut.replace('_',' ')}</span>
                </div>
                <div className="demande-objet">{d.objet}</div>
                <div className="demande-message">{d.message}</div>
                <div className="demande-footer">
                  <span className="demande-date">{new Date(d.date_envoi).toLocaleDateString('fr-FR')}</span>
                  {d.statut === 'acceptee' && (
                    <button className="btn btn-succes btn-sm" onClick={() => setRdvDemande(d)}>
                      <i className="fa-solid fa-calendar-days"/> {t('client.rdv_confirm')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {rdvDemande && (
        <ModalRDV demande={rdvDemande} onFermer={() => setRdvDemande(null)}
          onSuccess={() => { charger(); setSucces(t('client.rdv_sent')); setTimeout(() => setSucces(''), 3000); }} />
      )}
    </div>
  );
};

export default ClientSuiviDemandes;