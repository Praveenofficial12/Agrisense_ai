import React, { useContext, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Lock, User, Sprout, Leaf, ArrowRight } from 'lucide-react';

const FloatingLeaves = () => {
    const [leaves, setLeaves] = useState([]);
    useEffect(() => {
        const generated = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${12 + Math.random() * 10}s`,
            scale: 0.4 + Math.random() * 0.5,
        }));
        setLeaves(generated);
    }, []);

    return (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="leaf-particle"
                    style={{
                        left: leaf.left,
                        animationDelay: leaf.animationDelay,
                        animationDuration: leaf.animationDuration,
                        transform: `scale(${leaf.scale})`,
                        color: 'rgba(34,197,94,0.18)',
                    }}
                >
                    <Leaf style={{ width: '24px', height: '24px' }} />
                </div>
            ))}
        </div>
    );
};

const Login = () => {
    const { user, login, loading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!loading && user) {
            navigate('/dashboard');
        }
    }, [user, loading, navigate]);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const springCfg = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mouseX, springCfg);
    const mouseYSpring = useSpring(mouseY, springCfg);
    const blobX = useTransform(mouseXSpring, [-500, 500], [-25, 25]);
    const blobY = useTransform(mouseYSpring, [-500, 500], [-25, 25]);
    const blobX2 = useTransform(mouseXSpring, [-500, 500], [25, -25]);
    const blobY2 = useTransform(mouseYSpring, [-500, 500], [25, -25]);

    const handleMouseMove = (e) => {
        mouseX.set(e.clientX - window.innerWidth / 2);
        mouseY.set(e.clientY - window.innerHeight / 2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        console.log('[Login] Form submitted for:', username);
        try {
            await login(username, password);
            console.log('[Login] Success! Token received. Redirecting to dashboard...');
            navigate('/dashboard');
        } catch (err) {
            console.error('[Login] Failed:', err);
            const msg = err?.response?.data?.detail;
            setError(msg || 'Invalid username or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };


    const inputStyle = {
        width: '100%',
        padding: '14px 16px 14px 46px',
        borderRadius: '12px',
        border: '1.5px solid #e2e8f0',
        outline: 'none',
        fontSize: '15px',
        background: 'rgba(255,255,255,0.7)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxSizing: 'border-box',
    };

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)',
                fontFamily: 'Inter, sans-serif',
                padding: '48px 16px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <FloatingLeaves />
            <motion.div style={{ x: blobX, y: blobY, position: 'absolute', top: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(134,239,172,0.5)', filter: 'blur(80px)', mixBlendMode: 'multiply' }} />
            <motion.div style={{ x: blobX2, y: blobY2, position: 'absolute', bottom: '-80px', right: '-80px', width: '360px', height: '360px', borderRadius: '50%', background: 'rgba(110,231,183,0.5)', filter: 'blur(80px)', mixBlendMode: 'multiply' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                style={{
                    width: '100%',
                    maxWidth: '440px',
                    position: 'relative',
                    zIndex: 10,
                    background: 'rgba(255,255,255,0.55)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    borderRadius: '28px',
                    padding: '44px 40px',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: 'linear-gradient(135deg, #bbf7d0, #6ee7b7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.08)' }}>
                        <Sprout style={{ width: '34px', height: '34px', color: '#2E7D32' }} />
                    </div>
                    <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Welcome Back</h2>
                    <p style={{ marginTop: '8px', color: '#64748b', fontSize: '15px' }}>Log in to your AgriSense AI dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {error && (
                        <div style={{ padding: '12px 16px', background: '#fee2e2', color: '#b91c1c', borderRadius: '10px', fontSize: '14px', fontWeight: 500 }}>{error}</div>
                    )}

                    {/* Username */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                            <input
                                type="text" required style={inputStyle} placeholder="Enter your username"
                                value={username} onChange={(e) => setUsername(e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#94a3b8', pointerEvents: 'none' }} />
                            <input
                                type="password" required style={inputStyle} placeholder="••••••••"
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                onFocus={(e) => { e.target.style.borderColor = '#2E7D32'; e.target.style.boxShadow = '0 0 0 3px rgba(46,125,50,0.12)'; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Link to="/forgot-password" style={{ fontSize: '13px', fontWeight: 600, color: '#2E7D32', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.target.style.color = '#1b5e20'} onMouseLeave={(e) => e.target.style.color = '#2E7D32'}>Forgot password?</Link>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-glow"
                        style={{
                            width: '100%',
                            padding: '16px',
                            borderRadius: '14px',
                            background: 'linear-gradient(135deg, #2E7D32, #66BB6A)',
                            color: 'white',
                            fontWeight: 700,
                            fontSize: '16px',
                            border: 'none',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.7 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                        {!isLoading && <ArrowRight style={{ width: '18px', height: '18px' }} />}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '28px' }}>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>
                        Don&apos;t have an account?{' '}
                        <Link to="/register" style={{ fontWeight: 700, color: '#2E7D32', textDecoration: 'none' }}
                            onMouseEnter={(e) => e.target.style.color = '#1b5e20'}
                            onMouseLeave={(e) => e.target.style.color = '#2E7D32'}
                        >Create one free</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;