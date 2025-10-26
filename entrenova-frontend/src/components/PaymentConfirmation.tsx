import React, { useState } from 'react';
import { CheckoutData } from '../types/types.pagamento'; // Assumindo o caminho para seus tipos

type PaymentMethod = 'GOOGLE' | 'APPLE' | 'PAYPAL' | 'PIX'; // Tipos de pagamento para o checkout

interface PaymentMethodSelectionProps {
    checkoutData: CheckoutData; // Dados completos do checkout (incluindo plano e RH)
    onFinish: (paymentMethod: PaymentMethod) => void;
    onBack: () => void;
}

// -----------------------------------------------------------
// Definição dos SVGs (Mantidos conforme seu arquivo)
// -----------------------------------------------------------

const GoogleIcon = (
    <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M32 13.333l-4.177 9.333h-1.292l1.552-3.266-2.75-6.068h1.359l1.99 4.651h0.026l1.927-4.651zM14.646 16.219v3.781h-1.313v-9.333h3.474c0.828-0.021 1.63 0.266 2.25 0.807 0.615 0.505 0.953 1.219 0.943 1.974 0.010 0.766-0.339 1.5-0.943 1.979-0.604 0.531-1.354 0.792-2.25 0.792zM14.641 11.818v3.255h2.198c0.484 0.016 0.958-0.161 1.297-0.479 0.339-0.302 0.526-0.714 0.526-1.141 0-0.432-0.188-0.844-0.526-1.141-0.349-0.333-0.818-0.51-1.297-0.495zM22.63 13.333c0.833 0 1.495 0.234 1.979 0.698s0.724 1.099 0.724 1.906v3.859h-1.083v-0.87h-0.047c-0.469 0.714-1.089 1.073-1.865 1.073-0.667 0-1.219-0.203-1.667-0.615-0.438-0.385-0.682-0.948-0.672-1.531 0-0.646 0.234-1.161 0.708-1.547 0.469-0.38 1.099-0.573 1.885-0.573 0.672 0 1.224 0.13 1.656 0.385v-0.271c0.005-0.396-0.167-0.776-0.464-1.042-0.297-0.276-0.688-0.432-1.094-0.427-0.63 0-1.13 0.276-1.5 0.828l-0.995-0.646c0.547-0.818 1.359-1.229 2.432-1.229zM21.167 17.88c-0.005 0.302 0.135 0.583 0.375 0.766 0.25 0.203 0.563 0.313 0.88 0.307 0.474 0 0.932-0.198 1.271-0.547 0.359-0.333 0.563-0.802 0.563-1.292-0.354-0.292-0.844-0.438-1.474-0.438-0.464 0-0.844 0.115-1.151 0.344-0.307 0.234-0.464 0.516-0.464 0.859zM5.443 10.667c1.344-0.016 2.646 0.479 3.641 1.391l-1.552 1.521c-0.568-0.526-1.318-0.813-2.089-0.797-1.385 0.005-2.609 0.891-3.057 2.198-0.229 0.661-0.229 1.38 0 2.042 0.448 1.307 1.672 2.193 3.057 2.198 0.734 0 1.365-0.182 1.854-0.505 0.568-0.375 0.964-0.958 1.083-1.625h-2.938v-2.052h5.13c0.063 0.359 0.094 0.719 0.094 1.083 0 1.625-0.594 3-1.62 3.927-0.901 0.813-2.135 1.286-3.604 1.286-2.047 0.010-3.922-1.125-4.865-2.938-0.771-1.505-0.771-3.286 0-4.792 0.943-1.813 2.818-2.948 4.859-2.938z"
                />
        </svg>
);

const AppleIcon = (
    <svg fill="currentColor" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z"
                />
        </svg>
);

const PayPalIcon = (
    <svg fill="currentColor" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M186.3 258.2c0 12.2-9.7 21.5-22 21.5-9.2 0-16-5.2-16-15 0-12.2 9.5-22 21.7-22 9.3 0 16.3 5.7 16.3 15.5zM80.5 209.7h-4.7c-1.5 0-3 1-3.2 2.7l-4.3 26.7 8.2-.3c11 0 19.5-1.5 21.5-14.2 2.3-13.4-6.2-14.9-17.5-14.9zm284 0H360c-1.8 0-3 1-3.2 2.7l-4.2 26.7 8-.3c13 0 22-3 22-18-.1-10.6-9.6-11.1-18.1-11.1zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM128.3 215.4c0-21-16.2-28-34.7-28h-40c-2.5 0-5 2-5.2 4.7L32 294.2c-.3 2 1.2 4 3.2 4h19c2.7 0 5.2-2.9 5.5-5.7l4.5-26.6c1-7.2 13.2-4.7 18-4.7 28.6 0 46.1-17 46.1-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.2 8.2-5.8-8.5-14.2-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9 0 20.2-4.9 26.5-11.9-.5 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H200c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm40.5 97.9l63.7-92.6c.5-.5.5-1 .5-1.7 0-1.7-1.5-3.5-3.2-3.5h-19.2c-1.7 0-3.5 1-4.5 2.5l-26.5 39-11-37.5c-.8-2.2-3-4-5.5-4h-18.7c-1.7 0-3.2 1.8-3.2 3.5 0 1.2 19.5 56.8 21.2 62.1-2.7 3.8-20.5 28.6-20.5 31.6 0 1.8 1.5 3.2 3.2 3.2h19.2c1.8-.1 3.5-1.1 4.5-2.6zm159.3-106.7c0-21-16.2-28-34.7-28h-39.7c-2.7 0-5.2 2-5.5 4.7l-16.2 102c-.2 2 1.3 4 3.2 4h20.5c2 0 3.5-1.5 4-3.2l4.5-29c1-7.2 13.2-4.7 18-4.7 28.4 0 45.9-17 45.9-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.3 8.2-5.5-8.5-14-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9.3 0 20.5-4.9 26.5-11.9-.3 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H484c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm47.5-33.3c0-2-1.5-3.5-3.2-3.5h-18.5c-1.5 0-3 1.2-3.2 2.7l-16.2 104-.3.5c0 1.8 1.5 3.5 3.5 3.5h16.5c2.5 0 5-2.9 5.2-5.7L544 191.2v-.3zm-90 51.8c-12.2 0-21.7 9.7-21.7 22 0 9.7 7 15 16.2 15 12 0 21.7-9.2 21.7-21.5.1-9.8-6.9-15.5-16.2-15.5z"
                />
        </svg>
);

const PixIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" fill="currentColor">
        <path d="M306.4 356.5C311.8 351.1 321.1 351.1 326.5 356.5L403.5 433.5C417.7 447.7 436.6 455.5 456.6 455.5L471.7 455.5L374.6 552.6C344.3 582.1 295.1 582.1 264.8 552.6L167.3 455.2L176.6 455.2C196.6 455.2 215.5 447.4 229.7 433.2L306.4 356.5zM326.5 282.9C320.1 288.4 311.9 288.5 306.4 282.9L229.7 206.2C215.5 191.1 196.6 184.2 176.6 184.2L167.3 184.2L264.7 86.8C295.1 56.5 344.3 56.5 374.6 86.8L471.8 183.9L456.6 183.9C436.6 183.9 417.7 191.7 403.5 205.9L326.5 282.9zM176.6 206.7C190.4 206.7 203.1 212.3 213.7 222.1L290.4 298.8C297.6 305.1 307 309.6 316.5 309.6C325.9 309.6 335.3 305.1 342.5 298.8L419.5 221.8C429.3 212.1 442.8 206.5 456.6 206.5L494.3 206.5L552.6 264.8C582.9 295.1 582.9 344.3 552.6 374.6L494.3 432.9L456.6 432.9C442.8 432.9 429.3 427.3 419.5 417.5L342.5 340.5C328.6 326.6 304.3 326.6 290.4 340.6L213.7 417.2C203.1 427 190.4 432.6 176.6 432.6L144.8 432.6L86.8 374.6C56.5 344.3 56.5 295.1 86.8 264.8L144.8 206.7L176.6 206.7z"/>
    </svg>
);


const paymentOptions: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'GOOGLE', label: 'Cartão da Google', icon: GoogleIcon },
    { id: 'APPLE', label: 'Cartão da Apple', icon: AppleIcon },
    { id: 'PAYPAL', label: 'PayPal', icon: PayPalIcon },
    { id: 'PIX', label: 'PIX', icon: PixIcon },
];

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({ checkoutData, onFinish, onBack }) => {
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
    const [isLoading, setIsLoading] = useState(false); 

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!selectedPayment) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }
        
        // CORREÇÃO DO ERRO: Verifica se onFinish é uma função antes de tentar chamá-la
        if (typeof onFinish !== 'function') {
            console.error("Prop 'onFinish' não é uma função ou está faltando. O pagamento não pode ser finalizado.");
            return;
        }

        // 1. Inicia o estado de carregamento e desabilita o botão
        setIsLoading(true);

        try {
            // 2. Simula o processamento do pagamento (SUBSTITUA PELA SUA CHAMADA DE API REAL)
            console.log(`Iniciando pagamento via ${selectedPayment}...`);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula 1.5s de latência
            console.log("Pagamento processado com sucesso (simulado).");

            // 3. Chama a função do componente pai para avançar o checkout
            onFinish(selectedPayment);
            
        } catch (error) {
            console.error("Erro ao processar o pagamento:", error);
            alert("Ocorreu um erro na confirmação do pagamento. Tente novamente.");
        } finally {
            // 4. Finaliza o estado de carregamento
            setIsLoading(false);
        }
    };

    return (
        <div id="sec1registro"> 
            <section id="secplanos"> 
                <article id="artpagamento">
                    
                    <form onSubmit={handleConfirm} className="payment-card">
                        
                        <p className="card-title">3. Método de Pagamento</p>
                        
                        <p className="card-subtitle">
                            Selecione o método de pagamento para concluir sua compra.
                        </p>
                        
                        {/* Renderização das opções de pagamento */}
                        {paymentOptions.map(option => (
                            <label key={option.id} className="payment-option">
                                <div className="option-content">
                                    <div style={{ width: '32px', height: '32px' }}>
                                        {option.icon}
                                    </div>
                                    <p className="option-text">{option.label}</p>
                                </div>
                                
                                <input
                                    className="payment-radio"
                                    value={option.id}
                                    name="payment"
                                    type="radio"
                                    checked={selectedPayment === option.id}
                                    onChange={() => setSelectedPayment(option.id)}
                                    disabled={isLoading} // Desabilita opções durante o carregamento
                                />
                            </label>
                        ))}

                        {/* Detalhes da Compra (Opcional) */}
                        <div style={{ alignSelf: 'flex-start', fontSize: '0.9em', color: '#333', marginTop: '10px' }}>
                            <p>Plano Selecionado: <strong>{checkoutData.plano}</strong></p>
                            <p>Total a Pagar: <strong>R$ XX,XX</strong> (Exemplo)</p>
                        </div>
                        
                        {/* Botão de Confirmação com estado de carregamento */}
                        <button 
                            type="submit" 
                            id="btn-pagamento"
                            disabled={!selectedPayment || isLoading} // Desabilitado se não houver seleção ou estiver carregando
                        >
                            {isLoading ? 'Confirmando...' : 'Confirmar Pagamento'}
                        </button>
                        
                        {/* Botão Voltar */}
                        <button 
                            type="button" 
                            onClick={onBack} 
                            disabled={isLoading} // Desabilitado durante o carregamento
                            style={{ 
                                backgroundColor: 'transparent', 
                                border: '1px solid #ff007f', 
                                color: '#ff007f', 
                                marginTop: '10px' 
                            }}
                        >
                            Voltar para Cadastro
                        </button>

                    </form>
                </article>
            </section>
        </div>
    );
};

export default PaymentMethodSelection;