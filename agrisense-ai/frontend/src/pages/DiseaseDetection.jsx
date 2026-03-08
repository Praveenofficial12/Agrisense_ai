import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, CheckCircle, AlertTriangle, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

// Mock AI responses for offline/fallback mode
const MOCK_RESULTS = [
    { class: 'Healthy', confidence: 97.2, treatment_suggestion: 'Your crop appears to be healthy. Continue current irrigation and fertilization schedule. Monitor weekly for any changes.' },
    { class: 'Early Blight', confidence: 89.4, treatment_suggestion: 'Early blight (Alternaria solani) detected. Apply copper-based fungicide weekly. Remove infected leaves immediately. Ensure adequate spacing for air circulation.' },
    { class: 'Leaf Rust', confidence: 84.7, treatment_suggestion: 'Leaf rust (Puccinia spp.) detected. Apply propiconazole or tebuconazole fungicide. Avoid overhead irrigation. Remove and destroy infected plant residue.' },
    { class: 'Bacterial Spot', confidence: 91.1, treatment_suggestion: 'Bacterial spot detected. Apply copper hydroxide spray. Avoid working among wet plants. Rotate crops next season. Destroy infected debris.' },
    { class: 'Powdery Mildew', confidence: 86.3, treatment_suggestion: 'Powdery mildew detected. Apply sulfur-based fungicide or neem oil. Improve air circulation. Reduce humidity. Water plants at the base, not from above.' },
];

const DiseaseDetection = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isDemoMode, setIsDemoMode] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setResult(null);
            setError('');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
            setResult(null);
            setError('');
        }
    };

    const clearImage = () => {
        setFile(null);
        setPreview(null);
        setResult(null);
        setError('');
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        // Simulate AI processing delay
        await new Promise(r => setTimeout(r, 1800));

        try {
            const response = await api.post('/ai/predict_disease', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 5000,
            });
            setResult(response.data);
            setIsDemoMode(false);
        } catch (err) {
            // Backend unreachable – use realistic mock fallback
            const mockResult = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
            setResult(mockResult);
            setIsDemoMode(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <div>
                <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: 'Poppins, sans-serif', margin: '0 0 6px' }}>AI Crop Disease Detection</h2>
                <p style={{ color: '#64748b', margin: 0 }}>Upload a leaf image to detect potential diseases using our fine-tuned CNN model.</p>
            </div>

            {isDemoMode && (
                <div style={{ background: '#fefce8', border: '1px solid #fde047', borderRadius: '12px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Zap style={{ width: '18px', height: '18px', color: '#ca8a04', flexShrink: 0 }} />
                    <p style={{ margin: 0, fontSize: '14px', color: '#854d0e', fontWeight: 500 }}>
                        <strong>Demo Mode:</strong> AI service is offline. Showing a simulated result for preview purposes.
                    </p>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
                {/* Upload Panel */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => !preview && document.getElementById('file-upload-dd').click()}
                        style={{
                            border: preview ? 'none' : '2px dashed #cbd5e1',
                            borderRadius: '16px',
                            height: '280px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: preview ? 'default' : 'pointer',
                            position: 'relative',
                            overflow: 'hidden',
                            background: preview ? 'transparent' : '#f8fafc',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => { if (!preview) e.currentTarget.style.borderColor = '#2E7D32'; }}
                        onMouseLeave={(e) => { if (!preview) e.currentTarget.style.borderColor = '#cbd5e1'; }}
                    >
                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                                <button onClick={clearImage} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                                    <X style={{ width: '16px', height: '16px', color: 'white' }} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div style={{ width: '64px', height: '64px', background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                                    <UploadCloud style={{ width: '32px', height: '32px', color: '#3b82f6' }} />
                                </div>
                                <h4 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>Click or Drop Image Here</h4>
                                <p style={{ fontSize: '13px', color: '#94a3b8' }}>JPG, PNG, WEBP up to 15MB</p>
                            </>
                        )}
                    </div>
                    <input id="file-upload-dd" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />

                    <button
                        onClick={handleAnalyze}
                        disabled={!file || loading}
                        className={file && !loading ? 'btn-glow' : ''}
                        style={{
                            marginTop: '20px',
                            width: '100%',
                            padding: '14px',
                            borderRadius: '12px',
                            fontWeight: 700,
                            fontSize: '15px',
                            color: 'white',
                            border: 'none',
                            cursor: !file || loading ? 'not-allowed' : 'pointer',
                            background: !file || loading ? '#94a3b8' : 'linear-gradient(135deg, #2E7D32, #66BB6A)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>⚙</motion.span>
                                Analyzing with CNN...
                            </span>
                        ) : 'Analyze Crop Image'}
                    </button>
                </motion.div>

                {/* Results Panel */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ padding: '32px', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: result.class === 'Healthy' ? '#dcfce7' : '#fee2e2', flexShrink: 0 }}>
                                        {result.class === 'Healthy'
                                            ? <CheckCircle style={{ width: '32px', height: '32px', color: '#16a34a' }} />
                                            : <AlertTriangle style={{ width: '32px', height: '32px', color: '#dc2626' }} />
                                        }
                                    </div>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>Detection Result</p>
                                        <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{result.class}</h2>
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span style={{ fontWeight: 600, color: '#475569' }}>Confidence Score</span>
                                        <span style={{ fontSize: '22px', fontWeight: 800, color: '#2E7D32' }}>{result.confidence}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }} transition={{ duration: 1, delay: 0.2 }} style={{ height: '100%', background: 'linear-gradient(90deg, #66BB6A, #2E7D32)', borderRadius: '99px' }} />
                                    </div>
                                </div>

                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '20px' }}>
                                    <h4 style={{ fontWeight: 700, color: '#92400e', marginBottom: '8px', fontFamily: 'Poppins, sans-serif' }}>💡 Treatment Recommendation</h4>
                                    <p style={{ color: '#78350f', lineHeight: 1.7, margin: 0, fontSize: '14px' }}>{result.treatment_suggestion}</p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <ImageIcon style={{ width: '72px', height: '72px', color: '#cbd5e1', margin: '0 auto 16px' }} />
                                <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 500 }}>Upload a leaf image and tap<br /><strong>Analyze</strong> to see CNN predictions here.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default DiseaseDetection;
