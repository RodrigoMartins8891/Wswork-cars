import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCarStore } from '../../store/carStore';
import { CarFormData } from '../../types';
import { CheckCircle, AlertCircle, Car, DollarSign, Fuel, Palette, Hash, Calendar } from 'lucide-react';
import './VehicleForm.css';

const currentYear = new Date().getFullYear();

const schema = z.object({
  nome_modelo: z.string().min(2, 'Mínimo 2 caracteres').max(50, 'Máximo 50 caracteres'),
  brand: z.number().min(1, 'Selecione a marca'),
  ano: z.number()
    .min(1950, 'Ano mínimo: 1950')
    .max(currentYear + 1, `Ano máximo: ${currentYear + 1}`),
  combustivel: z.string().min(1, 'Selecione o combustível'),
  num_portas: z.number().min(2, 'Mínimo 2 portas').max(6, 'Máximo 6 portas'),
  cor: z.string().min(2, 'Informe a cor').max(30, 'Muito longo'),
  valor: z.number().positive('Valor deve ser positivo').max(100000, 'Valor máximo: R$ 100.000.000'),
});

const BRANDS = [
  { id: 1, name: 'Toyota' }, { id: 2, name: 'Volkswagen' }, { id: 3, name: 'Chevrolet' },
  { id: 4, name: 'Ford' }, { id: 5, name: 'Honda' }, { id: 6, name: 'Hyundai' },
  { id: 7, name: 'Fiat' }, { id: 8, name: 'Nissan' }, { id: 9, name: 'BMW' },
  { id: 10, name: 'Mercedes-Benz' },
];

const COLORS = ['Branca', 'Preta', 'Prata', 'Cinza', 'Azul', 'Vermelha', 'Bege', 'Amarela', 'Verde', 'Laranja'];

interface VehicleFormProps {
  onSuccess?: () => void;
}

const VehicleForm: React.FC<VehicleFormProps> = ({ onSuccess }) => {
  const { addCar } = useCarStore();
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CarFormData>({
    resolver: zodResolver(schema),
    defaultValues: { num_portas: 4 },
  });

  const onSubmit = async (data: CarFormData) => {
    await new Promise(r => setTimeout(r, 600));
    addCar({
      nome_modelo: data.nome_modelo.toUpperCase(),
      brand: data.brand,
      ano: data.ano,
      combustivel: data.combustivel,
      num_portas: data.num_portas,
      cor: data.cor.toUpperCase(),
      valor: data.valor,
      modelo_id: Math.floor(Math.random() * 200) + 1,
    });
    setSubmitted(true);
    reset();
    setTimeout(() => { setSubmitted(false); onSuccess?.(); }, 2500);
  };

  if (submitted) {
    return (
      <div className="form-success" role="status" aria-live="polite">
        <CheckCircle size={48} className="success-icon" />
        <h3>Veículo cadastrado!</h3>
        <p>O veículo foi adicionado à listagem com sucesso.</p>
      </div>
    );
  }

  return (
    <form className="vehicle-form" onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Formulário de cadastro de veículo">
      <div className="form-grid">
        {/* Modelo */}
        <div className="field full">
          <label htmlFor="nome_modelo" className="field-label">
            <Car size={14} /> Modelo do veículo *
          </label>
          <input
            id="nome_modelo"
            {...register('nome_modelo')}
            placeholder="Ex: Corolla, Civic, Onix..."
            className={`field-input ${errors.nome_modelo ? 'error' : ''}`}
            aria-invalid={!!errors.nome_modelo}
            aria-describedby={errors.nome_modelo ? 'nome_modelo-err' : undefined}
          />
          {errors.nome_modelo && (
            <p className="field-error" id="nome_modelo-err" role="alert">
              <AlertCircle size={12} />{errors.nome_modelo.message}
            </p>
          )}
        </div>

        {/* Marca */}
        <div className="field">
          <label htmlFor="brand" className="field-label">
            <Hash size={14} /> Marca *
          </label>
          <select
            id="brand"
            {...register('brand', { valueAsNumber: true })}
            className={`field-input ${errors.brand ? 'error' : ''}`}
            aria-invalid={!!errors.brand}
          >
            <option value="">Selecione...</option>
            {BRANDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
          {errors.brand && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.brand.message}</p>}
        </div>

        {/* Ano */}
        <div className="field">
          <label htmlFor="ano" className="field-label">
            <Calendar size={14} /> Ano *
          </label>
          <input
            id="ano"
            type="number"
            {...register('ano', { valueAsNumber: true })}
            placeholder={String(currentYear)}
            min={1950}
            max={currentYear + 1}
            className={`field-input ${errors.ano ? 'error' : ''}`}
            aria-invalid={!!errors.ano}
          />
          {errors.ano && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.ano.message}</p>}
        </div>

        {/* Combustível */}
        <div className="field">
          <label htmlFor="combustivel" className="field-label">
            <Fuel size={14} /> Combustível *
          </label>
          <select
            id="combustivel"
            {...register('combustivel')}
            className={`field-input ${errors.combustivel ? 'error' : ''}`}
            aria-invalid={!!errors.combustivel}
          >
            <option value="">Selecione...</option>
            <option value="FLEX">Flex</option>
            <option value="GASOLINA">Gasolina</option>
            <option value="DIESEL">Diesel</option>
            <option value="ELÉTRICO">Elétrico</option>
            <option value="HÍBRIDO">Híbrido</option>
          </select>
          {errors.combustivel && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.combustivel.message}</p>}
        </div>

        {/* Número de portas */}
        <div className="field">
          <label className="field-label"><Hash size={14} /> Nº de portas *</label>
          <div className="door-options" role="group" aria-label="Número de portas">
            {[2, 3, 4].map(n => (
              <label key={n} className={`door-opt ${watch('num_portas') === n ? 'selected' : ''}`}>
                <input type="radio" value={n} {...register('num_portas', { valueAsNumber: true })} />
                {n}
              </label>
            ))}
          </div>
          {errors.num_portas && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.num_portas.message}</p>}
        </div>

        {/* Cor */}
        <div className="field">
          <label htmlFor="cor" className="field-label">
            <Palette size={14} /> Cor *
          </label>
          <select
            id="cor"
            {...register('cor')}
            className={`field-input ${errors.cor ? 'error' : ''}`}
            aria-invalid={!!errors.cor}
          >
            <option value="">Selecione...</option>
            {COLORS.map(c => <option key={c} value={c.toUpperCase()}>{c}</option>)}
          </select>
          {errors.cor && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.cor.message}</p>}
        </div>

        {/* Valor */}
        <div className="field full">
          <label htmlFor="valor" className="field-label">
            <DollarSign size={14} /> Valor (R$ mil) *
          </label>
          <div className="valor-wrapper">
            <span className="valor-prefix">R$</span>
            <input
              id="valor"
              type="number"
              step="0.1"
              {...register('valor', { valueAsNumber: true })}
              placeholder="Ex: 50 → R$ 50.000"
              className={`field-input has-prefix ${errors.valor ? 'error' : ''}`}
              aria-invalid={!!errors.valor}
              aria-describedby="valor-hint"
            />
          </div>
          <p id="valor-hint" className="field-hint">Informe em milhares. Ex: 50 = R$ 50.000</p>
          {errors.valor && <p className="field-error" role="alert"><AlertCircle size={12} />{errors.valor.message}</p>}
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-secondary" onClick={() => reset()}>Limpar</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <span className="btn-spinner" /> : null}
          {isSubmitting ? 'Salvando...' : 'Cadastrar Veículo'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
