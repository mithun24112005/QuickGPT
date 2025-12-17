<div align="center">

# 🧠 QuickGPT

### AI-Powered Chat Assistant with Image Generation

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248.svg)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT-412991.svg)](https://openai.com/)

*A modern, full-stack AI chat application with intelligent conversation management, credit-based system, and AI image generation capabilities.*

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [How It Works](#-how-it-works)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**QuickGPT** is a full-stack AI chat application that provides a ChatGPT-like experience with additional features including AI image generation, credit-based usage system, and community sharing. Built with React and Node.js, it leverages OpenAI's GPT models for intelligent conversations and ImageKit for AI-powered image generation.

The application features a modern, responsive UI with dark mode support, real-time chat functionality, conversation history management, and a monetization system through Stripe integration.

---

## ✨ Features

### 🤖 **AI Chat Capabilities**
- **Intelligent Conversations**: Powered by OpenAI's GPT models (Gemini 2.0 Flash)
- **Context-Aware Responses**: Maintains conversation history for coherent dialogue
- **Real-time Messaging**: Instant AI responses with loading indicators
- **Markdown Support**: Rich text formatting in AI responses with syntax highlighting

### 🎨 **Image Generation**
- **AI-Powered Image Creation**: Generate images from text prompts
- **ImageKit Integration**: High-quality image generation and storage
- **Community Sharing**: Option to publish generated images to the community
- **Gallery View**: Browse community-shared AI-generated images

### 💳 **Credit System & Monetization**
- **Credit-Based Usage**: 
  - Text messages: 1 credit per message
  - Image generation: 2 credits per image
- **Free Credits**: New users receive 20 free credits
- **Flexible Plans**: Multiple credit packages available
- **Stripe Integration**: Secure payment processing for credit purchases

### 👤 **User Management**
- **Secure Authentication**: JWT-based authentication system
- **User Profiles**: Track usage, credits, and conversation history
- **Password Encryption**: bcrypt hashing for secure password storage
- **Session Management**: Persistent login sessions

### 💬 **Chat Management**
- **Multiple Conversations**: Create and manage multiple chat sessions
- **Conversation History**: All chats stored with timestamps
- **Chat Deletion**: Remove unwanted conversations
- **Chat Renaming**: Customize chat names for better organization

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark Mode**: Beautiful gradient dark theme
- **Smooth Animations**: Polished transitions and interactions
- **Mobile Menu**: Collapsible sidebar for mobile devices
- **Toast Notifications**: User-friendly feedback messages

---

## 🛠 Tech Stack

### **Frontend**
- **Framework**: React 19.1.1 with React Router
- **Styling**: TailwindCSS 4.1.13
- **Build Tool**: Vite 7.1.6
- **HTTP Client**: Axios 1.12.2
- **UI Components**:
  - react-hot-toast for notifications
  - react-markdown for markdown rendering
  - Prism.js for code syntax highlighting
  - moment.js for date formatting

### **Backend**
- **Runtime**: Node.js with Express 5.1.0
- **Database**: MongoDB with Mongoose 8.18.2
- **Authentication**: JWT (jsonwebtoken 9.0.2) + bcryptjs 3.0.2
- **AI Integration**: 
  - OpenAI SDK 5.23.1
  - ImageKit Node SDK 7.1.1
- **Payment Processing**: Stripe 19.1.0
- **Webhooks**: Svix 1.77.0
- **Middleware**: CORS, dotenv

### **Infrastructure**
- **Deployment**: Vercel (both client and server)
- **Database**: MongoDB Atlas
- **Image Storage**: ImageKit
- **Payment Gateway**: Stripe

---

## 📁 Project Structure

```
quick_gpt/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── assets/              # Images, icons, and static files
│   │   ├── components/          # React components
│   │   │   ├── ChatBox.jsx      # Main chat interface
│   │   │   ├── Message.jsx      # Individual message component
│   │   │   └── Sidebar.jsx      # Navigation sidebar
│   │   ├── context/             # React Context for state management
│   │   │   └── AppContext.jsx   # Global app state
│   │   ├── pages/               # Page components
│   │   │   ├── Login.jsx        # Authentication page
│   │   │   ├── Credits.jsx      # Credit purchase page
│   │   │   ├── Community.jsx    # Community gallery
│   │   │   └── Loading.jsx      # Loading screen
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Backend Node.js application
│   ├── configs/                 # Configuration files
│   │   ├── db.js                # MongoDB connection
│   │   ├── imageKit.js          # ImageKit setup
│   │   └── openai.js            # OpenAI configuration
│   ├── controllers/             # Request handlers
│   │   ├── userController.js    # User auth & management
│   │   ├── chatController.js    # Chat operations
│   │   ├── messageController.js # Message & AI logic
│   │   ├── creditController.js  # Credit & payment logic
│   │   └── webhooks.js          # Stripe webhooks
│   ├── middlewares/             # Custom middleware
│   │   └── auth.js              # JWT authentication
│   ├── models/                  # MongoDB schemas
│   │   ├── user.js              # User model
│   │   ├── Chat.js              # Chat model
│   │   └── Transaction.js       # Payment transaction model
│   ├── routes/                  # API routes
│   │   ├── userRoutes.js        # User endpoints
│   │   ├── chatRoutes.js        # Chat endpoints
│   │   ├── messageRoutes.js     # Message endpoints
│   │   └── creditsRoutes.js     # Credit endpoints
│   ├── server.js                # Server entry point
│   └── package.json
│
└── README.md                    # This file
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- OpenAI API key
- ImageKit account
- Stripe account (for payments)

### 1. Clone the Repository
```bash
git clone https://github.com/mithun24112005/QuickGPT.git
cd QuickGPT
```

### 2. Install Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables
Create `.env` files in both `client` and `server` directories (see [Environment Variables](#-environment-variables) section).

### 4. Start Development Servers

**Backend** (from `server` directory):
```bash
npm run server
# or for production
npm start
```

**Frontend** (from `client` directory):
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

---

## 🔐 Environment Variables

### **Server** (`server/.env`)
```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Server
PORT=3000
```

### **Client** (`client/.env`)
```env
VITE_API_URL=http://localhost:3000
# or your production API URL
```

---

## 💻 Usage

### **Getting Started**

1. **Sign Up / Login**
   - Create a new account or log in with existing credentials
   - New users receive 20 free credits automatically

2. **Start Chatting**
   - Click "New Chat" in the sidebar
   - Type your message and press Enter or click Send
   - AI responds in real-time

3. **Generate Images**
   - Toggle to "Image Mode" in the chat interface
   - Describe the image you want to generate
   - Images cost 2 credits each

4. **Purchase Credits**
   - Navigate to the "Credits" page
   - Choose a plan that fits your needs
   - Complete payment via Stripe

5. **Explore Community**
   - Visit the "Community" page
   - Browse AI-generated images shared by other users

### **Chat Features**
- **Create New Chat**: Start a fresh conversation
- **Switch Chats**: Click on any chat in the sidebar
- **Delete Chat**: Remove conversations you no longer need
- **Dark Mode**: Automatically enabled for better UX

---

## 📡 API Documentation

### **Base URL**
```
Production: https://your-api-url.vercel.app
Development: http://localhost:3000
```

### **Authentication**
All protected routes require a JWT token in the `Authorization` header:
```
Authorization: Bearer <your_jwt_token>
```

### **Endpoints**

#### **User Routes** (`/api/user`)
```http
POST   /api/user/register          # Register new user
POST   /api/user/login             # User login
GET    /api/user/profile           # Get user profile (protected)
```

#### **Chat Routes** (`/api/chat`)
```http
GET    /api/chat                   # Get all user chats (protected)
POST   /api/chat/create            # Create new chat (protected)
DELETE /api/chat/:id               # Delete chat (protected)
```

#### **Message Routes** (`/api/message`)
```http
POST   /api/message/text           # Send text message (protected)
POST   /api/message/image          # Generate AI image (protected)
```

#### **Credit Routes** (`/api/credit`)
```http
GET    /api/credit/plan            # Get available credit plans
POST   /api/credit/purchase        # Purchase credits (protected)
```

#### **Webhooks**
```http
POST   /api/stripe                 # Stripe payment webhooks
```

### **Example Request: Send Message**
```javascript
POST /api/message/text
Headers: {
  "Authorization": "Bearer <token>",
  "Content-Type": "application/json"
}
Body: {
  "chatId": "chat_id_here",
  "prompt": "What is React?"
}

Response: {
  "success": true,
  "reply": {
    "role": "assistant",
    "content": "React is a JavaScript library...",
    "timestamp": 1703001234567,
    "isImage": false
  }
}
```

---

## 🔄 How It Works

### **System Architecture**

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   React     │◄───────►│   Express   │◄───────►│   MongoDB   │
│  Frontend   │  HTTP   │   Backend   │  Mongo  │  Database   │
└─────────────┘         └─────────────┘         └─────────────┘
                              │
                              ├──────► OpenAI API (GPT Models)
                              ├──────► ImageKit API (Image Gen)
                              └──────► Stripe API (Payments)
```

### **Chat Flow**

1. **User Input**: User types a message in the chat interface
2. **Frontend Request**: React app sends POST request to `/api/message/text`
3. **Authentication**: Backend verifies JWT token and checks user credits
4. **AI Processing**: Backend forwards prompt to OpenAI GPT model
5. **Response Handling**: AI response is saved to MongoDB and returned to frontend
6. **Credit Deduction**: User account is debited 1 credit
7. **UI Update**: Frontend displays AI response with markdown formatting

### **Image Generation Flow**

1. **Image Request**: User enters image prompt in image mode
2. **Credit Check**: Backend verifies user has at least 2 credits
3. **ImageKit Generation**: Prompt is sent to ImageKit AI generation endpoint
4. **Image Storage**: Generated image is uploaded to ImageKit media library
5. **Database Update**: Image URL and metadata saved to chat messages
6. **Response**: Image URL returned to frontend for display
7. **Credit Deduction**: User account is debited 2 credits

### **Payment Flow**

1. **Plan Selection**: User chooses a credit package
2. **Stripe Checkout**: Backend creates Stripe checkout session
3. **Payment**: User redirected to Stripe payment page
4. **Webhook**: Stripe sends webhook on successful payment
5. **Credit Addition**: Backend adds purchased credits to user account
6. **Transaction Record**: Payment details saved in Transaction model

---

## 🎨 Screenshots

*Add screenshots of your application here*

```markdown
### Chat Interface
![Chat Interface](path/to/screenshot1.png)

### Image Generation
![Image Generation](path/to/screenshot2.png)

### Credit Plans
![Credit Plans](path/to/screenshot3.png)
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow existing code style and conventions
- Write clear commit messages
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Mithun**
- GitHub: [@mithun24112005](https://github.com/mithun24112005)

---

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for GPT models
- [ImageKit](https://imagekit.io/) for AI image generation
- [Stripe](https://stripe.com/) for payment processing
- [MongoDB](https://www.mongodb.com/) for database
- [Vercel](https://vercel.com/) for hosting

---

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Contact: mithun24112005@gmail.com
---

<div align="center">

### ⭐ Star this repository if you find it helpful!

**QuickGPT** - Your Personal AI Assistant 🚀

</div>
