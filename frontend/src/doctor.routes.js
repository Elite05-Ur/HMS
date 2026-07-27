const express = require('express');
const {
    addPrescription,
    getDoctorDashboard,
    updateAppointmentStatus,
    getDoctorProfile,
    updateDoctorProfile,
    getDoctorSchedule,
    updateDoctorSchedule,
    getAssignedPatients
} = require('../controllers/doctor.controller');
const { verifyJWT, verifyDoctor } = require('../middlewares/auth.middleware'); // Assuming these exist

const router = express.Router();

router.get('/dashboard', verifyJWT, verifyDoctor, getDoctorDashboard);
router.post('/prescription', verifyJWT, verifyDoctor, addPrescription);
router.put('/appointment/status/:id', verifyJWT, verifyDoctor, updateAppointmentStatus);
router.get('/profile', verifyJWT, verifyDoctor, getDoctorProfile);
router.put('/profile', verifyJWT, verifyDoctor, updateDoctorProfile);
router.get('/schedule', verifyJWT, verifyDoctor, getDoctorSchedule);
router.put('/schedule', verifyJWT, verifyDoctor, updateDoctorSchedule);
router.get('/patients', verifyJWT, verifyDoctor, getAssignedPatients);

module.exports = router;