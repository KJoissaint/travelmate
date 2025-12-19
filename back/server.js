import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production";
const UPLOADS_DIR = path.join(__dirname, "uploads");
const DB_PATH = path.join(__dirname, "data", "trips.json");

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

function loadTrips() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    console.warn("No trips.json found, starting empty DB.");
    return [];
  }
}
function saveTrips(trips) {
  fs.writeFileSync(DB_PATH, JSON.stringify(trips, null, 2), "utf8");
}
let trips = loadTrips();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOADS_DIR));
//i also added error handeling as you asked in te assignment
app.delete("/trips/:id", (req, res) => {
   const { id } = req.params; const idx = trips.findIndex(t => t.id === id); 
   if (idx === -1) return res.status(404).json({
     error: "Trip not found" }); 
     trips.splice(idx, 1); saveTrips(trips); 
     return res.json({ ok: true }); 
    });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const safeExt = ext ? ext : "";
    cb(null, `${Date.now()}-${uuidv4()}${safeExt}`);
  }
});
const upload = multer({ storage });

// Middleware for JWT (kept but unused, again i was having issues with it, so i removed it for testing purposes)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

app.get("/health", (req, res) => res.json({ ok: true, ts: Date.now() }));

// Registration
app.post("/auth/register", (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Email, password and name are required' });
  }
  const userId = uuidv4();
  const user = { id: userId, name, email, roles: ["student"] };
  return res.json({ user });
});

// Login
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  const userId = uuidv4();
  const user = { id: userId, name: email?.split("@")[0] || "Utilisateur", email, roles: ["student"] };
  return res.json({ user });
});

// Refresh (mocked open)
app.post("/auth/refresh", (req, res) => {
  return res.json({ message: "Refresh not required in open mode" });
});

// Logout (open)
app.post("/auth/logout", (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

// Trips endpoints (open)
app.get("/trips", (req, res) => {
  return res.json(trips);
});

app.post("/trips", (req, res) => {
  const payload = req.body || {};
  const id = uuidv4();
  const newTrip = {
    id,
    title: payload.title || "Sans titre",
    destination: payload.destination || "",
    startDate: payload.startDate || "",
    endDate: payload.endDate || "",
    image: payload.image || "",
    description: payload.description || "",
    photos: Array.isArray(payload.photos) ? payload.photos : [],
    location: payload.location || { lat: 0, lng: 0 }
  };
  trips.push(newTrip);
  saveTrips(trips);
  return res.status(201).json(newTrip);
});

app.post("/trips/:id/photos", (req, res) => {
  const { id } = req.params;
  const { uri } = req.body || {};
  const idx = trips.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Trip not found" });
  if (uri) trips[idx].photos.push(uri);
  saveTrips(trips);
  return res.json({ ok: true, photos: trips[idx].photos });
});

// Uploads
app.post("/uploads", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  return res.status(201).json({ url: fileUrl });
});

app.use((req, res) => res.status(404).json({ error: "Not found" }));

app.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});
