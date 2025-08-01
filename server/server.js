const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const menuRoutes = require('./routes/Menuroutes');

dotenv.config();
const app = express();

// 1. middleware
app.use(cors());
app.use(express.json());

// 2. connect DB
connectDB();

// 3. routes
app.get("/", (req, res) => {
  res.send("Restaurant Management API Running...");
});

app.use("/api/auth", authRoutes); 
app.use('/api/menu', menuRoutes);  // ← move UP

// 4. start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






 

;