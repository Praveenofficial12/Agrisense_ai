import React, { useState } from 'react';
import { UploadCloud, Layers, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

const getMockNdvi = () => {
    const value = (Math.random() * 1.4 - 0.2).toFixed(3);
    const v = parseFloat(value);
    let classification, color;
    if (v < 0) { classification = 'Water / Non-Vegetated'; color = '#3b82f6'; }
    else if (v < 0.2) { classification = 'Barren / Sparse Vegetation'; color = '#f59e0b'; }
    else if (v < 0.4) { classification = 'Moderate Vegetation'; color = '#84cc16'; }
    else if (v < 0.6) { classification = 'Healthy Vegetation'; color = '#22c55e'; }
    else { classification = 'Dense Thriving Forest'; color = '#15803d'; }
    return { ndvi_value: v.toFixed(3), health_classification: classification, color };
};

const NdviMapping = () => {
    const [redFile, setRedFile] = useState(null);
    const [nirFile, setNirFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [isDemoMode, setIsDemoMode] = useState(false);

    const handleAnalyze = async () => {
        if (!redFile || !nirFile) return;
        setLoading(true);
        setResult(null);
        await new Promise(r => setTimeout(r, 2000));
        const formData = new FormData();
        formData.append('red_image', redFile);
        formData.append('nir_image', nirFile);
        try {
            const response = await api.post('/ai/calculate_ndvi', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 5000,
            });
            setResult(response.data);
            setIsDemoMode(false);
        } catch {
            setResult(getMockNdvi());
            setIsDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    const FileInput = ({ label, color, labelColor, bgColor, file, setFile }) => (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', transition: 'all 0.2s', cursor: 'pointer' }}>
            <h4 style={{ fontWeight: 700, color: '#1e293b', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: color, display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                {label}
            </h4>
            <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{ border: '2px dashed', borderColor: file ? color : '#e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'center', background: file ? bgColor : '#f8fafc', transition: 'all 0.2s' }}>
                    {file ? (
                        <span style={{ fontWeight: 600, color: labelColor, fontSize: '14px' }}>✓ {file.name}</span>
                    ) : (
                        <>
                            <UploadCloud style={{ width: '28px', height: '28px', color: '#94a3b8', display: 'block', margin: '0 auto 8px' }} />
                            <span style={{ fontSize: '13px', color: '#94a3b8' }}>Click to select image</span>
                        </>
                    )}
                </div>
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} />
            </label>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 4px' }}>NDVI Health Mapping</h2>
                <p style={{ color: '#64748b', margin: 0 }}>Calculate vegetation health index from RED and NIR multispectral imagery.</p>
            </div>

            {isDemoMode && (
                <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap style={{ width: '18px', height: '18px', color: '#ca8a04', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '14px', color: '#854d0e', fontWeight: 500 }}><strong>Demo Mode:</strong> AI service offline. Showing a simulated NDVI calculation.</p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
                {/* Upload Column */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <FileInput label="🔴 RED Band Image" color="#ef4444" labelColor="#b91c1c" bgColor="#fef2f2" file={redFile} setFile={setRedFile} />
                    <FileInput label="🟣 NIR Band Image" color="#7c3aed" labelColor="#5b21b6" bgColor="#f5f3ff" file={nirFile} setFile={setNirFile} />
                    <button
                        onClick={handleAnalyze}
                        disabled={!redFile || !nirFile || loading}
                        className={redFile && nirFile && !loading ? 'btn-glow' : ''}
                        style={{ padding: '14px', borderRadius: '12px', fontWeight: 700, fontSize: '15px', color: 'white', border: 'none', cursor: (!redFile || !nirFile || loading) ? 'not-allowed' : 'pointer', background: (!redFile || !nirFile || loading) ? '#94a3b8' : 'linear-gradient(135deg, #2E7D32, #66BB6A)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        {loading ? (<><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⚙</motion.span> Processing Raster...</>) : (<><Layers style={{ width: '18px', height: '18px' }} /> Generate NDVI Heatmap</>)}
                    </button>
                </motion.div>

                {/* Result Column */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel"
                    style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '340px' }}>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {/* NDVI Heatmap Visual */}
                                <div style={{ height: '160px', borderRadius: '16px', background: 'linear-gradient(90deg, #ef4444, #f97316, #facc15, #84cc16, #22c55e, #15803d)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
                                    <Layers style={{ position: 'absolute', width: '64px', height: '64px', color: 'rgba(255,255,255,0.2)' }} />
                                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', padding: '8px 24px', borderRadius: '99px', fontWeight: 800, color: '#0f172a', zIndex: 1, fontSize: '17px' }}>
                                        NDVI: {result.ndvi_value}
                                    </motion.div>
                                </div>

                                {/* Classification */}
                                <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vegetation Classification</p>
                                    <p style={{ fontSize: '20px', fontWeight: 800, color: result.color || '#2E7D32', margin: 0 }}>{result.health_classification}</p>
                                </div>

                                {/* Scale Legend */}
                                <div>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>NDVI SCALE</p>
                                    <div style={{ height: '10px', borderRadius: '99px', background: 'linear-gradient(90deg, #3b82f6, #ef4444, #facc15, #84cc16, #15803d)' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                                        <span>-1 (Water)</span><span>0 (Barren)</span><span>+1 (Dense)</span>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
                                <Layers style={{ width: '64px', height: '64px', color: '#cbd5e1', display: 'block', margin: '0 auto 16px' }} />
                                <p style={{ color: '#94a3b8', fontWeight: 500 }}>Upload RED and NIR band images<br />to generate NDVI heatmap.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default NdviMapping;
