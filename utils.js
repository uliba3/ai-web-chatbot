window.getPageContext = function() {
    const text = document.body.innerText;
    const promptText = "Hello! How can we help you today?";
    return text.substring(0, text.indexOf(promptText) + promptText.length);
};

window.updateChatPosition = function(chatUI, chatBox) {
    const chatBoxRect = chatBox.getBoundingClientRect();
    chatUI.style.bottom = `${window.innerHeight - chatBoxRect.top + 10}px`;
    chatUI.style.right = `${window.innerWidth - chatBoxRect.right + 10}px`;
};

window.enableDragAndDrop = function(chatUI) {
    const header = chatUI.querySelector('.chat-header');
    let isDragging = false;
    let dragOffsetX, dragOffsetY;
    let startPosX, startPosY;
    let hasMoved = false;
    
    header.addEventListener('mousedown', (e) => {
        if (e.target.closest('.chat-header')) {
            console.log('Drag started');
            isDragging = true;
            const rect = chatUI.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            startPosX = chatUI.style.left;
            startPosY = chatUI.style.top;
            chatUI.style.cursor = 'grabbing';
            console.log('Initial position:', { dragOffsetX, dragOffsetY, startPosX, startPosY });
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            hasMoved = true;
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            
            // Keep the chat UI within window bounds
            const maxX = window.innerWidth - chatUI.offsetWidth;
            const maxY = window.innerHeight - chatUI.offsetHeight;
            
            // Convert right/bottom to left/top for dragging
            const left = Math.min(Math.max(0, x), maxX);
            const top = Math.min(Math.max(0, y), maxY);
            
            chatUI.style.left = `${left}px`;
            chatUI.style.top = `${top}px`;
            chatUI.style.right = 'auto';
            chatUI.style.bottom = 'auto';
            
            console.log('Dragging to position:', { x, y, left, top });
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            console.log('Drag ended', { hasMoved });
            isDragging = false;
            chatUI.style.cursor = 'grab';
        }
    });
};

window.disableDragAndDrop = function(chatUI) {
    const header = chatUI.querySelector('.chat-header');
    header.removeEventListener('mousedown', null);
    document.removeEventListener('mousemove', null);
    document.removeEventListener('mouseup', null);
};