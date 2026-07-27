import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StaffDashboard from "./pages/StaffDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import EditPatient from "./pages/EditPatient";
import PatientList from "./pages/PatientList"; 
import AddPatient from "./pages/AddPatient";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDetails from "./pages/PatientDetails";
import AppointmentsList from "./pages/AppointmentsList";
import MedicalReports from "./pages/MedicalReports";
import BillingPayments from "./pages/BillingPayments";
import StaffSettings from "./pages/StaffSettings";
import AdminStaffManagement from "./pages/AdminStaffManagement";
import DoctorsList from './pages/DoctorsList';
import AdminRevenue from './pages/AdminRevenue';
import AdminDoctors from './pages/AdminManageAccounts';
import AdminSettings from './pages/AdminSettings';
import AdminManageAccounts from './pages/AdminManageAccounts';
import DoctorPatients from './pages/DoctorPatients';
import DoctorPrescriptions from './pages/DoctorPrescriptions';
import DoctorSchedule from './pages/DoctorSchedule';
import DoctorProfile from './pages/DoctorProfile';
import PrecPDF from './pages/PrecPDF';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/staff-dashboard" element={<ProtectedRoute allowedRole="staff"><StaffDashboard /></ProtectedRoute>}/>
          <Route  path="/admin-dashboard"  element={  <ProtectedRoute allowedRole="admin">  <AdminDashboard /></ProtectedRoute>}/>
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patient/:id" element={<PatientDetails />} />
          <Route path="/edit-patient/:id" element={<EditPatient />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/doctor-dashboard" element={<ProtectedRoute allowedRole="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/reports" element={<MedicalReports />} />
          <Route path="/billing" element={<BillingPayments />} />
          <Route path="/settings" element={<StaffSettings />} />
          <Route path="/admin/staff" element={<AdminStaffManagement />} />
          <Route path="/admin/revenue" element={<AdminRevenue />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/accounts" element={<AdminManageAccounts />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
          <Route path="/doctor/schedule" element={<DoctorSchedule />} />
          <Route path="/doctor/profile" element={<DoctorProfile />} />
          <Route path="/doctor/pdf-preview" element={<PrecPDF />} />


        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
