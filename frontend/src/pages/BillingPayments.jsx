import { useEffect, useState } from 'react';
import API from '../services/api';
import Sidebar from '../components/Sidebar';

const INITIAL_BILL_STATE = {
    patientId: '',
    doctorFee: 1000,
    roomCharges: 0,
    testCharges: 0,
    discount: 0,
    paidAmount: 1000,
    paymentStatus: 'Paid'
};

const BillingPayments = () => {
    const [patients, setPatients] = useState([]);
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);

    // Toast / Popup Notification State
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    
    // Bill Calculation Form State
    const [billData, setBillData] = useState(INITIAL_BILL_STATE);

    useEffect(() => {
        fetchData();
    }, []);

    // Helper to trigger custom toast popup
    const showNotification = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, 4000);
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');

            const [patRes, billRes] = await Promise.all([
                API.get('/patient/all'),
                API.get('/billing/all').catch(() => ({ data: [] }))
            ]);

            setPatients(Array.isArray(patRes.data) ? patRes.data : patRes.data.patients || []);
            setBills(Array.isArray(billRes.data) ? billRes.data : billRes.data.bills || []);
        } catch (err) {
            console.error("Fetch Billing Error:", err);
            setError("Failed to load billing records.");
        } finally {
            setLoading(false);
        }
    };

    // Auto Calculate Total Bill Amount
    const calculateTotal = () => {
        const doc = Number(billData.doctorFee) || 0;
        const room = Number(billData.roomCharges) || 0;
        const test = Number(billData.testCharges) || 0;
        const disc = Number(billData.discount) || 0;
        const total = (doc + room + test) - disc;
        return total < 0 ? 0 : total;
    };

    // Handle Input Changes with Smart Payment Auto-Fill
    const handleInputChange = (field, value) => {
        const updatedBill = { ...billData, [field]: value };
        
        if (['doctorFee', 'roomCharges', 'testCharges', 'discount'].includes(field)) {
            const doc = Number(updatedBill.doctorFee) || 0;
            const room = Number(updatedBill.roomCharges) || 0;
            const test = Number(updatedBill.testCharges) || 0;
            const disc = Number(updatedBill.discount) || 0;
            const computedTotal = Math.max(0, (doc + room + test) - disc);

            updatedBill.paidAmount = computedTotal;
            updatedBill.paymentStatus = 'Paid';
        }

        setBillData(updatedBill);
    };

    const resetForm = () => {
        setBillData(INITIAL_BILL_STATE);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        resetForm();
    };

    // Handle Create Bill
    const handleSubmitBill = async (e) => {
        e.preventDefault();
        const total = calculateTotal();

        try {
            const payload = {
                ...billData,
                doctorFee: Number(billData.doctorFee) || 0,
                roomCharges: Number(billData.roomCharges) || 0,
                testCharges: Number(billData.testCharges) || 0,
                discount: Number(billData.discount) || 0,
                paidAmount: Number(billData.paidAmount) || 0,
                totalAmount: total
            };

            await API.post('/billing/create', payload);
            showNotification("Invoice generated successfully!", "success");
            handleCloseModal();
            fetchData();
        } catch (err) {
            console.error("Billing Error:", err);
            showNotification(err.response?.data?.message || "Failed to process billing.", "error");
        }
    };

    // Print Modern Invoice Handler
    const handlePrintInvoice = (bill) => {
        const printWindow = window.open('', '', 'width=850,height=700');
        if (!printWindow) {
            showNotification('Please allow browser popups to print invoices.', 'error');
            return;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Invoice - ${bill.patientId?.name || 'Patient'}</title>
                    <style>
                        * { box-sizing: border-box; }
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #2d3748; background: #fff; }
                        .invoice-card { border: 1px solid #e2e8f0; padding: 30px; border-radius: 12px; }
                        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #7A8F6E; padding-bottom: 15px; margin-bottom: 25px; }
                        .brand h2 { margin: 0; color: #7A8F6E; font-size: 24px; letter-spacing: -0.5px; }
                        .brand p { margin: 3px 0 0 0; color: #718096; font-size: 13px; }
                        .inv-title { text-align: right; }
                        .inv-title h3 { margin: 0; color: #2d3748; font-size: 18px; text-transform: uppercase; }
                        .inv-title p { margin: 3px 0 0 0; color: #718096; font-size: 12px; }
                        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8faf7; padding: 15px; border-radius: 8px; margin-bottom: 25px; border: 1px solid #f1f5f0; }
                        .details-grid p { margin: 4px 0; font-size: 13px; color: #4a5568; }
                        table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
                        th { background: #f4f7f2; color: #4a5568; padding: 12px; text-align: left; font-size: 12px; font-weight: 700; text-transform: uppercase; }
                        td { border-bottom: 1px solid #e2e8f0; padding: 12px; font-size: 14px; color: #4a5568; }
                        .totals-container { display: flex; justify-content: flex-end; }
                        .totals-box { width: 280px; background: #f8faf7; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
                        .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
                        .totals-row.grand-total { border-top: 2px solid #7A8F6E; padding-top: 8px; font-weight: bold; color: #7A8F6E; font-size: 16px; margin-bottom: 0; }
                        .status-badge { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-top: 5px; }
                        .paid { background: #f0f4ee; color: #7A8F6E; border: 1px solid #dce5d8; }
                        .pending { background: #fef2f2; color: #991b1b; }
                        .partial { background: #fef3c7; color: #92400e; }
                        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #f1f5f9; padding-top: 15px; }
                    </style>
                </head>
                <body>
                    <div class="invoice-card">
                        <div class="header">
                            <div class="brand">
                                <h2>CITY CARE HOSPITAL</h2>
                                <p>Healthcare & Diagnostics Center</p>
                            </div>
                            <div class="inv-title">
                                <h3>Official Receipt</h3>
                                <p>Date: ${new Date(bill.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div class="details-grid">
                            <div>
                                <p><strong>Patient Name:</strong> ${bill.patientId?.name || 'N/A'}</p>
                                <p><strong>Gender / Age:</strong> ${bill.patientId?.gender || 'N/A'} / ${bill.patientId?.age || 'N/A'}</p>
                            </div>
                            <div>
                                <p><strong>Payment Status:</strong> 
                                    <span class="status-badge ${bill.paymentStatus?.toLowerCase() || 'pending'}">${bill.paymentStatus || 'Pending'}</span>
                                </p>
                                <p><strong>Invoice ID:</strong> #${bill._id ? bill._id.substring(18).toUpperCase() : 'REC-1001'}</p>
                            </div>
                        </div>

                        <table>
                            <thead>
                                <tr>
                                    <th>Description</th>
                                    <th style="text-align: right;">Amount (Rs.)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Doctor Consultation Fee</td><td style="text-align: right;">${bill.doctorFee || 0}</td></tr>
                                <tr><td>Room / Bed Charges</td><td style="text-align: right;">${bill.roomCharges || 0}</td></tr>
                                <tr><td>Lab Tests & Diagnostics</td><td style="text-align: right;">${bill.testCharges || 0}</td></tr>
                                {bill.discount > 0 && <tr><td>Special Discount</td><td style="text-align: right; color: #dc2626;">-${bill.discount}</td></tr>}
                            </tbody>
                        </table>

                        <div class="totals-container">
                            <div class="totals-box">
                                <div class="totals-row">
                                    <span>Total Invoice:</span>
                                    <span>Rs. ${bill.totalAmount || 0}</span>
                                </div>
                                <div class="totals-row">
                                    <span>Paid Amount:</span>
                                    <span>Rs. ${bill.paidAmount || 0}</span>
                                </div>
                                <div class="totals-row grand-total">
                                    <span>Balance Due:</span>
                                    <span>Rs. ${Math.max(0, (bill.totalAmount || 0) - (bill.paidAmount || 0))}</span>
                                </div>
                            </div>
                        </div>

                        <div class="footer">
                            <p>Thank you for choosing City Care Hospital. Wish you a quick recovery!</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#fcfdfc', fontFamily: "'Inter', system-ui, sans-serif" }}>
            <Sidebar />

            {/* Custom Theme Popup Toast Notification */}
            {toast.show && (
                <div style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.03)',
                    background: toast.type === 'success' ? '#7A8F6E' : '#991b1b',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.3s ease-in-out'
                }}>
                    <span>{toast.type === 'success' ? '✅' : '⚠️'}</span>
                    <span>{toast.message}</span>
                    <button 
                        onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ffffff',
                            cursor: 'pointer',
                            fontSize: '16px',
                            marginLeft: '8px',
                            opacity: 0.8
                        }}
                    >
                        ✕
                    </button>
                </div>
            )}

            <main style={{ flex: 1, padding: '32px 40px', boxSizing: 'border-box', overflowY: 'auto' }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                    <div>
                        <h1 style={{ margin: 0, color: '#2d3748', fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                            Billing & Invoicing
                        </h1>
                        <p style={{ margin: '4px 0 0 0', color: '#718096', fontSize: '14px' }}>
                            Generate invoices, manage payments, and print client receipts
                        </p>
                    </div>

                    <button 
                        onClick={() => setShowModal(true)}
                        style={primaryBtnStyle}
                    >
                        <span style={{ fontSize: '16px' }}>+</span> Create Invoice
                    </button>
                </div>

                {/* Error Banner */}
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '14px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                {/* Table Data Card */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#718096' }}>
                        <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔄</div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>Fetching Billing Records...</h3>
                    </div>
                ) : (
                    <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#f8faf7', borderBottom: '1px solid #e2e8f0' }}>
                                    <th style={thStyle}>Patient Name</th>
                                    <th style={thStyle}>Doctor Fee</th>
                                    <th style={thStyle}>Room Fee</th>
                                    <th style={thStyle}>Test Fee</th>
                                    <th style={thStyle}>Total Amount</th>
                                    <th style={thStyle}>Status</th>
                                    <th style={{ ...thStyle, textAlign: 'center' }}>Receipt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.length > 0 ? (
                                    bills.map((bill) => (
                                        <tr key={bill._id} style={trHoverStyle}>
                                            <td style={{ ...tdStyle, fontWeight: '600', color: '#2d3748' }}>
                                                {bill.patientId?.name || 'N/A'}
                                            </td>
                                            <td style={tdStyle}>Rs. {bill.doctorFee || 0}</td>
                                            <td style={tdStyle}>Rs. {bill.roomCharges || 0}</td>
                                            <td style={tdStyle}>Rs. {bill.testCharges || 0}</td>
                                            <td style={{ ...tdStyle, fontWeight: '700', color: '#7A8F6E' }}>
                                                Rs. {bill.totalAmount || 0}
                                            </td>
                                            <td style={tdStyle}>
                                                <span style={{
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    fontSize: '12px',
                                                    fontWeight: '600',
                                                    display: 'inline-block',
                                                    background: bill.paymentStatus === 'Paid' ? '#f0f4ee' : bill.paymentStatus === 'Partial' ? '#fef3c7' : '#fee2e2',
                                                    color: bill.paymentStatus === 'Paid' ? '#7A8F6E' : bill.paymentStatus === 'Partial' ? '#b45309' : '#b91c1c',
                                                    border: bill.paymentStatus === 'Paid' ? '1px solid #dce5d8' : 'none'
                                                }}>
                                                    {bill.paymentStatus || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ ...tdStyle, textAlign: 'center' }}>
                                                <button 
                                                    onClick={() => handlePrintInvoice(bill)}
                                                    style={actionBtnStyle}
                                                >
                                                    🖨️ Print
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#7A8F6E', fontSize: '14px' }}>
                                            No billing records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal Window */}
                {showModal && (
                    <div style={modalOverlayStyle}>
                        <div style={modalContentStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                                <h2 style={{ margin: 0, color: '#2d3748', fontSize: '18px', fontWeight: '700' }}>Create Patient Bill</h2>
                                <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7A8F6E' }}>✕</button>
                            </div>

                            <form onSubmit={handleSubmitBill} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                
                                <div>
                                    <label style={labelStyle}>Select Patient *</label>
                                    <select 
                                        value={billData.patientId} 
                                        onChange={(e) => handleInputChange('patientId', e.target.value)}
                                        style={inputStyle}
                                        required
                                    >
                                        <option value="">-- Choose Patient --</option>
                                        {patients.map(p => (
                                            <option key={p._id} value={p._id}>{p.name} ({p.disease || 'Patient'})</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={gridTwoColStyle}>
                                    <div>
                                        <label style={labelStyle}>Doctor Fee (Rs.)</label>
                                        <input 
                                            type="number" 
                                            value={billData.doctorFee} 
                                            onChange={(e) => handleInputChange('doctorFee', e.target.value)}
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Room Fee (Rs.)</label>
                                        <input 
                                            type="number" 
                                            value={billData.roomCharges} 
                                            onChange={(e) => handleInputChange('roomCharges', e.target.value)}
                                            style={inputStyle} 
                                        />
                                    </div>
                                </div>

                                <div style={gridTwoColStyle}>
                                    <div>
                                        <label style={labelStyle}>Test Charges (Rs.)</label>
                                        <input 
                                            type="number" 
                                            value={billData.testCharges} 
                                            onChange={(e) => handleInputChange('testCharges', e.target.value)}
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Discount (Rs.)</label>
                                        <input 
                                            type="number" 
                                            value={billData.discount} 
                                            onChange={(e) => handleInputChange('discount', e.target.value)}
                                            style={inputStyle} 
                                        />
                                    </div>
                                </div>

                                {/* Dynamic Calculated Total Banner */}
                                <div style={{ background: '#f4f7f2', padding: '12px 16px', borderRadius: '8px', border: '1px solid #dce5d8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', color: '#526348', fontWeight: '600' }}>Calculated Total Amount:</span>
                                    <strong style={{ fontSize: '20px', color: '#7A8F6E' }}>Rs. {calculateTotal()}</strong>
                                </div>

                                <div style={gridTwoColStyle}>
                                    <div>
                                        <label style={labelStyle}>Paid Amount (Rs.)</label>
                                        <input 
                                            type="number" 
                                            value={billData.paidAmount} 
                                            onChange={(e) => handleInputChange('paidAmount', e.target.value)}
                                            style={inputStyle} 
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Payment Status</label>
                                        <select 
                                            value={billData.paymentStatus} 
                                            onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                                            style={inputStyle}
                                        >
                                            <option value="Paid">Paid</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Partial">Partial</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #f1f5f9', paddingTop: '15px' }}>
                                    <button 
                                        type="button" 
                                        onClick={handleCloseModal}
                                        style={cancelBtnStyle}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        style={primaryBtnStyle}
                                    >
                                        Save & Generate Invoice
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Styles Toolkit
const thStyle = { padding: '12px 16px', color: '#4a5568', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.03em' };
const tdStyle = { padding: '14px 16px', color: '#4a5568', fontSize: '14px', borderBottom: '1px solid #f1f5f9' };
const trHoverStyle = { transition: 'background 0.2s', cursor: 'default' };
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600', color: '#4a5568' };
const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '14px', color: '#2d3748' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(45, 55, 72, 0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContentStyle = { background: '#ffffff', padding: '24px', borderRadius: '12px', width: '460px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)' };
const gridTwoColStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' };

const primaryBtnStyle = {
    padding: '10px 18px',
    background: '#7A8F6E',
    color: '#ffffff',
    borderRadius: '7px',
    border: 'none',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(122, 143, 110, 0.25)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
};

const cancelBtnStyle = {
    padding: '10px 16px',
    background: '#f8faf7',
    color: '#4a5568',
    borderRadius: '7px',
    border: '1px solid #cbd5e1',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer'
};

const actionBtnStyle = {
    padding: '6px 12px',
    background: '#ffffff',
    color: '#2d3748',
    border: '1px solid #cbd5e1',
    borderRadius: '6px',
    fontWeight: '600',
    fontSize: '12px',
    cursor: 'pointer'
};

export default BillingPayments;