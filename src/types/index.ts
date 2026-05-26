export interface Car {
  id: number;
  timestamp_cadastro: number;
  modelo_id: number;
  ano: number;
  combustivel: 'FLEX' | 'GASOLINA' | 'DIESEL' | 'ELÉTRICO' | 'HÍBRIDO' | string;
  num_portas: number;
  cor: string;
  nome_modelo: string;
  valor: number;
  brand?: number;
}

export interface Brand {
  id: number;
  name: string;
  logo?: string;
}

export type FuelType = Car['combustivel'];

export interface CarFormData {
  nome_modelo: string;
  brand: number;
  ano: number;
  combustivel: FuelType;
  num_portas: number;
  cor: string;
  valor: number;
}

export interface Filters {
  search: string;
  brand: number | null;
  combustivel: string;
  ano_min: number | null;
  ano_max: number | null;
  valor_min: number | null;
  valor_max: number | null;
  cor: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
}
