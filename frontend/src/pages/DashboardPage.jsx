import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  return (
    <div className="container">
      <h2>Dashboard Principal</h2>
      <div className="row mt-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Categorías</h5>
              <p className="card-text">Gestiona las categorías de incidentes</p>
              <Link to="/categories" className="btn btn-primary">Ir a Categorías</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Departamentos</h5>
              <p className="card-text">Administra los departamentos</p>
              <Link to="/departments" className="btn btn-success">Ir a Departamentos</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Incidentes</h5>
              <p className="card-text">Gestiona los incidentes reportados</p>
              <button className="btn btn-warning" disabled>Próximamente</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;