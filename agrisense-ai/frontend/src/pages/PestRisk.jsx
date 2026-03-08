import React, { useState } from 'react';
import { Bug, Thermometer, Droplets, CloudRain, AlertTriangle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const getMockResult = (temp, humidity, moisture) => {
    const score = (temp / 45) * 0.4 + (humidity / 100) * 0.35 + (moisture / 90) * 0.25;
    if (score < 0.35) return { risk_level: 'Low', probability_score: 0.1 + score * 0.5, recommendation: 'Environmental conditions are favourable. No pest intervention needed. Continue regular monitoring.' };
    if (score < 0.6) return { risk_level: 'Medium', probability_score: 0.35 + score * 0.3, recommendation: 'Moderate risk detected. Consider preventive neem-based sprays. Monitor for aphids and whiteflies.' };
    return { risk_level: 'High', probability_score: 0.65 + score * 0.2, recommendation: 'High outbreak probability! Apply recommended insecticide immediately. Isolate heavily infected plants.' };
};

const PestRisk = () => {
    const [formData, setFormData] = useState({ temperature: 24, humidity: 65, soil_moisture: 45 });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const handlePredict = async () => {
        setLoading(true);
        setResult(null);
        await new Promise(r => setTimeout(r, 1500));
        try {
            const response = await api.post('/ai/predict_pest', formData, { timeout: 5000 });
            setResult(response.data);
            setIsDemoMode(false);
        } catch {
            setResult(getMockResult(formData.temperature, formData.humidity, formData.soil_moisture));
            setIsDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    const riskStyle = (level) => {
        if (level === 'Low') return { color: '#15803d', bg: '#dcfce7', border: '#86efac' };
        if (level === 'Medium') return { color: '#a16207', bg: '#fef9c3', border: '#fde047' };
        return { color: '#b91c1c', bg: '#fee2e2', border: '#fca5a5' };
    };

    const SliderField = ({ icon: Icon, iconColor, label, field, min, max, unit }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                <Icon style={{ width: '18px', height: '18px', color: iconColor }} />
                {label}
            </label>
            <input type="range" min={min} max={max} value={formData[field]}
                onChange={(e) => setFormData({ ...formData, [field]: Number(e.target.value) })}
                style={{ width: '100%', accentColor: '#2E7D32' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748b' }}>
                <span>{min}{unit}</span>
                <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '15px' }}>{formData[field]}{unit}</span>
                <span>{max}{unit}</span>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>Pest Risk Prediction</h2>
                <p style={{ color: '#64748b', margin: 0 }}>LSTM model predicting pest outbreak probability based on environmental microclimate data.</p>
            </div>

            {isDemoMode && (
                <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap style={{ width: '18px', height: '18px', color: '#ca8a04', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '14px', color: '#854d0e', fontWeight: 500 }}><strong>Demo Mode:</strong> AI service offline. Showing locally-computed prediction.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                {/* Input Panel */}
                <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <h3 style={{ fontWeight: 700, color: '#1e293b', fontFamily: 'Poppins, sans-serif', fontSize: '17px', margin: 0 }}>Input Environmental Data</h3>
                    <SliderField icon={Thermometer} iconColor="#f59e0b" label="Temperature" field="temperature" min={10} max={45} unit="°C" />
                    <SliderField icon={CloudRain} iconColor="#06b6d4" label="Humidity" field="humidity" min={20} max={100} unit="%" />
                    <SliderField icon={Droplets} iconColor="#3b82f6" label="Soil Moisture" field="soil_moisture" min={10} max={90} unit="%" />

                    <button onClick={handlePredict} disabled={loading} className={!loading ? 'btn-glow' : ''}
                        style={{ marginTop: '8px', padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1e293b, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? (<><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⚙</motion.span> Running LSTM Model...</>) : (<><Bug style={{ width: '18px', height: '18px' }} /> Predict Pest Risk</>)}
                    </button>
                </div>

                {/* Result Panel */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel"
                    style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', minHeight: '360px' }}>
                    <Bug style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '160px', height: '160px', color: '#f1f5f9', zIndex: 0 }} />
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Forecast Result</p>
                                {(() => {
                                    const s = riskStyle(result.risk_level);
                                    return (
                                        <div style={{ padding: '12px 36px', borderRadius: '14px', background: s.bg, border: `2px solid ${s.border}`, color: s.color, fontWeight: 800, fontSize: '26px' }}>
                                            {result.risk_level} Risk
                                        </div>
                                    );
                                })()}
                                <div style={{ width: '100%', background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, color: '#475569' }}>Outbreak Probability</span>
                                    <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a' }}>{(result.probability_score * 100).toFixed(1)}%</span>
                                </div>
                                {result.recommendation && (
                                    <div style={{ width: '100%', padding: '16px', borderRadius: '14px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>
                                        💡 {result.recommendation}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', zIndex: 1 }}>
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                    <Bug style={{ width: '38px', height: '38px', color: '#94a3b8' }} />
                                </div>
                                <p style={{ color: '#94a3b8', fontWeight: 500, fontSize: '15px' }}>Adjust inputs and run the<br />prediction model to see results.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default PestRisk;
