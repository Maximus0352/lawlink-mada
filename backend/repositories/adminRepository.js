const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM administrateurs WHERE email = ?', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, nom, prenom, email FROM administrateurs WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const getStats = async () => {
  const [[clients]] = await db.query('SELECT COUNT(*) AS total FROM clients');
  const [[avocats]] = await db.query('SELECT COUNT(*) AS total FROM avocats');
  const [[aVerifier]] = await db.query('SELECT COUNT(*) AS total FROM avocats WHERE est_verifie = 0');
  const [[demandes]] = await db.query('SELECT COUNT(*) AS total FROM demandes');
  const [[rdv]] = await db.query('SELECT COUNT(*) AS total FROM rendez_vous WHERE statut = "confirme"');

  return {
    nb_clients: clients.total,
    nb_avocats: avocats.total,
    nb_a_verifier: aVerifier.total,
    nb_demandes: demandes.total,
    nb_rdv_confirmes: rdv.total,
  };
};

module.exports = { findByEmail, findById, getStats };