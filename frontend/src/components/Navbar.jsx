import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { estConnecte, estClient, estAvocat, estAdmin, user, deconnecter } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleDeconnexion = () => {
    deconnecter();
    navigate('/');
  };

  const toggleLang = () => {
    const next = i18n.language === 'fr' ? 'mg' : 'fr';
    i18n.changeLanguage(next);
    localStorage.setItem('ll_lang', next);
  };

  const lienActif = ({ isActive }) => isActive ? 'nl-actif' : '';

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Law<span className="logo-accent">Link</span> Mada
        </Link>

        {/* Nav links */}
        {estConnecte && (
          <div className="navbar-links">
            {estClient && (
              <>
                <NavLink to="/accueil" className={lienActif}>{t('nav.home')}</NavLink>
                <NavLink to="/recherche" className={lienActif}>{t('nav.search')}</NavLink>
                <NavLink to="/mes-demandes" className={lienActif}>{t('nav.requests')}</NavLink>
                <NavLink to="/historique" className={lienActif}>{t('nav.history')}</NavLink>
                <NavLink to="/notifications" className={lienActif}>{t('nav.notifications')}</NavLink>
              </>
            )}
            {estAvocat && (
              <>
                <NavLink to="/tableau-de-bord" className={lienActif}>{t('nav.dashboard')}</NavLink>
                <NavLink to="/demandes" className={lienActif}>{t('nav.demands')}</NavLink>
                <NavLink to="/mon-profil" className={lienActif}>{t('nav.profile')}</NavLink>
                <NavLink to="/agenda" className={lienActif}>{t('nav.agenda')}</NavLink>
                <NavLink to="/mes-notifications" className={lienActif}>{t('nav.notifications')}</NavLink>
              </>
            )}
            {estAdmin && (
              <>
                <NavLink to="/admin" className={lienActif}>{t('nav.dashboard')}</NavLink>
                <NavLink to="/admin/avocats" className={lienActif}>{t('nav.lawyers')}</NavLink>
                <NavLink to="/admin/clients" className={lienActif}>{t('nav.clients')}</NavLink>
                <NavLink to="/admin/demandes" className={lienActif}>{t('nav.demands')}</NavLink>
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="navbar-actions">
          {/* Sélecteur de langue */}
          <button className="lang-btn" onClick={toggleLang} title="Changer de langue">
            <span className="lang-flag">{i18n.language === 'fr' ? '🇫🇷' : '🇲🇬'}</span>
            <span className="lang-code">{i18n.language === 'fr' ? 'FR' : 'MG'}</span>
          </button>

          {estConnecte ? (
            <div className="user-menu" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenuOpen(!menuOpen)}>
                <span className="user-avatar">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </span>
                <span className="user-name">{user?.prenom}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ opacity: 0.6 }}>
                  <path d="M2 4l4 4 4-4"/>
                </svg>
              </button>
              {menuOpen && (
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="dropdown-avatar">{user?.prenom?.[0]}{user?.nom?.[0]}</div>
                    <div>
                      <div className="dropdown-name">{user?.prenom} {user?.nom}</div>
                      <div className="dropdown-role">{user?.role}</div>
                    </div>
                  </div>
                  <div className="user-dropdown-divider"/>
                  <button className="dropdown-logout" onClick={handleDeconnexion}>
                    <i className="fa-solid fa-right-from-bracket"></i>
                    {t('nav.logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/connexion">
                <button className="btn btn-ghost btn-sm">{t('nav.login')}</button>
              </Link>
              <Link to="/inscription">
                <button className="btn btn-primaire btn-sm">{t('nav.register')}</button>
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          height: var(--nav-h);
          background: rgba(255,255,255,0.92);
          border-bottom: 1px solid rgba(226,230,237,0.8);
          z-index: 200;
          transition: box-shadow 0.2s, background 0.2s;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .navbar--scrolled {
          box-shadow: 0 2px 16px rgba(0,0,0,0.07);
          background: rgba(255,255,255,0.97);
        }
        .navbar-inner {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }
        .navbar-logo {
          font-size: 1.15rem;
          font-weight: 800;
          color: var(--noir);
          text-decoration: none;
          align-items: center;
          flex-shrink: 0;
        }
        .logo-accent { color: var(--bleu); }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: center;
        }
        .navbar-links a {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--gris);
          text-decoration: none;
          padding: 6px 12px;
          border-radius: 8px;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .navbar-links a:hover { color: var(--bleu); background: var(--bleu-clair); }
        .navbar-links a.nl-actif { color: var(--bleu); font-weight: 600; background: var(--bleu-clair); }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        /* Bouton langue */
        .lang-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          border: 1.5px solid var(--gris-bord);
          border-radius: 8px;
          background: var(--blanc);
          font-size: 0.78rem;
          font-weight: 700;
          font-family: var(--font);
          color: var(--texte);
          cursor: pointer;
          transition: all 0.15s;
        }
        .lang-btn:hover { border-color: var(--bleu); color: var(--bleu); background: var(--bleu-clair); }
        .lang-flag { font-size: 1rem; }
        .lang-code { letter-spacing: 0.04em; }

        /* Menu utilisateur */
        .user-menu { position: relative; }
        .user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px 5px 5px;
          border: 1.5px solid var(--gris-bord);
          border-radius: 24px;
          background: var(--blanc);
          cursor: pointer;
          font-family: var(--font);
          transition: all 0.15s;
          color: var(--texte);
        }
        .user-btn:hover { border-color: var(--bleu); background: var(--bleu-clair); }
        .user-avatar {
          width: 28px; height: 28px;
          background: var(--bleu);
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0;
        }
        .user-name { font-size: 0.85rem; font-weight: 600; max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: var(--blanc);
          border: 1px solid var(--gris-bord);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          min-width: 220px;
          overflow: hidden;
          animation: dropIn 0.15s ease;
        }
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .user-dropdown-header {
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--gris-pale);
        }
        .dropdown-avatar {
          width: 38px; height: 38px;
          background: var(--bleu);
          color: #fff;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; font-weight: 700;
          flex-shrink: 0;
        }
        .dropdown-name { font-weight: 700; font-size: 0.9rem; color: var(--noir); }
        .dropdown-role { font-size: 0.75rem; color: var(--gris); text-transform: capitalize; margin-top: 1px; }
        .user-dropdown-divider { height: 1px; background: var(--gris-bord); }
        .dropdown-logout {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 13px 16px;
          border: none;
          background: none;
          font-family: var(--font);
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--rouge);
          cursor: pointer;
          transition: background 0.15s;
        }
        .dropdown-logout:hover { background: var(--rouge-clair); }

        @media (max-width: 768px) {
          .navbar-links { display: none; }
          .user-name { display: none; }
          .lang-code { display: none; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
