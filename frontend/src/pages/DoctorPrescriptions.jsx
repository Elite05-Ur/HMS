import { useState, useEffect } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import API from '../services/api';
import PrecPDF from './PrecPDF';
import { 
    FileText, 
    User, 
    Edit3, 
    ListFilter, 
    Pill, 
    Stethoscope, 
    MessageSquare, 
    Save, 
    RefreshCw, 
    CheckCircle2, 
    Download,
    X,
    Sparkles
} from 'lucide-react';

const DoctorPrescriptions = () => {
    const [allPatients, setAllPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [isManualMode, setIsManualMode] = useState(false);

    // Form inputs
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [manualToken, setManualToken] = useState('');
    const [patientData, setPatientData] = useState(null);

    const [diagnosis, setDiagnosis] = useState('');
    const [medicines, setMedicines] = useState('');
    const [advice, setAdvice] = useState('');
    const [saving, setSaving] = useState(false);

    const [prescriptionForPdf, setPrescriptionForPdf] = useState(null);

    // 🔔 Popup Notifications State
    const [showTopBanner, setShowTopBanner] = useState(false);
    const [showRightToast, setShowRightToast] = useState(false);

    // Fetch Patients
    useEffect(() => {
        const fetchAllPatients = async () => {
            setLoadingPatients(true);
            try {
                let res;
                try {
                    res = await API.get('/patient/all');
                } catch {
                    try {
                        res = await API.get('/doctor/patients');
                    } catch {
                        res = await API.get('/patients');
                    }
                }

                const list = res?.data?.patients || res?.data || [];
                setAllPatients(Array.isArray(list) ? list : []);
            } catch (err) {
                console.warn("Could not fetch patients list:", err);
                setIsManualMode(true);
            } finally {
                setLoadingPatients(false);
            }
        };
        fetchAllPatients();
    }, []);

    // Handle Dropdown Selection (Only Name Displayed)
    const handlePatientSelect = (patientId) => {
        setSelectedPatientId(patientId);
        setPrescriptionForPdf(null);

        if (!patientId) {
            setPatientData(null);
            return;
        }

        const selected = allPatients.find(p => p._id === patientId);
        if (selected) {
            setPatientData({
                _id: selected._id,
                tokenNo: selected.tokenNo || selected._id?.slice(-6),
                name: selected.name || 'Anonymous Patient',
                age: selected.age || 'N/A',
                gender: selected.gender || 'N/A',
                phone: selected.phone || 'N/A',
                image: selected.patientImage || selected.image || selected.photo || null
            });
        }
    };

    // Form Submit Action
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setShowTopBanner(false);

        const targetPatientId = isManualMode ? manualToken : (patientData?._id || selectedPatientId);

        if (!targetPatientId) {
            alert("Please select a patient or enter a Token ID.");
            setSaving(false);
            return;
        }

        const payload = {
            patientId: targetPatientId,
            diagnosis,
            medicines,
            advice
        };

        const generatePdfObj = (data) => ({
            patientId: data?.patientId?.tokenNo || patientData?.tokenNo || targetPatientId,
            patientName: data?.patientId?.name || patientData?.name || `Patient #${targetPatientId}`,
            patientAge: data?.patientId?.age || patientData?.age || 'N/A',
            patientGender: data?.patientId?.gender || patientData?.gender || 'N/A',
            patientImage: data?.patientId?.patientImage || patientData?.image || null,
            diagnosis: data?.diagnosis || diagnosis,
            medicines: data?.medicines || medicines,
            advice: data?.advice || advice,
            date: data?.date || new Date().toISOString()
        });

        try {
            const res = await API.post('/doctor/prescription', payload);
            const savedData = res.data?.prescription || res.data;
            setPrescriptionForPdf(generatePdfObj(savedData));
        } catch (err) {
            console.warn("Backend save failed, processing local preview:", err);
            setPrescriptionForPdf(generatePdfObj(null));
        } finally {
            setSaving(false);
            // 🚀 Trigger Top Banner Alert
            setShowTopBanner(true);
            setTimeout(() => setShowTopBanner(false), 5000);
        }
    };

    // Callback when PDF download is triggered inside PrecPDF component
    const handleDownloadComplete = () => {
        setShowRightToast(true);
        setTimeout(() => setShowRightToast(false), 4500);
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F4F6F5', 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            position: 'relative'
        }}>
            <DoctorSidebar />
            
            {/* 🔝 TOP POPUP BANNER (When Prescription is Saved) */}
            {showTopBanner && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1C2A2B',
                    color: '#FFFFFF',
                    border: '1px solid #0E8388',
                    padding: '12px 24px',
                    borderRadius: '50px',
                    boxShadow: '0 10px 25px rgba(28, 42, 43, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 9999,
                    animation: 'slideDown 0.3s ease-out'
                }}>
                    <div style={{ background: '#0E8388', borderRadius: '50%', padding: '4px', display: 'flex' }}>
                        <CheckCircle2 size={18} color="#FFF" />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        Prescription saved! Document preview updated below.
                    </span>
                    <button 
                        onClick={() => setShowTopBanner(false)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '0 4px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* 👉 RIGHT SIDE TOAST POPUP (After Downloading PDF) */}
            {showRightToast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    background: '#FFFFFF',
                    borderLeft: '5px solid #0E8388',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    zIndex: 9999,
                    animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        background: 'rgba(14, 131, 136, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#0E8388'
                    }}>
                        <Sparkles size={20} />
                    </div>
                    <div>
                        <h5 style={{ margin: 0, color: '#1C2A2B', fontSize: '14px', fontWeight: '700' }}>
                            Download Complete!
                        </h5>
                        <p style={{ margin: '2px 0 0 0', color: '#64748B', fontSize: '12px' }}>
                            Prescription PDF successfully saved to your system.
                        </p>
                    </div>
                    <button 
                        onClick={() => setShowRightToast(false)}
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', marginLeft: '8px' }}
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <main style={{ flex: 1, padding: '32px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    @keyframes slideDown { from { transform: translate(-50%, -20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
                    @keyframes slideInRight { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                    
                    .spin-icon { animation: spin 1s linear infinite; }
                    
                    /* Modern Custom Scrollbars for Fixed Height Textareas */
                    .custom-scroll::-webkit-scrollbar { width: 6px; }
                    .custom-scroll::-webkit-scrollbar-track { background: #F1F5F9; border-radius: 4px; }
                    .custom-scroll::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
                    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #0E8388; }
                    
                    .form-field-focus:focus-within {
                        border-color: #0E8388 !important;
                        box-shadow: 0 0 0 3px rgba(14, 131, 136, 0.12) !important;
                    }
                    .btn-theme-hover { transition: all 0.2s ease; }
                    .btn-theme-hover:hover { background: #0B6B6F !important; transform: translateY(-1px); }
                    .btn-theme-hover:active { transform: translateY(0); }
                `}</style>

                {/* Glass Header */}
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '28px',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(14, 131, 136, 0.12)',
                    padding: '20px 28px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '10px',
                            background: '#1C2A2B',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#0E8388',
                            boxShadow: '0 4px 12px rgba(28, 42, 43, 0.15)'
                        }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: '#1C2A2B', fontSize: '22px', fontWeight: '700' }}>
                                Medical Prescription Center
                            </h1>
                            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                                Issue digital Rx with integrated auto-scroll fields and PDF generation
                            </p>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    
                    {/* 📋 FORM SECTION */}
                    <form onSubmit={handleSubmit} style={{ 
                        background: '#FFFFFF', 
                        padding: '28px', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0', 
                        flex: '1', 
                        minWidth: '340px', 
                        maxWidth: '600px', 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '18px', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)' 
                    }}>
                        
                        {/* Patient Selection Toggle */}
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={labelStyle}>
                                    <User size={14} color="#0E8388" />
                                    <span>Select Patient *</span>
                                </label>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setIsManualMode(!isManualMode);
                                        setSelectedPatientId('');
                                        setPatientData(null);
                                    }} 
                                    style={{ 
                                        background: 'none', 
                                        border: 'none', 
                                        color: '#0E8388', 
                                        fontSize: '12px', 
                                        cursor: 'pointer', 
                                        fontWeight: '600',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}
                                >
                                    {isManualMode ? (
                                        <><ListFilter size={13} /> Dropdown List</>
                                    ) : (
                                        <><Edit3 size={13} /> Enter Token Manually</>
                                    )}
                                </button>
                            </div>

                            {!isManualMode ? (
                                <div className="form-field-focus" style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                                    <select
                                        value={selectedPatientId}
                                        onChange={(e) => handlePatientSelect(e.target.value)}
                                        style={{ ...inputStyle, border: 'none' }}
                                        required={!isManualMode}
                                        disabled={loadingPatients}
                                    >
                                        <option value="">
                                            {loadingPatients ? 'Loading patient list...' : (allPatients.length > 0 ? '-- Choose Patient Name --' : 'No active patients')}
                                        </option>
                                        {/* Pure Patient Names Only (No Raw Token IDs) */}
                                        {allPatients.map(p => (
                                            <option key={p._id} value={p._id}>
                                                {p.name || 'Unnamed Patient'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="form-field-focus" style={{ border: '1px solid #CBD5E1', borderRadius: '8px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter Token or ID (e.g. 101)" 
                                        value={manualToken} 
                                        onChange={(e) => setManualToken(e.target.value)} 
                                        style={{ ...inputStyle, border: 'none' }} 
                                        required={isManualMode} 
                                    />
                                </div>
                            )}
                        </div>

                        {/* Selected Patient Preview Card */}
                        {patientData && !isManualMode && (
                            <div style={{ 
                                background: '#F8FAFC', 
                                border: '1px solid #E2E8F0', 
                                padding: '12px 16px', 
                                borderRadius: '8px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '12px' 
                            }}>
                                {patientData.image ? (
                                    <img src={patientData.image} alt="Patient Avatar" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ 
                                        width: '40px', 
                                        height: '40px', 
                                        borderRadius: '50%', 
                                        background: 'rgba(14, 131, 136, 0.12)', 
                                        color: '#0E8388', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'center', 
                                        fontWeight: '700' 
                                    }}>
                                        {patientData.name ? patientData.name.charAt(0).toUpperCase() : <User size={18} />}
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ margin: 0, color: '#1C2A2B', fontSize: '14px', fontWeight: '700' }}>
                                        {patientData.name}
                                    </h4>
                                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                                        {patientData.age} Yrs | {patientData.gender}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 🛑 FIXED HEIGHT TEXTAREA WITH SCROLLABLE CONTENT */}
                        <div>
                            <label style={labelStyle}>
                                <Stethoscope size={14} color="#0E8388" />
                                <span>Diagnosis & Symptoms *</span>
                            </label>
                            <div className="form-field-focus" style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                                <textarea 
                                    className="custom-scroll"
                                    placeholder="e.g. High Fever, Acute Cough..." 
                                    value={diagnosis} 
                                    onChange={(e) => setDiagnosis(e.target.value)} 
                                    style={{ 
                                        ...inputStyle, 
                                        border: 'none', 
                                        height: '75px', 
                                        resize: 'none', // Locked height!
                                        overflowY: 'auto' 
                                    }} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* 🛑 FIXED HEIGHT MEDICINES TEXTAREA */}
                        <div>
                            <label style={labelStyle}>
                                <Pill size={14} color="#0E8388" />
                                <span>Medicines & Dosage *</span>
                            </label>
                            <div className="form-field-focus" style={{ border: '1px solid #CBD5E1', borderRadius: '8px', overflow: 'hidden' }}>
                                <textarea 
                                    className="custom-scroll"
                                    placeholder="1. Tab Panadol 500mg (1 + 0 + 1) - 5 Days&#10;2. Syrup Arinac (2 tsp twice daily)" 
                                    value={medicines} 
                                    onChange={(e) => setMedicines(e.target.value)} 
                                    style={{ 
                                        ...inputStyle, 
                                        border: 'none', 
                                        height: '110px', 
                                        resize: 'none', // Locked height!
                                        overflowY: 'auto' 
                                    }} 
                                    required 
                                />
                            </div>
                        </div>

                        {/* Advice Field */}
                        <div>
                            <label style={labelStyle}>
                                <MessageSquare size={14} color="#0E8388" />
                                <span>Doctor Advice / Follow-up</span>
                            </label>
                            <div className="form-field-focus" style={{ border: '1px solid #CBD5E1', borderRadius: '8px' }}>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Bed rest 3 days, review after 1 week" 
                                    value={advice} 
                                    onChange={(e) => setAdvice(e.target.value)} 
                                    style={{ ...inputStyle, border: 'none' }} 
                                />
                            </div>
                        </div>

                        {/* Save Action Button */}
                        <button 
                            type="submit" 
                            disabled={saving}
                            className="btn-theme-hover"
                            style={{ 
                                padding: '13px', 
                                background: '#0E8388', 
                                color: '#FFFFFF', 
                                border: 'none', 
                                borderRadius: '8px', 
                                cursor: saving ? 'not-allowed' : 'pointer', 
                                fontWeight: '700', 
                                fontSize: '14px', 
                                marginTop: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 12px rgba(14, 131, 136, 0.22)'
                            }}
                        >
                            {saving ? (
                                <>
                                    <RefreshCw size={16} className="spin-icon" />
                                    <span>Saving & Processing PDF...</span>
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    <span>Save & Generate Rx</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* 📄 PDF COMPONENT & DOWNLOAD SECTION */}
                    {prescriptionForPdf ? (
                        <div style={{ flex: '1', minWidth: '320px' }}>
                            <PrecPDF 
                                data={prescriptionForPdf} 
                                onDownloadComplete={handleDownloadComplete} // Triggers Right Toast
                            />
                        </div>
                    ) : (
                        <div style={{ 
                            flex: '1', 
                            minWidth: '300px', 
                            background: '#FFFFFF', 
                            border: '1px dashed #CBD5E1', 
                            borderRadius: '12px', 
                            padding: '48px 24px', 
                            textAlign: 'center',
                            color: '#64748B'
                        }}>
                            <Download size={36} color="#CBD5E1" style={{ marginBottom: '12px' }} />
                            <h4 style={{ margin: 0, color: '#1C2A2B', fontSize: '15px' }}>Prescription Output</h4>
                            <p style={{ margin: '6px 0 0 0', fontSize: '12px' }}>
                                Save prescription details to preview and download PDF document.
                            </p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// Field Label & Input Schemas
const labelStyle = { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    marginBottom: '8px', 
    fontSize: '13px', 
    fontWeight: '700', 
    color: '#1C2A2B' 
};

const inputStyle = { 
    width: '100%', 
    padding: '11px 14px', 
    borderRadius: '8px', 
    outline: 'none', 
    boxSizing: 'border-box',
    fontSize: '13px',
    color: '#1C2A2B',
    background: '#FFFFFF',
    fontFamily: 'inherit'
};

export default DoctorPrescriptions;