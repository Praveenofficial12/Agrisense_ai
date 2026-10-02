# 🌾 AgriSense AI

AgriSense AI is a production-grade SaaS AgriTech platform designed to monitor crop health, simulate soil environments via WebSocket IoT sensors, and predict agricultural anomalies like pest outbreaks and crop diseases using mock AI algorithms.

## 🌟 Key Features

1. **Dashboard Overview**: Centralized glassmorphism interface for comprehensive farm monitoring.
2. **AI Disease Detection**: CNN placeholder model predicting diseases affecting leaves.
3. **NDVI Heatmap Generation**: Pipeline simulating Multi-spectral (RED + NIR) band NDVI values.
4. **Pest Risk Forecasting**: LSTM temporal sequence simulator based on environmental conditions.
5. **Real-Time IoT Simulation**: Live WebSocket stream plotting continuous soil NPK, moisture, humidity and pH sensor data into responsive React charts.

## 🏗 System Architecture

The project consists of three independent microservices leveraging modern tech stacks:

- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, Recharts, Lucide React, Axios.
- **Backend / Authentication System**: FastAPI, JWT, `pydantic` validations, MongoDB (`motor`).
- **AI Inference Engine**: Standalone Python FastAPI microservice housing models and REST logic.
- **Database**: MongoDB instance for unified document storage.

## 🚀 Local Development setup

### Prerequisites
- Docker & Docker Compose
- Node.js > 18.0.0 (if running frontend entirely locally)
- MongoDB running instances (or rely purely on the docker compose image)

### Deploy Locally via Docker
To bring the entire cloud-scalable stack up locally:
```bash
git clone https://github.com/your-username/agrisense-ai.git
cd agrisense-ai
docker-compose up --build
```

The system will expose the following services:
- **Frontend App**: `http://localhost:3000`
- **Backend Core APIs**: `http://localhost:8000` (docs optionally available at `/docs`)
- **AI Inference Service**: `http://localhost:8001` (docs optionally available at `/docs`)
- **MongoDB Database**: `mongodb://localhost:27017`

### Interacting with the Application
Once the application initializes, visit `http://localhost:3000` via your web browser to land on the beautifully animated marketing landing page.

Register a new mock account by routing to `/register` or login directly using existing collections at `/login`.
*Note: Because no data is seeded initially, you will need to Register a new user before you can log in to the Dashboard.*

## ☁️ Cloud Deployment (AWS / GCP)

### Deploying the Backend (AWS EC2 / Elastic Beanstalk)
1. Ensure your MongoDB URI points toward an external managed cluster like **MongoDB Atlas**. Update `docker-compose.yml` or your `.env` configs.
2. Pull the repository onto an EC2 Ubuntu instance.
3. Install docker / docker-compose.
4. `docker-compose up -d --build mongodb backend ai-service` (if running DB internally).

### Deploying the Frontend (AWS S3 + CloudFront or Vercel)
For optimal CDN edge delivery:
1. `cd frontend`
2. `npm install`
3. Update `src/services/api.js` replacing `http://localhost:8000` with your AWS EC2 Public DNS / Load Balancer.
4. `npm run build`
5. Upload `.dist/` contents to an S3 bucket configured for static site routing, placing CloudFront in front of it securely.

## 🔐 Security Information
- JWT access tokens secure all cross-origin communications between the SPA Client and FastAPI Backend Services.
- Passwords are unconditionally hashed (bcrypt) iteratively prior to DB writes.
- The repository follows strong microservice decouple boundaries to segregate sensitive data (like IoT websockets) from heavy ML memory loads (AI Service module).

## 📄 License
MIT License. Created by AI Engineering.
