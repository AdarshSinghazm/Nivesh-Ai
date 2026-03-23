# 🚀 Nivesh AI - Intelligence First Investment Assistant

**Nivesh AI** is a professional-grade investment copilot designed for Indian investors. It combines real-time NSE market data with advanced AI-driven insights to help users make smarter, data-backed financial decisions.

---

## ✨ Key Features
- **📈 Live Market Overview**: Real-time snapshots of Nifty 50 stocks with sentiment analysis.
- **🤖 AI Advisor**: Interactive 24/7 financial advisor powered by Google Gemini Pro.
- **📊 Advanced ML Predictions**: Stock price trend forecasting using a custom Random Forest Inference Engine.
- **💼 Portfolio Management**: Secure tracking and AI-driven rebalancing recommendations.
- **🛡️ Secure & Private**: Industry-standard encryption and environment-based secret management.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Framer Motion, Recharts.
- **Backend**: Next.js API Routes, Node.js.
- **Database**: Prisma ORM with SQLite (Local) / PostgreSQL (Prod).
- **AI/ML Engine**: 
  - **LLM**: Google Gemini 1.5 Flash/Pro.
  - **Forecasting**: Python (Scikit-Learn, Pandas, Numpy).
- **Auth**: NextAuth.js.

---

## 📥 Getting Started

### 1. Prerequisites
- **Node.js**: 18.x or higher
- **Python**: 3.9.x or higher
- **Git**: Installed on your system

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/siddharth-singh-1206/Nivesh_AI.git

# Install Node dependencies
npm install

# Install Python dependencies
pip install -r requirements.txt
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your keys:
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your_random_secret_here"
GEMINI_API_KEY="your_google_ai_studio_key"
```

### 4. Database Initialization
```bash
npx prisma generate
npx prisma db push
```

### 5. Launch the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see your investment copilot in action!

---

## 📁 Project Structure
- `/app`: Next.js page routes and API logic.
- `/components`: Reusable UI components (Navbar, Charts, Cards).
- `/lib/services`: Core business logic (Market data, AI Chat, Recommendations).
- `/ml_model`: Trained ML models and data preprocessing scripts.
- `predict_stock.py`: The Python inference engine for mid-term predictions.

---

## 🏆 Hackathon Submission
This project was built for the **Startup Hackathon**. It focuses on bridging the gap between raw market data and actionable intelligence for retail investors.

**Author:** [Siddharth Singh](https://github.com/siddharth-singh-1206)

