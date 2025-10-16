import { ReactNode } from "react";

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
export interface IPerguntaLead {
  id: string;
  texto: string;
  opcoes: string[];
  pontos: number[];
}

export interface IRespostasLead {
  [perguntaId: string]: number;
}

export interface IScoreLead {
  total: number;
  classificacao: 'frio' | 'morno' | 'quente';
  detalhes: { [perguntaId: string]: number };
}

export interface IRespostas {
  [key: string]: number | null;
}

// --- INTERFACE IRrelatorio ATUALIZADA ---
export interface IRelatorio {
  id: number;
  lead: string;
  nota_dho: number;

  // Estrutura completa do diagnóstico
  problemas_centrais: {
    problema: string;
    score: number;
    classificacao: string;
    soft_skills_mapeadas: {
      skill: string;
      codigo: string;
      meta: string;
    }[];
  }[];

  relatorio_narrativo: {
    D1_descoberta: string;
    D3_analise_consultiva: {
      problema: string;
      analise: string;
    }[];
    D5_cenarios_futuros: {
      evolucao: string;
      deterioracao: string;
    };
    pontos_fortes: string[];
    D6_direcionamento_grow: {
      goal: string;
      options: string[];
    };
    D7_design_desenvolvimento: {
      trilhas_fundacao: string[];
    };
  };

  indice_dho: {
    nota_indicativa: number;
    justificativa: string;
  };

  // Campos antigos (podem ser removidos se não forem mais usados)
  resumo_ia?: string;
  maior_problema?: string;
  sugestoes?: string[];
  relatorioCompleto?: string;
}


// interface para descrever a trilha
export interface Itrilha {
  descricao: string;
  modelo: string;
  categoria: string;
}