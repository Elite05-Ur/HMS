const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient',
        required: true
    },
    doctorFee: { type: Number, default: 0 },
    roomCharges: { type: Number, default: 0 },
    testCharges: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Billing', billingSchema);
