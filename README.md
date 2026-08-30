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


## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js (MVC Pattern)
- **Database:** MongoDB Atlas, Mongoose ODM
- **Authentication:** Passport.js (`passport-local`, `passport-google-oauth20`)
- **Validation:** Joi Schema Validation
- **Frontend:** HTML5, CSS3 (Bootstrap 5), JavaScript, EJS Templates (`
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

