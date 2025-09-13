const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json()); // Add this line for password authentication

// ====== Serve static frontend ======
app.use(express.static(path.join(__dirname, "public")));

// ====== Cloudinary config ======
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
      });

      // ====== Multer + Cloudinary storage ======
      const storage = new CloudinaryStorage({
        cloudinary,
          params: {
              folder: "music_uploads",
                  resource_type: "auto",
                    },
                    });
                    const upload = multer({ storage });

                    // ====== Upload endpoint ======
                    app.post("/upload", upload.single("song"), (req, res) => {
                      console.log("=== UPLOAD ATTEMPT ===");
                        console.log("File received:", req.file ? "YES" : "NO");
                          console.log("Cloudinary config check:", {
                              cloud_name: process.env.CLOUD_NAME ? "SET" : "MISSING",
                                  api_key: process.env.CLOUD_KEY ? "SET" : "MISSING", 
                                      api_secret: process.env.CLOUD_SECRET ? "SET" : "MISSING"
                                        });
                                          
                                            if (!req.file) {
                                                console.log("ERROR: No file in request");
                                                    return res.status(400).json({ error: "No file uploaded" });
                                                      }
                                                        
                                                          try {
                                                              console.log("SUCCESS: File uploaded to:", req.file.path);
                                                                  res.json({
                                                                        message: "Uploaded successfully ✅",
                                                                              url: req.file.path,
                                                                                  });
                                                                                    } catch (error) {
                                                                                        console.log("ERROR:", error.message);
                                                                                            res.status(500).json({ error: error.message });
                                                                                              }
                                                                                              });

                                                                                              // ====== Password authentication endpoint ======
                                                                                              app.post('/auth', (req, res) => {
                                                                                                console.log('Auth attempt:', req.body.password ? 'Password provided' : 'No password');
                                                                                                  
                                                                                                    if (req.body.password === process.env.SITE_PASSWORD) {
                                                                                                        console.log('Auth successful');
                                                                                                            res.json({ success: true });
                                                                                                              } else {
                                                                                                                  console.log('Auth failed');
                                                                                                                      res.status(401).json({ error: 'Incorrect password' });
                                                                                                                        }
                                                                                                                        });

                                                                                                                        // ====== Catch-all to serve index.html ======
                                                                                                                        app.get("*", (req, res) => {
                                                                                                                          res.sendFile(path.join(__dirname, "public", "index.html"));
                                                                                                                          });

                                                                                                                          const PORT = process.env.PORT || 3000;
                                                                                                                          app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server running on port ${PORT}`));