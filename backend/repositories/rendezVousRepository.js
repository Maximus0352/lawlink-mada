const db = require('../config/db');

const create = async ({ demande_id, date_heure, duree_minutes, lieu }) => {
  const [result] = await db.query(
    'INSERT INTO rendez_vous (demande_id, date_heure, duree_minutes, lieu) VALUES (?, ?, ?, ?)',
    [demande_id, date_heure, duree_minutes || 60, lieu || null]
  );
  return result.insertId;
};

const findByDemandeId = async (demande_id) => {
  const [rows] = await db.query(
    'SELECT * FROM rendez_vous WHERE demande_id = ?',
    [demande_id]
  );
  return rows[0] || null;
};

const findByAvocatId = async (avocat_id) => {
  const [rows] = await db.query(
    `SELECT r.*, d.objet, c.nom AS client_nom, c.prenom AS client_prenom
     FROM rendez_vous r
     JOIN demandes d ON d.id = r.demande_id
     JOIN clients c  ON c.id = d.client_id
     WHERE d.avocat_id = ?
     ORDER BY r.date_heure ASC`,
    [avocat_id]
  );
  return rows;
};

const changerStatut = async (id, statut) => {
  await db.query('UPDATE rendez_vous SET statut = ? WHERE id = ?', [statut, id]);
};

module.exports = { create, findByDemandeId, findByAvocatId, changerStatut };