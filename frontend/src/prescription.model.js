const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming doctors are also users
        required: true
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true
    },
    medicines: {
        type: String, // Can be a multi-line string
        required: true,
        trim: true
    },
    advice: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);
module.exports = Prescription;