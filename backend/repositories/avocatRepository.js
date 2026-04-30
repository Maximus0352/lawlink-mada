const db = require("../config/db");

const findAll = async ({ specialite, localisation, mot_cle, verifie_only }) => {
  let query = `
    SELECT id, nom, prenom, email, specialite, localisation,
           annees_experience, numero_barre, est_verifie,
           description, score_pertinence
    FROM avocats WHERE 1=1
  `;
  const params = [];

  if (specialite) {
    query += " AND specialite LIKE ?";
    params.push(`%${specialite}%`);
  }
  if (localisation) {
    query += " AND localisation LIKE ?";
    params.push(`%${localisation}%`);
  }
  if (mot_cle) {
    query +=
      " AND (specialite LIKE ? OR description LIKE ? OR nom LIKE ? OR prenom LIKE ?)";
    params.push(`%${mot_cle}%`, `%${mot_cle}%`, `%${mot_cle}%`, `%${mot_cle}%`);
  }
  if (verifie_only === "true") {
    query += " AND est_verifie = 1";
  }

  query += " ORDER BY est_verifie DESC, score_pertinence DESC";

  const [rows] = await db.query(query, params);
  return rows;
};

const findById = async (id) => {
  const [rows] = await db.query(
    `SELECT id, nom, prenom, email, specialite, localisation,
            annees_experience, numero_barre, est_verifie,
            description, score_pertinence, created_at
     FROM avocats WHERE id = ?`,
    [id],
  );
  return rows[0] || null;
};

const findByEmail = async (email) => {
  const [rows] = await db.query("SELECT * FROM avocats WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
};

const create = async ({
  nom,
  prenom,
  email,
  mot_de_passe,
  specialite,
  localisation,
  annees_experience,
  numero_barre,
  description,
}) => {
  const [result] = await db.query(
    `INSERT INTO avocats (nom, prenom, email, mot_de_passe, specialite, localisation, annees_experience, numero_barre, description)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      nom,
      prenom,
      email,
      mot_de_passe,
      specialite,
      localisation,
      annees_experience || 0,
      numero_barre,
      description || null,
    ],
  );
  return result.insertId;
};

const update = async (
  id,
  { nom, prenom, specialite, localisation, annees_experience, description },
) => {
  await db.query(
    `UPDATE avocats SET nom = ?, prenom = ?, specialite = ?,
     localisation = ?, annees_experience = ?, description = ? WHERE id = ?`,
    [nom, prenom, specialite, localisation, annees_experience, description, id],
  );
};

const valider = async (id) => {
  await db.query("UPDATE avocats SET est_verifie = 1 WHERE id = ?", [id]);
};

const rejeter = async (id) => {
  await db.query("UPDATE avocats SET est_verifie = 0 WHERE id = ?", [id]);
};

const findNonVerifies = async () => {
  const [rows] = await db.query(
    `SELECT id, nom, prenom, email, specialite, localisation,
            numero_barre, est_verifie, created_at
     FROM avocats WHERE est_verifie = 0 ORDER BY created_at ASC`,
  );
  return rows;
};

module.exports = {
  findAll,
  findById,
  findByEmail,
  create,
  update,
  valider,
  rejeter,
  findNonVerifies,
};