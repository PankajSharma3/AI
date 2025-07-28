const Session = require('../models/Session');

// Create a new session
exports.createSession = async (req, res) => {
    try {
        const { title } = req.body;
        const session = new Session({
            user: req.user.userId,
            title: title || 'Untitled Session',
        });
        await session.save();
        res.status(201).json(session);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get all sessions for the logged-in user
exports.getSessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user.userId }).sort({ updatedAt: -1 });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Get a single session by ID (must belong to user)
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findOne({ _id: req.params.id, user: req.user.userId });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Update a session (chat/code/uiState)
exports.updateSession = async (req, res) => {
    try {
        const session = await Session.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            req.body,
            { new: true }
        );
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json(session);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a session
exports.deleteSession = async (req, res) => {
    try {
        const session = await Session.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        if (!session) return res.status(404).json({ message: 'Session not found' });
        res.json({ message: 'Session deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
}; 
