const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error("Set ADMIN_PASSWORD in Render Environment settings.");
  process.exit(1);
}

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");

fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.use(express.json({ limit: "10kb" }));

function readItems() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeItems(items) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), "utf8");
}

function adminOnly(req, res, next) {
  if ((req.get("x-admin-password") || "") !== ADMIN_PASSWORD) {
    return res.status(401).json({
      error: "Incorrect dashboard password."
    });
  }

  next();
}

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin.html"));
});

app.post("/api/submissions", (req, res) => {
  const message = String(req.body.message || "").trim();

  if (!message) {
    return res.status(400).json({
      error: "Please type a message."
    });
  }

  if (message.length > 1000) {
    return res.status(400).json({
      error: "Message is too long."
    });
  }

  const items = readItems();

  items.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    message,
    submittedAt: new Date().toISOString()
  });

  writeItems(items.slice(0, 1000));

  res.json({
    ok: true,
    message: "Message sent."
  });
});

app.get("/api/submissions", adminOnly, (_req, res) => {
  res.set("Cache-Control", "no-store");
  res.json(readItems());
});

app.delete("/api/submissions/:id", adminOnly, (req, res) => {
  writeItems(
    readItems().filter(item => item.id !== req.params.id)
  );

  res.json({ ok: true });
});

app.get("/health", (_req, res) => {
  res.status(200).send("ok");
});

app.listen(PORT, () => {
  console.log(`Bluebast listening on port ${PORT}`);
});
