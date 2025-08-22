const express = require('express');
const multer = require('multer');
const path = require('path');

// Set upload directory
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // you must create this folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = express.Router();

// POST /api/upload
router.post('/', upload.single('file'), (req, res) => {
  // Send back the file path so frontend can store the URL
  res.json({ url: `/uploads/${req.file.filename}` });
});

module.exports = router;
