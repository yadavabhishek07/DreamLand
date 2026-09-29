# DreamLand

A full-stack vacation rental and property listing web application inspired by Airbnb, built with Node.js, Express, and MongoDB following the MVC architecture.

🔗 **Live Website:** [https://dreamland-stays.vercel.app](https://dreamland-stays.vercel.app)  
🌐 **Custom Domain:** [https://dreamland-stays.is-a.dev](https://dreamland-stays.is-a.dev)

---

## Features

- **Property Listings (CRUD)**: Create, browse, update, and manage rental stays with details and pricing.
- **Cloud Media**: Automatic image optimization and upload via Cloudinary.
- **Category & Search**: Filter stays by categories (Rooms, Mountains, Pools, Farms, etc.) or destination search.
- **Reviews & Ratings**: Interactive 5-star user reviews and ratings system.
- **Authentication & Security**: User login/signup with Passport.js, session management, and route protection.
- **Interactive Maps**: Geographic stay location mapping powered by Leaflet.js.

---

## Tech Stack

- **Backend**: Node.js, Express.js (MVC Pattern)
- **Frontend**: EJS Templates, Bootstrap 5, FontAwesome
- **Database**: MongoDB Atlas, Mongoose
- **Authentication**: Passport.js
- **Cloud Services**: Cloudinary (Image Storage)
- **Deployment**: Vercel

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yadavabhishek07/DreamLand.git
cd DreamLand
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
SECRET=your_session_secret
ATLASDB_URL=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
```

### 3. Run Locally
```bash
npm run dev
# or
npm start
```
Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## Author

**Abhishek Yadav**  
GitHub: [@yadavabhishek07](https://github.com/yadavabhishek07)
