import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase'; 
// Importe seus componentes
import PlanSelection from './SelecaoPlano'; 
import RhRegistrationForm from './RhRegistrationForm';
import PaymentConfirmation from './PaymentConfirmation'; 
// Assumindo que os tipos estão em '../types/types.pagamento'
import { Plano, RhData, CheckoutData, PaymentMethod } from '../types/types.pagamento'; 


// Obtém o URL base da API do ambiente (VITE_API_BASE_URL)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialRhData: RhData = {
    email: '',
    password: '', 
    full_name: '',
    cnpj_empresa: '',
};

const CheckoutPage: React.FC = () => {
    // ESTADOS GLOBAIS
    const [step, setStep] = useState(1);
    const [plano, setPlano] = useState<Plano>('BASICO');
    const [rhData, setRhData] = useState<RhData>(initialRhData);
    
    // ESTADOS DE UI E NAVEGAÇÃO
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    // HANDLERS DE NAVEGAÇÃO E DADOS
    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);

    const handleRhDataComplete = (data: RhData) => {
        setRhData(data);
        handleNextStep();
    };
    
    // HANDLER PARA FINALIZAÇÃO DO PAGAMENTO E SUBMISSÃO DA API
    const handleFinishPayment = async (paymentMethod: PaymentMethod) => {
        setLoading(true);
        setErrorMsg(null);
        
        if (!API_BASE_URL) {
            setErrorMsg("Erro de configuração: VITE_API_BASE_URL não definida.");
            setLoading(false);
            return;
        }

        try {
            // ⭐ 1. CHAMADA CENTRALIZADA PARA O BACKEND
            // Envia todos os dados (RH, Plano e Método de Pagamento) para a rota que funcionava
            const response = await fetch(`${API_BASE_URL}/payment/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...rhData,              // email, password, full_name, cnpj_empresa
                    plano: plano,            // Plano selecionado
                    paymentMethod: paymentMethod // Método de pagamento
                }),
            });

            // Usamos a lógica de erro simples da sua versão anterior
            const data = await response.json(); 

            if (!response.ok) {
                // Se o backend retornou um erro (400, 409, 500, etc.)
                setErrorMsg(data.message || 'Erro desconhecido no processamento do checkout.');
                
            } else {
                // ⭐ 2. SUCESSO: O backend cuidou de registrar o usuário/perfil no Supabase
                // e de criar a assinatura/pagamento, retornando a sessão.
                if (data.session) {
                    await supabase.auth.setSession(data.session);
                    // Como é um RH, redireciona para o dashboard RH
                    navigate('/dashboard/rh'); 
                } else {
                    setErrorMsg('Checkout bem-sucedido, mas falha ao obter sessão de login.');
                }
            }
            
        } catch (e) {
            console.error('Erro de Checkout Completo:', e);
            // Captura erros de rede ou SyntaxError do .json()
            setErrorMsg('Falha na comunicação com o servidor ou resposta inválida. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };


    const checkoutData: CheckoutData = {
        plano: plano,
        rhData: rhData,
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <PlanSelection
                        plano={plano}
                        setPlano={setPlano}
                        onNext={handleNextStep}
                    />
                );
            case 2:
                return (
                    <RhRegistrationForm
                        initialData={rhData}
                        onNext={handleRhDataComplete}
                        onBack={handlePrevStep}
                    />
                );
            case 3:
                return (
                    // PaymentConfirmation precisa da prop onFinish
                    <PaymentConfirmation
                        checkoutData={checkoutData}
                        onBack={handlePrevStep}
                        onFinish={handleFinishPayment} // Função que agora faz a chamada final para o backend
                    />
                );
            default:
                return <div>Erro: Passo desconhecido.</div>;
        }
    };

    return (
        <div style={{maxWidth: '500px', margin: 'auto', textAlign: 'center', marginTop: '30px', marginBottom: '30px' }}>
            <h1 style={{fontSize: '20px'}}>Checkout - Criação de Conta RH</h1>
            
            <p>Passo {step} de 3</p>

            {/* Mensagens de Erro/Loading globais para o componente CheckoutPage */}
            {loading && <p style={{ color: 'blue', margin: '5px 0' }}>Processando o checkout...</p>}
            {errorMsg && <p style={{ color: 'red', margin: '5px 0' }}>Erro: {errorMsg}</p>}


            <div>
                {renderStep()}
            </div>
            
          <Link to="/signin">
          <button className="login-btn" style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', marginTop: '20px' }}>
            Já possui uma conta?
          </button>
          </Link>
        </div>
    );
};

export default CheckoutPage;