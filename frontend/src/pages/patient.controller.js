// Assuming other controller functions and imports are here
import Patient from '../models/patient.model.js'; // Adjust path as per your project structure

// ... (existing controller functions like addPatient, getAllPatients, etc.)

export const getAdminDashboardStats = async (req, res) => {
    try {
        const allPatients = await Patient.find({});

        if (!allPatients) {
            return res.status(404).json({ message: "No patients found for dashboard stats." });
        }

        const totalPatients = allPatients.length;
        const activePatients = allPatients.filter(p => p.status === 'working').length;
        const dischargedPatients = allPatients.filter(p => p.status === 'final').length; // Assuming 'final' status for discharged
        
        const totalEarnings = allPatients.reduce((acc, patient) => acc + (patient.totalBill || 0), 0);

        return res.status(200).json({
            message: "Admin dashboard stats fetched successfully",
            totalPatients,
            activePatients,
            dischargedPatients,
            totalEarnings
        });

    } catch (error) {
        console.error("Error fetching admin dashboard stats:", error);
        return res.status(500).json({ message: "Server error while fetching admin dashboard stats." });
    }
};