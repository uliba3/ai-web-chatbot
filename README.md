# AI Web Chatbot Chrome Extension

A Chrome extension that enables users to interact with AI about the content of any web page they're currently viewing.

## Features

- **Contextual AI Chat**: Chat with AI about the content of any web page you're browsing
- **Seamless Integration**: Works across all websites with a simple and intuitive interface
- **Modern UI**: Clean and user-friendly design

## Installation

1. Clone this repository:
```bash
git clone https://github.com/uliba3/ai-web-chatbot.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the cloned repository directory

## Usage

1. Click the extension icon in your Chrome toolbar to open the chat interface
2. The AI will automatically analyze the current webpage's content
3. Start chatting with the AI about the webpage's content

## Project Structure

- `manifest.json`: Extension configuration and permissions
- `content.js`: Main content script that handles webpage interaction
- `background.js`: Background service worker for extension functionality
- `api.js`: Handles API communication
- `utils.js`: Utility functions
- `constants.js`: Project constants and configurations
- `styles.css`: Styling for the extension interface
- `generative-ai.js`: AI model implementation
- `icon.png`: Extension icon

## Development

### Prerequisites

- Chrome browser
- Basic knowledge of JavaScript and Chrome extension development

### Building

1. Make your changes to the source files
2. Test the extension by loading it unpacked in Chrome
3. Once satisfied, package the extension for distribution

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have suggestions for improvements, please open an issue in the GitHub repository.
