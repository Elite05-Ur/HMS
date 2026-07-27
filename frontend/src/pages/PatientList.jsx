import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
    Search, 
    UserPlus, 
    Eye, 
    Edit, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    Filter,
    UserCheck,
    UserX,
    CheckCircle2,
    X,
    AlertTriangle
} from 'lucide-react';

const PatientsList = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Custom Popups State
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    // Helper to show custom toast
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    // Fetch Patients from API
    const fetchPatients = async () => {
        try {
            setLoading(true);
            const res = await API.get('/patient/all');
            const data = res.data.patients || res.data;
            setPatients(Array.isArray(data) ? data : []);
            setFilteredPatients(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Patients Error:", err);
            setError("Failed to fetch patient records.");
        } finally {
            setLoading(false);
        }
    };

    // Filter and Search Logic
    useEffect(() => {
        let result = patients;

        // Search Filter (by Name or Disease)
        if (searchQuery.trim() !== '') {
            const query = searchQuery.toLowerCase();
            result = result.filter(patient =>
                patient.name?.toLowerCase().includes(query) ||
                patient.disease?.toLowerCase().includes(query)
            );
        }

        // Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(patient => {
                if (statusFilter === 'working') return patient.status === 'working';
                if (statusFilter === 'discharged') return patient.status === 'final' || patient.status === 'discharged';
                return true;
            });
        }

        setFilteredPatients(result);
    }, [searchQuery, statusFilter, patients]);

    // Trigger Delete Confirmation Modal
    const confirmDelete = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    // Execute Delete Action
    const handleDeleteExecute = async () => {
        if (!deleteModal.id) return;

        try {
            setIsDeleting(true);
            await API.delete(`/patient/delete/${deleteModal.id}`);
            setPatients(patients.filter(p => p._id !== deleteModal.id));
            setDeleteModal({ show: false, id: null, name: '' });
            showToast("Patient record deleted successfully!", "success");
        } catch (err) {
            console.error("Delete Error:", err);
            setDeleteModal({ show: false, id: null, name: '' });
            showToast("Failed to delete patient record.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

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

                    .filter-select {
                        padding: 10px 14px 10px 36px;
                        border-radius: 10px;
                        border: 1px solid #CBD5E1;
                        outline: none;
                        font-size: 13.5px;
                        background: #F8FAFC;
                        color: #0F172A;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .filter-select:focus {
                        border-color: #7A8F6E;
                        background: #FFFFFF;
                    }

                    .table-row {
                        transition: background-color 0.2s ease;
                    }
                    .table-row:hover {
                        background-color: #F0F4EF !important;
                    }

                    .action-btn {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        padding: 6px 12px;
                        border-radius: 8px;
                        font-size: 12px;
                        font-weight: 600;
                        text-decoration: none;
                        border: none;
                        cursor: pointer;
                        transition: all 0.2s ease;
                    }
                    .action-btn:hover {
                        transform: translateY(-1px);
                    }

                    @keyframes modalFadeIn {
                        from { opacity: 0; transform: scale(0.95); }
                        to { opacity: 1; transform: scale(1); }
                    }

                    @keyframes toastSlideIn {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}</style>

                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#5A6B50', fontSize: '26px', fontWeight: '700' }}>
                            Patient Records
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13.5px' }}>
                            View, filter, and manage all registered hospital patients
                        </p>
                    </div>

                    <Link 
                        to="/add-patient" 
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '11px 20px',
                            background: '#7A8F6E',
                            color: '#FFFFFF',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '13.5px',
                            boxShadow: '0 4px 12px rgba(122, 143, 110, 0.25)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <UserPlus size={16} /> Add New Patient
                    </Link>
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

                {/* Search & Filter Bar */}
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
                    {/* Search Input */}
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                        <input 
                            type="text" 
                            placeholder="Search by Patient Name or Disease..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {/* Status Dropdown Filter */}
                    <div style={{ position: 'relative' }}>
                        <Filter size={15} color="#7A8F6E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Statuses</option>
                            <option value="working">Working (Active)</option>
                            <option value="discharged">Final (Discharged)</option>
                        </select>
                    </div>
                </div>

                {/* Patients Table Container */}
                {loading ? (
                    <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: '60px', 
                        color: '#5A6B50' 
                    }}>
                        <style>{`
                            @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                            .spin-icon { animation: spin 0.8s linear infinite; }
                        `}</style>
                        <Loader2 size={32} className="spin-icon" />
                        <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600' }}>Loading Patient Records...</p>
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
                                <tr style={{ background: '#F0F4EF', borderBottom: '1px solid #E2E8F0' }}>
                                    <th style={thStyle}>Photo</th>
                                    <th style={thStyle}>Name</th>
                                    <th style={thStyle}>Age</th>
                                    <th style={thStyle}>Disease</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={thStyle}>Total Bill</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((patient) => {
                                        const isActive = patient.status === 'working';
                                        return (
                                            <tr key={patient._id} className="table-row" style={{ borderBottom: '1px solid #F1F5F9' }}>
                                                
                                                {/* Image */}
                                                <td style={tdStyle}>
                                                    <img 
                                                        src={patient.patientImage || 'https://placehold.co/45x45?text=User'} 
                                                        alt={patient.name} 
                                                        style={{ 
                                                            width: '42px', 
                                                            height: '42px', 
                                                            borderRadius: '50%', 
                                                            objectFit: 'cover', 
                                                            border: '2px solid #7A8F6E' 
                                                        }} 
                                                    />
                                                </td>

                                                {/* Details */}
                                                <td style={{ ...tdStyle, fontWeight: '700', color: '#0F172A' }}>
                                                    {patient.name}
                                                </td>
                                                <td style={tdStyle}>{patient.age} yrs</td>
                                                <td style={{ ...tdStyle, color: '#475569' }}>
                                                    {patient.disease || 'N/A'}
                                                </td>

                                                {/* Status Badge */}
                                                <td style={tdStyle}>
                                                    <span style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        padding: '4px 10px',
                                                        borderRadius: '20px',
                                                        fontSize: '11px',
                                                        fontWeight: '700',
                                                        background: isActive ? '#FEF3C7' : '#F0F4EF',
                                                        color: isActive ? '#D97706' : '#5A6B50',
                                                        border: `1px solid ${isActive ? '#FDE68A' : '#D6E0D2'}`
                                                    }}>
                                                        {isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                                                        {isActive ? 'Working' : 'Final'}
                                                    </span>
                                                </td>

                                                {/* Bill */}
                                                <td style={{ ...tdStyle, fontWeight: '700', color: '#5A6B50' }}>
                                                    Rs. {Number(patient.totalBill || 0).toLocaleString()}
                                                </td>

                                                {/* Action Buttons */}
                                                <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
                                                        <Link 
                                                            to={`/patient/${patient._id}`} 
                                                            className="action-btn"
                                                            style={{ background: '#F0F4EF', color: '#5A6B50', border: '1px solid #D6E0D2' }}
                                                        >
                                                            <Eye size={13} /> View
                                                        </Link>

                                                        <Link 
                                                            to={`/edit-patient/${patient._id}`} 
                                                            className="action-btn"
                                                            style={{ background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A' }}
                                                        >
                                                            <Edit size={13} /> Edit
                                                        </Link>

                                                        <button 
                                                            onClick={() => confirmDelete(patient._id, patient.name)}
                                                            className="action-btn"
                                                            style={{ background: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' }}
                                                        >
                                                            <Trash2 size={13} /> Delete
                                                        </button>
                                                    </div>
                                                </td>

                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '14px' }}>
                                            No matching patient records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {/* --- CUSTOM THEME POPUP MODAL (Delete Confirmation) --- */}
            {deleteModal.show && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}>
                    <div style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '420px',
                        padding: '24px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        animation: 'modalFadeIn 0.2s ease-out forwards',
                        border: '1px solid #E2E8F0'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: '#FEF2F2',
                                border: '1px solid #FECACA',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#DC2626'
                            }}>
                                <AlertTriangle size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#1E293B' }}>
                                    Delete Patient Record
                                </h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                            Are you sure you want to delete the record for <strong style={{ color: '#0F172A' }}>{deleteModal.name}</strong>?
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                onClick={() => setDeleteModal({ show: false, id: null, name: '' })}
                                disabled={isDeleting}
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
                                onClick={handleDeleteExecute}
                                disabled={isDeleting}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#DC2626',
                                    color: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.25)'
                                }}
                            >
                                {isDeleting ? <Loader2 size={14} className="spin-icon" /> : <Trash2 size={14} />}
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CUSTOM TOAST POPUP NOTIFICATION --- */}
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

        </div>
    );
};

// Table Header & Cell Styles
const thStyle = { 
    padding: '14px 18px', 
    color: '#5A6B50', 
    fontSize: '12px', 
    fontWeight: '700', 
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
};

const tdStyle = { 
    padding: '14px 18px', 
    color: '#334155', 
    fontSize: '13.5px',
    verticalAlign: 'middle'
};

export default PatientsList;