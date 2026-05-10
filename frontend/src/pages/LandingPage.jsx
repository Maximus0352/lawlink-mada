import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroImg from '../assets/hero-legal.png';
import '../styles/landing.css';

const LandingPage = () => {
  const { t } = useTranslation();

  return (
    <div className="landing">

      {/* ── HERO ── */}
      <section className="landing-hero">
        <div className="hero-bg-circle hero-bg-circle-1"/>
        <div className="hero-bg-circle hero-bg-circle-2"/>
        <div className="hero-inner">

          {/* Texte gauche */}
          <div className="hero-content">
            <div className="hero-badge">
              <div className="hero-badge-dot"/>
              {t('landing.badge')}
            </div>
            <h1 className="hero-title">
              {t('landing.hero_title')}<br/>
              <span className="hero-title-line2">{t('landing.hero_highlight')}</span>
            </h1>
            <p className="hero-subtitle">{t('landing.hero_subtitle')}</p>
            <div className="hero-btns">
              <Link to="/inscription">
                <button className="btn btn-primaire btn-xl">
                  <i className="fa-solid fa-magnifying-glass"/>
                  {t('landing.cta_start')}
                </button>
              </Link>
              <Link to="/inscription">
                <button className="btn btn-ghost btn-xl">
                  <i className="fa-solid fa-scale-balanced"/>
                  {t('landing.cta_lawyer')}
                </button>
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-avatars">
                {['RR','JR','MA','SB','TR'].map((i,k) => (
                  <div key={k} className="hero-trust-av">{i}</div>
                ))}
              </div>
              <span>+500 clients font confiance à <strong>LawLink Mada</strong></span>
            </div>
          </div>

          {/* Image droite */}
          <div className="hero-visual">
            <div className="hero-img-wrap">
              <img
                src={heroImg}
                alt="Cabinet d'avocat - LawLink Mada"
                className="hero-img"
              />
              {/* Badge flottant haut */}
              <div className="hero-img-badge hero-img-badge--top">
                <span className="hib-icon">⚖️</span>
                <div>
                  <div className="hib-title">Avocats vérifiés</div>
                  <div className="hib-sub">Barreau de Madagascar</div>
                </div>
              </div>
              {/* Badge flottant bas */}
              <div className="hero-img-badge hero-img-badge--bot">
                <span className="hib-icon">✅</span>
                <div>
                  <div className="hib-title">Mise en relation rapide</div>
                  <div className="hib-sub">Réponse sous 24h</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="landing-features">
        <div className="section-head">
          <div className="section-eyebrow">Pourquoi nous choisir</div>
          <h2 className="section-title">{t('landing.features_title')}</h2>
          <p className="section-subtitle">{t('landing.features_subtitle')}</p>
        </div>
        <div className="features-grid">
          {[
            { icon:'fa-shield-halved', cls:'',       title: t('landing.feat1_title'), desc: t('landing.feat1_desc') },
            { icon:'fa-bolt',          cls:'',       title: t('landing.feat2_title'), desc: t('landing.feat2_desc') },
            { icon:'fa-bell',          cls:'green',  title: t('landing.feat3_title'), desc: t('landing.feat3_desc') },
            { icon:'fa-scale-balanced',cls:'',       title: t('landing.feat4_title'), desc: t('landing.feat4_desc') },
            { icon:'fa-calendar-check',cls:'green',  title: t('landing.feat5_title'), desc: t('landing.feat5_desc') },
            { icon:'fa-lock',          cls:'orange', title: t('landing.feat6_title'), desc: t('landing.feat6_desc') },
          ].map((f, i) => (
            <div className="feat-card" key={i}>
              <div className={`feat-icon ${f.cls}`}>
                <i className={`fa-solid ${f.icon}`}/>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="landing-how">
        <div className="section-head">
          <div className="section-eyebrow">Processus simple</div>
          <h2 className="section-title">{t('landing.how_title')}</h2>
          <p className="section-subtitle">{t('landing.how_subtitle')}</p>
        </div>
        <div className="steps-grid">
          {[
            { n:'1', title: t('landing.step1_title'), desc: t('landing.step1_desc') },
            { n:'2', title: t('landing.step2_title'), desc: t('landing.step2_desc') },
            { n:'3', title: t('landing.step3_title'), desc: t('landing.step3_desc') },
          ].map((s, i) => (
            <div className="step-card" key={i}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── DOMAINS ── */}
      <section className="landing-domains">
        <div className="section-head">
          <div className="section-eyebrow">Expertise</div>
          <h2 className="section-title">{t('landing.domains_title')}</h2>
        </div>
        <div className="domains-grid">
          {[
            { icon:'fa-briefcase',    label: t('landing.domain_business') },
            { icon:'fa-heart',        label: t('landing.domain_family') },
            { icon:'fa-gavel',        label: t('landing.domain_criminal') },
            { icon:'fa-building',     label: t('landing.domain_real_estate') },
            { icon:'fa-hard-hat',     label: t('landing.domain_labor') },
            { icon:'fa-balance-scale',label: t('landing.domain_civil') },
          ].map((d, i) => (
            <div className="domain-chip" key={i}>
              <i className={`fa-solid ${d.icon}`}/>
              <span>{d.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta">
        <div className="cta-inner">
          <h2 className="cta-title">{t('landing.cta_title')}</h2>
          <p className="cta-subtitle">{t('landing.cta_subtitle')}</p>
          <div className="cta-btns">
            <Link to="/inscription">
              <button className="btn btn-blanc btn-xl">{t('landing.cta_client')}</button>
            </Link>
            <Link to="/inscription">
              <button className="btn btn-outline-blanc btn-xl">{t('landing.cta_lawyer_join')}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-logo-wrap">
            <div className="footer-logo">
              Law<span>Link</span> Mada
            </div>
            <p className="footer-tagline">{t('landing.footer_tagline')}</p>
          </div>
          <div className="footer-col">
            <h4>{t('landing.footer_links')}</h4>
            <ul>
              <li><Link to="/inscription">{t('nav.register')}</Link></li>
              <li><Link to="/connexion">{t('nav.login')}</Link></li>
              <li><a href="#">{t('landing.footer_about')}</a></li>
              <li><a href="#">{t('landing.footer_faq')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('landing.footer_legal')}</h4>
            <ul>
              <li><a href="#">{t('landing.footer_terms')}</a></li>
              <li><a href="#">{t('landing.footer_privacy')}</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>{t('landing.footer_contact')}</h4>
            <ul>
              <li><a href="mailto:contact@lawlink.mg">contact@lawlink.mg</a></li>
              <li><a href="#">+261 34 00 000 00</a></li>
              <li><a href="#">Antananarivo, Madagascar</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2035 - LawLink Mada. {t('landing.footer_rights')}</div>
          <div className="footer-legal-links">
            <a href="#">{t('landing.footer_terms')}</a>
            <a href="#">{t('landing.footer_privacy')}</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
