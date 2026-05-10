import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mesDemandes } from '../../api/demandeApi';
import { mesNotifications } from '../../api/notificationApi';
import { agenda } from '../../api/rendezVousApi';
import { useTranslation } from 'react-i18next';
import '../../styles/avocat.css';

const AvocatDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [stats, setStats] = useState({ total: 0, enAttente: 0, acceptees: 0, rdv: 0, notifs: 0 });
  const [prochainRDV, setProchainRDV] = useState(null);

  useEffect(() => {
    const charger = async () => {
      try {
        const [resDemandes, resNotifs, resAgenda] = await Promise.all([
          mesDemandes(), mesNotifications(), agenda(),
        ]);
        const demandes = resDemandes.data.data || [];
        const notifs   = resNotifs.data.data   || [];
        const rdvs     = resAgenda.data.data    || [];

        setStats({
          total:     demandes.length,
          enAttente: demandes.filter(d => ['envoyee','recue'].includes(d.statut)).length,
          acceptees: demandes.filter(d => d.statut === 'acceptee').length,
          rdv:       rdvs.filter(r => r.statut === 'confirme').length,
          notifs:    notifs.filter(n => !n.est_lue).length,
        });

        const futurs = rdvs
          .filter(r => r.statut === 'confirme' && new Date(r.date_heure) > new Date())
          .sort((a, b) => new Date(a.date_heure) - new Date(b.date_heure));
        setProchainRDV(futurs[0] || null);
      } catch {}
    };
    charger();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('avocat.dashboard_title')}</h1>
        <p className="page-sous">{t('avocat.hello')} {user?.prenom} {user?.nom}</p>

        <div className="stats-grille">
          <div className="stat-carte">
            <div className="stat-val">{stats.total}</div>
            <div className="stat-label">{t('avocat.received_requests')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--orange)' }}>{stats.enAttente}</div>
            <div className="stat-label">{t('avocat.pending')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--vert)' }}>{stats.acceptees}</div>
            <div className="stat-label">{t('avocat.accepted')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--bleu)' }}>{stats.rdv}</div>
            <div className="stat-label">{t('avocat.confirmed_rdv')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--rouge)' }}>{stats.notifs}</div>
            <div className="stat-label">{t('avocat.unread_notifs')}</div>
          </div>
        </div>

        {prochainRDV && (
          <div className="carte prochain-rdv">
            <div className="section-titre">{t('avocat.next_rdv')}</div>
            <div className="rdv-info">
              <span className="rdv-date">
                📅 {new Date(prochainRDV.date_heure).toLocaleString('fr-FR')}
              </span>
              <span className="rdv-client">
                <i className="fa-solid fa-user"/> {prochainRDV.client_prenom} {prochainRDV.client_nom}
              </span>
              <span className="rdv-objet">{prochainRDV.objet}</span>
              {prochainRDV.lieu && <span className="rdv-lieu">📍 {prochainRDV.lieu}</span>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvocatDashboard;
