import { Car } from '../types';

const PROXY = 'https://corsproxy.io/?url=';
const CARS_BY_BRAND_URL = 'https://wswork.com.br/cars_by_brand.json';
const CARS_URL = 'https://wswork.com.br/cars.json';

const MOCK_CARS_BY_BRAND: Car[] = [
  { id: 55, timestamp_cadastro: 1696549488, modelo_id: 88, ano: 2014, combustivel: 'FLEX',   num_portas: 4, cor: 'BRANCA', nome_modelo: 'ETIOS',    valor: 36,   brand: 1 },
  { id: 23, timestamp_cadastro: 1696531236, modelo_id: 77, ano: 2014, combustivel: 'FLEX',   num_portas: 4, cor: 'PRETO',  nome_modelo: 'COROLLA',  valor: 120,  brand: 1 },
  { id: 3,  timestamp_cadastro: 1696535432, modelo_id: 79, ano: 1993, combustivel: 'DIESEL', num_portas: 4, cor: 'AZUL',   nome_modelo: 'HILUX SW4',valor: 47.5, brand: 1 },
];

const MOCK_CARS: Car[] = [
  { id: 1,  timestamp_cadastro: 1696539488, modelo_id: 12, ano: 2015, combustivel: 'FLEX',    num_portas: 4, cor: 'BEGE',     nome_modelo: 'ONIX PLUS', valor: 50  },
  { id: 2,  timestamp_cadastro: 1696531234, modelo_id: 14, ano: 2014, combustivel: 'FLEX',    num_portas: 4, cor: 'AZUL',     nome_modelo: 'JETTA',     valor: 49  },
  { id: 4,  timestamp_cadastro: 1696531300, modelo_id: 20, ano: 2019, combustivel: 'GASOLINA',num_portas: 4, cor: 'PRATA',    nome_modelo: 'CIVIC',     valor: 89  },
  { id: 5,  timestamp_cadastro: 1696531400, modelo_id: 21, ano: 2020, combustivel: 'FLEX',    num_portas: 4, cor: 'BRANCA',   nome_modelo: 'HB20',      valor: 62  },
  { id: 6,  timestamp_cadastro: 1696531500, modelo_id: 22, ano: 2018, combustivel: 'FLEX',    num_portas: 4, cor: 'VERMELHO', nome_modelo: 'GOL',       valor: 38  },
  { id: 7,  timestamp_cadastro: 1696531600, modelo_id: 23, ano: 2021, combustivel: 'FLEX',    num_portas: 4, cor: 'CINZA',    nome_modelo: 'TRACKER',   valor: 105 },
  { id: 8,  timestamp_cadastro: 1696531700, modelo_id: 24, ano: 2017, combustivel: 'DIESEL',  num_portas: 4, cor: 'PRETA',    nome_modelo: 'RANGER',    valor: 130 },
  { id: 9,  timestamp_cadastro: 1696531800, modelo_id: 25, ano: 2022, combustivel: 'FLEX',    num_portas: 4, cor: 'BRANCA',   nome_modelo: 'POLO',      valor: 95  },
  { id: 10, timestamp_cadastro: 1696531900, modelo_id: 26, ano: 2016, combustivel: 'FLEX',    num_portas: 2, cor: 'AZUL',     nome_modelo: 'UNO',       valor: 28  },
  { id: 11, timestamp_cadastro: 1696532000, modelo_id: 27, ano: 2023, combustivel: 'HÍBRIDO', num_portas: 4, cor: 'PRATA',    nome_modelo: 'YARIS',     valor: 140 },
  { id: 12, timestamp_cadastro: 1696532100, modelo_id: 28, ano: 2020, combustivel: 'FLEX',    num_portas: 4, cor: 'BEGE',     nome_modelo: 'CRETA',     valor: 110 },
  { id: 13, timestamp_cadastro: 1696532200, modelo_id: 29, ano: 2019, combustivel: 'GASOLINA',num_portas: 4, cor: 'BRANCA',   nome_modelo: 'FIT',       valor: 72  },
];

function fixMalformedJson(text: string): string {
  return text.replace(/"num_portas":\s*(\d+)\s*\n(\s*"cor")/g, '"num_portas": $1,\n$2');
}

async function fetchViaProxy(url: string): Promise<any> {
  const res = await fetch(`${PROXY}${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return JSON.parse(fixMalformedJson(text));
}

export async function fetchAllCars(): Promise<{ cars: Car[]; fromApi: boolean }> {
  try {
    const [byBrand, general] = await Promise.all([
      fetchViaProxy(CARS_BY_BRAND_URL),
      fetchViaProxy(CARS_URL),
    ]);

    const fromBrand: Car[] = byBrand?.cars ?? [];
    const fromGeneral: Car[] = general?.cars ?? [];

    if (fromBrand.length > 0 || fromGeneral.length > 0) {
      const combined = [...fromBrand, ...fromGeneral];
      const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
      return { cars: unique, fromApi: true };
    }
  } catch {
    console.warn('Proxy CORS falhou — usando dados locais de demonstração.');
  }

  const combined = [...MOCK_CARS_BY_BRAND, ...MOCK_CARS];
  const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
  return { cars: unique, fromApi: false };
}
