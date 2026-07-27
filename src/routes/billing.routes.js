const express = require('express');
const router = express.Router();
const Billing = require('../model/Billing.model');
const { verifyToken } = require('../middlewares/auth.middleware');

router.get('/all', verifyToken, async (req, res) => {
    try {
        const bills = await Billing.find().populate('patientId', 'name age disease').sort({ createdAt: -1 });
        res.status(200).json({ bills });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create', verifyToken, async (req, res) => {
    try {
        const bill = await Billing.create(req.body);
        res.status(201).json({ message: 'Billing generated successfully.', bill });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
