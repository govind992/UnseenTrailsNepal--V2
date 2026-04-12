-- ═══════════════════════════════════════════
-- Unseen Trails — Database Setup (FIXED)
-- ═══════════════════════════════════════════

CREATE TABLE IF NOT EXISTS bookings (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(120)  NOT NULL,
  email        VARCHAR(180)  NOT NULL,
  destination  VARCHAR(100)  NOT NULL,
  travel_date  DATE          NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_destination (destination)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample data
INSERT INTO bookings (name, email, destination, travel_date) VALUES
  ('Aarav Sharma',  'aarav@example.com',  'Ilam',          '2025-04-10'),
  ('Priya Thapa',   'priya@example.com',  'Janakpur',      '2025-05-18'),
  ('Rohan Karki',   'rohan@example.com',  'Koshi Tappu',   '2025-03-22'),
  ('Sita Rai',      'sita@example.com',  'Kanchenjunga',  '2025-04-29');