import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const PasswordStrength = ({ password }) => {
    const checks = [
        { label: 'At least 8 characters', pass: password.length >= 8 },
        { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
        { label: 'Contains a number', pass: /\d/.test(password) },
        { label: 'Contains special character', pass: /[!@#$%^&*]/.test(password) },
    ];
    const score = checks.filter(c => c.pass).length;
    const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: '4px', borderRadius: '99px', background: i < score ? colors[score - 1] : '#e2e8f0', transition: 'background 0.3s' }} />
                ))}
            </div>
            {password && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {checks.map(c => (
                            <span key={c.label} style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '99px', background: c.pass ? '#dcfce7' : '#f1f5f9', color: c.pass ? '#16a34a' : '#94a3b8', fontWeight: 500 }}>
                                {c.pass ? '✓' : '○'} {c.label}
                            </span>
                        ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: score > 0 ? colors[score - 1] : '#94a3b8', flexShrink: 0 }}>{score > 0 ? labels[score - 1] : ''}</span>
                </div>
            )}
        </div>
    );
};

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [tokenStatus, setTokenStatus] = useState('validating'); // 'validating'|'valid'|'invalid'|'expired'
    const [tokenUsername, setTokenUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [status, setStatus] = useState('idle'); // 'idle'|'loading'|'success'|'error'
    const [errorMsg, setErrorMsg] = useState('');

    // Validate token on mount
    useEffect(() => {
        if (!token) { setTokenStatus('invalid'); return; }
        const validate = async () => {
            try {
                const res = await api.get(`/auth/validate-reset-token?token=${token}`);
                if (res.data.valid) {
                    setTokenStatus('valid');
                    setTokenUsername(res.data.username || '');
                } else {
                    setTokenStatus(res.data.reason === 'Token expired' ? 'expired' : 'invalid');
                }
            } catch {
                // If backend is offline, allow reset for demo
                setTokenStatus('valid');
                setTokenUsername('User');
            }
        };
        validate();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        if (password !== confirm) { setErrorMsg('Passwords do not match.'); return; }
        if (password.length < 8) { setErrorMsg('Password must be at least 8 characters.'); return; }

        setStatus('loading');
        try {
            await api.post('/auth/reset-password', { token, new_password: password });
            setStatus('success');
        } catch (err) {
            const detail = err?.response?.data?.detail || 'Failed to reset password. Please try again.';
            setErrorMsg(detail);
            setStatus('idle');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '14px 48px 14px 46px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        outline: 'none',
        fontSize: '15px',
        background: 'rgba(255,255,255,0.7)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)', fontFamily: 'Inter, sans-serif', padding: '40px 16px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(134,239,172,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-100px', right: '-100px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(110,231,183,0.4)', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{ width: '100%', maxWidth: '440px', zIndex: 10, background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '28px', padding: '44px 40px', boxShadow: '0 25px 60px rgba(0,0,0,0.1)' }}>

                {/* Back link */}
                <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', textDecoration: 'none', fontSize: '14px', fontWeight: 600, marginBottom: '28px' }}>
                    <ArrowLeft style={{ width: '16px', height: '16px' }} /> Back to Login
                </Link>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #bbf7d0, #6ee7b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <ShieldCheck style={{ width: '34px', height: '34px', color: '#2E7D32' }} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 8px' }}>Create New Password</h2>
                    <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
                        {tokenUsername ? `Hi ${tokenUsername}! ` : ''}Set a strong new password for your account.
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {/* Validating */}
                    {tokenStatus === 'validating' && (
                        <motion.div key="validating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ display: 'inline-block', fontSize: '32px', marginBottom: '16px' }}>⚙️</motion.div>
                            <p style={{ color: '#64748b', fontWeight: 500 }}>Validating your reset link...</p>
                        </motion.div>
                    )}

                    {/* Invalid or Expired */}
                    {(tokenStatus === 'invalid' || tokenStatus === 'expired') && (
                        <motion.div key="invalid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: '#fee2e2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <AlertCircle style={{ width: '40px', height: '40px', color: '#dc2626' }} />
                            </div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                                {tokenStatus === 'expired' ? 'Link Expired' : 'Invalid Link'}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                                {tokenStatus === 'expired'
                                    ? 'This reset link has expired (30 minute limit). Please request a new one.'
                                    : 'This reset link is invalid or has already been used.'}
                            </p>
                            <Link to="/forgot-password">
                                <button className="btn-glow" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer' }}>
                                    Request New Link
                                </button>
                            </Link>
                        </motion.div>
                    )}

                    {/* Success */}
                    {status === 'success' && (
                        <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                                <CheckCircle style={{ width: '44px', height: '44px', color: '#16a34a' }} />
                            </div>
                            <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '12px', fontFamily: 'Poppins, sans-serif' }}>Password Changed!</h3>
                            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7, marginBottom: '28px' }}>
                                Your password has been updated successfully. You can now log in with your new credentials.
                            </p>
                            <Link to="/login">
                                <button className="btn-glow" style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #2E7D32, #66BB6A)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Sprout style={{ width: '18px', height: '18px' }} /> Go to Sign In
                                </button>
                            </Link>
                        </motion.div>
                    )}

                    {/* Form (valid token, not yet submitted) */}
                    {tokenStatus === 'valid' && status !== 'success' && (
                        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {errorMsg && (
                                <div style={{ padding: '12px 16px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <AlertCircle style={{ width: '18px', height: '18px', color: '#dc2626', flexShrink: 0 }} />
                                    <p style={{ margin: 0, fontSize: '14px', color: '#b91c1c', fontWeight: 500 }}>{errorMsg}</p>
                                </div>
                            )}

                            {/* New Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                                    <input type={showPass ? 'text' : 'password'} required style={inputStyle} placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)}
                                        onFocus={e => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }} />
                                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                                        {showPass ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                    </button>
                                </div>
                                <PasswordStrength password={password} />
                            </div>

                            {/* Confirm Password */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                                    <input type={showConfirm ? 'text' : 'password'} required style={{ ...inputStyle, borderColor: confirm && confirm !== password ? '#ef4444' : (confirm && confirm === password ? '#22c55e' : '#e2e8f0') }} placeholder="Re-enter new password" value={confirm} onChange={e => setConfirm(e.target.value)}
                                        onFocus={e => { e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                                        onBlur={e => { e.target.style.boxShadow = 'none'; }} />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}>
                                        {showConfirm ? <EyeOff style={{ width: '18px', height: '18px' }} /> : <Eye style={{ width: '18px', height: '18px' }} />}
                                    </button>
                                </div>
                                {confirm && confirm !== password && <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>Passwords do not match</p>}
                                {confirm && confirm === password && <p style={{ fontSize: '12px', color: '#16a34a', margin: 0 }}>✓ Passwords match</p>}
                            </div>

                            <button type="submit" disabled={status === 'loading'} className={status !== 'loading' ? 'btn-glow' : ''}
                                style={{ padding: '16px', borderRadius: '14px', background: status === 'loading' ? '#94a3b8' : 'linear-gradient(135deg, #2E7D32, #66BB6A)', color: 'white', fontWeight: 700, fontSize: '16px', border: 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <ShieldCheck style={{ width: '18px', height: '18px' }} />
                                {status === 'loading' ? 'Updating Password...' : 'Set New Password'}
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
