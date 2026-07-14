// Secure upload panel (refactor)
// - safe storage with randomized filenames
// - whitelist file types & size limit
// - helmet security headers, rate limiting
// - safe file listing + controlled download streaming
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mime = require('mime-types');

const app = express();
const PORT = 3000;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload directory exists
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Security middleware
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rate limiter for upload endpoint
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // max 10 uploads per IP per minute
  message: 'Too many uploads from this IP, please try again later.'
});

// Storage: randomized filenames, preserve extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  }
});

// Whitelist MIME types (adjust as needed)
const ALLOWED_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'text/plain',
  'application/pdf'
]);

function fileFilter(req, file, cb) {
  if (ALLOWED_MIMES.has(file.mimetype)) cb(null, true);
  else cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'file'), false);
}

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter
});

// Serve the basic UI
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Upload handler
app.post('/upload', uploadLimiter, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded or invalid file type.');
  // Optionally store metadata (original name, mime) in memory or DB for mapping
  res.send('File uploaded successfully.');
});

// List uploaded files (safe: only filename, original name not exposed here)
app.get('/files', (req, res) => {
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) return res.status(500).send('Unable to read uploads.');
    // Return links to safe download route
    const listHtml = files.map(f => {
      const ext = path.extname(f).slice(1);
      return `<div><a href="/files/${encodeURIComponent(f)}" target="_blank">${f}</a> (${ext})</div>`;
    }).join('\n') || '<div>No files</div>';
    res.send(`<h1>Uploaded Files</h1>${listHtml}<hr><a href="/">Upload again</a>`);
  });
});

// Controlled download/streaming route (prevents path traversal)
app.get('/files/:fn', (req, res) => {
  const filename = path.basename(req.params.fn); // removes any path components
  const filePath = path.join(UPLOAD_DIR, filename);
  // Ensure the resolved path is inside UPLOAD_DIR
  if (!filePath.startsWith(UPLOAD_DIR)) return res.status(400).send('Invalid filename.');
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return res.status(404).send('Not found');
    const contentType = mime.lookup(filePath) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    // Use attachment if you want downloads instead of inline display:
    // res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => res.status(500).end());
    stream.pipe(res);
  });
});

// Error handling for multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).send('File too large.');
    if (err.code === 'LIMIT_UNEXPECTED_FILE') return res.status(400).send('Invalid file type.');
  }
  console.error(err);
  res.status(500).send('Server error.');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
