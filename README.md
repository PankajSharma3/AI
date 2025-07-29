# AI Playground 🚀

A modern web application for managing AI chat sessions with multiple AI providers (OpenAI, Anthropic Claude, Google Gemini). Built with React frontend and Node.js backend.

## ✨ Features

- **Multi-AI Provider Support**: Chat with OpenAI GPT, Anthropic Claude, and Google Gemini
- **Session Management**: Create, edit, rename, and delete chat sessions
- **User Authentication**: Secure login/signup with JWT tokens
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Chat**: Interactive chat interface with message history
- **Export Functionality**: Download chat sessions as files
- **Code Highlighting**: Syntax highlighting for code blocks
- **Responsive Design**: Works on desktop and mobile devices

## 🏗️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Syntax Highlighter** - Code syntax highlighting

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### AI Providers
- **OpenAI GPT** - OpenAI's language models
- **Anthropic Claude** - Claude AI assistant
- **Google Gemini** - Google's AI model

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn** package manager
- **API Keys** for AI providers (optional, for AI features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd WEB_
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Or create .env manually with the following content:
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/ai-playground

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Port
PORT=5000

# Node Environment
NODE_ENV=development

# AI Provider API Keys (optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_API_KEY=your-google-api-key
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Start the Application

#### Option A: Run Both Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# or with nodemon for development
npx nodemon index.js
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option B: Add Scripts to Backend Package.json

Add these scripts to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

### 5. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📁 Project Structure

```
WEB_/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js      # AI chat logic
│   │   ├── authController.js    # Authentication logic
│   │   └── sessionController.js # Session management
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT authentication middleware
│   ├── models/
│   │   ├── Session.js          # Session data model
│   │   └── User.js             # User data model
│   ├── routes/
│   |   ├── ai.js               # AI chat routes
│   |   ├── auth.js             # Authentication routes
│   |   └── session.js          # Session management routes
│   |
│   ├── index.js                # Main server file
│   ├── package.json
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx    # Main dashboard
│   │   │   ├── LoginPage.jsx        # Login page
│   │   │   ├── SessionPage.jsx      # Chat session page
│   │   │   └── SignupPage.jsx       # Signup page
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 🔧 Configuration

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB Community Server
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ai-playground`

#### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a cluster
3. Get connection string and replace in `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-playground?retryWrites=true&w=majority
   ```

### AI Provider API Keys

To use AI features, you'll need API keys from the providers:

1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Anthropic**: Get API key from [Anthropic Console](https://console.anthropic.com/)
3. **Google**: Get API key from [Google AI Studio](https://aistudio.google.com/)

Add them to your `.env` file:
```env
OPENAI_API_KEY=sk-your-openai-key
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key
GOOGLE_API_KEY=your-google-api-key
```

## 🎯 Usage

### 1. Authentication
- Visit http://localhost:5173
- Sign up for a new account or log in with existing credentials
- JWT tokens are automatically stored in localStorage

### 2. Session Management
- **Create Session**: Click "New Session" button
- **Rename Session**: Click the edit button on any session card
- **Delete Session**: Click the delete button (with confirmation)
- **Open Session**: Click on any session title to start chatting

### 3. AI Chat
- Select an AI provider (OpenAI, Claude, or Gemini)
- Type your message and press Enter
- View AI responses with syntax highlighting for code
- Export conversations as files

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for password security
- **CORS Protection**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in .env files

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Ensure MongoDB connection string is set
3. Deploy using Git integration

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables for API endpoints

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Port Already in Use**
   - Change PORT in `.env` file
   - Kill existing processes on the port

3. **CORS Errors**
   - Check frontend URL in backend CORS configuration
   - Ensure both servers are running

4. **API Key Errors**
   - Verify API keys are correctly set in `.env`
   - Check API provider account status

### Development Tips

- Use `nodemon` for backend development (auto-restart on changes)
- Check browser console for frontend errors
- Use MongoDB Compass for database visualization
- Monitor network tab for API request issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for the fast build tool
- MongoDB for the database
- AI providers for their APIs
- The open-source community

---

**Happy Coding! 🎉**

For support or questions, please open an issue in the repository. 
