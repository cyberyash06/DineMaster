const bcrypt = require("bcryptjs");
const User = require("../models/user");
const generateToken = require("../utils/generatetoken");
 
// REGISTER
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
 
  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ message: "User already exists" });
 
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });
 
  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};
 
// LOGIN
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
 
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
 
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

 
  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id, user.role),
  });
};
 
// GET PROFILE (Protected route example)
exports.getProfile = async (req, res) => {
  res.json(req.user);
};