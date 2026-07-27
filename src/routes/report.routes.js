const express = require('express');
const router = express.Router();
const multer = require('multer');
const Report = require('../model/Report.model');
const { verifyToken } = require('../middlewares/auth.middleware');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/all', verifyToken, async (req, res) => {
    try {
        const reports = await Report.find().populate('patientId', 'name age disease').sort({ createdAt: -1 });
        res.status(200).json({ reports });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        const { patientId, reportTitle, testDate, labDoctor } = req.body;
        const fileUrl = req.file ? `https://placehold.co/600x400?text=${encodeURIComponent(reportTitle || 'Report')}` : '';

        const report = await Report.create({
            patientId,
            reportTitle,
            testDate,
            labDoctor,
            fileUrl
        });

        res.status(201).json({ message: 'Report uploaded successfully.', report });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
