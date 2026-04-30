const db = require('../config/db');

const create = async ({ client_id, avocat_id, objet, message }) => {
  const [result] = await db.query(
    'INSERT INTO demandes (client_id, avocat_id, objet, message) VALUES (?, ?, ?, ?)',
    [client_id, avocat_id, objet, message]
  );
  return result.insertId;
};

const findByClientId = async (client_id) => {
  const [rows] = await db.query(
    `SELECT d.id, d.objet, d.message, d.statut, d.date_envoi, d.date_maj,
            a.nom AS avocat_nom, a.prenom AS avocat_prenom, a.specialite
     FROM demandes d
     JOIN avocats a ON a.id = d.avocat_id
     WHERE d.client_id = ?
     ORDER BY d.date_envoi DESC`,
    [client_id]
  );
  return rows;
};

const findByAvocatId = async (avocat_id) => {
  const [rows] = await db.query(
    `SELECT d.id, d.objet, d.message, d.statut, d.date_envoi, d.date_maj,
            c.nom AS client_nom, c.prenom AS client_prenom
     FROM demandes d
     JOIN clients c ON c.id = d.client_id
     WHERE d.avocat_id = ?
     ORDER BY d.date_envoi DESC`,
    [avocat_id]
  );
  return rows;
};

const findAll = async () => {
  const [rows] = await db.query(
    `SELECT d.id, d.objet, d.statut, d.date_envoi,
            c.nom AS client_nom, c.prenom AS client_prenom,
            a.nom AS avocat_nom, a.prenom AS avocat_prenom
     FROM demandes d
     JOIN clients c ON c.id = d.client_id
     JOIN avocats a ON a.id = d.avocat_id
     ORDER BY d.date_envoi DESC`
  );
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT d.*, c.nom AS client_nom, c.prenom AS client_prenom,
            a.nom AS avocat_nom, a.prenom AS avocat_prenom
     FROM demandes d
     JOIN clients c ON c.id = d.client_id
     JOIN avocats a ON a.id = d.avocat_id
     WHERE d.id = ?`,
    [id]
  );
  return rows[0] || null;
};

const changerStatut = async (id, statut) => {
  await db.query('UPDATE demandes SET statut = ? WHERE id = ?', [statut, id]);
};

module.exports = { create, findByClientId, findByAvocatId, findAll, findById, changerStatut };