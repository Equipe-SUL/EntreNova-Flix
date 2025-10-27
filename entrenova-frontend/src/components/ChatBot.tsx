import { useState, useRef, useEffect } from "react";
import "../styles/Chatbot.css";
import IrisAvatar from "../assets/Iris.jpg";
import { validarCNPJ, salvarResposta, salvarPlano, gerarRelatorioTotal } from "../services/api";
import { Message } from '../types/message';
import { useNavigate } from "react-router-dom";




const mensagensIniciais = [
  "Gostaria que me contasse, de forma resumida, os desafios ou situações que você tem percebido na empresa.",
  "Assim consigo entender melhor o que acontece e como podemos refletir sobre isso juntos para gerar uma trilha totalmente personalizada dedicada ao seu problema!",
  "(Este processo leva menos de 10 minutos.)",
  "Antes de começarmos confirme o seu CNPJ. (Exemplo: 01.234.567/0001-89)."
];

const perguntas = [
  "Quais resultados de negócio vocês esperam alcançar ao contratar esse serviço?",
  "O que você acredita que funciona bem atualmente na empresa?",
  "Quais são as maiores urgências percebidas pela liderança?",
  "Pode compartilhar uma fala ou situação que represente como a empresa se vê hoje?",
  "Há alguma área ou aspecto que vocês não consideravam prioritário, mas que tem sido afetado por outras questões na empresa?",
  "Em uma escala de 1 a 10, qual o impacto desse problema?",
  "Pode dar um exemplo prático que mostre esse problema acontecendo?",
  "Como esse problema aparece no dia a dia?",
  "Quais comportamentos recorrentes ou estruturas estão faltando?",
  "Qual é o maior prejuízo que esses comportamentos geram?",
  "Que habilidade ou competência humana você acha que está em falta?",
  "Por fim, ao gerar as trilhas, qual tipo de conteúdo você prefere ver na maioria delas? Digite o número correspondente: 1 - Vídeos; 2 - Podcasts; 3 - Cursos Curtos; 4 - Artigos;"
];

const mensagemFinal = (nome: string) =>
  `Obrigado por compartilhar suas respostas, ${nome}! 😊

Se tiver qualquer dúvida ou precisar de mais informações, você pode entrar em contato conosco pelo e-mail: entrenovaflix@gmail.com.

(Seus dados estão seguros e usados apenas para essa análise)`;

let iniciaisJaEnviadas = false;

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [inputDisabled, setInputDisabled] = useState(false);
  const [etapa, setEtapa] = useState<
  "iniciais" | "nome" | "cnpj" | "confirmar" | "perguntas" | "confirmarResposta" | "plano" | "fim"
>("iniciais");
  const [perguntaIndex, setPerguntaIndex] = useState(0);
  const [respostaTemp, setRespostaTemp] = useState("");
  const [respostaCNPJ, setRespostaCNPJ] = useState("");
  const [cnpjConfirmado, setCnpjConfirmado] = useState("");
  const [nome, setNome] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [inputBloqueado, setInputBloqueado] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, botTyping]);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const irParaResultado = async () => {
  try {
    // Chama o endpoint do backend para gerar relatorio2, resumo2 e trilha
    const response = await gerarRelatorioTotal(cnpjConfirmado);
    const { relatorio2, resumo2, trilha } = response.data;

    // Salva localmente para a Resultadopage2
    localStorage.setItem("resultadoFinal", JSON.stringify({ relatorio2, resumo2, trilha }));

    // Navega para a página de resultado
    navigate("/resultadopage2"); // substitua pela rota correta
  } catch (error) {
    console.error("Erro ao gerar relatório final:", error);
    alert("Ocorreu um erro ao gerar o relatório. Tente novamente.");
  }
};

  const addBotMessage = async (text: string, ms = 1000, opcoes?: string[]) => {
    setBotTyping(true);
    await delay(ms);
    setBotTyping(false);
    setMessages(prev => [...prev, { text, sender: "bot", opcoes }]);
  };

  const clearLastMessageOptions = () => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last.sender === "bot" && last.opcoes) {
        return [...prev.slice(0, -1), { ...last, opcoes: undefined }];
      }
      return prev;
    });
  };

  useEffect(() => {
    const enviarMensagensIniciais = async () => {
      if (etapa === "iniciais" && !iniciaisJaEnviadas) {
        iniciaisJaEnviadas = true;

        await addBotMessage(
          "Oi! Sou a Íris, a assistente virtual da Entrenova-Flix! Estarei com você durante esta conversa."
        );
        await addBotMessage("Qual o seu nome?");
        setEtapa("nome");
      }
    };
    enviarMensagensIniciais();
  }, [etapa]);

  const handleOpcao = async (opcao: string) => {
    clearLastMessageOptions();
    setMessages(prev => [...prev, { text: opcao, sender: "user" }]);

  if (etapa === "confirmar") {
  if (opcao === "Sim") {
    try {
      const { data } = await validarCNPJ(respostaCNPJ);
      if (data.valido) {
        setCnpjConfirmado(respostaCNPJ); // ✅ aqui salvamos o CNPJ que o usuário confirmou
        await addBotMessage("CNPJ válido! Vamos começar o questionário.");
        await addBotMessage(perguntas[0]);
        setEtapa("perguntas");
      } else {
        await addBotMessage("CNPJ não cadastrado. Procure o suporte.");
        setInputBloqueado(true);
      }
    } catch {
      await addBotMessage("Erro ao validar CNPJ. Tente novamente.");
    }
  } else {
    await addBotMessage("Digite o CNPJ novamente.");
    setEtapa("cnpj");
  }
} else if (etapa === "confirmarResposta") {
      if (opcao === "Correto") {
  try {
    // ✅ Usa o CNPJ confirmado, não o digitado
    await salvarResposta(cnpjConfirmado, perguntas[perguntaIndex], respostaTemp);

    if (perguntaIndex + 1 < perguntas.length) {
      const proximoIndex = perguntaIndex + 1;
      setPerguntaIndex(proximoIndex);
      await addBotMessage(perguntas[proximoIndex]);
      setEtapa("perguntas");
    } else {
      await addBotMessage(
        "Para finalizarmos, qual plano você prefere contratar?",
        500,
        ["Básico", "Premium"]
      );
      setEtapa("plano");
    }
  } catch {
    await addBotMessage("Erro ao salvar resposta. Tente novamente.");
  }
} else {
  await addBotMessage(perguntas[perguntaIndex]);
  setEtapa("perguntas");
} 
}
 else if (etapa === "plano") {
  try {
    console.log("vai enviar plano:", opcao, "para o CNPJ:", cnpjConfirmado);
    await salvarPlano(cnpjConfirmado, opcao); // ✅ Aqui também
    console.log("plano enviado para o backend");
    await addBotMessage(mensagemFinal(nome));

    setEtapa("fim");
  } catch (error) {
    console.error("erro ao salvar plano:", error);
    await addBotMessage("Erro ao salvar plano. Tente novamente.");
  }
}
  };

  const sendMessage = async () => {
    if (!input.trim() || inputDisabled) return;

    const msg = input.trim();
    setMessages(prev => [...prev, { text: msg, sender: "user" }]);
    setInput("");
    setInputDisabled(true);

    if (etapa === "nome") {
      setNome(msg);
      await addBotMessage(`Olá, ${msg}! Prazer em te conhecer. 😊`);
      for (const texto of mensagensIniciais) {
        await addBotMessage(texto);
      }
      setEtapa("cnpj");
    } else if (etapa === "cnpj") {
      setRespostaCNPJ(msg);
      await addBotMessage(`Você digitou o CNPJ: ${msg}. Está correto?`, 500, ["Sim", "Não"]);
      setEtapa("confirmar");
    } else if (etapa === "perguntas") {
      setRespostaTemp(msg);
      await addBotMessage(
        `Sua resposta foi: "${msg}". Está correto ou deseja editar?`,
        500,
        ["Correto", "Editar"]
      );
      setEtapa("confirmarResposta");
    }

    setInputDisabled(false);
  };

  return (
    <div className="chat-container">
      {/* HEADER */}
      <div className="chat-header">
        <div className="chat-title-container">
          <img src={IrisAvatar} alt="Iris Avatar" className="chat-title-avatar" />
          <span className="chat-title">Íris - Assistente Virtual</span>
        </div>
        <div className="chat-status">Online</div>
      </div>

      {/* MENSAGENS */}
      <div className="chat-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message-row ${msg.sender}`}>
            {msg.sender === "bot" && (
              <img src={IrisAvatar} alt="Iris Avatar" className="chatbot-avatar" />
            )}
            <div className={`chat-message ${msg.sender}`}>
              {msg.text}
              {msg.opcoes && (
                <div className="quick-replies">
                  {msg.opcoes.map((op, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOpcao(op)}
                      className="quick-reply-btn"
                    >
                      {op}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* TYPING INDICATOR */}
        {botTyping && (
          <div className="chat-message-row bot">
            <img src={IrisAvatar} alt="Iris Avatar" className="chatbot-avatar" />
            <div className="chat-message bot typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

            {/* INPUT */}
      {!inputBloqueado && etapa !== "fim" && (
        <div className="chat-footer">
          <div className="chat-input-container">
            <input
              placeholder="Digite sua mensagem."
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              disabled={inputDisabled}
            />
            <button
              className="chat-button"
              onClick={sendMessage}
              disabled={inputDisabled}
            >
              Enviar
            </button>
          </div>
        </div>
      )}

      {/* BOTÃO DE RESULTADO */}
{etapa === "fim" && (
  <div className="chat-footer">
    <button
      className="chat-button"
      onClick={irParaResultado} // 👈 nova rota
    >
      Ver Resultado
    </button>
  </div>
)}

    </div>
  );
}

