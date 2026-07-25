-- =============================================================
--  STOCKHOME – MOCK DATA (EN)
--  Generates: 5 Storage Locations, 94 Products
--
--  Safe to re-run: storage locations are upserted by name, and
--  products reference the locations by looked-up UUID rather
--  than a hardcoded literal. This avoids the FK error 1452 that
--  occurs when a location with the same name already exists
--  (storage_locations.name is UNIQUE) with a different UUID.
--
--  Uncomment the DELETE below if you want a clean product table.
-- =============================================================

USE stockhome;

-- Optional clean slate for products only (keeps user/app settings):
-- DELETE FROM products;

-- =============================================
-- Storage Locations (5)
-- =============================================
INSERT INTO storage_locations (uuid, name, description)
VALUES (UUID_TO_BIN('a1000000-0000-0000-0000-000000000001'), 'Main Freezer', 'Large chest freezer in the basement'),
       (UUID_TO_BIN('a1000000-0000-0000-0000-000000000002'), 'Kitchen Freezer',
        'Freezer compartment of the kitchen fridge'),
       (UUID_TO_BIN('a1000000-0000-0000-0000-000000000003'), 'Pantry', 'Dry goods storage in the hallway'),
       (UUID_TO_BIN('a1000000-0000-0000-0000-000000000004'), 'Kitchen Fridge', 'Main refrigerator in the kitchen'),
       (UUID_TO_BIN('a1000000-0000-0000-0000-000000000005'), 'Cellar Shelf', 'Cool storage shelves in the cellar')
ON DUPLICATE KEY UPDATE description = VALUES(description);

-- =============================================
-- Resolve the actual UUIDs (works whether the rows were just
-- inserted or already existed with different UUIDs)
-- =============================================
SET @loc_main_freezer = (SELECT uuid
                         FROM storage_locations
                         WHERE name = 'Main Freezer');
SET @loc_kitchen_freezer = (SELECT uuid
                            FROM storage_locations
                            WHERE name = 'Kitchen Freezer');
SET @loc_pantry = (SELECT uuid
                   FROM storage_locations
                   WHERE name = 'Pantry');
SET @loc_kitchen_fridge = (SELECT uuid
                           FROM storage_locations
                           WHERE name = 'Kitchen Fridge');
SET @loc_cellar_shelf = (SELECT uuid
                         FROM storage_locations
                         WHERE name = 'Cellar Shelf');

-- =============================================
-- Products (94)
-- uuid, picture, created_at, updated_at and deleted rely on
-- their column defaults.
-- Self-frozen items have a bottling_date.
-- Store-bought items have bottling_date = NULL.
-- =============================================
INSERT INTO products (name, description, price, amount, storage_location, expiry_date, bottling_date)
VALUES

-- ── Self-frozen items (Main Freezer) ──
('Strawberry Puree', 'Blended fresh strawberries', NULL, 4, @loc_main_freezer, '2026-12-15', '2026-06-01'),
('Tomato Sauce', 'Homemade marinara sauce', NULL, 6, @loc_main_freezer, '2027-01-10', '2026-05-20'),
('Chicken Broth', 'Slow-cooked bone broth', NULL, 3, @loc_main_freezer, '2026-11-30', '2026-04-15'),
('Blanched Green Beans', 'Garden green beans, blanched', NULL, 5, @loc_main_freezer, '2027-02-01', '2026-05-28'),
('Pesto Cubes', 'Basil pesto in ice cube trays', NULL, 2, @loc_main_freezer, '2026-12-01', '2026-05-10'),
('Raspberry Jam', 'Homemade seedless raspberry jam', NULL, 3, @loc_main_freezer, '2027-03-01', '2026-06-02'),
('Beef Stew', 'Leftover beef stew, portioned', NULL, 4, @loc_main_freezer, '2026-10-15', '2026-04-20'),
('Blanched Spinach', 'Fresh spinach, blanched and pressed', NULL, 6, @loc_main_freezer, '2027-01-20', '2026-05-15'),
('Mango Chunks', 'Diced ripe mangoes', NULL, 3, @loc_main_freezer, '2026-12-20', '2026-05-25'),
('Carrot Soup', 'Pureed carrot ginger soup', NULL, 4, @loc_main_freezer, '2026-11-01', '2026-04-10'),

-- ── Self-frozen items (Kitchen Freezer) ──
('Blueberry Mix', 'Mixed blueberries from the garden', NULL, 2, @loc_kitchen_freezer, '2026-12-10', '2026-06-03'),
('Zucchini Slices', 'Sliced and blanched zucchini', NULL, 3, @loc_kitchen_freezer, '2027-01-15', '2026-05-18'),
('Apple Sauce', 'Homemade cinnamon apple sauce', NULL, 5, @loc_kitchen_freezer, '2027-02-10', '2026-05-22'),
('Bolognese Sauce', 'Classic meat sauce, portioned', NULL, 3, @loc_kitchen_freezer, '2026-11-20', '2026-04-25'),
('Herb Butter', 'Parsley and garlic butter logs', NULL, 4, @loc_kitchen_freezer, '2026-12-30', '2026-05-30'),
('Peach Slices', 'Frozen ripe peach slices', NULL, 2, @loc_kitchen_freezer, '2027-01-05', '2026-06-01'),
('Corn Kernels', 'Fresh sweet corn, cut off the cob', NULL, 3, @loc_kitchen_freezer, '2027-02-20', '2026-05-12'),
('Pumpkin Puree', 'Roasted and pureed butternut squash', NULL, 4, @loc_kitchen_freezer, '2027-03-10', '2026-05-08'),
('Lemon Juice Cubes', 'Fresh lemon juice frozen in cubes', NULL, 6, @loc_kitchen_freezer, '2027-04-01', '2026-06-02'),
('Minced Garlic', 'Peeled and minced garlic cloves', NULL, 2, @loc_kitchen_freezer, '2027-01-25', '2026-05-14'),

-- ── Self-frozen items (split across storages) ──
('Vegetable Stock', 'Homemade veggie stock', NULL, 5, @loc_main_freezer, '2026-12-05', '2026-04-30'),
('Rhubarb Compote', 'Stewed rhubarb with sugar', NULL, 3, @loc_main_freezer, '2027-01-30', '2026-05-05'),
('Cherry Halves', 'Pitted sour cherries', NULL, 2, @loc_main_freezer, '2026-12-25', '2026-06-01'),
('Cauliflower Florets', 'Blanched cauliflower pieces', NULL, 4, @loc_kitchen_freezer, '2027-02-15', '2026-05-19'),
('Plum Jam', 'Homemade plum jam', NULL, 3, @loc_main_freezer, '2027-03-20', '2026-05-27'),
('Mushroom Duxelles', 'Finely chopped sauteed mushrooms', NULL, 2, @loc_kitchen_freezer, '2026-11-10', '2026-04-18'),
('Chili Con Carne', 'Portioned homemade chili', NULL, 3, @loc_main_freezer, '2026-10-30', '2026-04-12'),
('Banana Slices', 'Ripe banana slices for smoothies', NULL, 5, @loc_kitchen_freezer, '2026-12-08', '2026-06-03'),
('Parsley Cubes', 'Chopped parsley in olive oil cubes', NULL, 4, @loc_kitchen_freezer, '2027-04-15', '2026-05-31'),
('Lentil Soup', 'Thick homemade lentil soup', NULL, 3, @loc_main_freezer, '2026-11-25', '2026-04-22'),
('Blackberry Puree', 'Strained wild blackberries', NULL, 2, @loc_main_freezer, '2027-01-12', '2026-06-02'),
('Roasted Bell Peppers', 'Peeled roasted red peppers', NULL, 3, @loc_kitchen_freezer, '2027-02-28', '2026-05-16'),
('Goulash', 'Hungarian-style beef goulash', NULL, 2, @loc_main_freezer, '2026-10-20', '2026-04-08'),
('Mixed Berry Smoothie Pack', 'Pre-portioned smoothie mix', NULL, 6, @loc_kitchen_freezer, '2026-12-18', '2026-06-04'),
('Leek Cream Soup', 'Pureed leek and potato soup', NULL, 3, @loc_main_freezer, '2026-11-15', '2026-04-28'),
('Diced Onions', 'Pre-diced yellow onions', NULL, 4, @loc_kitchen_freezer, '2027-03-05', '2026-05-24'),
('Grape Juice Concentrate', 'Reduced grape juice for desserts', NULL, 2, @loc_main_freezer, '2027-02-05', '2026-05-11'),
('Currant Jelly', 'Red currant jelly', NULL, 3, @loc_main_freezer, '2027-04-10', '2026-06-01'),
('Broccoli Florets', 'Blanched broccoli pieces', NULL, 4, @loc_kitchen_freezer, '2027-01-08', '2026-05-20'),
('Sweet Potato Mash', 'Roasted and mashed sweet potatoes', NULL, 3, @loc_main_freezer, '2026-12-28', '2026-05-17'),
('Apricot Halves', 'Frozen ripe apricot halves', NULL, 2, @loc_kitchen_freezer, '2027-02-12', '2026-06-03'),
('Minestrone', 'Chunky Italian vegetable soup', NULL, 3, @loc_main_freezer, '2026-11-08', '2026-04-14'),
('Pea Puree', 'Fresh garden peas, pureed', NULL, 4, @loc_kitchen_freezer, '2027-03-15', '2026-05-26'),
('Cranberry Sauce', 'Homemade whole berry cranberry sauce', NULL, 2, @loc_main_freezer, '2027-01-18', '2026-05-09'),
('Egg Noodles', 'Homemade egg noodles, pre-cooked', NULL, 5, @loc_kitchen_freezer, '2026-12-12', '2026-05-29'),
('Gooseberry Compote', 'Stewed gooseberries', NULL, 2, @loc_main_freezer, '2027-02-22', '2026-06-02'),
('Creamed Corn', 'Homemade creamed corn', NULL, 3, @loc_kitchen_freezer, '2027-01-28', '2026-05-21'),
('Chicken Curry', 'Portioned Thai green curry', NULL, 2, @loc_main_freezer, '2026-10-25', '2026-04-16'),
('Dill Cubes', 'Chopped dill frozen in water cubes', NULL, 4, @loc_kitchen_freezer, '2027-04-20', '2026-06-01'),

-- ── Store-bought items (no bottling_date) ──

-- Kitchen Fridge
('Whole Milk', 'Full-fat milk, 1 liter', '1.19', 2, @loc_kitchen_fridge, '2026-06-14', NULL),
('Greek Yogurt', 'Plain Greek yogurt, 500g', '2.49', 3, @loc_kitchen_fridge, '2026-06-20', NULL),
('Butter', 'Unsalted butter, 250g', '2.29', 2, @loc_kitchen_fridge, '2026-07-15', NULL),
('Cheddar Cheese', 'Mature cheddar block, 400g', '3.49', 1, @loc_kitchen_fridge, '2026-08-10', NULL),
('Cream Cheese', 'Philadelphia original, 200g', '1.89', 2, @loc_kitchen_fridge, '2026-06-25', NULL),
('Orange Juice', 'Fresh squeezed, 1 liter', '2.99', 1, @loc_kitchen_fridge, '2026-06-12', NULL),
('Eggs', 'Free-range eggs, pack of 10', '3.29', 1, @loc_kitchen_fridge, '2026-06-18', NULL),
('Ham Slices', 'Cooked ham, 200g pack', '2.19', 2, @loc_kitchen_fridge, '2026-06-10', NULL),
('Mozzarella', 'Fresh mozzarella ball, 125g', '1.49', 3, @loc_kitchen_fridge, '2026-06-09', NULL),
('Hummus', 'Classic chickpea hummus, 300g', '2.29', 1, @loc_kitchen_fridge, '2026-06-15', NULL),

-- Pantry
('Pasta Spaghetti', 'Durum wheat spaghetti, 500g', '1.29', 4, @loc_pantry, '2028-03-01', NULL),
('Basmati Rice', 'Long grain basmati, 1kg', '2.99', 2, @loc_pantry, '2028-06-01', NULL),
('Canned Tomatoes', 'Chopped tomatoes, 400g tin', '0.89', 6, @loc_pantry, '2028-01-15', NULL),
('Canned Chickpeas', 'Chickpeas in water, 400g', '0.99', 4, @loc_pantry, '2028-04-10', NULL),
('Olive Oil', 'Extra virgin olive oil, 500ml', '5.99', 1, @loc_pantry, '2027-09-01', NULL),
('Peanut Butter', 'Crunchy peanut butter, 350g', '3.49', 2, @loc_pantry, '2027-02-01', NULL),
('Honey', 'Raw wildflower honey, 500g', '6.99', 1, @loc_pantry, '2028-12-01', NULL),
('Oats', 'Rolled oats, 1kg', '1.99', 2, @loc_pantry, '2027-08-01', NULL),
('Flour', 'All-purpose wheat flour, 1kg', '0.99', 3, @loc_pantry, '2027-06-01', NULL),
('Sugar', 'White granulated sugar, 1kg', '1.49', 2, @loc_pantry, '2029-01-01', NULL),
('Canned Tuna', 'Tuna chunks in sunflower oil, 185g', '1.79', 5, @loc_pantry, '2028-07-01', NULL),
('Coconut Milk', 'Full-fat coconut milk, 400ml', '1.59', 3, @loc_pantry, '2028-02-01', NULL),
('Soy Sauce', 'Naturally brewed soy sauce, 250ml', '2.49', 1, @loc_pantry, '2028-05-01', NULL),
('Balsamic Vinegar', 'Aged balsamic vinegar, 250ml', '3.99', 1, @loc_pantry, '2029-06-01', NULL),
('Dried Lentils', 'Green lentils, 500g', '1.69', 2, @loc_pantry, '2028-09-01', NULL),
('Cornflakes', 'Classic cornflakes, 500g', '2.19', 1, @loc_pantry, '2027-04-01', NULL),
('Black Beans', 'Canned black beans, 400g', '1.09', 3, @loc_pantry, '2028-08-01', NULL),
('Mustard', 'Dijon mustard, 200g jar', '1.89', 1, @loc_pantry, '2027-11-01', NULL),
('Dried Pasta Penne', 'Penne rigate, 500g', '1.19', 3, @loc_pantry, '2028-05-15', NULL),
('Maple Syrup', 'Pure Canadian maple syrup, 250ml', '7.49', 1, @loc_pantry, '2028-10-01', NULL),

-- Cellar Shelf
('Canned Corn', 'Sweet corn kernels, 340g', '1.09', 4, @loc_cellar_shelf, '2028-03-15', NULL),
('Canned Peas', 'Garden peas, 400g tin', '0.89', 3, @loc_cellar_shelf, '2028-06-10', NULL),
('Apple Cider Vinegar', 'Organic apple cider vinegar, 500ml', '3.29', 2, @loc_cellar_shelf, '2028-11-01', NULL),
('Sunflower Oil', 'Refined sunflower oil, 1 liter', '2.49', 1, @loc_cellar_shelf, '2027-10-01', NULL),
('Tomato Paste', 'Double concentrated, 200g tube', '1.29', 3, @loc_cellar_shelf, '2028-01-01', NULL),
('Canned Sardines', 'Sardines in olive oil, 120g', '2.19', 4, @loc_cellar_shelf, '2028-09-15', NULL),
('Pickled Cucumbers', 'Whole pickled gherkins, 670g jar', '1.99', 2, @loc_cellar_shelf, '2027-12-01', NULL),
('Jam Strawberry', 'Store-bought strawberry jam, 450g', '2.79', 1, @loc_cellar_shelf, '2027-07-01', NULL),
('Canned Peaches', 'Peach halves in syrup, 420g', '1.69', 3, @loc_cellar_shelf, '2028-04-01', NULL),
('Crackers', 'Whole wheat crackers, 200g', '1.89', 2, @loc_cellar_shelf, '2027-05-01', NULL),

-- Additional Kitchen Fridge items
('Salami', 'Italian salami slices, 100g', '2.99', 1, @loc_kitchen_fridge, '2026-06-20', NULL),
('Parmesan', 'Parmigiano Reggiano wedge, 200g', '4.99', 1, @loc_kitchen_fridge, '2026-09-01', NULL),
('Smoked Salmon', 'Sliced smoked salmon, 100g', '3.99', 1, @loc_kitchen_fridge, '2026-06-08', NULL),
('Heavy Cream', 'Whipping cream 35%, 200ml', '1.29', 2, @loc_kitchen_fridge, '2026-06-16', NULL),
('Tofu', 'Firm organic tofu, 400g', '2.49', 1, @loc_kitchen_fridge, '2026-06-22', NULL);