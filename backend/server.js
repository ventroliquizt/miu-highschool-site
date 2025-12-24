const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");


const app = express();

app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

const PORT = 3001;
const JWT_SECRET = "supersecretkey";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}



app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
// ---------- FILE UPLOAD SETUP ----------
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_");
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });





// ---------- DATABASE ----------
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err);
  console.log("Database opened.");
});

// ---------- ARTICLES TABLE ----------
db.run(`
  CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    image TEXT,
    page TEXT,
    status TEXT DEFAULT 'draft',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);



db.run(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

db.get(`SELECT * FROM admins LIMIT 1`, (err, row) => {
  if (!row) {
    const hash = bcrypt.hashSync("admin123", 10);
    db.run(
      `INSERT INTO admins (username, password) VALUES (?, ?)`,
      ["admin", hash]
    );
    console.log("Default admin created: admin / admin123");
  }
});

// ---------- LOGIN ----------
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM admins WHERE username = ?",
    [username],
    async (err, admin) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!admin) return res.status(401).json({ error: "Invalid credentials" });

      const match = await bcrypt.compare(password, admin.password);
      if (!match)
        return res.status(401).json({ error: "Invalid credentials" });

      const token = jwt.sign({ id: admin.id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      res.json({ token });
    }
  );
});

// ---------- CREATE ARTICLE ----------
app.post("/articles", upload.single("image"), (req, res) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!title || !content) {
    return res.status(400).json({ error: "Missing fields" });
  }

  db.run(
    "INSERT INTO articles (title, content, image) VALUES (?, ?, ?)",
    [title, content, image],
    function (err) {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json({ success: true, id: this.lastID });
    }
  );
});

// ---------- GET ARTICLES (PUBLIC) ----------
app.get("/articles", (req, res) => {
  db.all(
    "SELECT * FROM articles ORDER BY created_at DESC",
    (err, rows) => {
      if (err) return res.status(500).json({ error: "Database error" });
      res.json(rows);
    }
  );
});


// ---------- START ----------
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.get("/test", (req, res) => {
  res.send("TEST OK");
});

app.delete("/articles/:id", authenticateToken, (req, res) => {
  const id = req.params.id;

  db.get("SELECT image FROM articles WHERE id = ?", [id], (err, row) => {
    if (err) return res.sendStatus(500);
    if (!row) return res.sendStatus(404);

    // delete image file if exists
    if (row.image) {
      const filePath = path.join(__dirname, "uploads", row.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    db.run("DELETE FROM articles WHERE id = ?", [id], err => {
      if (err) return res.sendStatus(500);
      res.json({ success: true });
    });
  });
});


db.run(`
  CREATE TABLE IF NOT EXISTS sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT,
    section TEXT,
    content TEXT
  )
`);

app.post("/sections", authenticateToken, (req, res) => {
  const { page, section, content } = req.body;

  db.run(
    `
    INSERT INTO sections (page, section, content)
    VALUES (?, ?, ?)
    ON CONFLICT(page, section) DO UPDATE SET content = excluded.content
    `,
    [page, section, content],
    () => res.json({ success: true })
  );
});

app.get("/sections/:page", (req, res) => {
  db.all(
    "SELECT * FROM sections WHERE page = ?",
    [req.params.page],
    (err, rows) => res.json(rows)
  );
});


app.get("/content", (req, res) => {
  const page = req.query.page;

  if (!page) {
    return res.status(400).json({ error: "page is required" });
  }

  const sql = `
    SELECT section, title, content, image
    FROM articles
    WHERE page = ? AND status = 'published'
    ORDER BY id ASC
  `;

  db.all(sql, [page], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(rows);
  });
});


app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

app.post("/api/banner/home", (req, res) => {
  const { title, content, imageUrl } = req.body;

  const banner = { title, content, imageUrl };

  fs.writeFileSync(
    path.join(__dirname, "data/homeBanner.json"),
    JSON.stringify(banner, null, 2)
  );

  res.json({ success: true });
});

app.get("/api/banner/home", (req, res) => {
  const data = fs.readFileSync(
    path.join(__dirname, "data/homeBanner.json"),
    "utf-8"
  );
  res.json(JSON.parse(data));
});

app.delete("/api/banner/home", (req, res) => {
  const emptyBanner = {
    title: "",
    content: "",
    imageUrl: ""
  };

  fs.writeFileSync(
    path.join(__dirname, "data/homeBanner.json"),
    JSON.stringify(emptyBanner, null, 2)
  );

  res.json({ success: true });
});



// Serve uploaded images
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public/uploads"))
);
