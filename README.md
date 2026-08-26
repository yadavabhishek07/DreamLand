# DreamLand 🏡

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Framework](https://img.shields.io/badge/Framework-Express.js-lightgrey.svg)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-green.svg)](https://www.mongodb.com/atlas)

A professional, production-ready full-stack property listing and booking platform built with Node.js, Express, and MongoDB.

🔗 **Live Website:** [https://dreamland-31ik.onrender.com](https://dreamland-31ik.onrender.com)

---

## 🌟 Overview

DreamLand is a modern real-estate and property booking web application designed to allow users to seamlessly list, search, view, and book properties worldwide. Built on top of a secure, MVC-architected Express backend and utilizing server-side rendering (EJS), it offers high-performance pages, secure authentication, real-time feedback, and cloud image uploads.

---

## ✨ Features

- 🔐 **Secure Authentication & Session Management**: Built with Passport.js, supporting both standard email/password (Local Strategy) and Google OAuth 2.0.
- 🏠 **Full Property CRUD**: Real estate listing creation, reading, editing, and deleting capabilities with strict authorization controls (owners only).
- ⭐ **Review & Rating System**: Interactive review engine validating user feedback for each property listing.
- 🖼️ **Cloud Image Storage**: Seamless and secure integration with Cloudinary via Multer for high-performance image uploads and CDN delivery.
- 🛡️ **Data Validation & Security**: Schemas are validated using Joi at the API boundary, protecting the database from malformed data and injection. Sessions are stored in MongoDB via `connect-mongo`.
- 📱 **Responsive Design**: Mobile-first UI using Bootstrap 5 and custom CSS, rendered server-side using EJS templates and `ejs-mate` layouts.
- 🔔 **User Feedback System**: Interactive toast alerts using `connect-flash` to notify users of successful actions, errors, or validation messages.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js (MVC Pattern)
- **Database:** MongoDB Atlas, Mongoose ODM
- **Authentication:** Passport.js (`passport-local`, `passport-google-oauth20`)
- **Validation:** Joi Schema Validation
- **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript, EJS Templates (`ejs-mate`)
- **Media Hosting:** Cloudinary CDN

---

## 📂 Project Architecture

The codebase follows the classic Model-View-Controller (MVC) architectural pattern to ensure clean separation of concerns and maintainability.

```text
dreamland/
├── controllers/    # Request handlers and business logic
├── init/           # Database seed scripts and configurations
├── models/         # Mongoose schemas and data models
├── public/         # Static assets (CSS, JS, images, SVG icons)
├── routes/         # Express router definitions split by resource
├── utils/          # Global error handling and custom helper utilities
├── views/          # EJS templates, partials, and page layouts
├── app.js          # Core application entrypoint and middleware pipeline
├── middleware.js   # Custom middlewares (auth check, authorization, validation)
├── cloudConfig.js  # Cloudinary SDK setup and storage config
└── package.json    # Dependency management and npm scripts
```

---

## 🚀 Getting Started


```

### 4. Seed the Database (Optional)
To pre-populate your database with sample property listings:
```bash
node init/index.js
```

### 5. Run the application
Start the server in development mode:
```bash
npm start
```
The server will start on port `5000` by default. Open [http://localhost:5000](http://localhost:5000) in your browser.



