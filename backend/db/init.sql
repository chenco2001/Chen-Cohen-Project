PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,

  -- from Register: name
  full_name TEXT NOT NULL,

  -- from Register: email
  email TEXT NOT NULL UNIQUE,

  -- from Register: birthDate (stored as ISO string: YYYY-MM-DD)
  birth_date TEXT NOT NULL,

  -- from Register: gender
  gender TEXT NOT NULL CHECK (gender IN ('male','female')),

  -- from Register: previewImage (path to assets)
  image TEXT NOT NULL DEFAULT '/assets/user/male.png',

  -- from Register: password (NOT hashed, as you requested)
  password TEXT NOT NULL,

  -- extra: role
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),

  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Helpful index (optional)
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);