import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronRight } from 'lucide-react';
import './Docs.css';

const CodeBlock: React.FC<{ code: string; lang?: string }> = ({ code, lang = 'tsx' }) => (
  <pre className="code-block" aria-label={`Exemplo de código ${lang}`}>
    <code>{code}</code>
  </pre>
);

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="doc-section">
      <button className="doc-section-header" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <h2>{title}</h2>
        {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
      </button>
      {open && <div className="doc-section-body">{children}</div>}
    </div>
  );
};

const Docs: React.FC = () => (
  <div className="docs-page page-enter">
    <div className="docs-header">
      <FileText size={28} className="docs-icon" />
      <div>
        <h1 className="docs-title">VehicleList — Documentação</h1>
        <p className="docs-subtitle">Componente reutilizável de listagem de veículos agrupados por marca</p>
      </div>
    </div>

    <div className="docs-content">
      <Section title="📦 Visão Geral">
        <p>
          <code>VehicleList</code> é um componente React que recebe veículos já agrupados por marca e os exibe
          em seções expansíveis, com suporte a modo grade/lista, skeleton loading, estado vazio e destaque para veículos novos.
        </p>
        <p style={{ marginTop: 12 }}>
          É <strong>headless em relação aos dados</strong>: não faz fetch, apenas recebe props. Isso garante
          máxima reusabilidade — você pode alimentá-lo com dados de qualquer fonte.
        </p>
      </Section>

      <Section title="🔧 Instalação & Importação">
        <CodeBlock code={`// Copie os seguintes arquivos para o seu projeto:
// src/components/VehicleList/VehicleList.tsx
// src/components/VehicleList/VehicleList.css
// src/components/VehicleCard/VehicleCard.tsx
// src/components/VehicleCard/VehicleCard.css

import VehicleList from './components/VehicleList/VehicleList';

// Tipo necessário (ou use o seu próprio)
import type { Car } from './types';`} />
      </Section>

      <Section title="📋 Props">
        <div className="props-table-wrapper">
          <table className="props-table">
            <thead>
              <tr>
                <th>Prop</th>
                <th>Tipo</th>
                <th>Padrão</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['carsByBrand', 'Record<string, Car[]>', '—', 'Obrigatório. Veículos agrupados por nome da marca.'],
                ['newCarIds', 'number[]', '[]', 'IDs dos carros recém-adicionados. Exibe badge "Novo".'],
                ['onCarClick', '(car: Car) => void', 'undefined', 'Callback ao clicar em um card. Ativa modo clicável.'],
                ['viewMode', '"grid" | "list"', '"grid"', 'Layout dos cards dentro de cada marca.'],
                ['defaultExpanded', 'boolean', 'true', 'Se verdadeiro, seções de marca começam abertas.'],
                ['emptyMessage', 'string', '"Nenhum veículo encontrado."', 'Texto exibido quando não há veículos.'],
                ['loading', 'boolean', 'false', 'Exibe skeleton loading no lugar da listagem.'],
              ].map(([p, t, d, desc]) => (
                <tr key={p}>
                  <td><code>{p}</code></td>
                  <td><code className="type">{t}</code></td>
                  <td><code className="default">{d}</code></td>
                  <td>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="💡 Exemplos de Uso">
        <h3>Uso básico</h3>
        <CodeBlock code={`const carsByBrand = {
  Toyota: [{ id: 1, nome_modelo: 'COROLLA', ano: 2022, ... }],
  Honda:  [{ id: 2, nome_modelo: 'CIVIC',   ano: 2021, ... }],
};

<VehicleList carsByBrand={carsByBrand} />`} />

        <h3 style={{ marginTop: 20 }}>Com interação e carros novos</h3>
        <CodeBlock code={`<VehicleList
  carsByBrand={carsByBrand}
  newCarIds={[101, 202]}
  onCarClick={(car) => setSelectedCar(car)}
  viewMode="grid"
  defaultExpanded={true}
/>`} />

        <h3 style={{ marginTop: 20 }}>Com loading state</h3>
        <CodeBlock code={`<VehicleList
  carsByBrand={{}}
  loading={isFetching}
/>`} />

        <h3 style={{ marginTop: 20 }}>Mensagem personalizada para lista vazia</h3>
        <CodeBlock code={`<VehicleList
  carsByBrand={filtered}
  emptyMessage="Nenhum veículo encontrado para esses filtros."
/>`} />
      </Section>

      <Section title="🎨 Customização">
        <p>O componente usa variáveis CSS globais. Sobrescreva-as no seu <code>:root</code> ou em um wrapper:</p>
        <CodeBlock lang="css" code={`/* Tema claro */
.my-app {
  --bg: #f8f8ff;
  --surface: #ffffff;
  --surface2: #f0f0fa;
  --border: #e0e0f0;
  --text: #1a1a2e;
  --text2: #4a4a6a;
  --text3: #8a8aaa;
  --accent: #5a52e8;
  --success: #00b894;
}

/* Envolva o componente no wrapper */
<div className="my-app">
  <VehicleList carsByBrand={...} />
</div>`} />
      </Section>

      <Section title="♿ Acessibilidade">
        <ul className="docs-list">
          <li>Seções de marca com <code>aria-expanded</code> correto</li>
          <li>Cards clicáveis com <code>role="button"</code>, <code>tabIndex</code> e suporte a teclado (Enter)</li>
          <li>Loading state com <code>aria-busy</code> e <code>aria-label</code></li>
          <li>Lista vazia com <code>role="status"</code></li>
          <li>Contagem de resultados com <code>aria-live="polite"</code></li>
        </ul>
      </Section>

      <Section title="⚙️ Comportamento Esperado">
        <ul className="docs-list">
          <li>Marcas são listadas em ordem alfabética</li>
          <li>Clicar no header de uma marca expande/recolhe seus veículos</li>
          <li>Carros com IDs em <code>newCarIds</code> recebem badge "Novo" no canto superior direito</li>
          <li>No modo <code>list</code>, os detalhes ficam em linha (4 colunas)</li>
          <li>Responsive: em mobile, sempre exibe 1 coluna independente do viewMode</li>
        </ul>
      </Section>
    </div>
  </div>
);

export default Docs;
