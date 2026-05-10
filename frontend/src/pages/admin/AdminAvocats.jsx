import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import '../../styles/admin.css';

const AdminAvocats = () => {
  const { t } = useTranslation();
  const [avocats, setAvocats] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState('tous');
  const [recherche, setRecherche] = useState('');
  const [succes, setSucces] = useState('');
  const [erreur, setErreur] = useState('');

  const charger = async () => {
    try { const res = await api.get('/avocats'); setAvocats(res.data.data || []); }
    catch {} finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, []);

  const aff = (msg) => { setSucces(msg); setTimeout(() => setSucces(''), 3000); };

  const handleValider = async (id) => {
    try { await api.patch(`/admin/avocats/${id}/valider`); aff(t('admin.validated_msg')); charger(); }
    catch (err) { setErreur(err.response?.data?.message || t('common.error')); }
  };

  const handleRejeter = async (id) => {
    if (!confirm('Rejeter ce profil ?')) return;
    try { await api.patch(`/admin/avocats/${id}/rejeter`); aff(t('admin.rejected_msg')); charger(); }
    catch (err) { setErreur(err.response?.data?.message || t('common.error')); }
  };

  const filtrees = avocats
    .filter(a => filtre === 'tous' ? true : filtre === 'non_verifies' ? a.est_verifie === 0 : a.est_verifie === 1)
    .filter(a => !recherche || `${a.prenom} ${a.nom} ${a.email} ${a.specialite}`.toLowerCase().includes(recherche.toLowerCase()));

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('admin.lawyers_title')}</h1>
        <p className="page-sous">{avocats.filter(a => a.est_verifie === 0).length} {t('admin.manage_lawyers_desc')}</p>

        {succes && <div className="alerte alerte-succes">{succes}</div>}
        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}

        <div className="filtres-barre">
          {[
            { val: 'tous',         label: t('admin.all') },
            { val: 'non_verifies', label: t('admin.pending') },
            { val: 'verifies',     label: t('admin.verified') },
          ].map(f => (
            <button key={f.val} className={`filtre-btn ${filtre === f.val ? 'actif' : ''}`}
              onClick={() => setFiltre(f.val)}>{f.label}</button>
          ))}
        </div>

        <input className="recherche-admin" placeholder={t('admin.search_lawyer')}
          value={recherche} onChange={e => setRecherche(e.target.value)} />

        {chargement ? (
          <div className="spinner-wrap"><div className="spinner"/></div>
        ) : filtrees.length === 0 ? (
          <div className="vide">{t('admin.no_lawyers')}</div>
        ) : (
          <div className="carte">
            <table className="tableau">
              <thead>
                <tr>
                  <th>Avocat</th>
                  <th>Spécialité</th>
                  <th>Localisation</th>
                  <th>{t('admin.bar_number')}</th>
                  <th>{t('admin.experience')}</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtrees.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="avocat-info-admin">
                        <div className="admin-av-avatar">{a.prenom?.[0]}{a.nom?.[0]}</div>
                        <div>
                          <div className="avocat-nom-admin">Me {a.prenom} {a.nom}</div>
                          <div className="avocat-email-admin">{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{a.specialite}</td>
                    <td>{a.localisation}</td>
                    <td>{a.numero_barre}</td>
                    <td>{a.annees_experience} ans</td>
                    <td>
                      {a.est_verifie === 1
                        ? <span className="badge badge-verifie">✓ {t('common.verified')}</span>
                        : <span className="badge badge-en_attente">{t('admin.pending')}</span>
                      }
                    </td>
                    <td>
                      <div className="actions-ligne">
                        {a.est_verifie === 0 && (
                          <button className="btn btn-succes btn-sm" onClick={() => handleValider(a.id)}>
                            <i className="fa-solid fa-check"/> {t('admin.validate')}
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => handleRejeter(a.id)}>
                          <i className="fa-solid fa-xmark"/> {t('admin.reject')}
                        </button>
                      </div>
                    </td>
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

export default AdminAvocats;
