export type PaymentData = {
    message: string;
    status: 'AUTHORIZED' | 'ERROR';
    rh_email: string; // Adicione rh_email pois você usa no frontend
    rh_id: string; // Adicione rh_id
} | {
    // Tipo para quando ocorre um erro de carregamento local
    message: string;
    status: 'ERROR';
    rh_email?: string;
    rh_id?: string;
};