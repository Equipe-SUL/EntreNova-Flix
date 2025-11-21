import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Formulario.css';
// --- CORREÇÃO: Combinando as duas importações do 'api' em uma linha ---
import api, { validarCNPJ } from '../services/api';

// --- CORREÇÃO: Combinando as duas importações de 'types' em uma linha ---
import { 
  IEmpresa, 
  IPergunta, 
  IPerguntasPorDimensao, 
  IRespostas,
  IPerguntaLead, 
  IRespostasLead, 
  IScoreLead 
} from '../types/empresa.types';


const perguntasPorDimensao: IPerguntasPorDimensao = {
  pessoas: [
    {
      id: 'p1', texto: 'Questão 1 – Como a comunicação acontece no dia a dia?', opcoes: ['Todos têm clareza e acesso fácil às informações', 'Funciona na maior parte do tempo, mas com algumas falhas.'
        , 'Normalmente só em reuniões formais ou quando há problemas', 'É confusa, cada líder comunica de um jeito.'
      ]
    },
    { id: 'p2', texto: 'Questão 2 – Como você descreveria o estilo de liderança predominante?', opcoes: ['Engajam e dão autonomia', 'São bons, mas variam conforme o líder', 'Centralizam muito as decisões.', 'Raramente exercem liderança ativa'] },
    { id: 'p3', texto: 'Questão 3 – Quando surgem problemas, como os times costumam agir?', opcoes: ['Trazem ideias e resolvem juntos.', 'Resolvem, mas de forma reativa', 'Dependem sempre do gestor para decidir', 'Evitam mudanças e preferem manter como está'] },
    { id: 'p4', texto: 'Questão 4 – Como está organizada a rotina de trabalho?', opcoes: ['Papéis e prioridades são claros', 'Há certa clareza, mas faltam recursos ou prazos realistas.', 'Muitas vezes é confusa, com foco em “apagar incêndios”', 'Não há organização definida, cada um faz do seu jeito'] },
    { id: 'p5', texto: 'Questão 5 – Até que ponto os valores da empresa estão presentes no dia a dia?', opcoes: ['Claros e vividos na prática', 'Conhecidos, mas pouco aplicados.', 'Pouco lembrados, só em discurso', 'Não há clareza sobre os valores'] },
    { id: 'p6', texto: 'Questão 6 – Quais ferramentas apoiam pessoas & cultura?', opcoes: ['Temos plataforma estruturada de desenvolvimento', 'Algumas iniciativas digitais, mas sem consistência', 'Recursos informais (planilhas, grupos de mensagens)', 'Não temos ferramentas definidas'] }
  ],
  estrutura: [
    { id: 'e1', texto: 'Questão 1 – Como é a troca de informações entre áreas?', opcoes: ['Integrada e frequente.', 'Funciona em parte, com alguns ruídos.', 'Depende de reuniões formais.', 'As áreas trabalham isoladas.'] },
    { id: 'e2', texto: 'Questão 2 – Como os gestores lidam com delegação?', opcoes: ['Delegam com clareza e confiança.', 'Delegam, mas acompanham em excesso.', 'Raramente delegam.', 'Não delegam, concentram tudo.'] },
    { id: 'e3', texto: 'Questão 3 – Quando processos falham, o que acontece?', opcoes: ['As equipes propõem melhorias rapidamente.', 'Há ajustes, mas com demora.', 'Só a gestão revisa processos.', 'Nada muda, seguimos com os problemas.'] },
    { id: 'e4', texto: 'Questão 4 – Quanta autonomia operacional os colaboradores têm?', opcoes: ['Alta, com responsabilidade.', 'Alguma, mas dependem de aprovações.', 'Pouca, com muito controle.', 'Nenhuma, tudo vem da gestão.'] },
    { id: 'e5', texto: 'Questão 5 – Qual é a relação da empresa com padrões de qualidade?', opcoes: ['Qualidade é prioridade e está no DNA.', 'Importante, mas não sempre seguida.', 'Depende da cobrança externa.', 'Não há padrão definido.'] },
    { id: 'e6', texto: 'Questão 6 – Quais ferramentas apoiam as operações do dia a dia?', opcoes: ['Sistemas integrados (ERP, CRM, dashboards).', 'Algumas ferramentas digitais, mas sem integração.', 'Recursos básicos (planilhas, controles manuais).', 'Não há ferramentas.'] }
  ],
  mercado: [
    { id: 'm1', texto: 'Questão 1 – Como a empresa ouve seus clientes?', opcoes: ['Temos pesquisa estruturada e contínua.', 'Fazemos de forma ocasional.', 'Reagimos só em reclamações.', 'Não há escuta formal.'] },
    { id: 'm2', texto: 'Questão 2 – Como vendas e atendimento trabalham juntos?', opcoes: ['Colaboram e compartilham informações.', 'Trocam parcialmente, com falhas.', 'Atuam isolados, sem integração.', 'Há conflitos ou competição entre áreas.'] },
    { id: 'm3', texto: 'Questão 3 – Quando o mercado muda, como a empresa reage?', opcoes: ['Antecipamos tendências e inovamos rápido.', 'Ajustamos, mas com atraso.', 'Só reagimos a crises.', 'Não temos adaptação estruturada.'] },
    { id: 'm4', texto: 'Questão 4 – Como é o acompanhamento de metas comerciais?', opcoes: ['Claro, transparente e frequente.', 'Existe, mas pouco revisado.', 'Informal, depende do gestor.', 'Não temos acompanhamento.'] },
    { id: 'm5', texto: 'Questão 5 – O diferencial competitivo está claro?', opcoes: ['Sim, é comunicado e reconhecido.', 'Existe, mas pouco divulgado.', 'É incerto, varia por área.', 'Não está claro.'] },
    { id: 'm6', texto: 'Questão 6 – Quais ferramentas apoiam mercado & clientes?', opcoes: ['CRM, BI e pesquisas estruturadas.', 'Algumas planilhas e relatórios.', 'Feedbacks informais, dados dispersos.', 'Não há recursos específicos.'] }
  ],
  direcao: [
    { id: 'd1', texto: 'Questão 1 – Como a visão de futuro é comunicada?', opcoes: ['Todos conhecem e entendem.', 'É conhecida, mas só pela gestão.', 'Quase não é falada.', 'Não é comunicada.'] },
    { id: 'd2', texto: 'Questão 2 – Como os líderes conectam pessoas à estratégia?', opcoes: ['Inspiram e alinham metas claramente.', 'Tentam alinhar, mas varia muito.', 'Há pouca conexão.', 'Não há esforço de alinhamento.'] },
    { id: 'd3', texto: 'Questão 3 – Qual é o papel da inovação no planejamento?', opcoes: ['Prioridade central, com projetos claros.', 'Importante, mas sem orçamento.', 'Acontece de forma isolada.', 'Não é prioridade.'] },
    { id: 'd4', texto: 'Questão 4 – Como as atividades diárias se conectam com a estratégia?', opcoes: ['Sempre, com clareza.', 'Às vezes, depende do gestor.', 'Raramente, não chega claro.', 'Nunca, cada área segue isolada.'] },
    { id: 'd5', texto: 'Questão 5 – Como a empresa lida com propósito e impacto social?', opcoes: ['Está no centro das decisões.', 'É importante, mas secundário.', 'Fala-se, mas não se aplica.', 'Não há preocupação.'] },
    { id: 'd6', texto: 'Questão 6 – Quais ferramentas apoiam a estratégia?', opcoes: ['Dashboards, OKRs, planejamentos formais.', 'Algumas planilhas ou relatórios.', 'Discussões informais, sem registro contínuo.', 'Não temos instrumentos claros'] }
  ]
};

const perguntasLead: IPerguntaLead[] = [
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

    // Função auxiliar para encontrar a pergunta completa pelo ID
    const getPerguntaCompleta = (perguntaId: string): IPergunta | undefined => {
      for (const dim in perguntasPorDimensao) {
        const perguntaEncontrada = perguntasPorDimensao[dim as keyof IPerguntasPorDimensao].find(p => p.id === perguntaId);
        if (perguntaEncontrada) {
          return perguntaEncontrada;
        }
      }
      return undefined;
    };

    // Formata as respostas do quiz com a estrutura correta esperada pelo backend
    const respostasFormatadasParaIA = Object.entries(respostas).map(([perguntaId, respostaIndex]) => {
      const perguntaObj = getPerguntaCompleta(perguntaId);

      // Garante que temos o objeto da pergunta antes de formatar
      if (!perguntaObj || respostaIndex === null) {
        console.warn(`Pergunta ${perguntaId} não encontrada ou sem resposta, pulando.`);
        return null; // Retorna null para filtrar depois
      }

      return {
        pergunta: perguntaObj.texto,          // O texto da pergunta
        opcoes: perguntaObj.opcoes,          // O array de opções
        respostaIndex: respostaIndex,        // O índice da resposta selecionada
        perguntaId: perguntaId,              // Mantém o ID se precisar no backend para outra coisa
        // 'resposta' com o texto não é mais necessário aqui se o backend usa o index
      };
    }).filter(item => item !== null); // Remove itens nulos caso alguma pergunta não seja encontrada

    // Monta o payload final
    const payload = {
      dadosEmpresa: empresa,
      dadosQuiz: respostasFormatadasParaIA, // Usa o novo array formatado
      scoreLead,
      // dimensoesSelecionadas não parece ser usado no backend 'salvarDiagnosticoCompleto', mas pode manter se planeja usar
    };

    console.log("Payload enviado para /api/diagnostico:", payload); // Log para depuração

    try {
      const response = await api.post('/diagnostico', payload);
      const reportId = response.data.reportId;
      navigate(`/resultado/${reportId}`);
    } catch (error: any) { // Captura 'any' para inspecionar a resposta do erro
      console.error("Erro detalhado ao enviar diagnóstico:", error);
      // Mostra a mensagem de erro vinda do backend, se disponível
      const errorMsg = error.response?.data?.erro || error.message || 'Ocorreu um erro desconhecido.';
      
      // ***** ALTERAÇÃO AQUI *****
      // Seta APENAS a mensagem de erro, sem texto extra
      setStatusEnvio(errorMsg); 
      // alert(`Erro ao enviar: ${errorMsg}`); // Alert é opcional, a mensagem no CSS é melhor
    }
  };

  return (
    <div id="questionario" className="formulario-container">
      <div className="formulario-header">

        <h1>Diagnóstico Empresarial</h1>

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
          {/* corrigi o bug que o moreira achou*/}
          <button 
            onClick={iniciarPerguntas} 
            disabled={dimensoesSelecionadas.length === 0}
          >
            Iniciar Perguntas
          </button>
          {/* agora precisa selecionar ao menos 1*/}
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

      {/* ***** BLOCO FINAL ATUALIZADO (OPÇÃO 2) ***** */}
      {etapa === 'finalizado' && (
        <div className="finalizacao-container">
          <h2 id='h2parabens' >Parabéns! Você finalizou o diagnóstico.</h2>
          
          {/* Mostra o erro se statusEnvio NÃO for 'Enviando...' e NÃO estiver vazio.
          */}
          {statusEnvio && statusEnvio !== 'Enviando...' && (
            <p className="mensagem-erro-envio">
              Erro: {statusEnvio}
            </p>
          )}

          <button onClick={handleSubmitFinal} disabled={statusEnvio === 'Enviando...'}>
            {/* Verifica o estado:
              1. Se tiver erro (statusEnvio preenchido e != 'Enviando...') -> "Tentar Novamente"
              2. Se estiver carregando (statusEnvio === 'Enviando...') -> "Enviando..."
              3. Se estiver limpo (inicial) -> "Ver Resultado"
            */}
            {statusEnvio && statusEnvio !== 'Enviando...'
              ? 'Tentar Novamente'
              : (statusEnvio === 'Enviando...' ? 'Enviando...' : 'Ver Resultado')}
          </button>
        </div>
      )}
    </div>
  );
};

export default Formulario;