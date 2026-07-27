const express = require('express');
const router = express.Router();
const Appointment = require('../model/Appointment.model');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/all', verifyToken, async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ appointmentDate: 1 })
            .populate('patientId', 'name age disease totalBill status')
            .populate('doctorId', 'name specialty roomNo fee');

        res.status(200).json({ appointments });
    } catch (err) {
        res.status(500).json({ message: 'Unable to fetch appointments', error: err.message });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { patientId, doctorId, appointmentDate, reason } = req.body;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const countToday = await Appointment.countDocuments({
            doctorId,
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        const newAppointment = new Appointment({
            patientId,
            doctorId,
            appointmentDate,
            reason,
            tokenNumber: countToday + 1
        });

        await newAppointment.save();
        res.status(201).json({ message: 'Appointment booked successfully!', appointment: newAppointment });
    } catch (err) {
        res.status(500).json({ message: 'Appointment creation failed', error: err.message });
    }
});

router.put('/status/:id', verifyToken, async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json({ message: 'Appointment status updated', appointment: updated });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update status', error: err.message });
    }
});

module.exports = router;