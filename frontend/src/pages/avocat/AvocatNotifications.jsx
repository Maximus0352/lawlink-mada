import React, { useEffect, useState } from 'react';
import { mesNotifications, marquerLue, marquerToutesLues } from '../../api/notificationApi';
import { useTranslation } from 'react-i18next';
import '../../styles/avocat.css';

const AvocatNotifications = () => {
  const { t } = useTranslation();
  const [notifs, setNotifs] = useState([]);
  const [chargement, setChargement] = useState(true);

  const charger = async () => {
    try {
      const res = await mesNotifications();
      setNotifs(res.data.data || []);
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  const handleLue = async (id) => {
    await marquerLue(id);
    setNotifs(n => n.map(x => x.id === id ? { ...x, est_lue: 1 } : x));
  };

  const handleToutesLues = async () => {
    await marquerToutesLues();
    setNotifs(n => n.map(x => ({ ...x, est_lue: 1 })));
  };

  const nonLues = notifs.filter(n => !n.est_lue).length;

  return (
    <div className="page">
      <div className="container">
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 20 }}>
          <div>
            <h1 className="page-titre">{t('avocat.notifs_title')}</h1>
            <p className="page-sous">{nonLues} non lue(s)</p>
          </div>
          {nonLues > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={handleToutesLues}>
              <i className="fa-solid fa-check-double"/> Tout marquer comme lu
            </button>
          )}
        </div>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : notifs.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">🔔</div>
            {t('avocat.no_notifs')}
          </div>
        ) : (
          <div className="notifs-liste">
            {notifs.map(n => (
              <div key={n.id} className={`notif-item ${!n.est_lue ? 'non-lue' : ''}`}>
                <div className="notif-point"/>
                <div className="notif-contenu">
                  <p className="notif-message">{n.message}</p>
                  <span className="notif-date">{new Date(n.date_envoi).toLocaleString('fr-FR')}</span>
                </div>
                {!n.est_lue && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleLue(n.id)}>
                    Marquer lu
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvocatNotifications;
