import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function SessionPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [prompt, setPrompt] = useState('');
    const [sending, setSending] = useState(false);
    const [tab, setTab] = useState('jsx');
    const [copyMsg, setCopyMsg] = useState('');
    const chatEndRef = useRef(null);
    const [iframeKey, setIframeKey] = useState(0);

    const fetchSession = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.get(`/api/sessions/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setSession(res.data);
        } catch (err) {
            setError('Failed to load session');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSession();
        // eslint-disable-next-line
    }, [id]);

    useEffect(() => {
        if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [session]);

    useEffect(() => {
        setIframeKey((k) => k + 1); // force iframe reload on code change
    }, [session?.code?.jsx, session?.code?.css]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setSending(true);
        setError('');
        try {
            // Add user message to chat
            const newChat = [...(session.chat || []), { role: 'user', content: prompt }];
            setSession({ ...session, chat: newChat });
            setPrompt('');
            // Call AI backend
            const aiRes = await axios.post('/api/ai/generate', { prompt }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Add AI response to chat and update code
            const updatedSession = {
                ...session,
                chat: [...newChat, { role: 'ai', content: aiRes.data.message || 'AI responded.' }],
                code: { jsx: aiRes.data.jsx, css: aiRes.data.css },
            };
            setSession(updatedSession);
            // Persist to backend
            await axios.put(`/api/sessions/${id}`, updatedSession, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (err) {
            setError('AI error or failed to update session');
        }
        setSending(false);
    };

    const handleCopy = async () => {
        let code = tab === 'jsx' ? (session.code?.jsx || '') : (session.code?.css || '');
        try {
            await navigator.clipboard.writeText(code);
            setCopyMsg('Copied!');
            setTimeout(() => setCopyMsg(''), 1200);
        } catch {
            setCopyMsg('Copy failed');
            setTimeout(() => setCopyMsg(''), 1200);
        }
    };

    const handleDownload = async () => {
        const zip = new JSZip();
        zip.file('Component.jsx', session.code?.jsx || '');
        zip.file('styles.css', session.code?.css || '');
        const blob = await zip.generateAsync({ type: 'blob' });
        saveAs(blob, 'component.zip');
    };

    if (loading) return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e2e8f0',
            fontSize: '18px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    border: '4px solid #334155',
                    borderTop: '4px solid #7c3aed',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                Loading session...
                <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                </style>
            </div>
        </div>
    );

    if (error) return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
                border: '1px solid #b91c1c',
                borderRadius: '16px',
                padding: '24px',
                color: '#fca5a5',
                fontSize: '16px',
                fontWeight: '500',
                textAlign: 'center',
                maxWidth: '400px'
            }}>
                <span style={{ fontSize: '24px', marginRight: '8px' }}>⚠️</span>
                {error}
            </div>
        </div>
    );

    if (!session) return null;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
            padding: '24px',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderRadius: '16px',
                    padding: '24px 32px',
                    marginBottom: '24px',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(51, 65, 85, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: '700',
                            color: '#e2e8f0',
                            marginBottom: '4px'
                        }}>
                            {session.title}
                        </h1>
                        <p style={{
                            margin: 0,
                            color: '#94a3b8',
                            fontSize: '16px'
                        }}>
                            AI-Powered Development Session
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px 24px',
                            fontWeight: '600',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                        onMouseOver={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 20px rgba(124, 58, 237, 0.4)';
                        }}
                        onMouseOut={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 4px 12px rgba(124, 58, 237, 0.3)';
                        }}
                    >
                        <span>←</span> Back to Dashboard
                    </button>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(400px, 1fr) minmax(500px, 1.2fr)',
                    gap: '24px',
                    alignItems: 'start'
                }}>
                    {/* Chat Panel */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(51, 65, 85, 0.3)',
                        overflow: 'hidden',
                        height: 'fit-content',
                        maxHeight: '700px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Chat Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                            padding: '16px 24px',
                            color: 'white'
                        }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                💬 AI Chat
                            </h3>
                        </div>

                        {/* Chat Messages */}
                        <div style={{
                            flex: 1,
                            padding: '24px',
                            overflowY: 'auto',
                            minHeight: '300px',
                            maxHeight: '500px'
                        }}>
                            {(session.chat || []).length === 0 ? (
                                <div style={{
                                    textAlign: 'center',
                                    color: '#94a3b8',
                                    fontSize: '16px',
                                    padding: '40px 20px'
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.6 }}>🤖</div>
                                    <p style={{ margin: 0 }}>Start a conversation with AI to generate components!</p>
                                </div>
                            ) : (
                                (session.chat || []).map((msg, i) => (
                                    <div key={i} style={{
                                        marginBottom: '16px',
                                        display: 'flex',
                                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                                        alignItems: 'flex-start',
                                        gap: '12px'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: msg.role === 'user' 
                                                ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)'
                                                : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '16px',
                                            flexShrink: 0
                                        }}>
                                            {msg.role === 'user' ? '👤' : '🤖'}
                                        </div>
                                        <div style={{
                                            background: msg.role === 'user' 
                                                ? 'rgba(124, 58, 237, 0.2)' 
                                                : 'rgba(30, 41, 59, 0.8)',
                                            border: `1px solid ${msg.role === 'user' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(51, 65, 85, 0.5)'}`,
                                            borderRadius: '16px',
                                            padding: '12px 16px',
                                            maxWidth: '85%',
                                            color: '#e2e8f0',
                                            fontSize: '15px',
                                            lineHeight: '1.5'
                                        }}>
                                            <div style={{
                                                fontWeight: '600',
                                                marginBottom: '4px',
                                                fontSize: '13px',
                                                color: msg.role === 'user' ? '#c084fc' : '#06b6d4',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}>
                                                {msg.role === 'user' ? 'You' : 'AI Assistant'}
                                            </div>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div style={{
                            padding: '24px',
                            borderTop: '1px solid rgba(51, 65, 85, 0.3)'
                        }}>
                            <form onSubmit={handleSend} style={{
                                display: 'flex',
                                gap: '12px',
                                alignItems: 'flex-end'
                            }}>
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={e => setPrompt(e.target.value)}
                                    placeholder="Ask AI to create or modify components..."
                                    disabled={sending}
                                    style={{
                                        flex: 1,
                                        padding: '12px 16px',
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
                                        e.target.style.borderColor = '#06b6d4';
                                        e.target.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.1)';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#334155';
                                        e.target.style.boxShadow = 'none';
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={sending || !prompt.trim()}
                                    style={{
                                        background: sending || !prompt.trim()
                                            ? 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)'
                                            : 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        padding: '12px 20px',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                        cursor: sending || !prompt.trim() ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        minWidth: '100px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    {sending && (
                                        <div style={{
                                            width: '16px',
                                            height: '16px',
                                            border: '2px solid rgba(255, 255, 255, 0.3)',
                                            borderTop: '2px solid white',
                                            borderRadius: '50%',
                                            animation: 'spin 1s linear infinite'
                                        }}></div>
                                    )}
                                    {sending ? 'Sending...' : 'Send'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Code Panel */}
                    <div style={{
                        background: 'rgba(15, 23, 42, 0.8)',
                        borderRadius: '16px',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(51, 65, 85, 0.3)',
                        overflow: 'hidden'
                    }}>
                        {/* Code Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            padding: '16px 24px',
                            color: 'white'
                        }}>
                            <h3 style={{
                                margin: 0,
                                fontSize: '18px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                💻 Generated Code
                            </h3>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {/* Tab Bar */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '16px',
                                background: 'rgba(30, 41, 59, 0.5)',
                                padding: '6px',
                                borderRadius: '12px',
                                border: '1px solid rgba(51, 65, 85, 0.3)'
                            }}>
                                <button
                                    onClick={() => setTab('jsx')}
                                    style={{
                                        flex: 1,
                                        background: tab === 'jsx' 
                                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                            : 'transparent',
                                        color: tab === 'jsx' ? 'white' : '#94a3b8',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 16px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    📄 JSX
                                </button>
                                <button
                                    onClick={() => setTab('css')}
                                    style={{
                                        flex: 1,
                                        background: tab === 'css' 
                                            ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                                            : 'transparent',
                                        color: tab === 'css' ? 'white' : '#94a3b8',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px 16px',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    🎨 CSS
                                </button>
                            </div>

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                marginBottom: '16px',
                                flexWrap: 'wrap'
                            }}>
                                <button
                                    onClick={handleCopy}
                                    style={{
                                        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                >
                                    📋 Copy
                                </button>
                                <button
                                    onClick={handleDownload}
                                    style={{
                                        background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 16px',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                    onMouseOver={e => e.target.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.target.style.transform = 'scale(1)'}
                                >
                                    📦 Download
                                </button>
                                {copyMsg && (
                                    <span style={{
                                        color: '#10b981',
                                        fontSize: '14px',
                                        fontWeight: '500',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        ✅ {copyMsg}
                                    </span>
                                )}
                            </div>

                            {/* Code Display */}
                            <div style={{
                                borderRadius: '12px',
                                overflow: 'hidden',
                                border: '1px solid rgba(51, 65, 85, 0.3)'
                            }}>
                                {tab === 'jsx' ? (
                                    <SyntaxHighlighter
                                        language="jsx"
                                        style={oneDark}
                                        customStyle={{
                                            margin: 0,
                                            minHeight: '200px',
                                            fontSize: '14px',
                                            background: 'rgba(30, 41, 59, 0.8)'
                                        }}
                                    >
                                        {session.code?.jsx || '// No JSX code generated yet\n// Ask the AI to create a component!'}
                                    </SyntaxHighlighter>
                                ) : (
                                    <SyntaxHighlighter
                                        language="css"
                                        style={oneDark}
                                        customStyle={{
                                            margin: 0,
                                            minHeight: '200px',
                                            fontSize: '14px',
                                            background: 'rgba(30, 41, 59, 0.8)'
                                        }}
                                    >
                                        {session.code?.css || '/* No CSS styles generated yet */\n/* Ask the AI to create styled components! */'}
                                    </SyntaxHighlighter>
                                )}
                            </div>

                            {/* Live Preview */}
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{
                                    color: '#e2e8f0',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    marginBottom: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    🖥️ Live Preview
                                </h4>
                                <div style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1px solid rgba(51, 65, 85, 0.3)',
                                    background: 'white'
                                }}>
                                    <iframe
                                        key={iframeKey}
                                        title="Component Preview"
                                        style={{
                                            width: '100%',
                                            minHeight: '300px',
                                            border: 'none',
                                            background: 'white'
                                        }}
                                        sandbox="allow-scripts"
                                        srcDoc={`<html>
                                            <head>
                                                <style>${session.code?.css || ''}</style>
                                                <style>body { margin: 20px; font-family: system-ui, -apple-system, sans-serif; }</style>
                                            </head>
                                            <body>
                                                <div id='root'></div>
                                                <script type='text/javascript'>
                                                    try { 
                                                        window.React = null; 
                                                        window.exports = {}; 
                                                        window.module = {}; 
                                                        document.getElementById('root').innerHTML = '';
                                                        const el = eval(\`${session.code?.jsx || ''}\`); 
                                                        if (typeof el === 'string') { 
                                                            document.getElementById('root').innerHTML = el; 
                                                        } 
                                                    } catch (e) { 
                                                        document.getElementById('root').innerHTML = '<div style="color:red; padding:20px; border:1px solid red; border-radius:8px; background:#fff5f5;"><strong>Preview Error:</strong><br/>' + e.toString() + '</div>'; 
                                                    }
                                                </script>
                                            </body>
                                        </html>`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}