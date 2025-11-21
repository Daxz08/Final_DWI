import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminLayout({ children }) {
  const location = useLocation();

  return (
    <div className="container mt-4">
      <nav className="mb-4">
        <h3 className="mb-3">Panel de Administración UCV</h3>
        
        <div className="d-flex flex-wrap gap-2">
          <Link 
            to="/" 
            className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-outline-primary'}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/categories" 
            className={`btn ${location.pathname === '/categories' ? 'btn-info' : 'btn-outline-info'}`}
          >
            Categorías
          </Link>
          <Link 
            to="/departments" 
            className={`btn ${location.pathname === '/departments' ? 'btn-success' : 'btn-outline-success'}`}
          >
            Departamentos
          </Link>

          <Link 
  to="/incidents" 
  className={`btn ${location.pathname === '/incidents' ? 'btn-warning' : 'btn-outline-warning'}`}
>
  Incidentes
</Link>
          
          <button className="btn btn-outline-secondary" disabled>
            Reportes
          </button>

          <button 
            className="btn btn-danger ms-auto"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      {children}
    </div>
  );
}
