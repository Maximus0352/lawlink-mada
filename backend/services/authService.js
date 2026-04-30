const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clientRepo = require('../repositories/clientRepository');
const avocatRepo = require('../repositories/avocatRepository');
const adminRepo  = require('../repositories/adminRepository');

const genererToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const inscrireClient = async ({ nom, prenom, email, mot_de_passe, telephone, adresse }) => {
  const existant = await clientRepo.findByEmail(email);
  if (existant) throw { status: 409, message: 'Cet email est déjà utilisé' };

  const hash = await bcrypt.hash(mot_de_passe, 10);
  const id = await clientRepo.create({ nom, prenom, email, mot_de_passe: hash, telephone, adresse });

  const token = genererToken({ id, email, role: 'client' });
  return { id, nom, prenom, email, role: 'client', token };
};

const inscrireAvocat = async ({ nom, prenom, email, mot_de_passe, specialite, localisation, annees_experience, numero_barre, description }) => {
  const existant = await avocatRepo.findByEmail(email);
  if (existant) throw { status: 409, message: 'Cet email est déjà utilisé' };

  const hash = await bcrypt.hash(mot_de_passe, 10);
  const id = await avocatRepo.create({ nom, prenom, email, mot_de_passe: hash, specialite, localisation, annees_experience, numero_barre, description });

  const token = genererToken({ id, email, role: 'avocat' });
  return { id, nom, prenom, email, role: 'avocat', token };
};

const connecter = async ({ email, mot_de_passe, role }) => {
  let utilisateur = null;

  if (role === 'client') {
    utilisateur = await clientRepo.findByEmail(email);
  } else if (role === 'avocat') {
    utilisateur = await avocatRepo.findByEmail(email);
  } else if (role === 'administrateur') {
    utilisateur = await adminRepo.findByEmail(email);
  } else {
    throw { status: 400, message: 'Rôle invalide' };
  }

  if (!utilisateur) throw { status: 401, message: 'Email ou mot de passe incorrect' };

  const ok = await bcrypt.compare(mot_de_passe, utilisateur.mot_de_passe);
  if (!ok) throw { status: 401, message: 'Email ou mot de passe incorrect' };

  const token = genererToken({ id: utilisateur.id, email: utilisateur.email, role });

  return {
    id:     utilisateur.id,
    nom:    utilisateur.nom,
    prenom: utilisateur.prenom,
    email:  utilisateur.email,
    role,
    token,
  };
};

module.exports = { inscrireClient, inscrireAvocat, connecter };