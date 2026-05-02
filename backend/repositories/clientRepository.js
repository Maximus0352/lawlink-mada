const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM clients WHERE email = ?', [email]);
  return rows[0] || null;
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, nom, prenom, email, telephone, adresse, created_at FROM clients WHERE id = ?',
    [id]
  );
  return rows[0] || null;
};

const create = async ({ nom, prenom, email, mot_de_passe, telephone, adresse }) => {
  const [result] = await db.query(
    'INSERT INTO clients (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES (?, ?, ?, ?, ?, ?)',
    [nom, prenom, email, mot_de_passe, telephone || null, adresse || null]
  );
  return result.insertId;
};

const update = async (id, { nom, prenom, telephone, adresse }) => {
  await db.query(
    'UPDATE clients SET nom = ?, prenom = ?, telephone = ?, adresse = ? WHERE id = ?',
    [nom, prenom, telephone, adresse, id]
  );
};

module.exports = { findByEmail, findById, create, update };