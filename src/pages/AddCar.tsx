import React from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleForm from '../components/VehicleForm/VehicleForm';
import { ArrowLeft, Plus } from 'lucide-react';
import './AddCar.css';

const AddCar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="add-car-page page-enter">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="page-title"><Plus size={22} className="title-icon" />Cadastrar Veículo</h1>
          <p className="page-subtitle">Preencha as informações do novo veículo</p>
        </div>
      </div>

      <div className="form-card">
        <VehicleForm onSuccess={() => setTimeout(() => navigate('/'), 600)} />
      </div>
    </div>
  );
};

export default AddCar;
