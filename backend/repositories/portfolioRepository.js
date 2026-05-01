const db = require('../config/db');

const findByAvocatId = async (avocat_id) => {
  const [rows] = await db.query(
    'SELECT * FROM portfolios WHERE avocat_id = ? ORDER BY date_ajout DESC',
    [avocat_id]
  );
  return rows;
};

const create = async ({ avocat_id, titre, description, domaine }) => {
  const [result] = await db.query(
    'INSERT INTO portfolios (avocat_id, titre, description, domaine) VALUES (?, ?, ?, ?)',
    [avocat_id, titre, description, domaine || null]
  );
  return result.insertId;
};

const remove = async (id, avocat_id) => {
  await db.query(
    'DELETE FROM portfolios WHERE id = ? AND avocat_id = ?',
    [id, avocat_id]
  );
};

module.exports = { findByAvocatId, create, remove };