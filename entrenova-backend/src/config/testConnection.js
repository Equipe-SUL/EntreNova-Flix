import { testConnection } from "./supabase.js";

// Testar a conexão
testConnection().then(success => {
    if (success) {
        console.log('🎉 Pronto para usar o Supabase!')
    } else {
        console.log('💥 Verifique suas credenciais')
    }
})