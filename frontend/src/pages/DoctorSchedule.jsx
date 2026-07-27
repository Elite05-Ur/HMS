import { useEffect, useState } from 'react';
import DoctorSidebar from '../components/DoctorSidebar';
import API from '../services/api';
import { 
    Clock, 
    MapPin, 
    Calendar, 
    Activity, 
    DollarSign, 
    Edit3, 
    Save, 
    RefreshCw, 
    CheckCircle2, 
    X,
    CalendarCheck
} from 'lucide-react';

const DoctorSchedule = () => {
    const [schedule, setSchedule] = useState({
        roomNo: 'OPD Room 102',
        days: 'Monday to Saturday',
        timing: '09:00 AM - 02:00 PM',
        status: 'Available',
        fee: 1000
    });

    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editForm, setEditForm] = useState({ ...schedule });
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        setLoading(true);
        try {
            const res = await API.get('/doctor/profile');
            if (res.data) {
                const fetchedData = {
                    roomNo: res.data.roomNo || 'OPD Room 102',
                    days: res.data.timing ? (res.data.timing.includes(' ') ? res.data.timing.split(' ')[0] : res.data.timing) : 'Monday to Saturday',
                    timing: res.data.timing ? (res.data.timing.includes(' ') ? res.data.timing.split(' ').slice(1).join(' ') : res.data.timing) : '09:00 AM - 02:00 PM',
                    status: res.data.status || 'Available',
                    fee: res.data.fee || 1000
                };
                setSchedule(fetchedData);
                setEditForm(fetchedData);
            }
        } catch (err) {
            console.log("Using default schedule fallback data:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Combine days & timing for unified endpoint schema if required
            const payload = {
                roomNo: editForm.roomNo,
                timing: `${editForm.days} ${editForm.timing}`,
                status: editForm.status,
                fee: editForm.fee
            };

            await API.post('/doctor/schedule/update', payload); // Call backend if endpoint available
            setSchedule({ ...editForm });
            setIsEditing(false);
            showNotification('Duty schedule updated successfully!');
        } catch (err) {
            console.warn("Backend update failed, applying changes locally:", err);
            setSchedule({ ...editForm });
            setIsEditing(false);
            showNotification('Schedule updated locally!');
        } finally {
            setSaving(false);
        }
    };

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 4000);
    };

    return (
        <div style={{ 
            display: 'flex', 
            minHeight: '100vh', 
            background: '#F4F6F5', 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" 
        }}>
            <DoctorSidebar />

            <main style={{ flex: 1, padding: '32px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                <style>{`
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                    .spin-icon { animation: spin 1s linear infinite; }
                    .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.04) !important; }
                    .btn-hover { transition: all 0.2s ease; }
                    .btn-hover:hover { background: #0B6B6F !important; }
                `}</style>

                {/* Toast Notification */}
                {notification && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '30px',
                        background: '#1C2A2B',
                        color: '#FFFFFF',
                        borderLeft: '5px solid #0E8388',
                        padding: '14px 20px',
                        borderRadius: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        zIndex: 9999
                    }}>
                        <CheckCircle2 size={18} color="#0E8388" />
                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{notification}</span>
                    </div>
                )}

                {/* Header Section */}
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
                            <Clock size={24} />
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: '#1C2A2B', fontSize: '22px', fontWeight: '700' }}>
                                OPD Duty Schedule
                            </h1>
                            <p style={{ margin: '4px 0 0 0', color: '#64748B', fontSize: '13px' }}>
                                Manage active consultation hours, room allocation & OPD availability
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={() => {
                            setEditForm({ ...schedule });
                            setIsEditing(!isEditing);
                        }}
                        className="btn-hover"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            background: isEditing ? '#E2E8F0' : '#0E8388',
                            color: isEditing ? '#1C2A2B' : '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '13px',
                            cursor: 'pointer'
                        }}
                    >
                        {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                        <span>{isEditing ? 'Cancel Editing' : 'Update Schedule'}</span>
                    </button>
                </div>

                {/* Main Content Layout */}
                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    
                    {/* 📌 Readonly Schedule Details Card */}
                    <div className="card-hover" style={{ 
                        background: '#FFFFFF', 
                        borderRadius: '12px', 
                        border: '1px solid #E2E8F0', 
                        padding: '28px', 
                        flex: '1', 
                        minWidth: '340px', 
                        maxWidth: '560px',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.02)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: '#1C2A2B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CalendarCheck size={18} color="#0E8388" />
                                Active Duty Roster
                            </span>
                            <span style={{
                                padding: '4px 12px',
                                background: schedule.status === 'Available' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
                                color: schedule.status === 'Available' ? '#16A34A' : '#DC2626',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '700'
                            }}>
                                • {schedule.status}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            
                            <ScheduleRow 
                                icon={<MapPin size={18} color="#0E8388" />}
                                label="OPD Room Allocation"
                                value={schedule.roomNo}
                                highlight
                            />

                            <ScheduleRow 
                                icon={<Calendar size={18} color="#0E8388" />}
                                label="Working Days"
                                value={schedule.days}
                            />

                            <ScheduleRow 
                                icon={<Clock size={18} color="#0E8388" />}
                                label="Shift Timings"
                                value={schedule.timing}
                            />

                            <ScheduleRow 
                                icon={<DollarSign size={18} color="#0E8388" />}
                                label="Consultation Fee"
                                value={`Rs. ${schedule.fee}`}
                            />

                        </div>
                    </div>

                    {/* ✏️ EDIT SCHEDULE DRAWER (Form) */}
                    {isEditing && (
                        <form onSubmit={handleSave} style={{ 
                            background: '#FFFFFF', 
                            borderRadius: '12px', 
                            border: '1px solid #0E8388', 
                            padding: '28px', 
                            flex: '1', 
                            minWidth: '320px', 
                            maxWidth: '500px',
                            boxShadow: '0 8px 24px rgba(14, 131, 136, 0.08)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#1C2A2B', fontWeight: '700' }}>
                                Modify OPD Parameters
                            </h3>

                            <div>
                                <label style={labelStyle}>OPD Room Number</label>
                                <input 
                                    type="text" 
                                    value={editForm.roomNo}
                                    onChange={(e) => setEditForm({ ...editForm, roomNo: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Working Days</label>
                                <input 
                                    type="text" 
                                    value={editForm.days}
                                    onChange={(e) => setEditForm({ ...editForm, days: e.target.value })}
                                    placeholder="e.g. Mon - Sat"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Shift Timings</label>
                                <input 
                                    type="text" 
                                    value={editForm.timing}
                                    onChange={(e) => setEditForm({ ...editForm, timing: e.target.value })}
                                    placeholder="e.g. 09:00 AM - 02:00 PM"
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Consultation Fee (PKR)</label>
                                <input 
                                    type="number" 
                                    value={editForm.fee}
                                    onChange={(e) => setEditForm({ ...editForm, fee: e.target.value })}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={labelStyle}>Duty Availability Status</label>
                                <select 
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    style={inputStyle}
                                >
                                    <option value="Available">Available (On Duty)</option>
                                    <option value="On Leave">On Leave</option>
                                    <option value="In Operation">In Operation</option>
                                    <option value="Busy">Busy</option>
                                </select>
                            </div>

                            <button 
                                type="submit" 
                                disabled={saving}
                                className="btn-hover"
                                style={{
                                    padding: '12px',
                                    background: '#0E8388',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '700',
                                    fontSize: '14px',
                                    cursor: saving ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginTop: '8px'
                                }}
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw size={16} className="spin-icon" />
                                        <span>Saving Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={16} />
                                        <span>Save OPD Roster</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </main>
        </div>
    );
};

// Internal Row Component
const ScheduleRow = ({ icon, label, value, highlight }) => (
    <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '12px 14px', 
        background: '#F8FAFC',
        borderRadius: '8px',
        border: '1px solid #E2E8F0'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {icon}
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: '500' }}>{label}</span>
        </div>
        <strong style={{ 
            fontSize: '14px', 
            color: highlight ? '#0E8388' : '#1C2A2B', 
            fontWeight: '700' 
        }}>
            {value}
        </strong>
    </div>
);

// Form Schemas
const labelStyle = { 
    display: 'block', 
    marginBottom: '6px', 
    fontSize: '12px', 
    fontWeight: '700', 
    color: '#1C2A2B' 
};

const inputStyle = { 
    width: '100%', 
    padding: '10px 12px', 
    borderRadius: '8px', 
    border: '1px solid #CBD5E1', 
    outline: 'none', 
    boxSizing: 'border-box',
    fontSize: '13px',
    color: '#1C2A2B',
    fontFamily: 'inherit'
};

export default DoctorSchedule;