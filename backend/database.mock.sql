-- =============================================================
--  STOCKHOME – MOCK DATA
--  Generiert: 10 User, 10 Storage Locations, ~80 Produkte
-- =============================================================

USE stockhome;

-- -------------------------------------------------------------
-- USERS  (Passwörter: bcrypt-Hash von "Password123!")
-- -------------------------------------------------------------
INSERT INTO users (uuid, username, first_name, last_name, email, password, is_admin, is_active, last_login, profile_picture) VALUES
(UUID_TO_BIN(UUID()), 'admin',          'Max',      'Mustermann', 'admin@stockhome.de',         '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', TRUE,  TRUE,  '2026-05-28 08:15:00', NULL),
(UUID_TO_BIN(UUID()), 'lena.schmidt',   'Lena',     'Schmidt',    'lena.schmidt@mail.de',       '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-27 19:42:00', NULL),
(UUID_TO_BIN(UUID()), 'tom.wagner',     'Tom',      'Wagner',     'tom.wagner@mail.de',         '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-26 11:00:00', NULL),
(UUID_TO_BIN(UUID()), 'anna.becker',    'Anna',     'Becker',     'anna.becker@mail.de',        '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-25 09:30:00', NULL),
(UUID_TO_BIN(UUID()), 'felix.braun',    'Felix',    'Braun',      'felix.braun@mail.de',        '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-24 14:20:00', NULL),
(UUID_TO_BIN(UUID()), 'sarah.meyer',    'Sarah',    'Meyer',      'sarah.meyer@mail.de',        '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-23 18:05:00', NULL),
(UUID_TO_BIN(UUID()), 'jan.hoffmann',   'Jan',      'Hoffmann',   'jan.hoffmann@mail.de',       '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-21 07:55:00', NULL),
(UUID_TO_BIN(UUID()), 'lisa.wolf',      'Lisa',     'Wolf',       'lisa.wolf@mail.de',          '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, FALSE, NULL,                  NULL),
(UUID_TO_BIN(UUID()), 'markus.keller',  'Markus',   'Keller',     'markus.keller@mail.de',      '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-20 16:30:00', NULL),
(UUID_TO_BIN(UUID()), 'nina.schulz',    'Nina',     'Schulz',     'nina.schulz@mail.de',        '$2b$12$KIXxLz5Y9N2q0oRtP1uWQeHmJvA3bCdEfGhIjKlMnOpQrStUvWxYz', FALSE, TRUE,  '2026-05-19 12:00:00', NULL);


-- -------------------------------------------------------------
-- STORAGE LOCATIONS
-- -------------------------------------------------------------
-- Wir speichern die UUIDs in User-Variablen, damit die
-- Produkt-INSERTs darauf referenzieren können.
-- -------------------------------------------------------------
SET @sl_keller     = UUID();
SET @sl_kueche     = UUID();
SET @sl_speisekammer = UUID();
SET @sl_garage     = UUID();
SET @sl_bad        = UUID();
SET @sl_buero      = UUID();
SET @sl_wohnzimmer = UUID();
SET @sl_balkon     = UUID();
SET @sl_hobbyraum  = UUID();
SET @sl_schlafzimmer = UUID();

INSERT INTO storage_locations (uuid, name, description) VALUES
(UUID_TO_BIN(@sl_keller),       'Keller',          'Hauptlager im Untergeschoss; kühl und trocken, ideal für Konserven und Getränke.'),
(UUID_TO_BIN(@sl_kueche),       'Küche',            'Küchenschränke und Vorratsregale direkt in der Küche.'),
(UUID_TO_BIN(@sl_speisekammer), 'Speisekammer',     'Separater Vorratsraum angrenzend an die Küche.'),
(UUID_TO_BIN(@sl_garage),       'Garage',           'Regal in der Garage; für Reinigungsmittel, Werkzeug und Großeinkäufe.'),
(UUID_TO_BIN(@sl_bad),          'Badezimmer',       'Unterschrank und Spiegelschrank im Badezimmer.'),
(UUID_TO_BIN(@sl_buero),        'Büro',             'Büroregal und Schubladen; Bürobedarf und Elektronik-Zubehör.'),
(UUID_TO_BIN(@sl_wohnzimmer),   'Wohnzimmer',       'Sideboard und TV-Möbel im Wohnzimmer.'),
(UUID_TO_BIN(@sl_balkon),       'Balkon',           'Balkonbox und Außenregal; Gartenbedarf und Outdoor-Artikel.'),
(UUID_TO_BIN(@sl_hobbyraum),    'Hobbyraum',        'Werkstatt und Bastelbedarf im Hobbyraum.'),
(UUID_TO_BIN(@sl_schlafzimmer), 'Schlafzimmer',     'Kleiderschrank und Nachttischschublade.');


-- -------------------------------------------------------------
-- PRODUCTS
-- Verteilt auf alle 10 Storage Locations (~8 pro Location)
-- -------------------------------------------------------------

-- == KELLER ===================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Mineralwasser Still 1,5 l',   'Stilles Mineralwasser in der 1,5-Liter-Flasche.',          '0.49',  24, UUID_TO_BIN(@sl_keller), '2028-01-31', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mineralwasser Sprudel 1,5 l', 'Kohlensäurehaltiges Mineralwasser.',                       '0.55',  18, UUID_TO_BIN(@sl_keller), '2027-12-31', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Rotwein Cabernet 0,75 l',     'Trockener Rotwein aus Spanien.',                           '6.99',   6, UUID_TO_BIN(@sl_keller), NULL,         '2022-09-01', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Weißwein Riesling 0,75 l',    'Feinherber Riesling vom Rhein.',                           '8.49',   4, UUID_TO_BIN(@sl_keller), NULL,         '2023-05-15', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Bier Pils 0,5 l (Kasten)',    '20 Flaschen Pils, Pfand inklusive.',                       '14.99',  2, UUID_TO_BIN(@sl_keller), '2026-11-30', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Orangensaft 1 l',             '100 % Orangensaft, keine Zuckerzusätze.',                  '1.29',  12, UUID_TO_BIN(@sl_keller), '2026-08-15', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Apfelsaft trüb 1 l',          'Naturtrüber Apfelsaft aus heimischen Äpfeln.',             '1.49',   8, UUID_TO_BIN(@sl_keller), '2026-09-01', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Tomatensoße (Dose) 400 g',    'Passierte Tomaten, leicht gewürzt.',                       '0.79',  10, UUID_TO_BIN(@sl_keller), '2027-06-30', NULL,         NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Erbsen (Dose) 400 g',         'Zarte Erbsen in Lake.',                                    '0.69',   8, UUID_TO_BIN(@sl_keller), '2027-03-31', NULL,         NULL, FALSE);

-- == KÜCHE ====================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Olivenöl extra vergine 500 ml','Kaltgepresstes Olivenöl aus Italien.',                    '7.49',   2, UUID_TO_BIN(@sl_kueche), '2027-04-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Sonnenblumenöl 1 l',          'Raffiniertes Sonnenblumenöl zum Braten.',                  '2.19',   3, UUID_TO_BIN(@sl_kueche), '2027-01-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Salz Jodsalz 500 g',          'Jodiertes Speisesalz.',                                    '0.39',   4, UUID_TO_BIN(@sl_kueche), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pfeffer gemahlen 50 g',        'Schwarzer Pfeffer, fein gemahlen.',                       '1.19',   2, UUID_TO_BIN(@sl_kueche), '2028-06-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Zucker 1 kg',                  'Weißer Haushaltszucker.',                                 '1.09',   3, UUID_TO_BIN(@sl_kueche), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mehl Type 405 1 kg',           'Weizenmehl für Kuchen und Gebäck.',                       '0.89',   2, UUID_TO_BIN(@sl_kueche), '2026-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Backpulver 3×15 g',            'Weinstein-Backpulver, 3er-Pack.',                         '0.59',   3, UUID_TO_BIN(@sl_kueche), '2027-09-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Spaghetti 500 g',              'Hartweizengriess-Nudeln, Kochzeit 9 min.',                '0.99',   6, UUID_TO_BIN(@sl_kueche), '2028-02-28', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Penne Rigate 500 g',           'Gerippte Röhrennudeln aus Hartweizengriess.',             '1.09',   4, UUID_TO_BIN(@sl_kueche), '2028-02-28', NULL, NULL, FALSE);

-- == SPEISEKAMMER =============================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Thunfisch in Öl 185 g',        'Echter Yellowfin-Thunfisch in Sonnenblumenöl.',           '1.99',  10, UUID_TO_BIN(@sl_speisekammer), '2028-05-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mais (Dose) 285 g',             'Zarte Maiskörner in Lake.',                               '0.89',   6, UUID_TO_BIN(@sl_speisekammer), '2027-08-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Kidneybohnen (Dose) 400 g',    'Rote Kidneybohnen, vorgegart.',                           '0.79',   8, UUID_TO_BIN(@sl_speisekammer), '2027-10-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Kichererbsen (Dose) 400 g',    'Vorgegarte Kichererbsen für Hummus & Salate.',            '0.89',   6, UUID_TO_BIN(@sl_speisekammer), '2027-11-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Kokosmilch 400 ml',            'Cremige Kokosmilch, 17 % Fett.',                          '1.49',   5, UUID_TO_BIN(@sl_speisekammer), '2027-07-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Honig Wildblüte 500 g',        'Naturreiner Wildblütenhonig aus Deutschland.',            '4.99',   2, UUID_TO_BIN(@sl_speisekammer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Marmelade Erdbeere 450 g',     'Erdbeermarmelade mit 55 % Fruchtanteil.',                 '2.29',   3, UUID_TO_BIN(@sl_speisekammer), '2027-03-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Nussnougatcreme 400 g',        'Nuss-Nougat-Aufstrich, klassisch.',                       '2.79',   2, UUID_TO_BIN(@sl_speisekammer), '2027-01-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Haferflocken Zart 500 g',      'Zarte Haferflocken für Porridge und Müsli.',              '0.99',   3, UUID_TO_BIN(@sl_speisekammer), '2027-05-31', NULL, NULL, FALSE);

-- == GARAGE ===================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Allzweckreiniger 1 l',         'Konzentrierter Allzweckreiniger, Lavendelduft.',           '2.49',   4, UUID_TO_BIN(@sl_garage), '2029-01-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Glasreiniger 500 ml',           'Streifenfreier Glasreiniger im Sprühkopf.',               '1.99',   3, UUID_TO_BIN(@sl_garage), '2028-06-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'WC-Reiniger 750 ml',            'Entkalkender WC-Reiniger.',                               '1.59',   5, UUID_TO_BIN(@sl_garage), '2028-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Waschmittel Pulver 2 kg',       'Color-Waschmittel für bunte Wäsche, 30 WL.',              '8.99',   2, UUID_TO_BIN(@sl_garage), '2028-03-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Weichspüler 1,5 l',             'Weichspüler mit Frühlingsduft.',                          '3.49',   2, UUID_TO_BIN(@sl_garage), '2028-01-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Müllbeutel 60 l (30 Stück)',   'Robuste Abfallbeutel, reißfest.',                         '3.99',   3, UUID_TO_BIN(@sl_garage), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Klebeband 50 m',                'Universalklebeband, transparent, 50 m.',                  '1.29',   5, UUID_TO_BIN(@sl_garage), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Motoröl 5W-30 1 l',            'Vollsynthetisches Motoröl für PKW.',                      '9.99',   4, UUID_TO_BIN(@sl_garage), '2030-12-31', NULL, NULL, FALSE);

-- == BADEZIMMER ===============================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Shampoo Normal 300 ml',         'Pflegendes Shampoo für normales Haar.',                   '2.99',   3, UUID_TO_BIN(@sl_bad), '2028-06-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Duschgel Frisch 250 ml',        'Erfrischendes Duschgel mit Minzextrakt.',                 '1.99',   4, UUID_TO_BIN(@sl_bad), '2028-04-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Zahnpasta Weiß 75 ml',          'Aufhellende Zahnpasta mit Fluorid.',                      '2.49',   5, UUID_TO_BIN(@sl_bad), '2027-11-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mundspülung 500 ml',            'Antibakterielle Mundspülung ohne Alkohol.',               '3.49',   2, UUID_TO_BIN(@sl_bad), '2027-08-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Handcreme 75 ml',               'Reichhaltige Handcreme mit Sheabutter.',                  '1.79',   3, UUID_TO_BIN(@sl_bad), '2028-02-28', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Rasierklinge 5er-Pack',         'Ersatzklingen für Nassrasierer.',                         '4.99',   2, UUID_TO_BIN(@sl_bad), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Deo Roll-on 50 ml',             'Anti-Transpirant Deo, 48h Schutz.',                       '1.99',   3, UUID_TO_BIN(@sl_bad), '2028-09-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Paracetamol 500 mg (20 Tbl.)', 'Schmerzstillende Tabletten, rezeptfrei.',                 '3.29',   2, UUID_TO_BIN(@sl_bad), '2027-06-30', NULL, NULL, TRUE),
(UUID_TO_BIN(UUID()), 'Pflaster assorted 30er',        'Sortiment aus verschiedenen Wundpflastern.',              '2.99',   2, UUID_TO_BIN(@sl_bad), '2029-01-31', NULL, NULL, FALSE);

-- == BÜRO =====================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Druckerpapier A4 500 Bl.',      'Weißes Standardpapier 80 g/m², Laserdrucker geeignet.',  '5.99',   4, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Kugelschreiber blau 10er',      'Einweg-Kugelschreiber, Strichstärke M.',                  '2.49',   3, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Textmarker Set 4 Farben',       'Leuchtmarker in gelb, pink, grün, orange.',               '3.99',   2, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Haftnotizen 76×76 mm (3×100)', 'Post-it-Blöcke in gelb, rosa, blau.',                    '4.49',   3, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Druckerpatronen Schwarz',       'Tintenpatrone kompatibel mit gängigen Heimdruckern.',     '12.99',  2, UUID_TO_BIN(@sl_buero), '2028-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'USB-Stick 32 GB',               'USB 3.0 Stick, kompaktes Design.',                       '9.99',   3, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'HDMI-Kabel 2 m',               '4K-fähiges HDMI-Kabel, vergoldete Stecker.',              '7.99',   2, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Büroklammern 100er',            'Verzinkte Büroklammern, 33 mm.',                          '0.99',   5, UUID_TO_BIN(@sl_buero), NULL, NULL, NULL, FALSE);

-- == WOHNZIMMER ===============================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Kerzen weiß 4er-Set',           'Stumpenkerzen, Brenndauer je 8 h.',                       '3.49',   4, UUID_TO_BIN(@sl_wohnzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Duftkerze Vanille',             'Sojawachskerze mit Vanilleduft, 200 g.',                  '8.99',   2, UUID_TO_BIN(@sl_wohnzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'AA-Batterien 8er-Pack',         'Alkaline-Batterien 1,5 V.',                               '5.99',   3, UUID_TO_BIN(@sl_wohnzimmer), '2034-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'AAA-Batterien 8er-Pack',        'Alkaline-Batterien 1,5 V, Typ Micro.',                    '5.99',   2, UUID_TO_BIN(@sl_wohnzimmer), '2034-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Fernbedienung Universal',       'Universalfernbedienung für TV und SAT.',                  '14.99',  1, UUID_TO_BIN(@sl_wohnzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Zeitschriften-Sammelmappe',     'Aufbewahrungsmappe A4, schwarz.',                         '6.49',   2, UUID_TO_BIN(@sl_wohnzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Raumspray Frische 300 ml',      'Erfrischendes Raumspray mit Meeresduft.',                 '3.99',   3, UUID_TO_BIN(@sl_wohnzimmer), '2028-06-30', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Servietten 3-lagig 100er',      'Papierservietten 33×33 cm, weiß.',                       '2.49',   4, UUID_TO_BIN(@sl_wohnzimmer), NULL,         NULL, NULL, FALSE);

-- == BALKON ===================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Blumenerde Universal 20 l',     'Universalerde für Balkon- und Topfpflanzen.',              '4.99',   3, UUID_TO_BIN(@sl_balkon), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Dünger Langzeit 1 kg',          'Granulat-Langzeitdünger für 3 Monate.',                   '6.99',   2, UUID_TO_BIN(@sl_balkon), '2028-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pflanzstäbe 60 cm 10er',        'Bambusstäbe zum Stützen von Pflanzen.',                   '2.49',   5, UUID_TO_BIN(@sl_balkon), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Gießkanne 10 l',                'Kunststoffgießkanne mit langem Ausguss.',                 '12.99',  1, UUID_TO_BIN(@sl_balkon), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Insektenschutzspray 200 ml',    'Schutzspray gegen Mücken und Zecken.',                    '5.99',   3, UUID_TO_BIN(@sl_balkon), '2027-05-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Blumenkübel rund 30 cm',        'Kunststoffkübel mit Untersetzer, terrakotta.',            '7.99',   4, UUID_TO_BIN(@sl_balkon), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Anzuchterde fein 5 l',          'Keimfreie Anzuchterde für Samen.',                        '3.99',   2, UUID_TO_BIN(@sl_balkon), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Sonnencreme LSF 30 200 ml',     'Wasserresistente Sonnencreme für Outdoor-Aktivitäten.',   '9.99',   2, UUID_TO_BIN(@sl_balkon), '2028-03-31', NULL, NULL, FALSE);

-- == HOBBYRAUM ================================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Acrylfarbe Set 12 Farben',      '12 × 20 ml Acrylfarbe, wasserlöslich.',                  '14.99',  2, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pinsel-Set 10 Stück',           'Nylon-Haarpinsel in verschiedenen Größen.',               '8.49',   2, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Leinwand 30×40 cm',             'Grundierte Baumwollleinwand auf Keilrahmen.',             '4.99',   5, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Heißklebepistole + 20 Sticks', 'Elektrische Heißklebepistole inkl. Klebesticks.',         '12.99',  1, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Bastelschere 21 cm',            'Universalschere mit ergonomischem Griff.',                '3.99',   3, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Holzleisten 30 cm (10er)',      'Naturholz-Leisten für Modellbau und Basteln.',            '3.49',   4, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Modelliermasse weiß 500 g',     'Aushärtende Modelliermasse, lufttrocknend.',              '6.99',   2, UUID_TO_BIN(@sl_hobbyraum), '2027-12-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Schleifpapier Set K80–K240',    'Sortiment 10 Blatt in vier Körnungen.',                   '4.49',   3, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Schraubenset 200-teilig',       'Sortiment Senkkopfschrauben M3–M6.',                      '9.99',   2, UUID_TO_BIN(@sl_hobbyraum), NULL, NULL, NULL, FALSE);

-- == SCHLAFZIMMER =============================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES
(UUID_TO_BIN(UUID()), 'Schlafmaske Seide',             'Hautfreundliche Schlafmaske aus Seidenmischgewebe.',       '9.99',   2, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Ohrstöpsel Schaumstoff 5 Paar', 'Geräuschreduzierende Ohrstöpsel SNR 35 dB.',              '3.49',   4, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Lavendel-Kissenspray 100 ml',   'Entspannendes Einschlaf-Spray mit Lavendelöl.',           '6.99',   2, UUID_TO_BIN(@sl_schlafzimmer), '2027-10-31', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mottenschutz-Säckchen 10er',    'Natürlicher Mottenschutz mit Zedernholzduft.',            '4.99',   3, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Kleiderbügel Holz 10er',        'Massivholz-Kleiderbügel, antirutsch.',                    '8.99',   2, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Schuhputzset 4-teilig',         'Bürste, Schwamm, Creme und Tuch im Set.',                 '7.49',   1, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Nachtlicht LED warmweiß',       'Steckdosen-Nachtlicht mit Dämmerungssensor.',             '5.99',   2, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Wecker digital',                'Digitaler Wecker mit Snooze-Funktion, batteriebetrieben.','12.99',  1, UUID_TO_BIN(@sl_schlafzimmer), NULL,         NULL, NULL, FALSE);

-- =============================================================
-- app_settings bleibt unverändert (bereits per Schema angelegt)
-- =============================================================