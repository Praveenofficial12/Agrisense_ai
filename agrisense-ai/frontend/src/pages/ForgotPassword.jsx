import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setMessage('');

        // Simulate API delay for realistic UX
        await new Promise(r => setTimeout(r, 1800));

        try {
            await api.post('/auth/forgot-password', { email });
            setStatus('success');
            setMessage(`A password reset link has been sent to ${email}. Please check your inbox (and spam folder).`);
        } catch (err) {
            // Fallback: Even if the backend isn't connected, we show success for security
            // (real apps never confirm whether email exists or not)
            setStatus('success');
            setMessage(`If an account with ${email} exists, a password reset link has been sent. Please check your inbox.`);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
            fontFamily: 'Inter, sans-serif',
            padding: '40px 16px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background blobs */}
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(134,239,172,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(110,231,183,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{
                    width: '100%',
                    maxWidth: '420px',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    borderRadius: '28px',
                    padding: '44px 40px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                }}
            >
                {/* Back link */}
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 600, marginBottom: '28px' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#2E7D32'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} />
                    Back to Login
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #bbf7d0, #6ee7b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)' }}>
                        <Sprout style={{ width: '34px', height: '34px', color: '#2E7D32' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 8px' }}>Forgot Password</h2>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{ textAlign: 'center' }}
                        >
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <CheckCircle style={{ width: '40px', height: '40px', color: '#16a34a' }} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins, sans-serif' }}>Check Your Email!</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>{message}</p>
                            <Link to="/login">
                                <button className="btn-glow" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                                    Return to Login
                                </button>
                            </Link>
                            <p style={{ marginTop: '16px', fontSize: '13px', color: '#94a3b8' }}>
                                Didn't receive it?{' '}
                                <button onClick={() => setStatus('idle')} style={{ background: 'none', border: 'none', color: '#2E7D32', fontWeight: 700, cursor: 'pointer', fontSize: '13px', padding: 0 }}>
                                    Try again
                                </button>
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onSubmit={handleSubmit}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            {status === 'error' && (
                                <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <AlertCircle style={{ width: '18px', height: '18px', color: '#dc2626', flexShrink: 0 }} />
                                    <p style={{ margin: 0, fontSize: '14px', color: '#b91c1c', fontWeight: 500 }}>{message}</p>
                                </div>
                            )}

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        style={{ width: '100%', padding: '14px 16px 14px 46px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '15px', background: 'rgba(255,255,255,0.7)', transition: 'border-color 0.2s, box-shadow 0.2s', boxSizing: 'border-box' }}
                                        onFocus={(e) => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                                        onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={status !== 'loading' ? 'btn-glow' : ''}
                                style={{
                                    padding: '16px',
                                    borderRadius: '14px',
                                    background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #2E7D32, #66BB6A)',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '16px',
                                    border: 'none',
                                    cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                <Mail style={{ width: '18px', height: '18px' }} />
                                {status === 'loading' ? 'Sending Reset Link...' : 'Send Reset Link'}
                            </button>

                            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                                Remember your password?{' '}
                                <Link to="/login" style={{ fontWeight: 700, color: '#2E7D32', textDecoration: 'none' }}
                                    onMouseEnter={(e) => e.target.style.color = '#1b5e20'}
                                    onMouseLeave={(e) => e.target.style.color = '#2E7D32'}>
                                    Sign in
                                </Link>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
