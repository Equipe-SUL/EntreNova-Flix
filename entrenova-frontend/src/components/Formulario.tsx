import React, { useState, ChangeEvent } from 'react';
import '../styles/Formulario.css';

// Definindo a interface para um objeto de pergunta
interface Pergunta {
  id: string;
  texto: string;
  opcoes: string[];
}

// Definindo a interface para o objeto de perguntas agrupadas por dimensão
interface PerguntasPorDimensao {
  pessoas: Pergunta[];
  estrutura: Pergunta[];
  mercado: Pergunta[];
  direcao: Pergunta[];
}

// Definindo a interface para o objeto de respostas
interface Respostas {
  [key: string]: number | null;
}

const perguntasPorDimensao: PerguntasPorDimensao = {
  pessoas: [
    { id: 'p1', texto: 'Q1 – Comunicação interna', opcoes: ['Clara, frequente e bidirecional', 'Funciona, mas nem sempre chega a todos', 'Só em reuniões formais ou quando há problemas', 'Pouco estruturada'] },
    { id: 'p2', texto: 'Q2 – Postura de liderança', opcoes: ['Engajadora, dá autonomia e orienta', 'Boa, mas depende do líder individual', 'Centralizadora, pouco espaço para protagonismo', 'Inexistente, decisões sempre de cima para baixo'] },
    { id: 'p3', texto: 'Q3 – Resolução de problemas', opcoes: ['Ideias novas e soluções conjuntas', 'Resolvem, mas reativos', 'Dependem da liderança', 'Evitam mudanças'] },
    { id: 'p4', texto: 'Q4 – Organização do trabalho', opcoes: ['Clareza de papéis e prioridades', 'Clareza parcial, mas falta recurso', 'Confuso, apagando incêndios', 'Sem organização clara'] },
    { id: 'p5', texto: 'Q5 – Valores e propósito', opcoes: ['Claros e aplicados', 'Conhecidos, mas pouco aplicados', 'Pouco lembrados, só em discurso', 'Não há clareza'] },
    { id: 'p6', texto: 'Q6 – Ferramentas de desenvolvimento', opcoes: ['Plataformas estruturadas', 'Algumas iniciativas digitais', 'Recursos informais', 'Não há ferramentas'] }
  ],
  estrutura: [
    { id: 'e1', texto: 'Q1 – Fluxo de informação entre áreas', opcoes: ['Integração constante', 'Em parte, com ruídos', 'Depende de reuniões formais', 'Áreas isoladas'] },
    { id: 'e2', texto: 'Q2 – Delegação dos gestores', opcoes: ['Delegam com confiança', 'Delegam, mas controlam em excesso', 'Raramente delegam', 'Não delegam'] },
    { id: 'e3', texto: 'Q3 – Ajustes de processos', opcoes: ['Equipes propõem melhorias', 'Ajustes demoram', 'Só gestão revisa', 'Nada muda'] },
    { id: 'e4', texto: 'Q4 – Autonomia operacional', opcoes: ['Alta autonomia com responsabilidade', 'Alguma, mas depende de aprovação', 'Baixa autonomia', 'Nenhuma'] },
    { id: 'e5', texto: 'Q5 – Qualidade e padrões', opcoes: ['Prioridade no DNA', 'Importante, mas não sempre seguida', 'Depende de cobrança externa', 'Não há padrão'] },
    { id: 'e6', texto: 'Q6 – Ferramentas de operação', opcoes: ['ERP/CRM integrados', 'Algumas digitais, não integradas', 'Recursos básicos', 'Não há'] }
  ],
  mercado: [
    { id: 'm1', texto: 'Q1 – Escuta ativa', opcoes: ['Estruturada e contínua', 'Ocasional', 'Reativa', 'Não existe'] },
    { id: 'm2', texto: 'Q2 – Integração vendas e atendimento', opcoes: ['Colaboram e compartilham', 'Trocam parcialmente', 'Trabalham em silos', 'Conflitos entre áreas'] },
    { id: 'm3', texto: 'Q3 – Reação ao mercado', opcoes: ['Antecipamos e inovamos rápido', 'Ajustamos com atraso', 'Só reagimos a crises', 'Não há adaptação'] },
    { id: 'm4', texto: 'Q4 – Metas de vendas', opcoes: ['Claro e revisado', 'Existe, pouco revisado', 'Informal', 'Não há'] },
    { id: 'm5', texto: 'Q5 – Diferencial competitivo', opcoes: ['Claro e vivo', 'Existe, mas mal divulgado', 'Incerto', 'Não há clareza'] },
    { id: 'm6', texto: 'Q6 – Ferramentas de clientes', opcoes: ['CRM e BI estruturados', 'Planilhas/relatórios', 'Feedbacks informais', 'Nenhum'] }
  ],
  direcao: [
    { id: 'd1', texto: 'Q1 – Visão de futuro', opcoes: ['Todos conhecem', 'Só a gestão conhece', 'Pouco falada', 'Não comunicada'] },
    { id: 'd2', texto: 'Q2 – Conexão dos líderes à estratégia', opcoes: ['Inspiram e alinham metas', 'Tentam, mas parcial', 'Pouca conexão', 'Não há'] },
    { id: 'd3', texto: 'Q3 – Papel da inovação', opcoes: ['Prioridade central', 'Importante, sem orçamento', 'Ocasional', 'Não prioridade'] },
    { id: 'd4', texto: 'Q4 – Atividades x objetivos', opcoes: ['Sempre clara', 'Parcial, depende do gestor', 'Raramente', 'Nunca'] },
    { id: 'd5', texto: 'Q5 – Propósito e impacto social', opcoes: ['No centro das decisões', 'Importante, secundário', 'Falado, mas não aplicado', 'Não há preocupação'] },
    { id: 'd6', texto: 'Q6 – Ferramentas estratégicas', opcoes: ['Dashboards, OKRs', 'Planilhas/relatórios', 'Discussões informais', 'Não há'] }
  ]
};

const Formulario: React.FC = () => {
  const [dimensoesSelecionadas, setDimensoesSelecionadas] = useState<string[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [respostas, setRespostas] = useState<Respostas>({});
  const [respostaAtual, setRespostaAtual] = useState<number | null>(null);
  const [etapa, setEtapa] = useState<'selecionar' | 'perguntas' | 'finalizado'>('selecionar');
  const [indiceAtual, setIndiceAtual] = useState<number>(0);

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      if (dimensoesSelecionadas.length < 3) {
        setDimensoesSelecionadas([...dimensoesSelecionadas, value]);
      } else {
        e.target.checked = false;
        alert('Você pode selecionar até 3 dimensões.');
      }
    } else {
      setDimensoesSelecionadas(dimensoesSelecionadas.filter((d) => d !== value));
    }
  };

  const iniciarPerguntas = () => {
    let todas: Pergunta[] = [];
    dimensoesSelecionadas.forEach((dim) => {
      todas = [...todas, ...perguntasPorDimensao[dim as keyof PerguntasPorDimensao]];
    });
    setPerguntas(todas);
    setEtapa('perguntas');
  };

  const confirmarResposta = () => {
    const pergunta = perguntas[indiceAtual];
    setRespostas({ ...respostas, [pergunta.id]: respostaAtual });
    setRespostaAtual(null);
    if (indiceAtual + 1 < perguntas.length) {
      setIndiceAtual(indiceAtual + 1);
    } else {
      setEtapa('finalizado');
    }
  };

  return (
    <div className="formulario-container">
      <div className="formulario-header">
        <div className="linha" />
        <h1>Formulário</h1>
        <div className="linha" />
        <p>Nos conte sobre sua empresa.</p>
      </div>

      {etapa === 'selecionar' && (
        <>
          <h2>Escolha até 3 dimensões para responder:</h2>
          {Object.keys(perguntasPorDimensao).map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                value={key}
                onChange={handleCheckboxChange}
              />
              {' '}
              {key.charAt(0).toUpperCase() + key.slice(1).replace('&', ' & ')}
            </label>
          ))}
          <br />
          <button onClick={iniciarPerguntas} disabled={dimensoesSelecionadas.length === 0}>
            Iniciar
          </button>
        </>
      )}

      {etapa === 'perguntas' && (
        <div className="pergunta-bloco">
          <h3>{perguntas[indiceAtual].texto}</h3>
          {perguntas[indiceAtual].opcoes.map((op, idx) => (
            <label key={idx}>
              <input
                type="radio"
                name={`resposta-${indiceAtual}`}
                value={idx + 1}
                checked={respostaAtual === idx + 1}
                onChange={() => setRespostaAtual(idx + 1)}
              />
              {' '}
              {op}
            </label>
          ))}
          <button onClick={confirmarResposta} disabled={respostaAtual === null}>
            Confirmar resposta
          </button>
        </div>
      )}

      {etapa === 'finalizado' && (
        <div>
          <h2>Respostas concluídas!</h2>
          <pre>{JSON.stringify(respostas, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Formulario;