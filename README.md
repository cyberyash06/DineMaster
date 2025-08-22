# DineMaster
  
## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## About

**DineMaster** is a full-featured Restaurant Management System built with the MERN stack (MongoDB, Express.js, React, Node.js). It streamlines restaurant operations, including reservations, menu management, order processing, and staff administration.

## Features

- User authentication and authorization (Admin, Staff, Customer)
- Table reservation system
- Menu management (CRUD for dishes and categories)
- Order placement and tracking
- Staff management
- Dashboard with analytics
- Responsive UI

## Tech Stack

- **Frontend:** React, Redux, Bootstrap/Material-UI
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Other:** Mongoose, Axios

## Installation

1. **Clone the repository:**
     
   > **Note:** Ensure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your system before proceeding.
     
   ```bash
   git clone https://github.com/yourusername/DineMaster.git
   cd DineMaster
   ```

2. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in `/server` with MongoDB URI, JWT secret, etc.

5. **Run the application:**
   - Start backend:
     ```bash
     cd ../server
     npm run dev
     ```
   - Start frontend:
     ```bash
     cd ../client
     npm start
     ```

## Usage

- Access the app at `http://localhost:3000`
- Register as a customer or login as admin/staff
- Manage reservations, menu, and orders

## API Endpoints

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| POST   | /api/auth/login    | User login                 |
| POST   | /api/auth/register | User registration          |
| GET    | /api/menu          | Get all menu items         |
| POST   | /api/menu          | Add new menu item (admin)  |
| GET    | /api/orders        | Get all orders (admin)     |
| POST   | /api/orders        | Place a new order          |
| ...    | ...                | ...                        |

## Contributing

Contributions are welcome! Please open issues or submit pull requests.

## License

This project is licensed under the MIT License.

