# Hostel Issue Tracker

A full-stack defect tracking and lifecycle management application built with the MERN stack. Designed to replace informal messaging-based complaint systems with distinct, role-based dashboards for clear and transparent issue resolution.

## 🚀 Live Demo
- **Frontend / Live Website**: [Insert Your Vercel Link Here]
- **Backend API**: `https://hostel-issue-tracker-1d9f.onrender.com`

---

## 🛠️ Tech Stack
- **Frontend**: React.js (Vite), Context API, Custom Adaptive CSS Theming
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose Models)
- **Authentication**: JSON Web Tokens (JWT) & bcrypt.js
- **Media Storage**: Cloudinary (Image Hosting) & Multer (Multi-part parsing)

---

## 🔑 Key Features
- **Dual-Role Dashboards**: Isolated views and robust authorization constraints for 'Students' and administrative 'Wardens'.
- **Secure Authentication**: Encrypted password storage, comprehensive session management, and restricted API route protection.
- **Dynamic Issue Lifecycle**: Students submit and track complaints with real-time updates while Wardens dictate status flows (`Pending` -> `In Progress` -> `Resolved` -> `Archived`).
- **Seamless Media Uploads**: Integrated Cloudinary API allowing users to natively attach picture evidence directly to their issue tickets.
- **Premium UI Theming**: Features a fully responsive customized UI complete with a dynamic Day/Night toggle leveraging scoped CSS design variables.

---

## 💻 Local Setup & Installation

To run this project locally, you will need to initialize both the client and server environments.

### 1. Clone the repository
` ` `bash
git clone https://github.com/ms-roshni/hostel-issue-tracker.git
cd hostel-issue-tracker
` ` `

### 2. Backend Setup
` ` `bash
cd server
npm install
` ` `
Create a `.env` file in the root of the `server` directory and map your configuration keys:
` ` `env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

# Warden Registration Skeleton
WARDEN_SECRET=your_warden_registration_secret_key

# Cloudinary Integration (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
` ` `
Run the Node API:
` ` `bash
npm run dev
` ` `

### 3. Frontend Setup
Open a new terminal window at the root of the repository:
` ` `bash
cd client
npm install
` ` `
Start the Vite development server:
` ` `bash
npm run dev
` ` `

The application client should now be running locally, targeting your `localhost:8000` backend server!
