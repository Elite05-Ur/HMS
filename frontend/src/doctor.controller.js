const Prescription = require('../models/prescription.model');
const Appointment = require('../models/appointment.model');
const Patient = require('../models/patient.model');
const Doctor = require('../models/doctor.model');
const User = require('../models/user.model');

// 1. Add New Prescription
exports.addPrescription = async (req, res) => {
    try {
        const { patientId, diagnosis, medicines, advice } = req.body;
        const doctorId = req.user.id; // Assuming req.user.id contains the logged-in doctor's user ID

        if (!patientId || !diagnosis || !medicines) {
            return res.status(400).json({ message: "Patient ID, diagnosis, and medicines are required." });
        }

        // Find the patient to ensure the ID is valid before creating the prescription
        const patient = await Patient.findById(patientId).catch(() => null);
        if (!patient) {
            return res.status(404).json({ message: `Patient with ID "${patientId}" not found.` });
        }

        const newPrescription = await Prescription.create({
            patientId: patient._id,
            doctorId,
            diagnosis,
            medicines,
            advice
        });

        // Populate patient details before sending the response for PDF generation
        const populatedPrescription = await Prescription.findById(newPrescription._id)
            .populate('patientId')
            .populate('doctorId', 'name specialty'); // Also populating doctor name might be useful

        res.status(201).json({
            message: "Prescription added successfully!",
            prescription: populatedPrescription
        });
    } catch (error) {
        console.error("Error adding prescription:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: `Invalid Patient ID format: "${req.body.patientId}".` });
        }
        res.status(500).json({ message: "Server error while adding prescription.", error: error.message });
    }
};

// 2. Get Doctor Dashboard Data (Appointments & Stats)
exports.getDoctorDashboard = async (req, res) => {
    try {
        const doctorUserId = req.user.id; // Logged-in doctor's user ID

        // Find the doctor's profile linked to the user ID
        const doctorProfile = await Doctor.findOne({ userId: doctorUserId });

        if (!doctorProfile) {
            return res.status(404).json({ message: "Doctor profile not found." });
        }

        // Get today's appointments for this doctor
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayAppointments = await Appointment.find({
            doctorId: doctorUserId,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('patientId', 'name age gender disease').sort('appointmentDate');

        const totalToday = todayAppointments.length;
        const completedToday = todayAppointments.filter(app => app.status === 'Completed').length;
        const pendingToday = todayAppointments.filter(app => app.status === 'Scheduled').length;

        res.status(200).json({
            message: "Doctor dashboard data fetched successfully!",
            doctorInfo: {
                name: doctorProfile.name,
                specialty: doctorProfile.specialty,
                roomNo: doctorProfile.roomNo,
                timing: doctorProfile.timing,
                fee: doctorProfile.fee,
                status: doctorProfile.status
            },
            stats: {
                totalToday,
                completedToday,
                pendingToday
            },
            queue: todayAppointments
        });
    } catch (error) {
        console.error("Error fetching doctor dashboard:", error);
        res.status(500).json({ message: "Server error while fetching doctor dashboard.", error: error.message });
    }
};

// 3. Update Appointment Status (Used by DoctorDashboard)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: "Invalid appointment status." });
        }

        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: "Appointment not found." });
        }

        res.status(200).json({
            message: "Appointment status updated successfully!",
            appointment: updatedAppointment
        });
    } catch (error) {
        console.error("Error updating appointment status:", error);
        res.status(500).json({ message: "Server error while updating appointment status.", error: error.message });
    }
};

// 4. Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
    try {
        const doctorUserId = req.user.id;
        const doctor = await Doctor.findOne({ userId: doctorUserId });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor profile not found." });
        }
        res.status(200).json(doctor);
    } catch (error) {
        console.error("Error fetching doctor profile:", error);
        res.status(500).json({ message: "Server error while fetching doctor profile.", error: error.message });
    }
};

// 5. Update Doctor Profile
exports.updateDoctorProfile = async (req, res) => {
    try {
        const doctorUserId = req.user.id;
        const { name, specialty, roomNo, timing, fee, status } = req.body;

        const updatedDoctor = await Doctor.findOneAndUpdate(
            { userId: doctorUserId },
            { name, specialty, roomNo, timing, fee, status },
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor profile not found." });
        }
        res.status(200).json({ message: "Doctor profile updated successfully!", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error updating doctor profile:", error);
        res.status(500).json({ message: "Server error while updating doctor profile.", error: error.message });
    }
};

// 6. Get Doctor Schedule (Uses profile data)
exports.getDoctorSchedule = async (req, res) => {
    try {
        const doctorUserId = req.user.id;
        const doctor = await Doctor.findOne({ userId: doctorUserId });

        if (!doctor) {
            return res.status(404).json({ message: "Doctor schedule not found." });
        }
        // Return relevant schedule info
        res.status(200).json({
            roomNo: doctor.roomNo,
            days: doctor.timing ? doctor.timing.split(' ')[0] : 'Monday to Friday', // Assuming timing format "Days HH:MM - HH:MM"
            timing: doctor.timing ? doctor.timing.split(' ').slice(1).join(' ') : '09:00 AM - 05:00 PM',
            status: doctor.status
        });
    } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        res.status(500).json({ message: "Server error while fetching doctor schedule.", error: error.message });
    }
};

// 7. Update Doctor Schedule
exports.updateDoctorSchedule = async (req, res) => {
    try {
        const doctorUserId = req.user.id;
        const { roomNo, days, timing, status } = req.body;

        const updatedDoctor = await Doctor.findOneAndUpdate(
            { userId: doctorUserId },
            { roomNo, timing: `${days} ${timing}`, status }, // Combine days and timing
            { new: true, runValidators: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor schedule not found." });
        }
        res.status(200).json({ message: "Doctor schedule updated successfully!", doctor: updatedDoctor });
    } catch (error) {
        console.error("Error updating doctor schedule:", error);
        res.status(500).json({ message: "Server error while updating doctor schedule.", error: error.message });
    }
};

// 8. Get Assigned Patients
exports.getAssignedPatients = async (req, res) => {
    try {
        const doctorUserId = req.user.id;
        const doctorProfile = await Doctor.findOne({ userId: doctorUserId });

        if (!doctorProfile) {
            return res.status(404).json({ message: "Doctor profile not found." });
        }

        // Find all appointments for this doctor
        const appointments = await Appointment.find({ doctorId: doctorUserId })
            .populate('patientId', 'name age gender phone') // Populate patient details
            .sort({ appointmentDate: -1 });

        // Extract unique patients from these appointments
        const patientMap = new Map();
        appointments.forEach(app => {
            if (app.patientId && !patientMap.has(app.patientId._id.toString())) {
                patientMap.set(app.patientId._id.toString(), {
                    _id: app.patientId._id,
                    name: app.patientId.name,
                    age: app.patientId.age,
                    gender: app.patientId.gender,
                    phone: app.patientId.phone,
                    lastVisit: app.appointmentDate.toLocaleDateString(), // Last visit date
                    tokenNo: app.tokenNumber // Assuming token number is relevant
                });
            }
        });

        const assignedPatients = Array.from(patientMap.values());

        res.status(200).json({
            message: "Assigned patients fetched successfully!",
            patients: assignedPatients
        });
    } catch (error) {
        console.error("Error fetching assigned patients:", error);
        res.status(500).json({ message: "Server error while fetching assigned patients.", error: error.message });
    }
};