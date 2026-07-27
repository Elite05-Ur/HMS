const Doctor = require('../model/Doctor.model');
const Appointment = require('../model/Appointment.model');
const patientModel = require('../model/patient.model');
const userModel = require('../model/user.model');
const bcrypt = require('bcryptjs');

exports.getDoctorDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;
        const doctor = await Doctor.findOne({ userId });

        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found.' });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayAppointments = await Appointment.find({
            doctorId: doctor._id,
            appointmentDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('patientId', 'name age disease totalBill status');

        const totalToday = todayAppointments.length;
        const completedToday = todayAppointments.filter((app) => app.status === 'Completed').length;
        const pendingToday = todayAppointments.filter((app) => app.status === 'Scheduled').length;

        res.status(200).json({
            doctorInfo: doctor,
            stats: {
                totalToday,
                completedToday,
                pendingToday
            },
            queue: todayAppointments
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error getting doctor stats.', error: err.message });
    }
};

exports.getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().populate('userId', 'email role');
        res.status(200).json(doctors);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching doctors', error: err.message });
    }
};

exports.addDoctor = async (req, res) => {
    try {
        const { name, email, password, specialty, roomNo, fee } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Doctor name, email, and password are required.' });
        }

        const existingUser = await userModel.findOne({ $or: [{ username: name }, { email }] });
        if (existingUser) {
            return res.status(409).json({ message: 'Doctor account already exists.' });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({
            username: name,
            email,
            password: hash,
            role: 'doctor'
        });

        const doctor = await Doctor.create({
            userId: user._id,
            name,
            specialty: specialty || 'General',
            roomNo: roomNo || 'N/A',
            fee: Number(fee) || 1000
        });

        res.status(201).json({ message: 'Doctor created successfully.', user, doctor });
    } catch (err) {
        res.status(500).json({ message: 'Error creating doctor', error: err.message });
    }
};

exports.getDoctorPatients = async (req, res) => {
    try {
        const patients = await patientModel.find().populate('addedBy', 'username').sort({ createdAt: -1 });
        res.status(200).json({ patients });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching patients', error: err.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found.' });
        }

        await Doctor.findByIdAndDelete(req.params.id);
        await userModel.findByIdAndDelete(doctor.userId);
        res.status(200).json({ message: 'Doctor account deleted.' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting doctor', error: err.message });
    }
};