import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import { 
    User, 
    Calendar, 
    Stethoscope, 
    DollarSign, 
    ArrowLeft, 
    Clock, 
    AlertCircle, 
    Loader2,
    ShieldCheck
} from 'lucide-react';

const PatientDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                const res = await API.get(`/patient/${id}`);
                setPatient(res.data?.patient || res.data);
            } catch (err) {
                console.error("Fetch patient details error:", err);
                setError(err.response?.data?.message || 'Failed to load patient details.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatient();
    }, [id]);

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
                    <p style={{ marginTop: '14px', fontSize: '14px', fontWeight: '600' }}>Loading Patient Profile...</p>
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

            <div style={{ padding: '36px 20px', maxWidth: '760px', margin: '0 auto' }}>
                <style>{`
                    .olive-card {
                        background: #FFFFFF;
                        border: 1px solid #E2E8F0;
                        border-radius: 20px;
                        box-shadow: 0 10px 30px rgba(122, 143, 110, 0.08);
                        padding: 32px;
                    }

                    .info-grid-card {
                        background: #F8FAFC;
                        border: 1px solid #E2E8F0;
                        padding: 16px;
                        border-radius: 12px;
                        transition: all 0.2s ease;
                    }
                    .info-grid-card:hover {
                        border-color: #D6E0D2;
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
                    {error ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#FEF2F2',
                            border: '1px solid #FECACA',
                            color: '#991B1B',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            fontSize: '13.5px'
                        }}>
                            <AlertCircle size={20} color="#EF4444" />
                            <span>{error}</span>
                        </div>
                    ) : patient ? (
                        <>
                            {/* Top Section: Photo + Main Info */}
                            <div style={{ 
                                display: 'flex', 
                                gap: '24px', 
                                alignItems: 'center', 
                                marginBottom: '28px',
                                paddingBottom: '24px',
                                borderBottom: '1px solid #E2E8F0'
                            }}>
                                <img 
                                    src={patient.patientImage || 'https://placehold.co/120x120?text=No+Photo'} 
                                    alt={patient.name} 
                                    style={{ 
                                        width: '100px', 
                                        height: '100px', 
                                        borderRadius: '20px', 
                                        objectFit: 'cover',
                                        border: '3px solid #7A8F6E',
                                        boxShadow: '0 4px 12px rgba(122, 143, 110, 0.15)'
                                    }} 
                                />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#0F172A' }}>
                                            {patient.name}
                                        </h2>
                                        
                                        {/* Status Pill Badge */}
                                        <span style={{ 
                                            padding: '4px 12px', 
                                            borderRadius: '20px', 
                                            background: patient.status === 'working' ? '#FEF3C7' : '#F0F4EF', 
                                            color: patient.status === 'working' ? '#D97706' : '#5A6B50', 
                                            fontSize: '11px', 
                                            fontWeight: '700',
                                            border: `1px solid ${patient.status === 'working' ? '#FDE68A' : '#D6E0D2'}`,
                                            letterSpacing: '0.3px'
                                        }}>
                                            {patient.status === 'working' ? 'WORKING (ACTIVE)' : 'FINAL (DISCHARGED)'}
                                        </span>
                                    </div>

                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '6px', 
                                        color: '#7A8F6E', 
                                        fontSize: '14px', 
                                        fontWeight: '600',
                                        marginTop: '6px'
                                    }}>
                                        <Stethoscope size={16} />
                                        <span>{patient.disease || 'Unspecified Condition'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                
                                {/* Age */}
                                <div className="info-grid-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        <Calendar size={15} color="#7A8F6E" /> Age
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
                                        {patient.age} <span style={{ fontSize: '13px', fontWeight: '500', color: '#64748B' }}>years old</span>
                                    </div>
                                </div>

                                {/* Total Bill */}
                                <div className="info-grid-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        <DollarSign size={15} color="#7A8F6E" /> Total Bill
                                    </div>
                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#5A6B50' }}>
                                        Rs. {Number(patient.totalBill || 0).toLocaleString()}
                                    </div>
                                </div>

                                {/* Admission Date */}
                                <div className="info-grid-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        <Clock size={15} color="#7A8F6E" /> Admission Date
                                    </div>
                                    <div style={{ fontSize: '14.5px', fontWeight: '600', color: '#334155' }}>
                                        {patient.admissionDate ? new Date(patient.admissionDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                    </div>
                                </div>

                                {/* Added By */}
                                <div className="info-grid-card">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748B', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                                        <ShieldCheck size={15} color="#7A8F6E" /> Registered By
                                    </div>
                                    <div style={{ fontSize: '14.5px', fontWeight: '600', color: '#334155' }}>
                                        {patient.addedBy?.username || patient.addedBy?.name || 'Staff Member'}
                                    </div>
                                </div>

                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default PatientDetails;