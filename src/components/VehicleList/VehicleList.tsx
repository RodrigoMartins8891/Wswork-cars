import React, { useState } from 'react';
import { Car } from '../../types';
import VehicleCard from '../VehicleCard/VehicleCard';
import { ChevronDown, ChevronRight, Car as CarIcon } from 'lucide-react';
import './VehicleList.css';

export interface VehicleListProps {
  carsByBrand: Record<string, Car[]>;
  newCarIds?: number[];
  onCarClick?: (car: Car) => void;
  viewMode?: 'grid' | 'list';
  defaultExpanded?: boolean;
  emptyMessage?: string;
  loading?: boolean;
}

const BrandSection: React.FC<{
  brand: string;
  cars: Car[];
  newCarIds: number[];
  onCarClick?: (car: Car) => void;
  viewMode: 'grid' | 'list';
  defaultExpanded: boolean;
}> = ({ brand, cars, newCarIds, onCarClick, viewMode, defaultExpanded }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <section className="brand-section" aria-label={`Marca ${brand}`}>
      <button
        className="brand-header"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className="brand-info">
          <div className="brand-avatar" aria-hidden="true">
            {brand.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="brand-name">{brand}</h2>
            <p className="brand-count">{cars.length} {cars.length === 1 ? 'veículo' : 'veículos'}</p>
          </div>
        </div>
        <span className="brand-chevron" aria-hidden="true">
          {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      {expanded && (
        <div className={`brand-cars ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {cars.map(car => (
            <VehicleCard
              key={car.id}
              car={car}
              isNew={newCarIds.includes(car.id)}
              onClick={onCarClick}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const SkeletonCard: React.FC = () => (
  <div className="skeleton-card">
    <div className="shimmer skeleton-title" />
    <div className="shimmer skeleton-line" />
    <div className="shimmer skeleton-line short" />
  </div>
);


const VehicleList: React.FC<VehicleListProps> = ({
  carsByBrand,
  newCarIds = [],
  onCarClick,
  viewMode = 'grid',
  defaultExpanded = true,
  emptyMessage = 'Nenhum veículo encontrado.',
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="vehicle-list" aria-busy="true" aria-label="Carregando veículos">
        {[1, 2, 3].map(i => (
          <div key={i} className="brand-section">
            <div className="brand-header" style={{ pointerEvents: 'none' }}>
              <div className="brand-info">
                <div className="shimmer brand-avatar" />
                <div>
                  <div className="shimmer" style={{ width: 100, height: 18, borderRadius: 6, marginBottom: 6 }} />
                  <div className="shimmer" style={{ width: 60, height: 13, borderRadius: 4 }} />
                </div>
              </div>
            </div>
            <div className="brand-cars grid-view">
              {[1, 2].map(j => <SkeletonCard key={j} />)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const brands = Object.keys(carsByBrand).sort();

  if (brands.length === 0) {
    return (
      <div className="vehicle-list-empty" role="status">
        <CarIcon size={48} opacity={0.3} />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="vehicle-list" role="list" aria-label="Listagem de veículos por marca">
      {brands.map(brand => (
        <BrandSection
          key={brand}
          brand={brand}
          cars={carsByBrand[brand]}
          newCarIds={newCarIds}
          onCarClick={onCarClick}
          viewMode={viewMode}
          defaultExpanded={defaultExpanded}
        />
      ))}
    </div>
  );
};

export default VehicleList;
