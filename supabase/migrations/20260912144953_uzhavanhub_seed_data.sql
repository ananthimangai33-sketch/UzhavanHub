/*
# UzhavanHub - Seed Demo Data

Inserts realistic Tamil Nadu demo data:
- 10 crops across 6 categories
- Market prices for multiple crops across 8 Tamil Nadu markets
- Weather alerts for key locations
- Price predictions for major crops
*/

-- Insert crops catalog
INSERT INTO crops (name, category, unit) VALUES
  ('Tomato', 'Vegetables', 'kg'),
  ('Onion', 'Vegetables', 'kg'),
  ('Potato', 'Vegetables', 'kg'),
  ('Brinjal', 'Vegetables', 'kg'),
  ('Cabbage', 'Vegetables', 'kg'),
  ('Carrot', 'Vegetables', 'kg'),
  ('Banana', 'Fruits', 'kg'),
  ('Coconut', 'Fruits', 'piece'),
  ('Paddy', 'Grains', 'kg'),
  ('Turmeric', 'Spices', 'kg')
ON CONFLICT (name) DO NOTHING;

-- Insert market prices for Tomato across markets
INSERT INTO market_prices (crop_name, market_name, location, price, price_yesterday, price_high, price_low, distance_km, date) VALUES
  ('Tomato', 'Coimbatore Market', 'Coimbatore', 30, 27, 35, 18, 12, CURRENT_DATE),
  ('Tomato', 'Mettupalayam Market', 'Mettupalayam', 28, 26, 32, 16, 25, CURRENT_DATE),
  ('Tomato', 'Pollachi Market', 'Pollachi', 32, 29, 36, 20, 40, CURRENT_DATE),
  ('Tomato', 'Erode Market', 'Erode', 29, 27, 33, 17, 55, CURRENT_DATE),
  ('Tomato', 'Tiruppur Market', 'Tiruppur', 31, 28, 34, 19, 45, CURRENT_DATE),
  ('Onion', 'Coimbatore Market', 'Coimbatore', 38, 36, 45, 25, 12, CURRENT_DATE),
  ('Onion', 'Pollachi Market', 'Pollachi', 40, 37, 48, 28, 40, CURRENT_DATE),
  ('Onion', 'Erode Market', 'Erode', 37, 35, 42, 24, 55, CURRENT_DATE),
  ('Potato', 'Coimbatore Market', 'Coimbatore', 25, 24, 30, 18, 12, CURRENT_DATE),
  ('Potato', 'Salem Market', 'Salem', 27, 25, 32, 20, 65, CURRENT_DATE),
  ('Paddy', 'Coimbatore Market', 'Coimbatore', 32, 31, 38, 22, 12, CURRENT_DATE),
  ('Paddy', 'Madurai Market', 'Madurai', 34, 32, 40, 24, 120, CURRENT_DATE),
  ('Banana', 'Pollachi Market', 'Pollachi', 18, 17, 22, 12, 40, CURRENT_DATE),
  ('Banana', 'Tiruppur Market', 'Tiruppur', 20, 18, 25, 14, 45, CURRENT_DATE),
  ('Coconut', 'Pollachi Market', 'Pollachi', 15, 15, 18, 10, 40, CURRENT_DATE),
  ('Turmeric', 'Erode Market', 'Erode', 120, 115, 140, 85, 55, CURRENT_DATE),
  ('Carrot', 'Coimbatore Market', 'Coimbatore', 45, 42, 55, 30, 12, CURRENT_DATE),
  ('Cabbage', 'Coimbatore Market', 'Coimbatore', 22, 20, 28, 14, 12, CURRENT_DATE),
  ('Brinjal', 'Salem Market', 'Salem', 28, 26, 35, 18, 65, CURRENT_DATE);

-- Insert weather alerts
INSERT INTO weather_alerts (location, alert_type, message, severity, temperature, rain_probability, humidity, wind_speed, date) VALUES
  ('Coimbatore', 'rain', 'Heavy rainfall may occur tomorrow. Consider harvesting mature crops today.', 'warning', 28, 85, 78, 22, CURRENT_DATE),
  ('Pollachi', 'heat', 'High temperature expected this week. Ensure adequate irrigation for crops.', 'info', 35, 15, 45, 12, CURRENT_DATE),
  ('Erode', 'moderate', 'Moderate weather conditions. Good for harvesting and transport.', 'info', 31, 30, 60, 15, CURRENT_DATE),
  ('Mettupalayam', 'wind', 'Strong winds expected. Secure any loose structures or equipment.', 'warning', 29, 40, 65, 35, CURRENT_DATE);

-- Insert price predictions
INSERT INTO price_predictions (crop_name, market_name, current_price, predicted_price, prediction_date, trend, confidence) VALUES
  ('Tomato', 'Pollachi Market', 32, 35, CURRENT_DATE + INTERVAL '3 days', 'up', 0.82),
  ('Tomato', 'Coimbatore Market', 30, 33, CURRENT_DATE + INTERVAL '3 days', 'up', 0.78),
  ('Onion', 'Coimbatore Market', 38, 42, CURRENT_DATE + INTERVAL '3 days', 'up', 0.85),
  ('Potato', 'Coimbatore Market', 25, 24, CURRENT_DATE + INTERVAL '3 days', 'down', 0.65),
  ('Paddy', 'Madurai Market', 34, 36, CURRENT_DATE + INTERVAL '3 days', 'up', 0.72),
  ('Banana', 'Pollachi Market', 18, 20, CURRENT_DATE + INTERVAL '3 days', 'up', 0.70),
  ('Turmeric', 'Erode Market', 120, 128, CURRENT_DATE + INTERVAL '3 days', 'up', 0.80);
