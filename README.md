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

Follow these instructions to run the project locally.

### Prerequisites

Ensure you have the following installed:
* [Node.js](https://nodejs.org/) (v20.0.0 or higher)
* [MongoDB](https://www.mongodb.com/) (Local Community Server or Atlas Cluster connection string)
* [Cloudinary Account](https://cloudinary.com/) (For image upload API keys)
* [Google Cloud Console Project](https://console.cloud.google.com/) (For OAuth Client ID/Secret)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/majorproject.git
cd majorproject
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory and configure the following variables:

```env
# Application Port
PORT=5000

# MongoDB Connection String (Local or Atlas)
ATLASDB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dreamland

# Express Session Secret
SECRET=your_super_secret_session_key

# Cloudinary Credentials (For image hosting)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret

# Google OAuth 2.0 Credentials (For Social Login)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
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

---

## 🌐 Deployment & Hosting

### 1. Deploying to Render
This application is configured for deployment on [Render](https://render.com/). Follow these steps to host your own instance:

1. Create a new **Web Service** on Render and connect your GitHub repository.
2. Select **Node** as the runtime.
3. Configure the following build and start commands:
   * **Build Command:** `npm install`
   * **Start Command:** `npm start`
4. Add all environment variables listed in the `.env` section under **Environment** in the Render dashboard.

### 2. Custom Domain Configuration
To point a custom domain (e.g., `yourdomain.com`) to your Render deployment:
1. In the Render Dashboard, go to your service's **Settings** -> **Custom Domains** and add your domain.
2. In your DNS provider (e.g., Porkbun, Namecheap), add a **CNAME** record:
   * **Name:** `www`
   * **Target:** `dreamland-31ik.onrender.com`
3. Add an **ALIAS**, **ANAME**, or **A** record for the root domain (`@`) pointing to your Render app URL or Render's IP address (check the Render dashboard for the exact IP).

### 3. Keeping the App Active 24/7 (Free Tier)
Render's free tier web services spin down after 15 minutes of inactivity. To prevent this cold start and keep your application awake 24/7:
1. Set up a free account at [UptimeRobot](https://uptimerobot.com/) or [Cron-Job.org](https://cron-job.org/).
2. Create a new monitor/cron job to ping your Render live URL (`https://dreamland-31ik.onrender.com`) every **10 minutes**.
3. This keeps the server active constantly without incurring charges. *(Note: Running 24/7 consumes ~744 hours of your 750 free Render hours/month, which is safe if this is your only running free service).*

---

## 🛡️ Security & Best Practices

- **Sanitization & Escaping**: Input validation uses robust schemas compiled through **Joi** to block malicious payloads before controller processing.
- **Route Authorization**: Strict middleware boundaries ensure users can only modify/delete property listings or reviews they created.
- **Session Store**: Client sessions are stored in MongoDB via `connect-mongo` instead of in-memory, preventing memory leaks and preserving session state across deployments.

---

## 📜 License

This project is licensed under the **ISC License**. See the `LICENSE` file for more details.
