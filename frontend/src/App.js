import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

// Importar páginas - SIN extensiones
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import CategoriesPage from "./pages/CategoriesPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import IncidentsPage from "./pages/IncidentsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />  
        {/* Rutas Protegidas */}
        <Route
          path="/"  
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DashboardPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <CategoriesPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/departments"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <DepartmentsPage />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        <Route path="/category" element={<Navigate to="/categories" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      <Route
  path="/incidents"
  element={
    <ProtectedRoute>
      <AdminLayout>
        <IncidentsPage />
      </AdminLayout>
    </ProtectedRoute>
  }
/>
      
      </Routes>
    </Router>
  );
}

export default App;