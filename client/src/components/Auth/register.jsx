import React, { useState } from "react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center">
          <div className="bg-blue-900 rounded-full p-3 mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
              viewBox="0 0 24 24">
              <path d="M4 17l6-6 4 4 8-8" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-1">Create Account</h2>
          <p className="text-gray-600 mb-6 text-center">
            Sign up for your restaurant dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

      
          <div>
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="absolute right-3 top-3 text-gray-400 cursor-pointer">
                👁️
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Select Role</label>
            <select
              className="mt-1 w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800"
          >
            Register
          </button>
        </form>

        <div className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign in here
          </a>
        </div>

        <div className="bg-gray-100 text-gray-700 text-sm rounded-md p-2 mt-6 text-center">
          <strong>Demo credentials:</strong> admin@restaurant.com / password123
        </div>
      </div>
    </div>
  );
}
