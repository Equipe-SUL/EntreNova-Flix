import React, { useState } from 'react';
import { RhData } from '../types/types.pagamento'; // Certifique-se de que o caminho e o tipo estão corretos
import '../styles/Checkout.css'
interface RhRegistrationFormProps {
    initialData: RhData;
    onNext: (data: RhData) => void;
    onBack: () => void;
}

const RhRegistrationForm: React.FC<RhRegistrationFormProps> = ({ initialData, onNext, onBack }) => {
    const [formData, setFormData] = useState<RhData>(initialData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Se for o campo de senha, usamos "valid" para ativar o placeholder flutuante
        // O valor é uma string vazia se for null, garantindo que o input funcione.
        const updatedValue = value || ''; 
        setFormData(prev => ({ ...prev, [name]: updatedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onNext(formData);
    };

    return (
        // O ID #sec1registro é o container de centralização
        <div id="sec1registro"> 
            <form className="form" onSubmit={handleSubmit}>
                
                {/* Título e Mensagem do Formulário (Visual do index.html) */}
                <p className="title">2. Cadastro de Usuário RH</p> 
                <p className="message">Preencha os dados para finalizar seu cadastro.</p>
                
                {/* 1. CNPJ da Empresa */}
                {/* O input deve ter um valor ou ser preenchido para a classe :valid ativar o span flutuante */}
                <label>
                    <input
                        className="input"
                        type="text"
                        name="cnpj_empresa"
                        value={formData.cnpj_empresa}
                        onChange={handleChange}
                        required
                    />
                    <span>CNPJ da Empresa</span>
                </label>
                
                {/* 2. Nome Completo do RH */}
                <label>
                    <input
                        className="input"
                        type="text"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                    />
                    <span>Nome Completo do RH</span>
                </label>
                
                {/* 3. Email de Acesso */}
                <label>
                    <input
                        className="input"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <span>Email de Acesso</span>
                </label>
                
                {/* 4. Senha */}
                <label>
                    <input
                        className="input"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <span>Sua Senha</span>
                </label>
                
                {/* Botão Voltar (Estilo Secundário Escuro) */}
                <button 
                    type="button" 
                    onClick={onBack} 
                    style={{
                        // Estilos manuais para um botão secundário escuro, conforme o tema
                        border: 'none',
                        outline: 'none',
                        padding: '10px',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '16px',
                        marginTop: '5px',
                        marginBottom: '5px',
                        backgroundColor: '#333', 
                        cursor: 'pointer',
                        transition: '0.3s ease'
                    }}
                >
                    Voltar para Planos
                </button>

                {/* Botão Principal (Usa a classe .submit) */}
                <button type="submit" className="submit">
                    Próximo: Confirmação e Pagamento
                </button>
            </form>
        </div>
    );
};

export default RhRegistrationForm;
