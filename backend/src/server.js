const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3001;

// ===== middleware =====
app.use(cors());
app.use(express.json());

// ===== DB setup =====
const DB_PATH = path.join(__dirname, "../data/idigital.db");
const INIT_SQL_PATH = path.join(__dirname, "../db/init.sql");

// create/open db
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error("❌ Failed to open DB", err);
  else console.log("✅ SQLite connected");
});

// init tables
const initSql = fs.readFileSync(INIT_SQL_PATH, "utf8");
db.exec(initSql);

// ===== helpers =====
function normalizeGender(g) {
  const s = String(g ?? "").trim().toLowerCase();
  return s === "female" ? "female" : "male";
}
function normEmail(e) {
  return String(e ?? "").trim().toLowerCase();
}

// ===== ROUTES =====

// quick check
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// ---------- REGISTER ----------
app.post("/api/auth/register", (req, res) => {
  let { email, password, name, birthDate, gender, image } = req.body || {};

  email = normEmail(email);
  password = String(password ?? "").trim();
  name = String(name ?? "").trim();
  birthDate = String(birthDate ?? "").trim();

  if (!email || !password || !name || !birthDate) {
    return res.status(400).json({ ok: false, msg: "Missing fields" });
  }

  const g = normalizeGender(gender);
  const img =
    String(image ?? "").trim() ||
    (g === "female" ? "/assets/user/female.png" : "/assets/user/male.png");

  const sql = `
    INSERT INTO users (full_name, email, birth_date, gender, image, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, email, birthDate, g, img, password], function (err) {
    if (err) {
      if (String(err.message).includes("UNIQUE")) {
        return res.status(409).json({ ok: false, msg: "Email already exists" });
      }
      console.error(err);
      return res.status(500).json({ ok: false, msg: "DB error" });
    }

    return res.json({ ok: true, id: this.lastID });
  });
});

// ---------- LOGIN ----------
app.post("/api/auth/login", (req, res) => {
  const email = normEmail(req.body?.email);
  const password = String(req.body?.password ?? "").trim();

  if (!email || !password) {
    return res.status(400).json({ ok: false, msg: "Missing fields" });
  }

  const sql = `
    SELECT 
      id,
      full_name AS fullName,
      email,
      birth_date AS birthDate,
      gender,
      image,
      role,
      password
    FROM users
    WHERE email = ?
  `;

  db.get(sql, [email], (err, row) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, msg: "DB error" });
    }

    if (!row) return res.status(401).json({ ok: false, msg: "User not found" });
    if (row.password !== password)
      return res.status(401).json({ ok: false, msg: "Wrong password" });

    delete row.password;
    return res.json({ ok: true, user: row });
  });
});

// ---------- GET USER BY ID (NEW) ----------
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ ok: false, msg: "Invalid user id" });

  db.get(
    `
    SELECT 
      id,
      full_name AS fullName,
      email,
      birth_date AS birthDate,
      gender,
      image,
      role
    FROM users
    WHERE id = ?
    `,
    [id],
    (err, user) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false, msg: "DB error" });
      }
      if (!user) return res.status(404).json({ ok: false, msg: "User not found" });
      return res.json({ ok: true, user });
    }
  );
});

// ---------- UPDATE USER ----------
app.put("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const { fullName, birthDate, gender, image, password } = req.body || {};

  if (!id) return res.status(400).json({ ok: false, msg: "Invalid user id" });

  const fields = [];
  const values = [];

  if (fullName != null) {
    fields.push("full_name = ?");
    values.push(String(fullName).trim());
  }
  if (birthDate != null) {
    fields.push("birth_date = ?");
    values.push(String(birthDate).trim());
  }
  if (gender != null) {
    fields.push("gender = ?");
    values.push(normalizeGender(gender));
  }
  if (image != null) {
    fields.push("image = ?");
    values.push(String(image).trim());
  }
  if (password != null) {
    fields.push("password = ?");
    values.push(String(password));
  }

  if (fields.length === 0) {
    return res.status(400).json({ ok: false, msg: "Nothing to update" });
  }

  const sql = `
    UPDATE users
    SET ${fields.join(", ")}
    WHERE id = ?
  `;
  values.push(id);

  db.run(sql, values, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ ok: false, msg: "DB error" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ ok: false, msg: "User not found" });
    }

    db.get(
      `
      SELECT 
        id,
        full_name AS fullName,
        email,
        birth_date AS birthDate,
        gender,
        image,
        role
      FROM users
      WHERE id = ?
      `,
      [id],
      (e2, user) => {
        if (e2) {
          console.error(e2);
          return res.status(500).json({ ok: false, msg: "DB error" });
        }
        return res.json({ ok: true, user });
      }
    );
  });
});

// ---------- CHANGE PASSWORD ----------
app.post("/api/users/:id/change-password", (req, res) => {
  const id = Number(req.params.id);
  const currentPassword = String(req.body?.currentPassword ?? "");
  const newPassword = String(req.body?.newPassword ?? "");

  if (!id) return res.status(400).json({ ok: false, msg: "Invalid user id" });
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ ok: false, msg: "Missing fields" });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ ok: false, msg: "New password too short" });
  }

  db.get("SELECT password FROM users WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ ok: false, msg: "DB error" });
    if (!row) return res.status(404).json({ ok: false, msg: "User not found" });

    if (row.password !== currentPassword) {
      return res.status(401).json({ ok: false, msg: "Current password is incorrect" });
    }

    db.run("UPDATE users SET password = ? WHERE id = ?", [newPassword, id], function (e2) {
      if (e2) return res.status(500).json({ ok: false, msg: "DB error" });
      return res.json({ ok: true });
    });
  });
});


// ---------- ADMIN: LIST USERS ----------
app.get("/api/admin/users", (req, res) => {
  db.all(
    `
    SELECT
      id,
      full_name AS fullName,
      email,
      birth_date AS birthDate,
      gender,
      image,
      role,
      created_at AS createdAt
    FROM users
    ORDER BY id DESC
    `,
    [],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ ok: false, msg: "DB error" });
      }
      return res.json({ ok: true, users: rows });
    }
  );
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 API running on http://localhost:${PORT}`);
});