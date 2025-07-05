# ♻️ AI-Powered-EcoDonate-App

EcoDonate is an AI-powered web platform that helps individuals and businesses donate usable waste efficiently and responsibly. The system uses artificial intelligence to classify donated items, suggest titles/descriptions, and determine appropriate recipients (companies only or both companies and the public).

## 🚀 Key Features

- 🌿 **AI-Based Image Classification**  
  Detects the type of waste from uploaded images using a trained model.

- 🧠 **Smart Donation Categorization**  
  Determines whether the donation is suitable for:
  - Companies only
  - Both companies and the public

- ✍️ **Auto-Generated Titles & Descriptions**  
  Uses AI to suggest meaningful titles and descriptions from uploaded images.

- 👥 **User Authentication & Authorization**  
  - Register/Login via email or Google
  - Role-based access for donors and companies

- 📦 **Donation Dashboard**  
  Donors can view/manage their submitted donations.
  Companies can view eligible donations based on category.

## 🛠️ Tech Stack

### Frontend
- React.js (MERN stack)

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT for Auth
- RESTful APIs

### AI Microservices
**Flask (Python)** for:
  - Image understanding and classification using **Gemini's multimodal LLM**.
  - Text generation (titles and descriptions) via **Gemini LLM API**.


