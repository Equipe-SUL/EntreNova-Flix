// --- Tipos para a Empresa ---
export interface IEmpresa {
  cnpj: string;
  nome: string;
  email: string;
  telefone: string;
  setor: string;
}

// --- Tipos para o Formulário/Quiz ---
export interface IPergunta {
  id: string;
  texto: string;
  opcoes: string[];
}

export interface IPerguntasPorDimensao {
  pessoas: IPergunta[];
  estrutura: IPergunta[];
  mercado: IPergunta[];
  direcao: IPergunta[];
}

export interface IRespostas {
  [key: string]: number | null;
}