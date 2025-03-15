const { 
    CHAT_CONFIG, 
    UI_ELEMENTS, 
    MESSAGES, 
    URLS,
    calculateIconRotation, 
    getPageContext, 
    createResizeHandles, 
    handleResize, 
    updateChatPosition,
    getApiKey,
    setApiKey,
    generateResponse
} = window;

let apiKey = null;
let isDragging = false;
let isResizing = false;
let dragOffsetX, dragOffsetY;
let startPosX, startPosY;
let hasMoved = false;
let resizeSide;
let startDimensions = {};

// Add state change logging
function logStateChange(action, data) {
    console.log(`[Chat State] ${action}:`, data);
}

function createChatBox() {
    console.log('[Chat UI] Creating chat box');
    const chatBox = document.createElement('div');
    chatBox.id = UI_ELEMENTS.CHAT_BOX_ID;
    chatBox.className = 'chat-box';
    chatBox.title = 'Open Chat';

    const chatIcon = document.createElement('img');
    chatIcon.src = chrome.runtime.getURL(URLS.CHAT_ICON);
    chatIcon.className = 'chat-icon';
    chatIcon.draggable = false;

    chatBox.appendChild(chatIcon);
    document.body.appendChild(chatBox);

    // Add event listeners for drag and click functionality
    console.log('[Chat UI] Setting up chat box event listeners');
    chatBox.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    return chatBox;
}

function createChatUI() {
    console.log('[Chat UI] Creating chat interface');
    const chatUI = document.createElement('div');
    chatUI.id = UI_ELEMENTS.CHAT_UI_ID;
    chatUI.className = 'chat-ui';

    const header = createHeader();
    chatUI.appendChild(header);

    document.body.appendChild(chatUI);
    return chatUI;
}

function createHeader() {
    const header = document.createElement('div');
    header.className = 'chat-header';

    const leftSection = document.createElement('div');
    leftSection.style.display = 'flex';
    leftSection.style.alignItems = 'center';
    leftSection.style.flex = '1';

    const linkIcon = document.createElement('a');
    linkIcon.href = URLS.API_KEY_PAGE;

    const icon = document.createElement('img');
    icon.src = chrome.runtime.getURL(URLS.CHAT_ICON);
    icon.className = 'chat-header-icon';

    const text = document.createElement('span');
    text.textContent = 'Chat';

    linkIcon.appendChild(icon);
    leftSection.appendChild(linkIcon);
    leftSection.appendChild(text);

    const goBackButton = document.createElement('button');
    goBackButton.className = 'go-back-button';
    goBackButton.title = 'Go back to API key setup';
    goBackButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
    `;
    goBackButton.onclick = async () => {
        console.log('[Chat UI] Going back to API key setup');
        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        // Clear existing content
        while (chatUI.firstChild) {
            chatUI.removeChild(chatUI.firstChild);
        }
        // Clear API key
        await setApiKey('');
        apiKey = null;
        // Add header back
        chatUI.appendChild(createHeader());
        // Show API key form
        const apiKeyForm = createApiKeyForm();
        chatUI.appendChild(apiKeyForm);
    };

    header.appendChild(leftSection);
    header.appendChild(goBackButton);

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
    }
}

async function handleInputKeyPress(e) {
    if (e.key === 'Enter' && e.target.value.trim() !== '') {
        const message = e.target.value;
        console.log('[Chat] User sent message:', message);
        e.target.value = '';
        await sendMessage(message);
    }
}

async function sendMessage(message) {
    const chatMessages = document.getElementById(UI_ELEMENTS.CHAT_MESSAGES_ID);
    if (chatMessages) {
        console.log('[Chat] Processing message:', message);
        // Add user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'user-message';
        userMessageDiv.innerHTML = `<p class="message-bubble">${message}</p>`;
        chatMessages.appendChild(userMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Get and add bot response
        console.log('[Chat] Getting page context for response');
        const context = getPageContext();
        console.log('[Chat] Generating response with context:', context);
        const response = await generateResponse(context, message);
        console.log('[Chat] Received response:', response);
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'bot-message';
        botMessageDiv.innerHTML = `<p class="message-bubble">${response}</p>`;
        chatMessages.appendChild(botMessageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

function setupDragAndResize() {
    const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);
    const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);

    chatBox.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    const edges = {
        'n': 'ns-resize',
        'e': 'ew-resize',
        's': 'ns-resize',
        'w': 'ew-resize',
        'ne': 'nesw-resize',
        'nw': 'nwse-resize',
        'se': 'nwse-resize',
        'sw': 'nesw-resize'
    };

    createResizeHandles(chatUI, edges);

    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
            isResizing = true;
            resizeSide = Array.from(e.target.classList)
                .find(cls => cls.startsWith('resize-handle-'))
                ?.replace('resize-handle-', '');
            startDimensions = {
                startX: e.clientX,
                startY: e.clientY,
                startWidth: parseInt(getComputedStyle(chatUI).width),
                startHeight: parseInt(getComputedStyle(chatUI).height)
            };
            e.preventDefault();
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isResizing) {
            handleResize(e, chatUI, startDimensions, resizeSide);
        }
    });

    document.addEventListener('mouseup', () => {
        isResizing = false;
    });
}

function handleDragStart(e) {
    isDragging = true;
    dragOffsetX = e.clientX - e.target.getBoundingClientRect().left;
    dragOffsetY = e.clientY - e.target.getBoundingClientRect().top;
    startPosX = e.clientX;
    startPosY = e.clientY;
    hasMoved = false;
    e.target.style.cursor = 'grabbing';
    logStateChange('Drag started', { x: startPosX, y: startPosY });
}

function handleDragMove(e) {
    if (isDragging) {
        const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);
        const moveX = Math.abs(e.clientX - startPosX);
        const moveY = Math.abs(e.clientY - startPosY);
        
        if (moveX > 1 || moveY > 1) {
            hasMoved = true;
            logStateChange('Dragging', { 
                moveX, 
                moveY, 
                newX: e.clientX - dragOffsetX, 
                newY: e.clientY - dragOffsetY 
            });
        }
        
        chatBox.style.left = (e.clientX - dragOffsetX) + 'px';
        chatBox.style.top = (e.clientY - dragOffsetY) + 'px';
        chatBox.style.right = 'auto';
        chatBox.style.bottom = 'auto';

        const chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
        if (chatUI) {
            updateChatPosition(chatUI, chatBox);
        }
    }
}

function handleDragEnd(e) {
    if (isDragging) {
        isDragging = false;
        e.target.style.cursor = 'pointer';
        logStateChange('Drag ended', { hasMoved });
        if (!hasMoved) {
            console.log('[Chat UI] Click detected (no drag movement)');
            toggleChatUI();
        }
    }
}

async function toggleChatUI() {
    let chatUI = document.getElementById(UI_ELEMENTS.CHAT_UI_ID);
    const chatBox = document.getElementById(UI_ELEMENTS.CHAT_BOX_ID);

    console.log('[Chat UI] Toggling chat interface');
    console.log('[Chat UI] Current chat UI exists:', !!chatUI);
    if (chatUI) {
        console.log('[Chat UI] Current display state:', chatUI.style.display);
    }
    
    apiKey = await getApiKey();
    console.log('[Chat UI] API Key status:', apiKey ? 'Present' : 'Missing');

    if (!chatUI) {
        console.log('[Chat UI] Creating new chat interface');
        chatUI = createChatUI();
        if (!apiKey) {
            console.log('[Chat UI] No API key found, showing API key form');
            const apiKeyForm = createApiKeyForm();
            chatUI.appendChild(apiKeyForm);
        } else {
            console.log('[Chat UI] API key found, initializing chat interface');
            initializeChatUI();
        }
        console.log('[Chat UI] Setting up drag and resize handlers');
        setupDragAndResize();
    } else {
        console.log('[Chat UI] Updating existing chat interface');
        updateChatPosition(chatUI, chatBox);
        const newDisplay = chatUI.style.display === 'none' ? 'flex' : 'none';
        console.log('[Chat UI] Toggling display to:', newDisplay);
        chatUI.style.display = newDisplay;
        if (apiKey) {
            console.log('[Chat UI] Ensuring chat interface is initialized');
            initializeChatUI();
        }
    }
}

// Initialize the chat box
console.log('[Chat UI] Initializing chat box');
const chatBox = createChatBox();
console.log('[Chat UI] Chat box created with ID:', UI_ELEMENTS.CHAT_BOX_ID);

// Add mouse move listener for icon rotation effect
console.log('[Chat UI] Setting up icon rotation listener');
document.addEventListener('mousemove', (e) => {
    const chatIcon = document.querySelector(`#${UI_ELEMENTS.CHAT_BOX_ID} img`);
    if (chatIcon) {
        const { angle, flip } = calculateIconRotation(chatIcon, e.clientX, e.clientY);
        //console.log('[Chat UI] Icon rotation calculated:', { angle, flip });
        // Uncomment the following line to enable icon rotation
        // chatBox.style.transform = `rotate(${angle}deg) ${flip}`;
    }
});
