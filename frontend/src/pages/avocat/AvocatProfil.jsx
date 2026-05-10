import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProfil, modifierProfil, ajouterPortfolio, supprimerPortfolio, ajouterDispo, supprimerDispo } from '../../api/avocatApi';
import { useTranslation } from 'react-i18next';
import '../../styles/avocat.css';

const AvocatProfil = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [profil, setProfil] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [succes, setSucces] = useState('');
  const [erreur, setErreur] = useState('');
  const [formProfil, setFormProfil] = useState({ nom:'', prenom:'', specialite:'', localisation:'', annees_experience:'', description:'' });
  const [editProfil, setEditProfil] = useState(false);
  const [formPortfolio, setFormPortfolio] = useState({ titre:'', description:'', domaine:'' });
  const [ajoutPortfolioOpen, setAjoutPortfolioOpen] = useState(false);
  const [formDispo, setFormDispo] = useState({ date:'', heure_debut:'', heure_fin:'' });
  const [ajoutDispoOpen, setAjoutDispoOpen] = useState(false);

  const charger = async () => {
    try {
      const res = await getProfil(user.id);
      const p = res.data.data;
      setProfil(p);
      setFormProfil({ nom: p.nom, prenom: p.prenom, specialite: p.specialite, localisation: p.localisation, annees_experience: p.annees_experience, description: p.description || '' });
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  const aff = (msg) => { setSucces(msg); setTimeout(() => setSucces(''), 3000); };

  const handleSauvegardeProfil = async (e) => {
    e.preventDefault(); setErreur('');
    try { await modifierProfil(formProfil); aff(t('avocat.profile_updated')); setEditProfil(false); charger(); }
    catch (err) { setErreur(err.response?.data?.message || t('common.error')); }
  };

  const handleAjouterPortfolio = async (e) => {
    e.preventDefault(); setErreur('');
    try { await ajouterPortfolio(formPortfolio); setFormPortfolio({ titre:'', description:'', domaine:'' }); setAjoutPortfolioOpen(false); aff(t('avocat.portfolio_added')); charger(); }
    catch (err) { setErreur(err.response?.data?.message || t('common.error')); }
  };

  const handleSupprimerPortfolio = async (id) => {
    if (!confirm('Supprimer ?')) return;
    try { await supprimerPortfolio(id); aff(t('avocat.portfolio_deleted')); charger(); } catch {}
  };

  const handleAjouterDispo = async (e) => {
    e.preventDefault(); setErreur('');
    try { await ajouterDispo(formDispo); setFormDispo({ date:'', heure_debut:'', heure_fin:'' }); setAjoutDispoOpen(false); aff(t('avocat.dispo_added')); charger(); }
    catch (err) { setErreur(err.response?.data?.message || t('common.error')); }
  };

  const handleSupprimerDispo = async (id) => {
    try { await supprimerDispo(id); charger(); } catch {}
  };

  if (chargement) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('avocat.profile_title')}</h1>

        {succes && <div className="alerte alerte-succes">{succes}</div>}
        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}

        {/* Statut vérification */}
        <div className={`profil-statut ${profil.est_verifie === 1 ? 'verified' : 'pending'}`}>
          {profil.est_verifie === 1
            ? <><i className="fa-solid fa-circle-check"/> {t('avocat.status_verified')}</>
            : <><i className="fa-solid fa-clock"/> {t('avocat.status_pending')}</>
          }
        </div>

        {/* Informations générales */}
        <div className="carte" style={{ marginBottom: 20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
            <div className="section-titre" style={{ marginBottom: 0 }}>Informations générales</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditProfil(!editProfil)}>
              {editProfil ? t('avocat.cancel') : <><i className="fa-solid fa-pen-to-square"/> {t('avocat.edit_profile')}</>}
            </button>
          </div>

          {editProfil ? (
            <form onSubmit={handleSauvegardeProfil}>
              <div className="form-ligne">
                <div className="champ"><label>{t('avocat.speciality')}</label>
                  <input value={formProfil.specialite} onChange={e => setFormProfil(f => ({ ...f, specialite: e.target.value }))} required />
                </div>
                <div className="champ"><label>{t('avocat.location')}</label>
                  <input value={formProfil.localisation} onChange={e => setFormProfil(f => ({ ...f, localisation: e.target.value }))} required />
                </div>
              </div>
              <div className="champ"><label>{t('avocat.experience')}</label>
                <input type="number" value={formProfil.annees_experience} onChange={e => setFormProfil(f => ({ ...f, annees_experience: e.target.value }))} />
              </div>
              <div className="champ"><label>{t('avocat.description')}</label>
                <textarea value={formProfil.description} onChange={e => setFormProfil(f => ({ ...f, description: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primaire btn-sm">{t('avocat.save')}</button>
            </form>
          ) : (
            <div className="profil-affichage">
              <div className="profil-avatar">{profil.prenom?.[0]}{profil.nom?.[0]}</div>
              <div>
                <div className="profil-nom">Me {profil.prenom} {profil.nom}</div>
                <div className="profil-details">
                  <span><i className="fa-solid fa-scale-balanced"/> {profil.specialite}</span>
                  <span><i className="fa-solid fa-location-dot"/> {profil.localisation}</span>
                  <span><i className="fa-solid fa-clock"/> {profil.annees_experience} {t('common.years')}</span>
                  <span><i className="fa-solid fa-id-card"/> N° {profil.numero_barre}</span>
                </div>
                {profil.description && <p className="profil-desc">{profil.description}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Portfolio */}
        <div className="carte" style={{ marginBottom: 20 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
            <div className="section-titre" style={{ marginBottom: 0 }}>{t('avocat.portfolio_title')}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setAjoutPortfolioOpen(!ajoutPortfolioOpen)}>
              {ajoutPortfolioOpen ? t('avocat.cancel') : t('avocat.add_portfolio')}
            </button>
          </div>

          {ajoutPortfolioOpen && (
            <form onSubmit={handleAjouterPortfolio} className="form-ajout">
              <div className="champ"><label>{t('avocat.portfolio_item_title')}</label>
                <input value={formPortfolio.titre} onChange={e => setFormPortfolio(f => ({ ...f, titre: e.target.value }))} required placeholder="Ex : 10 divorces amiables traités" />
              </div>
              <div className="champ"><label>{t('avocat.portfolio_desc')}</label>
                <textarea value={formPortfolio.description} onChange={e => setFormPortfolio(f => ({ ...f, description: e.target.value }))} required placeholder="Description anonymisée..." />
              </div>
              <div className="champ"><label>{t('avocat.portfolio_domain')}</label>
                <input value={formPortfolio.domaine} onChange={e => setFormPortfolio(f => ({ ...f, domaine: e.target.value }))} placeholder="Ex : Droit de la famille" />
              </div>
              <button type="submit" className="btn btn-primaire btn-sm">Ajouter</button>
            </form>
          )}

          {!profil.portfolio?.length ? (
            <div className="vide" style={{ padding:'16px 0' }}>{t('avocat.no_portfolio')}</div>
          ) : (
            profil.portfolio.map(p => (
              <div key={p.id} className="portfolio-item-av">
                <div className="info">
                  <strong>{p.titre}</strong>
                  {p.domaine && <span className="badge badge-envoyee" style={{ marginLeft: 8 }}>{p.domaine}</span>}
                  <p>{p.description}</p>
                </div>
                <button className="btn btn-danger btn-sm" onClick={() => handleSupprimerPortfolio(p.id)}>
                  {t('avocat.delete')}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Disponibilités */}
        <div className="carte">
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 16 }}>
            <div className="section-titre" style={{ marginBottom: 0 }}>{t('avocat.availabilities_title')}</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setAjoutDispoOpen(!ajoutDispoOpen)}>
              {ajoutDispoOpen ? t('avocat.cancel') : t('avocat.add_availability')}
            </button>
          </div>

          {ajoutDispoOpen && (
            <form onSubmit={handleAjouterDispo} className="form-ajout">
              <div className="form-ligne">
                <div className="champ"><label>{t('avocat.date')}</label>
                  <input type="date" value={formDispo.date} onChange={e => setFormDispo(f => ({ ...f, date: e.target.value }))} required />
                </div>
                <div className="champ"><label>{t('avocat.start_time')}</label>
                  <input type="time" value={formDispo.heure_debut} onChange={e => setFormDispo(f => ({ ...f, heure_debut: e.target.value }))} required />
                </div>
                <div className="champ"><label>{t('avocat.end_time')}</label>
                  <input type="time" value={formDispo.heure_fin} onChange={e => setFormDispo(f => ({ ...f, heure_fin: e.target.value }))} required />
                </div>
              </div>
              <button type="submit" className="btn btn-primaire btn-sm">Ajouter</button>
            </form>
          )}

          {!profil.disponibilites?.length ? (
            <div className="vide" style={{ padding:'16px 0' }}>{t('avocat.no_availabilities')}</div>
          ) : (
            <div className="dispos-grille">
              {profil.disponibilites.map(d => (
                <div key={d.id} className="dispo-item-av">
                  <div>
                    <div className="dispo-date">{new Date(d.date).toLocaleDateString('fr-FR')}</div>
                    <div className="dispo-heure">{d.heure_debut?.slice(0,5)} – {d.heure_fin?.slice(0,5)}</div>
                  </div>
                  <button className="btn btn-danger btn-sm" onClick={() => handleSupprimerDispo(d.id)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvocatProfil;
