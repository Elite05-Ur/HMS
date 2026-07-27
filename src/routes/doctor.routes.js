const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

router.get('/dashboard', verifyToken, doctorController.getDoctorDashboardStats);
router.get('/all', verifyToken, doctorController.getAllDoctors);
router.get('/patients', verifyToken, doctorController.getDoctorPatients);
router.post('/add', verifyToken, isAdmin, doctorController.addDoctor);
router.delete('/:id', verifyToken, isAdmin, doctorController.deleteDoctor);

module.exports = router;