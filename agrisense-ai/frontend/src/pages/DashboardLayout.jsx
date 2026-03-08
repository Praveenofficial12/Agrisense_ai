import React, { useContext } from 'react';
import { NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Map,
    Bug,
    Activity,
    ShieldAlert,
    LogOut,
    Sprout,
    Image,
    ChevronRight
} from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';

const navItems = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
    { name: 'Disease Detection', path: '/dashboard/disease-detection', icon: Image },
    { name: 'NDVI Mapping', path: '/dashboard/ndvi', icon: Map },
    { name: 'Soil Simulation', path: '/dashboard/soil', icon: Activity },
    { name: 'Pest Risk', path: '/dashboard/pest', icon: Bug },
    { name: 'Alerts', path: '/dashboard/alerts', icon: ShieldAlert },
];

const pageTitles = {
    '/dashboard': 'Overview',
    '/dashboard/disease-detection': 'Disease Detection',
    '/dashboard/ndvi': 'NDVI Mapping',
    '/dashboard/soil': 'Soil Simulation',
    '/dashboard/pest': 'Pest Risk',
    '/dashboard/alerts': 'Alerts',
};

const DashboardLayout = () => {
    const { user, logout, loading } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    console.log('[DashboardLayout] user:', user, 'loading:', loading);

    // 🔄 Loading State
    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f8fafc',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                color: '#2E7D32'
            }}>
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ marginRight: '12px' }}
                >
                    <Sprout style={{ width: '32px', height: '32px' }} />
                </motion.div>
                Loading AgriSense...
            </div>
        );
    }

    // 🔐 Protected Route Guard
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        );
    }

    const currentTitle = pageTitles[location.pathname] || 'Dashboard';
    const username = user?.username || 'User';
    const role = user?.role || 'Farmer';

    const handleLogout = () => {
        logout();              // should clear token + user
        navigate('/login', { replace: true });
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            background: '#f8fafc',
            fontFamily: 'Inter, sans-serif',
            overflow: 'hidden'
        }}>

            {/* ───────── Sidebar ───────── */}
            <aside style={{
                width: '260px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '4px 0 24px rgba(0,0,0,0.04)'
            }}>

                {/* Logo */}
                <div>
                    <div style={{
                        height: '72px',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 28px',
                        borderBottom: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <Sprout style={{ width: '30px', height: '30px', color: '#2E7D32', marginRight: '10px' }} />
                        <span style={{
                            fontFamily: 'Poppins',
                            fontWeight: 800,
                            fontSize: '20px',
                            color: '#2E7D32'
                        }}>
                            AgriSense AI
                        </span>
                    </div>

                    {/* Navigation */}
                    <nav style={{
                        padding: '16px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px'
                    }}>
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end={item.exact}
                                    style={{ textDecoration: 'none' }}
                                >
                                    {({ isActive }) => (
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '11px 16px',
                                            borderRadius: '12px',
                                            fontWeight: isActive ? 700 : 500,
                                            fontSize: '14px',
                                            color: isActive ? '#fff' : '#475569',
                                            background: isActive
                                                ? 'linear-gradient(135deg, #2E7D32, #66BB6A)'
                                                : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}>
                                            <Icon style={{
                                                width: '18px',
                                                height: '18px',
                                                marginRight: '12px'
                                            }} />
                                            {item.name}
                                            {isActive && (
                                                <ChevronRight
                                                    style={{
                                                        width: '16px',
                                                        height: '16px',
                                                        marginLeft: 'auto'
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>

                {/* User Section */}
                <div style={{
                    padding: '16px 12px',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        background: 'rgba(241,245,249,0.8)',
                        marginBottom: '8px'
                    }}>
                        <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #bbf7d0, #6ee7b7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: '#166534',
                            marginRight: '12px'
                        }}>
                            {username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p style={{ margin: 0, fontWeight: 700 }}>{username}</p>
                            <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                                {role}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '11px',
                            borderRadius: '12px',
                            border: '1px solid rgba(239,68,68,0.3)',
                            background: 'transparent',
                            color: '#ef4444',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        <LogOut style={{ width: '16px', marginRight: '6px' }} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* ───────── Main Area ───────── */}
            <main style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
            }}>

                {/* Header */}
                <header style={{
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 32px',
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <h1 style={{
                        fontSize: '22px',
                        fontWeight: 800,
                        fontFamily: 'Poppins',
                        margin: 0
                    }}>
                        {currentTitle}
                    </h1>
                </header>

                {/* Content */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '32px'
                }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;