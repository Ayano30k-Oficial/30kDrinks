// jarvisAI.js

// A função agora aceita a mensagem do usuário e o histórico completo da conversa
// para que o main.js possa gerenciá-lo.
function getSimulatedJarvisResponse(userMessage, currentConversation) {
    const lowerCaseMessage = userMessage.toLowerCase();
    let reply = "Compreendido. Estou processando sua solicitação. Poderia ser mais específico?";

    // Definições de respostas baseadas em palavras-chave (simulação de IA)
    if (lowerCaseMessage.includes("saldo") || lowerCaseMessage.includes("dinheiro")) {
        reply = "Seu saldo disponível é de 0. Lembre-se que você pode solicitar o saque a qualquer momento pelo seu painel.";
    }
  

    return reply;
}
