const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = new sqlite3.Database(path.join(__dirname, "database.db"));

// Create songs table if not exists
db.run(`CREATE TABLE IF NOT EXISTS songs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
      url TEXT
      )`);

      // Get all songs
      app.get("/songs", (req, res) => {
        db.all("SELECT * FROM songs", [], (err, rows) => {
            if (err) return res.status(500).send(err.message);
                res.json(rows);
                  });
                  });

                  // Add a song
                  app.post("/songs", (req, res) => {
                    const { title, url } = req.body;
                      db.run("INSERT INTO songs (title, url) VALUES (?, ?)", [title, url], function(err) {
                          if (err) return res.status(500).send(err.message);
                              res.json({ id: this.lastID, title, url });
                                });
                                });

                                app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));