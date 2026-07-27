import { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
    Plus, 
    Search, 
    Filter, 
    RefreshCw, 
    CalendarCheck2, 
    User, 
    Stethoscope, 
    Clock, 
    FileText, 
    CheckCircle2, 
    XCircle, 
    AlertCircle, 
    Loader2, 
    X,
    Hash
} from 'lucide-react';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Toast & Custom Popups States
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [statusModal, setStatusModal] = useState({ show: false, id: null, status: '' });
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        appointmentDate: '',
        reason: ''
    });

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

    // Fetch Appointments, Patients & Doctors for Dropdowns
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            setError('');

            const [appRes, patRes, docRes] = await Promise.all([
                API.get('/appointment/all').catch(() => ({ data: [] })),
                API.get('/patient/all').catch(() => ({ data: [] })),
                API.get('/doctor/all').catch(() => ({ data: [] }))
            ]);

            setAppointments(Array.isArray(appRes.data) ? appRes.data : appRes.data.appointments || []);
            setPatients(Array.isArray(patRes.data) ? patRes.data : patRes.data.patients || []);
            setDoctors(Array.isArray(docRes.data) ? docRes.data : docRes.data.doctors || []);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError("Failed to load appointments data from backend.");
        } finally {
            setLoading(false);
        }
    };

    // Handle Book Appointment Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.patientId || !formData.doctorId || !formData.appointmentDate) {
            showToast("Please fill all required fields!", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            await API.post('/appointment/create', formData);
            
            showToast("Appointment booked successfully!", "success");
            setShowModal(false);
            setFormData({ patientId: '', doctorId: '', appointmentDate: '', reason: '' });
            fetchInitialData(); 
        } catch (err) {
            console.error("Booking Error:", err);
            showToast(err.response?.data?.message || "Failed to book appointment.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open Status Confirmation Dialog
    const confirmStatusChange = (id, status) => {
        setStatusModal({ show: true, id, status });
    };

    // Execute Update Status API
    const handleExecuteStatusChange = async () => {
        if (!statusModal.id || !statusModal.status) return;

        try {
            setIsUpdatingStatus(true);
            await API.put(`/appointment/status/${statusModal.id}`, { status: statusModal.status });
            
            showToast(`Appointment marked as ${statusModal.status}!`, "success");
            setStatusModal({ show: false, id: null, status: '' });
            fetchInitialData();
        } catch (err) {
            console.error("Status Update Error:", err);
            setStatusModal({ show: false, id: null, status: '' });
            showToast("Failed to update appointment status.", "error");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Filter appointments by search query & status drop-down
    const filteredAppointments = appointments.filter((app) => {
        const patientName = app.patientId?.name?.toLowerCase() || '';
        const doctorName = app.doctorId?.name?.toLowerCase() || '';
        const reason = app.reason?.toLowerCase() || '';
        
        const matchesSearch = patientName.includes(searchQuery.toLowerCase()) || 
                              doctorName.includes(searchQuery.toLowerCase()) || 
                              reason.includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === 'all' || app.status === statusFilter;

        return matchesSearch && matchesStatus;
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

                    .filter-select, .form-input {
                        padding: 10px 14px;
                        border-radius: 10px;
                        border: 1px solid #CBD5E1;
                        outline: none;
                        font-size: 13.5px;
                        background: #F8FAFC;
                        color: #0F172A;
                        transition: all 0.2s ease;
                    }
                    .filter-select:focus, .form-input:focus {
                        border-color: #7A8F6E;
                        background: #FFFFFF;
                    }

                    .table-row {
                        transition: background 0.15s ease;
                    }
                    .table-row:hover {
                        background: #F1F5F9 !important;
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
                            Appointments Management
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13.5px' }}>
                            Schedule new consultations and manage daily patient-doctor appointments
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
                            <Plus size={16} /> Book New Appointment
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

                {/* Search & Status Filters Bar */}
                <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    marginBottom: '24px', 
                    background: '#FFFFFF', 
                    padding: '18px 20px', 
                    borderRadius: '16px', 
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 4px 20px rgba(122, 143, 110, 0.05)'
                }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by patient, doctor, or reason..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                            style={{ paddingLeft: '36px' }}
                        >
                            <option value="all">All Statuses</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                        <Filter size={15} color="#7A8F6E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>

                {/* Appointments Table */}
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
                        <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600' }}>Loading Appointments...</p>
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
                                    <th style={thStyle}><Hash size={13} style={{ inlineSize: '13px', verticalAlign: 'middle', marginRight: '4px' }} /> Token</th>
                                    <th style={thStyle}><User size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Patient Name</th>
                                    <th style={thStyle}><Stethoscope size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Doctor</th>
                                    <th style={thStyle}><Clock size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Date & Time</th>
                                    <th style={thStyle}><FileText size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} /> Reason / Checkup</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAppointments.length > 0 ? (
                                    filteredAppointments.map((app) => (
                                        <tr key={app._id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ ...tdStyle, fontWeight: '700', color: '#5A6B50' }}>
                                                #{app.tokenNumber || '1'}
                                            </td>
                                            <td style={{ ...tdStyle, fontWeight: '600', color: '#0F172A' }}>
                                                {app.patientId?.name || 'N/A'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#475569' }}>
                                                {app.doctorId?.name ? `Dr. ${app.doctorId.name}` : 'N/A'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#64748B', fontSize: '13px' }}>
                                                {app.appointmentDate ? new Date(app.appointmentDate).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}
                                            </td>
                                            <td style={{ ...tdStyle, color: '#475569' }}>
                                                {app.reason || 'General Checkup'}
                                            </td>
                                            
                                            {/* Status Badge */}
                                            <td style={tdStyle}>
                                                <span style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '11.5px',
                                                    fontWeight: '700',
                                                    background: app.status === 'Completed' ? '#F0F4EF' : app.status === 'Cancelled' ? '#FEF2F2' : '#FEF3C7',
                                                    color: app.status === 'Completed' ? '#5A6B50' : app.status === 'Cancelled' ? '#991B1B' : '#B45309',
                                                    border: `1px solid ${app.status === 'Completed' ? '#D6E0D2' : app.status === 'Cancelled' ? '#FECACA' : '#FDE68A'}`
                                                }}>
                                                    {app.status || 'Scheduled'}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                {app.status === 'Scheduled' || !app.status ? (
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                                        <button 
                                                            onClick={() => confirmStatusChange(app._id, 'Completed')}
                                                            style={{
                                                                background: '#F0F4EF',
                                                                color: '#5A6B50',
                                                                border: '1px solid #D6E0D2',
                                                                padding: '5px 10px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            <CheckCircle2 size={13} /> Done
                                                        </button>

                                                        <button 
                                                            onClick={() => confirmStatusChange(app._id, 'Cancelled')}
                                                            style={{
                                                                background: '#FEF2F2',
                                                                color: '#991B1B',
                                                                border: '1px solid #FECACA',
                                                                padding: '5px 10px',
                                                                borderRadius: '6px',
                                                                cursor: 'pointer',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                                fontSize: '12px',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            <XCircle size={13} /> Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#94A3B8', fontSize: '13px' }}>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '13.5px' }}>
                                            No appointments scheduled yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- BOOK APPOINTMENT MODAL --- */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={{ ...modalContentStyle, maxWidth: '460px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#5A6B50' }}>
                                    Book New Appointment
                                </h3>
                                <button 
                                    onClick={() => setShowModal(false)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                                >
                                    <XCircle size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                {/* Patient Selection */}
                                <div>
                                    <label style={labelStyle}>Select Patient *</label>
                                    <select 
                                        value={formData.patientId} 
                                        onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                        required
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.disease || 'General'})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Doctor Selection */}
                                <div>
                                    <label style={labelStyle}>Select Doctor *</label>
                                    <select 
                                        value={formData.doctorId} 
                                        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                                        className="filter-select"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                        required
                                    >
                                        <option value="">-- Choose Doctor --</option>
                                        {doctors.map(d => (
                                            <option key={d._id} value={d._id}>Dr. {d.name} ({d.specialty})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Appointment Date & Time */}
                                <div>
                                    <label style={labelStyle}>Date & Time *</label>
                                    <input 
                                        type="datetime-local" 
                                        value={formData.appointmentDate}
                                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                                        className="form-input"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                        required
                                    />
                                </div>

                                {/* Reason / Notes */}
                                <div>
                                    <label style={labelStyle}>Reason / Symptoms</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Regular Checkup / Fever" 
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className="form-input"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>

                                {/* Buttons */}
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
                                        disabled={isSubmitting}
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
                                        {isSubmitting && <Loader2 size={14} className="spin-icon" />}
                                        Confirm Booking
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}

                {/* --- STATUS UPDATE CONFIRMATION MODAL --- */}
                {statusModal.show && (
                    <div style={modalOverlayStyle}>
                        <div style={{ ...modalContentStyle, maxWidth: '380px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                                <div style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '10px',
                                    background: statusModal.status === 'Completed' ? '#F0F4EF' : '#FEF2F2',
                                    border: `1px solid ${statusModal.status === 'Completed' ? '#D6E0D2' : '#FECACA'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: statusModal.status === 'Completed' ? '#5A6B50' : '#DC2626'
                                }}>
                                    <CalendarCheck2 size={20} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
                                        Update Status
                                    </h3>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                                        Change appointment state
                                    </p>
                                </div>
                            </div>

                            <p style={{ fontSize: '13.5px', color: '#475569', margin: '0 0 18px 0', lineHeight: '1.4' }}>
                                Are you sure you want to mark this appointment as <strong style={{ color: '#0F172A' }}>{statusModal.status}</strong>?
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    onClick={() => setStatusModal({ show: false, id: null, status: '' })}
                                    disabled={isUpdatingStatus}
                                    style={{
                                        padding: '8px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #CBD5E1',
                                        background: '#FFFFFF',
                                        color: '#475569',
                                        fontSize: '12.5px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleExecuteStatusChange}
                                    disabled={isUpdatingStatus}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 16px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: statusModal.status === 'Completed' ? '#7A8F6E' : '#DC2626',
                                        color: '#FFFFFF',
                                        fontSize: '12.5px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {isUpdatingStatus && <Loader2 size={13} className="spin-icon" />}
                                    Confirm Update
                                </button>
                            </div>
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
                            <AlertCircle size={18} color="#DC2626" />
                        )}
                        <span>{toast.message}</span>
                        <button 
                            onClick={() => setToast({ ...toast, show: false })}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'inherit',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                marginLeft: '8px'
                            }}
                        >
                            <X size={14} />
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
};

// Styling Helpers
const thStyle = { padding: '14px 16px', color: '#5A6B50', fontSize: '12.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.3px' };
const tdStyle = { padding: '14px 16px', color: '#334155', fontSize: '13.5px' };
const labelStyle = { display: 'block', marginBottom: '5px', fontSize: '12px', fontWeight: '700', color: '#475569' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { background: '#FFFFFF', padding: '24px', borderRadius: '16px', width: '100%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)', animation: 'modalFadeIn 0.2s ease-out forwards', border: '1px solid #E2E8F0' };

export default AppointmentsList;