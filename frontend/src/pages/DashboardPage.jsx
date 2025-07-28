import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [creating, setCreating] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState('');

    const fetchSessions = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get('/api/sessions', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSessions(res.data);
        } catch (err) {
            setError('Failed to load sessions');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleCreateSession = async () => {
        setCreating(true);
        setError('');
        try {
            await axios.post('/api/sessions', {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchSessions();
        } catch (err) {
            setError('Failed to create session');
        }
        setCreating(false);
    };

    const handleSessionClick = (id) => {
        navigate(`/session/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this session?')) return;
        try {
            await axios.delete(`/api/sessions/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            fetchSessions();
        } catch (err) {
            setError('Failed to delete session');
        }
    };

    const handleEdit = (id, currentTitle) => {
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const handleEditSave = async (id) => {
        try {
            await axios.put(`/api/sessions/${id}`, { title: editTitle }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setEditingId(null);
            setEditTitle('');
            fetchSessions();
        } catch (err) {
            setError('Failed to rename session');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            padding: '20px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                background: 'rgba(15, 23, 42, 0.8)',
                borderRadius: '20px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(10px)',
                overflow: 'hidden',
                border: '1px solid rgba(51, 65, 85, 0.3)'
            }}>
                {/* Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
                    padding: '32px 40px',
                    color: 'white'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <h1 style={{ 
                                margin: 0, 
                                fontSize: '32px', 
                                fontWeight: '700',
                                letterSpacing: '-0.5px',
                                textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                            }}>
                                AI Playground
                            </h1>
                            <p style={{ 
                                margin: '8px 0 0 0', 
                                opacity: 0.9,
                                fontSize: '16px' 
                            }}>
                                Manage your AI sessions
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '12px 24px',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                            onMouseOver={e => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                            }}
                            onMouseOut={e => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                            }}
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '40px' }}>
                    {/* Create Session Button */}
                    <div style={{ marginBottom: '32px' }}>
                        <button
                            onClick={handleCreateSession}
                            disabled={creating}
                            style={{
                                background: creating 
                                    ? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
                                    : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 50%, #0e7490 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                padding: '16px 32px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: creating ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: creating ? 'none' : '0 8px 20px rgba(6, 182, 212, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                            onMouseOver={e => {
                                if (!creating) {
                                    e.target.style.transform = 'translateY(-2px)';
                                    e.target.style.boxShadow = '0 12px 25px rgba(6, 182, 212, 0.4)';
                                }
                            }}
                            onMouseOut={e => {
                                if (!creating) {
                                    e.target.style.transform = 'translateY(0)';
                                    e.target.style.boxShadow = '0 8px 20px rgba(6, 182, 212, 0.3)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>+</span>
                            {creating ? 'Creating Session...' : 'New Session'}
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
                            border: '1px solid #b91c1c',
                            borderRadius: '12px',
                            padding: '16px',
                            marginBottom: '24px',
                            color: '#fca5a5',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {loading ? (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: '200px',
                            fontSize: '16px',
                            color: '#94a3b8'
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                border: '4px solid #334155',
                                borderTop: '4px solid #7c3aed',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                marginRight: '16px'
                            }}></div>
                            Loading sessions...
                            <style>
                                {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                            </style>
                        </div>
                    ) : sessions.length === 0 ? (
                        /* Empty State */
                        <div style={{
                            textAlign: 'center',
                            padding: '80px 20px',
                            color: '#94a3b8'
                        }}>
                            <div style={{
                                fontSize: '64px',
                                marginBottom: '24px',
                                opacity: 0.6
                            }}>
                                💭
                            </div>
                            <h3 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                margin: '0 0 12px 0',
                                color: '#e2e8f0'
                            }}>
                                No sessions yet
                            </h3>
                            <p style={{
                                fontSize: '16px',
                                margin: 0,
                                maxWidth: '400px',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                lineHeight: '1.6',
                                color: '#94a3b8'
                            }}>
                                Start your AI journey by creating your first session. 
                                Click the <strong style={{ color: '#06b6d4' }}>New Session</strong> button to get started!
                            </p>
                        </div>
                    ) : (
                        /* Sessions Grid */
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
                            gap: '24px'
                        }}>
                            {sessions.map((s) => (
                                <div
                                    key={s._id}
                                    style={{
                                        background: 'rgba(30, 41, 59, 0.8)',
                                        borderRadius: '16px',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                                        padding: '24px',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid rgba(51, 65, 85, 0.5)',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.3)';
                                        e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
                                        e.currentTarget.style.borderColor = 'rgba(51, 65, 85, 0.5)';
                                    }}
                                >
                                    {/* Decorative gradient */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4, #10b981)'
                                    }}></div>

                                    {editingId === s._id ? (
                                        <div style={{ marginBottom: '16px' }}>
                                            <input
                                                value={editTitle}
                                                onChange={e => setEditTitle(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '12px 16px',
                                                    borderRadius: '12px',
                                                    border: '2px solid #334155',
                                                    fontSize: '16px',
                                                    fontWeight: '600',
                                                    marginBottom: '12px',
                                                    outline: 'none',
                                                    transition: 'border-color 0.2s ease',
                                                    boxSizing: 'border-box',
                                                    background: 'rgba(15, 23, 42, 0.8)',
                                                    color: '#e2e8f0'
                                                }}
                                                onFocus={e => e.target.style.borderColor = '#7c3aed'}
                                                onBlur={e => e.target.style.borderColor = '#334155'}
                                            />
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button 
                                                    onClick={() => handleEditSave(s._id)} 
                                                    style={{
                                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'transform 0.2s ease'
                                                    }}
                                                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={() => setEditingId(null)} 
                                                    style={{
                                                        background: '#334155',
                                                        color: '#e2e8f0',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '8px 16px',
                                                        fontSize: '14px',
                                                        fontWeight: '500',
                                                        cursor: 'pointer',
                                                        transition: 'background-color 0.2s ease'
                                                    }}
                                                    onMouseOver={e => e.target.style.backgroundColor = '#475569'}
                                                    onMouseOut={e => e.target.style.backgroundColor = '#334155'}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                color: '#e2e8f0',
                                                cursor: 'pointer',
                                                marginBottom: '12px',
                                                lineHeight: '1.3',
                                                transition: 'color 0.2s ease'
                                            }}
                                            onClick={() => handleSessionClick(s._id)}
                                            onMouseOver={e => e.target.style.color = '#a855f7'}
                                            onMouseOut={e => e.target.style.color = '#e2e8f0'}
                                        >
                                            {s.title}
                                        </div>
                                    )}

                                    <div style={{
                                        fontSize: '14px',
                                        color: '#94a3b8',
                                        marginBottom: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}>
                                        <span style={{ fontSize: '12px' }}>🕒</span>
                                        {formatDate(s.updatedAt)}
                                    </div>

                                    {editingId !== s._id && (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button 
                                                onClick={() => handleEdit(s._id, s.title)} 
                                                style={{
                                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 16px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease',
                                                    flex: 1
                                                }}
                                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                            >
                                                ✏️ Rename
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(s._id)} 
                                                style={{
                                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 16px',
                                                    fontSize: '14px',
                                                    fontWeight: '500',
                                                    cursor: 'pointer',
                                                    transition: 'transform 0.2s ease',
                                                    flex: 1
                                                }}
                                                onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}