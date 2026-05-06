# Hostel Issue Tracker

A full-stack cloud-native issue tracking and lifecycle management platform built using the MERN stack and deployed on AWS using a serverless architecture.

The application replaces informal hostel complaint workflows with a centralized platform featuring role-based dashboards, secure authentication, issue lifecycle management, and cloud-hosted image uploads.

---

# 🚀 Live Deployment

## Frontend (AWS S3 Static Hosting)

[http://roshni-hostel-frontend-2026.s3-website.ap-south-1.amazonaws.com](http://roshni-hostel-frontend-2026.s3-website.ap-south-1.amazonaws.com)

## Backend API (AWS Lambda + API Gateway)

[https://z21fggbpoe.execute-api.ap-south-1.amazonaws.com/dev](https://z21fggbpoe.execute-api.ap-south-1.amazonaws.com/dev)

---

# ☁️ AWS Architecture

This project was migrated from a traditional MERN deployment to a serverless AWS cloud architecture.

### AWS Services Used

* AWS Lambda
* Amazon API Gateway
* Amazon S3
* AWS IAM
* AWS CloudWatch
* Serverless Framework

### Cloud Features

* Serverless Express backend deployment using AWS Lambda
* API routing through Amazon API Gateway
* Frontend static hosting using Amazon S3
* Secure image uploads using S3 Pre-signed URLs
* CloudWatch logging for backend monitoring
* Infrastructure deployment using Serverless Framework

---

# 🛠️ Tech Stack

## Frontend

* React.js (Vite)
* Context API
* Custom Responsive CSS
* Dynamic Theme Toggle

## Backend

* Node.js
* Express.js
* Serverless Framework
* serverless-http

## Database

* MongoDB Atlas
* Mongoose

## Authentication

* JWT (JSON Web Tokens)
* bcrypt.js

## Cloud & Storage

* AWS Lambda
* Amazon API Gateway
* Amazon S3
* AWS IAM
* AWS CloudWatch

---

# 🔑 Key Features

## Role-Based Dashboards

Separate dashboards and authorization layers for:

* Students
* Wardens

## Secure Authentication

* JWT-based authentication
* Password hashing using bcrypt
* Protected API routes
* Session persistence

## Dynamic Issue Lifecycle

Students can:

* Submit complaints
* Upload image evidence
* Track issue status

Wardens can:

* View all complaints
* Update issue statuses
* Manage complaint resolution lifecycle

Issue flow:

Pending → In Progress → Resolved → Archived

## Secure Cloud Image Uploads

* Direct browser-to-S3 uploads using pre-signed URLs
* Eliminates backend file handling bottlenecks
* Images stored securely in Amazon S3

## Fully Responsive UI

* Mobile responsive design
* Dark/Light theme toggle
* Adaptive dashboard layouts

---

# 📂 Project Structure

```bash
hostel-app/
│
├── client/                     # React frontend
│   ├── src/
│   └── public/
│
├── server/                     # Express backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── utils/
│   └── serverless.yml
│
└── README.md
```

---

# 💻 Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/ms-roshni/hostel-issue-tracker.git
cd hostel-issue-tracker
```

---

# ⚙️ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
WARDEN_SECRET_KEY=your_warden_secret

AWS_REGION=ap-south-1
AWS_S3_BUCKET_NAME=your_s3_bucket_name
```

Run backend locally:

```bash
npm run dev
```

---

# ⚙️ Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
VITE_API_URL=http://localhost:8000
```

Run frontend locally:

```bash
npm run dev
```

---

# ☁️ AWS Deployment

## Backend Deployment

Inside `server/`:

```bash
npx serverless deploy
```

This deploys:

* AWS Lambda functions
* API Gateway routes
* IAM permissions

---

## Frontend Deployment

Inside `client/`:

```bash
npm run build
aws s3 sync dist/ s3://your-frontend-bucket-name
```

---

# 📸 Screenshots

Add screenshots here:

* Login Page
* Student Dashboard
* Warden Dashboard
* Complaint Submission
* Image Upload Workflow
* AWS Console Resources

---

# 📚 Learning Outcomes

This project demonstrates:

* Full-stack MERN development
* Cloud-native deployment workflows
* Serverless architecture patterns
* AWS Lambda integration
* API Gateway routing
* S3 object storage workflows
* Secure image upload pipelines
* Infrastructure as Code concepts
* Production debugging and deployment

---

# 🔮 Future Improvements

* HTTPS via CloudFront
* Custom domain integration
* Email notifications using SNS/SES
* Push notifications
* Admin analytics dashboard
* Role-based audit logs
* Docker containerization
* CI/CD pipeline automation

---

# 👩‍💻 Author

Roshni M S

GitHub:
[https://github.com/ms-roshni](https://github.com/ms-roshni)
