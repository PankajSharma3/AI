require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

->

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'https://ai-iota-wheat.vercel.app',
    'https://ai-7otahfkio-pankaj-sharmas-projects-9c9601a7.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());

// Auth routes
app.use('/api/auth', require('./routes/auth'));
// Session routes
app.use('/api/sessions', require('./routes/session'));
// AI routes
app.use('/api/ai', require('./routes/ai'));

// Health check route
app.get('/', (req, res) => {
    res.send('API is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }); 
