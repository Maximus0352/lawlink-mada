USE lawlink_mada;

INSERT INTO clients (nom, prenom, email, mot_de_passe, telephone, adresse) VALUES
('Rakotobe', 'Jean', 'jean.rakotobe@gmail.com', 'rakotobe00', '+261 34 00 000 01', 'Antananarivo'),
('Randria', 'Marie', 'marie.randria@gmail.com', 'marie*andria101', '+261 34 00 000 02', 'Toamasina'),
('Rasolofo', 'Pierre', 'pierre.rasolofo@gmail.com', 'pierrerasolofo11', '+261 33 00 000 03', 'Fianarantsoa'),
('Razafy', 'Tiana', 'tiana.razafy@gmail.com', 'tianarazafy00', '+261 32 00 000 04', 'Antananarivo'),
('Andriamaro', 'Lalao', 'lalao.andriamaro@gmail.com', 'andriamarolalao#', '+261 34 00 000 05', 'Mahajanga');

INSERT INTO avocats (nom, prenom, email, mot_de_passe, specialite, localisation, annees_experience, numero_barre, est_verifie, description, score_pertinence) VALUES
('Rakoto', 'Nirina', 'nirina.rakoto@barreau.mg', 'maitrerakotonirina*101', 'Droit de la famille', 'Antananarivo', 12, '0472', 1, 'Spécialisé en droit de la famille depuis 12 ans. Expert en divorce, succession et garde d enfants.', 92.0),
('Andriantsoa', 'Miora', 'miora.andriantsoa@barreau.mg', 'andriantsoamaitre24', 'Droit commercial', 'Antananarivo',  8, '0485', 1, 'Avocate spécialisée en droit des affaires et contentieux commercial.', 74.0),
('Solofo', 'Rabe', 'rabe.solofo@barreau.mg', 'rabesoloforabe', 'Droit pénal', 'Antananarivo', 5, '0498', 0, 'Avocat pénaliste intervenant principalement sur les affaires criminelles et correctionnelles.', 55.0),
('Hery', 'Fanomezana', 'hery.fanomezana@barreau.mg', 'fanoherylemaitre#', 'Droit du travail', 'Toamasina', 7, '0521', 0, 'Spécialiste en droit social, litiges employeur/employé et licenciements.', 61.0),
('Voahangy', 'Rina', 'voahangy.rina@barreau.mg', 'voahangyrinaimmobilier$$$', 'Droit immobilier', 'Antananarivo', 10, '0519', 1, 'Experte en transactions immobilières, baux commerciaux et contentieux foncier.', 80.0);

INSERT INTO administrateurs (nom, prenom, email, mot_de_passe) VALUES
('Admin', 'LawLink', 'admin@lawlink-mada.mg', 'lawlinkmada*admin');

INSERT INTO disponibilites (avocat_id, date, heure_debut, heure_fin, est_libre) VALUES
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '12:00:00', 1),
(1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '14:00:00', '17:00:00', 1),
(1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '09:00:00', '12:00:00', 1),
(1, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '10:00:00', '16:00:00', 1),
(2, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '08:00:00', '12:00:00', 1),
(2, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '13:00:00', '17:00:00', 1),
(5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00:00', '11:00:00', 1),
(5, DATE_ADD(CURDATE(), INTERVAL 6 DAY), '14:00:00', '18:00:00', 1);

INSERT INTO portfolios (avocat_id, titre, description, domaine) VALUES
(1, '15 divorces amiables traités', 'Accompagnement de couples dans des procédures de divorce à l amiable, gestion des biens communs et accord de garde.', 'Droit de la famille'),
(1, '8 successions réglées', 'Règlement de litiges successoraux entre héritiers, partage de biens immobiliers et mobiliers.', 'Droit civil'),
(1, 'Contentieux familial - décision favorable', 'Représentation d un client dans un litige familial complexe, décision favorable rendue par le tribunal.', 'Droit de la famille'),
(2, '12 gardes d enfants négociées', 'Négociation de modalités de garde dans des divorces conflictuels.', 'Droit de la famille'),
(2, 'Litige commercial gagné', 'Représentation d une PME dans un contentieux contractuel avec un fournisseur.', 'Droit commercial'),
(5, 'Acquisition immobilière sécurisée', 'Accompagnement d un client dans l acquisition d un bien immobilier avec vérification des titres fonciers.', 'Droit immobilier'),
(5, '10 baux commerciaux rédigés', 'Rédaction et négociation de baux commerciaux pour des entreprises locales.', 'Droit immobilier');

INSERT INTO demandes (client_id, avocat_id, objet, message, statut) VALUES
(1, 1, 'Demande de divorce', 'Bonjour Maître, je souhaite entamer une procédure de divorce à l amiable. Pouvez-vous me conseiller sur les démarches à suivre ?', 'acceptee'),
(2, 2, 'Litige commercial', 'Bonjour Maître, j ai un différend avec un fournisseur qui ne respecte pas notre contrat. J ai besoin de votre aide.', 'recue'),
(3, 1, 'Question sur succession', 'Bonjour Maître, mon père est décédé et nous avons des difficultés à partager l héritage avec mes frères et sœurs.',  'envoyee'),
(4, 3, 'Conseil juridique pénal', 'Bonjour Maître, j ai besoin d un conseil sur une affaire pénale qui me concerne.', 'refusee'),
(5, 5, 'Achat terrain', 'Bonjour Maître, je souhaite acheter un terrain et j ai besoin d une vérification des titres fonciers.', 'en_cours');

INSERT INTO rendez_vous (demande_id, date_heure, duree_minutes, statut, lieu) VALUES
(1, DATE_ADD(NOW(), INTERVAL 7 DAY), 60, 'confirme', 'Cabinet Rakoto Nirina – Antananarivo Centre');

INSERT INTO notifications (destinataire_id, role_destinataire, demande_id, type, message) VALUES
(1, 'avocat', 1, 'nouvelle_demande', 'Vous avez reçu une nouvelle demande de contact de Jean Rakotobe.'),
(1, 'client', 1, 'demande_acceptee', 'Votre demande a été acceptée par Me Rakoto Nirina.'),
(1, 'client', 1, 'rdv_confirme', 'Votre rendez-vous avec Me Rakoto Nirina est confirmé.'),
(2, 'avocat', 2, 'nouvelle_demande', 'Vous avez reçu une nouvelle demande de contact de Marie Randria.'),
(3, 'avocat', 3, 'nouvelle_demande', 'Vous avez reçu une nouvelle demande de contact de Pierre Rasolofo.');