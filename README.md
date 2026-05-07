# Hostel Issue Tracking Platform

A full-stack cloud-native Hostel Issue Management Platform built using the MERN stack and AWS Serverless services. The application replaces informal complaint systems with a centralized workflow-driven platform featuring secure role-based dashboards for students and wardens.

---

# Live Demo

Frontend (CloudFront CDN):  
https://d1r0jtdsb204jf.cloudfront.net

GitHub Repository:  
https://github.com/ms-roshni/hostel-issue-tracker

---

# Tech Stack

## Frontend
- React.js (Vite)
- Context API
- Responsive CSS
- Mobile-first UI Design

## Backend
- Node.js
- Express.js
- Serverless Framework

## Cloud & DevOps
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon CloudFront

## Database & Authentication
- MongoDB Atlas
- JWT Authentication
- bcrypt.js

## File Uploads
- Amazon S3 Pre-signed URL Uploads
- Multer

---

# Key Features

## Authentication & Security
- Secure JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization for Students and Wardens
- Protected API routes

## Student Dashboard
- Raise and track hostel complaints
- Upload issue images directly to Amazon S3
- Filter between:
  - My Issues
  - All Issues
- Verify completed issues
- Fully responsive mobile experience

## Warden Dashboard
- View all hostel complaints
- Filter issues floor-wise
- Update complaint status:
  - Pending
  - In Progress
  - Resolved
- Remove issues
- View active students

## Cloud Deployment
- Serverless backend deployed on AWS Lambda
- API routing via API Gateway
- Frontend hosted using Amazon S3 + CloudFront CDN
- HTTPS-enabled production deployment
- CDN caching and cache invalidation support

---

# Architecture

Frontend (React + CloudFront)  
↓  
API Gateway  
↓  
AWS Lambda (Express Server)  
↓  
MongoDB Atlas  

Images Flow:  
Frontend → S3 Pre-signed Upload → Amazon S3 Storage

---

# Local Setup

## 1. Clone Repository

```bash
git clone https://github.com/ms-roshni/hostel-issue-tracker.git
cd hostel-issue-tracker
```

---

# Backend Setup

## 2. Navigate to Server

```bash
cd server
npm install
```

## 3. Create `.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
WARDEN_SECRET_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
```

## 4. Run Backend Locally

```bash
npm run dev
```

---

# Frontend Setup

## 5. Navigate to Client

```bash
cd client
npm install
```

## 6. Start Frontend

```bash
npm run dev
```

---

# AWS Deployment

## Backend Deployment

```bash
cd server
npx serverless deploy
```

## Frontend Deployment

```bash
cd client
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

## CloudFront Cache Invalidation

```bash
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---


# Future Improvements

- Email notifications
- Push notifications
- Complaint analytics dashboard
- Hostel block segmentation
- Admin panel
- Real-time updates using WebSockets

---

# Author

Roshni  
B.Tech Student | MERN + AWS Cloud Enthusiast
