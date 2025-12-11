import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Páginas
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import SupportDashboard from './pages/dashboard/SupportDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import ReportIncident from './pages/incidents/ReportIncident';
import IncidentList from './pages/incidents/IncidentList';
import EmployeeManagement from './pages/management/EmployeeManagement';
import UserManagement from './pages/management/UserManagement';
import DepartmentCategoryManagement from './pages/management/DepartmentCategoryManagement';
import AdminIncidentManagement from './pages/management/AdminIncidentManagement';
import StudentReports from './pages/reports/StudentReports';
import SupportGenerateReports from './pages/reports/SupportGenerateReports';
import AdminReports from './pages/reports/AdminReports';
import MyReports from './pages/MyReports';
import AssignedIncidents from './pages/support/AssignedIncidents';
import IncidentDetail from './pages/incidents/IncidentDetail';


// Componente de ruta protegida
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Layout>{children}</Layout>;
};

// Componente de ruta pública (solo para no autenticados)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Rutas protegidas por rol */}
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRouter />
            </ProtectedRoute>
          } />

          <Route path="/student/*" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />

          {/* Rutas para estudiantes */}

          <Route path="/student/report" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ReportIncident />
            </ProtectedRoute>
          } />

          <Route path="/student/reports" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentReports />
            </ProtectedRoute>
          } />

          <Route path="/student/incidents" element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <IncidentList />
          </ProtectedRoute>
          } />

          <Route path="/student/incidents/:incidentId" element={
            <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'SUPPORT', 'ADMIN']}>
              <IncidentDetail />
            </ProtectedRoute>
          } />

          <Route path="/teacher/*" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <TeacherDashboard />
            </ProtectedRoute>
          } />

          {/* Rutas para docentes */}
          <Route path="/teacher/report" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <ReportIncident />
            </ProtectedRoute>
          } />

          <Route path="/teacher/incidents" element={
            <ProtectedRoute allowedRoles={['TEACHER']}>
              <IncidentList />
            </ProtectedRoute>
          } />

          <Route path="/support/*" element={
            <ProtectedRoute allowedRoles={['SUPPORT']}>
              <SupportDashboard />
            </ProtectedRoute>
          } />

          {/* Rutas para soporte */}
          <Route path="/support/incidents" element={
            <ProtectedRoute allowedRoles={['SUPPORT']}>
              <IncidentList />
            </ProtectedRoute>
          } />  

          <Route path="/admin/*" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/support/generate-reports" element={
            <ProtectedRoute allowedRoles={['SUPPORT']}>
              <SupportGenerateReports />
            </ProtectedRoute>
          } />

          <Route path="/support/my-reports" element={
            <ProtectedRoute allowedRoles={['SUPPORT']}>
              <MyReports /> {/* Ya deberías tener este componente */}
            </ProtectedRoute>
          } />

          <Route path="/support/assigned" element={
            <ProtectedRoute allowedRoles={['SUPPORT']}>
              <AssignedIncidents /> {/* Ya deberías tener este componente */}
            </ProtectedRoute>
          } />

          {/* Rutas para administradores */}
          <Route path="/admin/employees" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <EmployeeManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/departments-categories" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <DepartmentCategoryManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/incidents" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminIncidentManagement />
            </ProtectedRoute>
          } />

          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminReports />
            </ProtectedRoute>
          } />

          {/* Ruta por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Componente para redirigir al dashboard correcto según el rol
const DashboardRouter = () => {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'STUDENT':
      return <Navigate to="/student" />;
    case 'TEACHER':
      return <Navigate to="/teacher" />;
    case 'SUPPORT':
      return <Navigate to="/support" />;
    case 'ADMIN':
      return <Navigate to="/admin" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default App;