const { API_ENDPOINTS } = window;

window.getApiKey = async function() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: API_ENDPOINTS.GET_API_KEY }, (response) => {
            resolve(response);
        });
    });
};

window.setApiKey = async function(apiKey) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: API_ENDPOINTS.SET_API_KEY, apiKey },
            (response) => {
                resolve(response.success);
            }
        );
    });
};

window.generateResponse = async function(context, message) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            {
                action: API_ENDPOINTS.GENERATE,
                model: "flash",
                prompt: `${context}\nBased on the inner text of current web page above, answer the question below concisely.\nQuestion: ${message}`
            },
            (response) => {
                resolve(response);
            }
        );
    });
};