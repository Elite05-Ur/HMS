const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'patient',
        required: true
    },
    reportTitle: { type: String, required: true },
    testDate: { type: Date },
    labDoctor: { type: String },
    fileUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);
