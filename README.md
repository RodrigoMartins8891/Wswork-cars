# AutoMarket AI 🚗

Teste técnico WSWork — React + TypeScript + Zustand + IA (Anthropic).

## 🚀 Como executar

### 1. Instalar dependências

```bash
npm install
cd server && npm install && cd ..
```

### 2. Configurar a API Key da IA (opcional)

Edite `server/index.js` e adicione sua chave:

```js
'x-api-key': 'sua-chave-aqui',   // linha ~15
```

> Sem a chave, a listagem de veículos funciona normalmente. Só o assistente IA ficará sem resposta.

### 3. Rodar tudo junto

```bash
npm run dev
```

Isso inicia em paralelo:
- **React** em `http://localhost:3000`
- **Proxy IA** em `http://localhost:3001`

### Rodar separado (alternativa)

```bash
# Terminal 1
npm start

# Terminal 2
npm run server
```

## 📁 Estrutura

```
wswork-cars/
├── server/
│   └── index.js          # Proxy Express para Anthropic API (evita CORS)
├── src/
│   ├── components/
│   │   ├── AIAssistant/  # Chatbot flutuante → chama localhost:3001
│   │   ├── Layout/
│   │   ├── VehicleCard/
│   │   ├── VehicleForm/  # react-hook-form + zod
│   │   └── VehicleList/  # ★ Componente reutilizável principal
│   ├── pages/
│   │   ├── Home.tsx      # Listagem com filtros
│   │   ├── AddCar.tsx    # Cadastro de veículo
│   │   └── Docs.tsx      # Documentação do VehicleList
│   ├── services/api.ts   # Fetch via corsproxy.io + fallback mock
│   ├── store/carStore.ts # Zustand
│   └── types/index.ts
```

## ⚙️ Decisões Técnicas

| Problema | Solução |
|---|---|
| CORS na API WSWork | Proxy público `corsproxy.io` + fallback com dados mockados fiéis ao JSON original |
| CORS na Anthropic API | Proxy Express local (`server/index.js`) na porta 3001 |
| JSON malformado na API | Regex corrige vírgulas ausentes antes do `JSON.parse` |
| `brand` ausente em `cars.json` | Inferência por substrings do `nome_modelo` |

## 🧩 VehicleList — Uso

```tsx
<VehicleList
  carsByBrand={{ Toyota: [car1, car2], Honda: [car3] }}
  viewMode="grid"
  defaultExpanded
  loading={false}
  newCarIds={[101]}
  onCarClick={(car) => console.log(car)}
  emptyMessage="Nenhum veículo encontrado."
/>
```

Documentação completa em `/docs` na aplicação.
"# Wswork-cars" 
