// 1. Tipos para Planos
export type Plano = 'OURO' | 'DIAMANTE' | 'ESMERALDA'; 
// Use apenas os nomes de planos que você realmente utiliza no seu componente SelecaoPlano

// 2. Tipos para Dados de Cadastro RH (usado no RhRegistrationForm)
export interface RhData {
    email: string;
    password?: string; // Opcional se você usa Auth do Supabase, mas obrigatório para o formulário
    full_name: string;
    cnpj_empresa: string;
    // Adicione outros campos do seu formulário RH aqui, se houverem
}

// 3. Tipos para Métodos de Pagamento (usado no PaymentConfirmation)
export type PaymentMethod = 'GOOGLE' | 'APPLE' | 'PAYPAL' | 'PIX';
// Certifique-se de que os nomes correspondem aos IDs usados no PaymentConfirmation.tsx

// 4. Tipo de Dados do Checkout (usado para passar informações entre PaginaCheckout e PaymentConfirmation)
export interface CheckoutData {
    plano: Plano;
    rhData: RhData; // Contém todos os dados do formulário RH
    // Você pode adicionar outras informações de preço ou resumo aqui, se necessário.
}
