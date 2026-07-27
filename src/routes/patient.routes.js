const express = require('express');
const multer = require('multer');
const patientController = require('../controllers/patient.controller');
const { verifyToken, isStaff, isAdmin } = require('../middlewares/auth.middleware');

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

// Staff Routes
router.post('/add', verifyToken, isStaff, upload.single('patientImage'), patientController.addPatient);
router.get('/all', verifyToken, isStaff, patientController.getAllPatients);
router.get('/:id', verifyToken, isStaff, patientController.getPatientById);
router.put('/update/:id', verifyToken, isStaff, patientController.updatePatient);
router.delete('/delete/:id', verifyToken, isStaff, patientController.deletePatient);
router.put('/discharge/:id', verifyToken, isStaff, patientController.dischargePatient);

// Admin Route
router.get('/admin/dashboard', verifyToken, isAdmin, patientController.getAdminDashboard);

module.exports = router;