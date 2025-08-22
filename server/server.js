const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authroutes");
const menuRoutes = require('./routes/Menuroutes');
const categoryRoutes = require('./routes/Categoryroutes');
const uploadRoutes = require('./routes/uploads');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');


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
app.use('/api/dashboard', dashboardRoutes);
console.log('✅ Dashboard routes connected');
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use("/api/categories", categoryRoutes); // ← move UP
app.use('/api/menu', menuRoutes); 
app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/orders', orderRoutes);// ← move UP


// 4. start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






 

;