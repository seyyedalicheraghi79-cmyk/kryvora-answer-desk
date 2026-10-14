# Kryvora Answer Desk — Chrome Extension

A local Chrome/Edge extension that adds a quick panel to webpages, reads selected or visible text, and asks OpenAI Responses API to search the web and answer with sources.

## Install
1. Download ZIP: https://github.com/seyyedalicheraghi79-cmyk/kryvora-answer-desk/archive/refs/heads/main.zip
2. Extract the ZIP.
3. Open chrome://extensions in Chrome (or edge://extensions in Edge).
4. Turn on Developer mode.
5. Click Load unpacked and select the extension folder inside the extracted repository.
6. Open the extension popup and save your OpenAI API key.
7. Open the quiz page, click “✳ جواب سریع Kryvora”, then “خواندن صفحه” and “پیدا کردن جواب”.

Shortcut: Alt+Shift+K opens/closes the panel.

## Requirements and limitations
- Requires an OpenAI API key with API billing enabled. ChatGPT subscriptions do not automatically pay for API usage.
- Each answer uses web search and incurs API charges under current pricing.
- The key is stored in Chrome local extension storage and sent to OpenAI's API. Protect your browser profile.
- The extension can read text on pages where it runs. Install only if you accept this permission.
- Some cross-origin iframe/canvas quizzes cannot be read automatically; select/copy the question into the panel manually.
- It displays a suggested answer and sources. It does not click answers or submit quiz forms.
