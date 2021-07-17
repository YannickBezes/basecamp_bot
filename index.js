buttonBoost.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    let name = document.getElementById('inputName').value;
    let spanError = document.getElementById('span-error');

    if (name !== '' && name !== null) {
        if (!spanError.classList.contains('hidden')) {
            spanError.classList.add('hidden');
        }

        chrome.storage.sync.set({ name });

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['script.js']
        });
    } else {
        if (spanError.classList.contains('hidden')) {
            spanError.classList.remove('hidden');
        }
    }
});

options.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL('options/options.html'));
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const inputName = document.getElementById('inputName');
    chrome.storage.sync.get("name", ({ name }) => {
        if (typeof name !== 'undefined') {
            inputName.value = name;
        }
    });
});