import { create } from 'zustand';
import { Car, Filters, AIMessage } from '../types';
import { fetchAllCars } from '../services/api';

const BRANDS: Record<number, string> = {
  1: 'Toyota',
  2: 'Volkswagen',
  3: 'Chevrolet',
  4: 'Ford',
  5: 'Honda',
  6: 'Hyundai',
  7: 'Fiat',
  8: 'Nissan',
  9: 'BMW',
  10: 'Mercedes-Benz',
};

function inferBrand(car: Car): string {
  if (car.brand && BRANDS[car.brand]) return BRANDS[car.brand];
  const model = car.nome_modelo.toUpperCase();
  if (['ETIOS','COROLLA','HILLUX','HILUX','YARIS','PRIUS','CAMRY','RAV4'].some(m => model.includes(m))) return 'Toyota';
  if (['JETTA','GOL','POLO','TIGUAN','AMAROK','SAVEIRO','FOX'].some(m => model.includes(m))) return 'Volkswagen';
  if (['ONIX','PRISMA','CRUZE','TRACKER','S10','COBALT','SPIN'].some(m => model.includes(m))) return 'Chevrolet';
  if (['FIESTA','FOCUS','EcoSport','RANGER','KA','FUSION'].some(m => model.includes(m))) return 'Ford';
  if (['CIVIC','FIT','HRV','CRV','CITY'].some(m => model.includes(m))) return 'Honda';
  if (['HB20','TUCSON','CRETA','IX35','ELANTRA'].some(m => model.includes(m))) return 'Hyundai';
  if (['PALIO','STRADA','UNO','TORO','PULSE','MOBI'].some(m => model.includes(m))) return 'Fiat';
  return 'Outras';
}

interface CarStore {
  cars: Car[];
  loading: boolean;
  error: string | null;
  apiWarning: boolean;
  filters: Filters;
  localCars: Car[];
  aiMessages: AIMessage[];
  aiLoading: boolean;

  fetchCars: () => Promise<void>;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
  addCar: (car: Omit<Car, 'id' | 'timestamp_cadastro'>) => void;
  getFilteredCars: () => Car[];
  getCarsByBrand: () => Record<string, Car[]>;
  getBrandName: (car: Car) => string;
  addAIMessage: (msg: AIMessage) => void;
  setAILoading: (v: boolean) => void;
  clearAIMessages: () => void;
}

const defaultFilters: Filters = {
  search: '',
  brand: null,
  combustivel: '',
  ano_min: null,
  ano_max: null,
  valor_min: null,
  valor_max: null,
  cor: '',
};

export const useCarStore = create<CarStore>((set, get) => ({
  cars: [],
  loading: false,
  error: null,
  apiWarning: false,
  filters: defaultFilters,
  localCars: [],
  aiMessages: [],
  aiLoading: false,

  fetchCars: async () => {
    if (get().loading) return; // evita chamadas duplicadas
    set({ loading: true, error: null, apiWarning: false });
    try {
      const { cars, fromApi } = await fetchAllCars();
      set({ cars, loading: false, apiWarning: !fromApi });
    } catch (e) {
      set({ error: 'Erro ao carregar veículos.', loading: false });
    }
  },

  setFilters: (filters) => set(s => ({ filters: { ...s.filters, ...filters } })),
  resetFilters: () => set({ filters: defaultFilters }),

  addCar: (carData) => {
    const newCar: Car = {
      ...carData,
      id: Date.now(),
      timestamp_cadastro: Math.floor(Date.now() / 1000),
    };
    set(s => ({ localCars: [...s.localCars, newCar] }));
  },

  getBrandName: (car) => inferBrand(car),

  getFilteredCars: () => {
    const { cars, localCars, filters } = get();
    const all = [...cars, ...localCars];
    return all.filter(car => {
      const brand = inferBrand(car);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matches =
          car.nome_modelo.toLowerCase().includes(q) ||
          brand.toLowerCase().includes(q) ||
          car.cor.toLowerCase().includes(q) ||
          car.combustivel.toLowerCase().includes(q) ||
          String(car.ano).includes(q);
        if (!matches) return false;
      }
      if (filters.brand !== null && car.brand !== filters.brand) return false;
      if (filters.combustivel && car.combustivel !== filters.combustivel) return false;
      if (filters.ano_min && car.ano < filters.ano_min) return false;
      if (filters.ano_max && car.ano > filters.ano_max) return false;
      if (filters.valor_min && car.valor < filters.valor_min) return false;
      if (filters.valor_max && car.valor > filters.valor_max) return false;
      if (filters.cor && !car.cor.toLowerCase().includes(filters.cor.toLowerCase())) return false;
      return true;
    });
  },

  getCarsByBrand: () => {
    const filtered = get().getFilteredCars();
    const groups: Record<string, Car[]> = {};
    for (const car of filtered) {
      const brand = inferBrand(car);
      if (!groups[brand]) groups[brand] = [];
      groups[brand].push(car);
    }
    return groups;
  },

  addAIMessage: (msg) => set(s => ({ aiMessages: [...s.aiMessages, msg] })),
  setAILoading: (v) => set({ aiLoading: v }),
  clearAIMessages: () => set({ aiMessages: [] }),
}));
