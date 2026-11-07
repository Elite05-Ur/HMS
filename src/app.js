const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors');

const authRoutes = require('./routes/auth.routes')
const patientRoutes = require('./routes/patient.routes')
const doctorRoutes = require('./routes/doctor.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const billingRoutes = require('./routes/billing.routes');
const reportRoutes = require('./routes/report.routes');
const app = express()

 const allowedOrigins = [
    'http://localhost:5173',
    'https://hospital-managment-system-chi.vercel.app',
 ].filter(Boolean); // Yeh undefined values ko hata dega agar env set na ho

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json())
app.use(cookieParser())


 

app.use('/api/auth', authRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/appointment', appointmentRoutes)
app.use('/api/billing', billingRoutes)
app.use('/api/report', reportRoutes)

module.exports = app