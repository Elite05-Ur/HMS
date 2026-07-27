import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { 
    User, 
    Calendar, 
    Stethoscope, 
    Phone, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle, 
    Loader2 
} from 'lucide-react';

const EditPatient = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: 'Male',
        phone: '',
        disease: '', 
        status: 'working'
    });

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    // Fetch existing patient data by ID
    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await API.get(`/patient/${id}`);
                const patient = res.data?.patient || res.data;
                setFormData({
                    name: patient.name || '',
                    age: patient.age || '',
                    gender: patient.gender || 'Male',
                    phone: patient.phone || '',
                    disease: patient.disease || '',
                    status: patient.status || 'working'
                });
            } catch (err) {
                console.error("Error fetching patient details:", err);
                setError("Failed to load patient details.");
            } finally {
                setLoading(false);
            }
        };
        fetchPatient();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // UPDATE API Call
    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            await API.put(`/patient/update/${id}`, formData);
            navigate('/staff-dashboard', { state: { message: 'Patient updated successfully!', type: 'success' } });
        } catch (err) {
            console.error("Update error:", err);
            setError(err.response?.data?.message || 'Failed to update patient details.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
                <Navbar />
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '60vh', 
                    color: '#5A6B50' 
                }}>
                    <style>{`
                        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                        .spin-icon { animation: spin 0.8s linear infinite; }
                    `}</style>
                    <Loader2 size={36} className="spin-icon" />
                    <p style={{ marginTop: '14px', fontSize: '14px', fontWeight: '600' }}>Loading Patient Data...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#F8FAFC', 
            fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
            color: '#1E293B'
        }}>
            <Navbar />

            <div style={{ padding: '36px 20px', maxWidth: '720px', margin: '0 auto' }}>
                <style>{`
                    .olive-card {
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(122, 143, 110, 0.08);
                        padding: 32px;
                    }

                    .form-input {
                        width: 100%;
                        padding: 12px 16px;
                        border-radius: 10px;
                        border: 1px solid #CBD5E1;
                        outline: none;
                        font-size: 13.5px;
                        box-sizing: border-box;
                        color: #0F172A;
                        background: #F8FAFC;
                        transition: all 0.2s ease;
                    }
                    .form-input:focus {
                        border-color: #7A8F6E;
                        background: #FFFFFF;
                        box-shadow: 0 0 0 3px rgba(122, 143, 110, 0.15);
                    }
                `}</style>

                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'transparent',
                        border: 'none',
                        color: '#5A6B50',
                        fontSize: '13.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        marginBottom: '20px',
                        padding: 0
                    }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div className="olive-card">
                    {/* Header */}
                    <div style={{ marginBottom: '24px' }}>
                        <span style={{ 
                            background: '#F0F4EF', 
                            color: '#5A6B50', 
                            padding: '4px 12px', 
                            borderRadius: '12px', 
                            fontSize: '11px', 
                            fontWeight: '700',
                            border: '1px solid #D6E0D2',
                            letterSpacing: '0.5px'
                        }}>
                            RECORD MANAGEMENT
                        </span>
                        <h2 style={{ margin: '8px 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#5A6B50' }}>
                            Edit Patient Record
                        </h2>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>
                            Update personal details, clinical diagnosis, or active status
                        </p>
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
                            fontSize: '13px',
                            marginBottom: '20px'
                        }}>
                            <AlertCircle size={18} color="#EF4444" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        {/* Patient Name */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Full Name <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <User size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                    className="form-input"
                                    style={{ paddingLeft: '40px' }}
                                    placeholder="Patient Full Name"
                                />
                            </div>
                        </div>

                        {/* Age & Gender (Row) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Age (Years) <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Calendar size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="number" 
                                        name="age"
                                        value={formData.age} 
                                        onChange={handleChange} 
                                        required 
                                        className="form-input"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="e.g. 34"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Gender
                                </label>
                                <select 
                                    name="gender"
                                    value={formData.gender} 
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        {/* Phone Number & Diagnosis (Row) */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Phone Number
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Phone size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        name="phone"
                                        value={formData.phone} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="0300-1234567"
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                    Diagnosis / Disease
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Stethoscope size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        name="disease"
                                        value={formData.disease} 
                                        onChange={handleChange} 
                                        className="form-input"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="e.g. Typhoid Fever"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Patient Status (Custom Olive Green Radio Buttons) */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                                Patient Status <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                
                                {/* Working Status Option */}
                                <label 
                                    onClick={() => setFormData({ ...formData, status: 'working' })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        border: `2px solid ${formData.status === 'working' ? '#7A8F6E' : '#E2E8F0'}`,
                                        background: formData.status === 'working' ? '#F0F4EF' : '#F8FAFC',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: `2px solid ${formData.status === 'working' ? '#7A8F6E' : '#CBD5E1'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#FFFFFF'
                                    }}>
                                        {formData.status === 'working' && (
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7A8F6E' }}></div>
                                        )}
                                    </div>
                                    
                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="working" 
                                        checked={formData.status === 'working'} 
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />
                                    
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: formData.status === 'working' ? '#5A6B50' : '#334155' }}>
                                            Working
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                                            Active / Under Care
                                        </div>
                                    </div>
                                </label>

                                {/* Final Status Option */}
                                <label 
                                    onClick={() => setFormData({ ...formData, status: 'final' })}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '12px 16px',
                                        borderRadius: '10px',
                                        border: `2px solid ${formData.status === 'final' ? '#7A8F6E' : '#E2E8F0'}`,
                                        background: formData.status === 'final' ? '#F0F4EF' : '#F8FAFC',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        border: `2px solid ${formData.status === 'final' ? '#7A8F6E' : '#CBD5E1'}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#FFFFFF'
                                    }}>
                                        {formData.status === 'final' && (
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7A8F6E' }}></div>
                                        )}
                                    </div>

                                    <input 
                                        type="radio" 
                                        name="status" 
                                        value="final" 
                                        checked={formData.status === 'final'} 
                                        onChange={handleChange}
                                        style={{ display: 'none' }}
                                    />

                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '700', color: formData.status === 'final' ? '#5A6B50' : '#334155' }}>
                                            Final
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                                            Discharged / Cleared
                                        </div>
                                    </div>
                                </label>

                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button 
                                type="button" 
                                onClick={() => navigate(-1)} 
                                style={{ 
                                    padding: '11px 22px', 
                                    background: '#F1F5F9', 
                                    color: '#475569', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '13px'
                                }}
                            >
                                Cancel
                            </button>

                            <button 
                                type="submit" 
                                disabled={updating}
                                style={{ 
                                    padding: '11px 26px', 
                                    background: '#7A8F6E', 
                                    color: '#FFFFFF', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    cursor: updating ? 'not-allowed' : 'pointer', 
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    boxShadow: '0 4px 14px rgba(122, 143, 110, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {updating ? (
                                    <>Saving Updates...</>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} /> Update Patient
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPatient;