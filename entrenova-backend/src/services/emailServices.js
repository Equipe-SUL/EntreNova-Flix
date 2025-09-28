import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Gmail
  auth: {
    user: process.env.EMAIL_USER, // equipesulsuporte@gmail.com
    pass: process.env.EMAIL_PASS  // senha ou App Password do Gmail
  }
});

/**
 * Envia email com o diagnóstico completo
 */
export const enviarEmailDiagnostico = async (dadosEmpresa, relatorio) => {
  try {
    const emailBody = `
  <h2>Diagnóstico Empresarial - ${dadosEmpresa.nome}</h2>
  <p><strong>CNPJ:</strong> ${dadosEmpresa.cnpj}</p>
  <p><strong>Email:</strong> ${dadosEmpresa.email}</p>
  <p><strong>Telefone:</strong> ${dadosEmpresa.telefone}</p>
  <p><strong>Setor:</strong> ${dadosEmpresa.setor}</p>

  <hr>

  <h3>Resumo da Análise IA:</h3>
  <p>${relatorio.resumo_ia}</p>

  <hr>

  <h3>Relatório Completo:</h3>
  <p><strong>Principal Desafio:</strong> ${relatorio.maior_problema}</p>
  <p><strong>Tom da Análise:</strong> ${relatorio.tom || 'Não definido'}</p>
  <p><strong>Emoções Identificadas:</strong> ${relatorio.emocoes ? relatorio.emocoes.join(', ') : 'Não definido'}</p>

  <h4>Sugestões Práticas:</h4>
  <ul>
    ${relatorio.sugestoes.map((s) => `<li>${s}</li>`).join('')}
  </ul>

  <hr>

  <h3>Classificação Lead:</h3>
  <p><strong>${relatorio.lead || 'Não definida'}</strong></p>
`;
    await transporter.sendMail({
      from: `"Equipe Sul Suporte" <${process.env.EMAIL_USER}>`,
      to: 'entrenovaflix@gmail.com', // destinatário fixo
      subject: `Relatório de Diagnóstico - ${dadosEmpresa.nome}`,
      html: emailBody
    });

    console.log('Email enviado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw new Error('Falha ao enviar email do diagnóstico.');
  }
};

export const enviarEmailRelatorio2 = async (dadosEmpresa, relatorio2, resumo2, conversaIris, trilhaFormada) => {
  try {
    const emailBody = `
      <h2>Relatório 2</h2>
      <p><strong>CNPJ:</strong> ${dadosEmpresa.cnpj}</p>

      <hr>

      <h3>Resumo 2:</h3>
      <p>${resumo2}</p>

      <h3>Relatório 2 Completo:</h3>
      <p>${relatorio2}</p>

      <hr>

      <h3>Conversa com a Iris:</h3>
      ${conversaIris
        .map((msg, i) => `<p><strong>${i % 2 === 0 ? 'Pergunta' : 'Resposta'}:</strong> ${msg.mensagem}</p>`)
        .join('')}

      <hr>

      <h3>Trilha Formada:</h3>
      <ul>
        ${trilhaFormada.map(t => `<li>${t.titulo}</li>`).join('')}
      </ul>
    `;

    await transporter.sendMail({
      from: `"Equipe Sul Suporte" <${process.env.EMAIL_USER}>`,
      to: 'entrenovaflix@gmail.com',
      subject: `Relatório 2 - ${dadosEmpresa.cnpj}`,
      html: emailBody
    });

    console.log('Email Relatório 2 enviado com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar email Relatório 2:', error);
    throw new Error('Falha ao enviar email do Relatório 2.');
  }
};
