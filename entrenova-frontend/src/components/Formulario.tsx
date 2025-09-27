import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Formulario.css';
import api from '../services/api'; 

import { IEmpresa, IPergunta, IPerguntasPorDimensao, IRespostas } from '../types/empresa.types'; //la na pasta types esta definido os TIPOS CRIADOS POR NÓS <-- ass.vivian
import { IPerguntaLead, IRespostasLead,IScoreLead } from '../types/empresa.types';

const perguntasPorDimensao: IPerguntasPorDimensao = {
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

const perguntasLead : IPerguntaLead[] = [
  {
    id: 'lead1',
    texto: 'Número de colaboradores',
    opcoes: ['Até 10', '11 a 30', '31 a 100', '101 a 500', 'Acima de 500'],
    pontos: [1, 2, 3, 4, 5]
  },
  {
    id: 'lead2',
    texto: 'Porte da empresa',
    opcoes: ['Startup', 'PME', 'Grande empresa'],
    pontos: [2, 3, 5]
  },
  {
    id: 'lead3',
    texto: 'Investimento Disponível',
    opcoes: ['Até R$ 10 mil', 'Entre R$ 10 mil e R$ 50 mil', 'Acima de R$ 50 mil'],
    pontos: [1, 3, 5]
  },
  {
    id: 'lead4',
    texto: 'Decisor Principal',
    opcoes: ['CEO / Diretor', 'RH / T&D', 'Marketing / Comunicação', 'Outro'],
    pontos: [3, 2, 1, 0]
  },
  {
    id: 'lead5',
    texto: 'De 1 a 5, abertura da empresa para ideias inovadoras em treinamentos:',
    opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'],
    pontos: [0, 0, 1, 2, 3]
  },
  {
    id: 'lead6',
    texto: 'De 1 a 5, importância atribuída a investir em desenvolvimento profissional:',
    opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'],
    pontos: [0, 0, 1, 2, 3]
  },
  {
    id: 'lead7',
    texto: 'De 1 a 5, importância atribuída a desenvolver soft skills (comunicação, liderança, criatividade):',
    opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'],
    pontos: [0, 0, 1, 2, 3]
  },
  {
    id: 'lead8',
    texto: 'De 1 a 5, importância atribuída a incentivar cultura, arte e hobbies:',
    opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'],
    pontos: [0, 0, 1, 2, 3]
  },
  {
    id: 'lead9',
    texto: 'De 1 a 5, importância atribuída a reconhecer impacto do desenvolvimento humano na performance:',
    opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'],
    pontos: [0, 0, 1, 2, 3]
  },
  {
    id: 'lead10',
    texto: 'Projetos inovadores anteriores?',
    opcoes: ['Sim', 'Não'],
    pontos: [2, 0]
  },
  {
    id: 'lead11',
    texto: 'Urgência para implementação',
    opcoes: ['Imediatamente', 'Até 3 meses', '6 meses ou mais'],
    pontos: [3, 2, 1]
  }
]


// funçao compoinent normal (arrow function) sem parametros, só receber < -- ass. vivian
const Formulario = () => {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<IEmpresa>({ cnpj: '', nome: '', email: '', telefone: '', setor: '' });
  const [dimensoesSelecionadas, setDimensoesSelecionadas] = useState<string[]>([]);
  const [perguntas, setPerguntas] = useState<IPergunta[]>([]);
  const [respostas, setRespostas] = useState<IRespostas>({});
  const [respostaAtual, setRespostaAtual] = useState<number | null>(null);
  // Novos States para o lead
  const [etapa, setEtapa] = useState<'empresa' | 'selecionar' | 'perguntas' | 'lead' | 'finalizado'>('empresa');
  const [respostasLead, setRespostasLead] = useState<IRespostasLead>({});
  const [respostaAtualLead, setRespostaAtualLead] = useState<number | null>(null);
  const [indiceLeadAtual, setIndiceLeadAtual] = useState<number>(0);
  const [scoreLead, setScoreLead] = useState<IScoreLead | null>(null);
  const [indiceAtual, setIndiceAtual] = useState<number>(0);
  const [statusEnvio, setStatusEnvio] = useState<string>('');


  //Função para Calcular o lead Vai da linha 132 até 179

    const calcularScoreLead = (respostas: IRespostasLead): IScoreLead => {
    let total = 0;
    const detalhes: { [key: string]: number } = {};

    // Calcular pontos das perguntas 1-4, 10-11 (individuais)
    ['lead1', 'lead2', 'lead3', 'lead4', 'lead10', 'lead11'].forEach(id => {
      if (respostas[id] !== undefined) {
        const pontos = perguntasLead.find(p => p.id === id)?.pontos[respostas[id]] || 0;
        detalhes[id] = pontos;
        total += pontos;
      }
    });

    // Calcular média das perguntas de cultura (lead5 a lead9)
    const perguntasCultura = ['lead5', 'lead6', 'lead7', 'lead8', 'lead9'];
    let somaCultura = 0;
    let countCultura = 0;

    perguntasCultura.forEach(id => {
      if (respostas[id] !== undefined) {
        const pontos = perguntasLead.find(p => p.id === id)?.pontos[respostas[id]] || 0;
        detalhes[id] = pontos;
        somaCultura += pontos;
        countCultura++;
      }
    });

    const mediaCultura = countCultura > 0 ? somaCultura / countCultura : 0;
    
    // Aplicar regra da média
    let pontosMedia = 0;
    if (mediaCultura >= 3 && mediaCultura < 4) pontosMedia = 1;
    else if (mediaCultura >= 4 && mediaCultura < 5) pontosMedia = 2;
    else if (mediaCultura >= 5) pontosMedia = 3;

    total += pontosMedia;
    detalhes['media_cultura'] = pontosMedia;

    // Classificação final
    let classificacao: 'frio' | 'morno' | 'quente' = 'frio';
    if (total >= 19) classificacao = 'quente';
    else if (total >= 11) classificacao = 'morno';

    return { total, classificacao, detalhes };
  };



  /*
    handleEmpresaChange -- O QUE ELA FAZ? --->  anotar as informações da empresa (CNPJ, nome, email, etc.) à medida que o usuário digita nos campos.
  O usuário digita uma letra no campo "Nome da Empresa".

  -- > Essa função é chamada imediatamente.

  
  Ela olha duas coisas: "Em qual campo ele digitou?" (e.target.name, que seria "nome") e "Qual é o texto completo agora?" (e.target.value).

  Ela então pega a "ficha de cadastro" da empresa que está na memória do componente (o useState chamado empresa) e atualiza apenas o campo "nome" com o novo texto.
  */

  const handleEmpresaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmpresa(prevState => ({ ...prevState, [e.target.name]: e.target.value })); // informações da empresa (CNPJ, nome, email, etc.) à medida que o usuário digita nos campos. <-- ass.vivian
  };

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
    let todas: IPergunta[] = [];
    dimensoesSelecionadas.forEach((dim) => {
      todas = [...todas, ...perguntasPorDimensao[dim as keyof IPerguntasPorDimensao]];
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
      setEtapa('lead');
    }
  };

  const confirmarRespostaLead = () => {
    // Verificar se há uma resposta selecionada antes de continuar
    if (respostaAtualLead === null) return;
    
    const pergunta = perguntasLead[indiceLeadAtual];
    
    // Garantir que respostaAtualLead é number, não null
    setRespostasLead({ ...respostasLead, [pergunta.id]: respostaAtualLead });
    setRespostaAtualLead(null);
    
    if (indiceLeadAtual + 1 < perguntasLead.length) {
      setIndiceLeadAtual(indiceLeadAtual + 1);
    } else {
      // CALCULAR SCORE AO TERMINAR
      const score = calcularScoreLead({ 
        ...respostasLead, 
        [pergunta.id]: respostaAtualLead 
      });
      setScoreLead(score);
      setEtapa('finalizado');
    }
  };  

  const handleSubmitFinal = async () => {
  setStatusEnvio('Enviando...');

    // Formatando respostas das DIMENSÕES
    const respostasFormatadas = Object.entries(respostas).map(([perguntaId, respostaIndex]) => {
      return {
        pergunta: perguntaId,
        resposta: respostaIndex,
        tipo: 'dimensao'
      };
    });

    // Formatando respostas do LEAD (nova parte)
    const respostasLeadFormatadas = Object.entries(respostasLead).map(([perguntaId, respostaIndex]) => {
      const pergunta = perguntasLead.find(p => p.id === perguntaId);
      const pontos = pergunta?.pontos[respostaIndex] || 0;
      
      return {
        pergunta: perguntaId,
        resposta: respostaIndex,
        pontos: pontos,
        tipo: 'lead'
      };
    });

    // Juntando todas as respostas
    const todasRespostas = [...respostasFormatadas, ...respostasLeadFormatadas];

    const payload = {
      dadosEmpresa: empresa,
      dadosQuiz: todasRespostas,
      scoreLead: scoreLead, // Inclui o score calculado
      dimensoesSelecionadas: dimensoesSelecionadas
    };

    try {
      const response = await api.post('/diagnostico', payload);
      const reportId = response.data.reportId;
      navigate(`/resultado/${reportId}`);
    } catch (error) {
      console.error("Erro ao enviar diagnóstico:", error);
      setStatusEnvio('Ocorreu um erro ao salvar. Tente novamente.');
    }
  };


  return (
    // id="questionario" para ser a âncora do scroll <-- NAO É ROTA, SÓ SCROLL <-- ass.vivian
    <div id="questionario" className="formulario-container">
      <div className="formulario-header">
        <div className="linha" />
        <h1>Diagnóstico Empresarial</h1>
        <div className="linha" />
      </div>

      {etapa === 'empresa' && (
        <>
          <h2>Primeiro, nos conte sobre sua empresa.</h2>
          <div className="empresa-form">
            <input type="text" name="cnpj" placeholder="CNPJ" value={empresa.cnpj} onChange={handleEmpresaChange} required />
            <input type="text" name="nome" placeholder="Nome da Empresa" value={empresa.nome} onChange={handleEmpresaChange} required />
            <input type="email" name="email" placeholder="Email de Contato" value={empresa.email} onChange={handleEmpresaChange} required />
            <input type="text" name="telefone" placeholder="Telefone" value={empresa.telefone} onChange={handleEmpresaChange} />
            <input type="text" name="setor" placeholder="Setor de Atuação" value={empresa.setor} onChange={handleEmpresaChange} />
          </div>
          <button onClick={() => setEtapa('selecionar')}>Avançar</button>
        </>
      )}

      {etapa === 'selecionar' && (
        <>
          <h2>Escolha até 3 dimensões para o diagnóstico:</h2>
          {Object.keys(perguntasPorDimensao).map((key) => (
            <label key={key}>
              <input type="checkbox" value={key} onChange={handleCheckboxChange} />
              {' '} {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
          <br />
          <button onClick={iniciarPerguntas} disabled={dimensoesSelecionadas.length === 0}>
            Iniciar Perguntas
          </button>
        </>
      )}

      {etapa === 'perguntas' && perguntas[indiceAtual] && (
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
              {' '} {op}
            </label>
          ))}
          <button onClick={confirmarResposta} disabled={respostaAtual === null}>
            Confirmar resposta
          </button>
        </div>
      )}

       {etapa === 'lead' && perguntasLead[indiceLeadAtual] && (
        <div className="pergunta-bloco">
          <h3>Perfil da Empresa - Lead Scoring ({indiceLeadAtual + 1}/{perguntasLead.length})</h3>
          <h4>{perguntasLead[indiceLeadAtual].texto}</h4>
          {perguntasLead[indiceLeadAtual].opcoes.map((op, idx) => (
          <label key={idx}>
            <input
              type="radio"
              name={`resposta-lead-${indiceLeadAtual}`}
              value={idx + 1} // ← MUDAR DE idx PARA idx + 1
              checked={respostaAtualLead === idx + 1} // ← MUDAR AQUI TAMBÉM
              onChange={() => setRespostaAtualLead(idx + 1)} // ← E AQUI
            />
            {' '} {op}
          </label>
        ))}
          <button onClick={confirmarRespostaLead} disabled={respostaAtualLead === null}>
            {indiceLeadAtual + 1 === perguntasLead.length ? 'Calcular Score' : 'Próxima Pergunta'}
          </button>
        </div>
      )}

      {etapa === 'finalizado' && (
        <div>
          <h2>Diagnóstico concluído!</h2>
          <p>Tudo pronto para salvar e gerar sua análise.</p>
          <button onClick={handleSubmitFinal}>
            Salvar e ver resultado
          </button>
          {statusEnvio && <p>{statusEnvio}</p>}
        </div>
      )}
    </div>
  );
};

export default Formulario;