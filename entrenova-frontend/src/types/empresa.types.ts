// INPUTS DA EMPRESA
export interface IEmpresa {
  cnpj: string;
  nome: string;
  email: string;
  telefone: string;
  setor: string;
}

// Formulário/Quiz 
export interface IPergunta {
  id: string;
  texto: string;
  opcoes: string[];
}

// Perguntas organizadas por dimensão
export interface IPerguntasPorDimensao {
  pessoas: IPergunta[];
  estrutura: IPergunta[];
  mercado: IPergunta[];
  direcao: IPergunta[];
}


export interface IRespostas {
  [key: string]: number | null;
}

export interface IRelatorio {
  id: number;
  resumo_ia: string;
  maior_problema: string;
  sugestoes: string[];
  tom_analise: string;
  emocoes_identificadas: string[];
  created_at: string;
}