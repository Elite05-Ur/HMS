import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { 
    User, 
    Calendar, 
    Stethoscope, 
    DollarSign, 
    UploadCloud, 
    ArrowLeft, 
    CheckCircle2, 
    AlertCircle
} from 'lucide-react';

const AddPatient = () => {
    const navigate = useNavigate();

    // Schema required states
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        disease: '',
        totalBill: '0',
        status: 'working'
    });

    const [patientImage, setPatientImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPatientImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!patientImage) {
            setError('Patient image upload karna zaroori hai!');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('age', formData.age);
            data.append('disease', formData.disease);
            data.append('totalBill', formData.totalBill);
            data.append('status', formData.status);
            data.append('patientImage', patientImage);

            await API.post('/patient/add', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            navigate('/staff-dashboard', { state: { message: 'Patient added successfully!', type: 'success' } });

        } catch (err) {
            console.error("Add patient error:", err);
            setError(err.response?.data?.message || 'Failed to add patient. Please check all required fields.');
        } finally {
            setLoading(false);
        }
    };

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
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin-icon { animation: spin 0.8s linear infinite; }

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

                    .upload-box {
                        border: 2px dashed #CBD5E1;
                        border-radius: 14px;
                        padding: 20px;
                        text-align: center;
                        background: #F8FAFC;
                        cursor: pointer;
                        transition: all 0.2s ease;
                        position: relative;
                    }
                    .upload-box:hover {
                        border-color: #7A8F6E;
                        background: #F0F4EF;
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
                            NEW REGISTRATION
                        </span>
                        <h2 style={{ margin: '8px 0 4px 0', fontSize: '24px', fontWeight: '700', color: '#5A6B50' }}>
                            Add Patient Record
                        </h2>
                        <p style={{ margin: 0, color: '#64748B', fontSize: '13px' }}>
                            Fill in patient clinical details and upload verification photo
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

                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
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
                                    placeholder="e.g. Muhammad Ali"
                                />
                            </div>
                        </div>

                        {/* Age & Disease (Row) */}
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
                                    Diagnosis / Disease <span style={{ color: '#EF4444' }}>*</span>
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <Stethoscope size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                    <input 
                                        type="text" 
                                        name="disease"
                                        value={formData.disease} 
                                        onChange={handleChange} 
                                        required 
                                        className="form-input"
                                        style={{ paddingLeft: '40px' }}
                                        placeholder="e.g. Typhoid Fever"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Initial Bill Amount */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Initial Bill Amount (PKR) <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <DollarSign size={16} color="#7A8F6E" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                                <input 
                                    type="number" 
                                    name="totalBill"
                                    value={formData.totalBill} 
                                    onChange={handleChange} 
                                    required 
                                    className="form-input"
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                        </div>

                        {/* Patient Status (Olive Green Custom Radio Buttons) */}
                        <div style={{ marginBottom: '22px' }}>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>
                                Patient Status <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                
                                {/* Working Status Radio */}
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
                                            In Hospital / Ongoing
                                        </div>
                                    </div>
                                </label>

                                {/* Final Status Radio */}
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

                        {/* Photo Upload Area */}
                        <div style={{ marginBottom: '28px' }}>
                            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                                Patient Photo <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            
                            <label htmlFor="patientImage" className="upload-box" style={{ display: 'block' }}>
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    id="patientImage"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                />

                                {imagePreview ? (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover', border: '2px solid #7A8F6E' }} 
                                        />
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#0F172A' }}>
                                                {patientImage?.name}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#7A8F6E', fontWeight: '500', marginTop: '2px' }}>
                                                Click to change photo
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ padding: '10px 0' }}>
                                        <UploadCloud size={32} color="#7A8F6E" style={{ marginBottom: '8px' }} />
                                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                            Click to upload image
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
                                            Supports JPG, PNG or WEBP (Max 5MB)
                                        </div>
                                    </div>
                                )}
                            </label>
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
                                disabled={loading}
                                style={{ 
                                    padding: '11px 26px', 
                                    background: '#7A8F6E', 
                                    color: '#FFFFFF', 
                                    border: 'none', 
                                    borderRadius: '10px', 
                                    cursor: loading ? 'not-allowed' : 'pointer', 
                                    fontWeight: '600',
                                    fontSize: '13px',
                                    boxShadow: '0 4px 14px rgba(122, 143, 110, 0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {loading ? (
                                    <>Uploading & Saving...</>
                                ) : (
                                    <>
                                        <CheckCircle2 size={16} /> Save Patient Record
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

export default AddPatient;