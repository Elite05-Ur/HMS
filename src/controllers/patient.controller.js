const patientModel = require('../model/patient.model');
const mongoose = require('mongoose');
const { uploadFile } = require('../services/storage.service');

// 1. Add New Patient (Staff Only)
async function addPatient(req, res) {
    try { // Ensure 'status' is extracted and saved
        const { name, age, disease, totalBill, status } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Patient Image (DP) is required!" });
        }

        // Image upload to ImageKit
        const imageResult = await uploadFile(req.file.buffer.toString("base64"));

        const patient = await patientModel.create({
            name,
            age,
            disease,
            totalBill,
            status: status || 'working', // Default to 'working' if not provided
            patientImage: imageResult.url,
            addedBy: req.user.id
        });

        res.status(201).json({
            message: "Patient Added Successfully!",
            patient
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 2. Get All Patients (Staff / Admin)
async function getAllPatients(req, res) {
    try {
        const patients = await patientModel.find().populate("addedBy", "username email");
        res.status(200).json({
            message: "Patients fetched successfully!",
            patients
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 3. Get Single Patient Detail (DP aur baki saari details)
async function getPatientById(req, res) {
    try {
        const { id } = req.params;
        let patient;

        // Check if it's a valid ObjectId
        if (mongoose.Types.ObjectId.isValid(id)) {
            patient = await patientModel.findById(id).populate("addedBy", "username");
        }

        // If not found by ID, or if it's not a valid ID, try by a token number
        if (!patient) {
            // This assumes a 'tokenNo' field exists on the patient model.
            patient = await patientModel.findOne({ tokenNo: id }).populate("addedBy", "username");
        }

        if (!patient) {
            return res.status(404).json({ message: `Patient with ID or Token '${id}' not found!` });
        }
        res.status(200).json({ patient });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 4. Edit Patient Data
async function updatePatient(req, res) {
    try {
        const updatedPatient = await patientModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.status(200).json({
            message: "Patient updated successfully!",
            patient: updatedPatient
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 5. Delete Patient Data
async function deletePatient(req, res) {
    try {
        await patientModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Patient record deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 6. Discharge Patient (Receipt Download & Status 'final/free')
async function dischargePatient(req, res) {
    try {
        const patient = await patientModel.findByIdAndUpdate(
            req.params.id,
            {
                status: 'final',
                dischargeDate: new Date()
            },
            { new: true }
        );

        res.status(200).json({
            message: "Patient Discharged Successfully! Status changed to FREE/FINAL.",
            receipt: {
                receiptId: `REC-${patient._id}`,
                patientName: patient.name,
                disease: patient.disease,
                totalBill: patient.totalBill,
                admissionDate: patient.admissionDate,
                dischargeDate: patient.dischargeDate,
                status: "FREE / DISCHARGED"
            },
            patient
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 7. Admin Dashboard Analytics
async function getAdminDashboard(req, res) {
    try {
        const totalPatients = await patientModel.countDocuments();
        const activePatients = await patientModel.countDocuments({ status: 'working' });
        const dischargedPatients = await patientModel.countDocuments({ status: 'final' });

        // Total Earnings calculate karna
        const totalEarnings = await patientModel.aggregate([
            { $group: { _id: null, total: { $sum: "$totalBill" } } }
        ]);

        const totalEarningAmount = totalEarnings.length > 0 ? totalEarnings[0].total : 0;

        res.status(200).json({
            message: "Admin Dashboard Data Fetched!",
            stats: {
                totalPatients,
                activePatients,      // Hospital me jo abhi hain ('working')
                dischargedPatients,  // Jo discharge ho chuke hain ('final')
                totalEarnings: totalEarningAmount
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    dischargePatient,
    getAdminDashboard
};