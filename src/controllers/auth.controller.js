const userModel = require('../model/user.model')
const Doctor = require('../model/Doctor.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

function sanitizeUser(user) {
    const userData = user.toObject ? user.toObject() : { ...user }
    delete userData.password
    return userData
}

async function register(req, res) {
    const { username, email, password, role = 'staff' } = req.body

    const isExist = await userModel.findOne({
        $or: [{ username }, { email }]
    })

    if (isExist) {
        return res.status(409).json({ message: 'User already exists!' })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash,
        role
    })

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN)
    res.cookie('token', token, {
    httpOnly: true,
    secure: true,      // Railway HTTPS use karta hai, is liye true lazmi hai
    sameSite: 'none',  // Localhost frontend aur Railway backend ke beech cookie allow karne ke liye
    maxAge: 24 * 60 * 60 * 1000 // 1 din ka time
});

    res.status(201).json({
        message: 'User Registered Successfully!',
        user: sanitizeUser(user)
    })
}

async function login(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(401).json({ message: 'Account not found!' })
    }

    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
        return res.status(401).json({ message: 'Incorrect Password!' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN)
    res.cookie('token', token, {
    httpOnly: true,
    secure: true,      // Railway HTTPS use karta hai, is liye true lazmi hai
    sameSite: 'none',  // Localhost frontend aur Railway backend ke beech cookie allow karne ke liye
    maxAge: 24 * 60 * 60 * 1000 // 1 din ka time
});

    res.status(200).json({
        message: 'Login Successful!',
        user: sanitizeUser(user)
    })
}

async function registerStaff(req, res) {
    try {
        const { name, username, email, password, role = 'staff', specialty, roomNo, fee } = req.body
        const finalUsername = username || name || email?.split('@')[0]

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required.' })
        }

        const isExist = await userModel.findOne({ $or: [{ username: finalUsername }, { email }] })
        if (isExist) {
            return res.status(409).json({ message: 'Account already exists.' })
        }

        const hash = await bcrypt.hash(password, 10)
        const user = await userModel.create({
            username: finalUsername,
            email,
            password: hash,
            role: role || 'staff'
        })

        if (user.role === 'doctor') {
            await Doctor.create({
                userId: user._id,
                name: name || finalUsername,
                specialty: specialty || 'General',
                roomNo: roomNo || 'N/A',
                fee: Number(fee) || 1000
            })
        }

        res.status(201).json({ message: 'Account created successfully.', user: sanitizeUser(user) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function getAllUsers(req, res) {
    try {
        const users = await userModel.find().sort({ createdAt: -1 })
        res.status(200).json(users.map(sanitizeUser))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function updateProfile(req, res) {
    try {
        const { username, email } = req.body
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        if (username) user.username = username
        if (email) user.email = email
        await user.save()

        res.status(200).json({ message: 'Profile updated.', user: sanitizeUser(user) })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body
        const user = await userModel.findById(req.user.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const valid = await bcrypt.compare(currentPassword, user.password)
        if (!valid) {
            return res.status(401).json({ message: 'Current password is incorrect.' })
        }

        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()

        res.status(200).json({ message: 'Password updated successfully.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

async function deleteUser(req, res) {
    try {
        const user = await userModel.findById(req.params.id)
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        if (user.role === 'doctor') {
            await Doctor.deleteMany({ userId: user._id })
        }

        await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: 'User deleted successfully.' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { register, login, registerStaff, getAllUsers, updateProfile, changePassword, deleteUser }