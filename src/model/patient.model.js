const mongoose = require('mongoose')

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    admissionDate: {
        type: Date,
        default: Date.now
    },
    dischargeDate: {
        type: Date
    },
    totalBill: {
        type: Number,
        required: true
    },
    patientImage: {
        type: String, // ImageKit ka image URL
        required: true
    },
    status: {
        type: String,
        enum: ['working', 'final'], // 'working' = Hospital me hai, 'final' = Discharged/Free
        default: 'working'
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Staff member jisne entry ki
        required: true
    }
}, { timestamps: true })

const patientModel = mongoose.model('patient', patientSchema)

module.exports = patientModel