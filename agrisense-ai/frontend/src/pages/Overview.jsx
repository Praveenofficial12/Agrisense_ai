import React, { useEffect, useState, useContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Droplets, Thermometer, ShieldCheck, Activity, Bug, TrendingUp, ArrowUpRight } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import api from '../services/api';

const StatCard = ({ title, value, sub, icon: Icon, gradient, iconBg, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}
        className="glass-panel"
        style={{ padding: '24px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', transition: 'all 0.3s ease', cursor: 'default', position: 'relative', overflow: 'hidden' }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
    >
        <div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#94a3b8', margin: '0 0 6px' }}>{title}</p>
            <h3 style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', margin: '0 0 6px', lineHeight: 1 }}>{value}</h3>
            {sub && <p style={{ fontSize: '12px', color: '#22c55e', fontWeight: 600, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}><ArrowUpRight style={{ width: '14px', height: '14px' }} />{sub}</p>}
        </div>
        <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon style={{ width: '26px', height: '26px' }} />
        </div>
    </motion.div>
);

const INITIAL_DATA = Array.from({ length: 8 }, (_, i) => ({
    name: `${10 + i}:00`,
    moisture: 40 + Math.random() * 20,
    temperature: 22 + Math.random() * 8,
}));

const WEEKLY = [
    { day: 'Mon', healthy: 85, infected: 15 },
    { day: 'Tue', healthy: 80, infected: 20 },
    { day: 'Wed', healthy: 88, infected: 12 },
    { day: 'Thu', healthy: 92, infected: 8 },
    { day: 'Fri', healthy: 78, infected: 22 },
    { day: 'Sat', healthy: 90, infected: 10 },
    { day: 'Sun', healthy: 95, infected: 5 },
];

const ALERTS = [
    { icon: '🌿', text: 'Soil moisture slightly low (38%) in Field B', time: '2 min ago', color: '#f59e0b' },
    { icon: '🐛', text: 'Low pest risk detected — no action needed', time: '15 min ago', color: '#22c55e' },
    { icon: '🌡️', text: 'Temperature spike to 35°C observed', time: '1 hr ago', color: '#ef4444' },
    { icon: '💧', text: 'Auto-irrigation scheduled for 6:00 PM', time: '2 hr ago', color: '#3b82f6' },
];

const Overview = () => {
    const { user } = useContext(AuthContext);
    const [chartData, setChartData] = useState(INITIAL_DATA);
    const [stats, setStats] = useState({ health: 92, moisture: 45, pest: 'Low', temp: 27 });

    // Live-update chart and stats every 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setChartData(prev => {
                const last = prev[prev.length - 1];
                const now = new Date();
                const newPoint = {
                    name: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
                    moisture: Math.min(90, Math.max(20, last.moisture + (Math.random() - 0.48) * 3)),
                    temperature: Math.min(45, Math.max(10, last.temperature + (Math.random() - 0.5) * 1.5)),
                };
                const nd = [...prev, newPoint];
                if (nd.length > 10) nd.shift();
                return nd;
            });
            setStats(prev => ({
                health: Math.min(100, Math.max(70, prev.health + (Math.random() - 0.5) * 1.5)),
                moisture: Math.min(90, Math.max(20, prev.moisture + (Math.random() - 0.5) * 2)),
                pest: prev.pest,
                temp: Math.min(45, Math.max(15, prev.temp + (Math.random() - 0.5) * 0.5)),
            }));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Greeting */}
            <div>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>
                    Welcome back, {user?.username} 👋
                </h2>
                <p style={{ color: '#64748b', margin: 0 }}>Here's what's happening on your farm today — {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <StatCard title="Crop Health Score" value={`${stats.health.toFixed(0)}%`} sub="+2% from yesterday" icon={ShieldCheck} iconBg="#dcfce7" delay={0.1} />
                <StatCard title="Avg. Soil Moisture" value={`${stats.moisture.toFixed(0)}%`} sub="Optimal range" icon={Droplets} iconBg="#dbeafe" delay={0.2} />
                <StatCard title="Pest Risk Level" value={stats.pest} sub="No outbreak detected" icon={Bug} iconBg="#f0fdf4" delay={0.3} />
                <StatCard title="Current Temp" value={`${stats.temp.toFixed(1)}°C`} sub="Within safe range" icon={Thermometer} iconBg="#fef9c3" delay={0.4} />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {/* Soil Trends Chart */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <Activity style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Live Soil Trends</h3>
                        <span style={{ marginLeft: 'auto', fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '2px 10px', borderRadius: '99px', fontWeight: 600 }}>● LIVE</span>
                    </div>
                    <div style={{ height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                                <Line yAxisId="left" type="monotone" dataKey="moisture" name="Moisture %" stroke="#3b82f6" strokeWidth={3} dot={false} isAnimationActive={false} />
                                <Line yAxisId="right" type="monotone" dataKey="temperature" name="Temp °C" stroke="#f59e0b" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Weekly Crop Health */}
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                        <TrendingUp style={{ width: '20px', height: '20px', color: '#2E7D32' }} />
                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0, fontFamily: 'Poppins, sans-serif' }}>Weekly Crop Health</h3>
                    </div>
                    <div style={{ height: '260px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={WEEKLY} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }} />
                                <Legend />
                                <Bar dataKey="healthy" name="Healthy %" fill="#22c55e" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="infected" name="Infected %" fill="#f87171" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Recent Alerts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="glass-panel" style={{ padding: '24px', borderRadius: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 16px' }}>Recent Farm Alerts</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {ALERTS.map((alert, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #f1f5f9', transition: 'all 0.2s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'} onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}>
                            <span style={{ fontSize: '22px', flexShrink: 0 }}>{alert.icon}</span>
                            <p style={{ margin: 0, fontSize: '14px', color: '#475569', fontWeight: 500, flex: 1 }}>{alert.text}</p>
                            <span style={{ fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0 }}>{alert.time}</span>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: alert.color, flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Overview;
