import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY 

if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL e SUPABASE_KEY não estão definidos')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para testar a conexão
export async function testConnection() {
    try {
        const { data, error } = await supabase.from('empresas').select('*')
        if (error) throw error
        console.log('✅ Conexão bem sucedida com o Supabase')
        console.log('📊 Total de registros:', data[0]?.count || 0)
        return true
    } catch (error) {
        console.error('❌ Erro ao conectar ao Supabase:', error.message)
        return false
    }
}

export default supabase;