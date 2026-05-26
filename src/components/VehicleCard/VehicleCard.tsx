import React from 'react';
import { Car } from '../../types';
import { Fuel, DoorOpen, Calendar, Palette } from 'lucide-react';
import './VehicleCard.css';

interface VehicleCardProps {
  car: Car;
  isNew?: boolean;
  onClick?: (car: Car) => void;
}

const fuelColors: Record<string, string> = {
  FLEX: '#a78bfa',
  GASOLINA: '#fbbf24',
  DIESEL: '#60a5fa',
  'ELÉTRICO': '#22d3a5',
  'HÍBRIDO': '#f472b6',
};

const colorMap: Record<string, string> = {
  BRANCA: '#f8f8f8',
  PRETA: '#222',
  PRETO: '#222',
  AZUL: '#3b82f6',
  VERMELHA: '#ef4444',
  VERMELHO: '#ef4444',
  PRATA: '#9ca3af',
  CINZA: '#6b7280',
  BEGE: '#d4b896',
  AMARELA: '#facc15',
  AMARELO: '#facc15',
  VERDE: '#22c55e',
};

const VehicleCard: React.FC<VehicleCardProps> = ({ car, isNew = false, onClick }) => {
  const fuelColor = fuelColors[car.combustivel] || '#a78bfa';
  const dotColor = colorMap[car.cor.toUpperCase()] || '#888';
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
  }).format(car.valor * 1000);

  return (
    <article
      className={`vehicle-card ${onClick ? 'clickable' : ''}`}
      onClick={() => onClick?.(car)}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => e.key === 'Enter' && onClick?.(car)}
      aria-label={`${car.nome_modelo} ${car.ano}`}
    >
      {isNew && <span className="card-badge-new">Novo</span>}

      <div className="card-header">
        <div>
          <h3 className="card-title">{car.nome_modelo}</h3>
          <p className="card-subtitle">ID #{car.id} · Mod. {car.modelo_id}</p>
        </div>
        <div className="card-value">{formattedValue}</div>
      </div>

      <div className="card-divider" />

      <div className="card-details">
        <div className="card-detail">
          <Calendar size={13} />
          <span>{car.ano}</span>
        </div>
        <div className="card-detail">
          <Fuel size={13} />
          <span style={{ color: fuelColor }}>{car.combustivel}</span>
        </div>
        <div className="card-detail">
          <DoorOpen size={13} />
          <span>{car.num_portas} portas</span>
        </div>
        <div className="card-detail">
          <Palette size={13} />
          <span className="color-dot-wrapper">
            <span className="color-dot" style={{ background: dotColor, border: car.cor.toUpperCase() === 'BRANCA' ? '1px solid #444' : 'none' }} />
            {car.cor}
          </span>
        </div>
      </div>
    </article>
  );
};

export default VehicleCard;
