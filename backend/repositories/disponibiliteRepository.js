const db = require('../config/db');

const findByAvocatId = async (avocat_id) => {
  const [rows] = await db.query(
    `SELECT * FROM disponibilites
     WHERE avocat_id = ? AND date >= CURDATE() AND est_libre = 1
     ORDER BY date, heure_debut`,
    [avocat_id]
  );
  return rows;
};

const create = async ({ avocat_id, date, heure_debut, heure_fin }) => {
  const [result] = await db.query(
    'INSERT INTO disponibilites (avocat_id, date, heure_debut, heure_fin) VALUES (?, ?, ?, ?)',
    [avocat_id, date, heure_debut, heure_fin]
  );
  return result.insertId;
};

const remove = async (id, avocat_id) => {
  await db.query(
    'DELETE FROM disponibilites WHERE id = ? AND avocat_id = ?',
    [id, avocat_id]
  );
};

const marquerOccupe = async (id) => {
  await db.query('UPDATE disponibilites SET est_libre = 0 WHERE id = ?', [id]);
};

module.exports = { findByAvocatId, create, remove, marquerOccupe };