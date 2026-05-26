-- ============================================================
--  StockHome – Mock Data
--  Run against the stockhome schema before executing this.
--  Passwords are stored in plain text (development only).
-- ============================================================

USE stockhome;

SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM products;
DELETE FROM storage_locations;
DELETE FROM users;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
--  USERS
-- ============================================================
INSERT INTO users (username, first_name, last_name, email, password, is_admin, is_active, last_login) VALUES
('thomas.mueller', 'Thomas', 'Müller',  'thomas.mueller@example.com', 'Password123!', TRUE,  TRUE,  '2025-05-25 08:30:00'),
('sarah.mueller',  'Sarah',  'Müller',  'sarah.mueller@example.com',  'Password123!', FALSE, TRUE,  '2025-05-24 19:15:00'),
('max.schmidt',    'Max',    'Schmidt', 'max.schmidt@example.com',    'Password123!', FALSE, FALSE, '2025-03-10 11:00:00');

-- ============================================================
--  STORAGE LOCATIONS
-- ============================================================
INSERT INTO storage_locations (name, description) VALUES
('Kühlschrank',    'Kühlschrank in der Küche'),
('Gefrierfach 1',  'Oberes Gefrierfach – Fleisch und Fisch'),
('Gefrierfach 2',  'Unteres Gefrierfach – Gemüse und Fertiggerichte'),
('Vorratskammer',  'Regal im Flur, Trockenware und Konserven'),
('Keller Regal A', 'Keller links – Getränke und Eingemachtes'),
('Keller Regal B', 'Keller rechts – Hygieneartikel und Reinigungsmittel'),
('Garage Regal',   'Garage – Werkzeug, Öle, Autopflege');

-- ============================================================
--  PRODUCTS
--  Storage locations are looked up by name since UUIDs are
--  auto-generated above and not known at insert time.
-- ============================================================

-- Gefrierfach 1
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Hähnchenbrust',     'Tiefgekühlte Hähnchenbrustfilets, vakuumverpackt', '6.49',  5, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 1'), '2026-01-10', '2025-01-10'),
('Lachs Filet',       'Tiefgefrorenes Lachsfilet, Atlantic, 500g',        '12.99', 1, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 1'), '2025-12-31', '2025-02-20'),
('Hackfleisch',       'Rind und Schwein gemischt, 500g Portion',           '3.99',  3, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 1'), '2026-02-15', '2025-01-28');

-- Gefrierfach 2
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Erbsen TK',         'Tiefkühlerbsen, 750g Packung',                      '1.99',  3, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 2'), '2026-06-01', '2025-03-05'),
('Spinat TK',         'Blattspinat tiefgefroren, 450g',                    '1.49',  2, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 2'), '2026-04-01', '2025-02-10'),
('Pizza Margherita',  'Tiefkühlpizza, 350g',                               '2.29',  4, (SELECT uuid FROM storage_locations WHERE name = 'Gefrierfach 2'), '2025-11-30', NULL);

-- Kühlschrank
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Vollmilch',         '3,5% Fett, 1 Liter',                               '1.09',  2, (SELECT uuid FROM storage_locations WHERE name = 'Kühlschrank'),   '2025-05-29', NULL),
('Butter',            'Deutsche Markenbutter, 250g',                       '1.89',  3, (SELECT uuid FROM storage_locations WHERE name = 'Kühlschrank'),   '2025-07-01', NULL),
('Gouda am Stück',    'Junger Gouda, ca. 400g',                            '3.29',  1, (SELECT uuid FROM storage_locations WHERE name = 'Kühlschrank'),   '2025-06-15', NULL);

-- Vorratskammer
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Spaghetti',         'Barilla Nr. 5, 500g',                               '1.29',  5, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2027-02-01', NULL),
('Basmatireis',       'Uncle Ben''s, 1kg',                                 '2.49',  2, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2027-01-05', NULL),
('Tomaten gehackt',   'Mutti, 400g Dose',                                  '0.89',  8, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2027-01-01', '2024-11-01'),
('Kichererbsen',      'ja!, 400g Dose in Lake',                            '0.79',  4, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2027-06-01', '2024-12-01'),
('Haferflocken',      'Kölln, zarte Haferflocken, 500g',                   '1.49',  2, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2026-09-10', NULL),
('Thunfisch in Öl',   'Rio Mare, 3er Pack in Olivenöl',                    '3.49',  2, (SELECT uuid FROM storage_locations WHERE name = 'Vorratskammer'), '2026-08-01', '2025-01-20');

-- Keller Regal A
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Mineralwasser',     'Volvic still, 1,5L Flasche',                        '0.79', 12, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal A'), '2027-02-15', NULL),
('Apfelsaft',         'Valensina naturtrüb, 1L',                           '1.99',  3, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal A'), '2026-03-01', '2025-03-01'),
('Erdbeerkonfitüre',  'Selbst eingemacht, 250ml Glas',                     NULL,    6, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal A'), '2026-07-01', '2025-07-15');

-- Keller Regal B
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Toilettenpapier',   'Zewa, 3-lagig, 16 Rollen',                         '4.99',  3, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal B'), NULL, NULL),
('Handseife',         'Dove, pflegend, 250ml',                             '2.29',  0, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal B'), '2026-02-10', '2025-02-10'),
('Waschmittel',       'Persil Color, 20 Waschladungen',                    '8.99',  1, (SELECT uuid FROM storage_locations WHERE name = 'Keller Regal B'), NULL, NULL);

-- Garage Regal
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date) VALUES
('Motoröl 5W-30',     'Castrol EDGE, 1L Flasche',                         '14.99', 2, (SELECT uuid FROM storage_locations WHERE name = 'Garage Regal'), NULL, NULL),
('Fahrradkette',      'Shimano HG-54, 11-fach',                           '18.50', 1, (SELECT uuid FROM storage_locations WHERE name = 'Garage Regal'), NULL, NULL);