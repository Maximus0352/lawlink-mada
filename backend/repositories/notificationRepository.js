const db = require('../config/db');

const create = async ({ destinataire_id, role_destinataire, demande_id, type, message }) => {
  const [result] = await db.query(
    `INSERT INTO notifications (destinataire_id, role_destinataire, demande_id, type, message)
     VALUES (?, ?, ?, ?, ?)`,
    [destinataire_id, role_destinataire, demande_id || null, type, message]
  );
  return result.insertId;
};

const findByDestinataire = async (destinataire_id, role_destinataire) => {
  const [rows] = await db.query(
    `SELECT * FROM notifications
     WHERE destinataire_id = ? AND role_destinataire = ?
     ORDER BY date_envoi DESC`,
    [destinataire_id, role_destinataire]
  );
  return rows;
};

const marquerLue = async (id) => {
  await db.query('UPDATE notifications SET est_lue = 1 WHERE id = ?', [id]);
};

const marquerToutesLues = async (destinataire_id, role_destinataire) => {
  await db.query(
    'UPDATE notifications SET est_lue = 1 WHERE destinataire_id = ? AND role_destinataire = ?',
    [destinataire_id, role_destinataire]
  );
};

module.exports = { create, findByDestinataire, marquerLue, marquerToutesLues };