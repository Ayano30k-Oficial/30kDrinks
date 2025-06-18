// main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Referências aos elementos HTML ---
    const affiliateNameEl = document.getElementById('affiliateName');
    const availableBalanceEl = document.getElementById('availableBalance');
    const totalSalesEl = document.getElementById('totalSales');
    const currentSeasonSalesEl = document.getElementById('currentSeasonSales');
    const affiliateLevelEl = document.getElementById('affiliateLevel');
    const levelProgressEl = document.getElementById('levelProgress');
    const affiliateRankEl = document.getElementById('affiliateRank');
    const accumulatedCommissionsEl = document.getElementById('accumulatedCommissions');
    const affiliateCodeEl = document.getElementById('affiliateCode');
    const afiliadoLinkEl = document.getElementById('afiliadoLink');
    const copyLinkButton = document.getElementById('copyLinkButton');
    const awardsContainer = document.getElementById('awardsContainer');
    // REMOVIDO: salesChart

    const aiAssistantPopup = document.getElementById('aiAssistantPopup');
    const toggleAiButton = document.getElementById('toggleAiButton');
    const closeAiPopup = document.getElementById('closeAiPopup');
    const aiMessages = document.getElementById('aiMessages');
    const aiInput = document.getElementById('aiInput');
    const aiSendButton = document.getElementById('aiSendButton');

    // --- Histórico da conversa JARVIS (agora gerenciado aqui) ---
    const jarvisConversationHistory = [
        { role: "system", content: "Você é 30k IA, um assistente de IA sofisticado e futurista para afiliados da empresa 30K Drinks. Seu objetivo é ajudar os afiliados a aumentar suas vendas, responder a dúvidas sobre o painel, comissões, produtos, e oferecer dicas de marketing e motivação. Mantenha um tom profissional, futurista e inspirador, como o JARVIS de Tony Stark. Fale em português do Brasil. Evite respostas genéricas e foque no contexto de afiliados e vendas." },
        { role: "assistant", content: "Olá! Sou 30K IA, seu assistente pessoal. Como posso ajudá-lo hoje?" }
    ];

    // --- Carregar dados simulados na página ---
    function loadAffiliateData() {
        if (typeof affiliateData === 'undefined') {
            console.error("Erro: 'affiliateData' não está definido. Verifique se 'affiliateData.js' foi carregado antes de 'main.js'.");
            return;
        }

        affiliateNameEl.textContent = affiliateData.name;
        availableBalanceEl.textContent = `R$ ${affiliateData.availableBalance.toFixed(2).replace('.', ',')}`;
        totalSalesEl.textContent = affiliateData.totalSales.toLocaleString('pt-BR');
        currentSeasonSalesEl.textContent = affiliateData.currentSeasonSales.toLocaleString('pt-BR');
        accumulatedCommissionsEl.textContent = `R$ ${affiliateData.accumulatedCommissions.toFixed(2).replace('.', ',')}`;
        affiliateCodeEl.textContent = affiliateData.affiliateCode;
        afiliadoLinkEl.value = affiliateData.affiliateLink;

        // Nível de Afiliado (barra de progresso)
        const levelPercentage = (affiliateData.affiliateLevel / 10) * 100;
        levelProgressEl.style.width = `${levelPercentage}%`;
        affiliateLevelEl.textContent = `Nível ${affiliateData.affiliateLevel}`;

        // Rank
        affiliateRankEl.textContent = affiliateData.affiliateRank;

        // Prêmios
        awardsContainer.innerHTML = ''; // Limpa antes de adicionar
        affiliateData.awards.forEach(award => {
            const awardCard = document.createElement('div');
            awardCard.classList.add('premio-card');
            awardCard.textContent = award;
            awardsContainer.appendChild(awardCard);
        });

        // REMOVIDO: Gráfico de Vendas e chamada a renderSalesChart
    }

    // REMOVIDO: Função renderSalesChart

    // --- Copiar link de afiliado ---
    copyLinkButton.addEventListener('click', () => {
        afiliadoLinkEl.select();
        afiliadoLinkEl.setSelectionRange(0, 99999);
        document.execCommand("copy");

        copyLinkButton.textContent = "Copiado!";
        setTimeout(() => {
            copyLinkButton.innerHTML = '<i class="fas fa-copy"></i> Copiar Link';
        }, 2000);
    });

    // --- Lógica do Assistente de IA (JARVIS Simulada) ---
    // Renderiza as mensagens iniciais do JARVIS
    function renderInitialJarvisMessages() {
        // Limpa o chat, mas pode ser útil para reabrir o chat e manter o histórico
        aiMessages.innerHTML = '';
        jarvisConversationHistory.forEach(msg => {
            if (msg.role !== 'system') { // Não exibe a mensagem de 'system' no chat
                appendMessage(msg.content, msg.role);
            }
        });
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    toggleAiButton.addEventListener('click', () => {
        aiAssistantPopup.classList.toggle('active');
        if (aiAssistantPopup.classList.contains('active')) {
            renderInitialJarvisMessages(); // Renderiza histórico ao abrir
            aiInput.focus(); // Foca no input
        }
    });

    closeAiPopup.addEventListener('click', () => {
        aiAssistantPopup.classList.remove('active');
    });

    aiSendButton.addEventListener('click', handleSendMessage);
    aiInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    });

    async function handleSendMessage() {
        const userMessage = aiInput.value.trim();
        if (userMessage === '') return;

        // Adiciona mensagem do usuário ao histórico e ao DOM
        jarvisConversationHistory.push({ role: "user", content: userMessage });
        appendMessage(userMessage, 'user');
        aiInput.value = '';

        // Exibe mensagem de digitação
        const typingMessage = appendMessage('30k IA está pensando...', ['ai', 'typing']);
        aiMessages.scrollTop = aiMessages.scrollHeight;

        // Simula um atraso de processamento
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 segundos de "pensamento"

        // Chama a função de simulação do JARVIS de jarvisAI.js
        // Passa o histórico COMPLETO para o JARVIS para que ele possa "simular" o contexto
        if (typeof getSimulatedJarvisResponse === 'undefined') {
            console.error("Erro: 'getSimulatedJarvisResponse' não está definido. Verifique se 'ia30k.js' foi carregado antes de 'main.js'.");
            aiMessages.removeChild(typingMessage);
            // CORREÇÃO AQUI: Passando ['ai', 'error'] como um array
            appendMessage("Erro do sistema: Assistente de IA não carregado corretamente.", ['ai', 'error']);
            return;
        }

        // Obtém a resposta do JARVIS, passando o histórico atual
        const jarvisReply = getSimulatedJarvisResponse(userMessage, jarvisConversationHistory);

        // Remove a mensagem de digitação e adiciona a resposta do JARVIS
        aiMessages.removeChild(typingMessage);
        jarvisConversationHistory.push({ role: "assistant", content: jarvisReply });
        appendMessage(jarvisReply, 'ai');
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }

    // Função auxiliar para adicionar mensagens ao chat
    function appendMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('ai-message'); // Adiciona 'ai-message' primeiro

        // Adiciona as classes do 'sender'
        // CORREÇÃO AQUI: Garante que classes com espaços são tratadas como múltiplos tokens
        if (Array.isArray(sender)) {
            sender.forEach(cls => messageDiv.classList.add(cls));
        } else {
            messageDiv.classList.add(sender);
        }

        messageDiv.textContent = text;
        aiMessages.appendChild(messageDiv);
        return messageDiv;
    }

    // --- Inicialização da Página ---
    loadAffiliateData();
    // A renderização inicial das mensagens do JARVIS será feita quando o popup for aberto pela primeira vez.
    // Se quiser que apareça ao carregar a página: renderInitialJarvisMessages();
});
