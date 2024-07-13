# Gemini Web Chatbot

## Introduction
The Gemini Web Chatbot is a Chrome extension that allows users to interact with the Gemini AI directly on any web page. This extension leverages the power of Google Generative AI models to provide real-time assistance and interaction based on the content of the current web page.

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
To install the Gemini Web Chatbot Chrome extension, follow these steps:

1. Clone or download this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" using the toggle switch in the upper right corner.
4. Click on the "Load unpacked" button and select the directory containing the extension files.
5. The Gemini Web Chatbot extension should now appear in your list of installed extensions.

## Usage
Once the extension is installed and enabled:

1. Navigate to any web page.
2. Click on the Gemini Chatbot icon that appears in the lower-right corner of the browser.
3. Interact with the chatbot by typing your queries and receiving responses directly related to the content of the current web page.

## Features
- **Real-time interaction:** Chat with the Gemini AI about the content on the current web page.
- **Customizable safety settings:** Adjust settings to block or allow different categories of content (e.g., harassment, hate speech, sexually explicit content).
- **Movable and resizable chat window:** Customize the position and size of the chat window for a better user experience.

## Dependencies
The Gemini Web Chatbot relies on the following dependencies:

- **Google Generative AI:** For generating responses based on user queries and the content of the web page.
- **Chrome APIs:** Including `activeTab`, `scripting`, and `storage` permissions to interact with the current web page and store API keys.

## Configuration
### Setting the API Key
To use the Gemini Web Chatbot, you need to provide a valid API key for the Google Generative AI. Follow these steps:

1. Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
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
2. Click the Gemini Chatbot icon.
3. Enter a query such as "What is this page about?".
4. The chatbot will analyze the content of the page and provide a relevant response.

## Troubleshooting
If you encounter issues with the Gemini Web Chatbot, try the following steps:

1. Ensure you have entered a valid API key.
2. Check that the extension has the necessary permissions enabled.
3. Reload the extension by going to `chrome://extensions/` and clicking the reload icon next to the Gemini Web Chatbot.

## Contributors
- **Your Name** - Initial development and documentation.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
