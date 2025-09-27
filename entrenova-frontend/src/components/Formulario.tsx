import React, { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Formulario.css';
import api from '../services/api'; 
import { validarCNPJ } from '../services/api'

import { IEmpresa, IPergunta, IPerguntasPorDimensao, IRespostas } from '../types/empresa.types';
import { IPerguntaLead, IRespostasLead, IScoreLead } from '../types/empresa.types';


const perguntasPorDimensao: IPerguntasPorDimensao = {
  pessoas: [
    { id: 'p1', texto: 'Questão 1 – Comunicação interna', opcoes: ['Clara, frequente e bidirecional', 'Funciona, mas nem sempre chega a todos', 'Só em reuniões formais ou quando há problemas', 'Pouco estruturada'] },
    { id: 'p2', texto: 'Questão 2 – Postura de liderança', opcoes: ['Engajadora, dá autonomia e orienta', 'Boa, mas depende do líder individual', 'Centralizadora, pouco espaço para protagonismo', 'Inexistente, decisões sempre de cima para baixo'] },
    { id: 'p3', texto: 'Questão 3 – Resolução de problemas', opcoes: ['Ideias novas e soluções conjuntas', 'Resolvem, mas reativos', 'Dependem da liderança', 'Evitam mudanças'] },
    { id: 'p4', texto: 'Questão 4 – Organização do trabalho', opcoes: ['Clareza de papéis e prioridades', 'Clareza parcial, mas falta recurso', 'Confuso, apagando incêndios', 'Sem organização clara'] },
    { id: 'p5', texto: 'Questão 5 – Valores e propósito', opcoes: ['Claros e aplicados', 'Conhecidos, mas pouco aplicados', 'Pouco lembrados, só em discurso', 'Não há clareza'] },
    { id: 'p6', texto: 'Questão 6 – Ferramentas de desenvolvimento', opcoes: ['Plataformas estruturadas', 'Algumas iniciativas digitais', 'Recursos informais', 'Não há ferramentas'] }
  ],
  estrutura: [
    { id: 'e1', texto: 'Questão 1 – Fluxo de informação entre áreas', opcoes: ['Integração constante', 'Em parte, com ruídos', 'Depende de reuniões formais', 'Áreas isoladas'] },
    { id: 'e2', texto: 'Questão 2 – Delegação dos gestores', opcoes: ['Delegam com confiança', 'Delegam, mas controlam em excesso', 'Raramente delegam', 'Não delegam'] },
    { id: 'e3', texto: 'Questão 3 – Ajustes de processos', opcoes: ['Equipes propõem melhorias', 'Ajustes demoram', 'Só gestão revisa', 'Nada muda'] },
    { id: 'e4', texto: 'Questão 4 – Autonomia operacional', opcoes: ['Alta autonomia com responsabilidade', 'Alguma, mas depende de aprovação', 'Baixa autonomia', 'Nenhuma'] },
    { id: 'e5', texto: 'Questão 5 – Qualidade e padrões', opcoes: ['Prioridade no DNA', 'Importante, mas não sempre seguida', 'Depende de cobrança externa', 'Não há padrão'] },
    { id: 'e6', texto: 'Questão 6 – Ferramentas de operação', opcoes: ['ERP/CRM integrados', 'Algumas digitais, não integradas', 'Recursos básicos', 'Não há'] }
  ],
  mercado: [
    { id: 'm1', texto: 'Questão 1 – Escuta ativa', opcoes: ['Estruturada e contínua', 'Ocasional', 'Reativa', 'Não existe'] },
    { id: 'm2', texto: 'Questão 2 – Integração vendas e atendimento', opcoes: ['Colaboram e compartilham', 'Trocam parcialmente', 'Trabalham em silos', 'Conflitos entre áreas'] },
    { id: 'm3', texto: 'Questão 3 – Reação ao mercado', opcoes: ['Antecipamos e inovamos rápido', 'Ajustamos com atraso', 'Só reagimos a crises', 'Não há adaptação'] },
    { id: 'm4', texto: 'Questão 4 – Metas de vendas', opcoes: ['Claro e revisado', 'Existe, pouco revisado', 'Informal', 'Não há'] },
    { id: 'm5', texto: 'Questão 5 – Diferencial competitivo', opcoes: ['Claro e vivo', 'Existe, mas mal divulgado', 'Incerto', 'Não há'] },
    { id: 'm6', texto: 'Questão 6 – Ferramentas de clientes', opcoes: ['CRM e BI estruturados', 'Planilhas/relatórios', 'Feedbacks informais', 'Nenhum'] }
  ],
  direcao: [
    { id: 'd1', texto: 'Questão 1 – Visão de futuro', opcoes: ['Todos conhecem', 'Só a gestão conhece', 'Pouco falada', 'Não comunicada'] },
    { id: 'd2', texto: 'Questão 2 – Conexão dos líderes à estratégia', opcoes: ['Inspiram e alinham metas', 'Tentam, mas parcial', 'Pouca conexão', 'Não há'] },
    { id: 'd3', texto: 'Questão 3 – Papel da inovação', opcoes: ['Prioridade central', 'Importante, sem orçamento', 'Ocasional', 'Não prioridade'] },
    { id: 'd4', texto: 'Questão 4 – Atividades x objetivos', opcoes: ['Sempre clara', 'Parcial, depende do gestor', 'Raramente', 'Nunca'] },
    { id: 'd5', texto: 'Questão 5 – Propósito e impacto social', opcoes: ['No centro das decisões', 'Importante, secundário', 'Falado, mas não aplicado', 'Não há preocupação'] },
    { id: 'd6', texto: 'Questão 6 – Ferramentas estratégicas', opcoes: ['Dashboards, OKRs', 'Planilhas/relatórios', 'Discussões informais', 'Não há'] }
  ]
};

const perguntasLead : IPerguntaLead[] = [
  { id: 'lead1', texto: 'Número de colaboradores', opcoes: ['Até 10', '11 a 30', '31 a 100', '101 a 500', 'Acima de 500'], pontos: [1, 2, 3, 4, 5] },
  { id: 'lead2', texto: 'Porte da empresa', opcoes: ['Startup', 'PME', 'Grande empresa'], pontos: [2, 3, 5] },
  { id: 'lead3', texto: 'Investimento Disponível', opcoes: ['Até R$ 10 mil', 'Entre R$ 10 mil e R$ 50 mil', 'Acima de R$ 50 mil'], pontos: [1, 3, 5] },
  { id: 'lead4', texto: 'Decisor Principal', opcoes: ['CEO / Diretor', 'RH / T&D', 'Marketing / Comunicação', 'Outro'], pontos: [3, 2, 1, 0] },
  { id: 'lead5', texto: 'De 1 a 5, abertura da empresa para ideias inovadoras em treinamentos:', opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'], pontos: [0, 0, 1, 2, 3] },
  { id: 'lead6', texto: 'De 1 a 5, importância atribuída a investir em desenvolvimento profissional:', opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'], pontos: [0, 0, 1, 2, 3] },
  { id: 'lead7', texto: 'De 1 a 5, importância atribuída a desenvolver soft skills (comunicação, liderança, criatividade):', opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'], pontos: [0, 0, 1, 2, 3] },
  { id: 'lead8', texto: 'De 1 a 5, importância atribuída a incentivar cultura, arte e hobbies:', opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'], pontos: [0, 0, 1, 2, 3] },
  { id: 'lead9', texto: 'De 1 a 5, importância atribuída a reconhecer impacto do desenvolvimento humano na performance:', opcoes: ['1 - Muito baixa', '2 - Baixa', '3 - Média', '4 - Alta', '5 - Muito alta'], pontos: [0, 0, 1, 2, 3] },
  { id: 'lead10', texto: 'Projetos inovadores anteriores?', opcoes: ['Sim', 'Não'], pontos: [2, 0] },
  { id: 'lead11', texto: 'Urgência para implementação', opcoes: ['Imediatamente', 'Até 3 meses', '6 meses ou mais'], pontos: [3, 2, 1] }
];

const Formulario = () => {
  const navigate = useNavigate();
  const [empresa, setEmpresa] = useState<IEmpresa>({ cnpj: '', nome: '', email: '', telefone: '', setor: '' });
  const [dimensoesSelecionadas, setDimensoesSelecionadas] = useState<string[]>([]);
  const [perguntas, setPerguntas] = useState<IPergunta[]>([]);
  const [respostas, setRespostas] = useState<IRespostas>({});
  const [respostaAtual, setRespostaAtual] = useState<number | null>(null);
  const [etapa, setEtapa] = useState<'empresa' | 'selecionar' | 'perguntas' | 'lead' | 'finalizado'>('empresa');
  const [respostasLead, setRespostasLead] = useState<IRespostasLead>({});
  const [respostaAtualLead, setRespostaAtualLead] = useState<number | null>(null);
  const [indiceLeadAtual, setIndiceLeadAtual] = useState<number>(0);
  const [scoreLead, setScoreLead] = useState<IScoreLead | null>(null);
  const [indiceAtual, setIndiceAtual] = useState<number>(0);
  const [statusEnvio, setStatusEnvio] = useState<string>('');
  const [cnpjExistente, setCnpjExistente] = useState<boolean>(false);
  const getDimensaoAtual = (): string | null => {
  if (!perguntas[indiceAtual]) return null;

  for (const dim in perguntasPorDimensao) {
    if (perguntasPorDimensao[dim as keyof IPerguntasPorDimensao].some(p => p.id === perguntas[indiceAtual].id)) {
      return nomesDimensao[dim]; // usa o nome bonito
    }
  }
  return null;
};
    const nomesDimensao: { [key: string]: string } = {
    pessoas: 'Pessoas & Cultura',
    estrutura: 'Estrutura & Operações',
    mercado: 'Mercado & Clientes',
    direcao: 'Direção & Futuro'
  };


  const calcularScoreLead = (respostas: IRespostasLead): IScoreLead => {
    let total = 0;
    const detalhes: { [key: string]: number } = {};

    ['lead1', 'lead2', 'lead3', 'lead4', 'lead10', 'lead11'].forEach(id => {
      if (respostas[id] !== undefined) {
        const pontos = perguntasLead.find(p => p.id === id)?.pontos[respostas[id]] || 0;
        detalhes[id] = pontos;
        total += pontos;
      }
    });

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
    
    let pontosMedia = 0;
    if (mediaCultura >= 3 && mediaCultura < 4) pontosMedia = 1;
    else if (mediaCultura >= 4 && mediaCultura < 5) pontosMedia = 2;
    else if (mediaCultura >= 5) pontosMedia = 3;

    total += pontosMedia;
    detalhes['media_cultura'] = pontosMedia;

    let classificacao: 'frio' | 'morno' | 'quente' = 'frio';
    if (total >= 19) classificacao = 'quente';
    else if (total >= 11) classificacao = 'morno';

    return { total, classificacao, detalhes };
  };

 const handleEmpresaChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if (name === 'telefone') {
    // Remove tudo que não é número
    let digits = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos (DDD 2 + número 9)
    if (digits.length > 11) digits = digits.slice(0, 11);
    
    // Formata (XX) XXXXX-XXXX
    let formatted = digits;
    if (digits.length > 2) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}`;
      if (digits.length > 7) {
        formatted += `-${digits.slice(7)}`;
      }
    }
    
    setEmpresa(prev => ({ ...prev, telefone: formatted }));
  } else if (name === 'cnpj') {
    // Formatação simples de CNPJ: 00.000.000/0000-00
    let digits = value.replace(/\D/g, '');
    if (digits.length > 14) digits = digits.slice(0, 14);
    let formatted = digits;
    if (digits.length > 2) formatted = digits.slice(0, 2) + '.' + digits.slice(2);
    if (digits.length > 5) formatted = formatted.slice(0, 6) + '.' + formatted.slice(6);
    if (digits.length > 8) formatted = formatted.slice(0, 10) + '/' + formatted.slice(10);
    if (digits.length > 12) formatted = formatted.slice(0, 15) + '-' + formatted.slice(15);
    
    setEmpresa(prev => ({ ...prev, cnpj: formatted }));
  } else {
    setEmpresa(prev => ({ ...prev, [name]: value }));
  }
};


    const validarEmpresa = async (): Promise<boolean> => {
  // checa se todos os campos obrigatórios foram preenchidos
  if (!empresa.cnpj || !empresa.nome || !empresa.email || !empresa.telefone || !empresa.setor) {
    alert('Preencha todos os campos obrigatórios: CNPJ, Nome, Email, Telefone e Setor de Atuação.');
    return false;
  }

  // remove tudo que não é número
  const cnpjNumeros = empresa.cnpj.replace(/\D/g, '');

  // valida se tem exatamente 14 dígitos
  if (cnpjNumeros.length !== 14) {
    alert('O CNPJ precisa ter exatamente 14 dígitos.');
    return false;
  }

  try {
    const response = await validarCNPJ(cnpjNumeros); // envia só números pro backend
    const existe = response.data.valido;
    setCnpjExistente(existe);

    if (existe) {
      alert('Este CNPJ já está cadastrado.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Erro ao validar CNPJ:', error);
    alert('Erro ao validar CNPJ. Tente novamente.');
    return false;
  }
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
    if (respostaAtualLead === null) return;
    
    const pergunta = perguntasLead[indiceLeadAtual];
    setRespostasLead({ ...respostasLead, [pergunta.id]: respostaAtualLead });
    setRespostaAtualLead(null);
    
    if (indiceLeadAtual + 1 < perguntasLead.length) {
      setIndiceLeadAtual(indiceLeadAtual + 1);
    } else {
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

    const respostasFormatadas = Object.entries(respostas).map(([perguntaId, respostaIndex]) => {
      return { pergunta: perguntaId, resposta: respostaIndex, tipo: 'dimensao' };
    });

    const todasRespostas = [...respostasFormatadas];

    const payload = {
      dadosEmpresa: empresa,
      dadosQuiz: todasRespostas,
      scoreLead,
      dimensoesSelecionadas
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
            {cnpjExistente && <p className="erro">Este CNPJ já está cadastrado.</p>}
            <input type="text" name="nome" placeholder="Nome da Empresa" value={empresa.nome} onChange={handleEmpresaChange} required />
            <input type="email" name="email" placeholder="Email de Contato" value={empresa.email} onChange={handleEmpresaChange} required />
            <input type="text" name="telefone" placeholder="Telefone" value={empresa.telefone} onChange={handleEmpresaChange} />
            <input type="text" name="setor" placeholder="Setor de Atuação" value={empresa.setor} onChange={handleEmpresaChange} />
          </div>
          <button onClick={async () => {
            if (await validarEmpresa()) setEtapa('selecionar');
          }}>Avançar</button>

        </>
      )}

      {etapa === 'selecionar' && (
        <>
          <h2>Selecione até 3 dimensões para avaliação:</h2>
          {Object.keys(perguntasPorDimensao).map(dim => (
            <label key={dim}>
              <input
                type="checkbox"
                value={dim}
                checked={dimensoesSelecionadas.includes(dim)}
                onChange={handleCheckboxChange}
              />
              {dim.charAt(0).toUpperCase() + dim.slice(1)}
            </label>
          ))}
          <button onClick={iniciarPerguntas}>Iniciar Perguntas</button>
        </>
      )}

      {etapa === 'perguntas' && perguntas[indiceAtual] && (
        <>
          <h3 className="dimensao-atual">{getDimensaoAtual()}</h3>
          <h2>{perguntas[indiceAtual].texto}</h2>
          {perguntas[indiceAtual].opcoes.map((op, idx) => (
            <label key={idx}>
              <input type="radio" checked={respostaAtual === idx} onChange={() => setRespostaAtual(idx)} />
              {op}
            </label>
          ))}
          <button onClick={confirmarResposta} disabled={respostaAtual === null}>Próxima</button>
        </>
      )}

      {etapa === 'lead' && perguntasLead[indiceLeadAtual] && (
        <>
          <h3 className="h3form titulo-lead">Sobre a empresa</h3>

          <h2>{perguntasLead[indiceLeadAtual].texto}</h2>
          {perguntasLead[indiceLeadAtual].opcoes.map((op, idx) => (
            <label key={idx}>
              <input type="radio" checked={respostaAtualLead === idx} onChange={() => setRespostaAtualLead(idx)} />
              {op}
            </label>
          ))}
          <button onClick={confirmarRespostaLead} disabled={respostaAtualLead === null}>Próxima</button>
        </>
      )}

      {etapa === 'finalizado' && (
        <>
          <h2>Parabéns! Você finalizou o diagnóstico.</h2>
          <button onClick={handleSubmitFinal}>{statusEnvio || 'Ver Resultado'}</button>
        </>
      )}
    </div>
  );
};

export default Formulario;
