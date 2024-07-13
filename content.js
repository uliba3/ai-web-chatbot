// Create a box element
const chatBox = document.createElement('div');
chatBox.id = 'gemini-chat-box';
chatBox.style.position = 'fixed';
chatBox.style.bottom = '50px';
chatBox.style.right = '50px';
chatBox.style.width = '50px'; // Reverted size
chatBox.style.height = '50px'; // Reverted size
chatBox.style.backgroundColor = 'transparent';
chatBox.style.borderRadius = '50%';
chatBox.style.display = 'flex';
chatBox.style.justifyContent = 'center';
chatBox.style.alignItems = 'center';
chatBox.style.color = '#ffffff';
chatBox.style.fontSize = '30px';
chatBox.style.cursor = 'pointer';
chatBox.title = 'Open Chat';
chatBox.style.zIndex = '10000'; // Ensure chat icon is always over everything else
const chatIcon = document.createElement('img');
chatIcon.src = chrome.runtime.getURL('google-gemini-icon.png');
chatIcon.style.width = '48px';
chatIcon.style.height = '48px';
chatIcon.draggable = false;
chatBox.appendChild(chatIcon);
document.body.appendChild(chatBox);

let apiKey = null;
requestApiKey()
// Make the chat icon movable
let isDragging = false;
let dragOffsetX, dragOffsetY;
let startPosX, startPosY; // To track the start position
let hasMoved = false; // Flag to check if the mouse has moved

chatBox.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragOffsetX = e.clientX - chatBox.getBoundingClientRect().left;
    dragOffsetY = e.clientY - chatBox.getBoundingClientRect().top;
    startPosX = e.clientX; // Set start X position
    startPosY = e.clientY; // Set start Y position
    hasMoved = false; // Reset the hasMoved flag
    chatBox.style.cursor = 'grabbing';
});

// even lister for moving the chat icon
document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const moveX = Math.abs(e.clientX - startPosX);
        const moveY = Math.abs(e.clientY - startPosY);
        if (moveX > 5 || moveY > 5) { // Threshold for considering it a drag
            hasMoved = true;
        }
        chatBox.style.left = e.clientX - dragOffsetX + 'px';
        chatBox.style.top = e.clientY - dragOffsetY + 'px';
        chatBox.style.right = 'auto';
        chatBox.style.bottom = 'auto';
        // Update chat window position along with chat icon
        let chatUI = document.getElementById('gemini-chat-ui');
        if (chatUI) {
            const chatBoxRect = chatBox.getBoundingClientRect();
            chatUI.style.bottom = (window.innerHeight - chatBoxRect.top + 10) + 'px';
            chatUI.style.right = (window.innerWidth - chatBoxRect.right + 10) + 'px';
        }
    }
});

// even lister for moving the chat icon
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        chatBox.style.cursor = 'pointer';
        if (!hasMoved) {
            // It was a click, not a drag
            toggleChatUI(); // Call the function to toggle the chat UI
        }
    }
});

// Function to initialize the chat UI
function initializeChatUI() {
    let chatUI = document.getElementById('gemini-chat-ui');
    if (!chatUI.querySelector('#gemini-chat-messages')) {
        chatUI.innerHTML += `
            <div id="gemini-chat-messages" style="flex: 1; padding: 10px; overflow-y: auto; color: #111827;">
                <p>Hello! How can we help you today?</p> <!-- Sample interaction added -->
            </div>
            <input type="text" id="gemini-chat-input" style="padding: 10px; border: none; border-top: 1px solid #E5E7EB; background-color: #F9FAFB; color: #111827;" placeholder="Type a message...">
        `;

        // Dynamically attach the event listener for sending messages
        const chatInput = document.getElementById('gemini-chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && chatInput.value.trim() !== '') {
                    sendMessage(chatInput.value); // Call sendMessage with the input value
                    chatInput.value = ''; // Clear input after sending
                }
            });
        }
    }
}

// Function to toggle the chat UI
function toggleChatUI() {
    let chatUI = document.getElementById('gemini-chat-ui');
    requestApiKey();
    if (!chatUI) {
        chatUI = document.createElement('div');
        chatUI.id = 'gemini-chat-ui';
        chatUI.style.position = 'fixed';
        // Adjust position based on chatBox's current position
        const chatBoxRect = chatBox.getBoundingClientRect();
        chatUI.style.bottom = (window.innerHeight - chatBoxRect.top + 10) + 'px'; // Position chat window next to the chat icon
        chatUI.style.right = (window.innerWidth - chatBoxRect.right + 10) + 'px';
        chatUI.style.width = '300px';
        chatUI.style.height = '400px';
        chatUI.style.backgroundColor = '#F9FAFB'; // Adjusted for visibility in dark mode
        chatUI.style.color = '#111827'; // Adjusted for visibility in dark mode
        chatUI.style.border = '1px solid #E5E7EB';
        chatUI.style.borderRadius = '10px';
        chatUI.style.display = 'flex';
        chatUI.style.flexDirection = 'column';
        chatUI.style.justifyContent = 'space-between';
        chatUI.style.zIndex = '10000'; // Ensure chat window is always over everything else

        document.body.appendChild(chatUI);

        // Create the header container
        const header = document.createElement('div');
        header.style.display = 'flex';
        header.style.alignItems = 'center';
        header.style.justifyContent = 'start';
        header.style.padding = '10px';
        header.style.fontSize = '20px';
        header.style.textAlign = 'center';
        header.style.borderBottom = '1px solid #E5E7EB';
        header.style.color = '#111827';

        const linkIcon = document.createElement('a');
        linkIcon.href = 'https://google.com';

        const icon = document.createElement('img'); // Assuming you're using an image as an icon
        icon.id = 'gemini-chat-icon';
        icon.src = chrome.runtime.getURL('icon.png'); // Set the path to your icon image
        icon.style.width = '24px'; // Adjust size as needed
        icon.style.height = '24px'; // Adjust size as needed
        icon.style.marginRight = '10px'; // Space between icon and text
        // Create the text element
        const text = document.createElement('span');
        text.textContent = 'Chat';

        // Append icon and text to the header
        linkIcon.appendChild(icon);
        header.appendChild(linkIcon);
        header.appendChild(text);

        // Append the header to the chatUI
        chatUI.appendChild(header);

        // Add resize handle
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
        
        Object.keys(edges).forEach(edge => {
            const resizeHandle = document.createElement('div');
            resizeHandle.id = 'gemini-resize-' + edge;
            resizeHandle.style.position = 'absolute';
            // Set position based on edge
            if (edge.includes('n')) resizeHandle.style.top = '0';
            if (edge.includes('s')) resizeHandle.style.bottom = '0';
            if (edge.includes('e')) resizeHandle.style.right = '0';
            if (edge.includes('w')) resizeHandle.style.left = '0';
            // Set size based on edge
            if (edge === 'n' || edge === 's') {
                resizeHandle.style.width = '100%';
                resizeHandle.style.height = '10px';
            } else if (edge === 'e' || edge === 'w') {
                resizeHandle.style.width = '10px';
                resizeHandle.style.height = '100%';
            } else {
                // Corners
                resizeHandle.style.width = '10px';
                resizeHandle.style.height = '10px';
            }
            resizeHandle.style.cursor = edges[edge];
            resizeHandle.style.zIndex = '10001';
            chatUI.appendChild(resizeHandle);
        });

        let isResizing = false;
        let startWidth, startHeight, startX, startY, resizeSide;

        document.addEventListener('mousedown', (e) => {
            if (e.target.id.startsWith('gemini-resize-')) {
                isResizing = true;
                resizeSide = e.target.id.replace('gemini-resize-', ''); // Extract the side (n, e, s, w, ne, nw, se, sw)
                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(document.defaultView.getComputedStyle(chatUI).width, 10);
                startHeight = parseInt(document.defaultView.getComputedStyle(chatUI).height, 10);
                const chatUIRect = chatUI.getBoundingClientRect();
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                let newWidth = startWidth;
                let newHeight = startHeight;
        
                if (resizeSide.includes('e')) {
                    newWidth = Math.max(startWidth + dx, 100);
                    chatUI.style.width = `${newWidth}px`;
                }
                if (resizeSide.includes('s')) {
                    newHeight = Math.max(startHeight + dy, 100);
                    chatUI.style.height = `${newHeight}px`;
                }
                if (resizeSide.includes('w')) {
                    newWidth = Math.max(startWidth - dx, 100);
                    chatUI.style.width = `${newWidth}px`;
                }
                if (resizeSide.includes('n')) {
                    newHeight = Math.max(startHeight - dy, 100);
                    chatUI.style.height = `${newHeight}px`;
                }
        
                // Adjust the position of the chat icon if resizing from the right or bottom
                if (resizeSide.includes('e') || resizeSide.includes('s')) {
                    const chatBoxRect = chatBox.getBoundingClientRect();
                    const chatUIRect = chatUI.getBoundingClientRect();
        
                    if (resizeSide.includes('e')) {
                        // Move chat icon to maintain its relative position to the right edge of the chat window
                        chatBox.style.right = `${window.innerWidth - chatUIRect.right + 10}px`;
                    }
                    if (resizeSide.includes('s')) {
                        // Move chat icon to maintain its relative position to the bottom edge of the chat window
                        chatBox.style.bottom = `${window.innerHeight - chatUIRect.bottom + 10}px`;
                    }
                }
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
            }
        });

    } else {
        // Recalculate position every time it's toggled to ensure it opens next to the chat icon
        const chatBoxRect = chatBox.getBoundingClientRect();
        chatUI.style.bottom = (window.innerHeight - chatBoxRect.top + 10) + 'px';
        chatUI.style.right = (window.innerWidth - chatBoxRect.right + 10) + 'px';
        chatUI.style.display = chatUI.style.display === 'none' ? 'flex' : 'none';
    }
    requestApiKey();
    if(!apiKey) {
        if (!chatUI.querySelector('#api-key-form')) {
            const apiKeyForm = document.createElement('div');
            apiKeyForm.id = 'api-key-form';
            apiKeyForm.style.padding = '10px';
            apiKeyForm.style.margin = '10px';
            apiKeyForm.style.backgroundColor = '#F9FAFB';
            apiKeyForm.style.border = '1px solid #E5E7EB';
            apiKeyForm.style.borderRadius = '8px';
            apiKeyForm.style.display = 'flex';
            apiKeyForm.style.flexDirection = 'column';
            apiKeyForm.style.alignItems = 'center';

            const apiKeyInput = document.createElement('input');
            apiKeyInput.type = 'text';
            apiKeyInput.id = 'api-key';
            apiKeyInput.placeholder = 'Gemini API Key';
            apiKeyInput.style.padding = '10px';
            apiKeyInput.style.marginBottom = '10px';
            apiKeyInput.style.border = '1px solid #E5E7EB';
            apiKeyInput.style.borderRadius = '4px';
            apiKeyInput.style.width = '90%';

            const formBtn = document.createElement('button');
            formBtn.id = 'form-button';
            formBtn.innerText = 'Set Key';
            formBtn.style.padding = '10px';
            formBtn.style.backgroundColor = '#4F46E5';
            formBtn.style.color = '#FFFFFF';
            formBtn.style.border = 'none';
            formBtn.style.borderRadius = '8px';
            formBtn.style.cursor = 'pointer';
            formBtn.style.width = '100%';
            formBtn.onmouseover = function() {
                this.style.backgroundColor = '#4338CA';
            };
            formBtn.onmouseleave = function() {
                this.style.backgroundColor = '#4F46E5';
            };
            formBtn.onclick = function() {
                apiKey = document.getElementById('api-key').value;
                chrome.runtime.sendMessage({action: "setApiKey", apiKey: apiKey}, function(response) {
                    if (response.success) {
                        // Hide login form and show chat messages or other UI elements
                        apiKeyForm.style.display = 'none';
                        initializeChatUI()
                    }
                });
            };
            const apiKeyLink = document.createElement('a');
            apiKeyLink.href = 'https://aistudio.google.com/app/apikey';
            apiKeyLink.innerText = 'Get API Key';
            apiKeyLink.target = '_blank';
            apiKeyForm.appendChild(apiKeyLink);
            apiKeyForm.appendChild(apiKeyInput);
            apiKeyForm.appendChild(formBtn);
            chatUI.appendChild(apiKeyForm);
        }
    } else {
        initializeChatUI();
    }
}

function requestApiKey() {
    chrome.runtime.sendMessage({action: "getApiKey"}, function(response) {
        // You can now use the token as needed here
        apiKey = response;
    });
}


// Implementing message sending and showing response
// Ensure Firebase is initialized in your extension
// Assume firebase has been initialized elsewhere in your extension

function sendMessage(message) {
    // first, show the message sent by the user
    const chatMessages = document.getElementById('gemini-chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML += `<div style="float: right; padding-left: 50pt;"><p style="background-color: #F3F4F6; border-radius: 5px; display: inline-block; padding: 5px;">${message}</p></div>`;
        chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
    }

    let text = document.body.innerText;
    const promptText = "Hello! How can we help you today?";
    text = text.substring(0, text.indexOf(promptText) + promptText.length);

    chrome.runtime.sendMessage({action: "generate", model: "flash", prompt: text+"\nYou are given an innter text of current web page, answer the question below.\n"+message }, function(response) {
        const chatMessages = document.getElementById('gemini-chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML += `<div style="float: left; padding-right: 50pt;"><p style="background-color: #F3F4F6; border-radius: 5px; display: inline-block; padding: 5px;">${response}</p></div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to the bottom
        }
    });
}

document.addEventListener('mousemove', function(e) {
    const iconRect = chatBox.getBoundingClientRect(); // Get the bounding rectangle of the icon
    const iconCenterX = iconRect.left + iconRect.width / 2;
    const iconCenterY = iconRect.top + iconRect.height / 2;
    const angleRadians = Math.atan2(e.clientY - iconCenterY, e.clientX - iconCenterX);
    let angleDeg = angleRadians * (180 / Math.PI);
    
    const cursorOnTheLeft = e.clientX < iconCenterX;
    // Determine if the cursor is on the left side of the icon
    if (cursorOnTheLeft) {
        angleDeg += 180;
    }
    const flip = cursorOnTheLeft ? 'scaleX(-1)' : '';
    // chatBox.style.transform = `rotate(${angleDeg}deg) ${flip}`;
});
