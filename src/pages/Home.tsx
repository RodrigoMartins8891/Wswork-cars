import React, { useEffect, useState } from 'react';
import { useCarStore } from '../store/carStore';
import VehicleList from '../components/VehicleList/VehicleList';
import { Search, SlidersHorizontal, X, LayoutGrid, List, Info } from 'lucide-react';
import './Home.css';

const FUELS = ['FLEX', 'GASOLINA', 'DIESEL', 'ELÉTRICO', 'HÍBRIDO'];
const CURRENT_YEAR = new Date().getFullYear();

const Home: React.FC = () => {
  const { fetchCars, loading, error, apiWarning, filters, setFilters, resetFilters, getCarsByBrand, localCars } = useCarStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const carsByBrand = getCarsByBrand();
  const totalCars = Object.values(carsByBrand).reduce((acc, c) => acc + c.length, 0);
  const newCarIds = localCars.map(c => c.id);

  const hasActiveFilters = filters.search || filters.combustivel || filters.ano_min || filters.ano_max || filters.valor_min || filters.valor_max || filters.cor;

  return (
    <div className="home page-enter">
      <div className="home-hero">
        <div className="home-hero-text">
          <h1 className="home-title">Encontre seu<br /><span className="gradient-text">veículo ideal</span></h1>
          <p className="home-subtitle">
            {totalCars} veículos disponíveis · {Object.keys(carsByBrand).length} marcas
          </p>
        </div>

        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="search"
            placeholder="Buscar por modelo, marca, cor..."
            value={filters.search}
            onChange={e => setFilters({ search: e.target.value })}
            className="search-input"
            aria-label="Buscar veículos"
          />
          {filters.search && (
            <button onClick={() => setFilters({ search: '' })} className="search-clear" aria-label="Limpar busca">
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <button
            className={`toolbar-btn ${showFilters ? 'active' : ''} ${hasActiveFilters ? 'has-badge' : ''}`}
            onClick={() => setShowFilters(s => !s)}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal size={15} />
            Filtros
            {hasActiveFilters && <span className="filter-badge" aria-label="Filtros ativos" />}
          </button>
          {hasActiveFilters && (
            <button className="toolbar-btn" onClick={resetFilters}>
              <X size={14} /> Limpar filtros
            </button>
          )}
        </div>
        <div className="toolbar-right">
          <span className="result-count" aria-live="polite">{totalCars} resultado{totalCars !== 1 ? 's' : ''}</span>
          <div className="view-toggle" role="group" aria-label="Modo de visualização">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              title="Grade"
            ><LayoutGrid size={16} /></button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
              title="Lista"
            ><List size={16} /></button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel" aria-label="Painel de filtros">
          <div className="filters-grid">
            <div className="filter-group">
              <label className="filter-label">Combustível</label>
              <div className="filter-chips">
                {FUELS.map(f => (
                  <button
                    key={f}
                    className={`chip ${filters.combustivel === f ? 'selected' : ''}`}
                    onClick={() => setFilters({ combustivel: filters.combustivel === f ? '' : f })}
                    aria-pressed={filters.combustivel === f}
                  >{f}</button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Ano</label>
              <div className="filter-range">
                <input
                  type="number"
                  placeholder="De"
                  min={1950}
                  max={CURRENT_YEAR + 1}
                  value={filters.ano_min || ''}
                  onChange={e => setFilters({ ano_min: e.target.value ? +e.target.value : null })}
                  className="filter-input"
                  aria-label="Ano mínimo"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Até"
                  min={1950}
                  max={CURRENT_YEAR + 1}
                  value={filters.ano_max || ''}
                  onChange={e => setFilters({ ano_max: e.target.value ? +e.target.value : null })}
                  className="filter-input"
                  aria-label="Ano máximo"
                />
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">Valor (R$ mil)</label>
              <div className="filter-range">
                <input
                  type="number"
                  placeholder="De"
                  value={filters.valor_min || ''}
                  onChange={e => setFilters({ valor_min: e.target.value ? +e.target.value : null })}
                  className="filter-input"
                  aria-label="Valor mínimo"
                />
                <span>—</span>
                <input
                  type="number"
                  placeholder="Até"
                  value={filters.valor_max || ''}
                  onChange={e => setFilters({ valor_max: e.target.value ? +e.target.value : null })}
                  className="filter-input"
                  aria-label="Valor máximo"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {apiWarning && (
        <div className="warning-banner" role="status">
          <Info size={15} />
          A API da WSWork retornou CORS error — exibindo dados de demonstração. Os dados reais seriam idênticos à estrutura dos JSONs fornecidos.
        </div>
      )}

      {error && (
        <div className="error-banner" role="alert">
          <X size={16} /> {error}
        </div>
      )}

      <VehicleList
        carsByBrand={carsByBrand}
        newCarIds={newCarIds}
        viewMode={viewMode}
        loading={loading}
        defaultExpanded
        emptyMessage={hasActiveFilters ? 'Nenhum veículo encontrado com esses filtros.' : 'Nenhum veículo disponível.'}
      />
    </div>
  );
};

export default Home;
