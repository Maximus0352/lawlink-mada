import React, { useState, useEffect } from 'react';
import { rechercher, getProfil } from '../../api/avocatApi';
import { envoyer } from '../../api/demandeApi';
import { creer as creerRDV } from '../../api/rendezVousApi';
import { useTranslation } from 'react-i18next';
import '../../styles/client.css';

const SPECIALITES = [
  'Droit de la famille','Droit commercial','Droit pénal',
  'Droit civil','Droit du travail','Droit immobilier',
];

const CarteAvocat = ({ avocat, onVoirProfil, onEnvoyerDemande }) => {
  const { t } = useTranslation();
  return (
    <div className="avocat-carte">
      <div className="avocat-avatar">{avocat.prenom?.[0]}{avocat.nom?.[0]}</div>
      <div className="avocat-info">
        <div className="avocat-nom-ligne">
          <h3 className="avocat-nom">Me {avocat.prenom} {avocat.nom}</h3>
          {avocat.est_verifie === 1 && <span className="badge badge-verifie">✓ {t('common.verified')}</span>}
        </div>
        <div className="avocat-meta">
          <span><i className="fa-solid fa-location-dot"/> {avocat.localisation}</span>
          <span><i className="fa-solid fa-scale-balanced"/> {avocat.specialite}</span>
          <span><i className="fa-solid fa-clock"/> {avocat.annees_experience} {t('common.years')}</span>
        </div>
        {avocat.description && <p className="avocat-desc">{avocat.description.slice(0, 110)}...</p>}
      </div>
      <div className="avocat-actions">
        <button className="btn btn-secondaire btn-sm" onClick={() => onVoirProfil(avocat.id)}>
          <i className="fa-solid fa-user"/> {t('client.see_profile')}
        </button>
        <button className="btn btn-primaire btn-sm" onClick={() => onEnvoyerDemande(avocat)}>
          <i className="fa-solid fa-paper-plane"/> {t('client.send_request')}
        </button>
      </div>
    </div>
  );
};

const ModalProfil = ({ avocat, onFermer, onEnvoyerDemande }) => {
  const { t } = useTranslation();
  if (!avocat) return null;
  return (
    <div className="modal-fond" onClick={onFermer}>
      <div className="modal-boite" onClick={e => e.stopPropagation()}>
        <button className="modal-fermer" onClick={onFermer}>✕</button>
        <div className="profil-entete">
          <div className="avocat-avatar grand">{avocat.prenom?.[0]}{avocat.nom?.[0]}</div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: 6 }}>Me {avocat.prenom} {avocat.nom}</h2>
            {avocat.est_verifie === 1 && <span className="badge badge-verifie">✓ {t('common.verified')}</span>}
            <div className="avocat-meta" style={{ marginTop: 8, flexWrap: 'wrap' }}>
              <span><i className="fa-solid fa-location-dot"/> {avocat.localisation}</span>
              <span><i className="fa-solid fa-scale-balanced"/> {avocat.specialite}</span>
              <span><i className="fa-solid fa-clock"/> {avocat.annees_experience} {t('common.years')}</span>
            </div>
          </div>
        </div>
        {avocat.description && (
          <div style={{ marginBottom: 18 }}>
            <div className="section-titre">{t('client.about')}</div>
            <p style={{ fontSize: '0.88rem', color: '#444', lineHeight: 1.65 }}>{avocat.description}</p>
          </div>
        )}
        {avocat.portfolio?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div className="section-titre">{t('client.portfolio')}</div>
            {avocat.portfolio.map(p => (
              <div key={p.id} className="portfolio-item">
                <strong style={{ fontSize: '0.88rem' }}>{p.titre}</strong>
                {p.domaine && <span className="badge badge-envoyee" style={{ marginLeft: 8 }}>{p.domaine}</span>}
                <p style={{ fontSize: '0.82rem', color: '#666', marginTop: 4 }}>{p.description}</p>
              </div>
            ))}
          </div>
        )}
        {avocat.disponibilites?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div className="section-titre">{t('client.availabilities')}</div>
            <div className="dispos-liste">
              {avocat.disponibilites.map(d => (
                <div key={d.id} className="dispo-item">
                  <i className="fa-solid fa-calendar-days"/> {new Date(d.date).toLocaleDateString('fr-FR')} · {d.heure_debut?.slice(0,5)} – {d.heure_fin?.slice(0,5)}
                </div>
              ))}
            </div>
          </div>
        )}
        <button className="btn btn-primaire btn-full" onClick={() => { onFermer(); onEnvoyerDemande(avocat); }}>
          <i className="fa-solid fa-paper-plane"/> {t('client.send_request_title')}
        </button>
      </div>
    </div>
  );
};

const ModalDemande = ({ avocat, onFermer, onSuccess }) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ objet: '', message: '' });
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnvoi(true); setErreur('');
    try {
      await envoyer({ avocat_id: avocat.id, ...form });
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
        <h2 style={{ marginBottom: 4, fontSize: '1.15rem', fontWeight: 800 }}>{t('client.send_request_title')}</h2>
        <p style={{ color: 'var(--gris)', marginBottom: 20, fontSize: '0.88rem' }}>
          {t('client.send_request_to')} {avocat.prenom} {avocat.nom}
        </p>
        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}
        <form onSubmit={handleSubmit}>
          <div className="champ">
            <label>{t('client.request_object')}</label>
            <input value={form.objet} onChange={e => setForm(f => ({ ...f, objet: e.target.value }))}
              placeholder={t('client.request_object_placeholder')} required />
          </div>
          <div className="champ">
            <label>{t('client.request_message')}</label>
            <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              placeholder={t('client.request_message_placeholder')} required />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" className="btn btn-ghost" style={{ flex: 1 }} onClick={onFermer}>
              {t('client.cancel')}
            </button>
            <button type="submit" className="btn btn-primaire" style={{ flex: 1 }} disabled={envoi}>
              <i className="fa-solid fa-paper-plane"/> {envoi ? '...' : t('client.send')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ClientRecherche = () => {
  const { t } = useTranslation();
  const [avocats, setAvocats] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [filtres, setFiltres] = useState({ mot_cle: '', specialite: '', localisation: '', verifie_only: '' });
  const [profilOuvert, setProfilOuvert] = useState(null);
  const [demandeAvocat, setDemandeAvocat] = useState(null);
  const [succes, setSucces] = useState('');

  const lancer = async () => {
    setChargement(true);
    try {
      const params = {};
      if (filtres.mot_cle)      params.mot_cle      = filtres.mot_cle;
      if (filtres.specialite)   params.specialite   = filtres.specialite;
      if (filtres.localisation) params.localisation = filtres.localisation;
      if (filtres.verifie_only) params.verifie_only = 'true';
      const res = await rechercher(params);
      setAvocats(res.data.data || []);
    } catch {} finally { setChargement(false); }
  };

  useEffect(() => { lancer(); }, []);

  const voirProfil = async (id) => {
    try {
      const res = await getProfil(id);
      setProfilOuvert(res.data.data);
    } catch {}
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFiltres(f => ({ ...f, [name]: type === 'checkbox' ? (checked ? 'true' : '') : value }));
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('client.search_title')}</h1>

        {succes && <div className="alerte alerte-succes">{succes}</div>}

        <form onSubmit={e => { e.preventDefault(); lancer(); }} className="recherche-barre">
          <input name="mot_cle" value={filtres.mot_cle} onChange={handleChange}
            placeholder={t('client.search_placeholder')} className="recherche-input" />
          <select name="specialite" value={filtres.specialite} onChange={handleChange} className="recherche-select">
            <option value="">{t('client.all_specialities')}</option>
            {SPECIALITES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input name="localisation" value={filtres.localisation} onChange={handleChange}
            placeholder={t('client.city_placeholder')} className="recherche-select" />
          <button type="submit" className="btn btn-primaire">
            <i className="fa-solid fa-magnifying-glass"/> {t('client.btn_search')}
          </button>
        </form>

        <label className="filtre-verifie">
          <input type="checkbox" name="verifie_only" checked={!!filtres.verifie_only} onChange={handleChange} />
          {t('client.verified_only')}
        </label>

        <p className="resultats-count">
          {chargement ? t('client.searching') : `${avocats.length} ${t('client.results')}`}
        </p>

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : avocats.length === 0 ? (
          <div className="vide">
            <div className="vide-icone">🔍</div>
            {t('client.no_results')}
          </div>
        ) : (
          <div className="avocats-liste">
            {avocats.map(a => (
              <CarteAvocat key={a.id} avocat={a}
                onVoirProfil={voirProfil}
                onEnvoyerDemande={setDemandeAvocat}
              />
            ))}
          </div>
        )}
      </div>

      {profilOuvert && (
        <ModalProfil avocat={profilOuvert} onFermer={() => setProfilOuvert(null)}
          onEnvoyerDemande={setDemandeAvocat} />
      )}
      {demandeAvocat && (
        <ModalDemande avocat={demandeAvocat} onFermer={() => setDemandeAvocat(null)}
          onSuccess={() => { setSucces(t('client.request_sent')); setTimeout(() => setSucces(''), 3000); }} />
      )}
    </div>
  );
};

export default ClientRecherche;
