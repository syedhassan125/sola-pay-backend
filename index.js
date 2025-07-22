const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(
  session({ secret: "solapaysecret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`${process.env.FRONTEND_URL}/?token=${token}`);
  }
);

// Default route
app.get("/", (req, res) => {
  res.send("SolaPay backend is running 🚀");
});

// Servconst PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("p
  Connection,
  PublicKey,
  clusterApiUrl,
} = require("@solana/web3.js");
require("dotenv").config();

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(
  session({ secret: "solapaysecret", resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Serialize + Deserialize user
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// ✅ Routes
app.get("/", (req, res) => {
  res.send("SolaPay Backend is live!");
});

// 🔐 Google OAuth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ user: req.user }, "jwt-secret", { expiresIn: "1d" });
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  }
);

// ✅ Get wallet balance
const connection = new Connection(clusterApiUrl("mainnet-beta"));
app.get("/api/balance/:wallet", async (req, res) => {
  try {
    const wallet = new PublicKey(req.params.wallet);
    const balance = await connection.getBalance(wallet);
    res.json({ balance: balance / 1e9 });
  } catch (err) {
    res.status(400).json({ error: "Invalid wallet address" });
  }
});

// ✅ Check transaction status
app.get("/api/tx/:signature", async (req, res) => {
  try {
    const tx = await connection.getConfirmedTransaction(req.params.signature);
    res.json({ confirmed: !!tx, tx });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

const connection = new Connection(clusterApiUrl("mainnet-beta"));

// ✅ Home route to test backend
app.get("/", (req, res) => {
  res.send("SolaPay Backend is live!");
});

// ✅ Get wallet balance
app.get("/api/balance/:wallet", async (req, res) => {
  try {
    const wallet = new PublicKey(req.params.wallet);
    const balance = await connection.getBalance(wallet);
    res.json({ balance: balance / 1e9 }); // Convert lamports to SOL
  } catch (err) {
    res.status(400).json({ error: "Invalid wallet address" });
  }
});

// ✅ Check transaction status
app.get("/api/tx/:signature", async (req, res) => {
  try {
    const tx = await connection.getConfirmedTransaction(req.params.signature);
    if (tx) {
      res.json({ confirmed: true, tx });
    } else {
      res.json({ confirmed: false });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// ✅ Use Render-assigned PORT (required for public access)
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
