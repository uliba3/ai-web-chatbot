const { 
    CHAT_CONFIG, 
    UI_ELEMENTS, 
    MESSAGES, 
    URLS,
    getPageContext, 
    updateChatPosition,
    getApiKey,
    setApiKey,
    generateResponse
} = window;

let apiKey = null;

function createChatUI() {
    const chatUI = document.createElement('div');
    chatUI.id = UI_ELEMENTS.CHAT_UI_ID;
    chatUI.className = 'chat-ui';
    // Set initial position
    chatUI.style.right = CHAT_CONFIG.INITIAL_POSITION.right;
    chatUI.style.bottom = CHAT_CONFIG.INITIAL_POSITION.bottom;
    chatUI.style.width = CHAT_CONFIG.INITIAL_WIDTH + 'px';
    chatUI.style.height = CHAT_CONFIG.INITIAL_HEIGHT + 'px';
    chatUI.style.cursor = 'grab';

    const header = createHeader();
    chatUI.appendChild(header);

    document.body.appendChild(chatUI);
    
    // Enable drag and drop functionality
    window.enableDragAndDrop(chatUI);
    
    return chatUI;
}

function createHeader() {
    const header = document.createElement('div');
    header.className = 'chat-header';
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const goBackButton = document.createElement('button');
    goBackButton.className = 'go-back-button';
    goBackButton.title = 'Go back to API key setup';
    goBackButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    `;
    goBackButton.onclick = async () => {
        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        // Clear existing content
        while (chatUI.firstChild) {
            chatUI.removeChild(chatUI.firstChild);
        }
        // Store current API key before clearing
        const currentApiKey = apiKey;
        // Clear API key from storage
        await setApiKey('');
        apiKey = null;
        // Add header back
        chatUI.appendChild(createHeader());
        // Show API key form with previous key
        const apiKeyForm = createApiKeyForm();
        const apiKeyInput = apiKeyForm.querySelector(`#${UI_ELEMENTS.API_KEY_INPUT_ID}`);
        if (apiKeyInput && currentApiKey) {
            apiKeyInput.value = currentApiKey;
        }
        chatUI.appendChild(apiKeyForm);
        // Re-enable drag and drop functionality
        window.enableDragAndDrop(chatUI);
    };

    const title = document.createElement('span');
    title.textContent = 'Chat';
    title.style.flex = '1';
    title.style.textAlign = 'center';

    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.title = 'Close chat';
    closeButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
    `;
    closeButton.onclick = () => {
        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        if (chatUI) {
            chatUI.style.display = 'none';
        }
    };

    header.appendChild(goBackButton);
    header.appendChild(title);
    header.appendChild(closeButton);

    return header;
}

function createApiKeyForm() {
    const form = document.createElement('div');
    form.id = UI_ELEMENTS.API_KEY_FORM_ID;
    form.className = 'api-key-form';

    const apiKeyLink = document.createElement('a');
    apiKeyLink.href = URLS.API_KEY_PAGE;
    apiKeyLink.innerText = MESSAGES.GET_API_KEY_LINK_TEXT;
    apiKeyLink.target = '_blank';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = UI_ELEMENTS.API_KEY_INPUT_ID;
    input.className = 'api-key-input';
    input.placeholder = MESSAGES.API_KEY_PLACEHOLDER;

    const button = document.createElement('button');
    button.id = UI_ELEMENTS.FORM_BUTTON_ID;
    button.className = 'api-key-button';
    button.innerText = MESSAGES.SET_API_KEY_BUTTON;
    button.onclick = async () => {
        const newApiKey = document.getElementById(UI_ELEMENTS.API_KEY_INPUT_ID).value;
        const success = await setApiKey(newApiKey);
        if (success) {
            apiKey = newApiKey;
            form.style.display = 'none';
            initializeChatUI();
        }
    };

    form.appendChild(apiKeyLink);
    form.appendChild(input);
    form.appendChild(button);

    return form;
}

function initializeChatUI() {
    const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
    if (!chatUI.querySelector(`#${UI_ELEMENTS.CHAT_MESSAGES_ID}`)) {
        const messagesDiv = document.createElement('div');
        messagesDiv.id = UI_ELEMENTS.CHAT_MESSAGES_ID;
        messagesDiv.className = 'chat-messages';
        messagesDiv.innerHTML = `<p>${MESSAGES.WELCOME}</p>`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = UI_ELEMENTS.CHAT_INPUT_ID;
        input.className = 'chat-input';
        input.placeholder = 'Type a message...';
        input.addEventListener('keypress', handleInputKeyPress);

        chatUI.appendChild(messagesDiv);
        chatUI.appendChild(input);
        
        // Re-enable drag and drop functionality
        window.enableDragAndDrop(chatUI);
    }
}

async function handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        const message = e.target.value;
        e.target.value = '';
        await sendMessage(message);
    }
}

async function sendMessage(message) {
    const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES_ID);
    if (chatMessages) {
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `<p class="message-bubble">${message}</p>`;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get and add bot response
        const context = getPageContext();
        const response = await generateResponse(context, message);
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message';
        botMessageDiv.innerHTML = `<p class="message-bubble">${response}</p>`;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function createFloatingChatIcon() {
    const icon = document.createElement('div');
    icon.className = 'floating-chat-icon';
    
    const iconImg = document.createElement('img');
    iconImg.src = chrome.runtime.getURL(URLS.CHAT_ICON);
    icon.appendChild(iconImg);
    
    icon.onclick = () => {
        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        if (chatUI) {
            chatUI.style.display = chatUI.style.display === 'none' ? 'flex' : 'none';
        } else {
            initializeChat();
        }
    };
    
    document.body.appendChild(icon);
    return icon;
}

async function initializeChat() {
    let chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
    apiKey = await getApiKey();

    if (!chatUI) {
        chatUI = createChatUI();
        chatUI.style.display = 'none'; // Initially hidden
        if (!apiKey) {
            const apiKeyForm = createApiKeyForm();
            chatUI.appendChild(apiKeyForm);
        } else {
            initializeChatUI();
        }
    }
    
    // Create floating chat icon if it doesn't exist
    if (!document.querySelector('.floating-chat-icon')) {
        createFloatingChatIcon();
    }
}

// Initialize the chat UI directly
initializeChat();