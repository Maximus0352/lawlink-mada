import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { connecter as connecterApi } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import '../styles/auth.css';

const LoginPage = () => {
  const { connecter } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', mot_de_passe: '', role: 'client' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);
    try {
      const res = await connecterApi(form);
      const { token, ...userData } = res.data.data;
      connecter(userData, token);
      if (userData.role === 'client')          navigate('/accueil');
      else if (userData.role === 'avocat')     navigate('/tableau-de-bord');
      else                                     navigate('/admin');
    } catch (err) {
      setErreur(err.response?.data?.message || t('common.error'));
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-carte">
        <div className="auth-logo">⚖ Law<span>Link</span> Mada</div>
        <h1 className="auth-titre">{t('auth.login_title')}</h1>
        <p className="auth-sous">{t('auth.login_subtitle')}</p>

        {erreur && <div className="alerte alerte-erreur">{erreur}</div>}

        <form onSubmit={handleSubmit}>
          <div className="champ">
            <label>{t('auth.iam')}</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="client">{t('auth.client')}</option>
              <option value="avocat">{t('auth.lawyer')}</option>
              <option value="administrateur">{t('auth.admin')}</option>
            </select>
          </div>
          <div className="champ">
            <label>{t('auth.email')}</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="votre@email.mg" required />
          </div>
          <div className="champ">
            <label>{t('auth.password')}</label>
            <input name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleChange} placeholder="••••••••" required />
          </div>
          <button className="btn btn-primaire btn-full auth-submit" type="submit" disabled={chargement}>
            {chargement ? t('auth.btn_loading') : t('auth.btn_login')}
          </button>
        </form>

        <p className="auth-lien">
          {t('auth.no_account')} <Link to="/inscription">{t('auth.sign_up')}</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
