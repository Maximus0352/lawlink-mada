CREATE DATABASE IF NOT EXISTS lawlink_mada
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lawlink_mada;

CREATE TABLE clients (
    id INT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    telephone VARCHAR(20) DEFAULT NULL,
    adresse VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_client PRIMARY KEY (id)
);

CREATE TABLE avocats (
    id INT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    specialite VARCHAR(100) NOT NULL,
    localisation VARCHAR(150) NOT NULL,
    annees_experience INT NOT NULL DEFAULT 0,
    numero_barre VARCHAR(50) NOT NULL UNIQUE,
    est_verifie TINYINT(1) NOT NULL DEFAULT 0,
    description TEXT DEFAULT NULL,
    score_pertinence FLOAT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_avocats PRIMARY KEY (id)
);

CREATE TABLE administrateurs (
    id INT NOT NULL AUTO_INCREMENT,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_admin PRIMARY KEY (id)
);

CREATE TABLE demandes (
    id INT NOT NULL AUTO_INCREMENT,
    client_id INT NOT NULL,
    avocat_id INT NOT NULL,
    objet VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    statut ENUM(
            'envoyee', 
            'recue', 
            'acceptee', 
            'refusee', 
            'en_cours', 
            'terminee'
        ) NOT NULL DEFAULT 'envoyee',
    date_envoi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_maj DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT pk_demande PRIMARY KEY (id),
    CONSTRAINT fk_demande_client FOREIGN KEY (client_id) REFERENCES clients(id)  ON DELETE CASCADE,
    CONSTRAINT fk_demande_avocat FOREIGN KEY (avocat_id) REFERENCES avocats(id)  ON DELETE CASCADE
);

CREATE TABLE rendez_vous (
    id INT NOT NULL AUTO_INCREMENT,
    demande_id INT NOT NULL UNIQUE,
    date_heure DATETIME NOT NULL,
    duree_minutes INT NOT NULL DEFAULT 60,
    statut ENUM(
            'en_attente', 
            'confirme', 
            'annule', 
            'termine'
        ) NOT NULL DEFAULT 'en_attente',
    lieu VARCHAR(255) DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_rdv PRIMARY KEY (id),
    CONSTRAINT fk_rdv_demande FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE CASCADE
);

CREATE TABLE disponibilites (
    id INT NOT NULL AUTO_INCREMENT,
    avocat_id INT NOT NULL,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    heure_fin TIME NOT NULL,
    est_libre TINYINT(1) NOT NULL DEFAULT 1,

    CONSTRAINT pk_dispo PRIMARY KEY (id),
    CONSTRAINT fk_dispo_avocat FOREIGN KEY (avocat_id) REFERENCES avocats(id) ON DELETE CASCADE
);

CREATE TABLE portfolios (
    id INT NOT NULL AUTO_INCREMENT,
    avocat_id INT NOT NULL,
    titre VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    domaine VARCHAR(100) DEFAULT NULL,
    date_ajout DATE NOT NULL DEFAULT (CURRENT_DATE),

    CONSTRAINT pk_portfolio PRIMARY KEY (id),
    CONSTRAINT fk_portfolio_avocat FOREIGN KEY (avocat_id) REFERENCES avocats(id) ON DELETE CASCADE
);

CREATE TABLE notifications (
    id INT NOT NULL AUTO_INCREMENT,
    destinataire_id INT NOT NULL,
    role_destinataire ENUM(
            'client', 
            'avocat', 
            'administrateur'
        ) NOT NULL,
    demande_id INT DEFAULT NULL,
    type ENUM(
            'nouvelle_demande',
            'demande_acceptee',
            'demande_refusee',
            'rdv_confirme',
            'rdv_annule',
            'profil_verifie',
            'message'
        )NOT NULL,
    message TEXT NOT NULL,
    est_lue TINYINT(1) NOT NULL DEFAULT 0,
    date_envoi DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_notif PRIMARY KEY (id),
    CONSTRAINT fk_notif_demande FOREIGN KEY (demande_id) REFERENCES demandes(id) ON DELETE SET NULL
);