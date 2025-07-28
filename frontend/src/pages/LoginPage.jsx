import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '20px'
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '200px',
                height: '200px',
                background: 'linear-gradient(45deg, #7c3aed, #a855f7)',
                borderRadius: '50%',
                opacity: 0.1,
                blur: '100px'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '20%',
                right: '15%',
                width: '150px',
                height: '150px',
                background: 'linear-gradient(45deg, #06b6d4, #0891b2)',
                borderRadius: '50%',
                opacity: 0.1,
                blur: '80px'
            }}></div>

            <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '48px 40px',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(51, 65, 85, 0.3)',
                minWidth: '420px',
                width: '100%',
                maxWidth: '480px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative gradient border */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #7c3aed, #a855f7, #06b6d4, #10b981)'
                }}></div>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        🚀
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#e2e8f0',
                        letterSpacing: '-0.5px',
                        marginBottom: '8px'
                    }}>
                        Welcome Back
                    </h1>
                    <p style={{
                        margin: 0,
                        color: '#94a3b8',
                        fontSize: '16px'
                    }}>
                        Sign in to your AI Playground account
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid #334155',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                background: 'rgba(30, 41, 59, 0.5)',
                                color: '#e2e8f0',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = '#7c3aed';
                                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '16px 20px',
                                borderRadius: '12px',
                                border: '2px solid #334155',
                                fontSize: '16px',
                                outline: 'none',
                                boxSizing: 'border-box',
                                background: 'rgba(30, 41, 59, 0.5)',
                                color: '#e2e8f0',
                                transition: 'all 0.3s ease',
                                backdropFilter: 'blur(10px)'
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = '#7c3aed';
                                e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading 
                                ? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 24px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '24px',
                            transition: 'all 0.3s ease',
                            boxShadow: loading ? 'none' : '0 8px 20px rgba(124, 58, 237, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={e => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 25px rgba(124, 58, 237, 0.4)';
                            }
                        }}
                        onMouseOut={e => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.3)';
                            }
                        }}
                    >
                        {loading && (
                            <div style={{
                                width: '20px',
                                height: '20px',
                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                borderTop: '2px solid white',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                        {loading ? 'Signing In...' : 'Sign In'}
                        <style>
                            {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                        </style>
                    </button>
                </form>

                {/* Error Message */}
                {error && (
                    <div style={{
                        background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
                        border: '1px solid #b91c1c',
                        borderRadius: '12px',
                        padding: '16px',
                        marginBottom: '24px',
                        color: '#fca5a5',
                        textAlign: 'center',
                        fontSize: '14px',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}>
                        <span style={{ fontSize: '16px' }}>⚠️</span>
                        {error}
                    </div>
                )}

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        flex: 1,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #334155, transparent)'
                    }}></div>
                    <span style={{
                        padding: '0 16px',
                        color: '#64748b',
                        fontSize: '14px'
                    }}>
                        or
                    </span>
                    <div style={{
                        flex: 1,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, #334155, transparent)'
                    }}></div>
                </div>

                {/* Sign Up Link */}
                <div style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '16px'
                }}>
                    Don't have an account?{' '}
                    <Link 
                        to="/signup" 
                        style={{
                            color: '#a855f7',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseOver={e => e.target.style.color = '#7c3aed'}
                        onMouseOut={e => e.target.style.color = '#a855f7'}
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}