const express = require("express");
const cors = require("cors");
const { Connection, PublicKey, clusterApiUrl } = require("@solana/web3.js");
require("dotenv").config();

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
