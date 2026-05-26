import React, { useState, useRef, useEffect } from 'react';
import { useCarStore } from '../../store/carStore';
import { Bot, Send, X, Minimize2, Sparkles, RotateCcw } from 'lucide-react';
import './AIAssistant.css';

const SYSTEM_PROMPT = `Você é um assistente especialista em veículos para a plataforma AutoMarket. 
Você tem acesso à lista de veículos disponíveis e ajuda os usuários a encontrar o carro ideal.
Responda sempre em português brasileiro de forma amigável, concisa e útil.
Quando sugerir veículos, mencione modelo, ano, preço e combustível.
Se o usuário perguntar algo fora de veículos, gentilmente redirecione para o assunto.`;

const AIAssistant: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { cars, localCars, aiMessages, aiLoading, addAIMessage, setAILoading, clearAIMessages } = useCarStore();
  const allCars = [...cars, ...localCars];

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, aiMessages]);

  const buildCarContext = () => {
    const sample = allCars.slice(0, 20);
    return sample.map(c =>
      `- ${c.nome_modelo} (${c.ano}) | R$ ${(c.valor * 1000).toLocaleString('pt-BR')} | ${c.combustivel} | ${c.num_portas} portas | Cor: ${c.cor}`
    ).join('\n');
  };

    const sendMessage = async () => {
    const text = input.trim();
    if (!text || aiLoading) return;

    
    addAIMessage({ role: 'user', content: text });
    setInput('');
    setAILoading(true);

   
    setTimeout(() => {
      const query = text.toLowerCase();
      let reply = '';

     
      if (query.includes('custo-benefício') || query.includes('barato') || query.includes('em conta')) {
        const cheapCars = [...allCars].sort((a, b) => a.valor - b.valor).slice(0, 2);
        if (cheapCars.length > 0) {
          reply = `Com base no nosso estoque atual, os veículos com melhor custo-benefício são:\n\n` +
            cheapCars.map(c => `🚗 *${c.nome_modelo} (${c.ano})*\n💰 Preço: R$ ${(c.valor * 1000).toLocaleString('pt-BR')}\n⛽ Combustível: ${c.combustivel}\n🎨 Cor: ${c.cor}`).join('\n\n');
        } else {
          reply = 'No momento não temos veículos econômicos listados no sistema.';
        }
      } 
      else if (query.includes('flex')) {
        
        const priceMatch = query.match(/(\d+[\d.]*)/);
        let maxPrice = priceMatch ? parseFloat(priceMatch[0].replace('.', '')) : Infinity;
        if (maxPrice < 1000 && maxPrice !== Infinity) maxPrice *= 1000; 

        const flexCars = allCars.filter(c => c.combustivel.toUpperCase() === 'FLEX' && (c.valor * 1000) <= maxPrice).slice(0, 2);
        
        if (flexCars.length > 0) {
          reply = `Encontrei estes veículos Flex para você:\n\n` +
            flexCars.map(c => `🚗 *${c.nome_modelo} (${c.ano})*\n💰 Preço: R$ ${(c.valor * 1000).toLocaleString('pt-BR')}\n🎨 Cor: ${c.cor}`).join('\n\n');
        } else {
          reply = `Não encontrei veículos Flex cadastrados ${maxPrice !== Infinity ? `abaixo de R$ ${maxPrice.toLocaleString('pt-BR')}` : ''}.`;
        }
      }
      else if (query.includes('econômico') || query.includes('menos consome')) {
        const ecoCars = allCars.filter(c => ['FLEX', 'HÍBRIDO', 'ELÉTRICO'].includes(c.combustivel.toUpperCase())).slice(0, 2);
        if (ecoCars.length > 0) {
          reply = `Estes são os modelos com melhor proposta de economia de combustível no estoque:\n\n` +
            ecoCars.map(c => `🚗 *${c.nome_modelo} (${c.ano})*\n⛽ Tipo: ${c.combustivel}\n💰 Valor: R$ ${(c.valor * 1000).toLocaleString('pt-BR')}`).join('\n\n');
        } else {
          reply = 'Não localizei modelos econômicos ou híbridos disponíveis no momento.';
        }
      }
      else if (query.includes('suv') || query.includes('família') || query.includes('grande')) {
        const familyCars = allCars.filter(c => 
          ['TUCSON', 'CRETA', 'IX35', 'TRACKER', 'S10', 'AMAROK', 'SAVEIRO', 'RANGER', 'RAV4'].some(m => c.nome_modelo.toUpperCase().includes(m))
        ).slice(0, 2);

        if (familyCars.length > 0) {
          reply = `Para famílias ou quem busca espaço, recomendo estas opções:\n\n` +
            familyCars.map(c => `🚗 *${c.nome_modelo} (${c.ano})*\n🚪 Portas: ${c.num_portas || 4}\n💰 Valor: R$ ${(c.valor * 1000).toLocaleString('pt-BR')}`).join('\n\n');
        } else {
          reply = 'No momento não temos SUVs ou modelos de grande porte disponíveis. Que tal um sedan como o Corolla?';
        }
      }
     
      else {
        const matches = allCars.filter(c => 
          c.nome_modelo.toLowerCase().includes(query) || 
          c.cor.toLowerCase().includes(query)
        ).slice(0, 2);

        if (matches.length > 0) {
          reply = `Encontrei o seguinte correspondente no sistema:\n\n` +
            matches.map(c => `🚗 *${c.nome_modelo} (${c.ano})*\n💰 Preço: R$ ${(c.valor * 1000).toLocaleString('pt-BR')}\n🎨 Cor: ${c.cor}`).join('\n\n');
        } else {
          reply = `Olá! Sou o assistente AutoMarket. Não consegui encontrar carros específicos para "${text}".\n\nTente me perguntar sobre:\n• *Carros com melhor custo-benefício*\n• *Modelos Flex*\n• *Sugestões para família*`;
        }
      }

      addAIMessage({ role: 'assistant', content: reply });
      setAILoading(false);
    }, 1000); 
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestions = [
    'Qual carro tem melhor custo-benefício?',
    'Mostre carros flex até R$ 60.000',
    'Qual carro é mais econômico?',
    'Sugira um SUV para família',
  ];

  return (
    <>
      <button
        className={`ai-fab ${open ? 'open' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-label="Assistente de IA"
        title="Assistente IA"
      >
        {open ? <X size={22} /> : <><Bot size={22} /><span className="ai-fab-pulse" /></>}
      </button>

      {open && (
        <div className="ai-panel" role="dialog" aria-label="Assistente de veículos com IA">
          <div className="ai-header">
            <div className="ai-header-info">
              <div className="ai-avatar"><Sparkles size={16} /></div>
              <div>
                <p className="ai-title">Assistente AutoMarket</p>
                <p className="ai-subtitle">IA para encontrar seu veículo ideal</p>
              </div>
            </div>
            <div className="ai-header-actions">
              <button onClick={clearAIMessages} title="Limpar conversa" className="ai-icon-btn">
                <RotateCcw size={15} />
              </button>
              <button onClick={() => setOpen(false)} title="Fechar" className="ai-icon-btn">
                <Minimize2 size={15} />
              </button>
            </div>
          </div>

          <div className="ai-messages" aria-live="polite">
            {aiMessages.length === 0 && (
              <div className="ai-welcome">
                <p className="ai-welcome-text">
                  Olá! Sou o assistente da AutoMarket. Como posso ajudar você a encontrar o veículo perfeito?
                </p>
                <div className="ai-suggestions">
                  {suggestions.map(s => (
                    <button key={s} className="ai-suggestion" onClick={() => { setInput(s); inputRef.current?.focus(); }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiMessages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <div className="ai-msg-avatar"><Bot size={13} /></div>
                )}
                <div className="ai-bubble">{msg.content}</div>
              </div>
            ))}

            {aiLoading && (
              <div className="ai-message assistant">
                <div className="ai-msg-avatar"><Bot size={13} /></div>
                <div className="ai-bubble ai-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="ai-input-area">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pergunte sobre veículos..."
              className="ai-input"
              disabled={aiLoading}
              aria-label="Mensagem para o assistente"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || aiLoading}
              className="ai-send"
              aria-label="Enviar mensagem"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
