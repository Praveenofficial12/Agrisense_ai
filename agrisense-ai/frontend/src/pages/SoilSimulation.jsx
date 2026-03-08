import React, { useEffect, useState, useRef } from 'react';
import { Activity } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

// Realistic soil simulation helper
const simulateSoilReading = (prev) => ({
    moisture: Math.min(90, Math.max(15, (prev?.moisture || 50) + (Math.random() - 0.48) * 3)),
    ph: Math.min(8.5, Math.max(5.0, (prev?.ph || 6.8) + (Math.random() - 0.5) * 0.1)),
    temperature: Math.min(45, Math.max(10, (prev?.temperature || 28) + (Math.random() - 0.5) * 0.8)),
    humidity: Math.min(95, Math.max(30, (prev?.humidity || 65) + (Math.random() - 0.5) * 2)),
    npk_n: Math.min(100, Math.max(10, (prev?.npk_n || 45) + (Math.random() - 0.5) * 2)),
    npk_p: Math.min(80, Math.max(5, (prev?.npk_p || 32) + (Math.random() - 0.5) * 1.5)),
    npk_k: Math.min(90, Math.max(10, (prev?.npk_k || 58) + (Math.random() - 0.5) * 2)),
});

const Gauge = ({ value, max, color, label, unit }) => {
    const pct = Math.min(100, (value / max) * 100);
    return (
        <div style={{ background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>{label}</p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', marginBottom: '10px' }}>{value.toFixed(1)}<span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{unit}</span></p>
            <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
                <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }} style={{ height: '100%', background: color, borderRadius: '99px' }} />
            </div>
        </div>
    );
};

const SoilSimulation = () => {
    const [data, setData] = useState([]);
    const [currentReadings, setCurrentReadings] = useState(simulateSoilReading(null));
    const [isConnected, setIsConnected] = useState(false);
    const [isSimulating, setIsSimulating] = useState(true);
    const wsRef = useRef(null);
    const intervalRef = useRef(null);

    // Try WebSocket first, fall back to local simulation
    useEffect(() => {
        let wsOk = false;
        try {
            const ws = new WebSocket('ws://localhost:8000/ws/farm-123');
            wsRef.current = ws;

            ws.onopen = () => { wsOk = true; setIsConnected(true); setIsSimulating(false); };

            ws.onmessage = (event) => {
                const parsed = JSON.parse(event.data);
                const reading = {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    moisture: parsed.soil_moisture || parsed.moisture,
                    ph: parsed.ph,
                    temperature: parsed.temperature,
                    humidity: parsed.humidity,
                };
                setCurrentReadings(reading);
                setData(prev => { const nd = [...prev, reading]; if (nd.length > 15) nd.shift(); return nd; });
            };

            ws.onclose = () => { setIsConnected(false); };

            // Give WS 2 seconds to connect
            const timeout = setTimeout(() => {
                if (!wsOk) startLocalSimulation();
            }, 2000);

            return () => { clearTimeout(timeout); ws.close(); clearInterval(intervalRef.current); };
        } catch {
            startLocalSimulation();
        }
    }, []);

    const startLocalSimulation = () => {
        setIsSimulating(true);
        setIsConnected(false);
        let last = simulateSoilReading(null);
        setCurrentReadings(last);

        intervalRef.current = setInterval(() => {
            last = simulateSoilReading(last);
            const reading = {
                ...last,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            };
            setCurrentReadings(reading);
            setData(prev => { const nd = [...prev, reading]; if (nd.length > 15) nd.shift(); return nd; });
        }, 2000);
    };

    const recommendation = () => {
        if (currentReadings.moisture < 30) return { text: '⚠️ Low soil moisture! Irrigate immediately.', color: '#b91c1c', bg: '#fee2e2' };
        if (currentReadings.moisture > 80) return { text: '💧 Soil is over-saturated. Pause irrigation.', color: '#1d4ed8', bg: '#dbeafe' };
        if (currentReadings.ph < 5.5) return { text: '🧪 Soil is too acidic. Apply lime to raise pH.', color: '#92400e', bg: '#fef3c7' };
        if (currentReadings.temperature > 38) return { text: '🌡️ High soil temperature. Consider mulching.', color: '#7c2d12', bg: '#ffedd5' };
        return { text: '✅ Soil conditions are optimal. Continue current management.', color: '#166534', bg: '#dcfce7' };
    };

    const rec = recommendation();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>Live Soil Monitoring</h2>
                    <p style={{ color: '#64748b', margin: 0 }}>{isSimulating ? 'Simulated sensor data (AI-generated preview mode)' : 'Real-time WebSocket feed from IoT sensors'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '99px', background: isConnected ? '#dcfce7' : isSimulating ? '#fef9c3' : '#fee2e2', fontWeight: 700, fontSize: '13px', color: isConnected ? '#15803d' : isSimulating ? '#a16207' : '#dc2626' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isConnected ? '#22c55e' : isSimulating ? '#facc15' : '#ef4444', animation: (isConnected || isSimulating) ? 'pulse 1.5s infinite' : 'none', display: 'inline-block' }} />
                    {isConnected ? 'Live Connected' : isSimulating ? 'Simulation Mode' : 'Disconnected'}
                </div>
            </div>

            {/* Gauges */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px' }}>
                <Gauge value={currentReadings.moisture} max={100} color="linear-gradient(90deg, #3b82f6, #0ea5e9)" label="Soil Moisture" unit="%" />
                <Gauge value={currentReadings.temperature} max={50} color="linear-gradient(90deg, #f59e0b, #ef4444)" label="Temperature" unit="°C" />
                <Gauge value={currentReadings.ph} max={9} color="linear-gradient(90deg, #10b981, #059669)" label="pH Level" unit="" />
                <Gauge value={currentReadings.humidity} max={100} color="linear-gradient(90deg, #06b6d4, #3b82f6)" label="Humidity" unit="%" />
            </div>

            {/* NPK Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <Gauge value={currentReadings.npk_n || 45} max={100} color="linear-gradient(90deg, #a855f7, #7c3aed)" label="Nitrogen (N)" unit=" mg/kg" />
                <Gauge value={currentReadings.npk_p || 32} max={80} color="linear-gradient(90deg, #ec4899, #db2777)" label="Phosphorus (P)" unit=" mg/kg" />
                <Gauge value={currentReadings.npk_k || 58} max={90} color="linear-gradient(90deg, #f97316, #ea580c)" label="Potassium (K)" unit=" mg/kg" />
            </div>

            {/* Recommendation Banner */}
            <div style={{ background: rec.bg, border: `1px solid ${rec.color}30`, borderRadius: '14px', padding: '14px 20px', color: rec.color, fontWeight: 600, fontSize: '15px' }}>
                {rec.text}
            </div>

            {/* Chart */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-panel" style={{ padding: '24px', borderRadius: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <Activity style={{ width: '20px', height: '20px', color: '#3b82f6' }} />
                    <h3 style={{ fontWeight: 700, fontSize: '17px', color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: 0 }}>Moisture & Temperature Stream</h3>
                </div>
                <div style={{ height: '280px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                            <defs>
                                <linearGradient id="gMoisture" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }} />
                            <Area yAxisId="left" type="monotone" dataKey="moisture" name="Moisture %" stroke="#3b82f6" fill="url(#gMoisture)" strokeWidth={3} isAnimationActive={false} />
                            <Area yAxisId="right" type="monotone" dataKey="temperature" name="Temp °C" stroke="#f59e0b" fill="url(#gTemp)" strokeWidth={3} isAnimationActive={false} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default SoilSimulation;
