const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        default: 'Untitled Session',
    },
    chat: [
        {
            role: String, // 'user' or 'ai'
            content: String,
            timestamp: { type: Date, default: Date.now },
        },
    ],
    code: {
        jsx: { type: String, default: '' },
        css: { type: String, default: '' },
    },
    uiState: {
        type: Object,
        default: {},
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

sessionSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Session', sessionSchema); 