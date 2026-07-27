Dream Land Web Application 🏡
A full-stack property listing and booking platform built with Node.js, Express, and MongoDB.

🌟 Overview
Dream Land is a robust web application that allows users to explore, create, and review property listings. It comes packed with essential features like secure authentication, image uploads, session management, and a fully responsive UI.

✨ Features
🔐 Secure Authentication: Supports both Local Strategy (Username/Password) and Google OAuth 2.0.
🏠 Property Management: Full CRUD (Create, Read, Update, Delete) functionality for property listings.
⭐ Review System: Interactive review and rating system for all properties.
🖼️ Image Uploads: Seamless and secure cloud image storage integrated with Cloudinary.
🛡️ Data Security: Session management powered by MongoDB (connect-mongo) and data validation via Joi.
📱 Responsive Design: Server-side rendered UI utilizing EJS and ejs-mate to look great on any device.
🔔 Flash Notifications: Real-time feedback alerts using connect-flash.
🛠️ Tech Stack
Backend: Node.js, Express.js
Database: MongoDB Atlas, Mongoose ODM
Authentication: Passport.js (passport-local, passport-google-oauth20)
Frontend: HTML, CSS, JavaScript, EJS
Storage: Cloudinary, Multer

🚀 Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

Prerequisites
Ensure you have the following installed:

Node.js (v20.0.0 or higher)
MongoDB (Local server or Atlas cluster)
A Cloudinary Account (for image uploads)
Google Cloud Console Project (for OAuth credentials)
1. Clone the repository
bash

git clone https://github.com/your-username/majorproject.git
cd majorproject
2. Install dependencies
bash

npm install
3. Environment Variables
Create a .env file in the root directory and configure the following variables:

env

# Application Port
PORT=5000
# MongoDB Connection String
ATLASDB_URL=your_mongodb_connection_string
# Session Secret Key
SECRET=your_super_secret_session_key
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
# Google OAuth 2.0 Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
4. Run the application
bash

npm start
The server will start on port 5000 by default. Open http://localhost:5000 in your browser.

📂 Folder Structure
text

majorproject/
├── controllers/    # Route handler functions
├── init/           # Database initialization scripts
├── models/         # Mongoose schemas and models
├── public/         # Static files (CSS, JS, Images)
├── routes/         # Express routing definitions
├── utils/          # Utility functions and error handlers
├── views/          # EJS templates and layouts
├── app.js          # Main application entry point
├── middleware.js   # Custom Express middlewares
├── cloudConfig.js  # Cloudinary setup
└── package.json    # Project metadata and dependencies
📜 License
This project is licensed under the ISC License.
