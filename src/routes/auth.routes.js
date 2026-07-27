const express = require('express')
const authController = require('../controllers/auth.controller')
const { verifyToken } = require('../middlewares/auth.middleware')

const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/register-staff', authController.registerStaff)
router.get('/users', verifyToken, authController.getAllUsers)
router.put('/update-profile', verifyToken, authController.updateProfile)
router.put('/change-password', verifyToken, authController.changePassword)
router.delete('/user/:id', verifyToken, authController.deleteUser)

module.exports = router
