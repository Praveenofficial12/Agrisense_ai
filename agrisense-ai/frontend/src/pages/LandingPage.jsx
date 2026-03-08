import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Leaf, Activity, Droplets, Bug, Sprout, ArrowRight, ShieldCheck } from 'lucide-react';

const FloatingLeaves = () => {
    const [leaves, setLeaves] = useState([]);

    useEffect(() => {
        // Generate random leaves for background
        const generated = Array.from({ length: 15 }).map((_, i) => ({
            id: i,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${10 + Math.random() * 10}s`,
            scale: 0.5 + Math.random() * 0.5,
        }));
        setLeaves(generated);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {leaves.map((leaf) => (
                <div
                    key={leaf.id}
                    className="leaf-particle text-green-600/20"
                    style={{
                        left: leaf.left,
                        animationDelay: leaf.animationDelay,
                        animationDuration: leaf.animationDuration,
                        transform: `scale(${leaf.scale})`
                    }}
                >
                    <Leaf className="w-6 h-6" />
                </div>
            ))}
        </div>
    );
};

const LandingPage = () => {
    // Mouse Parallax Effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 150 };
    const mouseXSpring = useSpring(mouseX, springConfig);
    const mouseYSpring = useSpring(mouseY, springConfig);

    const handleMouseMove = (event) => {
        const { clientX, clientY } = event;
        const targetX = clientX - window.innerWidth / 2;
        const targetY = clientY - window.innerHeight / 2;
        mouseX.set(targetX);
        mouseY.set(targetY);
    };

    const translateX1 = useTransform(mouseXSpring, [-500, 500], [-30, 30]);
    const translateY1 = useTransform(mouseYSpring, [-500, 500], [-30, 30]);
    const translateX2 = useTransform(mouseXSpring, [-500, 500], [30, -30]);
    const translateY2 = useTransform(mouseYSpring, [-500, 500], [30, -30]);

    return (
        <div className="min-h-screen bg-slate-50 font-inter overflow-hidden">
            {/* Navigation */}
            <nav className="fixed w-full z-50 glass-panel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '80px', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Sprout className="h-8 w-8 text-[var(--color-primary-green)]" />
                            <span className="font-poppins font-bold text-2xl text-[var(--color-primary-green)]">AgriSense AI</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                            <div className="hidden lg:flex" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                <a href="#features" className="text-slate-600 hover:text-[var(--color-primary-green)] transition-colors font-semibold">Features</a>
                                <a href="#how-it-works" className="text-slate-600 hover:text-[var(--color-primary-green)] transition-colors font-semibold">How it Works</a>
                                <a href="#contact" className="text-slate-600 hover:text-[var(--color-primary-green)] transition-colors font-semibold">Contact</a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <Link to="/login" className="text-slate-600 hover:text-[var(--color-primary-green)] font-semibold transition-colors">Log in</Link>
                            <Link to="/register" className="btn-primary btn-glow">Get Started</Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden" onMouseMove={handleMouseMove}>
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-90"></div>

                    <FloatingLeaves />

                    {/* Animated Parallax Background elements */}
                    <motion.div style={{ x: translateX1, y: translateY1 }} className="absolute top-20 left-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></motion.div>
                    <motion.div style={{ x: translateX2, y: translateY2 }} className="absolute top-40 right-10 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float-delayed"></motion.div>
                    <motion.div style={{ x: translateX1, y: translateY2 }} className="absolute -bottom-8 left-40 w-80 h-80 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse-slow"></motion.div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="font-extrabold text-slate-900 tracking-tight font-poppins"
                        style={{ textAlign: 'center', margin: '0 auto', maxWidth: '800px', fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: '1.2' }}
                    >
                        Revolutionizing Smart Agriculture <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-green)] to-[var(--color-light-green)] inline-block mt-2">
                            with Artificial Intelligence
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-600 font-medium"
                        style={{ textAlign: 'center', margin: '24px auto 0', maxWidth: '600px', fontSize: '1.25rem' }}
                    >
                        Monitor Crops. Predict Risks. Optimize Yield. Experience the future of farming right from your dashboard.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '40px', flexWrap: 'wrap', width: '100%' }}
                    >
                        <Link to="/register" className="btn-primary btn-glow" style={{ padding: '16px 32px', minWidth: '220px' }}>
                            Get Started <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                        <a href="#features" className="btn-secondary btn-glow" style={{ padding: '14px 32px', minWidth: '220px' }}>
                            View Live Demo
                        </a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', gap: '32px', marginTop: '80px', flexWrap: 'wrap', maxWidth: '1000px', width: '100%' }}
                    >
                        <div className="glass-panel rounded-3xl transition-all duration-300 group" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1 1 250px' }}>
                            <h3 className="text-5xl font-black text-[var(--color-primary-green)] group-hover:scale-110 transition-transform origin-center">98%</h3>
                            <p className="text-slate-600 mt-4 font-semibold text-center text-lg">Disease Detection Accuracy</p>
                        </div>
                        <div className="glass-panel rounded-3xl transition-all duration-300 group" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1 1 250px' }}>
                            <h3 className="text-5xl font-black text-[var(--color-primary-green)] group-hover:scale-110 transition-transform origin-center">91%</h3>
                            <p className="text-slate-600 mt-4 font-semibold text-center text-lg">Pest Forecast Accuracy</p>
                        </div>
                        <div className="glass-panel rounded-3xl transition-all duration-300 group" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: '1 1 250px' }}>
                            <h3 className="text-5xl font-black text-[var(--color-primary-green)] group-hover:scale-110 transition-transform origin-center">35%</h3>
                            <p className="text-slate-600 mt-4 font-semibold text-center text-lg">Irrigation Optimization</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-poppins">Powerful Features</h2>
                        <p className="mt-4 text-xl text-slate-500">Everything you need to manage your farm efficiently.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginTop: '64px' }}>
                        {/* Feature 1 */}
                        <motion.div whileHover={{ y: -10 }} className="rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-green-100 transition-all duration-300" style={{ padding: '32px' }}>
                            <div className="bg-green-100 rounded-2xl mb-6" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Leaf className="w-7 h-7 text-[var(--color-primary-green)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Crop Disease Detection</h3>
                            <p className="text-slate-600 leading-relaxed">Upload a picture of your crop leaf and instantly identify diseases using our fine-tuned CNN model.</p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div whileHover={{ y: -10 }} className="rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-300" style={{ padding: '32px' }}>
                            <div className="bg-emerald-100 rounded-2xl mb-6" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Activity className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">NDVI Health Mapping</h3>
                            <p className="text-slate-600 leading-relaxed">Upload multi-spectral images to calculate NDVI scores and generate precise health heatmaps of your fields.</p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div whileHover={{ y: -10 }} className="rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-teal-100 transition-all duration-300" style={{ padding: '32px' }}>
                            <div className="bg-teal-100 rounded-2xl mb-6" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ShieldCheck className="w-7 h-7 text-teal-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Soil Intelligence Simulation</h3>
                            <p className="text-slate-600 leading-relaxed">Monitor real-time continuous simulations of NPK, pH, moisture, and temperature via live WebSocket feeds.</p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div whileHover={{ y: -10 }} className="rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-amber-100 transition-all duration-300" style={{ padding: '32px' }}>
                            <div className="bg-amber-100 rounded-2xl mb-6" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bug className="w-7 h-7 text-[var(--color-accent-yellow)]" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Pest Risk Prediction</h3>
                            <p className="text-slate-600 leading-relaxed">Forecast potential pest outbreaks using LSTM sequences based on historical microclimate and geospatial data.</p>
                        </motion.div>

                        {/* Feature 5 */}
                        <motion.div whileHover={{ y: -10 }} className="rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300" style={{ padding: '32px' }}>
                            <div className="bg-blue-100 rounded-2xl mb-6" style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Droplets className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Irrigation</h3>
                            <p className="text-slate-600 leading-relaxed">Receive automated recommendations on optimal watering schedules, drastically saving water resources.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section id="how-it-works" className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-poppins">How It Works</h2>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200 rounded-full"></div>

                        <div className="space-y-16">
                            {/* Step 1 */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between">
                                <div className="md:w-5/12 mb-8 md:mb-0 md:text-right">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Upload Crop Data</h3>
                                    <p className="text-slate-600">Securely upload standard or multi-spectral drone imagery to your personalized cloud dashboard.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-primary-green)] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                                    <span className="text-white font-bold">1</span>
                                </div>
                                <div className="md:w-5/12">
                                    <div className="glass-panel rounded-2xl h-48 bg-gradient-to-br from-green-50 to-green-100"></div>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between flex-col-reverse md:flex-row-reverse">
                                <div className="md:w-5/12 mt-8 md:mt-0 md:text-left">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">AI Analyzes Health</h3>
                                    <p className="text-slate-600">Our deep learning pipeline instantly segments the images, detecting early signs of disease or nutritional deficiencies.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-primary-green)] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                                    <span className="text-white font-bold">2</span>
                                </div>
                                <div className="md:w-5/12 w-full">
                                    <div className="glass-panel rounded-2xl h-48 bg-gradient-to-br from-emerald-50 to-emerald-100"></div>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between">
                                <div className="md:w-5/12 mb-8 md:mb-0 md:text-right">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">System Simulates Environment</h3>
                                    <p className="text-slate-600">Simulate complex environmental variables like soil pH and moisture in real-time, feeding insights into our predictive engine.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-primary-green)] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                                    <span className="text-white font-bold">3</span>
                                </div>
                                <div className="md:w-5/12 w-full">
                                    <div className="glass-panel rounded-2xl h-48 bg-gradient-to-br from-teal-50 to-teal-100"></div>
                                </div>
                            </div>

                            {/* Step 4 */}
                            <div className="relative flex flex-col md:flex-row items-center justify-between flex-col-reverse md:flex-row-reverse">
                                <div className="md:w-5/12 mt-8 md:mt-0 md:text-left">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Dashboard Generates Smart Insights</h3>
                                    <p className="text-slate-600">Actionable intelligence—from automated irrigation commands to fertilizer recommendations—is served on an intuitive dashboard.</p>
                                </div>
                                <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[var(--color-primary-green)] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
                                    <span className="text-white font-bold">4</span>
                                </div>
                                <div className="md:w-5/12 w-full">
                                    <div className="glass-panel rounded-2xl h-48 bg-gradient-to-br from-blue-50 to-blue-100"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── Contact Section ─── */}
            <section id="contact" style={{ padding: '100px 0', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1b5e20 0%, #2E7D32 50%, #388e3c 100%)' }}>
                {/* Background decorations */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

                <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 32px', position: 'relative', zIndex: 1 }}>
                    {/* Heading */}
                    <div style={{ textAlign: 'center', marginBottom: '64px' }}>
                        <span style={{ display: 'inline-block', padding: '6px 18px', borderRadius: '999px', background: 'rgba(255,255,255,0.12)', color: '#a7f3d0', fontSize: '13px', fontWeight: 700, marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>📬 Get In Touch</span>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, color: '#ffffff', fontFamily: 'Poppins, sans-serif', margin: '0 0 16px', lineHeight: 1.2 }}>
                            Ready to Transform Your Farm?
                        </h2>
                        <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.75)', maxWidth: '580px', margin: '0 auto' }}>
                            Join thousands of farmers already using AgriSense AI. Get early access and step into the future of precision agriculture.
                        </p>
                    </div>

                    {/* Contact Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px', marginBottom: '56px' }}>
                        {[
                            { icon: '📧', title: 'Email Us', value: 'hello@agrisense.ai', sub: 'We reply within 24 hours' },
                            { icon: '📱', title: 'WhatsApp', value: '+91 99449 24472', sub: 'Mon–Sat 9am–6pm IST' },
                            { icon: '🌐', title: 'Live Chat', value: 'Dashboard Support', sub: 'Available 24/7 for users' },
                        ].map((card) => (
                            <div key={card.title} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '28px 24px', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer' }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{card.icon}</div>
                                <p style={{ fontWeight: 700, color: 'white', fontSize: '15px', margin: '0 0 4px' }}>{card.title}</p>
                                <p style={{ fontWeight: 600, color: '#a7f3d0', fontSize: '14px', margin: '0 0 4px' }}>{card.value}</p>
                                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', margin: 0 }}>{card.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Email Form */}
                    <div style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '44px' }}>
                        <h3 style={{ textAlign: 'center', color: 'white', fontWeight: 700, fontSize: '22px', marginBottom: '32px', fontFamily: 'Poppins, sans-serif' }}>Send Us a Message</h3>
                        <form
                            onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                                <div>
                                    <label htmlFor="name" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Full Name</label>
                                    <input id="name" type="text" placeholder="John Doe" style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                        onFocus={(e) => e.target.style.borderColor = '#a7f3d0'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
                                </div>
                                <div>
                                    <label htmlFor="email" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Email Address</label>
                                    <input id="email" type="email" placeholder="john@farm.com" style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                        onFocus={(e) => e.target.style.borderColor = '#a7f3d0'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="subject" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Subject</label>
                                <input id="subject" type="text" placeholder="I want early access to AgriSense AI..." style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '14px', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#a7f3d0'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
                            </div>
                            <div>
                                <label htmlFor="message" style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Message</label>
                                <textarea id="message" rows={4} placeholder="Tell us about your farm..." style={{ width: '100%', padding: '13px 16px', borderRadius: '12px', border: '1.5px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.12)', color: 'white', outline: 'none', fontSize: '14px', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                                    onFocus={(e) => e.target.style.borderColor = '#a7f3d0'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button type="submit" className="btn-glow" style={{ padding: '16px 48px', borderRadius: '14px', background: 'white', color: '#2E7D32', fontWeight: 700, fontSize: '16px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                                    🚀 Send Message
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ─── Footer ─── */}
            <footer style={{ background: '#0f172a', color: '#94a3b8', fontFamily: 'Inter, sans-serif' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 32px 32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                        {/* Brand */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                                <Sprout style={{ width: '28px', height: '28px', color: '#66BB6A' }} />
                                <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '20px', color: 'white' }}>AgriSense AI</span>
                            </div>
                            <p style={{ fontSize: '14px', lineHeight: 1.7 }}>AI-powered precision farming platform for modern agriculture. Monitor, predict, and optimize your crops.</p>
                        </div>
                        {/* Product */}
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Product</h4>
                            {['Disease Detection', 'NDVI Mapping', 'Soil Simulation', 'Pest Risk', 'Smart Irrigation'].map(link => (
                                <div key={link} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.color = '#66BB6A'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>{link}</a>
                                </div>
                            ))}
                        </div>
                        {/* Company */}
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Company</h4>
                            {['About Us', 'Blog', 'Careers', 'Privacy Policy', 'Terms of Service'].map(link => (
                                <div key={link} style={{ marginBottom: '10px' }}>
                                    <a href="#" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' }}
                                        onMouseEnter={(e) => e.target.style.color = '#66BB6A'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>{link}</a>
                                </div>
                            ))}
                        </div>
                        {/* Social */}
                        <div>
                            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '16px', fontSize: '15px' }}>Follow Us</h4>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {['🐦 Twitter', '💼 LinkedIn', '📷 Instagram', '▶️ YouTube'].map(s => (
                                    <a key={s} href="#" style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textDecoration: 'none', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
                                        onMouseEnter={(e) => { e.target.style.borderColor = '#66BB6A'; e.target.style.color = '#66BB6A'; }}
                                        onMouseLeave={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.color = '#94a3b8'; }}>{s}</a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '28px', textAlign: 'center', fontSize: '14px' }}>
                        <p>© {new Date().getFullYear()} AgriSense AI. All rights reserved. Built with ❤️ for farmers worldwide.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

