import { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
    Upload, 
    Search, 
    RefreshCw, 
    FileText, 
    User, 
    Stethoscope, 
    Calendar, 
    Eye, 
    AlertCircle, 
    Loader2, 
    CheckCircle2, 
    X,
    FileUp
} from 'lucide-react';

const MedicalReports = () => {
    const [reports, setReports] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        reportTitle: '',
        testDate: '',
        labDoctor: ''
    });
    const [reportFile, setReportFile] = useState(null);

    // Toast Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        fetchInitialData();
    }, []);

    // Helper for Toast Notifications
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError('');

            const [repRes, patRes] = await Promise.all([
                API.get('/report/all').catch(() => ({ data: [] })),
                API.get('/patient/all').catch(() => ({ data: [] }))
            ]);

            setReports(Array.isArray(repRes.data) ? repRes.data : repRes.data.reports || []);
            setPatients(Array.isArray(patRes.data) ? patRes.data : patRes.data.patients || []);

        } catch (err) {
            console.error("Fetch Reports Error:", err);
            setError("Failed to load medical reports from server.");
        } finally {
            setLoading(false);
        }
    };

    // Upload Report Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.reportTitle || !reportFile) {
            showToast("Please fill all required fields and select a file!", "error");
            return;
        }

        try {
            setUploading(true);

            // Using FormData for file upload
            const uploadData = new FormData();
            uploadData.append('patientId', formData.patientId);
            uploadData.append('reportTitle', formData.reportTitle);
            uploadData.append('testDate', formData.testDate);
            uploadData.append('labDoctor', formData.labDoctor);
            uploadData.append('file', reportFile);

            await API.post('/report/upload', uploadData);

            showToast("Medical report uploaded successfully!", "success");
            setShowModal(false);
            setFormData({ patientId: '', reportTitle: '', testDate: '', labDoctor: '' });
            setReportFile(null);
            fetchInitialData();

        } catch (err) {
            console.error("Upload Error:", err);
            showToast(err.response?.data?.message || "Failed to upload report.", "error");
        } finally {
            setUploading(false);
        }
    };

    // Filter reports by Patient Name or Report Title
    const filteredReports = reports.filter(rep => {
        const pName = rep.patientId?.name || '';
        const title = rep.reportTitle || '';
        return pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
               title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F8FAFC',
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            color: '#1E293B',
            position: 'relative'
        }}>
            
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '36px 40px', boxSizing: 'border-box' }}>
                <style>{`
                    .search-input {
                        width: 100%;
                        padding: 10px 14px 10px 40px;
                        border-radius: 10px;
                        border: 1px solid #CBD5E1;
                        outline: none;
                        font-size: 13.5px;
                        background: #F8FAFC;
                        color: #0F172A;
                        transition: all 0.2s ease;
                    }
                    .search-input:focus {
                        border-color: #7A8F6E;
                        background: #FFFFFF;
                        box-shadow: 0 0 0 3px rgba(122, 143, 110, 0.15);
                    }

                    .form-input, .form-select {
                        padding: 10px 14px;
                        border-radius: 10px;
                        border: 1px solid #CBD5E1;
                        outline: none;
                        font-size: 13.5px;
                        background: #F8FAFC;
                        color: #0F172A;
                        transition: all 0.2s ease;
                        width: 100%;
                        box-sizing: border-box;
                    }
                    .form-input:focus, .form-select:focus {
                        border-color: #7A8F6E;
                        background: #FFFFFF;
                    }

                    .table-row {
                        transition: background 0.15s ease;
                    }
                    .table-row:hover {
                        background: #F1F5F9 !important;
                    }

                    .view-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 6px 14px;
                        background: #F0F4EF;
                        color: #5A6B50;
                        border: 1px solid #D6E0D2;
                        border-radius: 8px;
                        text-decoration: none;
                        font-weight: 700;
                        font-size: 12px;
                        transition: all 0.2s ease;
                    }
                    .view-btn:hover {
                        background: #7A8F6E;
                        color: #FFFFFF;
                        border-color: #7A8F6E;
                    }

                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }

                    @keyframes toastSlideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }

                    @keyframes spin { 
                        from { transform: rotate(0deg); } 
                        to { transform: rotate(360deg); } 
                    }
                    .spin-icon { animation: spin 0.8s linear infinite; }
                `}</style>

                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#5A6B50', fontSize: '26px', fontWeight: '700' }}>
                            Medical Reports & Records
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13.5px' }}>
                            Manage patient lab results, diagnostics, prescriptions, and radiology files
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={fetchInitialData}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: '#FFFFFF',
                                color: '#5A6B50',
                                borderRadius: '10px',
                                border: '1px solid #D6E0D2',
                                fontWeight: '600',
                                fontSize: '13.5px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <RefreshCw size={15} /> Refresh
                        </button>

                        <button 
                            onClick={() => setShowModal(true)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                background: '#7A8F6E',
                                color: '#FFFFFF',
                                borderRadius: '10px',
                                border: 'none',
                                fontWeight: '600',
                                fontSize: '13.5px',
                                boxShadow: '0 4px 12px rgba(122, 143, 110, 0.25)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Upload size={16} /> Upload New Report
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: '#FEF2F2', 
                        border: '1px solid #FECACA', 
                        color: '#991B1B', 
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        marginBottom: '20px',
                        fontSize: '13.5px'
                    }}>
                        <AlertCircle size={18} color="#EF4444" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Search Bar Container */}
                <div style={{ 
                    marginBottom: '24px', 
                    background: '#FFFFFF', 
                    padding: '16px 20px', 
                    borderRadius: '16px', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(122, 143, 110, 0.05)'
                }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by patient name or report title..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                {/* Reports Table Section */}
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '60px', 
                        color: '#5A6B50' 
                    }}>
                        <Loader2 size={32} className="spin-icon" />
                        <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600' }}>Loading Reports Library...</p>
                    </div>
                ) : (
                    <div style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '16px', 
                        border: '1px solid #E2E8F0', 
                        overflow: 'hidden', 
                        boxShadow: '0 4px 20px rgba(122, 143, 110, 0.05)' 
                    }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                                    <th style={thStyle}><FileText size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Report Title</th>
                                    <th style={thStyle}><User size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Patient Name</th>
                                    <th style={thStyle}><Stethoscope size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Lab Doctor / Tech</th>
                                    <th style={thStyle}><Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Test Date</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Document Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report._id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ ...tdStyle, fontWeight: '700', color: '#5A6B50' }}>
                                                {report.reportTitle}
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: '600', color: '#0F172A' }}>
                                                {report.patientId?.name || 'N/A'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#475569' }}>
                                                {report.labDoctor || 'Hospital Central Lab'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#64748B', fontSize: '13px' }}>
                                                {report.testDate ? new Date(report.testDate).toLocaleDateString([], { dateStyle: 'medium' }) : 'N/A'}
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {report.fileUrl ? (
                                                    <a 
                                                        href={report.fileUrl} 
                                                        target="_blank" 
                                                        rel="noreferrer"
                                                        className="view-btn"
                                                    >
                                                        <Eye size={14} /> View File
                                                    </a>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '12.5px' }}>No File Attached</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13.5px' }}>
                                            No medical reports found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- UPLOAD REPORT MODAL --- */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={{ ...modalContentStyle, maxWidth: '460px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#5A6B50' }}>
                                    Upload Lab Report
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                {/* Patient Selection */}
                                <div>
                                    <label style={labelStyle}>Select Patient *</label>
                                    <select 
                                        value={formData.patientId} 
                                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                        className="form-select"
                                        required
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.disease || 'Patient'})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Report Title */}
                                <div>
                                    <label style={labelStyle}>Report Title *</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. CBC Blood Test / Chest X-Ray" 
                                        value={formData.reportTitle}
                                        onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                                        className="form-input"
                                        required
                                    />
                                </div>

                                {/* Test Date */}
                                <div>
                                    <label style={labelStyle}>Test Conducted Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.testDate}
                                        onChange={(e) => setFormData({ ...formData, testDate: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                {/* Lab Doctor / Technician */}
                                <div>
                                    <label style={labelStyle}>Referred By Doctor / Lab Tech</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Dr. Sarah Ahmed / Pathology Lab" 
                                        value={formData.labDoctor}
                                        onChange={(e) => setFormData({ ...formData, labDoctor: e.target.value })}
                                        className="form-input"
                                    />
                                </div>

                                {/* Custom File Input */}
                                <div>
                                    <label style={labelStyle}>Select Document (PDF / Image) *</label>
                                    <div style={{
                                        border: '2px dashed #CBD5E1',
                                        borderRadius: '10px',
                                        padding: '16px',
                                        textAlign: 'center',
                                        background: '#F8FAFC',
                                        cursor: 'pointer',
                                        position: 'relative'
                                    }}>
                                        <input 
                                            type="file" 
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setReportFile(e.target.files[0])}
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                opacity: 0,
                                                cursor: 'pointer'
                                            }}
                                            required
                                        />
                                        <FileUp size={24} color="#7A8F6E" style={{ marginBottom: '6px' }} />
                                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#475569' }}>
                                            {reportFile ? reportFile.name : 'Click to browse file or drag & drop'}
                                        </p>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94A3B8' }}>
                                            PDF, PNG, JPG up to 10MB
                                        </p>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowModal(false)}
                                        style={{
                                            padding: '9px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid #CBD5E1',
                                            background: '#FFFFFF',
                                            color: '#475569',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button 
                                        type="submit"
                                        disabled={uploading}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            padding: '9px 18px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: '#7A8F6E',
                                            color: '#FFFFFF',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            boxShadow: '0 2px 8px rgba(122, 143, 110, 0.25)'
                                        }}
                                    >
                                        {uploading && <Loader2 size={14} className="spin-icon" />}
                                        {uploading ? 'Uploading...' : 'Submit Report'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* --- CUSTOM TOAST NOTIFICATION --- */}
                {toast.show && (
                    <div style={{
                        position: 'fixed',
                        bottom: '24px',
                        right: '24px',
                        zIndex: 1100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        background: toast.type === 'success' ? '#F0F4EF' : '#FEF2F2',
                        border: `1px solid ${toast.type === 'success' ? '#7A8F6E' : '#FECACA'}`,
                        color: toast.type === 'success' ? '#5A6B50' : '#991B1B',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        animation: 'toastSlideIn 0.3s ease-out forwards',
                        fontSize: '13.5px',
                        fontWeight: '600'
                    }}>
                        {toast.type === 'success' ? (
                            <CheckCircle2 size={18} color="#7A8F6E" />
                        ) : (
                            <AlertCircle size={18} color="#EF4444" />
                        )}
                        <span>{toast.message}</span>
                    </div>
                )}
            </main>
        </div>
    );
};

// Inline Style Definitions
const thStyle = {
    padding: '14px 18px',
    fontSize: '12.5px',
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
};

const tdStyle = {
    padding: '14px 18px',
    fontSize: '13.5px',
    verticalAlign: 'middle'
};

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'modalFadeIn 0.2s ease-out'
};

const modalContentStyle = {
    background: '#FFFFFF',
    borderRadius: '18px',
    padding: '24px 28px',
    width: '100%',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
};

const labelStyle = {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '6px'
};

export default MedicalReports;