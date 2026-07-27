import { jsPDF } from 'jspdf';
import { Download, FileCheck, Printer, FileText } from 'lucide-react';

const PrecPDF = ({ data, onDownloadComplete }) => {
    if (!data) return null;

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            const { 
                patientId, 
                patientName, 
                patientAge, 
                patientGender, 
                patientImage, 
                diagnosis, 
                medicines, 
                advice, 
                date 
            } = data;

            // 🎨 Theme Colors
            const primaryColor = [14, 131, 136];   // Teal `#0E8388`
            const darkBg = [28, 42, 43];          // Dark Slate `#1C2A2B`
            const textDark = [30, 41, 59];         // Charcoal `#1E293B`
            const borderGray = [226, 232, 240];    // Slate Gray `#E2E8F0`

            // 1. TOP HEADER BANNER
            doc.setFillColor(...darkBg);
            doc.rect(0, 0, 210, 36, 'F');

            // Accent Bar Below Header
            doc.setFillColor(...primaryColor);
            doc.rect(0, 36, 210, 3, 'F');

            // Hospital Branding Text
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont("helvetica", "bold");
            doc.text("CITY GENERAL HOSPITAL", 15, 20);

            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(203, 213, 225);
            doc.text("OUTPATIENT DEPARTMENT (OPD) • OFFICIAL PRESCRIPTION", 15, 28);

            // Rx Emblem Badge (Top Right)
            doc.setFillColor(...primaryColor);
            doc.roundedRect(162, 8, 33, 20, 3, 3, 'F');
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(255, 255, 255);
            doc.text("Rx", 174, 22);

            // 2. PATIENT INFORMATION CARD
            const cardY = 46;
            doc.setFillColor(248, 250, 252); // Light Slate Box
            doc.roundedRect(15, cardY, 180, 36, 3, 3, 'F');
            doc.setDrawColor(...borderGray);
            doc.roundedRect(15, cardY, 180, 36, 3, 3, 'D');

            // Patient Photo or Initial Badge
            if (patientImage) {
                try {
                    doc.addImage(patientImage, 'JPEG', 20, cardY + 4, 28, 28);
                } catch {
                    renderImageFallback(doc, cardY, patientName);
                }
            } else {
                renderImageFallback(doc, cardY, patientName);
            }

            // Patient Info Text Columns
            const rxDate = date ? new Date(date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : new Date().toLocaleDateString();
            
            const textStartX = 54;
            doc.setTextColor(...textDark);
            
            // Name
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Patient: ${patientName || 'Anonymous'}`, textStartX, cardY + 12);

            // Token ID & Age/Gender
            doc.setFontSize(9.5);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(71, 85, 105);
            doc.text(`Token / ID: #${patientId || 'N/A'}`, textStartX, cardY + 20);
            doc.text(`Age / Gender: ${patientAge || 'N/A'} Yrs | ${patientGender || 'N/A'}`, textStartX, cardY + 27);

            // Date on Right Column
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primaryColor);
            doc.text(`Date: ${rxDate}`, 152, cardY + 12);

            // 3. DIAGNOSIS & SYMPTOMS SECTION
            let currentY = 92;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(...primaryColor);
            doc.text("1. DIAGNOSIS & CLINICAL OBSERVATIONS", 15, currentY);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(...textDark);
            const diagLines = doc.splitTextToSize(diagnosis || 'No specific diagnosis specified.', 175);
            doc.text(diagLines, 20, currentY + 7);

            currentY += 7 + (diagLines.length * 5) + 6;

            // Separator Line
            doc.setDrawColor(...borderGray);
            doc.line(15, currentY, 195, currentY);

            // 4. PRESCRIBED MEDICINES (Rx)
            currentY += 10;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(...primaryColor);
            doc.text("2. PRESCRIBED MEDICINES & DOSAGE", 15, currentY);

            currentY += 8;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(...textDark);

            const medLines = doc.splitTextToSize(medicines || 'No medicines prescribed.', 170);
            doc.text(medLines, 20, currentY);

            currentY += (medLines.length * 6) + 8;

            // Separator Line
            doc.setDrawColor(...borderGray);
            doc.line(15, currentY, 195, currentY);

            // 5. DOCTOR'S ADVICE & INSTRUCTIONS
            currentY += 10;
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(...primaryColor);
            doc.text("3. ADVICE & FOLLOW-UP INSTRUCTIONS", 15, currentY);

            currentY += 7;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(9.5);
            doc.setTextColor(...textDark);
            const adviceLines = doc.splitTextToSize(advice || 'No additional follow-up advice.', 175);
            doc.text(adviceLines, 20, currentY);

            // 6. FOOTER & SIGNATURE SECTION
            const footerY = 250;
            doc.setDrawColor(...borderGray);
            doc.line(125, footerY, 195, footerY); // Signature line

            doc.setFont("helvetica", "bold");
            doc.setFontSize(9.5);
            doc.setTextColor(...darkBg);
            doc.text("Attending Physician", 140, footerY + 5);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text("Authorized Medical Stamp & Signature", 132, footerY + 10);

            // Bottom Disclaimer Banner
            doc.setFillColor(241, 245, 249);
            doc.rect(0, 278, 210, 19, 'F');

            doc.setFontSize(7.5);
            doc.setTextColor(100, 116, 139);
            doc.text("This is an officially verified computer-generated medical prescription document.", 15, 286);
            doc.text("For emergency queries, please visit City General Hospital OPD Desk.", 15, 290);

            // Save PDF
            const cleanFileName = `Prescription_${patientName?.replace(/\s+/g, '_') || 'Patient'}_${patientId}.pdf`;
            doc.save(cleanFileName);

            // Trigger Right Side Toast Popup in Parent Component
            if (onDownloadComplete) {
                onDownloadComplete();
            }

        } catch (error) {
            console.error("PDF Generation Error:", error);
            alert("Unable to generate PDF. Please verify data inputs.");
        }
    };

    // Helper method for fallback avatar badge in PDF
    const renderImageFallback = (doc, cardY, patientName) => {
        doc.setFillColor(14, 131, 136);
        doc.roundedRect(20, cardY + 4, 28, 28, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        const initial = patientName ? patientName.charAt(0).toUpperCase() : 'P';
        doc.text(initial, 31, cardY + 22);
    };

    return (
        <div style={{ 
            background: '#FFFFFF', 
            padding: '24px', 
            borderRadius: '12px', 
            border: '1px solid #0E8388', 
            boxShadow: '0 8px 24px rgba(14, 131, 136, 0.08)' 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'rgba(14, 131, 136, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0E8388'
                }}>
                    <FileCheck size={18} />
                </div>
                <h3 style={{ margin: 0, color: '#1C2A2B', fontSize: '16px', fontWeight: '700' }}>
                    Prescription Ready
                </h3>
            </div>

            <p style={{ color: '#64748B', fontSize: '13px', margin: '0 0 18px 0', lineHeight: '1.5' }}>
                Rx document generated for <strong style={{ color: '#1C2A2B' }}>{data.patientName || `Token #${data.patientId}`}</strong>. Preview and download official PDF below.
            </p>

            <button
                type="button"
                onClick={generatePDF}
                style={{
                    width: '100%',
                    padding: '12px 18px',
                    background: '#0E8388',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '700',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 12px rgba(14, 131, 136, 0.25)',
                    transition: 'background 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#0B6B6F'}
                onMouseOut={(e) => e.currentTarget.style.background = '#0E8388'}
            >
                <Download size={18} />
                <span>Download Official PDF Prescription</span>
            </button>
        </div>
    );
};

export default PrecPDF;