import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Client-side validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/api/auth/signup', { email, password });
            localStorage.setItem('token', res.data.token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
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
                top: '15%',
                right: '10%',
                width: '180px',
                height: '180px',
                background: 'linear-gradient(45deg, #10b981, #059669)',
                borderRadius: '50%',
                opacity: 0.1,
                blur: '90px'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '10%',
                left: '15%',
                width: '220px',
                height: '220px',
                background: 'linear-gradient(45deg, #f59e0b, #d97706)',
                borderRadius: '50%',
                opacity: 0.1,
                blur: '110px'
            }}></div>

            <div style={{
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '48px 40px',
                borderRadius: '24px',
                boxShadow: '0 25px 50px rgba(0, 0, 0, 0.35)',
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
                    background: 'linear-gradient(90deg, #10b981, #06b6d4, #7c3aed, #f59e0b)'
                }}></div>

                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <div style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        background: 'linear-gradient(135deg, #10b981, #06b6d4)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        ✨
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#e2e8f0',
                        letterSpacing: '-0.5px',
                        marginBottom: '8px'
                    }}>
                        Join AI Playground
                    </h1>
                    <p style={{
                        margin: 0,
                        color: '#94a3b8',
                        fontSize: '16px'
                    }}>
                        Create your account and start exploring AI
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
                                e.target.style.borderColor = '#10b981';
                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '24px' }}>
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
                            placeholder="Create a password (min. 6 characters)"
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
                                e.target.style.borderColor = '#10b981';
                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div style={{ marginBottom: '32px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#e2e8f0',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
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
                                e.target.style.borderColor = '#10b981';
                                e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#334155';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            background: loading 
                                ? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '16px 24px',
                            fontWeight: '600',
                            fontSize: '16px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            marginBottom: '24px',
                            transition: 'all 0.3s ease',
                            boxShadow: loading ? 'none' : '0 8px 20px rgba(16, 185, 129, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={e => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 12px 25px rgba(16, 185, 129, 0.4)';
                            }
                        }}
                        onMouseOut={e => {
                            if (!loading) {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 8px 20px rgba(16, 185, 129, 0.3)';
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
                        {loading ? 'Creating Account...' : 'Create Account'}
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

                {/* Terms and Privacy */}
                <div style={{
                    background: 'rgba(30, 41, 59, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    border: '1px solid rgba(51, 65, 85, 0.3)'
                }}>
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#94a3b8',
                        lineHeight: '1.5',
                        textAlign: 'center'
                    }}>
                        By creating an account, you agree to our{' '}
                        <a style={{ color: '#10b981', textDecoration: 'none' }}>Terms of Service</a>
                        {' '}and{' '}
                        <a style={{ color: '#10b981', textDecoration: 'none' }}>Privacy Policy</a>
                    </p>
                </div>

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

                {/* Login Link */}
                <div style={{
                    textAlign: 'center',
                    color: '#94a3b8',
                    fontSize: '16px'
                }}>
                    Already have an account?{' '}
                    <Link 
                        to="/login" 
                        style={{
                            color: '#10b981',
                            textDecoration: 'none',
                            fontWeight: '600',
                            transition: 'color 0.2s ease'
                        }}
                        onMouseOver={e => e.target.style.color = '#059669'}
                        onMouseOut={e => e.target.style.color = '#10b981'}
                    >
                        Sign In
                    </Link>
                </div>

                {/* Security Note */}
                <div style={{
                    marginTop: '32px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    color: '#64748b',
                    fontSize: '14px'
                }}>
                    <span style={{ fontSize: '16px' }}>🔒</span>
                    Your data is secure and encrypted
                </div>
            </div>
        </div>
    );
}
