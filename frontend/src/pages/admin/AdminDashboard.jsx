import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useTranslation } from 'react-i18next';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [chargement, setChargement] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/admin/stats')
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  if (chargement) return <div className="spinner-wrap"><div className="spinner"/></div>;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-titre">{t('admin.dashboard_title')}</h1>
        <p className="page-sous">{t('admin.overview')}</p>

        <div className="stats-grille">
          <div className="stat-carte">
            <div className="stat-val">{stats?.nb_clients}</div>
            <div className="stat-label">{t('admin.clients')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val">{stats?.nb_avocats}</div>
            <div className="stat-label">{t('admin.lawyers')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--orange)' }}>{stats?.nb_a_verifier}</div>
            <div className="stat-label">{t('admin.to_verify')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val">{stats?.nb_demandes}</div>
            <div className="stat-label">{t('admin.total_requests')}</div>
          </div>
          <div className="stat-carte">
            <div className="stat-val" style={{ color: 'var(--vert)' }}>{stats?.nb_rdv_confirmes}</div>
            <div className="stat-label">{t('admin.confirmed_rdv')}</div>
          </div>
        </div>

        <div className="admin-raccourcis">
          <div className="admin-raccourci" onClick={() => navigate('/admin/avocats')}>
            <div className="admin-raccourci-icone"><i className="fa-solid fa-scale-balanced"/></div>
            <div>
              <div className="admin-raccourci-titre">{t('admin.manage_lawyers')}</div>
              <div className="admin-raccourci-desc">{stats?.nb_a_verifier} {t('admin.manage_lawyers_desc')}</div>
            </div>
          </div>
          <div className="admin-raccourci" onClick={() => navigate('/admin/clients')}>
            <div className="admin-raccourci-icone"><i className="fa-solid fa-users"/></div>
            <div>
              <div className="admin-raccourci-titre">{t('admin.manage_clients')}</div>
              <div className="admin-raccourci-desc">{stats?.nb_clients} {t('admin.manage_clients_desc')}</div>
            </div>
          </div>
          <div className="admin-raccourci" onClick={() => navigate('/admin/demandes')}>
            <div className="admin-raccourci-icone"><i className="fa-solid fa-clipboard"/></div>
            <div>
              <div className="admin-raccourci-titre">{t('admin.all_requests')}</div>
              <div className="admin-raccourci-desc">{stats?.nb_demandes} {t('admin.all_requests_desc')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
