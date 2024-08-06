# AI Web Chatbot

## Introduction
The AI Web Chatbot is a Chrome extension that allows users to interact with AI directly on any web page. This extension leverages the power of AI Language models to provide real-time assistance and interaction based on the content of the current web page.

## Table of Contents
- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)
- [License](#license)

## Installation
To install the AI Web Chatbot Chrome extension, follow these steps:

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch in the upper right corner.
4. Click on the "Load unpacked" button and select the directory containing the extension files.
5. The AI Web Chatbot extension should now appear in your list of installed extensions.

## Usage
Once the extension is installed and enabled:

1. Navigate to any web page.
2. Click on the AI Chatbot icon that appears in the lower-right corner of the browser.
3. Interact with the chatbot by typing your queries and receiving responses directly related to the content of the current web page.

## Features
- **Real-time interaction:** Chat with the AI about the content on the current web page.
- **Customizable safety settings:** Adjust settings to block or allow different categories of content (e.g., harassment, hate speech, sexually explicit content).
- **Movable and resizable chat window:** Customize the position and size of the chat window for a better user experience.

## Dependencies
The AI Web Chatbot relies on the following dependencies:

- **Google Generative AI:** For generating responses based on user queries and the content of the web page.
- **Chrome APIs:** Including `activeTab`, `scripting`, and `storage` permissions to interact with the current web page and store API keys.

## Configuration
### Setting the API Key
To use the AI Web Chatbot, you need to provide a valid API key for the AI. Follow these steps:

1. Obtain your API key from [Link](https://aistudio.google.com/app/apikey).
2. When you first open the chat window, you will be prompted to enter your API key.
3. The key will be stored locally and used for subsequent interactions with the AI.

## Documentation
The extension consists of the following main files:

- `manifest.json`: Contains the configuration and permissions for the Chrome extension.
- `background.js`: Manages background tasks, including initializing the Google Generative AI and handling messages from the content script.
- `content.js`: Handles the UI and interaction logic for the chat window, including draggable and resizable functionality.

## Examples
### Example Interaction
1. Open any web page.
2. Click the AI Chatbot icon.
3. Enter a query such as "What is this page about?".
4. The chatbot will analyze the content of the page and provide a relevant response.

## Troubleshooting
If you encounter issues with the AI Web Chatbot, try the following steps:

1. Ensure you have entered a valid API key.
2. Check that the extension has the necessary permissions enabled.
3. Reload the extension by going to `chrome://extensions/` and clicking the reload icon next to the AI Web Chatbot.

## Privacy Policy

### No Data Collection
The AI Web Chatbot is designed with user privacy as a top priority. We want to assure our users that:

1. **We Do Not Collect Any Data:** This extension does not collect, store, or transmit any personal information, browsing history, or chat data.

2. **Local Processing:** All interactions with the chatbot occur locally on your device. The extension uses the content of the current web page and your queries to generate responses, but this information is not saved or sent to any external servers (except for the necessary API calls to Google's Generative AI service).

3. **API Key Storage:** Your Google Generative AI API key is stored securely in your browser's local storage. It is used solely for authentication purposes with Google's API and is not accessible to us or any third parties.

### Data Handling
- **Web Page Content:** The extension temporarily accesses the content of the web pages you visit to provide relevant responses. This content is not stored or transmitted beyond the immediate API call to Google's Generative AI service.
- **User Queries:** Your questions and prompts are processed in real-time to generate responses but are not saved after the interaction.

### Security
While we do not collect data, we have implemented the extension with security best practices to ensure that your local information and API key remain protected.

### Third-Party Services

The only external service this extension interacts with is [Google's Generative AI API](https://support.google.com/gemini/answer/13594961?hl=en). Please refer to Google's privacy policy for information on how they handle API requests.

### Your Rights
Since we do not collect any personal data, there is no personal information for us to provide, correct, or delete. Your interactions with the chatbot remain private and under your control.

