-- =============================================================
--  STOCKHOME – MOCK DATA
--  Generates: 5 Storage Locations, ~100 Products
-- =============================================================

USE stockhome;

-- =============================================
-- Storage Locations (5)
-- =============================================
INSERT INTO storage_locations (uuid, name, description) VALUES
(UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), 'Main Freezer',        'Large chest freezer in the basement'),
(UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), 'Kitchen Freezer',     'Freezer compartment of the kitchen fridge'),
(UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), 'Pantry',              'Dry goods storage in the hallway'),
(UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), 'Kitchen Fridge',      'Main refrigerator in the kitchen'),
(UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), 'Cellar Shelf',        'Cool storage shelves in the cellar');

-- =============================================
-- Products (~100)
-- Self-frozen items have a bottling_date.
-- Store-bought items have bottling_date = NULL.
-- =============================================
INSERT INTO products (uuid, name, description, price, amount, storage_location, expiry_date, bottling_date, picture, deleted) VALUES

-- ── Self-frozen items (Main Freezer) ──
(UUID_TO_BIN(UUID()), 'Strawberry Puree',          'Blended fresh strawberries',           NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-15', '2026-06-01', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Tomato Sauce',              'Homemade marinara sauce',              NULL, 6,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-01-10', '2026-05-20', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Chicken Broth',             'Slow-cooked bone broth',               NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-11-30', '2026-04-15', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Blanched Green Beans',      'Garden green beans, blanched',         NULL, 5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-02-01', '2026-05-28', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pesto Cubes',               'Basil pesto in ice cube trays',        NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-01', '2026-05-10', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Raspberry Jam',             'Homemade seedless raspberry jam',      NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-03-01', '2026-06-02', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Beef Stew',                 'Leftover beef stew, portioned',        NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-10-15', '2026-04-20', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Blanched Spinach',          'Fresh spinach, blanched and pressed',  NULL, 6,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-01-20', '2026-05-15', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mango Chunks',              'Diced ripe mangoes',                   NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-20', '2026-05-25', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Carrot Soup',               'Pureed carrot ginger soup',            NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-11-01', '2026-04-10', NULL, FALSE),

-- ── Self-frozen items (Kitchen Freezer) ──
(UUID_TO_BIN(UUID()), 'Blueberry Mix',             'Mixed blueberries from the garden',    NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-12-10', '2026-06-03', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Zucchini Slices',           'Sliced and blanched zucchini',         NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-01-15', '2026-05-18', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Apple Sauce',               'Homemade cinnamon apple sauce',        NULL, 5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-02-10', '2026-05-22', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Bolognese Sauce',           'Classic meat sauce, portioned',        NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-11-20', '2026-04-25', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Herb Butter',               'Parsley and garlic butter logs',       NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-12-30', '2026-05-30', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Peach Slices',              'Frozen ripe peach slices',             NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-01-05', '2026-06-01', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Corn Kernels',              'Fresh sweet corn, cut off the cob',    NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-02-20', '2026-05-12', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pumpkin Puree',             'Roasted and pureed butternut squash',  NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-03-10', '2026-05-08', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Lemon Juice Cubes',         'Fresh lemon juice frozen in cubes',    NULL, 6,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-04-01', '2026-06-02', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Minced Garlic',             'Peeled and minced garlic cloves',      NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-01-25', '2026-05-14', NULL, FALSE),

-- ── Self-frozen items (split across storages) ──
(UUID_TO_BIN(UUID()), 'Vegetable Stock',           'Homemade veggie stock',                NULL, 5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-05', '2026-04-30', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Rhubarb Compote',           'Stewed rhubarb with sugar',            NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-01-30', '2026-05-05', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cherry Halves',             'Pitted sour cherries',                 NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-25', '2026-06-01', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cauliflower Florets',       'Blanched cauliflower pieces',          NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-02-15', '2026-05-19', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Plum Jam',                  'Homemade plum jam',                    NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-03-20', '2026-05-27', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mushroom Duxelles',         'Finely chopped sauteed mushrooms',     NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-11-10', '2026-04-18', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Chili Con Carne',           'Portioned homemade chili',             NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-10-30', '2026-04-12', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Banana Slices',             'Ripe banana slices for smoothies',     NULL, 5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-12-08', '2026-06-03', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Parsley Cubes',             'Chopped parsley in olive oil cubes',   NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-04-15', '2026-05-31', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Lentil Soup',               'Thick homemade lentil soup',           NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-11-25', '2026-04-22', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Blackberry Puree',          'Strained wild blackberries',           NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-01-12', '2026-06-02', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Roasted Bell Peppers',      'Peeled roasted red peppers',           NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-02-28', '2026-05-16', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Goulash',                   'Hungarian-style beef goulash',         NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-10-20', '2026-04-08', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mixed Berry Smoothie Pack', 'Pre-portioned smoothie mix',           NULL, 6,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-12-18', '2026-06-04', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Leek Cream Soup',           'Pureed leek and potato soup',          NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-11-15', '2026-04-28', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Diced Onions',              'Pre-diced yellow onions',              NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-03-05', '2026-05-24', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Grape Juice Concentrate',   'Reduced grape juice for desserts',     NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-02-05', '2026-05-11', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Currant Jelly',             'Red currant jelly',                    NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-04-10', '2026-06-01', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Broccoli Florets',          'Blanched broccoli pieces',             NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-01-08', '2026-05-20', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Sweet Potato Mash',         'Roasted and mashed sweet potatoes',    NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-12-28', '2026-05-17', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Apricot Halves',            'Frozen ripe apricot halves',           NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-02-12', '2026-06-03', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Minestrone',                'Chunky Italian vegetable soup',        NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-11-08', '2026-04-14', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pea Puree',                 'Fresh garden peas, pureed',            NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-03-15', '2026-05-26', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cranberry Sauce',           'Homemade whole berry cranberry sauce', NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-01-18', '2026-05-09', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Egg Noodles',               'Homemade egg noodles, pre-cooked',     NULL, 5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2026-12-12', '2026-05-29', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Gooseberry Compote',        'Stewed gooseberries',                  NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2027-02-22', '2026-06-02', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Creamed Corn',              'Homemade creamed corn',                NULL, 3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-01-28', '2026-05-21', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Chicken Curry',             'Portioned Thai green curry',           NULL, 2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), '2026-10-25', '2026-04-16', NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Dill Cubes',                'Chopped dill frozen in water cubes',   NULL, 4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), '2027-04-20', '2026-06-01', NULL, FALSE),

-- ── Store-bought items (no bottling_date) ──

-- Kitchen Fridge
(UUID_TO_BIN(UUID()), 'Whole Milk',                'Full-fat milk, 1 liter',               '1.19',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-14', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Greek Yogurt',              'Plain Greek yogurt, 500g',             '2.49',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-20', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Butter',                    'Unsalted butter, 250g',                '2.29',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-07-15', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cheddar Cheese',            'Mature cheddar block, 400g',           '3.49',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-08-10', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cream Cheese',              'Philadelphia original, 200g',          '1.89',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-25', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Orange Juice',              'Fresh squeezed, 1 liter',              '2.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-12', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Eggs',                      'Free-range eggs, pack of 10',          '3.29',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-18', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Ham Slices',                'Cooked ham, 200g pack',                '2.19',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-10', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mozzarella',                'Fresh mozzarella ball, 125g',          '1.49',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-09', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Hummus',                    'Classic chickpea hummus, 300g',        '2.29',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-15', NULL, NULL, FALSE),

-- Pantry
(UUID_TO_BIN(UUID()), 'Pasta Spaghetti',           'Durum wheat spaghetti, 500g',          '1.29',  4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-03-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Basmati Rice',              'Long grain basmati, 1kg',              '2.99',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-06-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Tomatoes',           'Chopped tomatoes, 400g tin',           '0.89',  6,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-01-15', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Chickpeas',          'Chickpeas in water, 400g',             '0.99',  4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-04-10', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Olive Oil',                 'Extra virgin olive oil, 500ml',        '5.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-09-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Peanut Butter',             'Crunchy peanut butter, 350g',          '3.49',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-02-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Honey',                     'Raw wildflower honey, 500g',           '6.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-12-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Oats',                      'Rolled oats, 1kg',                     '1.99',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-08-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Flour',                     'All-purpose wheat flour, 1kg',         '0.99',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-06-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Sugar',                     'White granulated sugar, 1kg',           '1.49',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2029-01-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Tuna',               'Tuna chunks in sunflower oil, 185g',  '1.79',  5,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-07-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Coconut Milk',              'Full-fat coconut milk, 400ml',         '1.59',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-02-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Soy Sauce',                 'Naturally brewed soy sauce, 250ml',    '2.49',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-05-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Balsamic Vinegar',          'Aged balsamic vinegar, 250ml',         '3.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2029-06-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Dried Lentils',             'Green lentils, 500g',                  '1.69',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-09-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Cornflakes',                'Classic cornflakes, 500g',             '2.19',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-04-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Black Beans',               'Canned black beans, 400g',             '1.09',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-08-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Mustard',                   'Dijon mustard, 200g jar',              '1.89',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2027-11-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Dried Pasta Penne',         'Penne rigate, 500g',                   '1.19',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-05-15', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Maple Syrup',               'Pure Canadian maple syrup, 250ml',     '7.49',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), '2028-10-01', NULL, NULL, FALSE),

-- Cellar Shelf
(UUID_TO_BIN(UUID()), 'Canned Corn',               'Sweet corn kernels, 340g',             '1.09',  4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-03-15', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Peas',               'Garden peas, 400g tin',                '0.89',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-06-10', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Apple Cider Vinegar',       'Organic apple cider vinegar, 500ml',   '3.29',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-11-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Sunflower Oil',             'Refined sunflower oil, 1 liter',       '2.49',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2027-10-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Tomato Paste',              'Double concentrated, 200g tube',       '1.29',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-01-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Sardines',           'Sardines in olive oil, 120g',          '2.19',  4,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-09-15', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Pickled Cucumbers',         'Whole pickled gherkins, 670g jar',     '1.99',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2027-12-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Jam Strawberry',            'Store-bought strawberry jam, 450g',    '2.79',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2027-07-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Canned Peaches',            'Peach halves in syrup, 420g',          '1.69',  3,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2028-04-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Crackers',                  'Whole wheat crackers, 200g',           '1.89',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), '2027-05-01', NULL, NULL, FALSE),

-- Additional Kitchen Fridge items
(UUID_TO_BIN(UUID()), 'Salami',                    'Italian salami slices, 100g',          '2.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-20', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Parmesan',                  'Parmigiano Reggiano wedge, 200g',      '4.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-09-01', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Smoked Salmon',             'Sliced smoked salmon, 100g',           '3.99',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-08', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Heavy Cream',               'Whipping cream 35%, 200ml',            '1.29',  2,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-16', NULL, NULL, FALSE),
(UUID_TO_BIN(UUID()), 'Tofu',                      'Firm organic tofu, 400g',              '2.49',  1,  UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), '2026-06-22', NULL, NULL, FALSE);
