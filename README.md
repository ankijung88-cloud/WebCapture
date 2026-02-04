# Web Guide Capture

A powerful Chrome Extension that helps you create step-by-step guides by capturing your web interactions. Similar to ScribeHow, it automatically records your clicks and navigation to generate visual documentation.

## Features

- **Automatic Interaction Recording**: Captures clicks, inputs, and navigation events automatically.
- **Glassmorphism UI**: Modern and beautiful user interface.
- **Step-by-Step Guides**: Generates clear, visual guides from your recorded actions.
- **Privacy Focused**: Runs entirely locally in your browser.

## Installation

1. **Clone the repository** or download the source code.
   ```bash
   git clone https://github.com/ankijung88-cloud/WebCapture.git
   ```

2. **Open Chrome Extensions Management**
   - Open Google Chrome.
   - Navigate to `chrome://extensions/` in the address bar.

3. **Enable Developer Mode**
   - Toggle the **Developer mode** switch in the top-right corner of the page.

4. **Load the Extension**
   - Click the **Load unpacked** button that appears.
   - Select the root directory of this project (the folder containing `manifest.json`).

## Usage

1. **Start Recording**
   - Click the **Web Guide Capture** extension icon in your Chrome toolbar.
   - Click the **Start Recording** button in the popup.

2. **Perform Actions**
   - Navigate through the website and perform the actions you want to document.
   - The extension will automatically highlight elements and record your interactions.

3. **Finish & Export**
   - Open the extension popup again and click **Stop Recording**.
   - A new tab will open displaying your generated step-by-step guide.
   - You can review and save your guide from this view.

## Technologies Used

- **Manifest V3**: Using the latest Chrome Extension API standards.
- **JavaScript (ES6+)**: Core logic for recording and guide generation.
- **HTML5 & CSS3**: Custom Glassmorphism design.

## License

[MIT](LICENSE)
