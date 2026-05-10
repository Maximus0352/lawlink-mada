import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { inscrireClient, inscrireAvocat } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/auth.css';

const RegisterPage = () => {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', mot_de_passe: '',
    telephone: '', adresse: '',
    specialite: '', localisation: '', annees_experience: '', numero_barre: '', description: '',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const fn = role === 'client' ? inscrireClient : inscrireAvocat;
      const res = await fn({ ...form, role });
      const { token, ...userData } = res.data.data;
      connecter(userData, token);
      navigate(role === 'client' ? '/accueil' : '/tableau-de-bord');
    } catch (err) {
      setErreur(err.response?.data?.message || t('common.error'));
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-carte" style={{ maxWidth: 540 }}>
        <div className="auth-logo">⚖ Law<span>Link</span> Mada</div>
        <h1 className="auth-titre">{t('auth.register_title')}</h1>

        <div className="role-choix">
          <button type="button" className={`role-btn ${role === 'client' ? 'actif' : ''}`} onClick={() => setRole('client')}>
            <i className="fa-solid fa-user"/> {t('auth.client')}
          </button>
          <button type="button" className={`role-btn ${role === 'avocat' ? 'actif' : ''}`} onClick={() => setRole('avocat')}>
            <i className="fa-solid fa-scale-balanced"/> {t('auth.lawyer')}
          </button>
        </div>

        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-ligne">
            <div className="champ">
              <label>{t('auth.last_name')}</label>
              <input name="nom" value={form.nom} onChange={handleChange} placeholder="Rakoto" required />
            </div>
            <div className="champ">
              <label>{t('auth.first_name')}</label>
              <input name="prenom" value={form.prenom} onChange={handleChange} placeholder="Jean" required />
            </div>
          </div>

          <div className="champ">
            <label>{t('auth.email')}</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.mg" required />
          </div>
          <div className="champ">
            <label>{t('auth.password')}</label>
            <input name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleChange} placeholder={t('auth.password_placeholder')} required />
          </div>

          {role === 'client' && (
            <>
              <div className="champ">
                <label>{t('auth.phone')}</label>
                <input name="telephone" value={form.telephone} onChange={handleChange} placeholder="+261 34 00 000 00" />
              </div>
              <div className="champ">
                <label>{t('auth.address')}</label>
                <input name="adresse" value={form.adresse} onChange={handleChange} placeholder="Antananarivo" />
              </div>
            </>
          )}

          {role === 'avocat' && (
            <div className="avocat-champs">
              <div className="champ">
                <label>{t('auth.speciality')} *</label>
                <input name="specialite" value={form.specialite} onChange={handleChange} placeholder={t('auth.speciality_placeholder')} required />
              </div>
              <div className="form-ligne">
                <div className="champ">
                  <label>{t('auth.location')} *</label>
                  <input name="localisation" value={form.localisation} onChange={handleChange} placeholder="Antananarivo" required />
                </div>
                <div className="champ">
                  <label>{t('auth.experience')}</label>
                  <input name="annees_experience" type="number" value={form.annees_experience} onChange={handleChange} placeholder="5" />
                </div>
              </div>
              <div className="champ">
                <label>{t('auth.bar_number')} *</label>
                <input name="numero_barre" value={form.numero_barre} onChange={handleChange} placeholder={t('auth.bar_placeholder')} required />
              </div>
              <div className="champ">
                <label>{t('auth.description')}</label>
                <textarea name="description" value={form.description} onChange={handleChange} placeholder={t('auth.description_placeholder')} />
              </div>
            </div>
          )}

          <button className="btn btn-primaire btn-full auth-submit" type="submit" disabled={chargement}>
            {chargement ? t('auth.btn_loading') : t('auth.btn_register')}
          </button>
        </form>

        <p className="auth-lien">
          {t('auth.has_account')} <Link to="/connexion">{t('auth.sign_in')}</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
