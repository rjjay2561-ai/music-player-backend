const express = require("express");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

const app = express();
app.use(cors());

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
              folder: "music_uploads",   // folder name in Cloudinary dashboard
                  resource_type: "auto",     // allows mp3/mp4/jpg/png
                    },
                    });
                    const upload = multer({ storage });

                    // ====== Upload endpoint ======
                    app.post("/upload", upload.single("song"), (req, res) => {
                      res.json({
                          message: "Uploaded successfully ✅",
                              url: req.file.path, // Cloudinary public URL
                                });
                                });

                                // ====== Catch-all to serve index.html ======
                                app.get("*", (req, res) => {
                                  res.sendFile(path.join(__dirname, "public", "index.html"));
                                  });

                                  const PORT = process.env.PORT || 3000;
                                  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));