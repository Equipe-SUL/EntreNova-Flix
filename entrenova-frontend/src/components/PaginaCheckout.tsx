// EntreNova-Flix-Sprint3/entrenova-frontend/src/components/PaginaCheckout.tsx 
 
import React, { useState, useEffect } from 'react'; 
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importe useLocation 
import { supabase } from '../services/supabase'; 
import PlanSelection from './SelecaoPlano'; 
import RhRegistrationForm from './RhRegistrationForm'; 
import PaymentConfirmation from './PaymentConfirmation'; 
import { Plano, RhData, CheckoutData, PaymentMethod } from '../types/types.pagamento'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const initialRhData: RhData = {
    email: '',
    password: '', 
    full_name: '',
    cnpj_empresa: '',
};

const CheckoutPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [plano, setPlano] = useState<Plano>('OURO');
    const [rhData, setRhData] = useState<RhData>(initialRhData);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    
    // Novos estados para as trilhas
    const [trilhasGeradas, setTrilhasGeradas] = useState<string[]>([]);
    
    const navigate = useNavigate();
    const location = useLocation(); // Hook para pegar o state da navegação

    // Efeito para carregar as trilhas do banco quando o componente monta
    useEffect(() => {
        const cnpj = location.state?.cnpj; // Pega o CNPJ passado pelo Resultadopage2

        if (cnpj) {
            // Preenche o CNPJ no formulário automaticamente, se quiser
            setRhData(prev => ({ ...prev, cnpj_empresa: cnpj }));

            const fetchTrilhas = async () => {
                try {
                    // Busca a coluna 'trilha' na tabela 'relatorios'
                    const { data, error } = await supabase
                        .from('relatorios')
                        .select('trilha')
                        .eq('cnpj_empresa', cnpj)
                        .single();

                    if (error) throw error;

                    if (data && data.trilha) {
                        // O backend salva como uma string longa separada por quebras de linha (\n)
                        // Vamos transformar em array de strings
                        const listaTrilhas = data.trilha.split('\n').filter((t: string) => t.trim() !== '');
                        setTrilhasGeradas(listaTrilhas);
                    }
                } catch (err) {
                    console.error("Erro ao buscar trilhas:", err);
                }
            };
            fetchTrilhas();
        }
    }, [location.state]);

    const handleNextStep = () => setStep(prev => prev + 1);
    const handlePrevStep = () => setStep(prev => prev - 1);

    const handleRhDataComplete = (data: RhData) => {
        setRhData(data);
        handleNextStep();
    };
    
    const handleFinishPayment = async (paymentMethod: PaymentMethod) => {
        // ... (Mantenha a lógica de pagamento existente igual)
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
                        trilhasDisponiveis={trilhasGeradas} // Passamos as trilhas aqui!
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
                    <PaymentConfirmation
                        checkoutData={checkoutData}
                        onBack={handlePrevStep}
                        onFinish={handleFinishPayment}
                    />
                );
            default:
                return <div>Erro: Passo desconhecido.</div>;
        }
    };

    return (
        <div style={{maxWidth: '900px', margin: 'auto', textAlign: 'center', marginTop: '110px', marginBottom: '30px' }}>
            <h1 style={{fontSize: '20px',}}>Checkout - Criação de Conta RH</h1>
            <p>Passo {step} de 3</p>
            {/* ... mensagens de erro ... */}
            <div>{renderStep()}</div>
            {/* ... botão login ... */}
        </div>
    );
};

export default CheckoutPage;