import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mesDemandes } from '../../api/demandeApi';
import { mesNotifications } from '../../api/notificationApi';
import { useTranslation } from 'react-i18next';
import '../../styles/client.css';

const ClientAccueil = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [demandes, setDemandes] = useState([]);
  const [notifs, setNotifs]     = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      try {
        const [resDemandes, resNotifs] = await Promise.all([
          mesDemandes(),
          mesNotifications(),
        ]);
        setDemandes(resDemandes.data.data || []);
        setNotifs(resNotifs.data.data    || []);
      } catch {}
      finally { setChargement(false); }
    };
    charger();
  }, []);

  const demandesEnCours  = demandes.filter(d => ['envoyee','recue','acceptee','en_cours'].includes(d.statut));
  const dernieresDemandes = demandesEnCours.slice(0, 3);
  const nonLues          = notifs.filter(n => !n.est_lue).length;

  const heure = new Date().getHours();
  const salutation = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir';

  const statutStyle = (s) => {
    if (s === 'acceptee')  return { bg: 'var(--vert-clair)',   color: 'var(--vert)',   label: 'Acceptée' };
    if (s === 'refusee')   return { bg: 'var(--rouge-clair)',  color: 'var(--rouge)',  label: 'Refusée'  };
    if (s === 'en_cours')  return { bg: '#EEF0FE',             color: '#3B3FAE',       label: 'En cours' };
    if (s === 'recue')     return { bg: 'var(--orange-clair)', color: 'var(--orange)', label: 'Reçue'    };
    return                        { bg: 'var(--bleu-clair)',   color: 'var(--bleu)',   label: 'Envoyée'  };
  };

  return (
    <div className="accueil-page">

      {/* ── HERO BIENVENUE ── */}
      <div className="accueil-hero">
        <div className="accueil-hero-bg"/>
        <div className="container">
          <div className="accueil-hero-inner">
            <div className="accueil-hero-text">
              <p className="accueil-salut">{salutation} 👋</p>
              <h1 className="accueil-nom">{user?.prenom} {user?.nom}</h1>
              <p className="accueil-intro">
                Que recherchez-vous aujourd'hui ? Trouvez l'avocat qu'il vous faut en quelques clics.
              </p>
              <Link to="/recherche">
                <button className="btn btn-primaire btn-xl accueil-cta">
                  <i className="fa-solid fa-magnifying-glass"/>
                  Trouver un avocat
                </button>
              </Link>
            </div>

            {/* Notification badge si non lues */}
            {nonLues > 0 && (
              <Link to="/notifications" className="accueil-notif-banner">
                <div className="accueil-notif-dot"/>
                <span>
                  Vous avez <strong>{nonLues} notification{nonLues > 1 ? 's' : ''}</strong> non lue{nonLues > 1 ? 's' : ''}
                </span>
                <i className="fa-solid fa-arrow-right" style={{ marginLeft: 'auto', fontSize: '0.8rem' }}/>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container accueil-body">

        {/* ── ACTIONS RAPIDES ── */}
        <section className="accueil-section">
          <h2 className="accueil-section-titre">Que voulez-vous faire ?</h2>
          <div className="accueil-actions">
            <Link to="/recherche" className="accueil-action accueil-action--primary">
              <div className="accueil-action-icon">
                <i className="fa-solid fa-magnifying-glass"/>
              </div>
              <div className="accueil-action-body">
                <div className="accueil-action-titre">Rechercher un avocat</div>
                <div className="accueil-action-desc">Trouvez le bon professionnel selon votre besoin</div>
              </div>
              <i className="fa-solid fa-chevron-right accueil-action-arrow"/>
            </Link>

            <Link to="/mes-demandes" className="accueil-action">
              <div className="accueil-action-icon accueil-action-icon--orange">
                <i className="fa-solid fa-clock-rotate-left"/>
              </div>
              <div className="accueil-action-body">
                <div className="accueil-action-titre">Suivre mes demandes</div>
                <div className="accueil-action-desc">
                  {demandesEnCours.length > 0
                    ? `${demandesEnCours.length} demande${demandesEnCours.length > 1 ? 's' : ''} en cours`
                    : 'Aucune demande en cours'}
                </div>
              </div>
              <i className="fa-solid fa-chevron-right accueil-action-arrow"/>
            </Link>

            <Link to="/historique" className="accueil-action">
              <div className="accueil-action-icon accueil-action-icon--vert">
                <i className="fa-solid fa-folder-open"/>
              </div>
              <div className="accueil-action-body">
                <div className="accueil-action-titre">Historique</div>
                <div className="accueil-action-desc">Consultez toutes vos demandes passées</div>
              </div>
              <i className="fa-solid fa-chevron-right accueil-action-arrow"/>
            </Link>
          </div>
        </section>

        {/* ── DEMANDES RÉCENTES ── */}
        {!chargement && (
          <section className="accueil-section">
            <div className="accueil-section-head">
              <h2 className="accueil-section-titre">Demandes récentes</h2>
              {demandesEnCours.length > 0 && (
                <Link to="/mes-demandes" className="accueil-voir-tout">
                  Voir tout <i className="fa-solid fa-arrow-right"/>
                </Link>
              )}
            </div>

            {demandesEnCours.length === 0 ? (
              <div className="accueil-vide">
                <div className="accueil-vide-illustration">
                  <i className="fa-regular fa-folder-open"/>
                </div>
                <p className="accueil-vide-titre">Aucune demande en cours</p>
                <p className="accueil-vide-desc">Commencez par rechercher un avocat et envoyez votre première demande.</p>
                <Link to="/recherche">
                  <button className="btn btn-primaire btn-sm" style={{ marginTop: 14 }}>
                    <i className="fa-solid fa-magnifying-glass"/> Trouver un avocat
                  </button>
                </Link>
              </div>
            ) : (
              <div className="accueil-demandes">
                {dernieresDemandes.map(d => {
                  const st = statutStyle(d.statut);
                  return (
                    <div key={d.id} className="accueil-demande-item">
                      <div className="accueil-demande-avatar">
                        {d.avocat_prenom?.[0]}{d.avocat_nom?.[0]}
                      </div>
                      <div className="accueil-demande-info">
                        <div className="accueil-demande-nom">
                          Me {d.avocat_prenom} {d.avocat_nom}
                        </div>
                        <div className="accueil-demande-objet">{d.objet}</div>
                        <div className="accueil-demande-date">
                          {new Date(d.date_envoi).toLocaleDateString('fr-FR', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </div>
                      </div>
                      <span className="accueil-demande-statut" style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ── CONSEILS ── */}
        <section className="accueil-section">
          <h2 className="accueil-section-titre">Le saviez-vous ?</h2>
          <div className="accueil-conseils">
            <div className="accueil-conseil">
              <span className="accueil-conseil-icon">💡</span>
              <p>Décrivez votre situation clairement dans votre demande pour obtenir une réponse plus rapide de l'avocat.</p>
            </div>
            <div className="accueil-conseil">
              <span className="accueil-conseil-icon">🔒</span>
              <p>Tous vos échanges avec les avocats sont confidentiels et protégés par la plateforme LawLink Mada.</p>
            </div>
            <div className="accueil-conseil">
              <span className="accueil-conseil-icon">✅</span>
              <p>Les avocats portant le badge <strong>Vérifié</strong> ont été contrôlés par notre équipe via le Barreau de Madagascar.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default ClientAccueil;