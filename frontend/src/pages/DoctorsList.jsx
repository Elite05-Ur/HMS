import { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';
import { 
    Search, 
    Filter, 
    RefreshCw, 
    UserPlus, 
    Stethoscope, 
    Clock, 
    DoorOpen, 
    Banknote, 
    Edit, 
    Trash2, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    X, 
    AlertTriangle,
    XCircle
} from 'lucide-react';

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [specialtyFilter, setSpecialtyFilter] = useState('all');

    // --- Custom Popups & Modals States ---
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // Form Modal (For Add and Edit Doctor)
    const [formModal, setFormModal] = useState({ show: false, isEdit: false, doctorId: null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        specialty: 'General Physician',
        roomNo: '',
        timing: '09:00 AM - 02:00 PM',
        fee: '',
        status: 'Available'
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    // Toast helper
    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast({ show: false, message: '', type: 'success' });
        }, 3500);
    };

    // Fetch Doctors from Backend API
    const fetchDoctors = async () => {
        try {
            setLoading(true);
            setError('');
            const res = await API.get('/doctor/all');
            const data = res.data.doctors || res.data;
            setDoctors(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Fetch Doctors Error:", err);
            setError("Failed to fetch doctors list from backend.");
        } finally {
            setLoading(false);
        }
    };

    // Open Add Doctor Modal
    const handleOpenAddModal = () => {
        setFormData({
            name: '',
            specialty: 'General Physician',
            roomNo: '',
            timing: '09:00 AM - 02:00 PM',
            fee: '',
            status: 'Available'
        });
        setFormModal({ show: true, isEdit: false, doctorId: null });
    };

    // Open Edit Doctor Modal
    const handleOpenEditModal = (doc) => {
        setFormData({
            name: doc.name || '',
            specialty: doc.specialty || 'General Physician',
            roomNo: doc.roomNo || '',
            timing: doc.timing || '09:00 AM - 02:00 PM',
            fee: doc.fee || '',
            status: doc.status || 'Available'
        });
        setFormModal({ show: true, isEdit: true, doctorId: doc._id });
    };

    // Handle Form Input Change
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit Form (Add / Edit API Request)
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            showToast("Doctor name is required", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            if (formModal.isEdit) {
                // Update Doctor
                await API.put(`/doctor/update/${formModal.doctorId}`, formData);
                showToast("Doctor profile updated successfully!");
            } else {
                // Add New Doctor
                await API.post('/doctor/add', formData);
                showToast("New doctor added successfully!");
            }
            setFormModal({ show: false, isEdit: false, doctorId: null });
            fetchDoctors();
        } catch (err) {
            console.error("Save Doctor Error:", err);
            showToast(err.response?.data?.message || "Failed to save doctor details.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Confirm Delete Action Trigger
    const confirmDelete = (id, name) => {
        setDeleteModal({ show: true, id, name });
    };

    // Execute Doctor Delete API
    const handleDeleteExecute = async () => {
        if (!deleteModal.id) return;

        try {
            setIsDeleting(true);
            await API.delete(`/doctor/delete/${deleteModal.id}`);
            setDoctors(doctors.filter(d => d._id !== deleteModal.id));
            setDeleteModal({ show: false, id: null, name: '' });
            showToast("Doctor removed from directory!", "success");
        } catch (err) {
            console.error("Delete Doctor Error:", err);
            setDeleteModal({ show: false, id: null, name: '' });
            showToast("Failed to delete doctor record.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    // Filter Logic
    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              doctor.specialty?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty = specialtyFilter === 'all' || doctor.specialty === specialtyFilter;
        return matchesSearch && matchesSpecialty;
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

                    .doc-card {
                        transition: all 0.2s ease;
                    }
                    .doc-card:hover {
                        transform: translateY(-3px);
                        box-shadow: 0 8px 24px rgba(122, 143, 110, 0.12) !important;
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
                            Doctors Directory
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13.5px' }}>
                            View available hospital doctors, OPD rooms, and duty timings
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                            onClick={fetchDoctors}
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
                            <RefreshCw size={15} /> Refresh List
                        </button>

                        <button 
                            onClick={handleOpenAddModal}
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
                            <UserPlus size={16} /> Add New Doctor
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

                {/* Search & Specialty Filters Bar */}
                <div style={{ 
                    display: 'flex', 
                    gap: '16px', 
                    marginBottom: '28px', 
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
                            placeholder="Search doctor by name or specialty..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div style={{ position: 'relative' }}>
                        <select 
                            value={specialtyFilter}
                            onChange={(e) => setSpecialtyFilter(e.target.value)}
                            className="filter-select"
                            style={{ paddingLeft: '36px' }}
                        >
                            <option value="all">All Specialties</option>
                            <option value="Cardiology">Cardiology</option>
                            <option value="Neurology">Neurology</option>
                            <option value="Pediatrics">Pediatrics</option>
                            <option value="Orthopedics">Orthopedics</option>
                            <option value="General Physician">General Physician</option>
                        </select>
                        <Filter size={15} color="#7A8F6E" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    </div>
                </div>

                {/* Doctors Directory Cards */}
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
                        <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600' }}>Loading Doctors Directory...</p>
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                        gap: '20px' 
                    }}>
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doc) => (
                                <div key={doc._id} className="doc-card" style={cardStyle}>
                                    
                                    {/* Top Profile Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                                        <div style={avatarStyle}>
                                            <Stethoscope size={22} color="#7A8F6E" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ margin: 0, fontSize: '16.5px', color: '#0F172A', fontWeight: '700' }}>
                                                {doc.name}
                                            </h3>
                                            <span style={{ fontSize: '12.5px', color: '#7A8F6E', fontWeight: '600' }}>
                                                {doc.specialty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Details List */}
                                    <div style={{ 
                                        fontSize: '13px', 
                                        color: '#475569', 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        gap: '10px', 
                                        marginBottom: '18px',
                                        background: '#F8FAFC',
                                        padding: '12px',
                                        borderRadius: '10px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <DoorOpen size={15} color="#64748B" />
                                            <span><strong>OPD Room:</strong> #{doc.roomNo || 'N/A'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Clock size={15} color="#64748B" />
                                            <span><strong>Duty Hours:</strong> {doc.timing || '09:00 AM - 02:00 PM'}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Banknote size={15} color="#64748B" />
                                            <span><strong>Checkup Fee:</strong> Rs. {doc.fee || '1,000'}</span>
                                        </div>
                                    </div>

                                    {/* Footer / Status & Action Buttons */}
                                    <div style={{ 
                                        display: 'flex', 
                                        justify: 'space-between', 
                                        alignItems: 'center', 
                                        borderTop: '1px solid #F1F5F9', 
                                        paddingTop: '14px',
                                        marginTop: 'auto'
                                    }}>
                                        {/* Availability Badge */}
                                        <span style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '5px',
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            background: doc.status === 'Available' ? '#F0F4EF' : doc.status === 'In OPD' ? '#FEF3C7' : '#FEF2F2',
                                            color: doc.status === 'Available' ? '#5A6B50' : doc.status === 'In OPD' ? '#B45309' : '#991B1B',
                                            border: `1px solid ${doc.status === 'Available' ? '#D6E0D2' : doc.status === 'In OPD' ? '#FDE68A' : '#FECACA'}`
                                        }}>
                                            {doc.status || 'Available'}
                                        </span>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button 
                                                onClick={() => handleOpenEditModal(doc)}
                                                style={{
                                                    background: '#FEF3C7',
                                                    color: '#B45309',
                                                    border: '1px solid #FDE68A',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <Edit size={13} /> Edit
                                            </button>

                                            <button 
                                                onClick={() => confirmDelete(doc._id, doc.name)}
                                                style={{
                                                    background: '#FEF2F2',
                                                    color: '#991B1B',
                                                    border: '1px solid #FECACA',
                                                    padding: '6px 10px',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    fontSize: '12px',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                <Trash2 size={13} /> Delete
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#64748B', fontSize: '14px' }}>
                                No doctors found matching your query.
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* --- ADD / EDIT DOCTOR MODAL --- */}
            {formModal.show && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContainerStyle, maxWidth: '460px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#5A6B50' }}>
                                {formModal.isEdit ? 'Edit Doctor Profile' : 'Add New Doctor'}
                            </h3>
                            <button 
                                onClick={() => setFormModal({ show: false, isEdit: false, doctorId: null })}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={labelStyle}>Doctor Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    placeholder="Dr. John Doe"
                                    className="form-input"
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                    required 
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Specialty</label>
                                    <select 
                                        name="specialty" 
                                        value={formData.specialty} 
                                        onChange={handleInputChange}
                                        className="filter-select"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    >
                                        <option value="General Physician">General Physician</option>
                                        <option value="Cardiology">Cardiology</option>
                                        <option value="Neurology">Neurology</option>
                                        <option value="Pediatrics">Pediatrics</option>
                                        <option value="Orthopedics">Orthopedics</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={labelStyle}>OPD Room No</label>
                                    <input 
                                        type="text" 
                                        name="roomNo" 
                                        value={formData.roomNo} 
                                        onChange={handleInputChange} 
                                        placeholder="e.g. 102"
                                        className="form-input"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={labelStyle}>Duty Timings</label>
                                    <input 
                                        type="text" 
                                        name="timing" 
                                        value={formData.timing} 
                                        onChange={handleInputChange} 
                                        placeholder="09:00 AM - 02:00 PM"
                                        className="form-input"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div>
                                    <label style={labelStyle}>Fee (PKR)</label>
                                    <input 
                                        type="number" 
                                        name="fee" 
                                        value={formData.fee} 
                                        onChange={handleInputChange} 
                                        placeholder="1500"
                                        className="form-input"
                                        style={{ width: '100%', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={labelStyle}>Availability Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    className="filter-select"
                                    style={{ width: '100%', boxSizing: 'border-box' }}
                                >
                                    <option value="Available">Available</option>
                                    <option value="In OPD">In OPD</option>
                                    <option value="On Leave">On Leave</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setFormModal({ show: false, isEdit: false, doctorId: null })}
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
                                    {formModal.isEdit ? 'Save Changes' : 'Add Doctor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {deleteModal.show && (
                <div style={modalOverlayStyle}>
                    <div style={{ ...modalContainerStyle, maxWidth: '400px' }}>
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
                                    Remove Doctor
                                </h3>
                                <p style={{ margin: '2px 0 0 0', fontSize: '12.5px', color: '#64748B' }}>
                                    This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                            Are you sure you want to remove <strong style={{ color: '#0F172A' }}>{deleteModal.name}</strong> from the doctors directory?
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
                                {isDeleting ? 'Removing...' : 'Remove'}
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

        </div>
    );
};

// Internal Custom Component Styles
const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #E2E8F0',
    boxShadow: '0 4px 20px rgba(122, 143, 110, 0.05)',
    display: 'flex',
    flexDirection: 'column'
};

const avatarStyle = {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: '#F0F4EF',
    border: '1px solid #D6E0D2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    marginBottom: '5px'
};

const modalOverlayStyle = {
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
};

const modalContainerStyle = {
    background: '#FFFFFF',
    borderRadius: '16px',
    width: '100%',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    animation: 'modalFadeIn 0.2s ease-out forwards',
    border: '1px solid #E2E8F0'
};

export default DoctorsList;