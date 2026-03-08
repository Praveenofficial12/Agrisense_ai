import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const MOCK_ALERTS = [
    { id: 1, type: 'warning', icon: '🌿', title: 'Low Soil Moisture Detected', body: 'Field B soil moisture dropped to 28%. Irrigation recommended.', time: '2 min ago' },
    { id: 2, type: 'critical', icon: '🐛', title: 'High Pest Risk — Field A', body: 'LSTM model predicts 82% outbreak probability. Apply pesticide immediately.', time: '15 min ago' },
    { id: 3, type: 'info', icon: '🤖', title: 'AI Models Running Normally', body: 'Disease CNN, NDVI calculation, and Pest LSTM are all operational.', time: '30 min ago' },
    { id: 4, type: 'warning', icon: '🌡️', title: 'Temperature Spike', body: 'Field C temperature reached 38°C. Mulching recommended.', time: '1 hr ago' },
    { id: 5, type: 'info', icon: '💧', title: 'Auto-Irrigation Scheduled', body: 'Irrigation for Farm 3 scheduled for 6:00 PM based on moisture readings.', time: '2 hr ago' },
];

const typeStyle = {
    critical: { bg: '#fee2e2', border: '#fca5a5', color: '#dc2626', Icon: AlertTriangle },
    warning: { bg: '#fefce8', border: '#fde047', color: '#ca8a04', Icon: Bell },
    info: { bg: '#eff6ff', border: '#93c5fd', color: '#2563eb', Icon: Info },
};

const Alerts = () => {
    const [alerts, setAlerts] = useState(MOCK_ALERTS);
    const [filterType, setFilterType] = useState('all');

    const filtered = filterType === 'all' ? alerts : alerts.filter(a => a.type === filterType);

    const dismiss = (id) => setAlerts(prev => prev.filter(a => a.id !== id));
    const dismissAll = () => setAlerts([]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Poppins, sans-serif', color: '#0f172a', margin: '0 0 4px' }}>Farm Alerts</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>{alerts.length} active alerts for your farm.</p>
                </div>
                <button onClick={dismissAll} style={{ padding: '10px 20px', borderRadius: '10px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
                    Dismiss All
                </button>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'critical', 'warning', 'info'].map(t => (
                    <button key={t} onClick={() => setFilterType(t)}
                        style={{ padding: '8px 18px', borderRadius: '99px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', border: 'none', background: filterType === t ? '#7c3aed' : '#f5f3ff', color: filterType === t ? 'white' : '#7c3aed', transition: 'all 0.2s', textTransform: 'capitalize' }}>
                        {t === 'all' ? `All (${alerts.length})` : t === 'critical' ? `🔴 Critical` : t === 'warning' ? `🟡 Warning` : `🔵 Info`}
                    </button>
                ))}
            </div>

            {/* Alert Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <AnimatePresence>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '48px', background: 'white', borderRadius: '20px' }}>
                            <CheckCircle style={{ width: '56px', height: '56px', color: '#22c55e', display: 'block', margin: '0 auto 12px' }} />
                            <p style={{ fontWeight: 700, fontSize: '16px', color: '#0f172a', margin: '0 0 4px' }}>All Clear!</p>
                            <p style={{ color: '#94a3b8' }}>No alerts to show for this filter.</p>
                        </div>
                    ) : (
                        filtered.map(alert => {
                            const style = typeStyle[alert.type];
                            const TypeIcon = style.Icon;
                            return (
                                <motion.div key={alert.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                                    style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '18px 20px', borderRadius: '16px', background: 'white', border: `1px solid ${style.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: style.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
                                        {alert.icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                                            <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{alert.title}</p>
                                            <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: '12px' }}>{alert.time}</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#64748b', lineHeight: 1.6 }}>{alert.body}</p>
                                    </div>
                                    <button onClick={() => dismiss(alert.id)} style={{ width: '28px', height: '28px', borderRadius: '8px', border: 'none', background: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                                        <X style={{ width: '14px', height: '14px', color: '#94a3b8' }} />
                                    </button>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Alerts;
